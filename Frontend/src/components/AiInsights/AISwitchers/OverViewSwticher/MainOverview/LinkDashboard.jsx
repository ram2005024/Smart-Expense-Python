import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useOverviewFilter } from "../../../../../hooks/useOverviewFilter";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import {
  AlertTriangle,
  Lightbulb,
  Copy,
  Clock,
  RefreshCw,
  Zap,
  CheckCircle,
  Sparkles,
  X,
  ArrowUpRight,
} from "lucide-react";

// ─────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────
const fmt = (n) => `Rs. ${new Intl.NumberFormat("en-NP").format(n ?? 0)}`;
const timeFrom = (iso) => (iso ? moment(iso).fromNow() : "");

// ─────────────────────────────────────────
// UI CONFIG
// ─────────────────────────────────────────
const UI_MAP = {
  spike: {
    icon: AlertTriangle,
    accent: "#ea7c3a",
    iconBg: "#fff5ed",
    iconColor: "#ea7c3a",
    badgeBg: "#fff0e3",
    badgeColor: "#c85c10",
    label: "Anomaly",
  },
  duplicate: {
    icon: Copy,
    accent: "#8b5cf6",
    iconBg: "#f5f3ff",
    iconColor: "#8b5cf6",
    badgeBg: "#ede9fe",
    badgeColor: "#6d28d9",
    label: "Duplicate",
  },
  temporal: {
    icon: Clock,
    accent: "#ef4444",
    iconBg: "#fff1f1",
    iconColor: "#ef4444",
    badgeBg: "#fee2e2",
    badgeColor: "#b91c1c",
    label: "Risk",
  },
  recurring_amount: {
    icon: RefreshCw,
    accent: "#22c55e",
    iconBg: "#f0fdf4",
    iconColor: "#22c55e",
    badgeBg: "#dcfce7",
    badgeColor: "#15803d",
    label: "Recurring",
  },
  warning_budget: {
    icon: AlertTriangle,
    accent: "#f59e0b",
    iconBg: "#fffbeb",
    iconColor: "#f59e0b",
    badgeBg: "#fef3c7",
    badgeColor: "#b45309",
    label: "Budget",
  },
  warning_expense: {
    icon: Zap,
    accent: "#ef4444",
    iconBg: "#fff1f1",
    iconColor: "#ef4444",
    badgeBg: "#fee2e2",
    badgeColor: "#b91c1c",
    label: "Warning",
  },
  tip: {
    icon: Lightbulb,
    accent: "#3b82f6",
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
    badgeBg: "#dbeafe",
    badgeColor: "#1d4ed8",
    label: "Tip",
  },
  tip_forecast: {
    icon: Sparkles,
    accent: "#6366f1",
    iconBg: "#eef2ff",
    iconColor: "#6366f1",
    badgeBg: "#e0e7ff",
    badgeColor: "#4338ca",
    label: "Forecast",
  },
};

// ─────────────────────────────────────────
// CARD
// ─────────────────────────────────────────
const AlertCard = ({ item, onDismiss }) => {
  const cfg = UI_MAP[item._type] || UI_MAP.spike;
  const Icon = cfg.icon;
  const message = item.message || item.tip_message || null;
  const amountFmt =
    item.expense_amount != null ? fmt(item.expense_amount) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "relative",
        background: "#ffffff",
        border: "0.5px solid rgba(0,0,0,0.09)",
        borderRadius: 16,
        padding: "15px 15px 13px 18px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        cursor: "default",
      }}
    >
      {/* Accent stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: cfg.accent,
          borderRadius: "16px 0 0 16px",
        }}
      />

      {/* TOP ROW */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
          {/* Icon bubble */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: cfg.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={15} style={{ color: cfg.iconColor, strokeWidth: 2 }} />
          </div>

          {/* Name + timestamp */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#1a1916",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {item.name || item.expense_name || "Insight"}
            </p>
            <span style={{ fontSize: 11, color: "#9e9b95" }}>
              {timeFrom(item.created_at)}
            </span>
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(item._key)}
          style={{
            background: "none",
            border: "none",
            width: 24,
            height: 24,
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#9e9b95",
            flexShrink: 0,
            padding: 0,
            transition: "background 0.12s ease, color 0.12s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.06)";
            e.currentTarget.style.color = "#1a1916";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#9e9b95";
          }}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <p
          style={{
            fontSize: 13,
            color: "#6b6963",
            lineHeight: 1.65,
            margin: "10px 0 0",
            paddingLeft: 47,
          }}
        >
          {message}
        </p>
      )}

      {/* BOTTOM ROW — badge + amount + review */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
          paddingLeft: 47,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* Type badge */}
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 100,
              background: cfg.badgeBg,
              color: cfg.badgeColor,
              letterSpacing: "0.02em",
            }}
          >
            {cfg.label}
          </span>

          {/* Amount pill */}
          {amountFmt && (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 500,
                color: "#6b6963",
                background: "rgba(0,0,0,0.04)",
                border: "0.5px solid rgba(0,0,0,0.08)",
                padding: "2px 8px",
                borderRadius: 8,
              }}
            >
              {amountFmt}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────
const EmptyState = ({ activeLink }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "52px 24px",
      background: "#ffffff",
      border: "0.5px solid rgba(0,0,0,0.08)",
      borderRadius: 16,
      gap: 8,
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 42,
        height: 42,
        background: "#f0fdf4",
        borderRadius: 13,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
      }}
    >
      <CheckCircle size={20} style={{ color: "#22c55e" }} />
    </div>
    <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1916", margin: 0 }}>
      All clear{activeLink !== "All" ? ` in ${activeLink}` : ""}
    </p>
    <p style={{ fontSize: 13, color: "#9e9b95", margin: 0 }}>
      No issues found. You're doing great.
    </p>
  </div>
);

// ─────────────────────────────────────────
// MAIN — exact same logic as original
// ─────────────────────────────────────────
const LinkDashboard = ({ activeLink = "All", sorting = "Recent" }) => {
  const { overview } = useSelector((state) => state.ai);

  const [dismissed, setDismissed] = useState(new Set());

  const { data, hasMore, loadMore } = useOverviewFilter(
    overview,
    activeLink,
    sorting,
  );

  const filtered = data.filter((i) => !dismissed.has(i._key));

  const dismiss = (key) => setDismissed((prev) => new Set([...prev, key]));

  if (filtered.length === 0) return <EmptyState activeLink={activeLink} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <AnimatePresence>
        {filtered.map((item) => (
          <AlertCard key={item._key} item={item} onDismiss={dismiss} />
        ))}
      </AnimatePresence>

      {/* LOAD MORE */}
      {hasMore && activeLink === "All" && (
        <button
          onClick={loadMore}
          style={{
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 500,
            color: "#1a1916",
            background: "#ffffff",
            border: "0.5px solid rgba(0,0,0,0.14)",
            borderRadius: 12,
            padding: "11px 24px",
            cursor: "pointer",
            width: "100%",
            marginTop: 4,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1a1916";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.color = "#1a1916";
          }}
        >
          Load more insights
        </button>
      )}
    </div>
  );
};

export default LinkDashboard;
