'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/axios';

interface Worker {
  id: number; uniqueId: string; name: string;
  email: string; country: string; role: string; joiningDate: string;
}

export default function WorkersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'admin') { router.replace('/worker'); return; }
  }, [isLoading, user]);

  useEffect(() => {
    if (!isLoading && user?.role === 'admin') {
      api.get('/worker')
        .then(res => setWorkers(res.data))
        .catch(() => setError('Failed to load workers.'))
        .finally(() => setLoading(false));
    }
  }, [isLoading, user]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this worker?')) return;
    try {
      await api.delete(`/worker/${id}`);
      setWorkers(workers.filter(w => w.id !== id));
    } catch { setError('Failed to delete.'); }
  };

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || !user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Workers</h1>
          <button onClick={() => router.push('/dashboard/register')}
            className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition">
            + Register Worker
          </button>
        </div>
        <input type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading workers...</p>}
        <div className="space-y-3">
          {filtered.map(worker => (
            <div key={worker.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{worker.name}</p>
                <p className="text-sm text-gray-500">{worker.email}</p>
                <p className="text-sm text-gray-500">{worker.country} · Joined {new Date(worker.joiningDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push(`/dashboard/workers/${worker.id}`)}
                  className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition">
                  View
                </button>
                <button onClick={() => handleDelete(worker.id)}
                  className="bg-red-50 text-red-600 text-sm px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && <p className="text-gray-500">No workers found.</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}