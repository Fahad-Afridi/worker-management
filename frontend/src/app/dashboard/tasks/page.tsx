'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/axios';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  workerId: number;
}

function TasksContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerIdFilter = searchParams.get('workerId');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    workerId: workerIdFilter || '',
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role !== 'admin') { router.replace('/worker'); return; }
  }, [isLoading, user]);

  useEffect(() => {
    if (isLoading || !user || user.role !== 'admin') return;
    setLoading(true);
    setError('');

    if (workerIdFilter) {
      api.get(`/task/worker/${workerIdFilter}`)
        .then(res => setTasks(res.data))
        .catch(() => { setTasks([]); })
        .finally(() => setLoading(false));
    } else {
      // fetch all workers then all their tasks
      api.get('/worker')
        .then(async res => {
          const workers = res.data;
          const allTasks: Task[] = [];
          for (const worker of workers) {
            try {
              const taskRes = await api.get(`/task/worker/${worker.id}`);
              allTasks.push(...taskRes.data);
            } catch {
              // worker has no tasks, skip
            }
          }
          setTasks(allTasks);
        })
        .catch(() => setError('Failed to load tasks.'))
        .finally(() => setLoading(false));
    }
  }, [isLoading, user, workerIdFilter]);

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/task', {
        title: newTask.title,
        description: newTask.description,
        workerId: parseInt(newTask.workerId),
      });
      setTasks([...tasks, res.data]);
      setShowForm(false);
      setNewTask({ title: '', description: '', workerId: workerIdFilter || '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task. Check worker ID.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/task/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch { setError('Failed to delete.'); }
  };

  const handleStatusChange = async (taskId: number, status: string) => {
    try {
      await api.patch(`/task/${taskId}`, { status });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    } catch { setError('Failed to update status.'); }
  };

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  if (isLoading || !user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {workerIdFilter ? `Tasks for Worker #${workerIdFilter}` : 'All Tasks'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {workerIdFilter
                ? <button onClick={() => router.push('/dashboard/tasks')}
                    className="text-blue-600 hover:underline">← View all tasks</button>
                : `${tasks.length} total tasks`}
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition">
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Create New Task</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={newTask.title} required
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input value={newTask.description} required
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Worker ID <span className="text-gray-400 font-normal">(use # ID from worker profile)</span>
              </label>
              <input value={newTask.workerId} required type="number"
                onChange={e => setNewTask({ ...newTask, workerId: e.target.value })}
                placeholder="e.g. 6"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
              Create Task
            </button>
          </form>
        )}

        <input type="text" placeholder="Search tasks by title..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        {error && !showForm && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading tasks...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-gray-500">No tasks found. Create one using the button above.</p>
        )}

        <div className="space-y-3">
          {filtered.map(task => (
            <div key={task.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">{task.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColor[task.status] || 'bg-gray-100 text-gray-600'}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{task.description}</p>
                <p className="text-xs text-gray-400">Worker #{task.workerId}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <select value={task.status}
                  onChange={e => handleStatusChange(task.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={() => handleDelete(task.id)}
                  className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <TasksContent />
    </Suspense>
  );
}