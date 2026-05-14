import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { BrandMark } from '../components/icons';

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err: any) {
      setError('Λάθος email ή κωδικός');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-beige)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-[var(--color-brand-brown)]/10">
          <div className="flex flex-col items-center mb-8">
            <BrandMark className="w-16 h-16 mb-4 text-[var(--color-brand-brown)]" />
            <h1 className="font-serif italic text-3xl text-[var(--color-brand-brown)]">Admin Login</h1>
            <p className="text-sm opacity-60 mt-2">Lithos Guesthouse</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-brand-brown)]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-olive)]"
                  placeholder="admin@lithosevia.gr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-70">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-[var(--color-brand-brown)]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-olive)]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-lg text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] py-3 rounded-lg font-serif italic text-lg hover:bg-[var(--color-brand-olive)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Σύνδεση...' : 'Σύνδεση'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
