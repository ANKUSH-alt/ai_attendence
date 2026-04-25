from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
import models, schemas, auth, database
from typing import List

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=schemas.DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(database.get_db),
    current_user: models.Teacher = Depends(auth.get_current_user)
):
    # Total counts
    total_teachers = db.query(models.Teacher).count()
    total_students = db.query(models.Student).count()
    
    # Today's attendance percentage
    today = date.today()
    students_present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == models.AttendanceStatus.PRESENT
    ).distinct(models.Attendance.student_id).count()
    
    today_percentage = (students_present_today / total_students * 100) if total_students > 0 else 0
    
    # Last 30 days stats
    monthly_stats = []
    for i in range(29, -1, -1):
        d = today - timedelta(days=i)
        present = db.query(models.Attendance).filter(
            models.Attendance.date == d,
            models.Attendance.status == models.AttendanceStatus.PRESENT
        ).distinct(models.Attendance.student_id).count()
        
        absent = total_students - present
        monthly_stats.append(schemas.DailyStats(date=d, present=present, absent=absent))

    return schemas.DashboardStats(
        total_teachers=total_teachers,
        total_students=total_students,
        today_attendance_percentage=today_percentage,
        monthly_stats=monthly_stats
    )

@router.get("/summary", tags=["Teacher Dashboard"])
async def get_teacher_summary(
    db: Session = Depends(database.get_db),
    current_user: models.Teacher = Depends(auth.get_current_user)
):
    # Classes assigned to this teacher
    classes = db.query(models.ClassInfo).filter(models.ClassInfo.teacher_id == current_user.id).all()
    
    # Today's attendance marked by this teacher
    today = date.today()
    marked_count = db.query(models.Attendance).filter(
        models.Attendance.teacher_id == current_user.id,
        models.Attendance.date == today
    ).count()

    return {
        "teacher_name": current_user.name,
        "assigned_classes": len(classes),
        "today_marked": marked_count
    }
