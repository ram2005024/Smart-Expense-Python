import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Activity,
  Target,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Share2,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n) =>
  `Rs. ${new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(n)}`;

const fmtK = (n) => {
  if (n >= 1000) return `Rs.${(n / 1000).toFixed(1)}k`;
  return `Rs.${Math.round(n)}`;
};

const monthLabel = (m) => {
  const [y, mo] = m.split("-");
  return new Date(y, mo - 1).toLocaleString("default", { month: "short" });
};

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

const score2Color = (s) =>
  s >= 70
    ? { stroke: "#10B981", light: "#ECFDF5", text: "#065F46", label: "Good" }
    : s >= 45
      ? { stroke: "#F59E0B", light: "#FFFBEB", text: "#78350F", label: "Fair" }
      : { stroke: "#EF4444", light: "#FEF2F2", text: "#7F1D1D", label: "Poor" };

// ─────────────────────────────────────────────────────────────────────────────
// SNAPSHOT GAUGE (SVG, no framer — for html2canvas compat)
// ─────────────────────────────────────────────────────────────────────────────
const SnapGauge = ({ score }) => {
  const { stroke, light, text, label } = score2Color(score);
  const R = 36;
  const circ = Math.PI * R;
  const filled = (score / 100) * circ;
  const dashOffset = circ - filled;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        gap: 6,
      }}
    >
      <div style={{ position: "relative", width: 90, height: 52 }}>
        <svg width="90" height="52" viewBox="0 0 90 52">
          <path
            d="M 8 48 A 37 37 0 0 1 82 48"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 8 48 A 37 37 0 0 1 82 48"
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-1px",
              overflow: "hidden",
            }}
          >
            {score}
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: stroke,
          background: "rgba(255,255,255,0.12)",
          padding: "2px 8px",
          borderRadius: 20,
          letterSpacing: "0.04em",
          overflow: "hidden",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SNAPSHOT MINI BAR CHART (pure SVG for canvas compat)
