'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WorkerProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'worker') { router.replace('/dashboard'); return; }
  }, [isLoading, user]);

  if (isLoading || !user || user.role !== 'worker') return null;

  const fields = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Country', value: user.country },
    { label: 'Role', value: user.role },
    { label: 'Worker ID', value: user.uniqueId },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-bold mb-6">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.label} className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-sm font-medium text-gray-500">{f.label}</span>
                <span className="text-sm text-gray-800 capitalize">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}