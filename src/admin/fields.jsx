import React, { useRef, useState } from 'react';
import { ArrowUp, ArrowDown, Plus, Trash2, Upload, Scissors, Trees, Sparkles, Wind, Shovel, Droplets, ExternalLink } from 'lucide-react';
import THEMES from '../../shared/themes.json';
import { api } from '../lib/api';

export const inputCls = 'w-full bg-[#07150E] border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:border-[#20E070] focus:outline-none';
const smallBtn = 'p-1.5 rounded-md border border-white/10 text-slate-300 hover:text-white hover:border-white/30 disabled:opacity-30';

export const ICONS = { Scissors, Trees, Sparkles, Wind, Shovel, Droplets };

export function Field({ field, value, onChange, disabled }) {
  const { type } = field;
  let control;
  if (type === 'textarea') control = <textarea rows={3} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={disabled} />;
  else if (type === 'number') control = <input type="number" className={inputCls} value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} disabled={disabled} />;
  else if (type === 'bool') control = (
    <label className="inline-flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 accent-[#20E070]" checked={!!value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      {value ? 'Visible' : 'Hidden'}
    </label>
  );
  else if (type === 'image') control = <ImageField value={value} onChange={onChange} />;
  else if (type === 'list') control = <StringList value={value || []} onChange={onChange} />;
  else if (type === 'stats') control = <ObjectList value={value || []} onChange={onChange} columns={[['value', 'Value'], ['label', 'Label']]} />;
  else if (type === 'links') control = <ObjectList value={value || []} onChange={onChange} columns={[['label', 'Label'], ['href', 'Link (e.g. #contact)']]} />;
  else if (type === 'icon') control = <IconPicker value={value} onChange={onChange} />;
  else if (type === 'theme') control = <ThemePicker value={value} onChange={onChange} />;
  else control = <input type="text" className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={disabled} />;

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300">{field.label}</label>
      {control}
      {field.help && <p className="text-[11px] text-slate-500">{field.help}</p>}
    </div>
  );
}

function move(arr, i, d) {
  const next = [...arr];
  const j = i + d;
  if (j < 0 || j >= next.length) return next;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function StringList({ value, onChange }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} value={item} onChange={(e) => onChange(value.map((v, k) => (k === i ? e.target.value : v)))} />
          <button type="button" className={smallBtn} onClick={() => onChange(move(value, i, -1))} disabled={i === 0} title="Up"><ArrowUp className="w-4 h-4" /></button>
          <button type="button" className={smallBtn} onClick={() => onChange(move(value, i, 1))} disabled={i === value.length - 1} title="Down"><ArrowDown className="w-4 h-4" /></button>
          <button type="button" className={smallBtn} onClick={() => onChange(value.filter((_, k) => k !== i))} title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} className="text-xs text-[#20E070] inline-flex items-center gap-1 hover:underline"><Plus className="w-3.5 h-3.5" />Add row</button>
    </div>
  );
}

function ObjectList({ value, onChange, columns }) {
  const set = (i, key, v) => onChange(value.map((row, k) => (k === i ? { ...row, [key]: v } : row)));
  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex gap-2">
          {columns.map(([key, ph]) => (
            <input key={key} className={inputCls} placeholder={ph} value={row[key] ?? ''} onChange={(e) => set(i, key, e.target.value)} />
          ))}
          <button type="button" className={smallBtn} onClick={() => onChange(move(value, i, -1))} disabled={i === 0} title="Up"><ArrowUp className="w-4 h-4" /></button>
          <button type="button" className={smallBtn} onClick={() => onChange(move(value, i, 1))} disabled={i === value.length - 1} title="Down"><ArrowDown className="w-4 h-4" /></button>
          <button type="button" className={smallBtn} onClick={() => onChange(value.filter((_, k) => k !== i))} title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, Object.fromEntries(columns.map(([k]) => [k, '']))])} className="text-xs text-[#20E070] inline-flex items-center gap-1 hover:underline"><Plus className="w-3.5 h-3.5" />Add row</button>
    </div>
  );
}

function ImageField({ value, onChange }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const r = await api('/admin/upload', { method: 'POST', form });
      onChange(r.data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-3 items-start">
      <div className="w-24 h-16 rounded-md border border-white/15 bg-black/30 overflow-hidden shrink-0 flex items-center justify-center">
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-500">No image</span>}
      </div>
      <div className="flex-1 space-y-2">
        <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/... or https://..." />
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white inline-flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />{busy ? 'Uploading...' : 'Upload image'}
          </button>
          <span className="text-[11px] text-slate-500">JPG, PNG, WEBP, GIF · max 5 MB</span>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    </div>
  );
}

function IconPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(ICONS).map(([name, Icon]) => (
        <button key={name} type="button" onClick={() => onChange(name)} title={name}
          className={`w-11 h-11 rounded-lg border flex items-center justify-center ${value === name ? 'border-[#20E070] bg-[#20E070]/15 text-[#20E070]' : 'border-white/15 text-slate-300 hover:border-white/40'}`}>
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
}

// Chọn giao diện: mỗi theme 1 dòng, có nút xem trước (mở tab mới với ?theme=<id>, không đổi cho khách).
function ThemePicker({ value, onChange }) {
  return (
    <div className="space-y-2">
      {THEMES.map((t) => (
        <div key={t.id} className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${value === t.id ? 'border-[#20E070] bg-[#20E070]/10' : 'border-white/15'}`}>
          <label className="flex items-center gap-2.5 text-sm text-slate-200 cursor-pointer">
            <input type="radio" name="theme-active" className="w-4 h-4 accent-[#20E070]" checked={value === t.id} onChange={() => onChange(t.id)} />
            <span>{t.label}</span>
          </label>
          <a href={`/?theme=${t.id}`} target="_blank" rel="noreferrer" className="text-xs text-[#20E070] inline-flex items-center gap-1 hover:underline shrink-0">
            Preview <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ))}
    </div>
  );
}
