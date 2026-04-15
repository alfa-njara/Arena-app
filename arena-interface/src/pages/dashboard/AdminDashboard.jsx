import React, { useState, useEffect } from "react";
import { 
  BsShieldLock, BsPeople, BsBuildings, BsActivity, 
  BsSearch, BsTrash, BsPauseCircle, BsPlayCircle,
  BsGraphUp, BsArrowRight, BsStarFill, BsStar,
  BsGem, BsLightningCharge, BsGlobe
} from "react-icons/bs";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import toast from "react-hot-toast";
import api from "../../api";
import { useAppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const { isDarkMode } = useAppContext();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
    // Real-time polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, companiesRes, customersRes] = await Promise.all([
        api.get("/admin/stats/"),
        api.get("/admin/companies/"),
        api.get("/admin/customers/")
      ]);
      setStats(statsRes.data.stats);
      setHistory(statsRes.data.history || []);
      setCompanies(companiesRes.data);
      setCustomers(customersRes.data);
    } catch (err) {
      toast.error("Failed to fetch admin data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, userType, action) => {
    try {
      const res = await api.post("/admin/user-action/", {
        user_id: userId,
        user_type: userType,
        action: action
      });
      
      if (res.data.status === "success" || res.data.status === "deleted") {
        if (action === "toggle_active" && res.data.is_active !== undefined) {
          if (userType === "company") {
            setCompanies(prev => prev.map(c => c.id === userId ? { ...c, is_active: res.data.is_active } : c));
          } else {
            setCustomers(prev => prev.map(c => c.id === userId ? { ...c, is_active: res.data.is_active } : c));
          }
        }
        
        const messages = {
          'delete': 'deleted',
          'toggle_active': res.data.is_active ? 'activated' : 'deactivated',
          'toggle_premium': res.data.is_premium ? 'upgraded to Premium' : 'premium removed'
        };
        toast.success(`${userType === 'company' ? 'Company' : 'Customer'} ${messages[action] || 'updated'} successfully`);
        fetchData(); // Refresh all stats
      }
    } catch (err) {
      toast.error("Action failed");
      console.error(err);
    }
  };

  const filteredCompanies = companies.filter(c => 
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone_number || "").includes(searchQuery)
  );

  const filteredCustomers = customers.filter(c => 
    (c.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone_number || "").includes(searchQuery)
  );

  if (loading && !stats) return <div className="p-5 text-center">Loading Admin Panel...</div>;

  return (
    <div className={`admin-dashboard ${isDarkMode ? "dark-mode" : ""}`}>
      <style>{`
        .admin-dashboard { padding: 30px; min-height: 100vh; color: var(--text-main); background: ${isDarkMode ? "#0f172a" : "#f8fafc"}; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
        .admin-header h1 { font-size: 1.8rem; font-weight: 800; display: flex; align-items: center; gap: 12px; margin: 0; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 35px; }
        .stat-card { 
          background: ${isDarkMode ? "rgba(30, 41, 59, 0.7)" : "white"};
          padding: 24px; border-radius: 24px; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"};
          display: flex; align-items: center; gap: 20px; transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .stat-icon { 
          width: 56px; height: 56px; border-radius: 16px; display: flex; 
          align-items: center; justify-content: center; font-size: 1.6rem;
        }
        .stat-info h3 { font-size: 0.8rem; font-weight: 700; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .stat-info p { font-size: 1.8rem; font-weight: 800; margin: 2px 0 0; }

        .overview-row { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 35px; }
        
        .chart-container { 
          background: ${isDarkMode ? "rgba(30, 41, 59, 0.7)" : "white"};
          padding: 25px; border-radius: 24px; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"};
          min-height: 400px;
        }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .chart-title { font-weight: 800; font-size: 1.1rem; color: ${isDarkMode ? "#e2e8f0" : "#1e293b"}; }

        .quick-stats { display: flex; flex-direction: column; gap: 20px; }
        .quick-stat-item {
          background: ${isDarkMode ? "rgba(30, 41, 59, 0.7)" : "white"};
          padding: 20px; border-radius: 24px; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"};
          display: flex; justify-content: space-between; align-items: center;
        }

        .admin-content { 
          background: ${isDarkMode ? "rgba(30, 41, 59, 0.7)" : "white"};
          border-radius: 24px; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"};
          overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .admin-tabs { 
          display: flex; gap: 40px; padding: 0 30px; border-bottom: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"};
          background: ${isDarkMode ? "rgba(15, 23, 42, 0.5)" : "#f8fafc"};
        }
        .tab-btn { 
          padding: 22px 0; border: none; background: none; font-weight: 700; font-size: 0.95rem;
          color: #94a3b8; cursor: pointer; position: relative; transition: color 0.2s;
        }
        .tab-btn.active { color: #3b82f6; }
        .tab-btn.active::after { 
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; 
          height: 4px; background: #3b82f6; border-radius: 4px 4px 0 0;
        }

        .table-controls { padding: 25px 30px; display: flex; justify-content: space-between; align-items: center; }
        .search-box { position: relative; width: 320px; }
        .search-box input { 
          width: 100%; padding: 12px 15px 12px 45px; border-radius: 14px;
          border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"};
          background: ${isDarkMode ? "#1e293b" : "white"};
          color: var(--text-main); outline: none; transition: 0.2s;
        }
        .search-box input:focus { border-color: #3b82f6; }
        .search-box svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }

        .admin-table-container { padding: 0 30px 30px; overflow-x: auto; }
        table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
        th { text-align: left; padding: 12px 15px; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; }
        td { padding: 18px 15px; background: ${isDarkMode ? "rgba(15, 23, 42, 0.3)" : "#fcfcfc"}; border-bottom: none; font-size: 0.95rem; }
        td:first-child { border-radius: 12px 0 0 12px; }
        td:last-child { border-radius: 0 12px 12px 0; }
        
        .badge { padding: 6px 12px; border-radius: 10px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .badge-premium { background: #fef3c7; color: #d97706; border: 1px solid #fbbf24; }
        .badge-free { background: #f1f5f9; color: #64748b; }
        
        .status-pill { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.85rem; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; }
        .status-active .status-dot { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
        .status-inactive .status-dot { background: #ef4444; }
        .status-active { color: #10b981; }
        .status-inactive { color: #ef4444; }

        .action-btn { 
          width: 36px; height: 36px; border-radius: 10px; border: none; 
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
        }
        .btn-toggle { background: #dbeafe; color: #2563eb; }
        .btn-delete { background: #fee2e2; color: #ef4444; }
        .btn-premium { background: #ffedd5; color: #d97706; }
        .btn-premium.is-active-premium { background: #d97706; color: white; }
        .action-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div className="admin-header pb-2">
         {/* Title and Refresh button removed as requested */}
      </div>

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><BsBuildings /></div>
              <div className="stat-info">
                <h3>Total Companies</h3>
                <p>{stats.total_companies}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><BsPeople /></div>
              <div className="stat-info">
                <h3>Total Customers</h3>
                <p>{stats.total_customers}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}><BsGem /></div>
              <div className="stat-info">
                <h3>Premium</h3>
                <p>{stats.premium_companies}</p>
                <small className="text-muted fw-bold">{stats.premium_ratio}% ratio</small>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}><BsGlobe /></div>
              <div className="stat-info">
                <h3>Online Now</h3>
                <p>{stats.online_now}</p>
                <small className="text-muted fw-bold">Active within 24h</small>
              </div>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="overview-row animate__animated animate__fadeIn">
              <div className="chart-container">
                <div className="chart-header">
                  <div className="chart-title">Registration Trends (Last 30 Days)</div>
                  <div className="badge bg-primary-subtle text-primary border-0">Daily Registrations</div>
                </div>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#94a3b8'}}
                        minTickGap={30}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
                          border: 'none', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorTotal)" 
                        name="Total Registration"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="companies" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={0} 
                        name="Companies"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="quick-stats">
                <div className="quick-stat-item">
                  <div>
                    <h3 className="small text-muted fw-bold mb-1">TOTAL ENGAGEMENT</h3>
                    <div className="h4 fw-bold mb-0">{stats.total_engagement}</div>
                    <small className="text-muted fw-bold">Visits + Favorites</small>
                  </div>
                  <BsGraphUp style={{ color: '#3b82f6' }} size={24} />
                </div>
                <div className="quick-stat-item">
                  <div>
                    <h3 className="small text-muted fw-bold mb-1">GROWTH RATE</h3>
                    <div className="h4 fw-bold mb-0 text-success">+12.5%</div>
                    <small className="text-muted fw-bold">vs last month</small>
                  </div>
                  <BsArrowRight style={{ color: '#8b5cf6' }} size={24} />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="admin-content">
        <div className="admin-tabs">
          {["overview", "companies", "customers"].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>

        {activeTab !== "overview" && (
          <>
            <div className="table-controls animate__animated animate__fadeIn">
              <div className="search-box">
                <BsSearch size={14} />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab === 'companies' ? 'by company name...' : 'by full name...'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="text-muted fw-bold small">
                {activeTab === 'companies' ? `${filteredCompanies.length} registered companies` : `${filteredCustomers.length} active customers`}
              </span>
            </div>

            <div className="admin-table-container animate__animated animate__fadeIn">
              <table>
                <thead>
                  {activeTab === 'companies' ? (
                    <tr>
                      <th>Company</th>
                      <th>Contact</th>
                      <th>Category</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Manage</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Manage</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {activeTab === 'companies' ? (
                    filteredCompanies.map(comp => (
                      <tr key={comp.id}>
                        <td className="fw-bold">{comp.name}</td>
                        <td>{comp.phone_number}</td>
                        <td>{comp.contribution_type}</td>
                        <td>
                          <span className={`badge ${comp.is_premium ? 'badge-premium' : 'badge-free'}`}>
                            {comp.is_premium ? 'Premium' : 'Free'}
                          </span>
                        </td>
                        <td>
                          <div className={`status-pill ${comp.is_active ? 'status-active' : 'status-inactive'}`}>
                            <span className="status-dot"></span>
                            <span>{comp.is_active ? 'Activated' : 'Deactivated'}</span>
                          </div>
                        </td>
                        <td className="action-btns">
                           <div className="d-flex gap-2">
                            <button 
                              className={`action-btn btn-premium ${comp.is_premium ? 'is-active-premium' : ''}`}
                              title={comp.is_premium ? "Downgrade to Free" : "Upgrade to Premium"}
                              onClick={() => {
                                if(window.confirm(`Change premium status for ${comp.name}?`)) handleAction(comp.id, 'company', 'toggle_premium');
                              }}
                            >
                              <BsGem size={14} />
                            </button>
                            <button 
                              className="action-btn btn-toggle" 
                              title={comp.is_active ? "Suspend Account" : "Activate Account"}
                              onClick={() => handleAction(comp.id, 'company', 'toggle_active')}
                            >
                              {comp.is_active ? <BsPauseCircle size={16} /> : <BsPlayCircle size={16} />}
                            </button>
                            <button 
                              className="action-btn btn-delete" 
                              onClick={() => {
                                if(window.confirm(`Are you sure you want to delete ${comp.name}?`)) handleAction(comp.id, 'company', 'delete');
                              }}
                            >
                              <BsTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredCustomers.map(cust => (
                      <tr key={cust.id}>
                        <td className="fw-bold">{cust.full_name}</td>
                        <td>{cust.phone_number}</td>
                        <td>
                          <div className={`status-pill ${cust.is_active ? 'status-active' : 'status-inactive'}`}>
                            <span className="status-dot"></span>
                            {cust.is_active ? 'Activated' : 'Deactivated'}
                          </div>
                        </td>
                        <td className="action-btns">
                          <div className="d-flex gap-2">
                            <button 
                              className="action-btn btn-toggle" 
                              onClick={() => handleAction(cust.id, 'customer', 'toggle_active')}
                            >
                              {cust.is_active ? <BsPauseCircle size={16} /> : <BsPlayCircle size={16} />}
                            </button>
                            <button 
                              className="action-btn btn-delete" 
                              onClick={() => {
                                if(window.confirm(`Delete customer ${cust.full_name}?`)) handleAction(cust.id, 'customer', 'delete');
                              }}
                            >
                              <BsTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
