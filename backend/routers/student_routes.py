from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
import models, schemas, auth, ai_logic, database
import os
import uuid
import shutil
from typing import List
from config import get_settings

router = APIRouter(prefix="/students", tags=["Students"])
settings = get_settings()

@router.post("/register", response_model=schemas.StudentResponse)
async def register_student(
    name: str = Form(...),
    roll_no: str = Form(...),
    class_name: str = Form(...),
    section: str = Form(...),
    parent_contact: str = Form(None),
    face_images: List[UploadFile] = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.Teacher = Depends(auth.get_current_user)
):
    # Check if student exists in this class/section
    existing = db.query(models.Student).filter(
        models.Student.roll_no == roll_no,
        models.Student.class_name == class_name,
        models.Student.section == section
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Student with this roll number already exists in this class")

    student_id = uuid.uuid4()
    student_dir = os.path.join(settings.UPLOAD_DIR, "students", str(student_id))
    os.makedirs(student_dir, exist_ok=True)

    saved_images = []
    embeddings = []

    for img in face_images:
        file_path = os.path.join(student_dir, f"{uuid.uuid4()}_{img.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
        
        emb = ai_logic.face_processor.get_embedding(file_path)
        if emb:
            embeddings.append(emb)
            saved_images.append(file_path)
        else:
            os.remove(file_path)

    if not embeddings:
        raise HTTPException(status_code=400, detail="Could not detect face in any of the uploaded student images")

    new_student = models.Student(
        id=student_id,
        name=name,
        roll_no=roll_no,
        class_name=class_name,
        section=section,
        parent_contact=parent_contact,
        face_embeddings=embeddings,
        face_images=saved_images
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

@router.get("/", response_model=List[schemas.StudentResponse])
async def list_students(
    class_name: str = None,
    section: str = None,
    db: Session = Depends(database.get_db),
    current_user: models.Teacher = Depends(auth.get_current_user)
):
    query = db.query(models.Student)
    if class_name:
        query = query.filter(models.Student.class_name == class_name)
    if section:
        query = query.filter(models.Student.section == section)
    return query.all()
