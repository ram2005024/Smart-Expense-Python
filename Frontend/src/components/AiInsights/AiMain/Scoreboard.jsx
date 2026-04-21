import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Wallet,
  PiggyBank,
  Zap,
  Target,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const fmtK = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1000) return `Rs.${(n / 1000).toFixed(1)}k`;
  return `Rs.${Math.round(n)}`;
};

const score2Meta = (s) =>
  s >= 70
    ? {
        color: "#22C55E",
        track: "#14532D",
        label: "Good standing",
        risk: "Low Risk",
        riskColor: "#22C55E",
        riskBg: "rgba(34,197,94,0.15)",
        riskBorder: "rgba(34,197,94,0.3)",
      }
    : s >= 45
      ? {
          color: "#F59E0B",
          track: "#78350F",
          label: "Fair standing",
          risk: "Moderate Risk",
          riskColor: "#F59E0B",
          riskBg: "rgba(245,158,11,0.15)",
          riskBorder: "rgba(245,158,11,0.3)",
        }
      : {
          color: "#EF4444",
          track: "#7F1D1D",
          label: "Poor standing",
          risk: "High Risk",
          riskColor: "#EF4444",
          riskBg: "rgba(239,68,68,0.15)",
          riskBorder: "rgba(239,68,68,0.3)",
        };

// ─────────────────────────────────────────────────────────────────────────────
// CIRCULAR GAUGE (SVG)
// ─────────────────────────────────────────────────────────────────────────────
const CircleGauge = ({ score, size = 110 }) => {
  const meta = score2Meta(score);
  const R = (size - 14) / 2;
  const circ = 2 * Math.PI * R;
  const cx = size / 2,
    cy = size / 2;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (score / 100) * circ), 100);
    return () => clearTimeout(t);
  }, [score, circ]);

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="9"
        />
        {/* Fill */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={meta.color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition:
              "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-1.5px",
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.08em",
            marginTop: 2,
            textTransform: "uppercase",
          }}
        >
          Score
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PILL TAG
// ─────────────────────────────────────────────────────────────────────────────
const Pill = ({ icon: Icon, label, color, bg, border, iconColor }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 12px",
      borderRadius: 999,
      background: bg,
      border: `1px solid ${border}`,
      fontSize: 12,
      fontWeight: 600,
      color,
      whiteSpace: "nowrap",
    }}
  >
    {Icon && <Icon size={12} color={iconColor || color} />}
    {label}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STAT TILE
