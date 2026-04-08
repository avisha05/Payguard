import { useEffect, useState } from "react";
import {
  fetchSummary,
  fetchTransactions,
  fetchFraudTransactions,
  fetchRiskDistribution,
} from "./services/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ArcElement,
  LineElement,
  PointElement,
);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#0d0f14",
  surface: "#13161e",
  card: "#181c26",
  border: "#232738",
  dark: "#1a1d27",
  blue: "#3b82f6",
  blueTx: "#60a5fa",
  blueBg: "rgba(59,130,246,0.12)",
  red: "#f43f5e",
  redBg: "rgba(244,63,94,0.10)",
  green: "#22c55e",
  greenBg: "rgba(34,197,94,0.10)",
  amber: "#f59e0b",
  amberBg: "rgba(245,158,11,0.10)",
  purple: "#a78bfa",
  purpleBg: "rgba(167,139,250,0.10)",
  text: "#f1f5f9",
  muted: "#8892a4",
  faint: "#4a5568",
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icons = {
  overview: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill={c} />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill={c} opacity=".4" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill={c} opacity=".4" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill={c} opacity=".4" />
    </svg>
  ),
  transactions: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 4h12M2 8h8M2 12h10"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  alerts: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L14 4V8C14 11.3 11.3 14.1 8 15C4.7 14.1 2 11.3 2 8V4L8 1Z"
        stroke={c}
        strokeWidth="1.3"
        fill="none"
      />
      <path
        d="M8 6v3M8 10.5v.5"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  analytics: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="10" width="3" height="5" rx="1" fill={c} />
      <rect x="6" y="6" width="3" height="9" rx="1" fill={c} />
      <rect x="11" y="2" width="3" height="13" rx="1" fill={c} />
    </svg>
  ),
  users: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="3" stroke={c} strokeWidth="1.3" />
      <path
        d="M1 14c0-2.8 2.2-5 5-5"
        stroke={c}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="12" cy="11" r="3" stroke={c} strokeWidth="1.3" />
    </svg>
  ),
  settings: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke={c} strokeWidth="1.3" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4"
        stroke={c}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  reports: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 1Z"
        stroke={c}
        strokeWidth="1.3"
      />
      <path d="M9 1v5h5" stroke={c} strokeWidth="1.3" />
      <path
        d="M5 9h6M5 11h4"
        stroke={c}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  bell: (c) => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6V9L2 11h12l-1.5-2V6C12.5 3.5 10.5 1.5 8 1.5Z"
        stroke={c}
        strokeWidth="1.3"
      />
      <path
        d="M6.5 11.5C6.5 12.3 7.2 13 8 13s1.5-.7 1.5-1.5"
        stroke={c}
        strokeWidth="1.3"
      />
    </svg>
  ),
  statTx: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="10" width="3" height="5" rx="1" fill={c} />
      <rect x="6" y="6" width="3" height="9" rx="1" fill={c} />
      <rect x="11" y="2" width="3" height="13" rx="1" fill={c} />
    </svg>
  ),
  statShield: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L14 4V8C14 11.3 11.3 14.1 8 15C4.7 14.1 2 11.3 2 8V4L8 1Z"
        stroke={c}
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M6 8L7.5 9.5L10.5 6.5"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  statCheck: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke={c} strokeWidth="1.4" />
      <path
        d="M5.5 8L7 9.5L10.5 6"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  statTrend: (c) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 12L6 7L9 9.5L14 4"
        stroke={c}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardHead({ left, right }) {
  return (
    <div
      style={{
        padding: "13px 20px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>{left}</div>
      {right && <div>{right}</div>}
    </div>
  );
}

function PageTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>
        {title}
      </h1>
      {sub && (
        <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{sub}</p>
      )}
    </div>
  );
}

function StatCard({ label, value, iconKey, color, bg, sub }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -14,
          right: -14,
          width: 55,
          height: 55,
          borderRadius: "50%",
          background: bg,
          filter: "blur(16px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "monospace",
            color,
            lineHeight: 1,
          }}
        >
          {value ?? "—"}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icons[iconKey](color)}
        </div>
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>{sub}</div>
      )}
    </div>
  );
}

