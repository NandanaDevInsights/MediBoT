import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabAdminDashboard.css';
import logoImage from '../assets/Logo.png';

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
    )
};

const LabAdminDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Overview');
    const [notification, setNotification] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Patient & Report State
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientReports, setPatientReports] = useState([]);
    const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
    const [activeReportTab, setActiveReportTab] = useState('Uploaded');
    const [loadingPatients, setLoadingPatients] = useState(false);


    // --- Mock Data ---
    const stats = {
        appointmentsToday: 42,
        pendingOrders: 15,
        reportsGenerated: 28,
        revenue: '$3,450'
    };

    const [appointments, setAppointments] = useState([
        { id: 'A-202401', patient: 'Sarah Jennings', test: 'Complete Blood Count', time: '09:00 AM', date: 'Today', status: 'Pending' },
        { id: 'A-202402', patient: 'Michael Chen', test: 'Lipid Profile', time: '09:30 AM', date: 'Today', status: 'Sample Collected' },
        { id: 'A-202403', patient: 'Emma Watson', test: 'Thyroid Function', time: '10:15 AM', date: 'Today', status: 'Completed' },
        { id: 'A-202404', patient: 'Robert Boyle', test: 'Urinalysis', time: '11:00 AM', date: 'Today', status: 'Pending' },
    ]);

    const [testOrders, setTestOrders] = useState([
        { id: 'ORD-8892', patient: 'Liam Wilson', tests: ['CBC', 'Iron Study'], sample: 'Blood', status: 'Processing' },
        { id: 'ORD-8893', patient: 'Olivia Davis', tests: ['Urine Culture'], sample: 'Urine', status: 'Received' },
        { id: 'ORD-8894', patient: 'James Miller', tests: ['Vitamin D'], sample: 'Blood', status: 'Pending' },
    ]);

    const [staff, setStaff] = useState([
        { id: 1, name: 'Dr. Emily Stones', role: 'Senior Pathologist', status: 'Available' },
        { id: 2, name: 'Mark Ruffalo', role: 'Lab Technician', status: 'In Lab' },
    ]);

    const [reports, setReports] = useState([
        { id: 'R-501', patient: 'Emma Watson', test: 'Thyroid Function', date: '2024-03-15', status: 'Uploaded' },
        { id: 'R-502', patient: 'Lucas Grey', test: 'Liver Function', date: '2024-03-14', status: 'Pending' },
    ]);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Patients
    useEffect(() => {
        if (activeSection === 'Patients') {
            setLoadingPatients(true);
            fetch('http://localhost:5000/api/admin/patients', {
                credentials: 'include'
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch patients");
                    return res.json();
                })
                .then(data => {
                    setPatients(data);
                    setLoadingPatients(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingPatients(false);
                    // Fallback to mock if fetch fails (e.g. not authorized or server down)
                    // Commented out to ensure we see the error if it fails
                    // setPatients([{ id: 'P-1001', name: 'Sarah Jennings (Mock)', age: 34, gender: 'Female', phone: '+1 555-0123' }]);
                });
        }
    }, [activeSection]);

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const handleViewHistory = async (patient) => {
        setSelectedPatient(patient);
        setActiveReportTab('Uploaded');
        setShowPatientHistoryModal(true);
        // Fetch specific reports
        try {
            const res = await fetch(`http://localhost:5000/api/admin/patient/${patient.id}/reports`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setPatientReports(data);
            } else {
                setPatientReports([]);
                showToast("No reports found for this patient", "info");
            }
        } catch (e) {
            console.error(e);
            showToast("Failed to load reports", "error");
        }
    };

    // --- Render Helpers ---

    const renderSidebar = () => {
        const menuItems = [
            { name: 'Overview', icon: <Icons.Dashboard /> },
            { name: 'Appointments', icon: <Icons.Calendar /> },
            { name: 'Test Orders', icon: <Icons.TestTube /> },
            { name: 'Patients', icon: <Icons.Users /> },
            { name: 'Reports', icon: <Icons.FileText /> },
            { name: 'Lab Staff', icon: <Icons.Stethoscope /> },
            { name: 'Payments', icon: <Icons.CreditCard /> },
            { name: 'Settings', icon: <Icons.Settings /> },
        ];

        return (
            <aside className="med-sidebar">
                <div className="med-sidebar-header">
                    <img src={logoImage} alt="MediBot" className="med-sidebar-logo" />
                    <div className="med-logo-text">
                        <span>MediBot</span>
                    </div>
                </div>
                <div className="med-nav-label">Main Menu</div>
                <ul className="med-nav-menu">
                    {menuItems.map(item => (
                        <li
                            key={item.name}
                            className={`med-nav-item ${activeSection === item.name ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.name)}
                        >
                            <span className="med-nav-icon">{item.icon}</span>
                            {item.name}
                        </li>
                    ))}
                </ul>

                <div className="med-sidebar-footer">
                    <div className="med-user-mini">
                        <div className="med-avatar-mini">A</div>
                        <div className="med-user-mini-info">
                            <span className="med-user-name">Admin User</span>
                            <span className="med-user-role">Lab Manager</span>
                        </div>
                    </div>
                </div>
            </aside>
        );
    };

    const renderHeader = () => (
        <header className="med-top-header">
            {/* Left Side: Title & Search */}
            <div className="med-header-left">
                <h2 className="med-page-title">{activeSection}</h2>
                <div className="med-header-search-container">
                    <div className="med-header-search-icon">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for patients, tests, or reports..."
                        className="med-header-search-input"
                    />
                </div>
            </div>

            {/* Right Side: Actions & Profile */}
            <div className="med-header-actions">
                <div className="med-date-display">
                    <Icons.Calendar />
                    {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>

                <div className="med-divider-v"></div>

                <button className="med-icon-btn" title="Notifications">
                    <Icons.Bell />
                    <span className="med-badge"></span>
                </button>

                <div className="med-profile-trigger">
                    <div className="med-avatar-circle">A</div>
                    <span className="med-profile-arrow">▼</span>
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
                        <div className="med-stat-icon-wrapper purple"><Icons.CreditCard /></div>
                        <span className="med-stat-trend up">+5%</span>
                    </div>
                    <h3 className="med-stat-value">{stats.revenue}</h3>
                    <p className="med-stat-label">Daily Revenue</p>
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
                            {appointments.slice(0, 3).map(appt => (
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
                    {appointments.map(appt => (
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
                                <button className="med-action-btn" onClick={() => {
                                    const newStatus = appt.status === 'Pending' ? 'Sample Collected' : 'Completed';
                                    setAppointments(appointments.map(a => a.id === appt.id ? { ...a, status: newStatus } : a));
                                }}>Update</button>
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
                    {testOrders.map(order => (
                        <tr key={order.id}>
                            <td className="mono-text">{order.id}</td>
                            <td style={{ fontWeight: 600 }}>{order.patient}</td>
                            <td>{order.tests.join(', ')}</td>
                            <td>{order.sample}</td>
                            <td>
                                <span className={`med-status ${order.status === 'Processing' ? 'status-info' : 'status-warning'}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td>
                                <button className="med-action-btn">Process</button>
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
                        {patients.map(p => (
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
                                    <span className="med-badge" style={{ background: '#eff6ff', color: 'var(--primary)', fontSize: '0.9rem' }}>
                                        {p.uploaded_data_count || 0} Reports
                                    </span>
                                </td>
                                <td>
                                    <button className="med-link-btn" onClick={() => handleViewHistory(p)}>View History</button>
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
                {reports.map((report) => (
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
        <div className="med-card no-pad">
            <div className="med-table-header">
                <h3 className="med-table-title">Lab Staff</h3>
                <button className="med-btn med-btn-primary">Add Member</button>
            </div>
            <table className="med-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map(s => (
                        <tr key={s.id}>
                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                            <td>{s.role}</td>
                            <td>
                                <span className={`med-status ${s.status === 'Available' ? 'status-success' : 'status-info'}`}>
                                    {s.status}
                                </span>
                            </td>
                            <td>
                                <button className="med-action-btn">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderSettings = () => (
        <div className="med-form-grid">
            <div className="med-section-card">
                <h3 className="med-table-title" style={{ marginBottom: '20px' }}>Lab Details</h3>
                <div className="med-form-group">
                    <label>Lab Name</label>
                    <input type="text" defaultValue="MediBot Central Lab" />
                </div>
                <div className="med-form-group">
                    <label>Address</label>
                    <input type="text" defaultValue="123 Health Ave, Springfield" />
                </div>
                <div className="med-form-group">
                    <label>Contact Number</label>
                    <input type="text" defaultValue="+1 555-0000" />
                </div>
                <div className="med-form-actions">
                    <button className="med-btn med-btn-primary" onClick={() => showToast('Profile updated!')}>Save Changes</button>
                </div>
            </div>

            <div className="med-section-card">
                <h3 className="med-table-title" style={{ marginBottom: '20px' }}>System Preferences</h3>
                <div className="med-toggle-row">
                    <span>Email Notifications</span>
                    <input type="checkbox" defaultChecked />
                </div>
                <div className="med-toggle-row">
                    <span>SMS Alerts</span>
                    <input type="checkbox" />
                </div>
                <div className="med-toggle-row">
                    <span>Dark Mode (Beta)</span>
                    <input type="checkbox" />
                </div>

                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                    <button className="med-btn med-btn-danger" onClick={handleLogout}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );


    return (
        <div className="med-dashboard-container">
            {renderSidebar()}
            <main className="med-main-content">
                {renderHeader()}
                <div className="med-view-container">
                    {activeSection === 'Overview' && renderOverview()}
                    {activeSection === 'Appointments' && renderAppointments()}
                    {activeSection === 'Test Orders' && renderTestOrders()}
                    {activeSection === 'Patients' && renderPatients()}
                    {activeSection === 'Reports' && renderReports()}
                    {activeSection === 'Lab Staff' && renderStaff()}
                    {activeSection === 'Settings' && renderSettings()}

                    {activeSection === 'Payments' && (
                        <div className="med-empty-state">
                            <div className="icon-bg"><Icons.CreditCard /></div>
                            <h3>Payments Gateway</h3>
                            <p>No transactions recorded today.</p>
                        </div>
                    )}
                </div>
            </main>

            {notification && (
                <div className="med-toast" style={{ background: notification.type === 'error' ? 'var(--med-error)' : 'var(--med-primary)' }}>
                    {notification.message}
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
