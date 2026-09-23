import React, { useCallback, useEffect, useState } from 'react';
import { Leaf, LayoutDashboard, Inbox, MessageSquare, FileText, ListChecks, LogOut, User, Menu, X } from 'lucide-react';
import { api } from '../lib/api';
import { SETTINGS_SECTIONS, COLLECTIONS } from './schema';
import { inputCls } from './fields';
import { DashboardPage, QuotesPage, ContactsPage, SettingsPage, CollectionPage, AccountPage } from './pages';

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = useCallback((to) => {
    if (to !== window.location.pathname) window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);
  return [path, navigate];
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api('/admin/login', { method: 'POST', body: { username, password } });
      onLogin(r.data);
    } catch (err) {
      setError(err.status ? err.message : 'Không kết nối được máy chủ');
    } finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07150E]">
      <form onSubmit={submit} className="w-full max-w-sm bg-[#0D2B1D]/80 border border-white/10 rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-[#07150E]"><Leaf className="w-5 h-5" /></div>
          <div>
            <div className="font-serif text-xl font-bold text-white">Quản trị website</div>
            <div className="text-xs text-slate-400">Đăng nhập để tiếp tục</div>
          </div>
        </div>
        {error && <div className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</div>}
        <input className={inputCls} placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required />
        <input className={inputCls} type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        <button className="w-full py-2.5 rounded-lg bg-[#20E070] text-[#07150E] font-bold disabled:opacity-50" disabled={busy}>{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </div>
  );
}

const NAV = [
  { group: null, items: [{ to: '/admin', label: 'Tổng quan', icon: LayoutDashboard }] },
  { group: 'Khách hàng', items: [{ to: '/admin/quotes', label: 'Yêu cầu báo giá', icon: Inbox }, { to: '/admin/contacts', label: 'Liên hệ', icon: MessageSquare }] },
  { group: 'Nội dung trang', items: SETTINGS_SECTIONS.map((s) => ({ to: `/admin/content/${s.key}`, label: s.title, icon: FileText })) },
  { group: 'Danh sách', items: Object.entries(COLLECTIONS).map(([k, c]) => ({ to: `/admin/${k}`, label: c.title, icon: ListChecks })) },
];

export default function AdminApp() {
  const [me, setMe] = useState(undefined);
  const [path, rawNavigate] = usePath();
  const [toasts, setToasts] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Quản trị website';
    api('/admin/me').then((r) => setMe(r.data)).catch(() => setMe(null));
  }, []);

  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const toast = useCallback((text, isError = false) => {
    const id = Math.random();
    setToasts((t) => [...t, { id, text, isError }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), isError ? 6000 : 3000);
  }, []);

  const navigate = useCallback((to) => {
    if (dirty && !window.confirm('Bạn có thay đổi chưa lưu. Rời trang này?')) return;
    setDirty(false);
    setMenuOpen(false);
    rawNavigate(to);
  }, [dirty, rawNavigate]);

  const logout = async () => {
    try { await api('/admin/logout', { method: 'POST' }); } catch { /* ignore */ }
    setMe(null);
  };

  if (me === undefined) return <div className="min-h-screen bg-[#07150E]" />;
  if (me === null) return <Login onLogin={setMe} />;

  let page;
  const m = path.match(/^\/admin\/content\/([\w-]+)$/);
  const c = path.match(/^\/admin\/([\w-]+)$/);
  if (path === '/admin' || path === '/admin/') page = <DashboardPage navigate={navigate} />;
  else if (path === '/admin/quotes') page = <QuotesPage toast={toast} />;
  else if (path === '/admin/contacts') page = <ContactsPage toast={toast} />;
  else if (path === '/admin/account') page = <AccountPage me={me} toast={toast} />;
  else if (m) page = <SettingsPage key={m[1]} section={m[1]} toast={toast} setDirty={setDirty} />;
  else if (c && COLLECTIONS[c[1]]) page = <CollectionPage key={c[1]} name={c[1]} toast={toast} setDirty={setDirty} />;
  else page = <p className="text-slate-400">Không tìm thấy trang.</p>;

  const sidebar = (
    <nav className="space-y-5 text-sm">
      {NAV.map((g, gi) => (
        <div key={gi}>
          {g.group && <div className="px-3 mb-1 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{g.group}</div>}
          {g.items.map((it) => {
            const active = path === it.to || (it.to === '/admin' && path === '/admin/');
            const Icon = it.icon;
            return (
              <a key={it.to} href={it.to} onClick={(e) => { e.preventDefault(); navigate(it.to); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${active ? 'bg-[#20E070]/15 text-[#20E070] font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <Icon className="w-4 h-4 shrink-0" /><span className="truncate">{it.label}</span>
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#07150E] text-slate-100">
      <header className="sticky top-0 z-40 bg-[#081C15]/95 backdrop-blur border-b border-white/10 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-[#07150E]"><Leaf className="w-4 h-4" /></div>
          <span className="font-serif font-bold text-white">Quản trị website</span>
          <a href="/" target="_blank" rel="noreferrer" className="hidden sm:inline text-xs text-slate-400 hover:text-[#20E070] ml-2">Xem website ↗</a>
        </div>
        <div className="flex items-center gap-1">
          <a href="/admin/account" onClick={(e) => { e.preventDefault(); navigate('/admin/account'); }} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5">
            <User className="w-4 h-4" /><span className="hidden sm:inline">{me.displayName || me.username}</span>
          </a>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Đăng xuất</span></button>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 p-4 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">{sidebar}</aside>
        {menuOpen && <aside className="lg:hidden fixed inset-0 top-14 z-30 bg-[#081C15] p-4 overflow-y-auto">{sidebar}</aside>}
        <main className="flex-1 min-w-0 p-4 sm:p-8">{page}</main>
      </div>
      <div className="fixed bottom-4 right-4 z-[60] space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-3 rounded-xl text-sm shadow-2xl border ${t.isError ? 'bg-rose-950 border-rose-500/50 text-rose-200' : 'bg-[#0D2B1D] border-emerald-500/40 text-emerald-200'}`}>{t.text}</div>
        ))}
      </div>
    </div>
  );
}
