'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-blue-200 hover:text-white text-sm transition"
        >
          ← Back
        </button>
        <span className="font-bold text-lg">WorkerMS</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-blue-100 text-sm">
            {user.name} <span className="bg-blue-600 px-2 py-0.5 rounded text-xs capitalize">{user.role}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}