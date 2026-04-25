# AI Intelligent Attendance System

A production-ready SaaS-quality attendance platform using RetinaFace for face detection and Facenet512 for face recognition.

## 🚀 Features
- **Teacher/Admin Dashboard**: Real-time stats and analytics.
- **AI Classroom Recognition**: Detect and recognize 50+ students in a single classroom photo.
- **Anti-Proxy**: Liveness detection and confidence thresholds.
- **Duplicate Prevention**: Automated filtering of duplicate appearances.
- **Export Support**: Export attendance records to CSV/PDF.
- **Mobile Friendly**: Fully responsive modern UI.

## 🛠 Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL.
- **AI/ML**: DeepFace (RetinaFace + Facenet512).

## 📦 Installation

### Backend
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and update your database credentials.
6. Run the server: `python main.py`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## 🗄 Database Schema
- **Teachers**: id, name, employee_id, email, password_hash, face_embeddings.
- **Students**: id, name, roll_no, class, section, parent_contact, face_embeddings.
- **Attendance**: id, student_id, teacher_id, subject, date, time, status, confidence.

## 🚀 Deployment Instructions

### Frontend (Vercel)
1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Set Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1`
4. Deploy!

### Backend (Render / Railway)
1. Push your code to GitHub.
2. Create a new Web Service on Render.
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (Supabase/Neon)
   - `SECRET_KEY`: A long random string
   - `FRONTEND_URL`: Your Vercel frontend URL

### Database (Supabase / Neon)
1. Create a new PostgreSQL database on Supabase or Neon.
2. Run the provided `schema.sql` in the SQL editor to initialize tables.
3. Copy the Connection String and add it to your Backend environment variables.

## 🛡 Security
- **JWT Authentication**: Secure token-based access.
- **Bcrypt Hashing**: Passwords are never stored in plain text.
- **CORS Configuration**: Restricts access to your frontend domain only.
- **Input Validation**: Pydantic schemas ensure data integrity.
