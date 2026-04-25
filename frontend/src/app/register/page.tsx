"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Camera, 
  Upload, 
  Check, 
  X,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employee_id: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert('Max 5 images allowed');
      return;
    }

    const newImages = [...images, ...files];
    const newPreviews = [...previews, ...files.map(f => URL.createObjectURL(f))];
    
    setImages(newImages);
    setPreviews(newPreviews);
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
      alert("Please allow camera access to take photos");
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
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setImages([...images, file]);
            setPreviews([...previews, URL.createObjectURL(blob)]);
          }
        }, 'image/jpeg');
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (images.length < 3) {
      alert('Please upload or take at least 3 photos for face registration');
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('employee_id', formData.employee_id);
    images.forEach(img => data.append('face_images', img));

    try {
      await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.href = '/login';
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050335392-9ae888147293?q=80&w=2070')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-900/80" />
        
        <div className="relative z-10 text-white max-w-lg">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Intelligent Attendance for Modern Institutions.
          </h1>
          <p className="text-xl text-blue-100/80 leading-relaxed mb-12">
            Experience the next generation of classroom management with AI-powered face recognition.
          </p>
          
          <div className="space-y-6">
            {[
              "99.8% Recognition Accuracy",
              "Instant Multi-face Detection",
              "Automated Analytics & Reporting"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check size={14} />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
            <p className="text-muted-foreground mt-2">Step {step} of 2: {step === 1 ? 'Personal Details' : 'Face Registration'}</p>
          </div>

          <div className="flex gap-2 mb-8">
            <div className={cn("h-1.5 flex-1 rounded-full transition-all", step >= 1 ? "bg-primary" : "bg-muted")} />
            <div className={cn("h-1.5 flex-1 rounded-full transition-all", step >= 2 ? "bg-primary" : "bg-muted")} />
          </div>

          {step === 1 ? (
            <div className="space-y-5 animate-in">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    name="name"
                    type="text" 
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Employee ID</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    name="employee_id"
                    type="text" 
                    placeholder="EMP12345"
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="john@school.edu"
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.email || !formData.password || !formData.employee_id}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:bg-primary/50 disabled:shadow-none transition-all mt-6 flex items-center justify-center gap-2"
              >
                Continue to Face Registration
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in">
              <div className="bg-card p-6 rounded-3xl border-2 border-dashed border-primary/20 text-center overflow-hidden">
                {!isCameraOpen ? (
                  <div className="animate-in">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                      <Camera size={32} />
                    </div>
                    <h3 className="font-bold">Register Your Face</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-6">Take 5 clear photos for optimal accuracy.</p>
                    
                    <div className="flex gap-4 justify-center mb-8">
                      <button 
                        onClick={startCamera}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                      >
                        <Camera size={18} />
                        Open Camera
                      </button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl font-bold transition-all"
                      >
                        <Upload size={18} />
                        Upload
                      </button>
                    </div>

                    {/* Teacher Tips Section */}
                    <div className="bg-primary/5 rounded-2xl p-4 text-left border border-primary/10">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Registration Tips</p>
                      <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc pl-4 font-medium">
                        <li>Capture from 5 different angles (Front, Left, Right, Up, Down).</li>
                        <li>Ensure your face is well-lit and clearly visible.</li>
                        <li>Avoid wearing hats or dark sunglasses.</li>
                        <li>The AI uses these to secure your account and enable face-login.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black mb-6 animate-in">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                      <button 
                        onClick={capturePhoto}
                        className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-200 active:scale-90 transition-all group"
                      >
                        <div className="w-10 h-10 bg-primary rounded-full group-hover:scale-95 transition-all" />
                      </button>
                      <button 
                        onClick={stopCamera}
                        className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-rose-200 active:scale-90 transition-all"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />

                <div className="grid grid-cols-5 gap-2 mb-2">
                  {previews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border shadow-sm">
                      <img src={url} alt="Face" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {[...Array(Math.max(0, 5 - previews.length))].map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground opacity-50">
                      <Circle size={12} />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  {previews.length}/5 Photos Captured
                </p>

                <input 
                  type="file" 
                  hidden 
                  multiple 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { stopCamera(); setStep(1); }}
                  className="flex-1 py-4 bg-muted text-foreground rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={images.length < 3 || isLoading}
                  className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:bg-primary/50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                  Complete Registration
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-muted-foreground mt-8">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
