'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  getProjects, getAllProjects, createProject, updateProject, deleteProject,
  getCertificates, getAllCertificates, createCertificate, updateCertificate, deleteCertificate,
  getBlogPosts, getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
  getSocialLinks, getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink,
  getContactMessages, deleteContactMessage, markMessageRead,
  getContentSection, updateContentSection,
  toggleVisibility
} from '@/app/actions';
import MediaUploader from '@/components/MediaUploader';
import Navbar from '@/components/Navbar';
import UsersTab from './UsersTab';
import EmptyState from '@/components/EmptyState';
import { safeFetch } from '@/lib/safeFetch';

// ─── Types ──────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'projects' | 'certs' | 'blog' | 'social' | 'messages' | 'content' | 'users' | 'settings';
interface Tab { id: TabId; label: string; icon: string; badge?: number }

// ─── Styles ──────────────────────────────────────────────────────────────────
const inputCls = `w-full bg-[#060610] border border-[rgba(157,0,255,0.2)] rounded-lg px-4 py-3
  text-white text-sm placeholder:text-gray-600 focus:outline-none
  focus:border-[rgba(157,0,255,0.55)] focus:shadow-[0_0_0_3px_rgba(157,0,255,0.08)]
  transition-all duration-200`;
const labelCls = 'block text-[9px] font-mono text-gray-500 tracking-[0.18em] mb-1.5 uppercase';

// ─── (Static fallback arrays removed — MongoDB is the single source of truth) ──


// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl font-mono text-sm font-medium
        flex items-center gap-3 shadow-2xl backdrop-blur-xl border max-w-sm
        ${type === 'success'
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
          : 'bg-red-950/90 border-red-500/40 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
        }`}
    >
      <span>{type === 'success' ? '✓' : '✕'}</span>
      <span className="leading-tight">{msg}</span>
    </motion.div>
  );
}

// ─── Confirm ──────────────────────────────────────────────────────────────────
function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
        className="bg-[#0c0c18] border border-red-500/30 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
        <div className="text-3xl mb-4 text-center">⚠️</div>
        <p className="text-white text-center mb-6">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-all text-sm font-mono">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-sm font-mono">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── RecordRow ────────────────────────────────────────────────────────────────
function RecordRow({ title, subtitle, isStatic, isHidden, onEdit, onDelete, onToggleVisibility }: {
  title: string; subtitle?: string; isStatic?: boolean; isHidden?: boolean;
  onEdit?: () => void; onDelete?: () => void; onToggleVisibility?: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all group
      ${isStatic
        ? 'bg-[#08080f]/50 border-[rgba(255,255,255,0.04)] opacity-60'
        : isHidden
          ? 'bg-[#08080f]/50 border-[rgba(255,255,255,0.04)] opacity-50'
          : 'bg-[#08080f] border-[rgba(255,255,255,0.05)] hover:border-[rgba(157,0,255,0.25)]'
      }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium truncate ${isHidden ? 'text-gray-500 line-through' : 'text-white'}`}>{title}</span>
          {isStatic && <span className="shrink-0 text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">STATIC</span>}
          {isHidden && <span className="shrink-0 text-[9px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">HIDDEN</span>}
        </div>
        {subtitle && <div className="text-gray-600 text-xs font-mono truncate mt-0.5">{subtitle}</div>}
      </div>
      {!isStatic && (
        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleVisibility && (
            <button onClick={onToggleVisibility} title={isHidden ? 'Show' : 'Hide'}
              className={`px-2 py-1.5 text-xs font-mono rounded-lg transition-all border
                ${isHidden
                  ? 'text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10'
                  : 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                }`}>
              {isHidden ? '👁' : '👁‍🗨'}
            </button>
          )}
          {onEdit && <button onClick={onEdit} className="px-3 py-1.5 text-xs font-mono text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">Edit</button>}
          {onDelete && <button onClick={onDelete} className="px-3 py-1.5 text-xs font-mono text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all">Del</button>}
        </div>
      )}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border bg-[#08080f] ${color} group hover:scale-[1.02] transition-transform`}>
      <div className="text-[9px] font-mono tracking-widest mb-2 opacity-50 uppercase">{label}</div>
      <div className="text-5xl font-bold text-white font-display">{value}</div>
      {sub && <div className="text-xs font-mono mt-1 opacity-40">{sub}</div>}
      <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-15 bg-current" />
    </div>
  );
}

// ─── Input Helpers ────────────────────────────────────────────────────────────
const Inp = ({ data, aF, label, k, isArea = false, h = 'h-20' }: any) => {
  const ta = `${inputCls} resize-none`;
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {isArea ? <textarea value={data[k] || ''} onChange={aF(k)} className={`${ta} ${h}`} /> : <input type="text" value={data[k] || ''} onChange={aF(k)} className={inputCls} />}
    </div>
  );
};

const MediaInp = ({ data, setData, label, k, type = 'any' }: any) => (
  <MediaUploader
    label={label}
    value={data[k] || ''}
    onChange={(url) => setData((c: any) => ({ ...c, [k]: url }))}
    type={type}
  />
);

