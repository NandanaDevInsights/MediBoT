import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css';
import logoImage from '../assets/Logo.png';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalType, setModalType] = useState(null);
    const [toast, setToast] = useState(null);

    const [currentUser] = useState({
        name: 'Super Admin',
        email: 'admin@medibot.com',
        role: 'System Administrator',
        lastLogin: new Date().toLocaleString()
    });

    const handleLogout = () => {
        // Clear any auth tokens here
        navigate('/');
    };

    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, message: 'New lab registration request: "City Care Diagnostics"', time: '10 mins ago', type: 'alert' },
        { id: 2, message: 'System backup completed successfully.', time: '2 hours ago', type: 'info' },
        { id: 3, message: 'Monthly growth report is ready for download.', time: '5 hours ago', type: 'success' },
        { id: 4, message: 'High traffic detected on server node A-1.', time: 'Yesterday', type: 'warning' }
    ];

    // --- Mock Data ---
    // --- Mock Data ---
    const bookingsData = [
        { name: 'Jan', bookings: 1240 },
        { name: 'Feb', bookings: 1580 },
        { name: 'Mar', bookings: 2100 },
        { name: 'Apr', bookings: 1950 },
        { name: 'May', bookings: 2600 },
        { name: 'Jun', bookings: 3100 },
    ];

    const labPerformanceData = [
        { name: 'Central City', tests: 450, revenue: 12000 },
        { name: 'Westside', tests: 320, revenue: 8500 },
        { name: 'Metro Health', tests: 580, revenue: 16000 },
        { name: 'Summit Path', tests: 210, revenue: 5400 },
    ];

    const userRolesData = [
        { name: 'Patients', value: 15420, fill: '#3b82f6' },
        { name: 'Lab Admins', value: 145, fill: '#10b981' },
        { name: 'Super Admins', value: 5, fill: '#6366f1' },
    ];

    const [globalStats] = useState({
        totalLabs: 42,
        activePatients: 15420,
        dailyBookings: 845,
        systemHealth: '99.9%'
    });

    const [labs, setLabs] = useState([
        { id: 'L001', name: 'Central City Lab', location: 'New York, NY', admin: 'Alice Smith', status: 'Active', bookings: 2450 },
        { id: 'L002', name: 'Westside Diagnostics', location: 'Los Angeles, CA', admin: 'Bob Jones', status: 'Pending', bookings: 0 },
        { id: 'L003', name: 'Metro Health Lab', location: 'Chicago, IL', admin: 'Charlie Day', status: 'Active', bookings: 1205 },
        { id: 'L004', name: 'Summit Path Labs', location: 'Denver, CO', admin: 'Dana White', status: 'Suspended', bookings: 340 }
    ]);

    const [users, setUsers] = useState([
        { id: 'U100', name: 'John Doe', role: 'Lab Admin', email: 'john@cclab.com', status: 'Active' },
        { id: 'U101', name: 'Jane Roe', role: 'Super Admin', email: 'jane@medibot.com', status: 'Active' },
        { id: 'U102', name: 'Mark Twain', role: 'Patient', email: 'mark@gmail.com', status: 'Inactive' }
    ]);

    const [systemLogs] = useState([
        { id: 1, type: 'Security', message: 'Failed login attempt from IP 192.168.1.1', time: '10 mins ago' },
        { id: 2, type: 'System', message: 'Database backup completed successfully', time: '1 hour ago' },
        { id: 3, type: 'User', message: 'New Lab "North Star" registered', time: '3 hours ago' }
    ]);

    // --- Helpers ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (msg) => setToast(msg);

    const handleLabAction = (id, action) => {
        if (action === 'Activate') {
            setLabs(labs.map(l => l.id === id ? { ...l, status: 'Active' } : l));
            showToast(`Lab ${id} Activated successfully`);
        } else if (action === 'Suspend') {
            setLabs(labs.map(l => l.id === id ? { ...l, status: 'Suspended' } : l));
            showToast(`Lab ${id} has been suspended`);
        } else if (action === 'Delete') {
            setLabs(labs.filter(l => l.id !== id));
            showToast(`Lab ${id} deleted from system`);
        }
    };

    const handleAddLab = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const newLab = {
            id: `L${Math.floor(Math.random() * 900) + 100}`,
            name: fd.get('labName'),
            location: fd.get('location'),
            admin: fd.get('adminName'),
            status: 'Pending',
            bookings: 0
        };
        setLabs([newLab, ...labs]);
        setModalType(null);
        showToast(`New Lab "${newLab.name}" Registered`);
    };

    // --- Render Sections ---

    const renderOverview = () => (
        <>
            <div className="sad-stats-grid">
                <div className="sad-stat-card">
                    <span className="sad-stat-title">Total Laboratories</span>
                    <p className="sad-stat-value">{labs.length}</p>
                    <div className="sad-stat-trend sad-trend-up">
                        <span>↑ 3 new requests</span>
                    </div>
                </div>
                <div className="sad-stat-card">
                    <span className="sad-stat-title">Total Patients</span>
                    <p className="sad-stat-value">{globalStats.activePatients.toLocaleString()}</p>
                    <div className="sad-stat-trend sad-trend-up">
                        <span>↑ 12% monthly growth</span>
                    </div>
                </div>
                <div className="sad-stat-card">
                    <span className="sad-stat-title">Daily Transactions</span>
                    <p className="sad-stat-value">{globalStats.dailyBookings}</p>
                    <div className="sad-stat-trend sad-trend-neutral">
                        <span>Stable Traffic</span>
                    </div>
                </div>
                <div className="sad-stat-card">
                    <span className="sad-stat-title">Server Uptime</span>
                    <p className="sad-stat-value" style={{ color: '#10b981' }}>{globalStats.systemHealth}</p>
                    <div className="sad-stat-trend sad-trend-up">
                        <span>Optimal Performance</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                {/* Bookings Over Time - Line Chart */}
                <div className="sad-section">
                    <div className="sad-section-header">
                        <h3 className="sad-section-title">Bookings Overview</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bookingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Total Bookings" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lab Performance - Bar Chart */}
                <div className="sad-section">
                    <div className="sad-section-header">
                        <h3 className="sad-section-title">Lab Performance Comparison</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={labPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="tests" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tests Conducted" />
                                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* User Roles - Pie Chart */}
            <div className="sad-section" style={{ marginBottom: '24px' }}>
                <div className="sad-section-header">
                    <h3 className="sad-section-title">User Demographics</h3>
                </div>
                <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={userRolesData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {userRolesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="sad-section">
                    <div className="sad-section-header">
                        <h3 className="sad-section-title">New Lab Registrations</h3>
                        <button className="sad-btn-primary" onClick={() => setActiveTab('labs')} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View All</button>
                    </div>
                    <table className="sad-table">
                        <thead>
                            <tr>
                                <th>Lab Name</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Quick Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labs.slice(0, 3).map(lab => (
                                <tr key={lab.id}>
                                    <td style={{ fontWeight: 600 }}>{lab.name}</td>
                                    <td style={{ color: '#64748b' }}>{lab.location}</td>
                                    <td>
                                        <span className={`sad-status-pill status-${lab.status.toLowerCase()}`}>{lab.status}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="sad-btn-ghost"
                                            style={{ fontSize: '0.85rem', padding: 0 }}
                                            onClick={() => handleLabAction(lab.id, 'Activate')}
                                        >
                                            Review details →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="sad-section">
                    <div className="sad-section-header">
                        <h3 className="sad-section-title">Security Events</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {systemLogs.map(log => (
                            <div key={log.id} className="sad-log-item">
                                <div className="sad-log-icon">{log.type === 'Security' ? '🚨' : log.type === 'System' ? '💾' : '👤'}</div>
                                <div>
                                    <h4 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 600 }}>{log.type}</h4>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{log.message}</p>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    const renderLabs = () => (
        <div className="sad-section">
            <div className="sad-section-header">
                <div>
                    <h3 className="sad-section-title">Laboratory Management</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage all registered diagnostic centers.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="sad-input" placeholder="Search labs..." style={{ width: '200px' }} />
                    <button className="sad-btn-primary" onClick={() => setModalType('addLab')}>+ Register New Lab</button>
                </div>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table className="sad-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ paddingLeft: '24px' }}>ID</th>
                            <th>Laboratory Name</th>
                            <th>Admin Contact</th>
                            <th>Location</th>
                            <th>Total Bookings</th>
                            <th>Status</th>
                            <th style={{ paddingRight: '24px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labs.map(lab => (
                            <tr key={lab.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ fontFamily: 'monospace', color: '#94a3b8', paddingLeft: '24px' }}>{lab.id}</td>
                                <td style={{ fontWeight: 600, color: '#1e293b' }}>{lab.name}</td>
                                <td style={{ color: '#475569' }}>{lab.admin}</td>
                                <td style={{ color: '#475569' }}>{lab.location}</td>
                                <td style={{ fontWeight: 500 }}>{lab.bookings.toLocaleString()}</td>
                                <td><span className={`sad-status-pill status-${lab.status.toLowerCase()}`}>{lab.status}</span></td>
                                <td style={{ paddingRight: '24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="sad-btn-ghost" onClick={() => handleLabAction(lab.id, 'Activate')} title="Approve">✅</button>
                                        <button className="sad-btn-ghost" onClick={() => handleLabAction(lab.id, 'Suspend')} title="Suspend">⛔</button>
                                        <button className="sad-btn-ghost" onClick={() => handleLabAction(lab.id, 'Delete')} title="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="sad-section">
            <div className="sad-section-header">
                <h3 className="sad-section-title">User Directory</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select className="sad-input" style={{ width: '150px' }}>
                        <option>All Roles</option>
                        <option>Super Admin</option>
                        <option>Lab Admin</option>
                    </select>
                    <button className="sad-btn-primary">Add System Admin</button>
                </div>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table className="sad-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ paddingLeft: '24px' }}>User Name</th>
                            <th>Email Address</th>
                            <th>System Role</th>
                            <th>Status</th>
                            <th style={{ paddingRight: '24px' }}>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #bfdbfe' }}>
                                        {u.name.charAt(0)}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{u.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {u.id}</span>
                                    </div>
                                </td>
                                <td style={{ color: '#475569' }}>{u.email}</td>
                                <td>
                                    <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', border: '1px solid #e2e8f0' }}>{u.role}</span>
                                </td>
                                <td><span className={`sad-status-pill status-${u.status.toLowerCase()}`}>{u.status}</span></td>
                                <td style={{ paddingRight: '24px' }}><button className="sad-btn-ghost" style={{ color: '#2563eb', fontWeight: 500 }}>Edit details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="sad-section">
            <div className="sad-section-header">
                <div>
                    <h3 className="sad-section-title">Platform Configuration</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Control global settings and system preferences.</p>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                <div style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>📚</div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>Global Test Catalog</h4>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>Manage the master list of diagnostic tests, codes, and standard pricing available to all laboratories.</p>
                    <button className="sad-btn-outline" style={{ width: '100%', padding: '10px' }}>Manage Catalog</button>
                </div>
                <div style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>🔔</div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>System Notifications</h4>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>Customize automated email and SMS alerts sent to patients and lab admins.</p>
                    <button className="sad-btn-outline" style={{ width: '100%', padding: '10px' }}>Edit Templates</button>
                </div>
                <div style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ width: '48px', height: '48px', background: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '1.5rem' }}>🛡️</div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>Backup & Recovery</h4>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>Last backup created 2 hours ago. Next scheduled in 6 hours. Secure your data.</p>
                    <button className="sad-btn-primary" style={{ width: '100%', background: '#f59e0b', borderColor: '#f59e0b', padding: '10px' }}>Backup Now</button>
                </div>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="sad-section">
            <div className="sad-section-header">
                <div>
                    <h3 className="sad-section-title">My Profile</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage your account settings and preferences.</p>
                </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px', maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>SA</div>
                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{currentUser.name}</h2>
                        <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{currentUser.role}</span>
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Email Address</label>
                    <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569' }}>{currentUser.email}</div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Last Login</label>
                    <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569' }}>{currentUser.lastLogin}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="sad-btn-primary">Update Profile</button>
                    <button className="sad-btn-outline">Change Password</button>
                    <button className="sad-btn-ghost" onClick={handleLogout} style={{ color: '#ef4444' }}>Sign Out</button>
                </div>
            </div>
        </div>
    );



    // ... (rest of the state/hooks)

    return (
        <div className="sad-container">
            {/* Sidebar */}
            <aside className="sad-sidebar">
                <div className="sad-brand">
                    <img src={logoImage} alt="MB" style={{ width: '28px', opacity: 0.9 }} />
                    <span className="sad-brand-text">MediBot <span style={{ fontWeight: 400, opacity: 0.7 }}>Admin</span></span>
                </div>

                <ul className="sad-menu">
                    {['overview', 'labs', 'users', 'settings'].map(tab => (
                        <li key={tab}>
                            <div className={`sad-menu-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                <span className="sad-menu-icon" style={{ textTransform: 'capitalize' }}>
                                    {tab === 'overview' ? '📊' : tab === 'labs' ? '🏥' : tab === 'users' ? '👥' : '⚙️'}
                                </span>
                                <span style={{ textTransform: 'capitalize' }}>{tab}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="sad-sidebar-footer" style={{ marginTop: 'auto', padding: '24px' }}>
                    <button className="sad-logout-btn" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="sad-main">
                <header className="sad-header">
                    <div>
                        <h1 className="sad-title">Super Admin Portal</h1>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div className="sad-header-actions" style={{ position: 'relative' }}>
                        <div
                            className="sad-btn-icon"
                            title="Notifications"
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{ position: 'relative' }}
                        >
                            🔔
                            <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '1px solid white' }}></span>
                        </div>

                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: '60px',
                                width: '320px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                zIndex: 50,
                                overflow: 'hidden'
                            }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Notifications</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer' }}>Mark all read</span>
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notifications.map(n => (
                                        <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '12px', alignItems: 'start', cursor: 'pointer', transition: 'background 0.2s' }} className="hover:bg-gray-50">
                                            <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
                                                {n.type === 'alert' ? '🔴' : n.type === 'success' ? '🟢' : n.type === 'warning' ? '🟠' : '🔵'}
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>{n.message}</p>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{n.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '8px', textAlign: 'center', background: '#f8fafc', fontSize: '0.8rem', color: '#64748b', cursor: 'pointer' }}>
                                    View All Activity
                                </div>
                            </div>
                        )}

                        <div
                            className="sad-btn-icon"
                            title="Settings"
                            onClick={() => setActiveTab('settings')}
                        >
                            ⚙️
                        </div>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px', cursor: 'pointer' }}
                            onClick={() => setActiveTab('profile')}
                            title="View Profile"
                        >
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>SA</div>
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'labs' && renderLabs()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'settings' && renderSettings()}
                    {activeTab === 'profile' && renderProfile()}
                </div>

            </main>

            {/* Modal */}
            {modalType === 'addLab' && (
                <div className="sad-modal-overlay" onClick={() => setModalType(null)}>
                    <div className="sad-modal" onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Register New Lab</h2>
                        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.9rem' }}>Enter the details for the new diagnostic center.</p>

                        <form onSubmit={handleAddLab}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem', color: '#334155' }}>Laboratory Name</label>
                                    <input name="labName" className="sad-input" required placeholder="Ex. City Central Diagnostics" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem', color: '#334155' }}>Admin Contact</label>
                                    <input name="adminName" className="sad-input" required placeholder="Ex. Dr. John Smith" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem', color: '#334155' }}>Location</label>
                                    <input name="location" className="sad-input" required placeholder="Ex. 123 Main St, New York" />
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" className="sad-btn-ghost" onClick={() => setModalType(null)}>Cancel</button>
                                <button type="submit" className="sad-btn-primary">Confirm Registration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '32px', right: '32px',
                    background: '#1e293b', color: 'white', padding: '12px 20px',
                    borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    zIndex: 200, fontSize: '0.9rem', fontWeight: 500
                }}>
                    <span>✅</span> {toast}
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