// ─────────────────────────────────────────────────────────────────────────────
const StatTile = ({
  value,
  label,
  sub,
  subColor,
  subIcon: SubIcon,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{
      flex: 1,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: "18px 20px",
      minWidth: 0,
    }}
  >
    <div
      style={{
        fontSize: 26,
        fontWeight: 800,
        color: "#fff",
        letterSpacing: "-1px",
        lineHeight: 1,
        marginBottom: 6,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    {sub && (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {SubIcon && <SubIcon size={11} color={subColor} />}
        <span style={{ fontSize: 12, fontWeight: 600, color: subColor }}>
          {sub}
        </span>
      </div>
    )}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCOREBOARD — accepts `data` prop (same shape as your overview API response)
// ─────────────────────────────────────────────────────────────────────────────
const Scoreboard = ({ data }) => {
  if (!data) return null;

  const score = data.health_score?.health_score ?? 0;
  const meta = score2Meta(score);

  const totalSpent = data.total_spent?.current_spent ?? 0;
  const trendPct = data.total_spent?.trend_percentage ?? 0;
  const trendUp = data.total_spent?.trend === "Up";

  const totalSaving = data.total_saving?.total_saving ?? 0;

  // Anomaly count
  const anomalyCount =
    (data.anomalies?.spike?.length ?? 0) +
    (data.anomalies?.temporal?.length ?? 0) +
    (data.anomalies?.recurring?.length ?? 0) +
    (data.anomalies?.duplication?.length ?? 0);

  // Budget ratio
  const totalBudgets = data.budget_count_list?.total_budget ?? 0;
  const activeBudgets = data.budget_count_list?.active_budgets ?? 0;

  // Alert count (critical warnings)
  const seen = new Set();
  const deduped = (data.warnings ?? []).filter((w) => {
    const k = `${w.name}__${w.type}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const criticalAlerts = deduped.filter((w) => w.risk === "Critical").length;

  const updatedToday = (() => {
    if (!data.updated_on) return false;
    const d = new Date(data.updated_on);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        width: "100%",
        background:
          "linear-gradient(135deg, #0D1B35 0%, #0F2444 40%, #0B1A30 100%)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', -apple-system, sans-serif",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        position: "relative",
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${meta.color}50, transparent)`,
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          padding: "28px 32px 24px",
          display: "flex",
          alignItems: "stretch",
          gap: 32,
        }}
      >
        {/* LEFT: Score Text + Pills */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Label */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Financial Health Score
          </div>

          {/* Big score */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-3px",
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "-0.5px",
              }}
            >
              /100
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 16px",
              lineHeight: 1.5,
            }}
          >
            {meta.label} ·{" "}
            {criticalAlerts > 0
              ? `${criticalAlerts} critical item${criticalAlerts > 1 ? "s" : ""} need attention`
              : "No critical issues"}
          </motion.p>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
          >
            <Pill
              icon={CheckCircle}
              label={meta.risk}
              color={meta.riskColor}
              bg={meta.riskBg}
              border={meta.riskBorder}
            />
            <Pill
              icon={CheckCircle}
              label={`${activeBudgets}/${totalBudgets} Budgets Active`}
              color="#22C55E"
              bg="rgba(34,197,94,0.12)"
              border="rgba(34,197,94,0.25)"
            />
            {criticalAlerts > 0 && (
              <Pill
                icon={AlertTriangle}
                label={`${criticalAlerts} Active Alerts`}
                color="#F59E0B"
                bg="rgba(245,158,11,0.12)"
                border="rgba(245,158,11,0.25)"
              />
            )}
            <Pill
              icon={Clock}
              label={updatedToday ? "Updated Today" : "Recently Updated"}
              color="rgba(255,255,255,0.45)"
              bg="rgba(255,255,255,0.06)"
              border="rgba(255,255,255,0.1)"
            />
          </motion.div>
        </div>

        {/* RIGHT: Circle Gauge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CircleGauge score={score} size={110} />
        </div>
      </div>

      {/* ── STAT TILES ROW ── */}
      <div style={{ padding: "0 32px 28px", display: "flex", gap: 12 }}>
        <StatTile
          value={fmtK(totalSpent)}
          label="Total Spend"
          sub={`${trendUp ? "+" : ""}${trendPct}% vs budget`}
          subColor={trendUp ? "#EF4444" : "#22C55E"}
          subIcon={trendUp ? TrendingUp : TrendingDown}
          delay={0.15}
        />
        <StatTile
          value={fmtK(totalSaving)}
          label="Savings Found"
          sub="This month"
          subColor="#22C55E"
          subIcon={TrendingUp}
          delay={0.2}
        />
        <StatTile
          value={anomalyCount}
          label="Anomalies"
          sub={anomalyCount > 0 ? "Needs review" : "All clear"}
          subColor={anomalyCount > 0 ? "#F59E0B" : "#22C55E"}
          subIcon={anomalyCount > 0 ? AlertTriangle : CheckCircle}
          delay={0.25}
        />
        <StatTile
          value={`${activeBudgets} / ${totalBudgets}`}
          label="Dept Budgets"
          sub={
            activeBudgets === totalBudgets
              ? "On track"
              : `${totalBudgets - activeBudgets} inactive`
          }
          subColor={activeBudgets === totalBudgets ? "#22C55E" : "#F59E0B"}
          subIcon={activeBudgets === totalBudgets ? TrendingUp : AlertTriangle}
          delay={0.3}
        />
      </div>
    </motion.div>
  );
};

export default Scoreboard;
