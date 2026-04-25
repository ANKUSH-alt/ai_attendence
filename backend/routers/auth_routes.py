from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import models, schemas, auth, ai_logic, database
import os
import uuid
import shutil
from config import get_settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()

@router.post("/register", response_model=schemas.TeacherResponse)
async def register_teacher(
    name: str,
    employee_id: str,
    email: str,
    password: str,
    face_images: list[UploadFile] = File(...),
    db: Session = Depends(database.get_db)
):
    # Check if user exists
    db_user = db.query(models.Teacher).filter(models.Teacher.email == email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = db.query(models.Teacher).filter(models.Teacher.employee_id == employee_id).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Employee ID already registered")

    # Create folder for teacher faces
    teacher_id = uuid.uuid4()
    teacher_dir = os.path.join(settings.UPLOAD_DIR, "teachers", str(teacher_id))
    os.makedirs(teacher_dir, exist_ok=True)

    saved_images = []
    embeddings = []

    for img in face_images:
        file_path = os.path.join(teacher_dir, f"{uuid.uuid4()}_{img.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)
        
        # Extract embedding
        emb = ai_logic.face_processor.get_embedding(file_path)
        if emb:
            embeddings.append(emb)
            saved_images.append(file_path)
        else:
            # Cleanup if face detection fails on a registration photo
            os.remove(file_path)

    if not embeddings:
        raise HTTPException(status_code=400, detail="Could not detect face in any of the uploaded images")

    # Create teacher
    new_teacher = models.Teacher(
        id=teacher_id,
        name=name,
        employee_id=employee_id,
        email=email,
        password_hash=auth.get_password_hash(password),
        face_embeddings=embeddings,
        face_images=saved_images
    )
    
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher

@router.post("/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.Teacher).filter(models.Teacher.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.TeacherResponse)
async def read_users_me(current_user: models.Teacher = Depends(auth.get_current_user)):
    return current_user
