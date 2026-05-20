'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WorkerDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace('/login');
  }, [isLoading, user]);

  if (isLoading || !user) return null;
  if (user.role !== 'worker') return null;

  const cards = [
    { title: 'My Tasks', desc: 'View and update your assigned tasks.', btn: 'View Tasks', path: '/worker/tasks', color: 'bg-blue-600' },
    { title: 'My Profile', desc: 'View your personal details.', btn: 'View Profile', path: '/worker/profile', color: 'bg-indigo-600' },
    { title: 'Change Password', desc: 'Reset your account password.', btn: 'Reset Password', path: '/forgot-password', color: 'bg-slate-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Worker Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back, {user.name}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map(c => (
            <div key={c.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-1">{c.title}</h2>
              <p className="text-gray-500 text-sm mb-4">{c.desc}</p>
              <button onClick={() => router.push(c.path)}
                className={`${c.color} text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition`}>
                {c.btn}
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}