'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === 'admin') router.replace('/dashboard');
    else if (user?.role === 'worker') router.replace('/worker');
  }, [isLoading, user]);

  if (isLoading) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Worker Management System</h1>
        <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8">
          A complete solution for managing your workforce and tasks efficiently.
        </p>
        <button onClick={() => router.push('/login')}
          className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition">
          Get Started →
        </button>
      </section>
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">What You Can Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: 'Manage Workers', desc: 'Register, update and manage worker accounts.' },
            { title: 'Assign Tasks', desc: 'Create and assign tasks to workers easily.' },
            { title: 'Track Progress', desc: 'Workers update task status in real time.' },
            { title: 'Secure Access', desc: 'Role-based access for admins and workers.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-blue-50 py-12 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Ready to get started?</h2>
        <p className="text-gray-500 mb-6">Login to access your dashboard</p>
        <button onClick={() => router.push('/login')}
          className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
          Login Now →
        </button>
      </section>
    </main>
  );
}