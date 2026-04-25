"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Calendar, 
  Search, 
  Download, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    class_name: '',
    subject: '',
    date: ''
  });

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/attendance/history', { params: filters });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Basic CSV export logic
    const headers = "Student,Roll No,Class,Subject,Date,Time,Status,Confidence\n";
    const csvContent = history.map(h => 
      `${h.student.name},${h.student.roll_no},${h.student.class_name},${h.subject},${h.date},${h.time},${h.status},${(h.confidence * 100).toFixed(1)}%`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
            <p className="text-muted-foreground mt-2">View, filter, and export your attendance records.</p>
          </div>
          <button 
            onClick={handleExport}
            className="bg-white text-foreground border px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-accent transition-all shadow-sm"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>

        <div className="glass p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Class</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="All Classes"
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-lg outline-none text-sm"
                value={filters.class_name}
                onChange={(e) => setFilters({...filters, class_name: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="All Subjects"
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-lg outline-none text-sm"
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-lg outline-none text-sm"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => setFilters({class_name: '', subject: '', date: ''})}
              className="w-full py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-bold transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Class</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">DateTime</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Confidence</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 size={32} className="animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-muted-foreground">Fetching records...</p>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-accent/50 transition-all">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold">{record.student.name}</p>
                        <p className="text-xs text-muted-foreground">Roll: {record.student.roll_no}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{record.student.class_name} - {record.student.section}</td>
                    <td className="px-6 py-4 text-sm">{record.subject}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Calendar size={12} className="text-muted-foreground" />
                          {record.date}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {record.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        record.confidence > 0.8 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {(record.confidence * 100).toFixed(1)}%
                      </div>
                      {record.is_manual && (
                        <span className="ml-2 text-[10px] font-bold text-violet-500 uppercase">Manual</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record.status === 'present' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                          <CheckCircle2 size={16} />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-600 font-bold text-sm">
                          <XCircle size={16} />
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
