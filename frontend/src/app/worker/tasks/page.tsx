'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/axios';

interface Task { id: number; title: string; description: string; status: 'pending' | 'in-progress' | 'completed'; workerId: number; }

export default function WorkerTasksPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'worker') { router.replace('/dashboard'); return; }
  }, [isLoading, user]);

  useEffect(() => {
    if (!isLoading && user?.role === 'worker') {
      api.get(`/task/worker/${user.id}`)
        .then(res => setTasks(res.data))
        .catch(() => setError('No tasks found.'))
        .finally(() => setLoading(false));
    }
  }, [isLoading, user]);

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await api.patch(`/task/${taskId}`, { status });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: status as Task['status'] } : t));
    } catch { setError('Failed to update status.'); }
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  if (isLoading || !user || user.role !== 'worker') return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h1>
        <input type="text" placeholder="Search tasks..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading tasks...</p>}
        {!loading && filtered.length === 0 && <p className="text-gray-500">No tasks assigned yet.</p>}
        <div className="space-y-3">
          {filtered.map(task => (
            <div key={task.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ml-4 ${statusColor[task.status]}`}>
                  {task.status}
                </span>
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-gray-600 mr-2">Update Status:</label>
                <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}