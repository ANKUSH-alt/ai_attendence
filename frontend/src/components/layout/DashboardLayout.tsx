"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, User, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b glass sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search records, students..." 
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:bg-accent rounded-full transition-all">
              <Bell size={20} />
            </button>
            <div className="h-8 w-[1px] bg-border mx-2" />
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-semibold leading-none">{user?.name || "Loading..."}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {user?.employee_id || "..."}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 overflow-hidden">
                {user ? (
                  <span className="font-bold">{user.name.charAt(0)}</span>
                ) : (
                  <Loader2 className="animate-spin" size={16} />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 animate-in">
          {children}
        </div>
      </main>
    </div>
  );
}
