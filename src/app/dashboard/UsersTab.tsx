import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const inputCls = `w-full bg-[#060610] border border-[rgba(157,0,255,0.2)] rounded-lg px-4 py-3
  text-white text-sm placeholder:text-gray-600 focus:outline-none
  focus:border-[rgba(157,0,255,0.55)] focus:shadow-[0_0_0_3px_rgba(157,0,255,0.08)]
  transition-all duration-200`;
const labelCls = 'block text-[9px] font-mono text-gray-500 tracking-[0.18em] mb-1.5 uppercase';

export default function UsersTab({ showToast, currentUserId }: { showToast: (m: string, t?: 'success' | 'error') => void, currentUserId?: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({ role: 'VIEWER' });
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editId ? 'PATCH' : 'POST';

      // ── Sanitize: strip empty password before sending ──
      const sanitized = { ...formData };
      if (editId && (!sanitized.password || sanitized.password.trim() === '')) {
        delete sanitized.password;
      }

      const body = editId ? { id: editId, ...sanitized } : sanitized;
      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      showToast(`✓ User ${editId ? 'updated' : 'created'}`);
      setShowForm(false);
      setEditId(null);
      setFormData({ role: 'VIEWER' });
      await load();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user ${name}?`)) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      showToast('✓ User deleted');
      await load();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleEdit = (u: any) => {
    setEditId(u._id);
    setFormData({
      name: u.name,
      email: u.email,
      role: u.role,
      password: '', // blank password when editing — will be stripped on submit
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.05)]">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">User Management</h2>
          <p className="text-gray-500 text-xs font-mono mt-1">Manage admins and editors</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-2 text-xs font-mono text-gray-500 border border-white/8 rounded-lg hover:bg-white/4 transition-all">↺</button>
          <button onClick={() => { setShowForm(v => !v); setEditId(null); setFormData({ role: 'VIEWER' }); }}
            className={`px-4 py-2 rounded-xl text-sm font-mono transition-all border
              ${showForm ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-purple-950/30 border-purple-500/35 text-purple-300 hover:bg-purple-950/50'}`}>
            {showForm ? '✕ Close' : '+ New User'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="relative rounded-2xl overflow-hidden p-6" style={{ background: 'rgba(6,6,16,0.97)', border: '1px solid rgba(157,0,255,0.18)' }}>
              <h3 className="text-white font-bold mb-5 text-sm">{editId ? '✎ Edit User' : '+ Create User'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input type="text" required value={formData.name || ''} onChange={e => setFormData((f: any) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Admin Name" />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input type="email" required value={formData.email || ''} onChange={e => setFormData((f: any) => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="admin@domain.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{editId ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                    <input
                      type="password"
                      required={!editId}
                      value={formData.password || ''}
                      onChange={e => setFormData((f: any) => ({ ...f, password: e.target.value }))}
                      className={inputCls}
                      placeholder={editId ? 'Leave blank to keep current' : '••••••••'}
                      minLength={editId ? undefined : 8}
                    />
                    {editId && (
                      <p className="text-[10px] font-mono text-gray-600 mt-1">Leave empty to keep the existing password unchanged</p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Role</label>
                    <select value={formData.role || 'VIEWER'} onChange={e => setFormData((f: any) => ({ ...f, role: e.target.value }))} className={`${inputCls} appearance-none`}>
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3 mt-2 rounded-xl font-mono text-sm font-medium text-white transition-all
                  bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 hover:border-purple-400/70 disabled:opacity-50">
                  {isSubmitting ? '⏳ Processing...' : editId ? '✓ Update User' : '+ Create User'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-mono text-sm">Loading users...</div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u._id} className="flex items-center gap-4 px-4 py-3 rounded-xl border bg-[#08080f] border-white/5">
              <div className="w-8 h-8 rounded-full bg-purple-900/40 flex items-center justify-center text-xs font-bold text-purple-300">
                {u.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{u.name}</span>
                  {u._id === currentUserId && <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-mono">YOU</span>}
                </div>
                <div className="text-xs text-gray-500 font-mono">{u.email}</div>
              </div>
              <div className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-gray-400">{u.role}</div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(u)} className="px-3 py-1.5 text-xs font-mono text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">Edit</button>
                {u._id !== currentUserId && (
                  <button onClick={() => handleDelete(u._id, u.name)} className="px-3 py-1.5 text-xs font-mono text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all">Del</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
