import { useEffect, useRef } from 'react';

/**
 * Custom hook for scroll reveal animations using IntersectionObserver.
 * Disabled if prefers-reduced-motion is active.
 * Defaults to visible state so content is never hidden if observer fails or JS is disabled.
 */
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion settings
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    // Apply initial hidden class after hydration/mount
    el.classList.add('lt-reveal-init');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lt-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, ...options });

    observer.observe(el);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chạy 1 lần khi gắn; options mới mỗi lần render không được làm observer khởi tạo lại

  return ref;
}
