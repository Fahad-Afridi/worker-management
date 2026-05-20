'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/axios';

interface Worker {
  id: number;
  uniqueId: string;
  name: string;
  email: string;
  country: string;
  role: string;
  joiningDate: string;
}

export default function WorkerDetailPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [country, setCountry] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'admin') { router.replace('/worker'); return; }
  }, [isLoading, user]);

  useEffect(() => {
    if (!isLoading && user?.role === 'admin' && id) {
      api.get(`/worker/${id}`)
        .then(res => { setWorker(res.data); setCountry(res.data.country); })
        .catch(() => setError('Worker not found.'))
        .finally(() => setLoading(false));
    }
  }, [isLoading, user, id]);

  const handleUpdateCountry = async () => {
    try {
      await api.patch(`/worker/${id}/country`, { country });
      setUpdateMsg('Country updated successfully.');
    } catch { setError('Failed to update.'); }
  };

  if (isLoading || !user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {worker && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{worker.name}</h1>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded capitalize">
                  {worker.role}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-center">
                <p className="text-xs text-gray-500">Worker ID</p>
                <p className="text-lg font-bold text-gray-800">#{worker.id}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700">Email</span>
                <span>{worker.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700">Country</span>
                <span>{worker.country}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700">Unique ID</span>
                <span className="text-xs text-gray-400">{worker.uniqueId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700">Joined</span>
                <span>{new Date(worker.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-8 border-t pt-6">
              <h2 className="font-semibold text-gray-800 mb-3">Update Country</h2>
              <div className="flex gap-3">
                <input value={country} onChange={e => setCountry(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleUpdateCountry}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
                  Update
                </button>
              </div>
              {updateMsg && <p className="text-green-600 text-sm mt-2">{updateMsg}</p>}
            </div>
            <div className="mt-6 flex gap-3">

              <button
                onClick={() => router.push(`/dashboard/tasks?workerId=${worker.id}`)}
                className="flex-1 bg-violet-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 transition">
                + Assign Task
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}