
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabAdminDashboard.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    ),
    Home: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
    ),
    ChevronDown: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
    ),
    Check: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    ),
    Share: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
    ),
    CheckCircle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
    Filter: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
    ),
    Trash: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
    ),
    Link: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
    ),
    User: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    Phone: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    ),
    Activity: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
    ),
    Clock: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    )
};

const LabAdminDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Overview');
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
        activeStaff: 0,
        dailyStats: []
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
    const [activeReportTab, setActiveReportTab] = useState('Uploaded');
    const [appointmentFilter, setAppointmentFilter] = useState('All');
    const [activeReportFilter, setActiveReportFilter] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [newBooking, setNewBooking] = useState({
        patientName: '',
        age: '',
        gender: 'Male',
        contact: '',
        test: '',
        date: '',
        time: '',
        doctor: ''
    });

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // --- Auth Check on Mount ---
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if user is authenticated AND has correct role
                const res = await fetch('http://localhost:5000/api/profile', { credentials: 'include' });
                if (res.status === 401 || res.status === 403) {
                    navigate('/admin/login');
                    return;
                }
                const data = await res.json();
                if (data.role !== 'LAB_ADMIN' && data.role !== 'SUPER_ADMIN') {
                    // Wrong role, redirect to login
                    navigate('/admin/login');
                }
            } catch (err) {
                console.error("Auth Check Failed:", err);
                navigate('/admin/login');
            }
        };
        checkAuth();
    }, [navigate]);

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
                if (activeSection !== 'Settings') showToast(`Failed to load ${activeSection} `, "error");
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
                    if (!res.ok) throw new Error(`Server Error: ${res.status} `);
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
        const doLogout = () => {
            sessionStorage.removeItem('auth_role');
            navigate('/admin/login');
        };
        fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' })
            .then(doLogout)
            .catch(doLogout);
    };

    // --- Actions ---
    const handleStatusChange = async (id, newStatus) => {
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

    const handleSaveBooking = async () => {
        if (!newBooking.patientName || !newBooking.test || !newBooking.date || !newBooking.time) {
            showToast("Please fill all required fields", "error");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/admin/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labName: profileData.lab_name || 'My Lab',
                    patientName: newBooking.patientName,
                    tests: [newBooking.test],
                    date: newBooking.date,
                    time: newBooking.time,
                    doctor: newBooking.doctor || 'Self',
                    location: profileData.address || 'Lab Location',
                    // passing other details if backend supports or just for record (backend update required to store these deeply)
                    contact: newBooking.contact,
                    age: newBooking.age,
                    gender: newBooking.gender
                }),
                credentials: 'include'
            });

            if (res.ok) {
                showToast("Booking Successful");
                setShowBookingModal(false);
                setNewBooking({ patientName: '', age: '', gender: 'Male', contact: '', test: '', date: '', time: '', doctor: '' });
                // Refresh appointments
                const appsRes = await fetch('http://localhost:5000/api/admin/appointments', { credentials: 'include' });
                if (appsRes.ok) {
                    const data = await appsRes.json();
                    setAppointments(data);
                }
            } else {
                showToast("Booking Failed", "error");
            }
        } catch (e) {
            console.error(e);
            showToast("Error creating booking", "error");
        }
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
        setActiveReportTab('Uploaded'); // Default to uploaded view
        setShowPatientHistoryModal(true);

        try {
            // Encode ID to handle '+' in phone numbers
            const encodedId = encodeURIComponent(patient.id);
            const res = await fetch(`http://localhost:5000/api/admin/patients/${encodedId}/history`, { credentials: 'include' });
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
                <div className="med-card hover-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper blue"><Icons.Calendar /></div>
                        <span className="med-stat-trend up" style={{ background: '#dbeafe', color: '#1e40af' }}>+8%</span>
                    </div>
                    <h3 className="med-stat-value">{stats.appointmentsToday}</h3>
                    <p className="med-stat-label">Appointments Today</p>
                </div>
                <div className="med-card hover-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper orange"><Icons.TestTube /></div>
                        <span className="med-stat-trend neutral" style={{ background: '#fef3c7', color: '#92400e' }}>0%</span>
                    </div>
                    <h3 className="med-stat-value">{stats.pendingOrders}</h3>
                    <p className="med-stat-label">Pending Orders</p>
                </div>
                <div className="med-card hover-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper green"><Icons.FileText /></div>
                        <span className="med-stat-trend up" style={{ background: '#dcfce7', color: '#166534' }}>+12%</span>
                    </div>
                    <h3 className="med-stat-value">{stats.reportsGenerated}</h3>
                    <p className="med-stat-label">Reports Generated</p>
                </div>
                <div className="med-card hover-card">
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper purple"><Icons.Users /></div>
                    </div>
                    <h3 className="med-stat-value">{stats.activeStaff}</h3>
                    <p className="med-stat-label">Active Staff</p>
                </div>
            </div>

            {/* Graph Section */}
            <div className="med-card zoom-in-enter" style={{ marginBottom: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="med-table-title">Weekly Appointments Overview</h3>
                    <select style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#475569' }}>
                        <option>This Week</option>
                        <option>Last Week</option>
                    </select>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.dailyStats && stats.dailyStats.length > 0 ? stats.dailyStats : [{ name: 'Mon', count: 0 }, { name: 'Tue', count: 0 }, { name: 'Wed', count: 0 }, { name: 'Thu', count: 0 }, { name: 'Fri', count: 0 }, { name: 'Sat', count: 0 }, { name: 'Sun', count: 0 }]}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '12px' }}
                                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
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
                    <select
                        className="med-select-filter"
                        value={appointmentFilter}
                        onChange={(e) => setAppointmentFilter(e.target.value)}
                        style={{ marginRight: '10px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Sample Collected">Sample Collected</option>
                    </select>
                    <button className="med-btn med-btn-primary" onClick={() => setShowBookingModal(true)}>New Booking</button>
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
                    </tr>
                </thead>
                <tbody>
                    {appointments
                        .filter(a => {
                            const matchesSearch = a.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                a.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                a.id.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesFilter = appointmentFilter === 'All' || a.status === appointmentFilter;
                            return matchesSearch && matchesFilter;
                        })
                        .map(appt => (
                            <tr key={appt.id}>
                                <td className="mono-text">{appt.id}</td>
                                <td style={{ fontWeight: 600, color: '#334155' }}>{appt.patient}</td>
                                <td>{appt.test}</td>
                                <td>{appt.date}, {appt.time}</td>
                                <td>
                                    <select
                                        value={appt.status}
                                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                                        className={`med-status ${appt.status === 'Completed' ? 'status-success' :
                                            appt.status === 'Sample Collected' ? 'status-info' :
                                                appt.status === 'Approved' ? 'status-info' :
                                                    appt.status === 'Pending' ? 'status-warning' : 'status-neutral'
                                            }`}
                                        style={{
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            background: 'transparent'
                                        }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Sample Collected">Sample Collected</option>
                                        <option value="Completed">Completed</option>
                                    </select>
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {p.profile_pic ? (
                                                <img src={p.profile_pic} alt={p.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                    {p.email}
                                                    {p.age && p.age !== 'N/A' && ` • ${p.age} Y/O`}
                                                    {p.gender && p.gender !== 'N/A' && ` • ${p.gender}`}
                                                </div>
                                            </div>
                                        </div>
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
                                            {p.uploaded_data_count > 0 ? (
                                                <button
                                                    onClick={() => handleViewHistory(p)}
                                                    className="med-btn"
                                                    style={{
                                                        padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600,
                                                        background: '#dcfce7', color: '#166534',
                                                        border: '1px solid #bbf7d0', borderRadius: '8px',
                                                        display: 'flex', alignItems: 'center', gap: '8px'
                                                    }}
                                                >
                                                    <Icons.Eye /> View Uploads ({p.uploaded_data_count})
                                                </button>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>None</span>
                                            )}
                                        </div>
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


    const renderReports = () => {
        // Mock data enhancement if real data is missing fields (for display purposes)
        const enhancedReports = reports.map(r => ({
            ...r,
            ref: r.ref || `APT-${(r.id || '').split('-')[1] || Math.floor(Math.random() * 1000)}`,
            fileType: r.fileType || 'PDF',
            staff: r.staff || 'Lab Admin',
            verified: r.status === 'Verified'
        }));

        const filteredReports = enhancedReports.filter(r =>
            (activeReportFilter === 'All' || r.status === activeReportFilter) &&
            (r.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (r.id && r.id.toLowerCase().includes(searchTerm.toLowerCase())))
        );

        return (
            <div className="med-card no-pad">
                <div className="med-table-header" style={{ paddingBottom: '0', borderBottom: 'none', display: 'block' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 className="med-table-title">Reports Management</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>Manage, verify, and share patient diagnostic reports.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        {/* Dropdown Filter Button */}
                        <div style={{ position: 'relative' }}>
                            <button
                                className="med-btn"
                                style={{ background: 'white', border: '1px solid #e2e8f0', color: '#64748b', minWidth: '160px', justifyContent: 'space-between', padding: '8px 16px' }}
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Icons.Filter size={18} />
                                    <span>{activeReportFilter === 'All' ? 'Filter Status' : activeReportFilter}</span>
                                </div>
                                <Icons.ChevronDown size={16} />
                            </button>

                            {showFilterMenu && (
                                <div className="med-dropdown-menu" style={{
                                    position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                                    background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    zIndex: 50, minWidth: '160px', padding: '4px', display: 'flex', flexDirection: 'column'
                                }}>
                                    {['All', 'Uploaded', 'Verified', 'Shared'].map(status => (
                                        <button
                                            key={status}
                                            style={{
                                                textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent',
                                                color: activeReportFilter === status ? 'var(--med-primary)' : '#64748b',
                                                fontWeight: activeReportFilter === status ? '600' : '500',
                                                cursor: 'pointer', borderRadius: '6px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                transition: 'background 0.2s',
                                                fontSize: '0.9rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            onClick={() => {
                                                setActiveReportFilter(status);
                                                setShowFilterMenu(false);
                                            }}
                                        >
                                            {status}
                                            {activeReportFilter === status && <Icons.Check size={16} style={{ color: 'var(--med-primary)' }} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="med-btn med-btn-primary" onClick={() => {
                            setUploadData({ patient_id: '', test_name: '', file: null });
                            setShowUploadModal(true);
                        }}>
                            <Icons.UploadCloud size={18} /> Upload Report
                        </button>
                    </div>
                </div>

                {/* Search Bar Removed as requested */}

                <div className="med-scrollbar-hidden" style={{ overflowX: 'auto' }}>
                    <table className="med-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Patient Name</th>
                                <th>Ref</th>
                                <th>Test Name(s)</th>
                                <th>File</th>
                                <th>Date</th>
                                <th>Staff</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '50%', border: '1px dashed #cbd5e1' }}>
                                                <Icons.FileText size={32} style={{ opacity: 0.5 }} />
                                            </div>
                                            <p style={{ margin: 0, fontWeight: 500 }}>No reports found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map(report => (
                                    <tr key={report.id}>
                                        <td className="mono-text" style={{ fontWeight: 600, color: 'var(--med-primary)' }}>{report.id}</td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{report.patient}</div>
                                            {report.patientId && <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>#{report.patientId}</div>}
                                        </td>
                                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{report.ref}</td>
                                        <td>
                                            <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', border: '1px solid #e2e8f0' }}>
                                                {report.test}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {report.fileType === 'Image' ? <Icons.Eye size={16} color="#0f766e" /> : <Icons.FileText size={16} color="#ef4444" />}
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{report.fileType}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: '#475569', fontSize: '0.9rem' }}>{report.date}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                                    {report.staff.charAt(0)}
                                                </div>
                                                <span style={{ fontSize: '0.9rem' }}>{report.staff.split(' ')[0]}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`med-status status-${report.status === 'Verified' ? 'success' : report.status === 'Shared' ? 'info' : 'warning'}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '16px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button title="Preview" className="med-icon-btn view" onClick={() => window.open(report.fileUrl || '#', '_blank')}><Icons.Eye size={18} /></button>
                                                <button title="Verify" className="med-icon-btn verify" onClick={() => showToast(`Report ${report.id} Verified`, "success")}><Icons.CheckCircle size={18} /></button>
                                                <button title="Share" className="med-icon-btn share" onClick={() => showToast(`Sharing Report ${report.id}`)}><Icons.Share size={18} /></button>
                                                <button title="Map/Edit" className="med-icon-btn edit" onClick={() => showToast(`Edit/Map Report ${report.id}`)}><Icons.Link size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

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
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                        {patientHistory.prescriptions.map(rx => (
                                            <div key={rx.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: 'white', display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ height: '140px', background: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img
                                                        src={rx.image_url}
                                                        alt="Rx"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{rx.type || 'Prescription'}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{rx.date}</div>
                                                        </div>
                                                        <span className={`med-status status-${rx.status === 'Completed' ? 'success' : 'warning'}`} style={{ fontSize: '0.7rem' }}>
                                                            {rx.status}
                                                        </span>
                                                    </div>

                                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                                                        <a
                                                            href={rx.image_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="med-btn"
                                                            style={{ flex: 1, padding: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'white', border: '1px solid #cbd5e1', color: '#334155' }}
                                                        >
                                                            <Icons.Eye size={14} /> View
                                                        </a>
                                                        <a
                                                            href={rx.image_url}
                                                            download={`Prescription-${rx.id}.jpg`}
                                                            className="med-btn med-btn-primary"
                                                            style={{ flex: 1, padding: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                        >
                                                            <Icons.Download size={14} /> Download
                                                        </a>
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




    return (
        <div className="med-dashboard-container">
            {renderSidebar()}
            <main className={`med-main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                {renderHeader()}
                <div className="med-view-container">

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
                    {(() => {
                        const patientReports = patientHistory ? patientHistory.prescriptions : [];
                        return (
                            <div className="med-modal-animate" onClick={e => e.stopPropagation()} style={{
                                background: 'white', width: '1000px', maxWidth: '95vw', height: '85vh',
                                borderRadius: '24px', display: 'flex', flexDirection: 'column',
                                overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #f1f5f9'
                            }}>
                                {/* New Header Design */}
                                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'start', background: 'white' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>{selectedPatient.name}</h2>
                                        <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 600 }}>ID: #{selectedPatient.id}</span>
                                            <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                                            {selectedPatient.email}
                                            {selectedPatient.phone && (
                                                <>
                                                    <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                                                    {selectedPatient.phone}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <button onClick={() => setShowPatientHistoryModal(false)} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', color: '#64748b', transition: 'all 0.2s' }}>
                                        <Icons.X size={20} />
                                    </button>
                                </div>

                                {/* Main Content Layout */}
                                <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '32px', gap: '32px', background: '#ffffff' }}>
                                    {/* Left: Personal Details Cards */}
                                    <div className="med-scrollbar-hidden" style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0, overflowY: 'auto', paddingRight: '4px' }}>
                                        <h4 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Personal Details</h4>

                                        {/* Age Card */}
                                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)' }}>
                                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>AGE</span>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155' }}>{selectedPatient.age && selectedPatient.age !== 'N/A' ? `${selectedPatient.age} Years` : 'N/A'}</div>
                                        </div>

                                        {/* Gender Card */}
                                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)' }}>
                                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>GENDER</span>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155' }}>{selectedPatient.gender || 'N/A'}</div>
                                        </div>

                                        {/* Contact / Info Card */}
                                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>CONTACT</span>
                                                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>{selectedPatient.phone || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>BLOOD GROUP</span>
                                                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>{selectedPatient.blood_group || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>ADDRESS</span>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#334155', lineHeight: '1.4' }}>{selectedPatient.address || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Reports Section */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        {/* Tabs */}
                                        <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '12px', display: 'inline-flex', alignSelf: 'start', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                                            {['Uploaded', 'Generated'].map(tab => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveReportTab(tab)}
                                                    style={{
                                                        padding: '10px 32px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        background: activeReportTab === tab ? '#0d9488' : 'transparent', // Teal for active
                                                        color: activeReportTab === tab ? 'white' : '#64748b',
                                                        fontWeight: activeReportTab === tab ? 600 : 500,
                                                        cursor: 'pointer',
                                                        boxShadow: activeReportTab === tab ? '0 4px 6px -1px rgba(13, 148, 136, 0.3)' : 'none',
                                                        transition: 'all 0.2s ease',
                                                        fontSize: '0.95rem'
                                                    }}
                                                >
                                                    {tab === 'Uploaded' ? 'Uploaded Reports' : 'Generated Reports'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Grid Content */}
                                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', paddingBottom: '20px' }} className="med-scrollbar-hidden">
                                            {activeReportTab === 'Uploaded' ? (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                                    {patientReports.length > 0 ? (
                                                        patientReports.map(report => (
                                                            <div key={report.id} style={{
                                                                background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden',
                                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.01)',
                                                                transition: 'transform 0.2s', cursor: 'default'
                                                            }}>
                                                                {/* Image Preview */}
                                                                <div style={{ height: '180px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                                                                    <img
                                                                        src={report.image_url}
                                                                        alt="Report"
                                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Preview' }}
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    />
                                                                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                                                        <span style={{
                                                                            background: 'rgba(255, 255, 255, 0.95)', padding: '4px 10px', borderRadius: '20px',
                                                                            fontSize: '0.75rem', fontWeight: 700, color: '#0f766e', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                                            backdropFilter: 'blur(4px)'
                                                                        }}>
                                                                            {report.status || 'Pending'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Card Body */}
                                                                <div style={{ padding: '20px' }}>
                                                                    <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{report.type || 'General Lab Test'}</h4>
                                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>{report.date ? new Date(report.date).toLocaleDateString() : 'Unknown Date'}</p>

                                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                                                                        <a
                                                                            href={report.image_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                                                padding: '10px', borderRadius: '8px', border: '1px solid #0d9488',
                                                                                background: 'white', color: '#0d9488', textDecoration: 'none',
                                                                                fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s'
                                                                            }}
                                                                            onMouseOver={(e) => e.currentTarget.style.background = '#f0fdfa'}
                                                                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                                                        >
                                                                            <Icons.Eye size={18} /> View
                                                                        </a>
                                                                        <button
                                                                            onClick={async (e) => {
                                                                                /* Download Logic */
                                                                                e.preventDefault();
                                                                                window.open(report.image_url, '_blank');
                                                                            }}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                                                padding: '10px', borderRadius: '8px', border: 'none',
                                                                                background: '#0d9488', color: 'white',
                                                                                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                                                                                boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)'
                                                                            }}
                                                                        >
                                                                            <Icons.Download size={18} /> Download
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={{ gridColumn: '1 / -1', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '16px', color: '#94a3b8' }}>
                                                            <Icons.FileText size={48} style={{ opacity: 0.2 }} />
                                                            <p style={{ marginTop: '16px', fontWeight: 500 }}>No uploaded reports found used.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {/* Placeholder for Generated Reports to match style if needed, or keep list */}
                                                    <div style={{ padding: '48px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
                                                        <p>Generated reports section under construction.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
            {/* New Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div className="med-modal-animate med-scrollbar-hidden" style={{ background: 'white', borderRadius: '20px', width: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: 0 }}>
                        {/* Header with Gradient */}
                        <div style={{ background: 'linear-gradient(135deg, var(--med-primary) 0%, #0f766e 100%)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>New Appointment</h3>
                                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Fill in the details to book a new test.</p>
                            </div>
                            <button onClick={() => setShowBookingModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', color: 'white', backdropFilter: 'blur(4px)' }}>
                                <Icons.X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '32px' }}>
                            {/* Section 1: Patient Details */}
                            <div className="med-section-divider"><span>Patient Information</span></div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }}>
                                <div className="med-form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Full Name *</label>
                                    <div className="med-input-container">
                                        <Icons.User className="med-input-icon" size={18} />
                                        <input
                                            type="text"
                                            className="med-input-enhanced med-input-with-icon"
                                            value={newBooking.patientName}
                                            onChange={e => setNewBooking({ ...newBooking, patientName: e.target.value })}
                                            placeholder="Enter patient's full name"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="med-form-group">
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Age</label>
                                        <input
                                            type="number"
                                            className="med-input-enhanced"
                                            value={newBooking.age}
                                            onChange={e => setNewBooking({ ...newBooking, age: e.target.value })}
                                            placeholder="Ex: 25"
                                        />
                                    </div>
                                    <div className="med-form-group">
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Gender</label>
                                        <select
                                            className="med-input-enhanced med-select-enhanced"
                                            value={newBooking.gender}
                                            onChange={e => setNewBooking({ ...newBooking, gender: e.target.value })}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="med-form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Contact Number</label>
                                    <div className="med-input-container">
                                        <Icons.Phone className="med-input-icon" size={18} />
                                        <input
                                            type="text"
                                            className="med-input-enhanced med-input-with-icon"
                                            value={newBooking.contact}
                                            onChange={e => setNewBooking({ ...newBooking, contact: e.target.value })}
                                            placeholder="+91..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Appointment Details */}
                            <div className="med-section-divider"><span>Test & Schedule</span></div>

                            <div className="med-form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Test Requirements *</label>
                                <div className="med-input-container">
                                    <Icons.Activity className="med-input-icon" size={18} />
                                    <input
                                        type="text"
                                        className="med-input-enhanced med-input-with-icon"
                                        value={newBooking.test}
                                        onChange={e => setNewBooking({ ...newBooking, test: e.target.value })}
                                        placeholder="e.g. Complete Blood Count (CBC)"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="med-form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Preferred Date *</label>
                                    <div className="med-input-container">
                                        <Icons.Calendar className="med-input-icon" size={18} />
                                        <input
                                            type="date"
                                            className="med-input-enhanced med-input-with-icon"
                                            value={newBooking.date}
                                            onChange={e => setNewBooking({ ...newBooking, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="med-form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>Preferred Time *</label>
                                    <div className="med-input-container">
                                        <Icons.Clock className="med-input-icon" size={18} />
                                        <input
                                            type="time"
                                            className="med-input-enhanced med-input-with-icon"
                                            value={newBooking.time}
                                            onChange={e => setNewBooking({ ...newBooking, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '32px' }}>
                                <button className="med-btn" onClick={() => setShowBookingModal(false)} style={{ background: 'white', border: '1px solid #cbd5e1', color: '#64748b' }}>Cancel</button>
                                <button className="med-btn med-btn-primary" onClick={handleSaveBooking} style={{ minWidth: '160px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(13, 118, 110, 0.2)' }}>
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabAdminDashboard;
