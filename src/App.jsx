import React, { Suspense, lazy, useEffect } from 'react';
import THEMES from '../shared/themes.json';
import { useSite } from './site/SiteContext';
import ClassicApp from './themes/classic/ClassicApp';

// Chọn giao diện (theme) theo CMS: General → Theme → "Active theme" (settings.theme.active).
// Xem trước theme khác mà không đổi cho khách: thêm ?theme=<id> vào địa chỉ, ví dụ /?theme=light.
// Theme mới chỉ tải khi được dùng, nên không làm nặng giao diện đang chạy.
const LightApp = lazy(() => import('./themes/light/LightApp'));
const APPS = { classic: ClassicApp, light: LightApp };

function resolveTheme(active) {
  const valid = (id) => THEMES.some((t) => t.id === id) && id in APPS;
  let preview = null;
  try { preview = new URLSearchParams(window.location.search).get('theme'); } catch { /* ignore */ }
  if (valid(preview)) return preview;
  return valid(active) ? active : 'classic';
}

export default function App() {
  const { settings } = useSite();
  const theme = resolveTheme(settings.theme?.active);
  const Theme = APPS[theme];

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <Suspense fallback={null}>
      <Theme />
    </Suspense>
  );
}
