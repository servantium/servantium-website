/**
 * CalBooker — Cal.com inline embed matching production servantium.com.
 * React wrapper for Astro island hydration (client:visible).
 */
import { useEffect, useRef } from "react";

export default function CalBooker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !containerRef.current) return;
    initialized.current = true;

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
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      script.onload = () => setTimeout(initEmbed, 100);
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
    />
  );
}
