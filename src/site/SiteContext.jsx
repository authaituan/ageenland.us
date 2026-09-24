import React, { createContext, useContext, useEffect, useState } from 'react';
import DEFAULTS from '../../shared/defaultContent.json';
import { api } from '../lib/api';

// Content shown on the website. Loaded from the CMS (/api/site);
// falls back to the built-in defaults (= original hardcoded content) if the API is unreachable.
const SiteContext = createContext(DEFAULTS);

function merge(remote) {
  const settings = {};
  for (const [section, def] of Object.entries(DEFAULTS.settings)) {
    settings[section] = { ...def, ...(remote?.settings?.[section] || {}) };
  }
  const pick = (k) => (Array.isArray(remote?.[k]) ? remote[k] : DEFAULTS[k]);
  return {
    settings,
    services: pick('services'),
    frequencyOptions: pick('frequencyOptions'),
    projects: pick('projects'),
    testimonials: pick('testimonials'),
  };
}

export function SiteProvider({ children }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let done = false;
    const finish = (remote) => {
      if (done) return;
      done = true;
      setContent(merge(remote));
    };
    // Don't block the page forever if the backend is down.
    const timer = setTimeout(() => finish(null), 4000);
    api('/site')
      .then((r) => finish(r.data))
      .catch((err) => {
        console.warn('CMS API unavailable, using default content:', err.message);
        finish(null);
      })
      .finally(() => clearTimeout(timer));
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!content) return;
    const { title, meta_description } = content.settings.site;
    if (title) document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (meta_description) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = meta_description;
    }
  }, [content]);

  if (!content) return null;
  return <SiteContext.Provider value={content}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
