import { useMemo, useState } from "react";
import moment from "moment";

export const useOverviewFilter = (overview, activeLink, sorting) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const data = useMemo(() => {
    if (!overview) return [];

    const items = [];

    // ───────────── ANOMALIES ─────────────
    overview.anomalies?.spike?.forEach((a, i) =>
      items.push({ ...a, _type: "spike", _key: `spike_${i}` }),
    );

    overview.anomalies?.duplication?.forEach((a, i) =>
      items.push({ ...a, _type: "duplicate", _key: `dup_${i}` }),
    );

    overview.anomalies?.temporal?.forEach((a, i) =>
      items.push({ ...a, _type: "temporal", _key: `temp_${i}` }),
    );

    overview.anomalies?.recurring?.forEach((a, i) =>
      items.push({ ...a, _type: "recurring_amount", _key: `rec_${i}` }),
    );

    // ───────────── WARNINGS ─────────────
    overview.warnings?.forEach((w, i) => {
      const isBudget = ["Exceeded", "Expired", "Inactive budget"].includes(
        w.type,
      );

      items.push({
        ...w,
        _type: isBudget ? "warning_budget" : "warning_expense",
        _key: `warn_${i}`,
      });
    });

    // ───────────── FORECASTS ─────────────
    overview.forecasts?.forEach((f, i) =>
      items.push({
        ...f,
        name: f.ftype,
        message: f.fmessage,
        _type: "tip_forecast",
        _key: `forecast_${i}`,
      }),
    );

    // ───────────── TIPS ─────────────
    overview.tips?.forEach((t, i) =>
      items.push({
        ...t,
        _type: "tip",
        _key: `tip_${i}`,
      }),
    );

    // ───────────── FILTER BY TAB ─────────────
    let result = items;

    if (activeLink !== "All") {
      result = items.filter((item) => {
        switch (activeLink) {
          case "Warnings":
            return item._type.includes("warning");

          case "Forecasts":
            return item._type === "tip_forecast";

          case "Tips":
            return item._type === "tip";

          case "Anomalies":
            return [
              "spike",
              "duplicate",
              "temporal",
              "recurring_amount",
            ].includes(item._type);

          default:
            return true;
        }
      });
    }

    // ───────────── SORTING ─────────────
    result = [...result].sort((a, b) => {
      const ta = a.created_at ? moment(a.created_at).valueOf() : 0;
      const tb = b.created_at ? moment(b.created_at).valueOf() : 0;
      return tb - ta;
    });

    if (sorting === "Previous") {
      result = result.reverse();
    }

    return result;
  }, [overview, activeLink, sorting]);

  // ───────────── PAGINATION ─────────────
  const finalData = activeLink === "All" ? data.slice(0, visibleCount) : data;

  const hasMore = activeLink === "All" && visibleCount < data.length;

  return {
    data: finalData,
    hasMore,
    loadMore: () => setVisibleCount((prev) => prev + 10),
  };
};
