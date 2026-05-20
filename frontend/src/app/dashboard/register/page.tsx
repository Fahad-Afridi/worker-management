'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/axios';

export default function RegisterWorkerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', country: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'admin') { router.replace('/worker'); return; }
  }, [isLoading, user]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    setLoading(true);
    try {
      await api.post('/worker', formData);
      setMessage('Worker registered! A welcome email has been sent.');
      setFormData({ name: '', email: '', password: '', country: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  if (isLoading || !user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Worker</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Password', name: 'password', type: 'password' },
              { label: 'Country', name: 'country', type: 'text' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input name={f.name} type={f.type}
                  value={(formData as any)[f.name]}
                  onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                  required minLength={f.name === 'password' ? 6 : undefined}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Registering...' : 'Register Worker'}
            </button>
            <button type="button" onClick={() => router.push('/dashboard/workers')}
              className="w-full text-center text-sm text-blue-600 hover:underline">
              View All Workers
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}