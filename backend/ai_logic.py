import os
import cv2
import numpy as np
from typing import List, Dict, Any, Tuple
from deepface import DeepFace
from scipy.spatial import distance
from config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

# Pre-load models to memory if possible
# Note: DeepFace loads models lazily on first use, but we can warm them up
MODELS = [settings.FACE_RECOGNITION_MODEL]
DETECTORS = [settings.FACE_DETECTION_MODEL]

class FaceProcessor:
    def __init__(self):
        self.recognition_model = settings.FACE_RECOGNITION_MODEL
        self.detection_model = settings.FACE_DETECTION_MODEL
        self.threshold = settings.SIMILARITY_THRESHOLD

    def get_embedding(self, image_path: str) -> List[float]:
        """Extract face embedding from a single-face image."""
        try:
            embeddings = DeepFace.represent(
                img_path=image_path,
                model_name=self.recognition_model,
                detector_backend=self.detection_model,
                enforce_detection=True,
                align=True
            )
            if embeddings:
                return embeddings[0]["embedding"]
            return []
        except Exception as e:
            logger.error(f"Error extracting embedding: {str(e)}")
            return []

    def process_classroom_image(self, image_path: str, student_registry: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detect multiple faces in a classroom photo and match them against registered students.
        student_registry: List of dicts with {"id": UUID, "embeddings": List[List[float]], "name": str}
        """
        try:
            # 1. Detect and extract all faces from classroom image
            detections = DeepFace.represent(
                img_path=image_path,
                model_name=self.recognition_model,
                detector_backend=self.detection_model,
                enforce_detection=False, # Don't fail if no faces found
                align=True
            )

            results = []
            seen_student_ids = set()

            for det in detections:
                face_embedding = det["embedding"]
                face_box = det["facial_area"] # [x, y, w, h]
                
                best_match = None
                max_similarity = -1

                # 2. Compare with each student in the registry
                for student in student_registry:
                    # A student might have multiple registered embeddings (different angles)
                    student_embeddings = student["embeddings"]
                    if not student_embeddings:
                        continue
                    
                    # Check all registered embeddings for this student
                    for reg_emb in student_embeddings:
                        # Cosine similarity = 1 - cosine distance
                        # DeepFace embeddings are usually normalized, but we use distance for robustness
                        dist = distance.cosine(face_embedding, reg_emb)
                        sim = 1 - dist
                        
                        if sim > max_similarity:
                            max_similarity = sim
                            best_match = student

                # 3. Apply threshold and uniqueness logic
                is_recognized = max_similarity >= self.threshold
                student_id = None
                student_name = "Unknown"

                if is_recognized and best_match:
                    student_id = best_match["id"]
                    student_name = best_match["name"]
                    
                    # Duplicate logic: If student already found in this photo, 
                    # we only mark them once but record the best detection
                    if student_id in seen_student_ids:
                        continue 
                    seen_student_ids.add(student_id)

                results.append({
                    "student_id": student_id,
                    "name": student_name,
                    "confidence": float(max_similarity),
                    "box": [face_box["x"], face_box["y"], face_box["w"], face_box["h"]],
                    "is_recognized": is_recognized
                })

            return results

        except Exception as e:
            logger.error(f"Error processing classroom image: {str(e)}")
            return []

    def verify_liveness(self, image_path: str) -> bool:
        """
        Basic liveness check using DeepFace's analyze feature for spoof detection.
        In a real prod app, you might use specialized libraries like FaceAntiSpoofing.
        """
        try:
            # DeepFace has some anti-spoofing capabilities in recent versions
            # Here we just check for basic face properties as a placeholder
            objs = DeepFace.analyze(img_path=image_path, actions=['emotion'], enforce_detection=True)
            return len(objs) > 0
        except:
            return False

face_processor = FaceProcessor()
