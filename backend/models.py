import uuid
from datetime import datetime, date, time
from sqlalchemy import (
    Column, String, Integer, Float, DateTime, Date, Time,
    Text, Boolean, ForeignKey, UniqueConstraint, JSON, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from database import Base
import enum


class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.TEACHER, nullable=False)
    face_embeddings = Column(JSON, nullable=True)  # List of embedding vectors
    face_images = Column(JSON, nullable=True)       # List of image paths
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    attendance_records = relationship("Attendance", back_populates="teacher")
    classes = relationship("ClassInfo", back_populates="teacher")


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    roll_no = Column(String(50), nullable=False, index=True)
    class_name = Column(String(20), nullable=False)
    section = Column(String(10), nullable=False)
    parent_contact = Column(String(15), nullable=True)
    face_embeddings = Column(JSON, nullable=True)   # List of embedding vectors
    face_images = Column(JSON, nullable=True)        # List of image paths
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Unique constraint for roll_no + class + section
    __table_args__ = (
        UniqueConstraint('roll_no', 'class_name', 'section', name='uq_student_class'),
    )

    # Relationships
    attendance_records = relationship("Attendance", back_populates="student")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    subject = Column(String(50), nullable=False)
    date = Column(Date, nullable=False, default=date.today)
    time = Column(Time, nullable=False, default=lambda: datetime.utcnow().time())
    status = Column(SAEnum(AttendanceStatus), default=AttendanceStatus.PRESENT, nullable=False)
    confidence = Column(Float, nullable=True)  # AI confidence score
    image_path = Column(String(500), nullable=True)  # Source classroom image
    is_manual = Column(Boolean, default=False)  # Was this manually corrected?
    created_at = Column(DateTime, default=datetime.utcnow)

    # Unique constraint: one attendance per student per subject per day
    __table_args__ = (
        UniqueConstraint('student_id', 'subject', 'date', name='uq_attendance_daily'),
    )

    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    teacher = relationship("Teacher", back_populates="attendance_records")


class ClassInfo(Base):
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_name = Column(String(20), nullable=False)
    section = Column(String(10), nullable=False)
    subject = Column(String(50), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=False)
    schedule = Column(JSON, nullable=True)  # Weekly schedule
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('class_name', 'section', 'subject', name='uq_class_subject'),
    )

    # Relationships
    teacher = relationship("Teacher", back_populates="classes")


class UnknownFace(Base):
    __tablename__ = "unknown_faces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_path = Column(String(500), nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow)
    classroom_image = Column(String(500), nullable=True)
    class_name = Column(String(20), nullable=True)
    section = Column(String(10), nullable=True)
    resolved = Column(Boolean, default=False)
