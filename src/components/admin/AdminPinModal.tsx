'use client';

import { useState } from 'react';

interface AdminPinModalProps {
  onSuccess: () => void;
}

export default function AdminPinModal({ onSuccess }: AdminPinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const res = await fetch('/api/admin/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      sessionStorage.setItem('admin_auth', 'true');
      sessionStorage.setItem('admin_pin', pin);
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-center mb-2 text-slate-800">ניהול מערכת</h1>
        <p className="text-gray-500 text-sm text-center mb-6">יש להזין סיסמת מנהל</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-2xl text-center tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••"
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
          />
          {error && (
            <p className="text-red-600 text-sm text-center">סיסמה שגויה</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
