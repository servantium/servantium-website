/**
 * CalBooker — Cal.com inline embed using their official embed script.
 * React component wrapper for Astro island hydration.
 * Uses Cal.com's embed.js (not atoms) for public booking pages.
 */
import { useEffect, useRef } from 'react';

interface CalBookerProps {
  calLink?: string;
}

export default function CalBooker({ calLink = "christopher-veale/servantium-introduction" }: CalBookerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

    // Load Cal.com embed script
    const Cal = (window as any).Cal;
    if (!Cal) {
      // Load the script first
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      script.onload = () => {
        initCal();
      };
      document.head.appendChild(script);
    } else {
      initCal();
    }

    function initCal() {
      const C = (window as any);
      if (!C.Cal) return;

      C.Cal("init", "servantium-introduction", { origin: "https://app.cal.com" });

      C.Cal.ns["servantium-introduction"]("inline", {
        elementOrSelector: containerRef.current,
        calLink: calLink,
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "light" },
      });

      C.Cal.ns["servantium-introduction"]("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#00C26D" },
          dark: { "cal-brand": "#00C26D" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    }
  }, [calLink]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        overflow: 'scroll',
      }}
    />
  );
}
