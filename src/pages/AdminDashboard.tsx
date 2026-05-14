import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useBlockedDates, setDateBlocked } from '../hooks/useBlockedDates';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { BrandMark } from '../components/icons';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

export function AdminDashboard() {
  const { blockedDates, loading } = useBlockedDates();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<'block' | 'unblock' | null>(null);
  const [saving, setSaving] = useState(false);

  const blockedDateObjs = blockedDates.map(d => new Date(d + 'T00:00:00'));

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isBlocked = blockedDates.includes(dateStr);
    
    setSelectedDates(prev => {
      const exists = prev.some(d => format(d, 'yyyy-MM-dd') === dateStr);
      if (exists) return prev.filter(d => format(d, 'yyyy-MM-dd') !== dateStr);
      return [...prev, date];
    });
  };

  const openConfirmation = (action: 'block' | 'unblock') => {
    if (selectedDates.length === 0) return;
    setPendingAction(action);
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (!pendingAction || selectedDates.length === 0) return;
    setSaving(true);

    try {
      const email = auth.currentUser?.email || 'admin';
      for (const date of selectedDates) {
        const dateStr = format(date, 'yyyy-MM-dd');
        await setDateBlocked(dateStr, pendingAction === 'block', email);
      }
      setSelectedDates([]);
      setShowConfirm(false);
      setPendingAction(null);
    } catch (error) {
      console.error('Error updating dates:', error);
      alert('Σφάλμα κατά την ενημέρωση');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-beige)]">
      {/* Header */}
      <header className="bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BrandMark className="w-10 h-10" />
          <div>
            <h1 className="font-serif italic text-2xl">Admin Dashboard</h1>
            <p className="text-xs opacity-70">{auth.currentUser?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Αποσύνδεση</span>
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-[var(--color-brand-brown)]/10">
          <h2 className="font-serif italic text-3xl mb-6 flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            Διαχείριση Διαθεσιμότητας
          </h2>

          {loading ? (
            <div className="text-center py-12 opacity-60">Φόρτωση...</div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-[var(--color-brand-olive)]/10 rounded-lg">
                <p className="text-sm">
                  <strong>Οδηγίες:</strong> Επιλέξτε ημερομηνίες και πατήστε "Κλείσιμο" ή "Άνοιγμα" για να ενημερώσετε τη διαθεσιμότητα.
                </p>
              </div>

              <DayPicker
                mode="multiple"
                selected={selectedDates}
                onDayClick={handleDateClick}
                locale={el}
                numberOfMonths={2}
                className="mx-auto"
                modifiers={{
                  blocked: blockedDateObjs,
                  selected: selectedDates,
                }}
                modifiersStyles={{
                  blocked: { 
                    backgroundColor: 'var(--color-brand-brown)',
                    color: 'white',
                  },
                  selected: {
                    backgroundColor: 'var(--color-brand-olive)',
                    color: 'white',
                  },
                }}
              />

              <div className="mt-8 flex gap-4 justify-center">
                <button
                  onClick={() => openConfirmation('block')}
                  disabled={selectedDates.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Κλείσιμο ({selectedDates.length})
                </button>
                <button
                  onClick={() => openConfirmation('unblock')}
                  disabled={selectedDates.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Άνοιγμα ({selectedDates.length})
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !saving && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-lg w-full"
            >
              <h3 className="font-serif italic text-2xl mb-4">
                Επιβεβαίωση {pendingAction === 'block' ? 'Κλεισίματος' : 'Ανοίγματος'}
              </h3>
              
              <p className="mb-6">
                Θα {pendingAction === 'block' ? 'κλείσετε' : 'ανοίξετε'} τις παρακάτω ημερομηνίες:
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2">{format(date, 'dd MMM yyyy', { locale: el })}</td>
                        <td className="py-2 text-right">
                          {pendingAction === 'block' ? (
                            <span className="text-red-600">🔴 Κλειστό</span>
                          ) : (
                            <span className="text-green-600">✅ Ανοιχτό</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={confirmAction}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[var(--color-brand-brown)] text-white rounded-lg hover:bg-[var(--color-brand-olive)] disabled:opacity-50"
                >
                  {saving ? 'Αποθήκευση...' : 'Επιβεβαίωση'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
