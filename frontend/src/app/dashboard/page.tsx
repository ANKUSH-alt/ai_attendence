"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, summaryRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/summary')
        ]);
        setStats(statsRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-muted-foreground font-medium animate-pulse">Loading real-time analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { 
      name: 'Total Students', 
      value: stats?.total_students || 0, 
      icon: Users, 
      change: '+0%', 
      trend: 'up',
      color: 'bg-blue-500'
    },
    { 
      name: 'Today\'s Attendance', 
      value: `${stats?.today_attendance_percentage?.toFixed(1)}%`, 
      icon: UserCheck, 
      change: '+0%', 
      trend: 'up',
      color: 'bg-emerald-500'
    },
    { 
      name: 'Total Teachers', 
      value: stats?.total_teachers || 0, 
      icon: UserMinus, 
      change: '+0%', 
      trend: 'up',
      color: 'bg-rose-500'
    },
    { 
      name: 'Assigned Classes', 
      value: summary?.assigned_classes || 0, 
      icon: TrendingUp, 
      change: '+0%', 
      trend: 'up',
      color: 'bg-violet-500'
    },
  ];

  const chartData = {
    labels: stats?.monthly_stats?.map((s: any) => new Date(s.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })) || [],
    datasets: [
      {
        label: 'Present Students',
        data: stats?.monthly_stats?.map((s: any) => s.present) || [],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {summary?.teacher_name || 'Teacher'}. Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((item) => (
            <div key={item.name} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${item.color} bg-opacity-10 text-opacity-100`}>
                  <item.icon className="text-primary" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.change}
                  {item.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-wider">{item.name}</h3>
              <p className="text-3xl font-black mt-2 tracking-tight text-foreground">{item.value ?? 0}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-2xl border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Attendance Trends (Last 30 Days)</h2>
            </div>
            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border">
            <h2 className="text-xl font-bold mb-6">Daily Summary</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <UserCheck size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Classes Today</p>
                  <p className="text-xs text-muted-foreground mt-1">{summary?.assigned_classes || 0} Scheduled Classes</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Attendance Marked</p>
                  <p className="text-xs text-muted-foreground mt-1">{summary?.today_marked || 0} Records created today</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition-all">
              Refresh Statistics
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
