"use client";

import React, { useState, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Scan,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function AttendancePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    class_name: '',
    section: '',
    subject: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.class_name || !formData.section || !formData.subject) return;

    setIsProcessing(true);
    const data = new FormData();
    data.append('classroom_photo', file);
    data.append('class_name', formData.class_name);
    data.append('section', formData.section);
    data.append('subject', formData.subject);

    try {
      const response = await api.post('/attendance/mark', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground mt-2">Upload a classroom photo to automatically detect and mark students.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-6 rounded-2xl border">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Scan size={18} className="text-primary" />
                Class Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Class</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10th"
                    className="w-full mt-1 px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.class_name}
                    onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Section</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A"
                    className="w-full mt-1 px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mathematics"
                    className="w-full mt-1 px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!file || isProcessing}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 disabled:bg-primary/50 disabled:shadow-none transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Start Recognition
                    </>
                  )}
                </button>
              </form>
            </div>

            {result && (
              <div className="glass p-6 rounded-2xl border animate-in">
                <h2 className="font-bold mb-4">Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-blue-500/10 rounded-lg">
                    <span className="text-sm font-medium">Total Detected</span>
                    <span className="font-bold">{result.total_detected}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-emerald-500/10 rounded-lg">
                    <span className="text-sm font-medium">Recognized</span>
                    <span className="font-bold">{result.recognized_count}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-violet-500/10 rounded-lg">
                    <span className="text-sm font-medium">New Attendance</span>
                    <span className="font-bold text-violet-600">{result.new_attendance_marked}</span>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className="w-full mt-6 py-3 border border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw size={16} />
                  Process Another
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            {!preview ? (
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="h-[500px] border-2 border-dashed border-primary/20 rounded-3xl bg-muted/30 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-all group"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
                  <Camera size={32} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">Upload Classroom Photo</p>
                  <p className="text-muted-foreground mt-1">Drag & drop or click to select image</p>
                </div>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl h-[500px] bg-black">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className={cn(
                    "w-full h-full object-contain transition-all duration-500",
                    isProcessing && "opacity-50 blur-[2px]"
                  )}
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="scan-line" />
                    <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 text-white border border-white/20">
                      <Loader2 className="animate-spin" size={20} />
                      <span className="font-bold tracking-widest uppercase text-xs">AI Processing Faces...</span>
                    </div>
                  </div>
                )}

                {!isProcessing && !result && (
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                  >
                    <X size={20} />
                  </button>
                )}

                {result && (
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* In a real app, we would map the result.results to draw bounding boxes */}
                    {result.results.map((res: any, idx: number) => (
                      <div 
                        key={idx}
                        className={cn(
                          "absolute border-2 rounded-lg transition-all duration-500 animate-in",
                          res.is_recognized ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "border-rose-500 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        )}
                        style={{
                          left: `${(res.box[0] / 1000) * 100}%`, // Simplified scaling logic
                          top: `${(res.box[1] / 1000) * 100}%`,
                          width: `${(res.box[2] / 1000) * 100}%`,
                          height: `${(res.box[3] / 1000) * 100}%`,
                        }}
                      >
                        <span className={cn(
                          "absolute -top-6 left-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap",
                          res.is_recognized ? "bg-emerald-500" : "bg-rose-500"
                        )}>
                          {res.is_recognized ? res.name : "Unknown"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {result && (
              <div className="mt-8 glass rounded-2xl border overflow-hidden animate-in">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Confidence</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {result.results.map((res: any, idx: number) => (
                      <tr key={idx} className="hover:bg-accent/50 transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                              res.is_recognized ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                            )}>
                              {res.name.charAt(0)}
                            </div>
                            <span className="font-medium">{res.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all duration-1000",
                                  res.confidence > 0.8 ? "bg-emerald-500" : res.confidence > 0.6 ? "bg-amber-500" : "bg-rose-500"
                                )}
                                style={{ width: `${res.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold">{(res.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {res.is_recognized ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                              <CheckCircle2 size={12} />
                              Marked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                              <AlertCircle size={12} />
                              Unregistered
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
