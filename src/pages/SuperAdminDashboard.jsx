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
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState(null);

    // Security Check
    useEffect(() => {
        const role = sessionStorage.getItem('auth_role');
        if (role !== 'SUPER_ADMIN') {
            navigate('/admin/login?role=ADMIN');
        }
    }, [navigate]);

    // Profile State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: 'Super Admin',
        email: 'medibot.care@gmail.com',
        role: 'System Administrator',
        phone: '+91 999 555-ADMIN',
        location: 'HQ Bangalore, India',
        lastLogin: new Date().toLocaleString()
    });

    const [tempProfile, setTempProfile] = useState({ ...userProfile });

    // --- Mock Data ---
    const [globalStats] = useState({
        totalLabs: 42,
        activeLabs: 35,
        pendingLabs: 3,
        suspendedLabs: 4,
        totalUsers: 15420,
        totalPatients: 15200,
        totalStaff: 215,
        totalAdmins: 5,
        dailyBookings: 845,
        monthlyRevenue: 125000,
        systemHealth: '99.9%'
    });

    const bookingsData = [
        { name: 'Jan', bookings: 1240, revenue: 24000 },
        { name: 'Feb', bookings: 1580, revenue: 32000 },
        { name: 'Mar', bookings: 2100, revenue: 45000 },
        { name: 'Apr', bookings: 1950, revenue: 39000 },
        { name: 'May', bookings: 2600, revenue: 52000 },
        { name: 'Jun', bookings: 3100, revenue: 64000 },
    ];

    const labPerformanceData = [
        { name: 'Central City', tests: 450, revenue: 12000, rating: 4.8 },
        { name: 'Westside', tests: 320, revenue: 8500, rating: 4.2 },
        { name: 'Metro Health', tests: 580, revenue: 16000, rating: 4.9 },
        { name: 'Summit Path', tests: 210, revenue: 5400, rating: 3.8 },
    ];

    const userRolesData = [
        { name: 'Patients', value: 15200, fill: '#0ea5e9' }, // Sky 500
        { name: 'Lab Staff', value: 215, fill: '#10b981' }, // Green
        { name: 'Admins', value: 5, fill: '#6366f1' },  // Indigo
    ];

    const [labs, setLabs] = useState([
        { id: 'L001', name: 'Central City Lab', location: 'New York, NY', admin: 'Alice Smith', status: 'Active', bookings: 2450, revenue: 45000, documents: ['license.pdf', 'reg_cert.jpg'] },
        { id: 'L002', name: 'Westside Diagnostics', location: 'Los Angeles, CA', admin: 'Bob Jones', status: 'Pending', bookings: 0, revenue: 0, documents: ['application.pdf'] },
        { id: 'L003', name: 'Metro Health Lab', location: 'Chicago, IL', admin: 'Charlie Day', status: 'Active', bookings: 1205, revenue: 22000, documents: ['license_renewal.pdf'] },
        { id: 'L004', name: 'Summit Path Labs', location: 'Denver, CO', admin: 'Dana White', status: 'Suspended', bookings: 340, revenue: 5600, documents: [] }
    ]);

    const [users, setUsers] = useState([
        { id: 'U100', name: 'John Doe', role: 'Lab Admin', lab: 'Central City Lab', email: 'john@cclab.com', status: 'Active', lastLogin: '2 hours ago' },
        { id: 'U101', name: 'Jane Roe', role: 'Super Admin', lab: '-', email: 'jane@medibot.com', status: 'Active', lastLogin: 'Just now' },
        { id: 'U102', name: 'Dr. Emily Blunt', role: 'Lab Staff', lab: 'Metro Health', email: 'emily@metro.com', status: 'Active', lastLogin: 'Yesterday' },
        { id: 'U103', name: 'Mark Twain', role: 'Patient', lab: '-', email: 'mark@gmail.com', status: 'Inactive', lastLogin: '1 week ago' }
    ]);

    const [notifications] = useState([
        { id: 1, message: 'New lab registration request: "City Care Diagnostics"', time: '10 mins ago', type: 'alert' },
        { id: 2, message: 'System backup completed successfully.', time: '2 hours ago', type: 'info' },
        { id: 3, message: 'Monthly financial report generated.', time: '5 hours ago', type: 'success' },
        { id: 4, message: 'Unusual login attempt detected from IP 45.2.1.2', time: 'Yesterday', type: 'warning' }
    ]);

    // System Settings State
    const [platformSettings, setPlatformSettings] = useState({
        platformName: 'MediBot',
        supportEmail: 'support@medibot.com',
        supportPhone: '+1 (555) 123-4567',
        language: 'English (US)',
        timezone: 'UTC-5 (Eastern Time)',
        maintenanceMode: false,
        themeColor: '#0ea5e9' // Sky 500
    });

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

    const handleLogout = () => {
        // Clear tokens logic here
        sessionStorage.removeItem('auth_role');
        navigate('/admin/login');
    };

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
        setModalType(null);
    };

    const handleUserAction = (id, action) => {
        if (action === 'resetPass') {
            showToast(`Password reset link sent to user ${id}`);
        } else if (action === 'logout') {
            showToast(`User ${id} forcefully logged out`);
        } else if (action === 'toggleStatus') {
            setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
            showToast(`User status updated`);
        }
    };

    // Settings & Theme Logic
    const handleSaveSettings = (e) => {
        e.preventDefault();

        // Apply Theme Color dynamically
        document.documentElement.style.setProperty('--sad-primary', platformSettings.themeColor);
        // Calculate a darker shade for hover/active states (simplified)
        document.documentElement.style.setProperty('--sad-primary-dark', platformSettings.themeColor);

        showToast('System configuration & theme saved successfully');
    };

    const handleProfileUpdate = () => {
        setUserProfile(tempProfile);
        setIsEditingProfile(false);
        showToast("Profile Updated Successfully");
    };

    // --- Render Sections ---

    const renderOverview = () => (
        <>
            {/* KPI Cards */}
            <div className="sad-stats-grid">
                <div className="sad-stat-card">
                    <span className="sad-stat-title">Total Laboratories</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <p className="sad-stat-value">{globalStats.totalLabs}</p>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            ({globalStats.activeLabs} Active / <span style={{ color: '#f59e0b' }}>{globalStats.pendingLabs} Pending</span>)
                        </span>
                    </div>
                </div>

                <div className="sad-stat-card">
                    <span className="sad-stat-title">Total Revenue</span>
                    <p className="sad-stat-value" style={{ color: '#10b981' }}>${globalStats.monthlyRevenue.toLocaleString()}</p>
                    <div className="sad-stat-trend sad-trend-up">
                        <span>↑ 8% vs last month</span>
                    </div>
                </div>

                <div className="sad-stat-card">
                    <span className="sad-stat-title">Total Users</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <p className="sad-stat-value">{globalStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="sad-stat-trend sad-trend-up">
                        <span>{globalStats.totalPatients.toLocaleString()} Patients</span>
                    </div>
                </div>

                <div className="sad-stat-card">
                    <span className="sad-stat-title">System Health</span>
                    <p className="sad-stat-value" style={{ color: '#0ea5e9' }}>{globalStats.systemHealth}</p>
                    <div className="sad-stat-trend sad-trend-neutral">
                        <span>All systems operational</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="sad-section" style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, marginRight: '12px', color: '#0c4a6e' }}>Quick Actions:</span>
                <button className="sad-btn-primary" onClick={() => { setActiveTab('labs'); setModalType(null); }}>Review Pending Labs ({globalStats.pendingLabs})</button>
                <button className="sad-btn-outline" onClick={() => setActiveTab('users')}>Manage Users</button>
                <button className="sad-btn-outline" onClick={() => showToast('System audit initiated')}>Run System Audit</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Bookings & Revenue Chart */}
                <div className="sad-section">
                    <div className="sad-section-header">
                        <h3 className="sad-section-title">Platform Growth & Revenue</h3>
                    </div>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bookingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Bookings" />
                                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue ($)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Distribution */}
                <div className="sad-section">
                    <div className="sad-section-header">
                        <h3 className="sad-section-title">User Roles</h3>
                    </div>
                    <div style={{ width: '100%', height: 320, display: 'flex', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userRolesData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {userRolesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pending Approvals Table Preview */}
            <div className="sad-section">
                <div className="sad-section-header">
                    <h3 className="sad-section-title">Pending Lab Approvals</h3>
                </div>
                <table className="sad-table">
                    <thead>
                        <tr>
                            <th>Lab Name</th>
                            <th>Location</th>
                            <th>Submitted By</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labs.filter(l => l.status === 'Pending').length > 0 ? (
                            labs.filter(l => l.status === 'Pending').map(lab => (
                                <tr key={lab.id}>
                                    <td style={{ fontWeight: 600 }}>{lab.name}</td>
                                    <td style={{ color: '#64748b' }}>{lab.location}</td>
                                    <td style={{ color: '#64748b' }}>{lab.admin}</td>
                                    <td><span className="sad-status-pill status-pending">Pending</span></td>
                                    <td>
                                        <button
                                            className="sad-btn-primary"
                                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                            onClick={() => { setSelectedItem(lab); setModalType('viewDocs'); }}
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No pending approvals</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderLabs = () => (
        <div className="sad-section">
            <div className="sad-section-header">
                <div>
                    <h3 className="sad-section-title">Laboratory Management</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Monitor performance, approve requests, and manage lab accounts.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input className="sad-input" placeholder="Search labs..." style={{ width: '240px' }} />
                    <button className="sad-btn-primary" onClick={() => setModalType('addLab')}>+ Register New Lab</button>
                </div>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table className="sad-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ paddingLeft: '24px' }}>Lab Details</th>
                            <th>Admin / Contact</th>
                            <th>Performance</th>
                            <th>Revenue</th>
                            <th>Status</th>
                            <th style={{ paddingRight: '24px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labs.map(lab => (
                            <tr key={lab.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ paddingLeft: '24px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{lab.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{lab.location}</div>
                                </td>
                                <td>
                                    <div style={{ color: '#334155', fontWeight: 500 }}>{lab.admin}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#0ea5e9', cursor: 'pointer' }}>Change Admin</div>
                                </td>
                                <td>
                                    <div style={{ fontSize: '0.9rem' }}>{lab.bookings.toLocaleString()} Bookings</div>
                                    <div style={{ fontSize: '0.9rem', color: '#f59e0b' }}>⭐ 4.8 Rating</div>
                                </td>
                                <td style={{ fontWeight: 600, color: '#10b981' }}>${lab.revenue.toLocaleString()}</td>
                                <td><span className={`sad-status-pill status-${lab.status.toLowerCase()}`}>{lab.status}</span></td>
                                <td style={{ paddingRight: '24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="sad-btn-outline" style={{ padding: '6px 10px' }} onClick={() => { setSelectedItem(lab); setModalType('viewDocs'); }}>Docs</button>
                                        <button className="sad-btn-outline" style={{ padding: '6px 10px' }}>Edit</button>
                                        <button className="sad-btn-ghost" onClick={() => handleLabAction(lab.id, lab.status === 'Active' ? 'Suspend' : 'Activate')} title={lab.status === 'Active' ? 'Suspend' : 'Activate'}>
                                            {lab.status === 'Active' ? '⛔' : '✅'}
                                        </button>
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
                <div>
                    <h3 className="sad-section-title">User & Role Management</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage access for super admins, lab admins, staff, and patients.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select className="sad-input" style={{ width: '150px' }}>
                        <option>All Roles</option>
                        <option>Super Admin</option>
                        <option>Lab Admin</option>
                        <option>Patient</option>
                    </select>
                    <input className="sad-input" placeholder="Search users by detail..." style={{ width: '220px' }} />
                </div>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table className="sad-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ paddingLeft: '24px' }}>User</th>
                            <th>Role & Affiliation</th>
                            <th>Last Login</th>
                            <th>Status</th>
                            <th style={{ paddingRight: '24px' }}>Security Controls</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ paddingLeft: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', border: '1px solid #e2e8f0', marginRight: '6px' }}>{u.role}</span>
                                    {u.lab !== '-' && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{u.lab}</div>}
                                </td>
                                <td style={{ color: '#64748b', fontSize: '0.9rem' }}>{u.lastLogin}</td>
                                <td>
                                    <span className={`sad-status-pill status-${u.status.toLowerCase()}`}>{u.status}</span>
                                </td>
                                <td style={{ paddingRight: '24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="sad-btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleUserAction(u.id, 'resetPass')}>Reset Password</button>
                                        <button className="sad-btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => handleUserAction(u.id, 'logout')}>Log Out</button>
                                        <button className="sad-btn-ghost" onClick={() => handleUserAction(u.id, 'toggleStatus')} title={u.status === 'Active' ? 'Deactivate' : 'Activate'}>
                                            {u.status === 'Active' ? '⏸️' : '▶️'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="sad-section-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h3 className="sad-section-title">System Configuration</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage platform-wide settings and preferences.</p>
                </div>
                <button className="sad-btn-primary" onClick={handleSaveSettings}>Save Changes</button>
            </div>

            <form onSubmit={handleSaveSettings}>
                {/* Branding Section */}
                <div className="sad-section">
                    <h4 style={{ margin: '0 0 24px', fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Platform Branding</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Platform Name</label>
                            <input
                                className="sad-input"
                                value={platformSettings.platformName}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Logo URL</label>
                            <input className="sad-input" placeholder="https://..." />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Primary Color Theme</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {[
                                    { color: '#0ea5e9', name: 'Sky Blue' },
                                    { color: '#10b981', name: 'Emerald' },
                                    { color: '#f59e0b', name: 'Amber' },
                                    { color: '#7c3aed', name: 'Violet' }
                                ].map(theme => (
                                    <div
                                        key={theme.color}
                                        style={{
                                            width: '32px', height: '32px',
                                            background: theme.color,
                                            borderRadius: '50%', cursor: 'pointer',
                                            border: platformSettings.themeColor === theme.color ? '3px solid #0f172a' : '2px solid transparent',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                        onClick={() => setPlatformSettings({ ...platformSettings, themeColor: theme.color })}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="sad-section">
                    <h4 style={{ margin: '0 0 24px', fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Regional & Language</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Default Language</label>
                            <select
                                className="sad-input"
                                value={platformSettings.language}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, language: e.target.value })}
                            >
                                <option>English (US)</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Default Timezone</label>
                            <select
                                className="sad-input"
                                value={platformSettings.timezone}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })}
                            >
                                <option>UTC-5 (Eastern Time)</option>
                                <option>UTC+0 (GMT)</option>
                                <option>UTC+1 (CET)</option>
                                <option>UTC+5:30 (IST)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Support Contact */}
                <div className="sad-section">
                    <h4 style={{ margin: '0 0 24px', fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Support & Contact Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Support Email</label>
                            <input
                                className="sad-input"
                                type="email"
                                value={platformSettings.supportEmail}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Support Phone</label>
                            <input
                                className="sad-input"
                                type="tel"
                                value={platformSettings.supportPhone}
                                onChange={(e) => setPlatformSettings({ ...platformSettings, supportPhone: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

    const renderProfile = () => (
        <div className="sad-section">
            <div className="sad-section-header">
                <div>
                    <h3 className="sad-section-title">My Profile</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage your account settings and preferences.</p>
                </div>
                {!isEditingProfile && (
                    <button className="sad-btn-primary" onClick={() => { setTempProfile(userProfile); setIsEditingProfile(true); }}>Edit Profile</button>
                )}
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px', maxWidth: '800px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: '80px', height: '80px', background: '#0ea5e9', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
                        {userProfile.name.charAt(0)}
                    </div>
                    <div>
                        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{userProfile.name}</h2>
                        <span style={{ background: '#e0f2fe', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: '#0284c7' }}>{userProfile.role}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Full Name</label>
                        <input
                            className="sad-input"
                            disabled={!isEditingProfile}
                            value={isEditingProfile ? tempProfile.name : userProfile.name}
                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Email Address</label>
                        <input
                            className="sad-input"
                            disabled={!isEditingProfile}
                            value={isEditingProfile ? tempProfile.email : userProfile.email}
                            onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Phone Number</label>
                        <input
                            className="sad-input"
                            disabled={!isEditingProfile}
                            value={isEditingProfile ? tempProfile.phone : userProfile.phone}
                            onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#334155' }}>Location / HQ</label>
                        <input
                            className="sad-input"
                            disabled={!isEditingProfile}
                            value={isEditingProfile ? tempProfile.location : userProfile.location}
                            onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                        />
                    </div>
                </div>

                {isEditingProfile ? (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button className="sad-btn-ghost" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                        <button className="sad-btn-primary" onClick={handleProfileUpdate}>Save Changes</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                        <button className="sad-btn-outline" onClick={() => showToast("Password Reset Email Sent")}>Change Password</button>
                        <button className="sad-btn-ghost" onClick={handleLogout} style={{ color: '#ef4444' }}>Sign Out</button>
                    </div>
                )}
            </div>
        </div>
    );

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
                            style={{ position: 'relative' }}
                        >
                            🔔
                            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '1px solid white' }}></span>
                        </div>
                        <div
                            className="sad-btn-icon"
                            title="View Profile"
                            onClick={() => setActiveTab('profile')}
                        >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                                {userProfile.name.charAt(0)}
                            </div>
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

            {/* Modals */}
            {modalType === 'addLab' && (
                <div className="sad-modal-overlay" onClick={() => setModalType(null)}>
                    <div className="sad-modal" onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>Register New Lab</h2>
                        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.9rem' }}>Enter the details for the new diagnostic center.</p>
                        {/* Placeholder Form */}
                        <form>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input className="sad-input" placeholder="Lab Name" />
                                <input className="sad-input" placeholder="Admin Contact" />
                                <input className="sad-input" placeholder="Location" />
                            </div>
                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" className="sad-btn-ghost" onClick={() => setModalType(null)}>Cancel</button>
                                <button type="button" className="sad-btn-primary" onClick={() => { setModalType(null); showToast("Lab Registered"); }}>Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalType === 'viewDocs' && selectedItem && (
                <div className="sad-modal-overlay" onClick={() => setModalType(null)}>
                    <div className="sad-modal" onClick={e => e.stopPropagation()} style={{ width: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Lab Documents</h2>
                            <button className="sad-btn-ghost" onClick={() => setModalType(null)}>✕</button>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h4 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{selectedItem.name}</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Submitted by: {selectedItem.admin}</p>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h5 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#475569', textTransform: 'uppercase' }}>Attached Files</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedItem.documents && selectedItem.documents.length > 0 ? selectedItem.documents.map((doc, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '1.5rem' }}>📄</span>
                                            <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{doc}</span>
                                        </div>
                                        <button className="sad-btn-ghost" style={{ fontSize: '0.85rem', color: '#0ea5e9' }}>Download</button>
                                    </li>
                                )) : <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No documents uploaded.</p>}
                            </ul>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            {selectedItem.status === 'Pending' && (
                                <>
                                    <button className="sad-btn-outline" style={{ color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => setModalType(null)}>Reject</button>
                                    <button className="sad-btn-primary" onClick={() => handleLabAction(selectedItem.id, 'Activate')}>Approve Lab</button>
                                </>
                            )}
                            {selectedItem.status !== 'Pending' && (
                                <button className="sad-btn-primary" onClick={() => setModalType(null)}>Close</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '32px', right: '32px',
                    background: '#0f172a', color: 'white', padding: '12px 20px',
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
