import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalBooker() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "servantium-introduction" });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#00C26D" },
          dark: { "cal-brand": "#F5F6F7" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace="servantium-introduction"
      calLink="christopher-veale/servantium-introduction"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        theme: "light",
      }}
    />
  );
}
