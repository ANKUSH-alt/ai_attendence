"use client";

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
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

const stats = [
  { 
    name: 'Total Students', 
    value: '1,284', 
    icon: Users, 
    change: '+12%', 
    trend: 'up',
    color: 'bg-blue-500'
  },
  { 
    name: 'Present Today', 
    value: '1,120', 
    icon: UserCheck, 
    change: '+5%', 
    trend: 'up',
    color: 'bg-emerald-500'
  },
  { 
    name: 'Absent Today', 
    value: '164', 
    icon: UserMinus, 
    change: '-2%', 
    trend: 'down',
    color: 'bg-rose-500'
  },
  { 
    name: 'Avg. Attendance', 
    value: '88.4%', 
    icon: TrendingUp, 
    change: '+1.2%', 
    trend: 'up',
    color: 'bg-violet-500'
  },
];

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: 'Attendance %',
      data: [85, 88, 92, 87, 90, 84],
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
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      min: 70,
      max: 100,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back, here's what's happening with your classes today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div key={item.name} className="glass p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${item.color} bg-opacity-10 text-opacity-100`}>
                  <item.icon className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {item.change}
                  {item.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
              </div>
              <h3 className="text-muted-foreground text-sm font-medium">{item.name}</h3>
              <p className="text-2xl font-bold mt-1 tracking-tight">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-2xl border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Attendance Trends</h2>
              <select className="bg-muted/50 border-none rounded-lg px-4 py-2 text-sm outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border">
            <h2 className="text-xl font-bold mb-6">Recent Activities</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <UserCheck size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Class 10A Attendance Marked</p>
                    <p className="text-xs text-muted-foreground mt-1">15 mins ago • Subject: Mathematics</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition-all">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
