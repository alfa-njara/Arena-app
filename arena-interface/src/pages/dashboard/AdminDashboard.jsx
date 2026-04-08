import React, { useState, useEffect } from "react";
import { 
  BsShieldLock, BsPeople, BsBuildings, BsActivity, 
  BsSearch, BsTrash, BsPauseCircle, BsPlayCircle,
  BsGraphUp, BsArrowRight, BsStarFill, BsStar,
  BsGem
} from "react-icons/bs";
import toast from "react-hot-toast";
import api from "../../api";
import { useAppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const { isDarkMode } = useAppContext();
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
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
        let successMsg = "Action completed";
        if (action === 'delete') successMsg = "Account deleted";
        else if (action === 'toggle_active') {
          successMsg = res.data.is_active ? "Account Activated ✅" : "Account Deactivated ⏸️";
        } else if (action === 'toggle_premium') {
          successMsg = res.data.is_premium ? "Upgraded to Premium ⭐" : "Premium removed";
        }
        
        toast.success(successMsg);
        fetchData(); // Refresh
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
        .admin-dashboard { padding: 25px; min-height: 100vh; color: var(--text-main); }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .admin-header h1 { font-size: 1.8rem; font-weight: 800; display: flex; align-items: center; gap: 12px; margin: 0; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 35px; }
        .stat-card { 
          background: ${isDarkMode ? "rgba(255,255,255,0.05)" : "white"};
          padding: 24px; border-radius: 20px; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9"};
          display: flex; align-items: center; gap: 20px; transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-icon { 
          width: 54px; height: 54px; border-radius: 14px; display: flex; 
          align-items: center; justify-content: center; font-size: 1.5rem;
        }
        .stat-info h3 { font-size: 0.85rem; font-weight: 600; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-info p { font-size: 1.6rem; font-weight: 800; margin: 2px 0 0; }

        .admin-content { 
          background: ${isDarkMode ? "rgba(255,255,255,0.03)" : "white"};
          border-radius: 24px; border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9"};
          overflow: hidden;
        }
        .admin-tabs { 
          display: flex; gap: 30px; padding: 0 25px; border-bottom: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9"};
          background: ${isDarkMode ? "rgba(0,0,0,0.2)" : "#f8fafc"};
        }
        .tab-btn { 
          padding: 20px 0; border: none; background: none; font-weight: 700; font-size: 0.95rem;
          color: #94a3b8; cursor: pointer; position: relative;
        }
        .tab-btn.active { color: #2563eb; }
        .tab-btn.active::after { 
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; 
          height: 3px; background: #2563eb; border-radius: 3px 3px 0 0;
        }

        .table-controls { padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; }
        .search-box { 
          position: relative; width: 300px;
        }
        .search-box input { 
          width: 100%; padding: 10px 15px 10px 40px; border-radius: 12px;
          border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"};
          background: ${isDarkMode ? "rgba(255,255,255,0.05)" : "white"};
          color: var(--text-main); outline: none;
        }
        .search-box svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }

        .admin-table-container { padding: 0 25px 25px; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px; font-size: 0.8rem; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "#f1f5f9"}; }
        td { padding: 16px 12px; border-bottom: 1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"}; font-size: 0.9rem; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .badge-success { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .badge-danger { background: rgba(239, 68, 68, 0.1); color: #ef4242; }
        .badge-premium { 
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 179, 8, 0.15)); 
          color: #f59e0b; 
          display: inline-flex; align-items: center; gap: 4px;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .badge-free { 
          background: ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}; 
          color: #94a3b8; 
          display: inline-flex; align-items: center; gap: 4px;
        }
        
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.8rem;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-active .status-dot { background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.4); }
        .status-inactive .status-dot { background: #ef4242; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
        .status-active { color: #22c55e; }
        .status-inactive { color: #ef4242; }

        .action-btns { display: flex; gap: 8px; }
        .action-btn { 
          width: 32px; height: 32px; border-radius: 8px; border: none; 
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
        }
        .btn-toggle { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
        .btn-delete { background: rgba(239, 68, 68, 0.1); color: #ef4242; }
        .btn-premium { 
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 179, 8, 0.15)); 
          color: #f59e0b;
          position: relative;
          overflow: hidden;
        }
        .btn-premium::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent, rgba(245, 158, 11, 0.1), transparent);
          animation: premiumShine 3s infinite;
        }
        .btn-premium.is-active-premium {
          background: linear-gradient(135deg, #f59e0b, #eab308);
          color: white;
          box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
        }
        @keyframes premiumShine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        .action-btn:hover { transform: scale(1.1); }
      `}</style>

      {stats && (
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
            <BsBuildings />
          </div>
          <div className="stat-info">
            <h3>Total Companies</h3>
            <p>{stats.total_companies}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
            <BsPeople />
          </div>
          <div className="stat-info">
            <h3>Total Customers</h3>
            <p>{stats.total_customers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 179, 8, 0.15))', color: '#f59e0b' }}>
            <BsGem />
          </div>
          <div className="stat-info">
            <h3>Premium</h3>
            <p>{stats.premium_companies || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <BsActivity />
          </div>
          <div className="stat-info">
            <h3>Active Rate</h3>
            <p>{Math.round(((stats.active_companies + stats.active_customers) / (stats.total_companies + stats.total_customers || 1)) * 100)}%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <BsGraphUp />
          </div>
          <div className="stat-info">
            <h3>Platform Status</h3>
            <p>Healthy</p>
          </div>
        </div>
      </div>
      )}

      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >Overview</button>
          <button 
            className={`tab-btn ${activeTab === "companies" ? "active" : ""}`}
            onClick={() => setActiveTab("companies")}
          >Companies</button>
          <button 
            className={`tab-btn ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >Customers</button>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <BsSearch size={14} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'companies' ? 'by company name...' : 'by full name...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="text-muted x-small">
            {activeTab === 'companies' ? `${filteredCompanies.length} companies` : `${filteredCustomers.length} customers`}
          </span>
        </div>

        <div className="admin-table-container">
          <table>
            <thead>
              {activeTab === 'companies' ? (
                <tr>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Premium</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              ) : (
                <tr>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeTab === 'companies' ? (
                filteredCompanies.map(comp => (
                  <tr key={comp.id}>
                    <td className="fw-bold">{comp.name}</td>
                    <td>{comp.phone_number}</td>
                    <td><small>{comp.contribution_type}</small></td>
                    <td>
                      {comp.is_premium ? (
                        <span className="badge badge-premium">
                          <BsStarFill size={10} /> Premium
                        </span>
                      ) : (
                        <span className="badge badge-free">
                          <BsStar size={10} /> Free
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={`status-pill ${comp.is_active ? 'status-active' : 'status-inactive'}`}>
                        <span className="status-dot"></span>
                        {comp.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="action-btns">
                      <button 
                        className={`action-btn btn-premium ${comp.is_premium ? 'is-active-premium' : ''}`}
                        title={comp.is_premium ? "Remove Premium" : "Activate Premium"}
                        onClick={() => {
                          const msg = comp.is_premium 
                            ? `Remove premium from ${comp.name}?` 
                            : `Activate premium for ${comp.name}?`;
                          if(window.confirm(msg)) handleAction(comp.id, 'company', 'toggle_premium');
                        }}
                      >
                        {comp.is_premium ? <BsStarFill /> : <BsStar />}
                      </button>
                      <button 
                        className="action-btn btn-toggle" 
                        title={comp.is_active ? "Deactivate" : "Activate"}
                        onClick={() => handleAction(comp.id, 'company', 'toggle_active')}
                      >
                        {comp.is_active ? <BsPauseCircle /> : <BsPlayCircle />}
                      </button>
                      <button 
                        className="action-btn btn-delete" 
                        title="Delete"
                        onClick={() => {
                          if(window.confirm(`Delete ${comp.name}?`)) handleAction(comp.id, 'company', 'delete');
                        }}
                      >
                        <BsTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'customers' ? (
                filteredCustomers.map(cust => (
                  <tr key={cust.id}>
                    <td className="fw-bold">{cust.full_name}</td>
                    <td>{cust.phone_number}</td>
                    <td>
                      <div className={`status-pill ${cust.is_active ? 'status-active' : 'status-inactive'}`}>
                        <span className="status-dot"></span>
                        {cust.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="action-btns">
                      <button 
                        className="action-btn btn-toggle" 
                        title={cust.is_active ? "Deactivate" : "Activate"}
                        onClick={() => handleAction(cust.id, 'customer', 'toggle_active')}
                      >
                        {cust.is_active ? <BsPauseCircle /> : <BsPlayCircle />}
                      </button>
                      <button 
                        className="action-btn btn-delete" 
                        title="Delete"
                        onClick={() => {
                          if(window.confirm(`Delete ${cust.full_name}?`)) handleAction(cust.id, 'customer', 'delete');
                        }}
                      >
                        <BsTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <p className="mb-3 text-muted">Ready to manage your platform?</p>
                    <div className="d-flex justify-content-center gap-3">
                      <button onClick={() => setActiveTab("companies")} className="btn btn-primary btn-sm rounded-pill px-4">Manage Companies</button>
                      <button onClick={() => setActiveTab("customers")} className="btn btn-outline-primary btn-sm rounded-pill px-4">Manage Customers</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
