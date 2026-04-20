import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAxios } from "../../../hooks/useAxios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Activity,
  Lock,
  BarChart3,
  Clock,
  XCircle,
  CheckCircle2,
  CircleDot,
  Target,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  BadgeAlert,
  Ban,
  TimerOff,
  Eye,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n) =>
  `Rs. ${new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(n)}`;

const fmtK = (n) => {
  if (n >= 1000) return `Rs. ${(n / 1000).toFixed(1)}k`;
  return `Rs. ${Math.round(n)}`;
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

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS (inline so no Tailwind dependency for these)
// ─────────────────────────────────────────────────────────────────────────────
const INDIGO = "#4F46E5";
const INDIGO_L = "#EEF2FF";
const INDIGO_M = "#C7D2FE";

const score2Color = (s) =>
  s >= 70
    ? { stroke: "#16A34A", bg: "#F0FDF4", text: "#15803D", label: "Good" }
    : s >= 45
      ? { stroke: "#D97706", bg: "#FFFBEB", text: "#B45309", label: "Fair" }
      : { stroke: "#DC2626", bg: "#FFF1F2", text: "#B91C1C", label: "Poor" };

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH SCORE GAUGE
// ─────────────────────────────────────────────────────────────────────────────
const Gauge = ({ score }) => {
  const { stroke, bg, text, label } = score2Color(score);
  const R = 48;
  const circ = Math.PI * R; // semicircle
  const offset = circ - (score / 100) * circ;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: 120, height: 68 }}>
        <svg width="120" height="68" viewBox="0 0 120 68">
          {/* Track */}
          <path
            d="M 10 64 A 50 50 0 0 1 110 64"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Fill */}
          <motion.path
            d="M 10 64 A 50 50 0 0 1 110 64"
            fill="none"
            stroke={stroke}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.4,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.3,
            }}
          />
        </svg>
        {/* Number */}
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
              fontSize: 26,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1,
              letterSpacing: "-1px",
            }}
          >
            {score}
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: text,
          background: bg,
          padding: "3px 10px",
          borderRadius: 20,
          border: `1px solid ${stroke}30`,
        }}
      >
        {label} Standing
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SPEND BAR CHART
// ─────────────────────────────────────────────────────────────────────────────
const SpendChart = ({ data }) => {
  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month));
  const vals = sorted.map(
    (d) => d.actual_spend ?? d.spent_so_far ?? d.predicted_spent ?? 0,
  );
  const max = Math.max(...vals) * 1.15;
  const aprItem = sorted.find((d) => !d.actual_spend);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          height: 80,
          padding: "0 4px",
        }}
      >
        {sorted.map((d, i) => {
          const isPred = !d.actual_spend;
          const val = d.actual_spend ?? d.spent_so_far ?? 0;
          const h = Math.max(8, Math.round((val / max) * 70));
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: isPred ? "#A5B4FC" : INDIGO,
                  letterSpacing: "0.02em",
                }}
              >
                {fmtK(val)}
              </span>
              <motion.div
                style={{
                  width: "100%",
                  height: h,
                  background: isPred
                    ? "repeating-linear-gradient(135deg,#818CF8 0px,#818CF8 2px,#EEF2FF 2px,#EEF2FF 7px)"
                    : INDIGO,
                  borderRadius: "5px 5px 3px 3px",
                  opacity: isPred ? 0.65 : 1,
                  transformOrigin: "bottom",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: 0.08 * i,
                  duration: 0.55,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              />
              <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>
                {monthLabel(d.month)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend + Apr callout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 8,
              borderRadius: 3,
              background: INDIGO,
            }}
          />
          <span style={{ fontSize: 11, color: "#64748B" }}>Actual</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 8,
              borderRadius: 3,
              background:
                "repeating-linear-gradient(135deg,#818CF8 0px,#818CF8 2px,#EEF2FF 2px,#EEF2FF 6px)",
              opacity: 0.7,
            }}
          />
          <span style={{ fontSize: 11, color: "#64748B" }}>Predicted</span>
        </div>
        {aprItem && (
          <div
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "#64748B",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>Apr so far:</span>
            <span style={{ fontWeight: 700, color: INDIGO }}>
              {fmt(aprItem.spent_so_far)}
            </span>
            <span style={{ color: "#CBD5E1" }}>
              / {fmt(aprItem.predicted_spent)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RISK BADGE
// ─────────────────────────────────────────────────────────────────────────────
const RiskBadge = ({ risk }) => {
  const styles = {
    Critical: { color: "#991B1B", bg: "#FEE2E2", border: "#FECACA" },
    High: { color: "#92400E", bg: "#FEF3C7", border: "#FDE68A" },
    Medium: { color: "#1E40AF", bg: "#DBEAFE", border: "#BFDBFE" },
    Low: { color: "#14532D", bg: "#DCFCE7", border: "#BBF7D0" },
  };
  const s = styles[risk] || styles.Medium;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        padding: "2px 8px",
        borderRadius: 20,
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      {risk}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WARNING ROW
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = {
  Expired: <TimerOff size={14} color="#EF4444" />,
  Exceeded: <TrendingUp size={14} color="#F59E0B" />,
  "Inactive budget": <CircleDot size={14} color="#94A3B8" />,
  "Declined Expense": <Ban size={14} color="#EF4444" />,
  "Pending Expense": <Clock size={14} color="#3B82F6" />,
  "Un-reviwed": <Eye size={14} color="#F59E0B" />,
};

const WarningRow = ({ w, i }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 * i, duration: 0.3 }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 14px",
      borderRadius: 12,
      background: "#FAFBFC",
      border: "1px solid #F1F5F9",
    }}
  >
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {ICONS[w.type] || <AlertTriangle size={14} color="#94A3B8" />}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#1E293B",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {w.name}
      </div>
      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
        {w.type} &middot; {w.category}
      </div>
    </div>
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
        {fmt(w.amount)}
      </span>
      <RiskBadge risk={w.risk} />
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  count,
  children,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{
      background: "#FFFFFF",
      borderRadius: 20,
      border: "1px solid #E8ECF4",
      overflow: "hidden",
      boxShadow:
        "0 2px 8px rgba(15,23,42,0.04), 0 0 0 0.5px rgba(15,23,42,0.04)",
    }}
  >
    {/* Card Header */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid #F1F5F9",
        background: "#FDFDFE",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={iconColor} />
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#1E293B",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </span>
      </div>
      {count !== undefined && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#6366F1",
            background: "#EEF2FF",
            padding: "3px 9px",
            borderRadius: 20,
          }}
        >
          {count} items
        </span>
      )}
    </div>
    {/* Card Body */}
    <div style={{ padding: "16px 20px" }}>{children}</div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ERROR SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const ErrorScreen = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}
  >
    <div style={{ textAlign: "center", padding: 40 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "#FEE2E2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Lock size={22} color="#EF4444" />
      </div>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#0F172A",
          margin: "0 0 6px",
        }}
      >
        Link Invalid or Expired
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "#94A3B8",
          maxWidth: 280,
          margin: "0 auto",
        }}
      >
        This shared overview is no longer accessible. Request a new link from
        the owner.
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ShareOverviewUI = () => {
  const { user_id } = useParams();
  const query_params = new URLSearchParams(location.search);
  const [data, setData] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const axios = useAxios();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(`/ai/verify_share_link/${user_id}`, {
          token: query_params.get("token"),
        });
        if (res.status === 200) {
          setIsValid(true);
          setData(res.data.overview);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong");
      }
    })();
  }, []);

  if (!isValid) return <ErrorScreen />;

  // ── Derived ───────────────────────────────────────────────────────────────
  const username = data.user?.username || data.username || "User";
  const scoreData = data.health_score;
  const trend = data.total_spent;
  const saving = data.total_saving;
  const budgets = data.budget_count_list;
  const spikes = data.anomalies?.spike || [];
  const tips = data.tips || [];
  const { stroke: scoreStroke } = score2Color(scoreData.health_score);

  // Deduplicate warnings
  const seen = new Set();
  const allWarnings = data.warnings.filter((w) => {
    const key = `${w.name}__${w.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const budgetWarnings = allWarnings
    .filter((w) => ["Exceeded", "Expired", "Inactive budget"].includes(w.type))
    .slice(0, 6);

  const expenseWarnings = allWarnings
    .filter((w) => ["Declined Expense", "Pending Expense"].includes(w.type))
    .slice(0, 6);

  const updatedDate = new Date(data.updated_on).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const activeRatio = Math.round(
    (budgets.active_budgets / budgets.total_budget) * 100,
  );

  const font =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #F0F4FF 0%, #F8FAFC 40%, #F8FAFC 100%)",
        fontFamily: font,
      }}
    >
      {/* ────────────────────────────────────────────────────────────────── */}
      {/* STICKY HEADER */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: "0.02em",
                boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
                flexShrink: 0,
              }}
            >
              {initials(username)}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F172A",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                {username}
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                Financial Overview
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "#94A3B8",
            }}
          >
            <Activity size={11} />
            <span>{updatedDate}</span>
          </motion.div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────── */}
      {/* PAGE BODY */}
      {/* ────────────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "24px 20px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* ── HERO BANNER ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            border: "1px solid #E8ECF4",
            overflow: "hidden",
            boxShadow:
              "0 4px 24px rgba(99,102,241,0.07), 0 1px 4px rgba(15,23,42,0.05)",
          }}
        >
          {/* Top accent strip */}
          <div
            style={{
              height: 4,
              background: `linear-gradient(90deg, ${INDIGO} 0%, #818CF8 50%, #A78BFA 100%)`,
            }}
          />

          <div
            style={{
              padding: "24px 28px",
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr 1px 1fr",
              gap: 0,
            }}
          >
            {/* Health Score */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 20px",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Health Score
              </span>
              <Gauge score={scoreData.health_score} />
            </div>

            {/* Divider */}
            <div style={{ background: "#F1F5F9", margin: "8px 0" }} />

            {/* Total Spent */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#FFF7ED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Wallet size={13} color="#F97316" />
                </div>
                <span
                  style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}
                >
                  Total Spent
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {fmt(trend.current_spent)}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#EA580C",
                  background: "#FFF7ED",
                  border: "1px solid #FED7AA",
                  borderRadius: 20,
                  padding: "3px 9px",
                  alignSelf: "flex-start",
                }}
              >
                <ArrowUpRight size={12} />
                {trend.trend_percentage}% vs last period
              </div>
            </div>

            {/* Divider */}
            <div style={{ background: "#F1F5F9", margin: "8px 0" }} />

            {/* Total Saved */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#F0FDF4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PiggyBank size={13} color="#16A34A" />
                </div>
                <span
                  style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}
                >
                  Total Saved
                </span>
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0F172A",
                  letterSpacing: "-1.5px",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {fmt(saving.total_saving)}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#15803D",
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: 20,
                  padding: "3px 9px",
                  alignSelf: "flex-start",
                }}
              >
                <CheckCircle2 size={12} />
                On track
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── BUDGET SUMMARY ──────────────────────────────────────────── */}
        <Card
          icon={Target}
          iconBg="#EEF2FF"
          iconColor={INDIGO}
          title="Budget Summary"
          delay={0.1}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              {
                label: "Total Budgets",
                val: budgets.total_budget,
                color: "#4F46E5",
                bg: "#EEF2FF",
                border: "#C7D2FE",
              },
              {
                label: "Active",
                val: budgets.active_budgets,
                color: "#16A34A",
                bg: "#F0FDF4",
                border: "#BBF7D0",
              },
              {
                label: "Inactive",
                val: budgets.inactive_budgets,
                color: "#DC2626",
                bg: "#FFF1F2",
                border: "#FECACA",
              },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  borderRadius: 14,
                  padding: "14px 16px",
                  background: b.bg,
                  border: `1px solid ${b.border}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: b.color,
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  {b.val}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: b.color,
                    opacity: 0.75,
                    marginTop: 4,
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </div>
          {/* Progress */}
          <div
            style={{
              height: 7,
              borderRadius: 10,
              background: "#F1F5F9",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                borderRadius: 10,
                background: `linear-gradient(90deg, ${INDIGO} 0%, #22C55E 100%)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${activeRatio}%` }}
              transition={{ duration: 1.1, delay: 0.4, ease: "easeOut" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 7,
            }}
          >
            <span style={{ fontSize: 11, color: "#94A3B8" }}>
              {activeRatio}% active
            </span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>
              {budgets.inactive_budgets} need attention
            </span>
          </div>
        </Card>

        {/* ── SPEND TREND ─────────────────────────────────────────────── */}
        <Card
          icon={BarChart3}
          iconBg="#EEF2FF"
          iconColor={INDIGO}
          title="Spend Trend"
          delay={0.15}
        >
          <SpendChart data={data.spend_trend} />
        </Card>

        {/* ── SPENDING SPIKES ──────────────────────────────────────────── */}
        {spikes.length > 0 && (
          <Card
            icon={Zap}
            iconBg="#FFF1F2"
            iconColor="#EF4444"
            title="Spending Spikes"
            count={spikes.length}
            delay={0.2}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {spikes.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + i * 0.05, duration: 0.3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    borderRadius: 12,
                    background: "#FFF8F8",
                    border: "1px solid #FEE2E2",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "#FEE2E2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Zap size={13} color="#EF4444" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1E293B",
                          textTransform: "capitalize",
                        }}
                      >
                        {s.expense_name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}
                      >
                        {s.expense_category}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#DC2626",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {fmt(s.expense_amount)}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* ── BUDGET ALERTS ────────────────────────────────────────────── */}
        {budgetWarnings.length > 0 && (
          <Card
            icon={BadgeAlert}
            iconBg="#FFFBEB"
            iconColor="#F59E0B"
            title="Budget Alerts"
            count={budgetWarnings.length}
            delay={0.25}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {budgetWarnings.map((w, i) => (
                <WarningRow key={i} w={w} i={i} />
              ))}
            </div>
          </Card>
        )}

        {/* ── EXPENSE ISSUES ───────────────────────────────────────────── */}
        {expenseWarnings.length > 0 && (
          <Card
            icon={ShieldAlert}
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            title="Expense Issues"
            count={expenseWarnings.length}
            delay={0.3}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {expenseWarnings.map((w, i) => (
                <WarningRow key={i} w={w} i={i} />
              ))}
            </div>
          </Card>
        )}

        {/* ── TIPS ─────────────────────────────────────────────────────── */}
        {tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${INDIGO_M}`,
              background: INDIGO_L,
            }}
          >
            {/* Accent */}
            <div
              style={{
                height: 3,
                background: `linear-gradient(90deg, ${INDIGO}, #818CF8)`,
              }}
            />
            <div style={{ padding: "16px 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: INDIGO,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={13} color="#fff" />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: INDIGO,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Smart Tips
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {tips.map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "11px 14px",
                      borderRadius: 12,
                      background: "#fff",
                      border: `1px solid ${INDIGO_M}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color:
                          tip.severity === "High"
                            ? "#DC2626"
                            : tip.severity === "Low"
                              ? "#16A34A"
                              : INDIGO,
                        background:
                          tip.severity === "High"
                            ? "#FEE2E2"
                            : tip.severity === "Low"
                              ? "#DCFCE7"
                              : INDIGO_L,
                        padding: "2px 8px",
                        borderRadius: 20,
                        alignSelf: "flex-start",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {tip.severity}
                    </span>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#3730A3",
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {tip.tip_message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingTop: 8,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              background: INDIGO,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={10} color="#fff" />
          </div>
          <span style={{ fontSize: 12, color: "#CBD5E1", fontWeight: 500 }}>
            Shared by{" "}
            <span style={{ color: "#94A3B8", fontWeight: 600 }}>
              {username}
            </span>{" "}
            · Cyrus Smart Expense Tracker
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default ShareOverviewUI;