function RiskBadge({ score }) {
  const n = Number(score);
  const [color, bg, label] =
    n >= 70
      ? [C.red, C.redBg, "High"]
      : n >= 40
        ? [C.amber, C.amberBg, "Med"]
        : [C.green, C.greenBg, "Low"];
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ color, fontWeight: 600, fontSize: 13 }}>{n}</span>
      <span
        style={{
          fontSize: 10,
          padding: "1px 5px",
          borderRadius: 3,
          background: bg,
          color,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </span>
  );
}

function FraudBadge({ isFraud }) {
  return (
    <span
      style={{
        padding: "2px 9px",
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 600,
        background: isFraud ? C.redBg : C.greenBg,
        color: isFraud ? C.red : C.green,
        border: `1px solid ${isFraud ? "rgba(244,63,94,0.22)" : "rgba(34,197,94,0.22)"}`,
      }}
    >
      {isFraud ? "⚠ FRAUD" : "✓ SAFE"}
    </span>
  );
}

function TxRow({ tx }) {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${C.dark}`,
        background: hov ? "rgba(59,130,246,0.04)" : "transparent",
        transition: "background 0.12s",
      }}
    >
      <td
        style={{
          padding: "11px 16px",
          color: C.blueTx,
          fontFamily: "monospace",
          fontSize: 12,
        }}
      >
        {tx.transactionId}
      </td>
      <td
        style={{
          padding: "11px 16px",
          color: C.muted,
          fontFamily: "monospace",
          fontSize: 12,
        }}
      >
        {tx.userId}
      </td>
      <td style={{ padding: "11px 16px", color: C.text, fontWeight: 600 }}>
        ₹{Number(tx.amount).toLocaleString("en-IN")}
      </td>
      <td style={{ padding: "11px 16px" }}>
        <span
          style={{
            padding: "2px 9px",
            borderRadius: 5,
            background: C.blueBg,
            color: C.blueTx,
            fontSize: 11,
            border: "1px solid rgba(59,130,246,0.18)",
          }}
        >
          {tx.paymentMethod}
        </span>
      </td>
      <td style={{ padding: "11px 16px" }}>
        <RiskBadge score={tx.riskScore} />
      </td>
      <td style={{ padding: "11px 16px" }}>
        <FraudBadge isFraud={tx.isFraud} />
      </td>
    </tr>
  );
}

function TxTable({ data }) {
  if (!data || data.length === 0)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 0",
          color: C.faint,
          fontSize: 13,
        }}
      >
        No transactions found
      </div>
    );
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr>
            {[
              "Transaction ID",
              "User ID",
              "Amount",
              "Method",
              "Risk Score",
              "Status",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: C.faint,
                  borderBottom: `1px solid ${C.border}`,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((tx, i) => (
            <TxRow key={tx._id || i} tx={tx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
function OverviewPage({ summary, transactions, frauds, riskData }) {
  const [tab, setTab] = useState("all");
  const fraudRate = summary
    ? ((summary.fraud / (summary.total || 1)) * 100).toFixed(1)
    : "0.0";

  const riskLabels = riskData.map((d) =>
    d._id == null ? "Unknown" : String(d._id),
  );
  const barData = {
    labels: riskLabels,
    datasets: [
      {
        data: riskData.map((d) => d.count),
        backgroundColor: riskLabels.map((l) => {
          const v = l.toLowerCase();
          return v === "high"
            ? "rgba(244,63,94,0.8)"
            : v === "medium" || v === "med"
              ? "rgba(245,158,11,0.8)"
              : v === "low"
                ? "rgba(34,197,94,0.8)"
                : "rgba(59,130,246,0.8)";
        }),
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };
  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        titleColor: C.text,
        bodyColor: C.muted,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: C.border },
        ticks: { color: C.muted, font: { size: 11 } },
      },
      y: {
        grid: { color: C.border },
        ticks: { color: C.muted, font: { size: 11 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
  };
  const doughnutData = {
    labels: ["Fraud", "Safe"],
    datasets: [
      {
        data: [summary?.fraud ?? 0, summary?.safe ?? 0],
        backgroundColor: ["rgba(244,63,94,0.85)", "rgba(34,197,94,0.85)"],
        borderColor: [C.red, C.green],
        borderWidth: 2,
      },
    ],
  };
  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: C.muted, padding: 14, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        titleColor: C.text,
        bodyColor: C.muted,
        padding: 10,
      },
    },
  };

  return (
    <div>
      <PageTitle
        title="Fraud Analytics Dashboard"
        sub="Real-time transaction monitoring and risk intelligence"
      />
      {summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,minmax(0,1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <StatCard
            label="Total Transactions"
            value={summary.total}
            iconKey="statTx"
            color={C.text}
            bg="rgba(59,130,246,0.3)"
            sub="All time total"
          />
          <StatCard
            label="Fraud Detected"
            value={summary.fraud}
            iconKey="statShield"
            color={C.red}
            bg="rgba(244,63,94,0.3)"
            sub={
              <>
                <span style={{ color: C.red }}>▲ {fraudRate}%</span> fraud rate
              </>
            }
          />
          <StatCard
            label="Safe Transactions"
            value={summary.safe}
            iconKey="statCheck"
            color={C.green}
            bg="rgba(34,197,94,0.3)"
            sub="Verified clean"
          />
          <StatCard
            label="Fraud Rate"
            value={`${fraudRate}%`}
            iconKey="statTrend"
            color={C.amber}
            bg="rgba(245,158,11,0.3)"
            sub="Of all transactions"
          />
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <Card>
          <CardHead
            left={
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                Risk distribution by level
              </span>
            }
          />
          <div style={{ padding: "16px 20px 20px" }}>
            {riskData.length === 0 ? (
              <div
                style={{
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.faint,
                  fontSize: 13,
                }}
              >
                No risk data yet
              </div>
            ) : (
              <div style={{ height: 140 }}>
                <Bar data={barData} options={barOpts} />
              </div>
            )}
          </div>
        </Card>
        <Card>
          <CardHead
            left={
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                Fraud vs safe
              </span>
            }
          />
          <div style={{ padding: "16px 20px 20px" }}>
            {summary ? (
              <>
                <div style={{ height: 160 }}>
                  <Doughnut data={doughnutData} options={doughnutOpts} />
                </div>
                <div
                  style={{
                    marginTop: 10,
                    textAlign: "center",
                    fontSize: 12,
                    color: C.muted,
                  }}
                >
                  <span style={{ color: C.red, fontWeight: 700 }}>
                    {fraudRate}%
                  </span>{" "}
                  flagged as fraud
                </div>
              </>
            ) : (
              <div
                style={{
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.faint,
                }}
              >
                Loading…
              </div>
            )}
          </div>
        </Card>
      </div>
      <Card>
        <CardHead
          left={
            <div style={{ display: "flex", gap: 3 }}>
              {[
                { id: "all", label: "All", count: transactions.length },
                { id: "fraud", label: "Fraud only", count: frauds.length },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 7,
                    fontSize: 12,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    background: tab === t.id ? C.blueBg : "transparent",
                    color: tab === t.id ? C.blueTx : C.muted,
                    borderBottom: `2px solid ${tab === t.id ? C.blueTx : "transparent"}`,
                  }}
                >
                  {t.label}
                  <span
                    style={{
                      marginLeft: 5,
                      fontSize: 10,
                      padding: "1px 6px",
                      borderRadius: 8,
                      background:
                        tab === t.id ? "rgba(59,130,246,0.18)" : C.border,
                      color: tab === t.id ? C.blueTx : C.faint,
                    }}
                  >
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          }
          right={
            <span style={{ fontSize: 11, color: C.faint }}>
              {(tab === "all" ? transactions : frauds).length} records
            </span>
          }
        />
        <TxTable data={tab === "all" ? transactions : frauds} />
      </Card>
    </div>
  );
}

// ─── PAGE: TRANSACTIONS ───────────────────────────────────────────────────────
function TransactionsPage({ transactions }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      !search ||
      tx.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      tx.userId?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "fraud" && tx.isFraud) ||
      (filter === "safe" && !tx.isFraud);
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <PageTitle
        title="All Transactions"
        sub={`${transactions.length} total transactions in the system`}
      />
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Transaction ID or User ID…"
          style={{
            flex: 1,
            padding: "9px 14px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: C.card,
            color: C.text,
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        {["all", "fraud", "safe"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              fontSize: 12,
              border: `1px solid ${C.border}`,
              background: filter === f ? C.blueBg : C.card,
              color: filter === f ? C.blueTx : C.muted,
              cursor: "pointer",
              fontFamily: "inherit",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <Card>
        <CardHead
          left={
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
              Transaction list
            </span>
          }
          right={
            <span style={{ fontSize: 11, color: C.faint }}>
              {filtered.length} records
            </span>
          }
        />
        <TxTable data={filtered} />
      </Card>
    </div>
  );
}

// ─── PAGE: FRAUD ALERTS ───────────────────────────────────────────────────────
function AlertsPage({ frauds, summary }) {
  const fraudRate = summary
    ? ((summary.fraud / (summary.total || 1)) * 100).toFixed(1)
    : "0.0";
  return (
    <div>
      <PageTitle
        title="Fraud Alerts"
        sub="All flagged and high-risk transactions requiring review"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,minmax(0,1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard
          label="Total Alerts"
          value={frauds.length}
          iconKey="statShield"
          color={C.red}
          bg="rgba(244,63,94,0.3)"
          sub="Fraud transactions"
        />
        <StatCard
          label="Fraud Rate"
          value={`${fraudRate}%`}
          iconKey="statTrend"
          color={C.amber}
          bg="rgba(245,158,11,0.3)"
          sub="Of all transactions"
        />
        <StatCard
          label="High Risk"
          value={frauds.filter((t) => t.riskScore >= 70).length}
          iconKey="statShield"
          color={C.red}
          bg="rgba(244,63,94,0.3)"
          sub="Score ≥ 70"
        />
      </div>
      <Card>
        <CardHead
          left={
            <span style={{ fontSize: 13, fontWeight: 500, color: C.red }}>
              ⚠ Fraud Transactions
            </span>
          }
          right={
            <span style={{ fontSize: 11, color: C.faint }}>
              {frauds.length} alerts
            </span>
          }
        />
        {frauds.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: C.faint }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 14, color: C.green }}>
              No fraud detected
            </div>
          </div>
        ) : (
          <TxTable data={frauds} />
        )}
      </Card>
    </div>
  );
}

// ─── PAGE: ANALYTICS ─────────────────────────────────────────────────────────
function AnalyticsPage({ transactions, summary }) {
  const fraudRate = summary
    ? ((summary.fraud / (summary.total || 1)) * 100).toFixed(1)
    : "0.0";

  // Build method breakdown
  const methodMap = {};
  transactions.forEach((tx) => {
    methodMap[tx.paymentMethod] = (methodMap[tx.paymentMethod] || 0) + 1;
  });
  const methods = Object.entries(methodMap);

  const methodBar = {
    labels: methods.map(([k]) => k),
    datasets: [
      {
        data: methods.map(([, v]) => v),
        backgroundColor: "rgba(59,130,246,0.75)",
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };
  const methodOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        titleColor: C.text,
        bodyColor: C.muted,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: C.border },
        ticks: { color: C.muted, font: { size: 11 } },
      },
      y: {
        grid: { color: C.border },
        ticks: { color: C.muted, font: { size: 11 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  // Amount ranges
  const ranges = [
    {
      label: "< ₹1K",
      count: transactions.filter((t) => t.amount < 1000).length,
    },
    {
      label: "₹1K–10K",
      count: transactions.filter((t) => t.amount >= 1000 && t.amount < 10000)
        .length,
    },
    {
      label: "₹10K–1L",
      count: transactions.filter((t) => t.amount >= 10000 && t.amount < 100000)
        .length,
    },
    {
      label: "> ₹1L",
      count: transactions.filter((t) => t.amount >= 100000).length,
    },
  ];

  const amtBar = {
    labels: ranges.map((r) => r.label),
    datasets: [
      {
        data: ranges.map((r) => r.count),
        backgroundColor: "rgba(167,139,250,0.75)",
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div>
      <PageTitle
        title="Analytics"
        sub="Breakdown of transaction patterns and payment methods"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,minmax(0,1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard
          label="Total Processed"
          value={summary?.total ?? 0}
          iconKey="statTx"
          color={C.text}
          bg="rgba(59,130,246,0.3)"
          sub="All transactions"
        />
        <StatCard
          label="Total Fraud"
          value={summary?.fraud ?? 0}
          iconKey="statShield"
          color={C.red}
          bg="rgba(244,63,94,0.3)"
          sub={`${fraudRate}% fraud rate`}
        />
        <StatCard
          label="Payment Methods"
          value={methods.length}
          iconKey="statTrend"
          color={C.purple}
          bg={C.purpleBg}
          sub="Unique methods used"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card>
          <CardHead
            left={
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                Transactions by payment method
              </span>
            }
          />
          <div style={{ padding: "16px 20px 20px" }}>
            {methods.length === 0 ? (
              <div
                style={{
                  height: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.faint,
                  fontSize: 13,
                }}
              >
                No data
              </div>
            ) : (
              <div style={{ height: 160 }}>
                <Bar data={methodBar} options={methodOpts} />
              </div>
            )}
          </div>
        </Card>
        <Card>
          <CardHead
            left={
              <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
                Transactions by amount range
              </span>
            }
          />
          <div style={{ padding: "16px 20px 20px" }}>
            {transactions.length === 0 ? (
              <div
                style={{
                  height: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.faint,
                  fontSize: 13,
                }}
              >
                No data
              </div>
            ) : (
              <div style={{ height: 160 }}>
                <Bar data={amtBar} options={{ ...methodOpts }} />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PAGE: USERS ──────────────────────────────────────────────────────────────
function UsersPage({ transactions }) {
  // Group by userId
  const userMap = {};
  transactions.forEach((tx) => {
    if (!userMap[tx.userId])
      userMap[tx.userId] = { total: 0, fraud: 0, totalAmount: 0 };
    userMap[tx.userId].total++;
    if (tx.isFraud) userMap[tx.userId].fraud++;
    userMap[tx.userId].totalAmount += Number(tx.amount) || 0;
  });
  const users = Object.entries(userMap).map(([id, data]) => ({ id, ...data }));

  return (
    <div>
      <PageTitle
        title="Users"
        sub={`${users.length} unique users found in transaction data`}
      />
      <Card>
        <CardHead
          left={
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
              User activity summary
            </span>
          }
          right={
            <span style={{ fontSize: 11, color: C.faint }}>
              {users.length} users
            </span>
          }
        />
        {users.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.faint,
              fontSize: 13,
            }}
          >
            No user data available
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {[
                    "User ID",
                    "Total Transactions",
                    "Fraud Count",
                    "Fraud Rate",
                    "Total Amount",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        color: C.faint,
                        borderBottom: `1px solid ${C.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const rate = ((u.fraud / u.total) * 100).toFixed(0);
                  const isRisky = u.fraud > 0;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.dark}` }}>
                      <td
                        style={{
                          padding: "11px 16px",
                          color: C.blueTx,
                          fontFamily: "monospace",
                          fontSize: 12,
                        }}
                      >
                        {u.id}
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          color: C.text,
                          fontWeight: 600,
                        }}
                      >
                        {u.total}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span
                          style={{
                            color: u.fraud > 0 ? C.red : C.green,
                            fontWeight: 600,
                          }}
                        >
                          {u.fraud}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span
                          style={{
                            padding: "2px 9px",
                            borderRadius: 5,
                            fontSize: 11,
                            fontWeight: 600,
                            background: isRisky ? C.redBg : C.greenBg,
                            color: isRisky ? C.red : C.green,
                            border: `1px solid ${isRisky ? "rgba(244,63,94,0.22)" : "rgba(34,197,94,0.22)"}`,
                          }}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "11px 16px",
                          color: C.text,
                          fontWeight: 600,
                        }}
                      >
                        ₹{u.totalAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── PAGE: REPORTS ────────────────────────────────────────────────────────────
function ReportsPage({ transactions, frauds, summary }) {
  const fraudRate = summary
    ? ((summary.fraud / (summary.total || 1)) * 100).toFixed(1)
    : "0.0";
  const highRisk = transactions.filter((t) => t.riskScore >= 70).length;
  const medRisk = transactions.filter(
    (t) => t.riskScore >= 40 && t.riskScore < 70,
  ).length;
  const lowRisk = transactions.filter((t) => t.riskScore < 40).length;
  const totalAmt = transactions.reduce(
    (s, t) => s + (Number(t.amount) || 0),
    0,
  );
  const fraudAmt = frauds.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const rows = [
    { label: "Total Transactions", value: summary?.total ?? 0 },
    { label: "Fraud Transactions", value: summary?.fraud ?? 0 },
    { label: "Safe Transactions", value: summary?.safe ?? 0 },
    { label: "Fraud Rate", value: `${fraudRate}%` },
    { label: "High Risk (score ≥ 70)", value: highRisk },
    { label: "Medium Risk (score 40–69)", value: medRisk },
    { label: "Low Risk (score < 40)", value: lowRisk },
    {
      label: "Total Amount Processed",
      value: `₹${totalAmt.toLocaleString("en-IN")}`,
    },
    {
      label: "Total Fraud Amount",
      value: `₹${fraudAmt.toLocaleString("en-IN")}`,
    },
  ];

  return (
    <div>
      <PageTitle
        title="Reports"
        sub="Summary report generated from current transaction data"
      />
      <Card>
        <CardHead
          left={
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
              PayGuard summary report
            </span>
          }
          right={
            <span style={{ fontSize: 11, color: C.muted }}>
              {new Date().toLocaleDateString("en-IN")}
            </span>
          }
        />
        <div style={{ padding: "8px 0 8px" }}>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom:
                  i < rows.length - 1 ? `1px solid ${C.dark}` : "none",
                background:
                  i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}
            >
              <span style={{ fontSize: 13, color: C.muted }}>{row.label}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.text,
                  fontFamily: "monospace",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── PAGE: SETTINGS ───────────────────────────────────────────────────────────
function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("http://localhost:5000/api");
  const [threshold, setThreshold] = useState(70);
  const [alerts, setAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Row = ({ label, sub, children }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: `1px solid ${C.dark}`,
      }}
    >
      <div>
        <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div>
      <PageTitle
        title="Settings"
        sub="Configure PayGuard dashboard preferences"
      />
      <Card>
        <CardHead
          left={
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
              Application settings
            </span>
          }
        />
        <Row label="API Base URL" sub="Backend server endpoint">
          <input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            style={{
              width: 260,
              padding: "7px 12px",
              borderRadius: 7,
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.text,
              fontSize: 13,
              fontFamily: "monospace",
              outline: "none",
            }}
          />
        </Row>
        <Row
          label="High Risk Threshold"
          sub={`Transactions with score ≥ ${threshold} are flagged high`}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="range"
              min={30}
              max={95}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{ width: 120, accentColor: C.red }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.red,
                minWidth: 28,
                fontFamily: "monospace",
              }}
            >
              {threshold}
            </span>
          </div>
        </Row>
        <Row label="Fraud Alerts" sub="Show alert badge for fraud transactions">
          <div
            onClick={() => setAlerts((a) => !a)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              cursor: "pointer",
              transition: "background 0.2s",
              background: alerts ? C.green : C.faint,
              position: "relative",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 3,
                transition: "left 0.2s",
                left: alerts ? 23 : 3,
              }}
            />
          </div>
        </Row>
        <div style={{ padding: "16px 20px" }}>
          <button
            onClick={save}
            style={{
              padding: "9px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: saved ? C.greenBg : C.blueBg,
              color: saved ? C.green : C.blueTx,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              border: `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`,
              transition: "all 0.2s",
            }}
          >
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── SIDEBAR NAV ITEM ─────────────────────────────────────────────────────────
function NavItem({ item, isActive, onClick, count }) {
  const [hov, setHov] = useState(false);
  const color = isActive ? C.blueTx : hov ? "#c9d3e0" : C.muted;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 10px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        color,
        background: isActive
          ? C.blueBg
          : hov
            ? "rgba(255,255,255,0.04)"
            : "transparent",
        margin: "1px 0",
        transition: "all 0.15s",
        userSelect: "none",
      }}
    >
      {Icons[item.icon](color)}
      <span style={{ flex: 1 }}>{item.label}</span>
      {count != null && (
        <span
          style={{
            fontSize: 10,
            padding: "1px 7px",
            borderRadius: 8,
            fontWeight: 600,
            background: item.danger ? C.redBg : C.blueBg,
            color: item.danger ? C.red : C.blueTx,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { id: "overview", label: "Overview", icon: "overview" },
  {
    id: "transactions",
    label: "Transactions",
    icon: "transactions",
    countKey: "total",
  },
  {
    id: "alerts",
    label: "Fraud Alerts",
    icon: "alerts",
    countKey: "fraud",
    danger: true,
  },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "users", label: "Users", icon: "users" },
];
const NAV_SYSTEM = [
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "settings", label: "Settings", icon: "settings" },
];

function Sidebar({ active, onNav, summary }) {
  return (
    <div
      style={{
        width: 220,
        minWidth: 220,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
      }}
    >
      <div style={{ padding: "0 12px", marginBottom: 4 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.faint,
            padding: "0 8px",
            marginBottom: 6,
          }}
        >
          Main
        </div>
        {NAV_MAIN.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={active === item.id}
            onClick={() => onNav(item.id)}
            count={item.countKey && summary ? summary[item.countKey] : null}
          />
        ))}
      </div>
      <div style={{ height: 1, background: C.border, margin: "10px 12px" }} />
      <div style={{ padding: "0 12px", marginBottom: 4 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.faint,
            padding: "0 8px",
            marginBottom: 6,
          }}
        >
          System
        </div>
        {NAV_SYSTEM.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={active === item.id}
            onClick={() => onNav(item.id)}
            count={null}
          />
        ))}
      </div>
      <div style={{ height: 1, background: C.border, margin: "10px 12px" }} />
      <div style={{ marginTop: "auto", padding: "0 12px" }}>
        <div
          style={{
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: C.green,
              fontWeight: 500,
              marginBottom: 3,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.green,
              }}
            />
            System online
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>
            All services running
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [frauds, setFrauds] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [page, setPage] = useState("overview");

  useEffect(() => {
    fetchSummary()
      .then(setSummary)
      .catch(() => {});
    fetchTransactions()
      .then(setTransactions)
      .catch(() => {});
    fetchFraudTransactions()
      .then(setFrauds)
      .catch(() => {});
    fetchRiskDistribution()
      .then(setRiskData)
      .catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const renderPage = () => {
    switch (page) {
      case "overview":
        return (
          <OverviewPage
            summary={summary}
            transactions={transactions}
            frauds={frauds}
            riskData={riskData}
          />
        );
      case "transactions":
        return <TransactionsPage transactions={transactions} />;
      case "alerts":
        return <AlertsPage frauds={frauds} summary={summary} />;
      case "analytics":
        return <AnalyticsPage transactions={transactions} summary={summary} />;
      case "users":
        return <UsersPage transactions={transactions} />;
      case "reports":
        return (
          <ReportsPage
            transactions={transactions}
            frauds={frauds}
            summary={summary}
          />
        );
      case "settings":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Sora','Segoe UI',sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0d0f14; }
        ::-webkit-scrollbar-thumb { background: #232738; border-radius: 3px; }
        input:focus { border-color: #3b82f6 !important; }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 220,
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 20px",
            borderRight: `1px solid ${C.border}`,
            height: "100%",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: C.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              flexShrink: 0,
            }}
          >
            🛡
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
            PayGuard
          </span>
          <span
            style={{
              fontSize: 9,
              padding: "2px 6px",
              borderRadius: 4,
              background: C.blueBg,
              color: C.blueTx,
              fontWeight: 600,
              letterSpacing: "0.05em",
              flexShrink: 0,
            }}
          >
            LIVE
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            paddingRight: 20,
          }}
        >
          <span style={{ fontSize: 12, color: C.muted }}>{today}</span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: C.card,
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {Icons.bell(C.muted)}
            <div
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.red,
                border: `1.5px solid ${C.surface}`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              paddingLeft: 12,
              borderLeft: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: C.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              A
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.text,
                  lineHeight: 1.2,
                }}
              >
                Avisha
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>Analyst</div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar active={page} onNav={setPage} summary={summary} />
        <main
          style={{ flex: 1, padding: "24px", overflowY: "auto", minWidth: 0 }}
        >
          {renderPage()}
          <div
            style={{
              textAlign: "center",
              marginTop: 40,
              color: C.faint,
              fontSize: 11,
            }}
          >
            PayGuard © {new Date().getFullYear()} · MERN Fraud Analytics
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
