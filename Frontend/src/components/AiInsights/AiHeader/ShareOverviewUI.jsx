import React from "react";
import { Wallet, PiggyBank, Activity } from "lucide-react";

const OverviewUI = React.forwardRef(({ data }, ref) => {
  if (!data) {
    return <div ref={ref} style={{ width: 900, height: 200 }} />;
  }

  const { total_spent, total_saving, health_score, updated_on } = data;

  const dateStr = updated_on
    ? new Date(updated_on).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div
      ref={ref}
      style={{
        width: 900,
        background: "#ffffff",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        fontFamily: "system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
          {dateStr ? `Updated ${dateStr}` : "Financial Report"}
        </p>

        <h2
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#111827",
            marginTop: 4,
          }}
        >
          Financial Overview
        </h2>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {/* SPENT */}
        {total_spent && (
          <div style={cardStyle}>
            <Wallet style={{ ...iconStyle, color: "#ef4444" }} />
            <p style={labelStyle}>Total Spent</p>
            <p style={{ ...valueStyle, color: "#dc2626" }}>
              Rs. {total_spent.current_spent}
            </p>
            <p style={subText}>
              {total_spent.trend} {total_spent.trend_percentage}%
            </p>
          </div>
        )}

        {/* SAVING */}
        {total_saving && (
          <div style={cardStyle}>
            <PiggyBank style={{ ...iconStyle, color: "#22c55e" }} />
            <p style={labelStyle}>Total Saving</p>
            <p style={{ ...valueStyle, color: "#16a34a" }}>
              Rs. {total_saving.total_saving}
            </p>
          </div>
        )}

        {/* HEALTH */}
        {health_score && (
          <div style={cardStyle}>
            <Activity style={{ ...iconStyle, color: "#f59e0b" }} />
            <p style={labelStyle}>Health Score</p>
            <p style={{ ...valueStyle, color: "#f59e0b" }}>
              {health_score.health_score}/100
            </p>
            <p style={subText}>{health_score.better_than_percentage}</p>
          </div>
        )}
      </div>
    </div>
  );
});

const cardStyle = {
  background: "#f9fafb",
  borderRadius: 10,
  padding: 16,
  border: "1px solid #e5e7eb",
  textAlign: "center",
};

const iconStyle = {
  width: 20,
  height: 20,
  margin: "0 auto 8px",
};

const labelStyle = {
  fontSize: 12,
  color: "#6b7280",
  margin: 0,
};

const valueStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 6,
};

const subText = {
  fontSize: 11,
  color: "#9ca3af",
  marginTop: 4,
};

OverviewUI.displayName = "OverviewCapture";
export default OverviewUI;
