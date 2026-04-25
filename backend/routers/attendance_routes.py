from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import date, datetime
import models, schemas, auth, ai_logic, database
import os
import uuid
import shutil
from typing import List
from config import get_settings

router = APIRouter(prefix="/attendance", tags=["Attendance"])
settings = get_settings()

@router.post("/mark", response_model=schemas.AttendanceBulkResponse)
async def mark_attendance(
    class_name: str = Form(...),
    section: str = Form(...),
    subject: str = Form(...),
    classroom_photo: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.Teacher = Depends(auth.get_current_user)
):
    # 1. Save classroom photo
    attendance_id = uuid.uuid4()
    photo_dir = os.path.join(settings.UPLOAD_DIR, "attendance", str(date.today()))
    os.makedirs(photo_dir, exist_ok=True)
    
    photo_path = os.path.join(photo_dir, f"{attendance_id}_{classroom_photo.filename}")
    with open(photo_path, "wb") as buffer:
        shutil.copyfileobj(classroom_photo.file, buffer)

    # 2. Get registered students for this class/section
    students = db.query(models.Student).filter(
        models.Student.class_name == class_name,
        models.Student.section == section
    ).all()
    
    student_registry = [
        {
            "id": s.id,
            "embeddings": s.face_embeddings,
            "name": s.name
        } for s in students
    ]

    # 3. Process classroom photo using AI
    results = ai_logic.face_processor.process_classroom_image(photo_path, student_registry)

    # 4. Mark attendance for recognized students
    marked_count = 0
    recognition_summaries = []
    
    current_date = date.today()
    current_time = datetime.now().time()

    for res in results:
        summary = schemas.RecognitionResult(
            student_id=res["student_id"],
            name=res["name"],
            confidence=res["confidence"],
            box=res["box"],
            is_recognized=res["is_recognized"]
        )
        recognition_summaries.append(summary)

        if res["is_recognized"] and res["student_id"]:
            # Prevent duplicate attendance for same student/subject/date
            existing = db.query(models.Attendance).filter(
                models.Attendance.student_id == res["student_id"],
                models.Attendance.subject == subject,
                models.Attendance.date == current_date
            ).first()

            if not existing:
                new_attendance = models.Attendance(
                    student_id=res["student_id"],
                    teacher_id=current_user.id,
                    subject=subject,
                    date=current_date,
                    time=current_time,
                    status=models.AttendanceStatus.PRESENT,
                    confidence=res["confidence"],
                    image_path=photo_path
                )
                db.add(new_attendance)
                marked_count += 1
            
        elif not res["is_recognized"]:
            # Log unknown face
            # In a real app, we might crop the face and save it
            unknown = models.UnknownFace(
                image_path=photo_path,
                classroom_image=photo_path,
                class_name=class_name,
                section=section
            )
            db.add(unknown)

    db.commit()

    return schemas.AttendanceBulkResponse(
        date=current_date,
        subject=subject,
        class_name=class_name,
        section=section,
        total_detected=len(results),
        recognized_count=len([r for r in results if r["is_recognized"]]),
        new_attendance_marked=marked_count,
        results=recognition_summaries
    )

@router.get("/history", response_model=List[schemas.AttendanceResponse])
async def get_history(
    class_name: str = None,
    subject: str = None,
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(database.get_db),
    current_user: models.Teacher = Depends(auth.get_current_user)
):
    query = db.query(models.Attendance).join(models.Student)
    
    if class_name:
        query = query.filter(models.Student.class_name == class_name)
    if subject:
        query = query.filter(models.Attendance.subject == subject)
    if start_date:
        query = query.filter(models.Attendance.date >= start_date)
    if end_date:
        query = query.filter(models.Attendance.date <= end_date)
    
    # Filter by teacher unless admin
    if current_user.role != models.UserRole.ADMIN:
        query = query.filter(models.Attendance.teacher_id == current_user.id)
        
    return query.all()

@router.patch("/{attendance_id}", response_model=schemas.AttendanceResponse)
async def update_attendance(
    attendance_id: uuid.UUID,
    update_data: schemas.AttendanceUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.Teacher = Depends(auth.get_current_user)
):
    attendance = db.query(models.Attendance).filter(models.Attendance.id == attendance_id).first()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    attendance.status = update_data.status
    attendance.is_manual = True
    db.commit()
    db.refresh(attendance)
    return attendance