// ─── ContentTab ───────────────────────────────────────────────────────────────
function ContentTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [section, setSection] = useState('home');
  const [data, setData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const ta = `${inputCls} resize-none`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const dbData = await getContentSection(section);
      setData(dbData);
    } catch { showToast('Load error', 'error'); }
    finally { setLoading(false); }
  }, [section, showToast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await updateContentSection(section, data);
      showToast('✓ Saved! Live immediately.');
    } catch { showToast('Save failed.', 'error'); }
    finally { setSaving(false); }
  };

  const aF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((c: any) => ({ ...c, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Site Content</h2>
          <p className="text-gray-500 text-sm mt-1">Modular content editor. Changes are live instantly.</p>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-[rgba(157,0,255,0.1)] scrollbar-hide">
        {['navbar', 'home', 'about', 'projects', 'certs', 'blog', 'contact', 'footer', 'profile'].map(s => (
          <button key={s} onClick={() => setSection(s)} className={`px-4 py-2 font-mono text-xs rounded-xl transition-all ${section === s ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40' : 'text-gray-500 hover:text-gray-300'}`}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? <div className="text-gray-500 font-mono text-sm py-10">Loading...</div> : (
        <form onSubmit={save} className="space-y-6 max-w-2xl">
          {section === 'home' && (<>
            <div className="grid grid-cols-2 gap-4"><Inp data={data} aF={aF} label="Heading 1" k="heading" /><Inp data={data} aF={aF} label="Subheading" k="subheading" /></div>
            <Inp data={data} aF={aF} label="Tagline" k="tagline" />
            <Inp data={data} aF={aF} label="Hero Bio" k="bio" isArea />
            <div className="grid border-b border-dark-border pb-4 gap-4 mt-4 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!data.availableForWork} onChange={e => setData((c: any) => ({ ...c, availableForWork: e.target.checked }))} className="w-4 h-4 accent-purple-500" />
                <span className="text-sm text-gray-300 font-mono">Available for Work</span>
              </label>
            </div>
            <MediaInp data={data} setData={setData} label="Resume / CV File (PDF)" k="resumeUrl" type="document" />
            <div className="px-4 py-3 rounded-xl bg-emerald-950/20 border border-emerald-500/15 text-emerald-400 text-xs font-mono mt-2">
              ℹ Projects & Certifications counters are now auto-calculated from the database.
            </div>
            <Inp data={data} aF={aF} label="Platforms (Format: Name,Rank,Color,URL; Name2,Rank2,Color2,URL)" k="platforms" isArea h="h-24" />
            <Inp data={data} aF={aF} label="Skills (Format: Name,Pct; Name2,Pct2)" k="skills" isArea h="h-24" />
          </>)}

          {section === 'about' && (<>
            <Inp data={data} aF={aF} label="Paragraph 1" k="p1" isArea h="h-24" />
            <Inp data={data} aF={aF} label="Paragraph 2" k="p2" isArea h="h-24" />
            <Inp data={data} aF={aF} label="Paragraph 3" k="p3" isArea h="h-24" />
            <Inp data={data} aF={aF} label="Focus Areas (Format: Label,Level; Label2,Level2)" k="focuses" isArea h="h-24" />
          </>)}

          {['projects', 'certs', 'blog', 'contact'].includes(section) && (<>
            <Inp data={data} aF={aF} label="Section Title" k="title" />
            <Inp data={data} aF={aF} label="Section Subtitle / Description" k="subtitle" isArea h="h-24" />
          </>)}

          {section === 'navbar' && (<>
            <Inp data={data} aF={aF} label="Brand Prefix (e.g., jaiz)" k="brandPrefix" />
            <Inp data={data} aF={aF} label="Brand Name/Identifier (e.g., jaiz_sec)" k="brandName" />
            
            <div className="grid border border-white/10 rounded-xl p-4 bg-white/5 gap-4 my-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={data.showProfileImage !== false} 
                  onChange={e => setData((c: any) => ({ ...c, showProfileImage: e.target.checked }))} 
                  className="w-4 h-4 accent-purple-500" 
                />
                <span className="text-sm text-gray-300 font-mono">Show Profile Picture</span>
              </label>
              
              {data.showProfileImage !== false && (
                <MediaInp data={data} setData={setData} label="Profile Image" k="brandImage" type="image" />
              )}
            </div>

            <Inp data={data} aF={aF} label="CTA Button Text" k="ctaText" />

            <div className="mt-8 border border-white/10 rounded-2xl overflow-hidden bg-black/50 p-4 border-dashed">
              <label className={labelCls}>Live Preview of Navbar</label>
              <div className="relative h-16 pointer-events-none transform origin-top-left flex items-center justify-center -mt-2">
                <Navbar previewCfg={{
                    brandPrefix: data.brandPrefix,
                    brandName: data.brandName,
                    brandImage: data.brandImage,
                    showProfileImage: data.showProfileImage,
                    ctaText: data.ctaText
                }} />
              </div>
            </div>
          </>)}

          {section === 'profile' && (<>
            <div className="grid grid-cols-2 gap-4">
              <MediaInp data={data} setData={setData} label="Profile Picture (Center Node)" k="profileImage" type="image" />
              <Inp data={data} aF={aF} label="Spin Time for 1 Rotation (Seconds, e.g. 5)" k="rotationSpeed" />
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className={labelCls}>Timeline Nodes</label>
                <button type="button" onClick={() => {
                  const nodes = data.timelineNodes || [];
                  setData({ ...data, timelineNodes: [...nodes, { id: Date.now(), title: 'New Node', date: '', content: '', academy: '', link: '', category: 'Role', iconName: 'Circle', status: 'pending', energy: 50 }] });
                }} className="px-3 py-1.5 text-xs font-mono text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all">+ Add Node</button>
              </div>
              
              <div className="space-y-4">
                {(data.timelineNodes || []).map((node: any, idx: number) => (
                  <div key={node.id} className="p-4 border border-[rgba(255,255,255,0.05)] rounded-xl bg-[#08080f] relative group">
                    <button type="button" onClick={() => {
                      const nodes = [...data.timelineNodes];
                      nodes.splice(idx, 1);
                      setData({ ...data, timelineNodes: nodes });
                    }} className="absolute top-4 right-4 text-xs font-mono text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Title</label>
                        <input type="text" value={node.title} onChange={e => {
                          const nodes = [...data.timelineNodes];
                          nodes[idx].title = e.target.value;
                          setData({ ...data, timelineNodes: nodes });
                        }} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Date</label>
                        <input type="text" value={node.date} onChange={e => {
                          const nodes = [...data.timelineNodes];
                          nodes[idx].date = e.target.value;
                          setData({ ...data, timelineNodes: nodes });
                        }} className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Academy / Platform</label>
                        <input type="text" value={node.academy || ''} onChange={e => {
                          const nodes = [...data.timelineNodes];
                          nodes[idx].academy = e.target.value;
                          setData({ ...data, timelineNodes: nodes });
                        }} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Verify Link</label>
                        <input type="text" value={node.link || ''} onChange={e => {
                          const nodes = [...data.timelineNodes];
                          nodes[idx].link = e.target.value;
                          setData({ ...data, timelineNodes: nodes });
                        }} className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Icon Name (Lucide)</label>
                        <input type="text" value={node.iconName} placeholder="e.g. Shield, Terminal" onChange={e => {
                          const nodes = [...data.timelineNodes];
                          nodes[idx].iconName = e.target.value;
                          setData({ ...data, timelineNodes: nodes });
                        }} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Status</label>
                        <select value={node.status} onChange={e => {
                          const nodes = [...data.timelineNodes];
                          nodes[idx].status = e.target.value;
                          setData({ ...data, timelineNodes: nodes });
                        }} className={inputCls}>
                          <option value="completed">Completed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Energy %</label>
                        <input type="number" value={node.energy} onChange={e => {
                          const nodes = [...data.timelineNodes];
                          nodes[idx].energy = Number(e.target.value);
                          setData({ ...data, timelineNodes: nodes });
                        }} className={inputCls} />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">Content</label>
                      <textarea value={node.content} onChange={e => {
                        const nodes = [...data.timelineNodes];
                        nodes[idx].content = e.target.value;
                        setData({ ...data, timelineNodes: nodes });
                      }} className={`${inputCls} resize-none h-20`} />
                    </div>
                  </div>
                ))}
                {(!data.timelineNodes || data.timelineNodes.length === 0) && (
                  <div className="text-center py-6 text-gray-500 font-mono text-xs border border-dashed border-white/10 rounded-xl">No nodes added yet.</div>
                )}
              </div>
            </div>
          </>)}

          {section === 'footer' && (<>
            <Inp data={data} aF={aF} label="Copyright Text" k="copyrightText" />
          </>)}

          <button type="submit" disabled={saving}
            className="w-full py-4 rounded-xl font-mono font-bold text-sm text-white transition-all
            bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40
            hover:border-purple-400/70 hover:shadow-[0_0_25px_rgba(157,0,255,0.2)]
            disabled:opacity-40 disabled:cursor-not-allowed mt-4">
            {saving ? '⏳ Saving...' : `✓ Save ${section.toUpperCase()} Content`}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── MessagesTab ──────────────────────────────────────────────────────────────
function MessagesTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [confirm, setConfirm] = useState<null | { id: string }>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getContactMessages();
    setMsgs(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    try { await deleteContactMessage(id); await load(); showToast('Message deleted.'); }
    catch (e: any) { showToast(e.message, 'error'); }
  };

  const handleRead = async (id: string) => {
    try { await markMessageRead(id); await load(); }
    catch { /* ignore */ }
  };

  const unread = msgs.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
            Messages {unread > 0 && <span className="text-sm px-2.5 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-purple font-mono">{unread} new</span>}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{msgs.length} total contact submissions</p>
        </div>
        <button onClick={load} className="px-3 py-2 text-xs font-mono text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all">↺ Refresh</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        </div>
      ) : msgs.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4 opacity-20">📬</div>
          <p className="font-mono text-sm">No messages yet.</p>
        </div>
      ) : selected ? (
        <div className="max-w-2xl">
          <button onClick={() => setSelected(null)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm transition-colors">
            ← Back to messages
          </button>
          <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(6,6,16,0.95)', border: '1px solid rgba(157,0,255,0.2)' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                <div><span className="text-gray-500">FROM</span><div className="text-white mt-1">{selected.name}</div></div>
                <div><span className="text-gray-500">EMAIL</span><div className="text-neon-cyan mt-1">{selected.email}</div></div>
                <div className="col-span-2"><span className="text-gray-500">SUBJECT</span><div className="text-white mt-1">{selected.subject}</div></div>
              </div>
              <div>
                <span className="text-gray-500 text-xs font-mono tracking-widest uppercase">Message</span>
                <div className="mt-3 p-4 bg-white/3 rounded-xl border border-white/5 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-gray-600">{new Date(selected.createdAt).toLocaleString()}</span>
                <div className="flex gap-2">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} target="_blank" rel="noreferrer"
                    className="px-4 py-2 text-xs font-mono text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-all">Reply ↗</a>
                  <button onClick={() => { setConfirm({ id: selected._id }); setSelected(null); }}
                    className="px-4 py-2 text-xs font-mono text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {msgs.map((m: any) => (
            <div key={m._id} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border cursor-pointer transition-all
              ${!m.read ? 'bg-purple-950/20 border-purple-500/20 hover:border-purple-500/40' : 'bg-[#08080f] border-white/5 hover:border-white/10'}`}
              onClick={() => { setSelected(m); handleRead(m._id); }}>
              {!m.read && <div className="w-2 h-2 rounded-full bg-neon-purple shrink-0 shadow-[0_0_6px_rgba(157,0,255,0.8)]" />}
              {m.read && <div className="w-2 h-2 rounded-full bg-transparent shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-medium">{m.name}</span>
                  <span className="text-gray-600 text-xs font-mono">{m.email}</span>
                </div>
                <div className="text-gray-400 text-xs font-mono mt-0.5 truncate">{m.subject}</div>
              </div>
              <div className="text-xs font-mono text-gray-600 shrink-0">
                {new Date(m.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog msg="Delete this message permanently?" onCancel={() => setConfirm(null)}
            onConfirm={() => { handleDelete(confirm.id); setConfirm(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LoginPage ────────────────────────────────────────────────────────────────
function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await signIn('credentials', { redirect: false, email: form.email, password: form.password });
    setLoading(false);
    if (res?.error) {
      setError('Invalid credentials. Access denied.');
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.07) 0%, transparent 70%)' }}>
      <div className="fixed inset-0 -z-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.025) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-2xl bg-neon-purple/15 blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-[#0c0c16] border border-neon-purple/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">🔐</div>
          </div>
          <h1 className="text-3xl font-bold text-white font-display mb-2">Secure Access</h1>
          <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em]">ADMIN CONTROL PANEL · RESTRICTED</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: 'rgba(8,8,15,0.92)', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 0 40px rgba(168,85,247,0.06), 0 24px 64px rgba(0,0,0,0.7)' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className={labelCls}>Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-mono text-sm">✉</span>
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@jaiz.sec" className={`${inputCls} pl-8`} autoComplete="email" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••••" className={`${inputCls} pr-12`} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-sm">
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-950/30 border border-red-500/20 rounded-lg px-4 py-3">
                  <span>✕</span>{error}
                </motion.div>
              )}
            </AnimatePresence>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-mono font-medium text-sm text-white transition-all
              bg-gradient-to-r from-neon-purple/20 to-indigo-900/30 border border-neon-purple/40
              hover:border-neon-purple/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]
              disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AUTHENTICATING...
                </span>
              ) : 'AUTHENTICATE →'}
            </button>
          </form>
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] font-mono text-gray-700 tracking-wider">RESTRICTED · AUTHORIZED PERSONNEL ONLY</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes idle = logout
const WARNING_MS = 29 * 60 * 1000;    // 29 minutes = warning

export default function DashboardContent({ initialAuthenticated }: { initialAuthenticated?: boolean }) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Inactivity auto-logout ──────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'authenticated') return;
    
    let lastActivity = Date.now();
    const updateActivity = () => { lastActivity = Date.now(); };
    
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach(ev => window.addEventListener(ev, updateActivity, { passive: true }));
    
    let warned = false;
    const interval = setInterval(() => {
      const inactiveFor = Date.now() - lastActivity;
      if (inactiveFor >= INACTIVITY_MS) {
        clearInterval(interval);
        signOut({ callbackUrl: '/dashboard' });
      } else if (inactiveFor >= WARNING_MS && !warned) {
        warned = true;
        setToast({ msg: '⚠️ Session expiring in 10 seconds due to inactivity. Move mouse to stay logged in.', type: 'error' });
      } else if (inactiveFor < WARNING_MS && warned) {
        warned = false; // Reset warning if user became active again
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
      events.forEach(ev => window.removeEventListener(ev, updateActivity));
    };
  }, [status]);

  // DB data
  const [projects, setProjects] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [msgCount, setMsgCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dbOnline, setDbOnline] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Toast (moved up)

  // Confirm
  const [confirm, setConfirm] = useState<{ msg: string; onConfirm: () => void } | null>(null);

  // Cred form
  const [credForm, setCredForm] = useState({ username: '', newPassword: '', confirmPassword: '' });
  const [credLoading, setCredLoading] = useState(false);
  const [showCredPass, setShowCredPass] = useState({ new: false, confirm: false });

  const loadData = useCallback(async () => {
    try {
      const [p, c, b, s, msgs] = await Promise.all([
        getAllProjects(), getAllCertificates(), getAllBlogPosts(), getAllSocialLinks(), getContactMessages()
      ]);
      setProjects(p); setCerts(c); setPosts(b); setSocials(s);
      setMsgCount(msgs.length);
      setUnreadCount(msgs.filter((m: any) => !m.read).length);
      setDbOnline(true);
    } catch {
      setDbOnline(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') loadData();
  }, [status, loadData]);

  // Image uploads are now handled by MediaUploader → Cloudinary → URL string
  // No more base64 DataURL encoding (which breaks on Vercel and bloats MongoDB)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'projects') {
        const d = {
          title: formData.title, description: formData.description,
          tags: formData.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
          metrics: formData.metrics?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
          githubUrl: formData.githubUrl, liveUrl: formData.liveUrl, youtubeUrl: formData.youtubeUrl,
          category: formData.category, imageUrl: formData.image, videoUrl: formData.videoUrl,
        };
        editId ? await updateProject(editId, d) : await createProject(d);
      } else if (activeTab === 'certs') {
        const d = { title: formData.title, issuer: formData.issuer, date: formData.date, verifyUrl: formData.verifyUrl, image: formData.image, videoUrl: formData.videoUrl };
        editId ? await updateCertificate(editId, d) : await createCertificate(d);
      } else if (activeTab === 'blog') {
        const d = {
          title: formData.title, excerpt: formData.excerpt, content: formData.content,
          coverImage: formData.image, videoUrl: formData.videoUrl,
          tags: formData.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
        };
        editId ? await updateBlogPost(editId, d) : await createBlogPost(d);
      } else if (activeTab === 'social') {
        const d = { platform: formData.platform, url: formData.url, icon: formData.icon || '🔗', order: parseInt(formData.order || '0') };
        editId ? await updateSocialLink(editId, d) : await createSocialLink(d);
      }
      setFormData({}); setEditId(null); setShowForm(false);
      await loadData();
      showToast(editId ? '✓ Record updated!' : '✓ Record created!');
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = (tab: TabId, id: string, title: string) => {
    setConfirm({
      msg: `Delete "${title}"?`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          if (tab === 'projects') await deleteProject(id);
          else if (tab === 'certs') await deleteCertificate(id);
          else if (tab === 'blog') await deleteBlogPost(id);
          else if (tab === 'social') await deleteSocialLink(id);
          await loadData();
          showToast('✓ Deleted');
        } catch (err: any) { showToast(err.message, 'error'); }
      },
    });
  };

  const handleEdit = (rec: any) => {
    setEditId(rec._id);
    setFormData({
      title: rec.title || rec.platform || '',
      description: rec.description || '',
      tags: Array.isArray(rec.tags) ? rec.tags.join(', ') : '',
      metrics: Array.isArray(rec.metrics) ? rec.metrics.join(', ') : '',
      githubUrl: rec.githubUrl || '',
      liveUrl: rec.liveUrl || '',
      category: rec.category || '',
      issuer: rec.issuer || '',
      date: rec.date || '',
      verifyUrl: rec.verifyUrl || '',
      excerpt: rec.excerpt || '',
      content: rec.content || '',
      platform: rec.platform || '',
      url: rec.url || '',
      icon: rec.icon || '',
      order: rec.order !== undefined ? String(rec.order) : '0',
      image: rec.image || rec.coverImage || rec.imageUrl || rec.iconSvg || '',
      videoUrl: rec.videoUrl || '',
    });
    setShowForm(true);
  };

  const handleCredChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credForm.newPassword !== credForm.confirmPassword) { showToast('Passwords do not match.', 'error'); return; }
    setCredLoading(true);
    try {
      await safeFetch('/api/admin/change-credentials', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: credForm.newPassword }),
      });
      setCredForm({ username: '', newPassword: '', confirmPassword: '' });
      showToast('✓ Password updated! Signing out...');
      setTimeout(() => signOut(), 2500);
    } catch (err: any) { showToast(err.message, 'error'); }
    finally { setCredLoading(false); }
  };

  // ── Guards ───────────────────────────────────────────────────────────────
  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        <p className="font-mono text-xs text-gray-500 tracking-widest">INITIALIZING...</p>
      </div>
    </div>
  );
  if (status === 'unauthenticated' || !session) return <LoginPage />;

  // ── Merged data (static + DB) ─────────────────────────────────────────
  const allProjects = projects;
  const allCerts = certs;
  const allPosts = posts;

  const TABS: Tab[] = [
    { id: 'overview',  label: 'Overview',     icon: '◈' },
    { id: 'projects',  label: 'Projects',     icon: '◻', badge: allProjects.length || undefined },
    { id: 'certs',     label: 'Certificates', icon: '◎', badge: allCerts.length || undefined },
    { id: 'blog',      label: 'Blog Posts',   icon: '◇', badge: allPosts.length || undefined },
    { id: 'social',    label: 'Social Media', icon: '◉', badge: socials.length || undefined },
    { id: 'messages',  label: 'Messages',     icon: '✉', badge: unreadCount || undefined },
    { id: 'content',   label: 'Site Content', icon: '✎' },
    ...((session?.user as any)?.role === 'ADMIN' ? [{ id: 'users' as TabId, label: 'Users', icon: '👥' }] : []),
    { id: 'settings',  label: 'Credentials',  icon: '⚙' },
  ];

  const getListData = () => {
    if (activeTab === 'projects') return allProjects;
    if (activeTab === 'certs') return allCerts;
    if (activeTab === 'blog') return allPosts;
    if (activeTab === 'social') return socials;
    return [];
  };


  // Visibility toggle handler
  const handleToggleVisibility = async (collection: 'projects' | 'certs' | 'blog' | 'social', id: string) => {
    try {
      await toggleVisibility(collection, id);
      await loadData();
      showToast('✓ Visibility updated');
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-[#050509]" style={{ paddingTop: '72px' }}>
      {/* ── Mobile sidebar toggle button ── */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 backdrop-blur-xl flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:scale-105 transition-transform"
        aria-label="Open dashboard menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:sticky top-[72px] left-0 z-50 md:z-auto flex flex-col w-[230px] shrink-0 h-[calc(100vh-72px)]
        border-r border-[rgba(157,0,255,0.08)] bg-[#070710] overflow-y-auto transition-transform duration-300 md:transition-none`}>

        {/* Admin info */}
        <div className="p-5 border-b border-[rgba(157,0,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(157,0,255,0.4)]">
              {session?.user?.name?.[0] || 'A'}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070710]" />
            </div>
            <div>
              <div className="text-white text-xs font-semibold">{session?.user?.name || 'Admin'}</div>
              <div className="text-[10px] font-mono text-emerald-400 tracking-wider">ONLINE</div>
            </div>
          </div>
          {/* DB Status */}
          <div className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono
            ${dbOnline === true ? 'bg-emerald-950/30 text-emerald-400' : dbOnline === false ? 'bg-red-950/30 text-red-400' : 'bg-white/5 text-gray-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dbOnline === true ? 'bg-emerald-400' : dbOnline === false ? 'bg-red-400' : 'bg-gray-500'}`} />
            {dbOnline === true ? 'DB CONNECTED' : dbOnline === false ? 'DB OFFLINE' : 'CHECKING...'}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowForm(false); setEditId(null); setFormData({}); setSidebarOpen(false); }}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-mono transition-all duration-150
                ${activeTab === tab.id
                  ? 'bg-purple-950/40 text-purple-300 border border-purple-500/20 shadow-[0_0_12px_rgba(157,0,255,0.08)]'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/4'
                }`}>
              <span className={`text-base ${activeTab === tab.id ? 'text-purple-400' : 'text-gray-600'}`}>{tab.icon}</span>
              <span className="flex-1">{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono
                  ${tab.id === 'messages' && unreadCount > 0
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30'
                    : 'bg-white/7 text-gray-500'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[rgba(157,0,255,0.08)]">
          <button onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl font-mono text-xs text-red-400
              hover:bg-red-500/8 border border-red-500/15 hover:border-red-500/30 transition-all">
            <span>⏻</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-x-hidden min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15 }} className="p-6 md:p-10 max-w-5xl mx-auto">

            {/* ── OVERVIEW ───────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white font-display">
                      Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{session.user?.name}</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                      {dbOnline ? 'Database connected. All systems operational.' : '⚠ Database offline — showing static fallback data.'}
                    </p>
                  </div>
                  <button onClick={loadData} className="px-4 py-2 text-xs font-mono text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all">↺ Refresh</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  <StatCard label="Projects" value={allProjects.length} sub={!dbOnline ? 'static' : 'db'} color="border-blue-500/20 text-blue-400" />
                  <StatCard label="Certificates" value={allCerts.length} sub={!dbOnline ? 'static' : 'db'} color="border-purple-500/20 text-purple-400" />
                  <StatCard label="Blog Posts" value={allPosts.length} sub={!dbOnline ? 'static' : 'db'} color="border-pink-500/20 text-pink-400" />
                  <StatCard label="Messages" value={msgCount} sub={unreadCount > 0 ? `${unreadCount} unread` : 'inbox'} color="border-emerald-500/20 text-emerald-400" />
                </div>

                {/* Quick actions */}
                <div className="grid md:grid-cols-2 gap-3">
                  {TABS.filter(t => !['overview','settings','content'].includes(t.id)).map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id !== 'messages') setShowForm(true); }}
                      className="group flex items-center gap-4 p-5 rounded-2xl bg-[#08080f] border border-[rgba(255,255,255,0.04)]
                        hover:border-[rgba(157,0,255,0.25)] hover:shadow-[0_0_20px_rgba(157,0,255,0.06)] transition-all text-left">
                      <span className="text-xl text-gray-600 group-hover:text-purple-400 transition-colors">{tab.icon}</span>
                      <div>
                        <div className="text-white font-medium text-sm">{tab.label}</div>
                        <div className="text-gray-600 text-xs font-mono mt-0.5">
                          {tab.id === 'messages' ? 'View inbox →' : 'Manage / Add new →'}
                        </div>
                      </div>
                      <div className="ml-auto text-gray-700 group-hover:text-purple-400 transition-colors">→</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── CRUD TABS ──────────────────────────────────────── */}
            {(['projects', 'certs', 'blog', 'social'] as TabId[]).includes(activeTab) && (
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.05)]">
                  <div>
                    <h2 className="text-2xl font-bold text-white font-display">
                      {TABS.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-gray-500 text-xs font-mono mt-1">
                      {getListData().length} records · {dbOnline ? 'Database connected' : 'Offline mode — DB records cannot be edited'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={loadData} className="px-3 py-2 text-xs font-mono text-gray-500 border border-white/8 rounded-lg hover:bg-white/4 transition-all">↺</button>
                    <button onClick={() => { setShowForm(v => !v); setEditId(null); setFormData({}); }}
                      className={`px-4 py-2 rounded-xl text-sm font-mono transition-all border
                        ${showForm ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-purple-950/30 border-purple-500/35 text-purple-300 hover:bg-purple-950/50'}`}>
                      {showForm ? '✕ Close' : '+ New'}
                    </button>
                  </div>
                </div>

                {/* ── Form ── */}
                <AnimatePresence>
                  {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                      <div className="relative rounded-2xl overflow-hidden"
                        style={{ background: 'rgba(6,6,16,0.97)', border: '1px solid rgba(157,0,255,0.18)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />
                        <div className="p-6">
                          <h3 className="text-white font-bold mb-5 text-sm flex items-center gap-2">
                            <span className={editId ? 'text-cyan-400' : 'text-purple-400'}>{editId ? '✎ Edit' : '+ Create'}</span>
                            {' '}{TABS.find(t => t.id === activeTab)?.label}
                          </h3>
                          <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                              {/* Title — all except social */}
                              {activeTab !== 'social' && (
                                <div>
                                  <label className={labelCls}>Title *</label>
                                  <input type="text" required value={formData.title || ''} onChange={e => setFormData((f: any) => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Enter title..." />
                                </div>
                              )}

                              {/* PROJECTS */}
                              {activeTab === 'projects' && (<>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className={labelCls}>Category</label>
                                    <input type="text" value={formData.category || ''} onChange={e => setFormData((f: any) => ({ ...f, category: e.target.value }))} className={inputCls} placeholder="e.g. SECURITY TOOL" />
                                  </div>
                                  <div>
                                    <label className={labelCls}>Tags (comma separated)</label>
                                    <input type="text" value={formData.tags || ''} onChange={e => setFormData((f: any) => ({ ...f, tags: e.target.value }))} className={inputCls} placeholder="Python, React, ..." />
                                  </div>
                                </div>
                                <div>
                                  <label className={labelCls}>Description *</label>
                                  <textarea required value={formData.description || ''} onChange={e => setFormData((f: any) => ({ ...f, description: e.target.value }))} className={`${inputCls} resize-none h-24`} placeholder="Project description..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className={labelCls}>GitHub URL</label>
                                    <input type="url" value={formData.githubUrl || ''} onChange={e => setFormData((f: any) => ({ ...f, githubUrl: e.target.value }))} className={inputCls} placeholder="https://github.com/..." />
                                  </div>
                                  <div>
                                    <label className={labelCls}>Live / Demo URL</label>
                                    <input type="url" value={formData.liveUrl || ''} onChange={e => setFormData((f: any) => ({ ...f, liveUrl: e.target.value }))} className={inputCls} placeholder="https://..." />
                                  </div>
                                </div>
                                <div>
                                  <label className={labelCls}>Metrics (comma separated, e.g. &quot;Scanned 100+ hosts, Detects open ports&quot;)</label>
                                  <input type="text" value={formData.metrics || ''} onChange={e => setFormData((f: any) => ({ ...f, metrics: e.target.value }))} className={inputCls} placeholder="Scanned 100+ hosts, Detects CVEs..." />
                                </div>
                                <div>
                                  <label className={labelCls}>YouTube Demo URL</label>
                                  <input type="url" value={formData.youtubeUrl || ''} onChange={e => setFormData((f: any) => ({ ...f, youtubeUrl: e.target.value }))} className={inputCls} placeholder="https://youtube.com/watch?v=..." />
                                </div>
                              </>)}

                              {/* CERTS */}
                              {activeTab === 'certs' && (
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className={labelCls}>Issuer *</label>
                                    <input type="text" required value={formData.issuer || ''} onChange={e => setFormData((f: any) => ({ ...f, issuer: e.target.value }))} className={inputCls} placeholder="e.g. CompTIA" />
                                  </div>
                                  <div>
                                    <label className={labelCls}>Issue Date</label>
                                    <input type="text" value={formData.date || ''} onChange={e => setFormData((f: any) => ({ ...f, date: e.target.value }))} className={inputCls} placeholder="Mar 2024" />
                                  </div>
                                  <div>
                                    <label className={labelCls}>Verify URL</label>
                                    <input type="url" value={formData.verifyUrl || ''} onChange={e => setFormData((f: any) => ({ ...f, verifyUrl: e.target.value }))} className={inputCls} placeholder="https://..." />
                                  </div>
                                </div>
                              )}

                              {/* BLOG */}
                              {activeTab === 'blog' && (<>
                                <div>
                                  <label className={labelCls}>Excerpt</label>
                                  <textarea value={formData.excerpt || ''} onChange={e => setFormData((f: any) => ({ ...f, excerpt: e.target.value }))} className={`${inputCls} resize-none h-16`} placeholder="Brief summary..." />
                                </div>
                                <div>
                                  <label className={labelCls}>Content (Markdown) *</label>
                                  <textarea required value={formData.content || ''} onChange={e => setFormData((f: any) => ({ ...f, content: e.target.value }))} className={`${inputCls} resize-none h-48 font-mono text-xs`} placeholder="# Markdown content..." />
                                </div>
                                <div>
                                  <label className={labelCls}>Tags (comma separated)</label>
                                  <input type="text" value={formData.tags || ''} onChange={e => setFormData((f: any) => ({ ...f, tags: e.target.value }))} className={inputCls} placeholder="security, ctf, ..." />
                                </div>
                              </>)}

                              {/* SOCIAL */}
                              {activeTab === 'social' && (<>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className={labelCls}>Platform *</label>
                                    <input type="text" required value={formData.platform || ''} onChange={e => setFormData((f: any) => ({ ...f, platform: e.target.value }))} className={inputCls} placeholder="e.g. GitHub" />
                                  </div>
                                  <div>
                                    <label className={labelCls}>Icon (emoji)</label>
                                    <input type="text" value={formData.icon || ''} onChange={e => setFormData((f: any) => ({ ...f, icon: e.target.value }))} className={inputCls} placeholder="🐙" />
                                  </div>
                                </div>
                                <div>
                                  <label className={labelCls}>URL *</label>
                                  <input type="url" required value={formData.url || ''} onChange={e => setFormData((f: any) => ({ ...f, url: e.target.value }))} className={inputCls} placeholder="https://..." />
                                </div>
                                <div>
                                  <label className={labelCls}>Display Order</label>
                                  <input type="number" value={formData.order || '0'} onChange={e => setFormData((f: any) => ({ ...f, order: e.target.value }))} className={inputCls} min="0" />
                                </div>
                              </>)}

                              {/* Media upload */}
                              {activeTab !== 'social' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-4 border-t border-white/5">
                                  <MediaUploader
                                    label="Cover Image"
                                    type="image"
                                    value={formData.image || ''}
                                    onChange={(url) => setFormData((f: any) => ({ ...f, image: url }))}
                                  />
                                  <MediaUploader
                                    label="Video (optional)"
                                    type="video"
                                    value={formData.videoUrl || ''}
                                    onChange={(url) => setFormData((f: any) => ({ ...f, videoUrl: url }))}
                                  />
                                </div>
                              )}

                              <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={isSubmitting}
                                  className="flex-1 py-3 rounded-xl font-mono text-sm font-medium text-white transition-all
                                  bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40
                                  hover:border-purple-400/70 hover:shadow-[0_0_20px_rgba(157,0,255,0.15)]
                                  disabled:opacity-50 disabled:cursor-not-allowed">
                                  {isSubmitting ? '⏳ Processing...' : editId ? '✓ Update Record' : '+ Create Record'}
                                </button>
                                {editId && (
                                  <button type="button" onClick={() => { setEditId(null); setFormData({}); setShowForm(false); }}
                                    className="px-4 py-3 rounded-xl font-mono text-sm text-gray-400 border border-white/8 hover:bg-white/4 transition-all">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Records list */}
                {getListData().length > 0 ? (
                  <div className="space-y-2">
                    {/* DB records header */}
                    {dbOnline && (
                      <div className="text-[9px] font-mono text-gray-600 tracking-widest uppercase mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Database Records
                      </div>
                    )}
                    {getListData().filter((r: any) => !r._static).map((rec: any) => {
                      const isHidden = activeTab === 'social' ? rec.enabled === false : rec.visible === false;
                      const collection = activeTab === 'projects' ? 'projects' : activeTab === 'certs' ? 'certs' : activeTab === 'blog' ? 'blog' : 'social';
                      return (
                        <RecordRow key={rec._id}
                          title={rec.title || rec.platform || 'Untitled'}
                          subtitle={rec.issuer || rec.excerpt || rec.url || rec.category || rec.tags?.join(', ')}
                          isHidden={isHidden}
                          onToggleVisibility={() => handleToggleVisibility(collection as any, rec._id)}
                          onEdit={() => handleEdit(rec)}
                          onDelete={() => handleDelete(activeTab, rec._id, rec.title || rec.platform)}
                        />
                      );
                    })}
                    {/* Static records */}
                    {getListData().some((r: any) => r._static) && (
                      <>
                        <div className="text-[9px] font-mono text-gray-700 tracking-widest uppercase mt-5 mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />Built-in (Static) — Edit via code
                        </div>
                        {getListData().filter((r: any) => r._static).map((rec: any) => (
                          <RecordRow key={rec._id} title={rec.title || ''} subtitle={rec.issuer || rec.category || rec.tags?.join(', ')} isStatic />
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <EmptyState type={activeTab} />
                )}
              </div>
            )}

            {/* ── MESSAGES ───────────────────────────────────────── */}
            {activeTab === 'messages' && <MessagesTab showToast={showToast} />}

            {/* ── SITE CONTENT ───────────────────────────────────── */}
            {activeTab === 'content' && <ContentTab showToast={showToast} />}

            {/* ── USERS ──────────────────────────────────────────── */}
            {activeTab === 'users' && <UsersTab showToast={showToast} currentUserId={(session?.user as any)?.userId} />}

            {/* ── CREDENTIALS ────────────────────────────────────── */}
            {activeTab === 'settings' && (
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold text-white font-display mb-1">Credentials</h2>
                <p className="text-gray-500 text-sm mb-8">Update your admin username and password.</p>

                <div className="relative rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(6,6,16,0.97)', border: '1px solid rgba(157,0,255,0.18)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                  <form onSubmit={handleCredChange} className="p-8 space-y-5">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-950/20 border border-purple-500/10">
                      <span className="text-purple-400">◎</span>
                      <div>
                        <div className="text-[9px] font-mono text-gray-500 tracking-widest">CURRENT SESSION</div>
                        <div className="text-white text-sm font-medium">{session.user?.name}</div>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>New Username (leave blank to keep current)</label>
                      <input type="text" value={credForm.username} onChange={e => setCredForm(f => ({ ...f, username: e.target.value }))} className={inputCls} placeholder={session.user?.name || ''} />
                    </div>
                    <div>
                      <label className={labelCls}>New Password *</label>
                      <div className="relative">
                        <input type={showCredPass.new ? 'text' : 'password'} required value={credForm.newPassword} onChange={e => setCredForm(f => ({ ...f, newPassword: e.target.value }))} className={`${inputCls} pr-12`} placeholder="Min. 8 characters" minLength={8} />
                        <button type="button" onClick={() => setShowCredPass(v => ({ ...v, new: !v.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm">{showCredPass.new ? '🙈' : '👁'}</button>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Confirm New Password *</label>
                      <div className="relative">
                        <input type={showCredPass.confirm ? 'text' : 'password'} required value={credForm.confirmPassword}
                          onChange={e => setCredForm(f => ({ ...f, confirmPassword: e.target.value }))} className={`${inputCls} pr-12`}
                          style={{ borderColor: credForm.confirmPassword && credForm.newPassword !== credForm.confirmPassword ? 'rgba(239,68,68,0.5)' : '' }} />
                        <button type="button" onClick={() => setShowCredPass(v => ({ ...v, confirm: !v.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm">{showCredPass.confirm ? '🙈' : '👁'}</button>
                      </div>
                      {credForm.confirmPassword && credForm.newPassword !== credForm.confirmPassword && (
                        <p className="text-red-400 text-xs font-mono mt-1.5">✕ Passwords do not match</p>
                      )}
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-amber-950/20 border border-amber-500/15">
                      <p className="text-amber-400 text-xs font-mono">⚠ You will be signed out automatically after changing credentials.</p>
                    </div>
                    <button type="submit" disabled={credLoading || (!!credForm.confirmPassword && credForm.newPassword !== credForm.confirmPassword)}
                      className="w-full py-3.5 rounded-xl font-mono text-sm font-medium text-white transition-all
                      bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40
                      hover:border-purple-400/70 hover:shadow-[0_0_20px_rgba(157,0,255,0.15)]
                      disabled:opacity-40 disabled:cursor-not-allowed">
                      {credLoading ? '⏳ Updating...' : '✓ Update Credentials'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── OVERLAYS ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
      <AnimatePresence>
        {confirm && <ConfirmDialog msg={confirm.msg} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
      </AnimatePresence>
    </div>
  );
}
