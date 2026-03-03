import React, { useState, useMemo } from "react";
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
} from "react-icons/lu";

// GÉNÉRATION DE DONNÉES MASSIVES (Simulation d'une année complète)
const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = 60; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);

    // Déterminer le timeframe pour le filtrage
    let timeframe = "year";
    if (i <= 30) timeframe = "month";
    if (i <= 7) timeframe = "week";

    data.push({
      date: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      views: Math.floor(Math.random() * 500) + (60 - i) * 10, // Croissance simulée
      favorites: Math.floor(Math.random() * 50) + (60 - i) * 2,
      timeframe: timeframe,
    });
  }
  return data;
};

const massiveData = generateData();

const Dashboard = ({ isDarkMode }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [metric, setMetric] = useState("views");
  const [timeframe, setTimeframe] = useState("month");

  const processedChartData = useMemo(() => {
    // Filtrage par période
    let filtered = massiveData;
    if (timeframe === "week") filtered = massiveData.slice(-7);
    else if (timeframe === "month") filtered = massiveData.slice(-30);
    else filtered = massiveData;

    // Tri
    return [...filtered].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
  }, [sortOrder, timeframe]);

  const glassStyle = {
    background: isDarkMode
      ? "rgba(30, 30, 30, 0.7)"
      : "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
    borderRadius: "24px",
  };

  return (
    <div className={`dashboard-wrapper ${isDarkMode ? "bg-dark" : "bg-light"}`}>
      <div className="container-fluid h-100 d-flex flex-column p-4">
        {/* STATS CARDS */}
        <div className="row g-3 mb-4 flex-shrink-0">
          {[
            {
              label: "Views",
              value: "24,592",
              trend: "+18%",
              isUp: true,
              icon: <LuEye />,
              color: "#0d6efd",
            },
            {
              label: "Hearts",
              value: "3,102",
              trend: "+12%",
              isUp: true,
              icon: <LuHeart />,
              color: "#dc3545",
            },
            {
              label: "Growth",
              value: "14.2%",
              trend: "+2.1%",
              isUp: true,
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
                <h4
                  className={`fw-bold mb-0 ${isDarkMode ? "text-white" : "text-dark"}`}
                >
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
            {/* CHART AREA */}
            <div
              className="flex-grow-1 p-4 shadow-sm d-flex flex-column"
              style={glassStyle}
            >
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div className="btn-group p-1 bg-secondary bg-opacity-10 rounded-4">
                  {["week", "month", "year"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`btn btn-sm border-0 rounded-3 px-3 text-capitalize fw-bold ${timeframe === t ? (isDarkMode ? "btn-light text-dark" : "btn-dark text-white") : isDarkMode ? "text-white" : "text-dark"}`}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-glass btn-sm d-flex align-items-center gap-2 px-3 ${isDarkMode ? "text-white" : "text-dark"}`}
                    onClick={() =>
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                    }
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
                      <linearGradient
                        id="chartGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={metric === "views" ? "#0d6efd" : "#dc3545"}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={metric === "views" ? "#0d6efd" : "#dc3545"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#eee"}
                    />
                    <XAxis
                      dataKey="label"
                      stroke="#888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval={
                        timeframe === "year" ? 6 : timeframe === "month" ? 4 : 0
                      } // Évite la surcharge de texte
                    />
                    <YAxis
                      stroke="#888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={metric}
                      stroke={metric === "views" ? "#0d6efd" : "#dc3545"}
                      fillOpacity={1}
                      fill="url(#chartGrad)"
                      strokeWidth={3}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ACTIVITY FEED */}
          <div className="col-lg-4 h-100">
            <div
              className="h-100 d-flex flex-column p-4 shadow-sm"
              style={glassStyle}
            >
              <h6
                className={`fw-bold mb-4 text-uppercase tracking-widest ${isDarkMode ? "text-white" : "text-dark"}`}
                style={{ fontSize: "0.7rem" }}
              >
                Live Activity
              </h6>
              <div className="flex-grow-1 overflow-auto pe-2 custom-scroll">
                {massiveData.slice(0, 15).map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center gap-3 mb-3 p-2 rounded-4 hover-effect"
                  >
                    <div
                      className={`avatar rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                      style={{
                        width: "36px",
                        height: "36px",
                        background:
                          idx % 3 === 0
                            ? "rgba(13, 110, 253, 0.1)"
                            : "rgba(220, 53, 69, 0.1)",
                        color: idx % 3 === 0 ? "#0d6efd" : "#dc3545",
                      }}
                    >
                      {idx % 3 === 0 ? (
                        <LuUser size={16} />
                      ) : (
                        <LuHeart size={16} />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p
                        className={`mb-0 fw-bold text-truncate small ${isDarkMode ? "text-white" : "text-dark"}`}
                      >
                        {idx % 3 === 0 ? "Visitor" : "Contributor"} interacting
                      </p>
                      <span className="text-muted x-small">
                        {item.label} • {12 + (idx % 12)}:00
                      </span>
                    </div>
                  </div>
                ))}
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
