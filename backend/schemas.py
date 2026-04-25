from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime, date, time
from models import AttendanceStatus, UserRole

# Teacher Schemas
class TeacherBase(BaseModel):
    name: str
    employee_id: str
    email: EmailStr

class TeacherCreate(TeacherBase):
    password: str

class TeacherLogin(BaseModel):
    email: EmailStr
    password: str

class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class TeacherResponse(TeacherBase):
    id: UUID
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Student Schemas
class StudentBase(BaseModel):
    name: str
    roll_no: str
    class_name: str
    section: str
    parent_contact: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    roll_no: Optional[str] = None
    class_name: Optional[str] = None
    section: Optional[str] = None
    parent_contact: Optional[str] = None

class StudentResponse(StudentBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceBase(BaseModel):
    student_id: UUID
    subject: str
    date: date
    status: AttendanceStatus = AttendanceStatus.PRESENT

class AttendanceCreate(AttendanceBase):
    teacher_id: UUID
    time: time
    confidence: Optional[float] = None
    image_path: Optional[str] = None

class AttendanceUpdate(BaseModel):
    status: AttendanceStatus
    is_manual: bool = True

class AttendanceResponse(AttendanceBase):
    id: UUID
    teacher_id: UUID
    time: time
    confidence: Optional[float]
    is_manual: bool
    student: StudentResponse

    class Config:
        from_attributes = True

# AI Processing Schemas
class AttendanceMarkRequest(BaseModel):
    class_name: str
    section: str
    subject: str

class RecognitionResult(BaseModel):
    student_id: Optional[UUID]
    name: str
    confidence: float
    box: List[int] # [x, y, w, h]
    is_recognized: bool

class AttendanceBulkResponse(BaseModel):
    date: date
    subject: str
    class_name: str
    section: str
    total_detected: int
    recognized_count: int
    new_attendance_marked: int
    results: List[RecognitionResult]

# Dashboard Schemas
class DailyStats(BaseModel):
    date: date
    present: int
    absent: int

class DashboardStats(BaseModel):
    total_teachers: int
    total_students: int
    today_attendance_percentage: float
    monthly_stats: List[DailyStats]

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
