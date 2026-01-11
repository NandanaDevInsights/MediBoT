import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabAdminDashboard.css';
import logoImage from '../assets/Logo.png';
import moleculeBg from '../assets/medibot_3d_molecules.png';

// --- Icons (SVGs) for Professional Look ---
const Icons = {
    Dashboard: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
    Calendar: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
    ),
    TestTube: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01v0a2.83 2.83 0 0 1 0-4L17 3" /><path d="m16 2 6 6" /><path d="M12 16H4" /></svg>
    ),
    Users: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    FileText: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
    ),
    Stethoscope: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 0 1 5 2h14a.3.3 0 0 1 .2.3v3.4a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V2" /><path d="M12 2v5a7 7 0 0 1-14 0V5a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V2" /><path d="M12 7v4a5 5 0 0 0 5 5h0a5 5 0 0 0 5-5V7" /><circle cx="12" cy="20" r="2" /></svg>
    ),
    CreditCard: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
    ),
    Settings: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
    Bell: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
    ),
    Search: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    Flask: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31" /><path d="M14 2v7.31" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>
    ),
    UploadCloud: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>
    ),
    Download: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
    ),
    Eye: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
    X: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    ),
    Home: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
    )
};

const LabAdminDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Landing');
    const [notification, setNotification] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Patient & Report State
    const [patients, setPatients] = useState([]);

    const [loadingPatients, setLoadingPatients] = useState(false);


    // --- Dynamic Data State ---
    const [stats, setStats] = useState({
        appointmentsToday: 0,
        pendingOrders: 0,
        reportsGenerated: 0,
        revenue: '$0',
        activeStaff: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [testOrders, setTestOrders] = useState([]);
    const [staff, setStaff] = useState([]);
    const [reports, setReports] = useState([]);

    // --- Forms State ---
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [newStaff, setNewStaff] = useState({ name: '', role: '', qualification: '' });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({ patient_id: '', test_name: '', file: null });
    const [profileData, setProfileData] = useState({ lab_name: '', address: '', contact: '', admin_name: '', email: '' });

    // --- UI State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
    const [patientHistory, setPatientHistory] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // --- Stats Fetcher ---
    useEffect(() => {
        let interval;
        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('http://localhost:5000/api/admin/stats', { credentials: 'include' });
                if (statsRes.status === 401 || statsRes.status === 403) {
                    navigate('/admin/login');
                    return;
                }
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(prev => ({ ...prev, ...data }));
                }

                // Fetch Recent Appointments (for overview)
                const appsRes = await fetch('http://localhost:5000/api/admin/appointments', { credentials: 'include' });
                if (appsRes.ok) {
                    const data = await appsRes.json();
                    if (Array.isArray(data)) {
                        setAppointments(data);
                    }
                }
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            }
        };

        if (activeSection === 'Overview') {
            fetchData();
            interval = setInterval(fetchData, 30000);
        }
        return () => clearInterval(interval);
    }, [activeSection, navigate]);

    // --- Section Fetchers ---
    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                let url = '';
                if (activeSection === 'Appointments') url = 'http://localhost:5000/api/admin/appointments';
                if (activeSection === 'Test Orders') url = 'http://localhost:5000/api/admin/test-orders';
                if (activeSection === 'Lab Staff') url = 'http://localhost:5000/api/admin/staff';
                if (activeSection === 'Reports') url = 'http://localhost:5000/api/admin/reports';
                if (activeSection === 'Settings' || activeSection === 'Profile') url = 'http://localhost:5000/api/admin/profile';

                if (!url && activeSection !== 'Patients') return; // Patients has its own logic below

                if (url) {
                    const res = await fetch(url, { credentials: 'include' });
                    if (res.status === 401 || res.status === 403) {
                        navigate('/admin/login');
                        return;
                    }
                    if (!res.ok) throw new Error('Fetch failed');

                    const data = await res.json();

                    if (activeSection === 'Appointments' && Array.isArray(data)) setAppointments(data);
                    if (activeSection === 'Test Orders' && Array.isArray(data)) setTestOrders(data);
                    if (activeSection === 'Lab Staff' && Array.isArray(data)) setStaff(data);
                    if (activeSection === 'Reports' && Array.isArray(data)) setReports(data);
                    if (activeSection === 'Settings' || activeSection === 'Profile') {
                        if (data.email) {
                            setProfileData({
                                lab_name: data.lab_name || '',
                                address: data.address || '',
                                contact: data.contact || '',
                                admin_name: data.admin_name || '',
                                email: data.email || ''
                            });
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                if (activeSection !== 'Settings') showToast(`Failed to load ${activeSection}`, "error");
            }
        };

        // Patients Logic (kept separate or merged? existing logic was complex with loading state)
        if (activeSection === 'Patients') {
            setLoadingPatients(true);
            fetch('http://localhost:5000/api/admin/patients', { credentials: 'include' })
                .then(res => {
                    if (res.status === 401 || res.status === 403) {
                        throw new Error("Unauthorized");
                    }
                    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) setPatients(data);
                    setLoadingPatients(false);
                })
                .catch(err => {
                    setLoadingPatients(false);
                    if (err.message === "Unauthorized") {
                        navigate('/admin/login');
                    } else {
                        showToast("Failed to load patients", "error");
                    }
                });
        } else {
            fetchSectionData();
        }

    }, [activeSection, navigate]);

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleLogout = () => {
        fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' })
            .then(() => navigate('/login'))
            .catch(() => navigate('/login'));
    };

    // --- Actions ---
    const handleUpdateAppointment = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Pending' ? 'Sample Collected' : 'Completed';
        try {
            const res = await fetch(`http://localhost:5000/api/admin/appointments/${id.replace('A-', '')}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });
            if (res.ok) {
                setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
                showToast("Status Updated");
            }
        } catch (e) { showToast("Update Failed", "error"); }
    };

    const handleAddStaff = async () => {
        if (!newStaff.name) return;
        try {
            const res = await fetch('http://localhost:5000/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaff),
                credentials: 'include'
            });
            if (res.ok) {
                showToast("Staff Member Added");
                setShowAddStaffModal(false);
                setNewStaff({ name: '', role: '', qualification: '' });
                // Refresh
                fetch('http://localhost:5000/api/admin/staff', { credentials: 'include' })
                    .then(r => r.json()).then(setStaff);
            }
        } catch (e) { showToast("Failed to add staff", "error"); }
    };

    const handleSaveProfile = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
                credentials: 'include'
            });
            if (res.ok) showToast("Profile Saved Successfully");
        } catch (e) { showToast("Save failed", "error"); }
    };

    const handleUploadReport = async () => {
        if (!uploadData.file || !uploadData.patient_id) {
            showToast("Missing file or patient ID", "error");
            return;
        }
        const formData = new FormData();
        formData.append('patient_id', uploadData.patient_id);
        formData.append('test_name', uploadData.test_name);
        formData.append('file', uploadData.file);

        try {
            const res = await fetch('http://localhost:5000/api/admin/upload-report', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            if (res.ok) {
                showToast("Report Uploaded");
                setShowUploadModal(false);
                setUploadData({ patient_id: '', test_name: '', file: null });
                // Refresh
                fetch('http://localhost:5000/api/admin/reports', { credentials: 'include' }).then(r => r.json()).then(setReports);
            } else {
                showToast("Upload Failed", "error");
            }
        } catch (e) { showToast("Error uploading", "error"); }
    };

    const handleViewHistory = async (patient) => {
        setSelectedPatient(patient);
        setPatientHistory(null); // Clear previous
        setShowPatientHistoryModal(true);

        try {
            const res = await fetch(`http://localhost:5000/api/admin/patients/${patient.id}/history`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setPatientHistory(data);
            } else {
                showToast("Failed to load history", "error");
            }
        } catch (e) {
            console.error(e);
            showToast("Error loading history", "error");
        }
    };

    // --- Render Helpers ---

    const renderSidebar = () => {
        const menuItems = [
            { name: 'Overview', icon: <Icons.Dashboard />, section: 'Overview' },
            { name: 'Appointments', icon: <Icons.Calendar />, section: 'Appointments' },
            { name: 'Patients', icon: <Icons.Users />, section: 'Patients' },
            { name: 'Reports', icon: <Icons.FileText />, section: 'Reports' },
            { name: 'Test Orders', icon: <Icons.TestTube />, section: 'Test Orders' },
            { name: 'Lab Staff', icon: <Icons.Stethoscope />, section: 'Lab Staff' },
            { name: 'Payments', icon: <Icons.CreditCard />, section: 'Payments' },
            { name: 'Settings', icon: <Icons.Settings />, section: 'Settings' },
        ];

        return (
            <aside className={`med-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {/* Sidebar Header with Toggle & Logo */}
                <div className="med-sidebar-header" style={{ justifyContent: 'space-between', paddingRight: '16px' }}>
                    <div className="med-brand-block" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={logoImage} alt="MediBot" className="med-sidebar-logo" />
                        <span className="med-logo-text">MediBot</span>
                    </div>
                    <button className="med-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--med-text-muted)' }}>
                        <Icons.Menu />
                    </button>
                </div>

                <ul className="med-nav-menu">
                    {menuItems.map(item => (
                        <li
                            key={item.name}
                            className={`med-nav-item ${activeSection === item.section ? 'active' : ''}`}
                            onClick={() => {
                                setActiveSection(item.section);
                            }}
                        >
                            <span className="med-nav-icon">{item.icon}</span>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </aside>
        );

    };

    const renderHeader = () => (
        <header className="med-top-header">
            {/* Left Side: Toggle, Logo (Only visible if sidebar is closed) */}
            <div className="med-header-left">
                {!isSidebarOpen && (
                    <>
                        <button className="med-menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Icons.Menu />
                        </button>

                        <div className="med-brand-block">
                            <img src={logoImage} alt="MediBot" className="med-logo-img" />
                            <span className="med-brand-text">MediBot</span>
                        </div>
                    </>
                )}

                <div className="med-divider-v" style={{ margin: '0 16px', height: '24px' }}></div>

                <button
                    className={`med-icon-btn ${activeSection === 'Landing' ? 'active' : ''}`}
                    onClick={() => setActiveSection('Landing')}
                    style={{ marginRight: '16px', color: activeSection === 'Landing' ? 'var(--med-primary)' : 'inherit' }}
                    title="Home"
                >
                    <Icons.Home />
                </button>

                <h2 className="med-page-title">{activeSection === 'Landing' ? '' : activeSection}</h2>
            </div>

            {/* Center: Search */}
            <div className="med-header-center">
                <div className="med-header-search-container">
                    <div className="med-header-search-icon">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="med-header-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Right Side: Actions & Profile */}
            <div className="med-header-actions">
                <div className="med-date-display" title="Current Time">
                    <Icons.Calendar />
                    <span>
                        {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        <span style={{ margin: '0 6px', opacity: 0.5 }}>|</span>
                        {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="med-divider-v"></div>

                <div style={{ position: 'relative' }}>
                    <button
                        className={`med-icon-btn ${showNotifications ? 'active' : ''}`}
                        title="Notifications"
                        onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                    >
                        <Icons.Bell />
                        <span className="med-badge"></span>
                    </button>
                    {showNotifications && (
                        <div className="med-dropdown-menu notifications">
                            <div className="med-dropdown-header">Notifications</div>
                            <div className="med-dropdown-item unread">
                                <small>New Appointment</small>
                                <span>Sarah J. booked a blood test.</span>
                            </div>
                            <div className="med-dropdown-item">
                                <small>System</small>
                                <span>Report upload completed.</span>
                            </div>
                            <div className="med-dropdown-item">
                                <small>Reminder</small>
                                <span>Team meeting at 3 PM.</span>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <div
                        className={`med-profile-trigger ${showProfileMenu ? 'active' : ''}`}
                        onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                    >
                        <div className="med-avatar-circle">
                            {profileData.admin_name ? profileData.admin_name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <span className="med-profile-arrow">▼</span>
                    </div>

                    {showProfileMenu && (
                        <div className="med-dropdown-menu profile">
                            <div className="med-dropdown-user">
                                <div className="med-avatar-circle large">
                                    {profileData.admin_name ? profileData.admin_name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="info">
                                    <span className="name">{profileData.admin_name || 'Admin User'}</span>
                                    <span className="role">Lab Manager</span>
                                </div>
                            </div>
                            <div className="med-dropdown-divider"></div>
                            <button className="med-dropdown-item" onClick={() => { setActiveSection('Profile'); setShowProfileMenu(false); }}>
                                <Icons.Settings /> Edit Profile
                            </button>
                            <button className="med-dropdown-item text-red" onClick={handleLogout}>
                                <Icons.X /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );

    // --- Section Content Renderers ---

    const renderOverview = () => (
        <>
            <div className="med-stats-grid">
                <div className="med-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper blue"><Icons.Calendar /></div>
                        <span className="med-stat-trend up">+8%</span>
                    </div>
                    <h3 className="med-stat-value">{stats.appointmentsToday}</h3>
                    <p className="med-stat-label">Appointments Today</p>
                </div>
                <div className="med-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper orange"><Icons.TestTube /></div>
                        <span className="med-stat-trend neutral">0%</span>
                    </div>
                    <h3 className="med-stat-value">{stats.pendingOrders}</h3>
                    <p className="med-stat-label">Pending Orders</p>
                </div>
                <div className="med-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper green"><Icons.FileText /></div>
                        <span className="med-stat-trend up">+12%</span>
                    </div>
                    <h3 className="med-stat-value">{stats.reportsGenerated}</h3>
                    <p className="med-stat-label">Reports Generated</p>
                </div>
                <div className="med-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper purple"><Icons.Users /></div>
                    </div>
                    <h3 className="med-stat-value">{stats.activeStaff}</h3>
                    <p className="med-stat-label">Active Staff</p>
                </div>
            </div>

            <div className="med-table-card">
                <div className="med-table-header">
                    <h3 className="med-table-title">Recent Activity</h3>
                    <button className="med-link-btn" onClick={() => setActiveSection('Appointments')}>See All</button>
                </div>
                <div className="med-table-wrapper">
                    <table className="med-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Test Type</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments
                                .filter(a =>
                                    a.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    a.test.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .slice(0, 3).map(appt => (
                                    <tr key={appt.id}>
                                        <td style={{ fontWeight: 500, color: '#334155' }}>{appt.patient}</td>
                                        <td>{appt.test}</td>
                                        <td>{appt.time}</td>
                                        <td>
                                            <span className={`med-status ${appt.status === 'Completed' ? 'status-success' :
                                                appt.status === 'Sample Collected' ? 'status-info' : 'status-warning'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="med-action-btn">Detail</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    const renderAppointments = () => (
        <div className="med-card no-pad">
            <div className="med-table-header">
                <h3 className="med-table-title">Appointments</h3>
                <div className="med-header-tools">
                    <button className="med-btn med-btn-primary">New Booking</button>
                </div>
            </div>
            <table className="med-table">
                <thead>
                    <tr>
                        <th style={{ width: '80px' }}>ID</th>
                        <th>Patient Name</th>
                        <th>Test Type</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments
                        .filter(a =>
                            a.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            a.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            a.id.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(appt => (
                            <tr key={appt.id}>
                                <td className="mono-text">{appt.id}</td>
                                <td style={{ fontWeight: 600, color: '#334155' }}>{appt.patient}</td>
                                <td>{appt.test}</td>
                                <td>{appt.date}, {appt.time}</td>
                                <td>
                                    <span className={`med-status ${appt.status === 'Completed' ? 'status-success' :
                                        appt.status === 'Sample Collected' ? 'status-info' :
                                            appt.status === 'Pending' ? 'status-warning' : 'status-neutral'
                                        }`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="med-action-btn" onClick={() => showToast('Details Opened')}>View</button>
                                    <button className="med-action-btn" onClick={() => handleUpdateAppointment(appt.id, appt.status)}>Update</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );

    const renderTestOrders = () => (
        <div className="med-card no-pad">
            <div className="med-table-header">
                <h3 className="med-table-title">Test Orders</h3>
            </div>
            <table className="med-table">
                <thead>
                    <tr>
                        <th style={{ width: '100px' }}>Order ID</th>
                        <th>Patient</th>
                        <th>Tests</th>
                        <th>Sample</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {testOrders
                        .filter(t =>
                            t.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.tests.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(order => (
                            <tr key={order.id}>
                                <td className="mono-text">{order.id}</td>
                                <td style={{ fontWeight: 600 }}>{order.patient}</td>
                                <td>{order.tests.join(', ')}</td>
                                <td>{order.sample}</td>
                                <td>
                                    <span className={`med-status ${['Completed', 'Reviewed'].includes(order.status) ? 'status-success' :
                                        order.status === 'Processing' ? 'status-info' : 'status-warning'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="med-action-btn" onClick={() => {
                                        setUploadData({ patient_id: order.patientId, test_name: (order.tests && order.tests[0]) || '', file: null });
                                        setShowUploadModal(true);
                                    }}>Process</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );

    const renderPatients = () => (
        <div className="med-card no-pad">
            <div className="med-table-header">
                <h3 className="med-table-title">Patient Records</h3>
                <button className="med-btn med-btn-primary" onClick={() => {
                    // Quick refresh
                    setActiveSection('Overview');
                    setTimeout(() => setActiveSection('Patients'), 50);
                }}>Refresh List</button>
            </div>

            {loadingPatients ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div className="spinner" style={{ marginBottom: '1rem' }}></div> {/* Assuming spinner class exists or just text */}
                    <p>Loading patient contents...</p>
                </div>
            ) : patients.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#f8fafc' }}>
                    <Icons.Users />
                    <p style={{ marginTop: '1rem', fontWeight: 500 }}>No patients registered yet.</p>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>New signups will appear here.</p>
                </div>
            ) : (
                <table className="med-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th>Name & Email</th>
                            <th>Contact</th>
                            <th>Uploaded Data</th>
                            <th>History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients
                            .filter(p =>
                                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.email.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(p => (
                                <tr key={p.id}>
                                    <td className="mono-text">{p.id}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{p.email}</div>
                                    </td>
                                    <td>
                                        {p.phone !== 'N/A' ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {p.phone}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not provided</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span className="med-badge" style={{ background: '#eff6ff', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                                {p.uploaded_data_count || 0} Reports
                                            </span>
                                            {p.latest_prescription_url && (
                                                <a
                                                    href={p.latest_prescription_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="View Latest Prescription"
                                                    style={{
                                                        display: 'block', width: '40px', height: '40px',
                                                        borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1',
                                                        cursor: 'pointer', transition: 'transform 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    <img
                                                        src={p.latest_prescription_url}
                                                        alt="Rx"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="med-link-btn" onClick={() => handleViewHistory(p)}>View History</button>
                                        <button className="med-link-btn" style={{ marginLeft: '10px', color: 'var(--primary)' }} onClick={() => {
                                            setUploadData(d => ({ ...d, patient_id: p.id }));
                                            setShowUploadModal(true);
                                        }}>Upload Report</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );


    const renderReports = () => (
        <div className="med-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                <h3 className="med-table-title">Reports Management</h3>
                <button className="med-btn med-btn-primary" onClick={() => showToast('Upload Dialog Opened')}>
                    Upload Report
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {reports
                    .filter(r =>
                        r.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.test.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((report) => (
                        <div key={report.id} className="med-report-card">
                            <div className="med-report-icon">
                                <Icons.FileText />
                            </div>
                            <div className="med-report-info">
                                <h4>{report.test}</h4>
                                <p>{report.patient}</p>
                                <span className="med-report-date">{report.date}</span>
                            </div>
                            <div className="med-report-actions">
                                <span className={`med-status-dot ${report.status === 'Uploaded' ? 'success' : 'pending'}`}></span>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    const renderStaff = () => (
        <>
            <div className="med-card no-pad">
                <div className="med-table-header">
                    <h3 className="med-table-title">Lab Staff</h3>
                    <button className="med-btn med-btn-primary" onClick={() => setShowAddStaffModal(true)}>Add Member</button>
                </div>
                <table className="med-table">
                    <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
                    <tbody>
                        {staff
                            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    <td>{s.role}</td>
                                    <td><span className={`med-status status-${s.status === 'Available' ? 'success' : 'neutral'}`}>{s.status}</span></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {/* Simple Add Staff Modal Overlay */}
            {showAddStaffModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px' }}>
                        <h3>Add Staff</h3>
                        <input type="text" placeholder="Name" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
                        <input type="text" placeholder="Role" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setShowAddStaffModal(false)}>Cancel</button>
                            <button className="med-btn med-btn-primary" onClick={handleAddStaff}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    const renderSettings = () => (
        <div className="med-empty-state">
            {/* Empty as requested */}
        </div>
    );

    const renderProfile = () => (
        <div className="med-form-grid">
            {/* Lab Admin Profile */}
            <div className="med-section-card">
                <h3 className="med-table-title" style={{ marginBottom: '20px' }}>Lab Admin Profile</h3>
                <div className="med-form-group">
                    <label>Admin Name</label>
                    <input type="text" value={profileData.admin_name} onChange={e => setProfileData({ ...profileData, admin_name: e.target.value })} placeholder="Enter Admin Name" />
                </div>
                <div className="med-form-group">
                    <label>Email</label>
                    <input type="email" value={profileData.email} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} />
                </div>
            </div>

            {/* Lab Profile */}
            <div className="med-section-card">
                <h3 className="med-table-title" style={{ marginBottom: '20px' }}>Lab Profile</h3>
                <div className="med-form-group">
                    <label>Lab Name</label>
                    <input type="text" value={profileData.lab_name} onChange={e => setProfileData({ ...profileData, lab_name: e.target.value })} />
                </div>
                <div className="med-form-group">
                    <label>Address</label>
                    <input type="text" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} />
                </div>
                <div className="med-form-group">
                    <label>Contact Number</label>
                    <input type="text" value={profileData.contact} onChange={e => setProfileData({ ...profileData, contact: e.target.value })} />
                </div>
                <div className="med-form-actions">
                    <button className="med-btn med-btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                </div>
            </div>

            <div className="med-section-card">
                <h3 className="med-table-title">System</h3>
                <button className="med-btn med-btn-danger" onClick={handleLogout}>Sign Out</button>
            </div>
        </div>
    );

    const renderPatientHistoryModal = () => {
        if (!showPatientHistoryModal || !selectedPatient) return null;

        return (
            <div className="med-modal-overlay">
                <div className="med-modal-content large">
                    <div className="med-modal-header">
                        <h3>Patient History: {selectedPatient.name}</h3>
                        <button className="med-icon-btn" onClick={() => setShowPatientHistoryModal(false)}><Icons.X /></button>
                    </div>

                    {!patientHistory ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Loading history...</div>
                    ) : (
                        <div className="med-modal-body">
                            {/* Personal Details */}
                            <div className="med-section-card" style={{ marginBottom: '20px' }}>
                                <h4 style={{ marginBottom: '15px', color: 'var(--med-primary)' }}>Personal Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Email</label>
                                        <div style={{ fontWeight: 500 }}>{patientHistory.details.email}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Phone</label>
                                        <div style={{ fontWeight: 500 }}>{patientHistory.details.phone || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Patient ID</label>
                                        <div style={{ fontWeight: 500 }}>#{patientHistory.details.id}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Prescriptions (WhatsApp Images) */}
                            <div className="med-section-card" style={{ marginBottom: '20px' }}>
                                <h4 style={{ marginBottom: '15px', color: 'var(--med-primary)' }}>Prescriptions & Uploads</h4>
                                {patientHistory.prescriptions.length === 0 ? (
                                    <p style={{ color: '#94a3b8' }}>No uploaded prescriptions.</p>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                                        {patientHistory.prescriptions.map(rx => (
                                            <div key={rx.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                                <a href={rx.image_url} target="_blank" rel="noopener noreferrer">
                                                    <img src={rx.image_url} alt="Rx" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                                </a>
                                                <div style={{ padding: '8px', background: '#f8fafc', fontSize: '0.8rem' }}>
                                                    <div style={{ fontWeight: 500 }}>{rx.type || 'Prescription'}</div>
                                                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{rx.date}</div>
                                                    <div className={`med-status status-${rx.status === 'Completed' ? 'success' : 'warning'}`} style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.7rem' }}>
                                                        {rx.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Appointments History */}
                            <div className="med-section-card">
                                <h4 style={{ marginBottom: '15px', color: 'var(--med-primary)' }}>Appointment History</h4>
                                {patientHistory.appointments.length === 0 ? (
                                    <p style={{ color: '#94a3b8' }}>No past appointments.</p>
                                ) : (
                                    <table className="med-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Test</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patientHistory.appointments.map(appt => (
                                                <tr key={appt.id}>
                                                    <td>
                                                        <div>{appt.date}</div>
                                                        <small style={{ color: '#64748b' }}>{appt.time}</small>
                                                    </td>
                                                    <td>{appt.test}</td>
                                                    <td><span className={`med-status ${appt.status === 'Completed' ? 'status-success' : 'status-neutral'}`}>{appt.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };


    const renderLanding = () => (
        <div className="med-landing-container" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            color: 'var(--med-text-main)', paddingBottom: '50px'
        }}>
            {/* Split Layout Container */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: `url(${moleculeBg}) no-repeat right 50%`, backgroundSize: '70% auto', backgroundColor: 'white',
                padding: '80px', borderRadius: '24px',
                width: '100%', minHeight: '85vh',
                boxShadow: '0 20px 40px rgba(100, 116, 139, 0.1)',
                marginBottom: '50px', position: 'relative', overflow: 'hidden'
            }}>
                {/* Left Side: Welcome Text */}
                <div style={{ flex: 1, textAlign: 'left', zIndex: 2 }}>
                    <h1 style={{
                        fontSize: '4.5rem', marginBottom: '20px', fontWeight: 800,
                        color: '#047857', letterSpacing: '-0.04em', // Deep Green
                        lineHeight: 1.1,
                    }}>
                        Welcome to MediBot
                    </h1>
                    <p style={{
                        fontSize: '1.5rem', color: '#1f2937', marginBottom: '50px', lineHeight: '1.4', fontWeight: 500
                    }}>
                        Manage your laboratory efficiently...
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {/* 3D Glossy Green Button */}
                        <button className="med-btn" style={{
                            padding: '18px 48px', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 700,
                            background: 'linear-gradient(to bottom, #34d399, #059669)',
                            color: 'white', border: 'none',
                            boxShadow: '0 4px 0 #047857, 0 10px 10px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.4)',
                            transform: 'translateY(0)', transition: 'all 0.1s ease', position: 'relative'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
                            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 #047857, inset 0 2px 2px rgba(0,0,0,0.4)'; }}
                            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #047857, 0 10px 10px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.4)'; }}
                            onClick={() => setActiveSection('Overview')}>
                            Go to Overview
                        </button>

                        {/* 3D Soft White Button */}
                        <button className="med-btn" style={{
                            padding: '18px 48px', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 600,
                            background: 'linear-gradient(to bottom, #ffffff, #f3f4f6)',
                            color: '#065f46', border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 0 #d1d5db, 0 5px 10px rgba(0,0,0,0.05)',
                            transform: 'translateY(0)', transition: 'all 0.1s ease'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(to bottom, #ffffff, #f3f4f6)'; }}
                            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 #d1d5db'; }}
                            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #d1d5db, 0 5px 10px rgba(0,0,0,0.05)'; }}
                            onClick={() => setActiveSection('Patients')}>
                            Manage Patients
                        </button>
                    </div>
                </div>

                {/* Right Side: Glassmorphism Tiles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginRight: '60px', zIndex: 2 }}>
                    <div style={{
                        width: '340px', padding: '30px',
                        background: 'rgba(255, 255, 255, 0.4)', // More transparent
                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.6)'
                    }}>
                        <div style={{ fontSize: '2.5rem', color: '#059669', width: '60px' }}>
                            <Icons.TestTube />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lab Status</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>Operational</div>
                        </div>
                    </div>

                    <div style={{
                        width: '340px', padding: '30px',
                        background: 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '20px',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.6)'
                    }}>
                        <div style={{ fontSize: '2.5rem', color: '#059669', width: '60px' }}>
                            <Icons.Users />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Patients</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>{patients.length}+ Active</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Cards */}
            {/* Bottom Cards - 3D Design Update */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', width: '100%', padding: '0 10px' }}>
                {/* Appointments Card */}
                <div className="med-card-3d" style={{
                    cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    background: 'white', padding: '40px 32px', borderRadius: '30px', position: 'relative',
                    boxShadow: '0 10px 30px -5px rgba(50, 50, 93, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.05), 0 -2px 6px 0 rgba(255,255,255,0.8)',
                    border: '1px solid white'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(59, 130, 246, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.querySelector('.card-icon').style.transform = 'scale(1.1) rotate(5deg)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(50, 50, 93, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.05), 0 -2px 6px 0 rgba(255,255,255,0.8)';
                        e.currentTarget.querySelector('.card-icon').style.transform = 'scale(1) rotate(0deg)';
                    }}
                    onClick={() => setActiveSection('Appointments')}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '6px',
                        background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                        borderRadius: '30px 30px 0 0'
                    }}></div>
                    <div className="card-icon" style={{
                        color: '#3b82f6', marginBottom: '24px', background: '#eff6ff',
                        width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '20px', transition: 'all 0.4s ease', fontSize: '1.75rem',
                        boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.1)'
                    }}><Icons.Calendar /></div>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.01em' }}>Appointments</h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6' }}>View complete schedule and manage upcoming test bookings efficiently.</p>
                </div>

                {/* Reports Card */}
                <div className="med-card-3d" style={{
                    cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    background: 'white', padding: '40px 32px', borderRadius: '30px', position: 'relative',
                    boxShadow: '0 10px 30px -5px rgba(50, 50, 93, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.05), 0 -2px 6px 0 rgba(255,255,255,0.8)',
                    border: '1px solid white'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(16, 185, 129, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.querySelector('.card-icon').style.transform = 'scale(1.1) rotate(-5deg)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(50, 50, 93, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.05), 0 -2px 6px 0 rgba(255,255,255,0.8)';
                        e.currentTarget.querySelector('.card-icon').style.transform = 'scale(1) rotate(0deg)';
                    }}
                    onClick={() => setActiveSection('Reports')}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '6px',
                        background: 'linear-gradient(90deg, #10b981, #34d399)',
                        borderRadius: '30px 30px 0 0'
                    }}></div>
                    <div className="card-icon" style={{
                        color: '#10b981', marginBottom: '24px', background: '#ecfdf5',
                        width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '20px', transition: 'all 0.4s ease', fontSize: '1.75rem',
                        boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.1)'
                    }}><Icons.FileText /></div>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.01em' }}>Reports</h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6' }}>Streamlined upload, verification, and management of patient reports.</p>
                </div>

                {/* Settings Card */}
                <div className="med-card-3d" style={{
                    cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    background: 'white', padding: '40px 32px', borderRadius: '30px', position: 'relative',
                    boxShadow: '0 10px 30px -5px rgba(50, 50, 93, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.05), 0 -2px 6px 0 rgba(255,255,255,0.8)',
                    border: '1px solid white'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(139, 92, 246, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.querySelector('.card-icon').style.transform = 'scale(1.1) rotate(5deg)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(50, 50, 93, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.05), 0 -2px 6px 0 rgba(255,255,255,0.8)';
                        e.currentTarget.querySelector('.card-icon').style.transform = 'scale(1) rotate(0deg)';
                    }}
                    onClick={() => setActiveSection('Settings')}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '6px',
                        background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                        borderRadius: '30px 30px 0 0'
                    }}></div>
                    <div className="card-icon" style={{
                        color: '#8b5cf6', marginBottom: '24px', background: '#f5f3ff',
                        width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '20px', transition: 'all 0.4s ease', fontSize: '1.75rem',
                        boxShadow: 'inset 0 0 0 1px rgba(139, 92, 246, 0.1)'
                    }}><Icons.Settings /></div>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.01em' }}>Settings</h3>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6' }}>Configure laboratory profile, notifications, and system defaults.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="med-dashboard-container">
            {renderSidebar()}
            <main className={`med-main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                {renderHeader()}
                <div className="med-view-container">
                    {activeSection === 'Landing' && renderLanding()}
                    {activeSection === 'Overview' && renderOverview()}
                    {activeSection === 'Appointments' && renderAppointments()}
                    {activeSection === 'Test Orders' && renderTestOrders()}
                    {activeSection === 'Patients' && renderPatients()}
                    {activeSection === 'Reports' && renderReports()}
                    {activeSection === 'Lab Staff' && renderStaff()}
                    {activeSection === 'Settings' && renderSettings()}
                    {activeSection === 'Profile' && renderProfile()}

                    {activeSection === 'Payments' && (
                        <div className="med-empty-state">
                            <div className="icon-bg"><Icons.CreditCard /></div>
                            <h3>Payments Module</h3>
                            <p>Payment integration coming soon.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {renderPatientHistoryModal()}

            {notification && (
                <div className="med-toast" style={{ background: notification.type === 'error' ? 'var(--med-error)' : 'var(--med-primary)' }}>
                    {notification.message}
                </div>
            )}

            {/* Upload Report Modal */}
            {showUploadModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px' }}>
                        <h3>Upload Report</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Patient ID: {uploadData.patient_id}</p>
                        <input type="text" placeholder="Test Name (e.g. Blood Test)" value={uploadData.test_name}
                            onChange={e => setUploadData({ ...uploadData, test_name: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                        />
                        <input type="file"
                            onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })}
                            style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setShowUploadModal(false)}>Cancel</button>
                            <button className="med-btn med-btn-primary" onClick={handleUploadReport}>Upload</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient History Modal */}
            {showPatientHistoryModal && selectedPatient && (
                <div className="modal-overlay" onClick={() => setShowPatientHistoryModal(false)} style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                        background: 'white', width: '900px', maxWidth: '95vw', height: '85vh',
                        borderRadius: '24px', display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        {/* Modal Header */}
                        <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>{selectedPatient.name}</h2>
                                <p style={{ color: '#64748b', margin: 0 }}>ID: #{selectedPatient.id} | {selectedPatient.email}</p>
                            </div>
                            <button onClick={() => setShowPatientHistoryModal(false)} style={{ background: '#f1f5f9', border: 'none', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', display: 'flex' }}>
                                <Icons.X />
                            </button>
                        </div>

                        {/* Split View Content */}
                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                            {/* Left: Basic Details */}
                            <div style={{ width: '300px', background: '#f8fafc', padding: '2rem', borderRight: '1px solid #f1f5f9', overflowY: 'auto' }}>
                                <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#334155' }}>Personal Details</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[
                                        ['Age', `${selectedPatient.age} Years`],
                                        ['Gender', selectedPatient.gender],
                                        ['Contact', selectedPatient.phone],
                                        ['Blood Group', 'O+ (Mock)'],
                                        ['Joined', selectedPatient.joined_at ? new Date(selectedPatient.joined_at).toLocaleDateString() : 'N/A']
                                    ].map(([label, val]) => (
                                        <div key={label}>
                                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
                                            <span style={{ display: 'block', fontSize: '1rem', color: '#1e293b', fontWeight: 500 }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Reports & History */}
                            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                                {/* Tabs */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px', width: 'fit-content' }}>
                                    {['Uploaded', 'Generated'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveReportTab(tab)}
                                            style={{
                                                padding: '0.6rem 1.5rem',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: activeReportTab === tab ? 'white' : 'transparent',
                                                color: activeReportTab === tab ? 'var(--primary)' : '#64748b',
                                                fontWeight: activeReportTab === tab ? 700 : 500,
                                                cursor: 'pointer',
                                                boxShadow: activeReportTab === tab ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {tab === 'Uploaded' ? 'Uploaded Reports' : 'Generated Reports'}
                                        </button>
                                    ))}
                                </div>

                                {/* Reports Report Content */}
                                <div style={{ flex: 1 }}>
                                    {activeReportTab === 'Uploaded' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {patientReports.filter(r => r.status !== 'Completed').length > 0 || patientReports.length > 0 ? (
                                                // Same logic as LandingPage: Show list of report rows
                                                patientReports.map(report => (
                                                    <div key={report.id} style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0',
                                                        background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                    }}>
                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                            <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '10px', color: 'var(--primary)' }}>
                                                                <Icons.FileText />
                                                            </div>
                                                            <div>
                                                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>Prescription #{report.id}</h4>
                                                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                                                                    Status: <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{report.status}</span> • {new Date(report.date).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                            <a href={report.file_path} target="_blank" rel="noopener noreferrer" style={{
                                                                padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0',
                                                                background: 'white', color: '#334155', textDecoration: 'none', fontSize: '0.9rem',
                                                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500
                                                            }}>
                                                                <Icons.Eye /> View
                                                            </a>
                                                            <a href={report.file_path} download style={{
                                                                padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--primary)',
                                                                background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '0.9rem',
                                                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500
                                                            }}>
                                                                <Icons.Download /> Download
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                                                    <p>No uploaded reports found.</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // Generated Section
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {patientReports.filter(r => r.status === 'Completed').length > 0 ? (
                                                patientReports.filter(r => r.status === 'Completed').map(report => (
                                                    <div key={report.id} style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0',
                                                        background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                    }}>
                                                        {/* ... Content similarly styled ... */}
                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '10px', color: '#16a34a' }}>
                                                                <Icons.FileText />
                                                            </div>
                                                            <div>
                                                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>Lab Result #{report.id}</h4>
                                                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                                                                    Completed on {new Date(report.date).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <a href={report.file_path} download style={{
                                                            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                                                            background: '#16a34a', color: 'white', textDecoration: 'none', fontSize: '0.9rem',
                                                            display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500
                                                        }}>
                                                            <Icons.Download /> Download
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                                                    <p>No generated reports available yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabAdminDashboard;
