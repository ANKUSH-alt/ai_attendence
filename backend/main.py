from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import uvicorn
from database import init_db
from config import get_settings
from routers import auth_routes, student_routes, attendance_routes, dashboard_routes

settings = get_settings()

app = FastAPI(
    title="AI Intelligent Attendance System",
    description="SaaS-quality attendance system using RetinaFace and Facenet",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploaded images
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_routes.router, prefix="/api/v1")
app.include_router(student_routes.router, prefix="/api/v1")
app.include_router(attendance_routes.router, prefix="/api/v1")
app.include_router(dashboard_routes.router, prefix="/api/v1")

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
async def root():
    return {"message": "AI Attendance System API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.APP_PORT, reload=True)
