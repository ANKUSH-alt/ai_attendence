-- AI Attendance System - SQL Schema

-- Teachers Table
CREATE TABLE teachers (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'teacher',
    face_embeddings JSONB, -- Stores array of embedding vectors
    face_images JSONB,     -- Stores array of file paths
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(50) NOT NULL,
    class_name VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    parent_contact VARCHAR(15),
    face_embeddings JSONB, -- Stores array of embedding vectors
    face_images JSONB,     -- Stores array of file paths
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_class UNIQUE (roll_no, class_name, section)
);

-- Classes Table
CREATE TABLE classes (
    id UUID PRIMARY KEY,
    class_name VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    teacher_id UUID REFERENCES teachers(id),
    schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_class_subject UNIQUE (class_name, section, subject)
);

-- Attendance Table
CREATE TABLE attendance (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    teacher_id UUID REFERENCES teachers(id),
    subject VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'present',
    confidence FLOAT,
    image_path VARCHAR(500),
    is_manual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_attendance_daily UNIQUE (student_id, subject, date)
);

-- Unknown Faces (For audit/manual registration)
CREATE TABLE unknown_faces (
    id UUID PRIMARY KEY,
    image_path VARCHAR(500) NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    classroom_image VARCHAR(500),
    class_name VARCHAR(20),
    section VARCHAR(10),
    resolved BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_teacher_email ON teachers(email);
CREATE INDEX idx_student_roll ON students(roll_no);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
