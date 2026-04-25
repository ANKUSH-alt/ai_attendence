"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Camera, 
  History, 
  Settings, 
  LogOut,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mark Attendance', href: '/attendance', icon: Camera },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 h-screen glass border-r sticky top-0 flex flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Attend</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
