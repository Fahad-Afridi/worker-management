'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/axios';

interface Worker {
  id: number;
  name: string;
  email: string;
  country: string;
  role: string;
  joiningDate: string;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'admin') { router.replace('/worker'); return; }
  }, [isLoading, user]);

  useEffect(() => {
    if (!isLoading && user?.role === 'admin') {
      api.get('/worker')
        .then(res => setWorkers(res.data))
        .catch(() => {})
        .finally(() => setLoadingWorkers(false));
    }
  }, [isLoading, user]);

  if (isLoading || !user) return null;
  if (user.role !== 'admin') return null;

  const cards = [
    { title: 'Register Worker', desc: 'Add a new worker to the system.', btn: 'Register', path: '/dashboard/register', color: 'bg-blue-600' },
    { title: 'Manage Workers', desc: 'View, search and manage all workers.', btn: 'View Workers', path: '/dashboard/workers', color: 'bg-indigo-600' },
    { title: 'Manage Tasks', desc: 'View and assign all tasks.', btn: 'View Tasks', path: '/dashboard/tasks', color: 'bg-violet-600' },
    { title: 'Reset Password', desc: 'Send a password reset link to a worker.', btn: 'Reset Password', path: '/forgot-password', color: 'bg-slate-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">

        <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back, {user.name}</p>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {cards.map((c) => (
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

        {/* Workers overview with IDs for task assignment */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Workers
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({workers.length} total)
              </span>
            </h2>
            <button onClick={() => router.push('/dashboard/workers')}
              className="text-sm text-blue-600 hover:underline">
              View all →
            </button>
          </div>

          {loadingWorkers && <p className="text-gray-500 text-sm">Loading workers...</p>}

          <div className="space-y-3">
            {workers.map(worker => (
              <div key={worker.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800">{worker.name}</p>
                    {/* ID badge — use this when assigning tasks */}
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                      #{worker.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{worker.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {worker.country} · Joined {new Date(worker.joiningDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/workers/${worker.id}`)}
                    className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/tasks?workerId=${worker.id}`)}
                    className="bg-violet-50 text-violet-700 text-sm px-3 py-1.5 rounded-lg hover:bg-violet-100 transition">
                    + Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}