import React, { useState, useMemo, useEffect } from "react";
import api from "../../api";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  LuEye,
  LuHeart,
  LuTrendingUp,
  LuUser,
  LuArrowUpDown,
  LuLock,
  LuPhone,
  LuShieldCheck,
} from "react-icons/lu";
import { BsGem, BsStarFill } from "react-icons/bs";
import { useAppContext } from "../../context/AppContext";

// ── PREMIUM LOCKED VIEW ──
const PremiumLockedView = ({ isDarkMode }) => {
  return (
    <div style={{
      height: "calc(100vh - 70px)",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDarkMode ? "#0f172a" : "#f8fafc",
      padding: "20px",
    }}>
      <div style={{
        background: isDarkMode ? "#1e293b" : "white",
        border: `1px solid ${isDarkMode ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.2)"}`,
        borderRadius: "32px",
        padding: "50px 40px",
        maxWidth: "550px", 
        width: "100%",
        textAlign: "center",
        boxShadow: isDarkMode 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
          : "0 25px 50px -12px rgba(245, 158, 11, 0.1)",
        position: "relative",
      }}>
        {/* Premium Badge */}
        <div style={{
          position: "absolute",
          top: "-15px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          padding: "8px 20px",
          borderRadius: "12px",
          fontSize: "0.8rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)",
        }}>
          <BsStarFill /> PREMIUM ACCESS REQUIRED
        </div>

        {/* Big Icon Container */}
        <div style={{
          width: "90px",
          height: "90px",
          borderRadius: "24px",
          background: "rgba(245, 158, 11, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 30px",
        }}>
          <LuLock size={40} color="#f59e0b" />
        </div>

        <h2 style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          marginBottom: "15px",
          color: isDarkMode ? "#f1f5f9" : "#0f172a",
        }}>
          Dashboard Locked
        </h2>

        <p style={{
          fontSize: "1.05rem",
          color: isDarkMode ? "#94a3b8" : "#64748b",
          marginBottom: "35px",
          lineHeight: 1.6,
        }}>
          Advanced statistics and performance tracking are reserved for Premium accounts. Turn your data into opportunities today.
        </p>

        {/* Benefits Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginBottom: "40px",
          textAlign: "left",
        }}>
          {[
            "Real-time analytics",
            "Favorites tracking",
            "Unlimited history",
            "Priority support"
          ].map((text, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px",
              background: isDarkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: isDarkMode ? "#cbd5e1" : "#475569",
            }}>
              <LuShieldCheck color="#f59e0b" size={18} />
              {text}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          textAlign: "left",
          borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
          paddingTop: "30px",
          marginBottom: "35px",
        }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "15px", color: "#f59e0b" }}>
            How to activate my access?
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "20px" }}>
            Please contact our administration team for immediate activation of your analytical tools.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => window.open("tel:+261000000000")}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "white",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 10px 25px -5px rgba(217, 119, 6, 0.4)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
            e.currentTarget.style.boxShadow = "0 20px 30px -10px rgba(217, 119, 6, 0.5)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(217, 119, 6, 0.4)";
          }}
        >
          <LuPhone />
          Call Administrator
        </button>
      </div>
    </div>
  );
};

// ── MAIN DASHBOARD COMPONENT ──
const Dashboard = () => {
  const { isDarkMode, user } = useAppContext();
  const [sortOrder, setSortOrder] = useState("asc");
  const [metric, setMetric] = useState("views");
  const [timeframe, setTimeframe] = useState("month");
  const [stats, setStats] = useState({
    chart_data: [],
    recent_activity: [],
    total_views: 0,
    total_favorites: 0,
    growth: "+0%"
  });

  const [isPremium, setIsPremium] = useState(user?.isPremium || false);
  const [loadingPremium, setLoadingPremium] = useState(true);

  useEffect(() => {
    api.get("/companies/me/")
      .then(res => {
        const premiumStatus = res.data?.is_premium || false;
        setIsPremium(premiumStatus);
        localStorage.setItem("is_premium", premiumStatus);
      })
      .catch(() => {})
      .finally(() => setLoadingPremium(false));
  }, []);

  useEffect(() => {
    if (!isPremium) return;
    
    api.get("/companies/stats/")
       .then(res => {
         if (res.data && res.data.chart_data) {
           setStats(res.data);
         }
       })
       .catch(err => console.error("Error fetching stats:", err));
  }, [isPremium]);

  const processedChartData = useMemo(() => {
    let filtered = stats.chart_data;
    if (timeframe === "week") filtered = stats.chart_data.slice(-7);
    else if (timeframe === "month") filtered = stats.chart_data.slice(-30);
    else filtered = stats.chart_data;

    return [...filtered].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
  }, [sortOrder, timeframe, stats.chart_data]);

  const glassStyle = {
    background: isDarkMode
      ? "rgba(30, 30, 30, 0.7)"
      : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
    borderRadius: "24px",
  };

  if (loadingPremium) {
    return (
      <div style={{ height: "calc(100vh - 70px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return <PremiumLockedView isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`dashboard-wrapper ${isDarkMode ? "bg-dark" : "bg-light"}`}>
      <div className="container-fluid h-100 d-flex flex-column p-4">
        {/* STATS CARDS */}
        <div className="row g-3 mb-4 flex-shrink-0">
          {[
            {
              label: "Views",
              value: stats.total_views.toLocaleString(),
              trend: stats.growth,
              isUp: !stats.growth.includes("-"),
              icon: <LuEye />,
              color: "#0d6efd",
            },
            {
              label: "Hearts",
              value: stats.total_favorites.toLocaleString(),
              trend: "N/A",
              isUp: true,
              icon: <LuHeart />,
              color: "#dc3545",
            },
            {
              label: "Growth",
              value: stats.growth,
              trend: "vs last 30d",
              isUp: !stats.growth.includes("-"),
              icon: <LuTrendingUp />,
              color: "#198754",
            },
          ].map((s, i) => (
            <div className="col-4" key={i}>
              <div className="p-3 shadow-sm h-100 border-0" style={glassStyle}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div
                    className="p-2 rounded-3"
                    style={{ background: `${s.color}20`, color: s.color }}
                  >
                    {s.icon}
                  </div>
                  <span
                    className={`badge rounded-pill ${s.isUp ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {s.trend}
                  </span>
                </div>
                <h4 className={`fw-bold mb-0 ${isDarkMode ? "text-white" : "text-dark"}`}>
                  {s.value}
                </h4>
                <span className="text-muted x-small fw-bold text-uppercase">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 flex-grow-1 overflow-hidden min-h-0">
          <div className="col-lg-8 d-flex flex-column h-100">
            <div className="flex-grow-1 p-4 shadow-sm d-flex flex-column" style={glassStyle}>
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div className="btn-group p-1 bg-secondary bg-opacity-10 rounded-4">
                  {["week", "month", "year"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`btn btn-sm border-0 rounded-3 px-3 text-capitalize fw-bold ${
                        timeframe === t
                          ? isDarkMode ? "btn-light text-dark" : "btn-dark text-white"
                          : isDarkMode ? "text-white" : "text-dark"
                      }`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-glass btn-sm d-flex align-items-center gap-2 px-3 ${isDarkMode ? "text-white" : "text-dark"}`}
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  >
                    <LuArrowUpDown size={14} />
                    <span className="fw-bold" style={{ fontSize: "0.7rem" }}>
                      {sortOrder === "desc" ? "Latest" : "Oldest"}
                    </span>
                  </button>

                  <div className="btn-group p-1 bg-secondary bg-opacity-10 rounded-4">
                    <button
                      onClick={() => setMetric("views")}
                      className={`btn btn-sm border-0 rounded-3 px-3 fw-bold ${metric === "views" ? "btn-primary shadow-sm" : isDarkMode ? "text-white" : "text-dark"}`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      Views
                    </button>
                    <button
                      onClick={() => setMetric("favorites")}
                      className={`btn btn-sm border-0 rounded-3 px-3 fw-bold ${metric === "favorites" ? "btn-danger shadow-sm" : isDarkMode ? "text-white" : "text-dark"}`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      Hearts
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-grow-1 w-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processedChartData}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={metric === "views" ? "#0d6efd" : "#dc3545"} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={metric === "views" ? "#0d6efd" : "#dc3545"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#eee"} />
                    <XAxis dataKey="label" stroke="#888" fontSize={10} tickLine={false} axisLine={false} interval={timeframe === "year" ? 6 : timeframe === "month" ? 4 : 0} />
                    <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#1e1e1e" : "#fff", borderRadius: "12px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }} />
                    <Area type="monotone" dataKey={metric} stroke={metric === "views" ? "#0d6efd" : "#dc3545"} fillOpacity={1} fill="url(#chartGrad)" strokeWidth={3} animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4 h-100">
            <div className="h-100 d-flex flex-column p-4 shadow-sm" style={glassStyle}>
              <h6 className={`fw-bold mb-4 text-uppercase tracking-widest ${isDarkMode ? "text-white" : "text-dark"}`} style={{ fontSize: "0.7rem" }}>Live Activity</h6>
              <div className="flex-grow-1 overflow-auto pe-2 custom-scroll">
                {stats.recent_activity.length > 0 ? stats.recent_activity.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 mb-3 p-2 rounded-4 hover-effect">
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: item.type === "visit" ? "rgba(13, 110, 253, 0.1)" : "rgba(220, 53, 69, 0.1)", color: item.type === "visit" ? "#0d6efd" : "#dc3545", display: "flex", alignItems: "center", justifyCenter: "content", flexShrink: 0 }}>
                      {item.type === "visit" ? <LuUser size={16} /> : <LuHeart size={16} />}
                    </div>
                    <div className="overflow-hidden">
                      <p className={`mb-0 fw-bold text-truncate small ${isDarkMode ? "text-white" : "text-dark"}`}>{item.user}</p>
                      <span className="text-muted x-small">{item.type === "favorite" ? "Favorited you" : "Viewed your profile"} • {item.label} {item.time_label}</span>
                    </div>
                  </div>
                )) : <p className="text-muted text-center mt-4 small">No recent activity yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-wrapper { height: calc(100vh - 70px); width: 100%; overflow: hidden; }
        .btn-glass { background: rgba(128,128,128,0.05); border: 1px solid rgba(128,128,128,0.1); border-radius: 12px; transition: all 0.2s; }
        .btn-glass:hover { background: rgba(128,128,128,0.15); }
        .x-small { font-size: 0.65rem; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }
        .hover-effect:hover { background: rgba(128,128,128,0.05); cursor: pointer; transform: translateX(5px); }
        .min-h-0 { min-height: 0; }
        .tracking-widest { letter-spacing: 0.2em; }
      `}</style>
    </div>
  );
};

export default Dashboard;
