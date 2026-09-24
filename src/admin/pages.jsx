import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, RefreshCw, Eye, EyeOff, X } from 'lucide-react';
import { api } from '../lib/api';
import { SETTINGS_SECTIONS, COLLECTIONS } from './schema';
import { Field, inputCls } from './fields';
import { formatMoney } from '../lib/format';

const card = 'bg-[#0D2B1D]/70 border border-white/10 rounded-2xl';
const btnPrimary = 'px-4 py-2 rounded-lg bg-[#20E070] text-[#07150E] text-sm font-bold hover:brightness-110 disabled:opacity-50';
const btnGhost = 'px-3 py-2 rounded-lg border border-white/15 text-sm text-slate-200 hover:border-white/40 disabled:opacity-50';

function useLoad(fn, deps) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    fn().then((data) => setState({ loading: false, data, error: null })).catch((error) => setState({ loading: false, data: null, error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { reload(); }, [reload]);
  return [state, reload];
}

export function PageHeader({ title, desc, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">{title}</h1>
        {desc && <p className="text-sm text-slate-400 mt-1 max-w-3xl">{desc}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

// Formatting follows the CMS settings (General & SEO → locale / currency code), loaded once per session.
let formatCache = null;
function useFormat() {
  const [site, setSite] = useState(formatCache || { site: {}, calculator: {} });
  useEffect(() => {
    if (formatCache) return;
    api('/admin/settings').then((r) => { formatCache = r.data; setSite(r.data); }).catch(() => {});
  }, []);
  const locale = site.site?.locale || 'en-US';
  return {
    money: (n) => formatMoney(n, site.site),
    date: (s) => (s ? new Date(s.replace(' ', 'T') + 'Z').toLocaleString(locale) : ''),
    areaUnit: site.calculator?.area_unit || 'sq ft',
    locale,
  };
}

// ---------------- Dashboard ----------------
export function DashboardPage({ navigate }) {
  const [{ data }] = useLoad(() => api('/admin/summary').then((r) => r.data), []);
  const tiles = [
    { label: 'Pending quotes', value: data?.quotes.pending, total: data?.quotes.total, to: '/admin/quotes' },
    { label: 'New contacts', value: data?.contacts.pending, total: data?.contacts.total, to: '/admin/contacts' },
  ];
  return (
    <div>
      <PageHeader title="Dashboard" desc="Manage customer requests and all content shown on the website." />
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {tiles.map((t) => (
          <button key={t.label} onClick={() => navigate(t.to)} className={`${card} p-5 text-left hover:border-emerald-500/40`}>
            <div className="text-sm text-slate-400">{t.label}</div>
            <div className="text-3xl font-serif font-bold text-[#20E070] mt-1">{t.value ?? '–'}</div>
            <div className="text-xs text-slate-500 mt-1">Total: {t.total ?? '–'}</div>
          </button>
        ))}
      </div>
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Edit website content</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SETTINGS_SECTIONS.map((s) => (
          <button key={s.key} onClick={() => navigate(`/admin/content/${s.key}`)} className={`${card} p-4 text-left hover:border-emerald-500/40`}>
            <div className="text-sm font-semibold text-white">{s.title}</div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-2">{s.desc}</div>
          </button>
        ))}
        {Object.entries(COLLECTIONS).map(([k, c]) => (
          <button key={k} onClick={() => navigate(`/admin/${k}`)} className={`${card} p-4 text-left hover:border-emerald-500/40`}>
            <div className="text-sm font-semibold text-white">{c.title}</div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-2">{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Quotes ----------------
const QUOTE_STATUS = {
  Pending: ['Pending', 'bg-amber-500/15 text-amber-300 border-amber-500/30'],
  Confirmed: ['Confirmed', 'bg-sky-500/15 text-sky-300 border-sky-500/30'],
  Completed: ['Completed', 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'],
  Cancelled: ['Cancelled', 'bg-slate-500/15 text-slate-300 border-slate-500/30'],
};

export function QuotesPage({ toast }) {
  const { money, date: fmtDate, areaUnit, locale } = useFormat();
  const [{ data, loading, error }, reload] = useLoad(() => api('/admin/quotes').then((r) => r.data), []);
  const [filter, setFilter] = useState('');
  const rows = useMemo(() => (data || []).filter((q) => !filter || q.status === filter), [data, filter]);

  const setStatus = async (id, status) => {
    try { await api(`/admin/quotes/${id}`, { method: 'PATCH', body: { status } }); toast('Status updated'); reload(); }
    catch (e) { toast(e.message, true); }
  };

  return (
    <div>
      <PageHeader title="Quote requests" desc="Sent from the quote calculator. Prices are recalculated by the server using the current price list."
        actions={<button className={btnGhost} onClick={reload}><RefreshCw className={`w-4 h-4 inline mr-1 ${loading ? 'animate-spin' : ''}`} />Reload</button>} />
      <div className="flex flex-wrap gap-2 mb-4">
        {[['', 'All'], ...Object.entries(QUOTE_STATUS).map(([k, v]) => [k, v[0]])].map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs border ${filter === k ? 'bg-[#20E070] text-[#07150E] border-[#20E070] font-bold' : 'border-white/15 text-slate-300'}`}>
            {label} {data && <span className="opacity-70">({(k ? data.filter((q) => q.status === k) : data).length})</span>}
          </button>
        ))}
      </div>
      {error && <p className="text-rose-400 text-sm">{error.message}</p>}
      {!loading && rows.length === 0 && <p className="text-slate-400 text-sm">No requests yet.</p>}
      <div className="space-y-3">
        {rows.map((q) => {
          const [label, cls] = QUOTE_STATUS[q.status] || [q.status, 'border-white/20 text-slate-300'];
          return (
            <div key={q.id} className={`${card} p-4 grid lg:grid-cols-12 gap-4`}>
              <div className="lg:col-span-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">#{q.id}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>
                </div>
                <div className="font-semibold text-white">{q.fullName}</div>
                <div className="text-sm"><a className="text-[#20E070] hover:underline" href={`tel:${q.phone}`}>{q.phone}</a>{q.email && <span className="text-slate-400"> · {q.email}</span>}</div>
                <div className="text-xs text-slate-400">{q.address}</div>
              </div>
              <div className="lg:col-span-5 text-sm text-slate-300 space-y-1">
                <div><span className="text-slate-500">Service:</span> {q.serviceName}</div>
                <div><span className="text-slate-500">Area:</span> {Number(q.gardenArea || 0).toLocaleString(locale)} {areaUnit} · <span className="text-slate-500">Frequency:</span> {q.frequency}</div>
                <div><span className="text-slate-500">Estimate:</span> <span className="text-[#20E070] font-bold">{money(q.estimatedCost)}</span></div>
                {q.preferredDate && <div><span className="text-slate-500">Site visit date:</span> {q.preferredDate}</div>}
                {q.notes && <div className="text-xs text-slate-400 italic">“{q.notes}”</div>}
                <div className="text-[11px] text-slate-500">Sent {fmtDate(q.createdAt)}</div>
              </div>
              <div className="lg:col-span-3 flex lg:flex-col gap-2 lg:items-end">
                {Object.entries(QUOTE_STATUS).filter(([k]) => k !== q.status).map(([k, v]) => (
                  <button key={k} onClick={() => setStatus(q.id, k)} className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 hover:border-[#20E070]">→ {v[0]}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Contacts ----------------
export function ContactsPage({ toast }) {
  const { date: fmtDate } = useFormat();
  const [{ data, loading, error }, reload] = useLoad(() => api('/admin/contacts').then((r) => r.data), []);
  const setStatus = async (id, status) => {
    try { await api(`/admin/contacts/${id}`, { method: 'PATCH', body: { status } }); reload(); }
    catch (e) { toast(e.message, true); }
  };
  return (
    <div>
      <PageHeader title="Contacts & site visit requests" desc="Messages from the contact form and phone numbers left in the hero site-visit card."
        actions={<button className={btnGhost} onClick={reload}><RefreshCw className={`w-4 h-4 inline mr-1 ${loading ? 'animate-spin' : ''}`} />Reload</button>} />
      {error && <p className="text-rose-400 text-sm">{error.message}</p>}
      {!loading && data?.length === 0 && <p className="text-slate-400 text-sm">No contacts yet.</p>}
      <div className="space-y-3">
        {(data || []).map((c) => (
          <div key={c.id} className={`${card} p-4 flex flex-wrap gap-4 justify-between ${c.status === 'Done' ? 'opacity-60' : ''}`}>
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">#{c.id}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${c.source === 'hero' ? 'border-sky-500/30 text-sky-300 bg-sky-500/10' : 'border-white/20 text-slate-300'}`}>{c.source === 'hero' ? 'Quick site visit request' : 'Contact form'}</span>
                {c.status === 'New' && <span className="text-[11px] px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-300 bg-amber-500/10">New</span>}
              </div>
              <div className="font-semibold text-white">{c.name}</div>
              <div className="text-sm"><a className="text-[#20E070] hover:underline" href={`tel:${c.phone}`}>{c.phone}</a>{c.email && <span className="text-slate-400"> · {c.email}</span>}</div>
              <p className="text-sm text-slate-300 whitespace-pre-line">{c.message}</p>
              <div className="text-[11px] text-slate-500">{fmtDate(c.createdAt)}</div>
            </div>
            <div>
              {c.status === 'New'
                ? <button onClick={() => setStatus(c.id, 'Done')} className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 hover:border-[#20E070]">Mark as handled</button>
                : <button onClick={() => setStatus(c.id, 'New')} className="text-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-400 hover:border-white/40">Mark as new</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Settings section editor ----------------
export function SettingsPage({ section, toast, setDirty }) {
  const def = SETTINGS_SECTIONS.find((s) => s.key === section);
  const [{ data, error }, reload] = useLoad(() => api('/admin/settings').then((r) => r.data[section]), [section]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) { setForm(data); setDirty(false); } }, [data, setDirty]);

  if (!def) return <p className="text-slate-400">Section not found.</p>;
  if (error) return <p className="text-rose-400">{error.message}</p>;
  if (!form) return <p className="text-slate-400">Loading...</p>;

  const dirty = JSON.stringify(form) !== JSON.stringify(data);
  const save = async () => {
    setSaving(true);
    try {
      await api(`/admin/settings/${section}`, { method: 'PUT', body: form });
      formatCache = null;
      toast('Saved. Reload the website to see your changes.');
      reload();
    } catch (e) { toast(e.message, true); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title={def.title} desc={def.desc}
        actions={<>
          <a href="/" target="_blank" rel="noreferrer" className={btnGhost}>View website ↗</a>
          <button className={btnGhost} disabled={!dirty || saving} onClick={() => { setForm(data); setDirty(false); }}>Undo</button>
          <button className={btnPrimary} disabled={!dirty || saving} onClick={save}>{saving ? 'Saving...' : 'Save changes'}</button>
        </>} />
      <div className={`${card} p-5 sm:p-6 grid md:grid-cols-2 gap-5`}>
        {def.fields.map((f) => (
          <div key={f.key} className={['textarea', 'image', 'list', 'stats', 'links'].includes(f.type) ? 'md:col-span-2' : ''}>
            <Field field={f} value={form[f.key]} onChange={(v) => { setForm((x) => ({ ...x, [f.key]: v })); setDirty(true); }} />
          </div>
        ))}
      </div>
      {dirty && <div className="sticky bottom-4 mt-4 flex justify-end"><button className={`${btnPrimary} shadow-xl`} disabled={saving} onClick={save}>{saving ? 'Saving...' : 'Save changes'}</button></div>}
    </div>
  );
}

// ---------------- Collection editor ----------------
export function CollectionPage({ name, toast, setDirty }) {
  const { money } = useFormat();
  const def = COLLECTIONS[name];
  const [{ data, loading, error }, reload] = useLoad(() => api(`/admin/content/${name}`).then((r) => r.data), [name]);
  const [editing, setEditing] = useState(null); // item object (id undefined = new)
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { setEditing(null); setDirty(false); }, [name, setDirty]);
  if (!def) return <p className="text-slate-400">Section not found.</p>;

  const items = data || [];
  const isNew = editing && editing.id === undefined;

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...editing };
      delete body.id;
      if (!isNew) delete body.slug;
      if (isNew) await api(`/admin/content/${name}`, { method: 'POST', body });
      else await api(`/admin/content/${name}/${editing.id}`, { method: 'PUT', body });
      toast(isNew ? 'Created' : 'Saved');
      setEditing(null);
      setDirty(false);
      reload();
    } catch (e) { toast(e.message, true); }
    finally { setSaving(false); }
  };

  const reorder = async (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((x) => x.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    try { await api(`/admin/content/${name}/reorder`, { method: 'PUT', body: { ids } }); reload(); }
    catch (e) { toast(e.message, true); }
  };

  const toggle = async (item) => {
    try { await api(`/admin/content/${name}/${item.id}`, { method: 'PUT', body: { isActive: !item.isActive } }); reload(); }
    catch (e) { toast(e.message, true); }
  };

  const remove = async (item) => {
    try { await api(`/admin/content/${name}/${item.id}`, { method: 'DELETE' }); toast('Deleted'); setConfirmDelete(null); reload(); }
    catch (e) { toast(e.message, true); }
  };

  return (
    <div>
      <PageHeader title={def.title} desc={def.desc}
        actions={<>
          <a href="/" target="_blank" rel="noreferrer" className={btnGhost}>View website ↗</a>
          <button className={btnPrimary} onClick={() => { setEditing({ ...def.empty }); setDirty(true); }}><Plus className="w-4 h-4 inline mr-1" />Add new</button>
        </>} />
      {error && <p className="text-rose-400 text-sm">{error.message}</p>}
      {loading && !data && <p className="text-slate-400 text-sm">Loading...</p>}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className={`${card} p-3 flex items-center gap-3 ${item.isActive ? '' : 'opacity-50'}`}>
            <div className="flex flex-col gap-1">
              <button className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20" disabled={i === 0} onClick={() => reorder(i, -1)} title="Up"><ArrowUp className="w-4 h-4" /></button>
              <button className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20" disabled={i === items.length - 1} onClick={() => reorder(i, 1)} title="Down"><ArrowDown className="w-4 h-4" /></button>
            </div>
            {(item.image || item.avatar) && <img src={item.image || item.avatar} alt="" className="w-16 h-12 rounded-md object-cover border border-white/10" />}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{def.itemTitle(item)}</div>
              <div className="text-xs text-slate-400 truncate">{def.itemSub(item, money)}</div>
            </div>
            {confirmDelete === item.id ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300">Delete permanently?</span>
                <button className="text-xs px-2 py-1 rounded bg-rose-500 text-white" onClick={() => remove(item)}>Delete</button>
                <button className="text-xs px-2 py-1 rounded border border-white/15 text-slate-300" onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10" onClick={() => toggle(item)} title={item.isActive ? 'Hide from website' : 'Show on website'}>
                  {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10" onClick={() => { setEditing({ ...item }); setDirty(false); }} title="Edit"><Pencil className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-white/10" onClick={() => setConfirmDelete(item.id)} title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        ))}
        {!loading && items.length === 0 && <p className="text-slate-400 text-sm">No items yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end" onClick={() => !saving && setEditing(null)}>
          <div className="w-full max-w-2xl h-full overflow-y-auto bg-[#081C15] border-l border-white/10 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-white">{isNew ? 'Add new' : 'Edit'} – {def.title}</h2>
              <button className="p-2 rounded-lg text-slate-300 hover:bg-white/10" onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-5">
              {def.fields.map((f) => (
                <Field key={f.key} field={f} value={editing[f.key]} disabled={f.createOnly && !isNew}
                  onChange={(v) => { setEditing((x) => ({ ...x, [f.key]: v })); setDirty(true); }} />
              ))}
            </div>
            <div className="sticky bottom-0 bg-[#081C15] pt-4 mt-6 border-t border-white/10 flex justify-end gap-2">
              <button className={btnGhost} onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button className={btnPrimary} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Account ----------------
export function AccountPage({ me, toast }) {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (next !== again) return toast('Passwords do not match', true);
    setBusy(true);
    try {
      await api('/admin/password', { method: 'POST', body: { currentPassword: cur, newPassword: next } });
      toast('Password changed');
      setCur(''); setNext(''); setAgain('');
    } catch (err) { toast(err.message, true); }
    finally { setBusy(false); }
  };
  return (
    <div className="max-w-md">
      <PageHeader title="Account" desc={`Signed in as: ${me.displayName || me.username} (${me.username})`} />
      <form onSubmit={submit} className={`${card} p-6 space-y-4`}>
        <h2 className="text-sm font-semibold text-white">Change password</h2>
        <input type="password" className={inputCls} placeholder="Current password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" required />
        <input type="password" className={inputCls} placeholder="New password (at least 8 characters)" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={8} required />
        <input type="password" className={inputCls} placeholder="Confirm new password" value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" required />
        <button className={btnPrimary} disabled={busy}>{busy ? 'Saving...' : 'Change password'}</button>
      </form>
    </div>
  );
}
