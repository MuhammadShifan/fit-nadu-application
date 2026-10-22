import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AdminDashboard.css'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`);
      if (response.data.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
             <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
             </div>
          </div>
        </main>
      </div>
    );
  }

  const { stats, recentActivities, chartData, topGyms } = dashboardData;

  const gymOverviewData = [
    { name: 'Active Gyms', value: stats.gyms.active, color: '#E11D48' },
    { name: 'Pending Approval', value: stats.gyms.pending, color: '#F59E0B' },
    { name: 'Suspended', value: stats.gyms.suspended, color: '#52525B' },
  ];

  const formatDate = () => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const timeSince = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " secs ago";
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <main className="main-content">
        <Header />
        
        <div className="dashboard-container p-4">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-white fw-bold mb-1">Dashboard</h2>
              <p className="text-secondary m-0">Welcome back, Admin! Here's what's happening on your platform.</p>
            </div>
            <div className="date-picker-box">
              <i className="bi bi-calendar3 me-2"></i> {formatDate()} <i className="bi bi-chevron-down ms-2"></i>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card-hover">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="stat-icon bg-danger-soft text-danger">
                    <i className="bi bi-activity"></i>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-secondary mb-1">Total Gyms</p>
                  <h3 className="text-white fw-bold m-0">{stats.gyms.total}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card-hover">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="stat-icon bg-danger-soft text-danger">
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-secondary mb-1">Total Users</p>
                  <h3 className="text-white fw-bold m-0">{stats.users.total}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card-hover">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="stat-icon bg-danger-soft text-danger">
                    <i className="bi bi-person-badge-fill"></i>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-secondary mb-1">Total Trainers</p>
                  <h3 className="text-white fw-bold m-0">{stats.trainers.total}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="dashboard-card stat-card-hover">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="stat-icon bg-danger-soft text-danger">
                    <i className="bi bi-capsule"></i>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-secondary mb-1">Total Supplements</p>
                  <h3 className="text-white fw-bold m-0">{stats.supplements.total}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            
            <div className="col-12 col-lg-6">
              <div className="dashboard-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white m-0"><i className="bi bi-people-fill text-danger me-2"></i> User Growth</h5>
                  <select className="bg-dark text-secondary border-0" style={{outline:'none'}}>
                    <option>Last 6 Months</option>
                  </select>
                </div>
                <div style={{ width: '100%', height: '250px' }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E11D48" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                      <XAxis dataKey="name" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181B', border: '1px solid #27272A', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#E11D48' }} />
                      <Area type="monotone" dataKey="users" stroke="#E11D48" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-3">
              <div className="dashboard-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="text-white m-0"><i className="bi bi-activity text-danger me-2"></i> Gym Overview</h5>
                </div>
                
                <div className="d-flex justify-content-center position-relative" style={{ height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gymOverviewData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {gymOverviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#18181B', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <p className="text-secondary m-0" style={{fontSize: '11px'}}>Total Gyms</p>
                    <h4 className="text-white m-0 fw-bold">{stats.gyms.total}</h4>
                  </div>
                </div>

                <div className="mt-3">
                  {gymOverviewData.map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <span style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor: item.color, marginRight:'8px'}}></span>
                        <span className="text-secondary" style={{fontSize: '13px'}}>{item.name}</span>
                      </div>
                      <span className="text-white fw-bold" style={{fontSize: '13px'}}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-3">
              <div className="dashboard-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white m-0"><i className="bi bi-clock-history text-danger me-2"></i> Recent Activities</h5>
                  <span className="text-danger" style={{fontSize:'12px', cursor:'pointer'}}>View All</span>
                </div>
                
                <div className="activities-list">
                  {recentActivities.length > 0 ? recentActivities.map((activity, idx) => (
                    <div key={idx} className="d-flex align-items-start mb-3">
                      <div className="activity-icon me-3 text-danger bg-danger-soft">
                        <i className={`bi bi-${activity.type === 'gym' ? 'activity' : 'person'}`}></i>
                      </div>
                      <div>
                        <p className="text-white m-0" style={{fontSize: '14px', fontWeight: '500'}}>{activity.title}</p>
                        <p className="text-secondary m-0" style={{fontSize: '12px'}}>{activity.desc}</p>
                      </div>
                      <span className="text-secondary ms-auto" style={{fontSize: '11px'}}>{timeSince(activity.time)}</span>
                    </div>
                  )) : (
                    <p className="text-secondary text-center mt-4">No recent activities.</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="row g-4">
            
            <div className="col-12 col-lg-8">
              <div className="dashboard-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white m-0"><i className="bi bi-trophy-fill text-danger me-2"></i> Top Gyms by Users</h5>
                  <span className="text-danger" style={{fontSize:'12px', cursor:'pointer'}} onClick={() => navigate('/gyms')}>View All</span>
                </div>
                <div className="table-responsive">
                  <table className="table table-dark table-borderless align-middle custom-table">
                    <thead>
                      <tr>
                        <th className="text-secondary pb-3" style={{fontWeight:'500'}}>#</th>
                        <th className="text-secondary pb-3" style={{fontWeight:'500'}}>Gym Name</th>
                        <th className="text-secondary pb-3" style={{fontWeight:'500'}}>Location</th>
                        <th className="text-secondary pb-3 text-end" style={{fontWeight:'500'}}>Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topGyms.length > 0 ? topGyms.map((gym, idx) => (
                        <tr key={idx} style={{borderBottom: '1px solid #27272A'}}>
                          <td className="py-3 text-secondary">{idx + 1}</td>
                          <td className="py-3 text-white"><i className="bi bi-building text-danger me-2"></i> {gym.name}</td>
                          <td className="py-3 text-secondary">{gym.location}</td>
                          <td className="py-3 text-white fw-bold text-end">{gym.users}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-secondary">No active gyms found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="dashboard-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-white m-0"><i className="bi bi-lightning-charge-fill text-danger me-2"></i> Quick Actions</h5>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="quick-action-box" onClick={() => navigate('/gyms')}>
                      <div className="quick-action-icon text-danger"><i className="bi bi-plus-lg"></i></div>
                      <span className="text-white" style={{fontSize: '13px'}}>Add New Gym</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="quick-action-box" onClick={() => navigate('/trainers')}>
                      <div className="quick-action-icon text-danger"><i className="bi bi-person-plus-fill"></i></div>
                      <span className="text-white" style={{fontSize: '13px'}}>Add Trainer</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="quick-action-box" onClick={() => navigate('/supplements')}>
                      <div className="quick-action-icon text-danger"><i className="bi bi-capsule"></i></div>
                      <span className="text-white" style={{fontSize: '13px'}}>Add Supplement</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="quick-action-box">
                      <div className="quick-action-icon text-danger"><i className="bi bi-file-earmark-bar-graph"></i></div>
                      <span className="text-white" style={{fontSize: '13px'}}>View Reports</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}