/**
 * CalBooker — Cal.com inline embed using embed.js.
 * React wrapper for Astro island hydration (client:visible).
 * Uses the standard embed script, NOT @calcom/embed-react (which crashes Vite dev server).
 */
import { useEffect, useRef } from "react";

export default function CalBooker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

    // Load Cal.com embed script if not already loaded
    const win = window as any;

    function initEmbed() {
      if (!win.Cal) return;

      win.Cal("init", "servantium-introduction", { origin: "https://app.cal.com" });

      win.Cal.ns["servantium-introduction"]("inline", {
        elementOrSelector: containerRef.current,
        calLink: "christopher-veale/servantium-introduction",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "light" },
      });

      win.Cal.ns["servantium-introduction"]("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#00C26D" },
          dark: { "cal-brand": "#F5F6F7" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    }

    if (win.Cal) {
      initEmbed();
    } else {
      // Load the script
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onload = () => {
        // Cal.com script sets up window.Cal via IIFE
        setTimeout(initEmbed, 100);
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", minHeight: "450px" }}
    />
  );
}