// ─────────────────────────────────────────────────────────────────────────────
const SnapBars = ({ data }) => {
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month));
  const vals = sorted.map((d) => d.actual_spend ?? d.spent_so_far ?? 0);
  const max = Math.max(...vals) * 1.2 || 1;
  const W = 220,
    H = 60,
    barW = Math.floor(W / sorted.length) - 6;

  return (
    <svg width={W} height={H + 16} viewBox={`0 0 ${W} ${H + 16}`}>
      {sorted.map((d, i) => {
        const val = d.actual_spend ?? d.spent_so_far ?? 0;
        const isPred = !d.actual_spend;
        const bh = Math.max(4, Math.round((val / max) * H));
        const x = i * (barW + 6) + 3;
        const y = H - bh;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={bh}
              rx="3"
              fill={isPred ? "rgba(165,180,252,0.5)" : "rgba(255,255,255,0.85)"}
            />
            <text
              x={x + barW / 2}
              y={H + 13}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(255,255,255,0.5)"
              fontWeight="500"
            >
              {monthLabel(d.month)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// THE ACTUAL SNAPSHOT CARD (what gets captured)
// ─────────────────────────────────────────────────────────────────────────────
const SnapshotCard = React.forwardRef(({ data, username }, ref) => {
  if (!data) return null;

  const score = data.health_score;
  const trend = data.total_spent;
  const saving = data.total_saving;
  const budgets = data.budget_count_list;
  const spikes = data.anomalies?.spike || [];
  const tips = data.tips || [];
  const { stroke: scoreStroke, label: scoreLabel } = score2Color(
    score.health_score,
  );

  // Top 3 spikes
  const topSpikes = spikes.slice(0, 3);

  // Budget warnings count
  const seen = new Set();
  const allW = data.warnings.filter((w) => {
    const k = `${w.name}__${w.type}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const criticalCount = allW.filter((w) => w.risk === "Critical").length;
  const highCount = allW.filter((w) => w.risk === "High").length;

  const updatedDate = new Date(data.updated_on).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const CARD_W = 420;

  return (
    <div
      ref={ref}
      className="snapshot-card"
      style={{
        width: CARD_W,
        background:
          "linear-gradient(145deg, #1E1B4B 0%, #312E81 35%, #1E3A5F 70%, #0F2A4A 100%)",
        borderRadius: 24,

        fontFamily: "'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif",
        position: "relative",
      }}
    >
      {/* Decorative orbs */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(129,140,248,0.12)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(16,185,129,0.08)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(245,158,11,0.06)",
          pointerEvents: "none",
        }}
      />

      {/* Top accent bar */}
      <div
        style={{
          height: 3,
          background:
            "linear-gradient(90deg, #818CF8 0%, #A78BFA 40%, #34D399 100%)",
        }}
      />

      {/* ── HEADER ── */}
      <div
        style={{
          padding: "20px 24px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: "linear-gradient(135deg, #818CF8 0%, #6366F1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            {initials(username)}
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {username}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.45)",
                marginTop: 1,
              }}
            >
              Financial Snapshot
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#34D399",
            }}
          />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            {updatedDate}
          </span>
        </div>
      </div>

      {/* ── HERO STATS ROW ── */}
      <div
        style={{
          padding: "0 24px 20px",
          display: "grid",
          gridTemplateColumns: "auto 1fr 1fr",
          gap: 16,
          alignItems: "center",
        }}
      >
        {/* Gauge */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <SnapGauge score={score.health_score} />
          <span
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              marginTop: 4,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              overflow: "hidden",
            }}
          >
            Health
          </span>
        </div>

        {/* Spent */}
        <div
          style={{
            background: "rgba(249,115,22,0.1)",
            borderRadius: 16,
            padding: "14px 16px",
            border: "1px solid rgba(249,115,22,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 6,
            }}
          >
            <Wallet size={11} color="#FB923C" />
            <span
              style={{
                fontSize: 10,
                color: "rgba(251,146,60,0.8)",
                fontWeight: 600,
              }}
            >
              Spent
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.8px",
              overflow: "hidden",
              lineHeight: 1,
            }}
          >
            {fmtK(trend.current_spent)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              marginTop: 5,
            }}
          >
            <ArrowUpRight size={10} color="#FB923C" />
            <span style={{ fontSize: 10, color: "#FB923C", fontWeight: 600 }}>
              {trend.trend_percentage}%
            </span>
          </div>
        </div>

        {/* Saved */}
        <div
          style={{
            background: "rgba(16,185,129,0.1)",
            borderRadius: 16,
            padding: "14px 16px",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 6,
            }}
          >
            <PiggyBank size={11} color="#34D399" />
            <span
              style={{
                fontSize: 10,
                color: "rgba(52,211,153,0.8)",
                fontWeight: 600,
              }}
            >
              Saved
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
              overflow: "hidden",
              letterSpacing: "-0.8px",
              lineHeight: 1,
            }}
          >
            {fmtK(saving.total_saving)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              marginTop: 5,
            }}
          >
            <CheckCircle2 size={10} color="#34D399" />
            <span style={{ fontSize: 10, color: "#34D399", fontWeight: 600 }}>
              On track
            </span>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.07)",
          margin: "0 24px",
        }}
      />

      {/* ── MIDDLE: BUDGETS + MINI CHART ── */}
      <div
        style={{
          padding: "16px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        {/* Budget stats */}
        <div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 10,
              overflow: "hidden",
            }}
          >
            Budgets
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
              overflow: "hidden",
            }}
          >
            {[
              { label: "Total", val: budgets.total_budget, color: "#818CF8" },
              {
                label: "Active",
                val: budgets.active_budgets,
                color: "#34D399",
              },
              {
                label: "Inactive",
                val: budgets.inactive_budgets,
                color: "#F87171",
              },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: b.color,
                    letterSpacing: "-0.5px",
                    lineHeight: 1,
                    overflow: "hidden",
                  }}
                >
                  {b.val}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 3,
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </div>
          {/* Mini progress */}
          <div
            style={{
              marginTop: 10,
              height: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.round((budgets.active_budgets / budgets.total_budget) * 100)}%`,
                background: "linear-gradient(90deg,#818CF8,#34D399)",
                borderRadius: 4,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              overflow: "hidden",
            }}
          >
            {Math.round((budgets.active_budgets / budgets.total_budget) * 100)}%
            active
          </div>
        </div>

        {/* Mini chart */}
        <div>
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Spend Trend
          </div>
          <SnapBars data={data.spend_trend} />
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.07)",
          margin: "0 24px",
        }}
      />

      {/* ── SPIKES + ALERTS ── */}
      <div style={{ padding: "14px 24px 0" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {/* Spikes */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 8,
              }}
            >
              <Zap size={11} color="#F87171" />
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Spikes
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {topSpikes.length > 0 ? (
                topSpikes.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 8px",
                      borderRadius: 8,
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.15)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.7)",
                        textTransform: "capitalize",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 70,
                      }}
                    >
                      {s.expense_name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#F87171",
                      }}
                    >
                      {fmtK(s.expense_amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.25)",
                    padding: "5px 0",
                  }}
                >
                  No spikes
                </div>
              )}
            </div>
          </div>

          {/* Alert summary */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 8,
              }}
            >
              <AlertTriangle size={11} color="#FBBF24" />
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Alerts
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 8px",
                  borderRadius: 8,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                  Critical
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 800, color: "#F87171" }}
                >
                  {criticalCount}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 8px",
                  borderRadius: 8,
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                  High
                </span>
                <span
                  style={{ fontSize: 12, fontWeight: 800, color: "#FBBF24" }}
                >
                  {highCount}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 8px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                  Total
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {allW.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIP ── */}
      {tips.length > 0 && (
        <div style={{ padding: "14px 24px 0" }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.2)",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Sparkles
                size={12}
                color="#818CF8"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {tips[0].tip_message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div
        style={{
          padding: "14px 24px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 5,
              background: "linear-gradient(135deg,#818CF8,#6366F1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={9} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              fontWeight: 500,
            }}
          >
            Cyrus Smart Expense Tracker
          </span>
        </div>
        <span
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.04em",
          }}
        >
          cyrus.app
        </span>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SNAPSHOTUI — modal overlay with download
// ─────────────────────────────────────────────────────────────────────────────
const SnapshotUI = ({ data, username, onClose }) => {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = `${username || "snapshot"}_financial_snapshot.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(15,23,42,0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          fontFamily:
            "'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif",
        }}
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: 420,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Your Snapshot
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  margin: "2px 0 0",
                }}
              >
                Download and share your financial summary
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Snapshot Card */}
          <motion.div
            style={{
              borderRadius: 28,
              overflow: "hidden",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.25 }}
          >
            <SnapshotCard ref={cardRef} data={data} username={username} />
          </motion.div>

          {/* Action Buttons */}
          <div
            style={{ display: "flex", gap: 10, width: "100%", maxWidth: 420 }}
          >
            {/* Download button */}
            <motion.button
              onClick={handleDownload}
              disabled={downloading}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                height: 46,
                borderRadius: 14,
                border: "none",
                background: downloaded
                  ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                  : "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: downloading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                letterSpacing: "-0.01em",
                boxShadow: downloaded
                  ? "0 4px 16px rgba(16,185,129,0.35)"
                  : "0 4px 16px rgba(99,102,241,0.4)",
                transition: "background 0.3s, box-shadow 0.3s",
              }}
            >
              {downloading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                    }}
                  />
                  Generating...
                </>
              ) : downloaded ? (
                <>
                  <CheckCircle2 size={16} />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download Snapshot
                </>
              )}
            </motion.button>
          </div>

          <p
            style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}
          >
            Saved as a high-resolution PNG · 3× quality
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SnapshotUI;
