"use client";

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit,
  GraduationCap,
  Loader2,
  X,
  Camera,
  Check,
  Upload,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    roll_no: '',
    class_name: '',
    section: '',
    parent_contact: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students/');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert('Max 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
    setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access to take student photos");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            if (images.length >= 5) {
              alert('Max 5 images allowed');
              return;
            }
            const file = new File([blob], `student_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImages([...images, file]);
            setPreviews([...previews, URL.createObjectURL(blob)]);
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('roll_no', formData.roll_no);
    data.append('class_name', formData.class_name);
    data.append('section', formData.section);
    data.append('parent_contact', formData.parent_contact);
    images.forEach(img => data.append('face_images', img));

    try {
      await api.post('/students/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      stopCamera();
      setIsModalOpen(false);
      fetchStudents();
      // Reset form
      setFormData({ name: '', roll_no: '', class_name: '', section: '', parent_contact: '' });
      setImages([]);
      setPreviews([]);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to register student');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_no.includes(search)
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
            <p className="text-muted-foreground mt-2">Manage your student database and their facial registrations.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-95"
          >
            <UserPlus size={20} />
            Add New Student
          </button>
        </div>

        <div className="bg-card p-4 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or roll number..." 
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="bg-muted/50 border-none rounded-lg px-4 py-2 text-sm outline-none font-bold">
            <option>All Classes</option>
            {Array.from(new Set(students.map(s => s.class_name))).map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Roll No</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Class/Section</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered At</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 size={32} className="animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-muted-foreground">Loading student records...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-accent/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.parent_contact || 'No contact'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">{student.roll_no}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent rounded-full text-xs font-bold">
                        <GraduationCap size={12} />
                        {student.class_name} - {student.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-2xl rounded-[32px] border shadow-2xl overflow-hidden animate-in my-8">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Register Student</h2>
              <button 
                onClick={() => { stopCamera(); setIsModalOpen(false); }} 
                className="p-2 hover:bg-muted rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    className="w-full px-4 py-3 bg-muted/50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Roll Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 101"
                    className="w-full px-4 py-3 bg-muted/50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.roll_no}
                    onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Class</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10th"
                    className="w-full px-4 py-3 bg-muted/50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.class_name}
                    onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Section</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A"
                    className="w-full px-4 py-3 bg-muted/50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold ml-1">Face Registration (Min 3 photos)</label>
                
                <div className="bg-muted/30 border-2 border-dashed border-primary/20 rounded-3xl p-6 text-center">
                  {!isCameraOpen ? (
                    <div className="animate-in">
                      <div className="flex flex-wrap gap-3 mb-6 justify-center">
                        {previews.map((url, i) => (
                          <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm relative group">
                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => {
                                const n = [...previews]; n.splice(i, 1); setPreviews(n);
                                const m = [...images]; m.splice(i, 1); setImages(m);
                              }}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {previews.length < 5 && (
                          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-muted flex items-center justify-center text-muted opacity-50">
                            <Circle size={12} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-4 justify-center">
                        <button 
                          type="button"
                          onClick={startCamera}
                          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                        >
                          <Camera size={18} />
                          Use Camera
                        </button>
                        <button 
                          type="button"
                          onClick={() => document.getElementById('student-faces')?.click()}
                          className="flex items-center gap-2 px-6 py-3 bg-white border rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                          <Upload size={18} />
                          Upload Files
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in">
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black mb-6 shadow-xl">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none" />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                          <button 
                            type="button"
                            onClick={capturePhoto}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-200 active:scale-90 transition-all group"
                          >
                            <div className="w-8 h-8 bg-primary rounded-full group-hover:scale-95 transition-all" />
                          </button>
                          <button 
                            type="button"
                            onClick={stopCamera}
                            className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-rose-200 active:scale-90 transition-all"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-primary animate-pulse uppercase tracking-widest">Capture {previews.length}/5 Photos</p>
                    </div>
                  )}
                  
                  <input 
                    id="student-faces"
                    type="file" 
                    hidden 
                    multiple 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {!isCameraOpen && <p className="text-xs text-muted-foreground mt-4">Upload or take clear portrait photos of the student</p>}
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => { stopCamera(); setIsModalOpen(false); }}
                  className="flex-1 py-4 bg-muted text-foreground rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading || images.length < 3}
                  className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:bg-primary/50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
