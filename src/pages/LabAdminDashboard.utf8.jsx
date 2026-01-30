import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabAdminDashboard.css';
import logoImage from '../assets/Logo.png';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { getUserProfile } from '../services/api';

const LabAdminDashboard = () => {
    const navigate = useNavigate();
    // --- PIN LOCK LOGIC ---
    const [pinVerified, setPinVerified] = useState(false);
    const [requiredPin, setRequiredPin] = useState(null);
    const [enteredPin, setEnteredPin] = useState(['', '', '', '']);
    const [pinError, setPinError] = useState('');
    const [loadingPin, setLoadingPin] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    // Filters
    const [filterDate, setFilterDate] = useState('2025-05-12');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterSearch, setFilterSearch] = useState('');
    const [viewPrescription, setViewPrescription] = useState(null);
    const [selectedRole, setSelectedRole] = useState('All');
    const [staffModal, setStaffModal] = useState(null); // null, 'add', 'edit'
    const [editingStaff, setEditingStaff] = useState(null); // Data for staff being edited
    const [viewLeaves, setViewLeaves] = useState(null); // ID of staff to view leaves for
    const [staffLeaves, setStaffLeaves] = useState([
        { id: 1, staffId: 1, type: 'Medical', startDate: '2024-03-01', endDate: '2024-03-03', status: 'Approved', reason: 'Flu' },
        { id: 2, staffId: 2, type: 'Casual', startDate: '2024-04-10', endDate: '2024-04-12', status: 'Pending', reason: 'Family Event' },
    ]);

    const notifications = [
        { id: 1, message: 'Urgent: Reagent Stock Low (Test Pk-4)', time: '15 mins ago', type: 'alert' },
        { id: 2, message: 'New appointment booked: Sarah Jennings', time: '1 hour ago', type: 'info' },
        { id: 3, message: 'Daily revenue report generated.', time: '4 hours ago', type: 'success' },
    ];

    const [currentUser] = useState({
        name: 'Dr. A. Smith',
        role: 'Chief Administrator',
        email: 'asmith@medibot-lab.com',
        license: 'MD-445210-NY',
        department: 'Pathology & Diagnostics'
    });

    const [labDetails, setLabDetails] = useState({
        name: 'MediBot Labs - Central Branch',
        logo: null,
        address: '123 Healthcare Ave, Springfield, IL',
        contact: '+1 (555) 123-4567',
        license: 'LAB-99887766'
    });
    const [isEditingLab, setIsEditingLab] = useState(false);
    const [tempLabDetails, setTempLabDetails] = useState(labDetails);

    const handleLogout = () => {
        sessionStorage.removeItem('lab_admin_pin_verified');
        navigate('/');
    };

    // Mock Data
    const activityData = [
        { day: 'Mon', bookings: 45, revenue: 1200 },
        { day: 'Tue', bookings: 52, revenue: 1450 },
        { day: 'Wed', bookings: 38, revenue: 980 },
        { day: 'Thu', bookings: 65, revenue: 1800 },
        { day: 'Fri', bookings: 58, revenue: 1600 },
        { day: 'Sat', bookings: 42, revenue: 1100 },
        { day: 'Sun', bookings: 25, revenue: 750 },
    ];


    useEffect(() => {
        let mounted = true;
        const checkPinStatus = async () => {
            const isVerified = sessionStorage.getItem('lab_admin_pin_verified');

            try {
                const user = await getUserProfile();
                if (mounted) {
                    if (user.role === 'LAB_ADMIN') {
                        setRequiredPin(user.pin_code);
                        if (isVerified === 'true') {
                            setPinVerified(true);
                        }
                    } else {
                        // Start verified for non-lab-admins
                        setPinVerified(true);
                    }
                }
            } catch (err) {
                console.error("Profile load failed", err);
            } finally {
                if (mounted) setLoadingPin(false);
            }
        };
        checkPinStatus();

        // Safety timeout in case API hangs
        const timer = setTimeout(() => {
            if (mounted) setLoadingPin(false);
        }, 5000);

        return () => { mounted = false; clearTimeout(timer); };
    }, []);

    const handlePinInput = (element, index) => {
        const val = element.value.toUpperCase();
        if (val.length > 1) return;
        const newPin = [...enteredPin];
        newPin[index] = val;
        setEnteredPin(newPin);
        if (val && element.nextSibling) element.nextSibling.focus();

        if (newPin.join('').length === 4) verifyPin(newPin.join(''));
    };

    const handlePinKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !enteredPin[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const verifyPin = (pinStr) => {
        if (pinStr === requiredPin) {
            setPinVerified(true);
            sessionStorage.setItem('lab_admin_pin_verified', 'true');
        } else {
            setPinError('Incorrect Key');
            setTimeout(() => {
                setEnteredPin(['', '', '', '']);
                setPinError('');
                document.getElementById('dash-pin-0')?.focus();
            }, 1000);
        }
    };
    // -----------------------

    // -----------------------

    // --- Chart Data ---
    const mostRequestedTests = [
        { name: 'CBC', value: 120 },
        { name: 'Lipid', value: 98 },
        { name: 'Thyroid', value: 86 },
        { name: 'Urinalysis', value: 65 },
        { name: 'Vit D', value: 55 },
    ];

    const appointmentTrends = [
        { time: '8 AM', value: 12 },
        { time: '9 AM', value: 24 },
        { time: '10 AM', value: 35 },
        { time: '11 AM', value: 28 },
        { time: '12 PM', value: 18 },
        { time: '1 PM', value: 22 },
        { time: '2 PM', value: 30 },
        { time: '3 PM', value: 25 },
        { time: '4 PM', value: 15 },
    ];

    const appointmentStatus = [
        { name: 'Completed', value: 65, color: '#2563eb' },
        { name: 'Pending', value: 25, color: '#f59e0b' },
        { name: 'Cancelled', value: 10, color: '#ef4444' },
    ];

    const reportStatus = [
        { name: 'Generated', value: 85, color: '#3b82f6' },
        { name: 'Pending', value: 15, color: '#cbd5e1' },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const [bookings, setBookings] = useState([
        { id: 'B1024', patient: 'Sarah Jennings', test: 'Complete Blood Count', date: '2025-05-12', status: 'Confirmed', time: '09:00 AM', prescriptionUrl: 'https://placehold.co/400x600?text=Rx+Prescription+1' },
        { id: 'B1025', patient: 'Michael Chen', test: 'Lipid Profile', date: '2025-05-12', status: 'Arrived', time: '09:30 AM', prescriptionUrl: 'https://placehold.co/400x600?text=Rx+Prescription+2' },
        { id: 'B1026', patient: 'Emma Watson', test: 'Thyroid Function', date: '2025-05-12', status: 'Completed', time: '10:00 AM', prescriptionUrl: 'https://placehold.co/400x600?text=Rx+Prescription+3' },
        { id: 'B1027', patient: 'John Doe', test: 'Vitamin D', date: '2025-05-13', status: 'Pending', time: '10:30 AM', prescriptionUrl: 'https://placehold.co/400x600?text=Rx+Prescription+4' },
        { id: 'B1028', patient: 'Alice Cooper', test: 'Liver Function', date: '2025-05-12', status: 'Processing', time: '11:00 AM', prescriptionUrl: 'https://placehold.co/400x600?text=Rx+Prescription+5' },
    ]);

    const [tests, setTests] = useState([
        { id: 1, name: 'Complete Blood Count (CBC)', price: 40, stock: 'High', stockLevel: 85, category: 'Hematology', quantity: 1500, expiry: '2026-08-15', status: 'Available' },
        { id: 2, name: 'Lipid Profile Reagent', price: 60, stock: 'Medium', stockLevel: 45, category: 'Biochemistry', quantity: 230, expiry: '2025-12-01', status: 'Running Low' },
        { id: 3, name: 'Thyroid Panel Kit', price: 55, stock: 'Low', stockLevel: 15, category: 'Immunology', quantity: 45, expiry: '2025-11-20', status: 'Critical' },
        { id: 4, name: 'Liver Function Test', price: 50, stock: 'High', stockLevel: 92, category: 'Biochemistry', quantity: 800, expiry: '2026-03-10', status: 'Available' },
        { id: 5, name: 'Vitamin D Kit', price: 75, stock: 'Medium', stockLevel: 60, category: 'Immunology', quantity: 300, expiry: '2026-01-05', status: 'Available' },
    ]);

    const [technicians, setTechnicians] = useState([
        { id: 1, name: 'Dr. Emily Stones', role: 'Senior Pathologist', shift: 'Morning', shiftTime: '08:00 - 16:00', status: 'Available', email: 'emily.stones@medibot.com', phone: '+1 555-0123', joined: '2021-06-15', avatar: '≡ƒæ⌐ΓÇìΓÜò∩╕Å' },
        { id: 2, name: 'Mark Ruffalo', role: 'Lab Technician', shift: 'Afternoon', shiftTime: '13:00 - 21:00', status: 'In Lab', email: 'mark.r@medibot.com', phone: '+1 555-0198', joined: '2022-03-10', avatar: '≡ƒæ¿ΓÇì≡ƒö¼' },
        { id: 3, name: 'Sarah Connor', role: 'Phlebotomist', shift: 'Night', shiftTime: '21:00 - 05:00', status: 'Off Duty', email: 'sarah.c@medibot.com', phone: '+1 555-0142', joined: '2023-01-22', avatar: '≡ƒæ⌐ΓÇì≡ƒö¼' },
        { id: 4, name: 'Dr. James Wilson', role: 'Microbiologist', shift: 'Morning', shiftTime: '09:00 - 17:00', status: 'In Lab', email: 'j.wilson@medibot.com', phone: '+1 555-0177', joined: '2020-11-05', avatar: '≡ƒæ¿ΓÇìΓÜò∩╕Å' },
        { id: 5, name: 'Linda Martinez', role: 'Lab Assistant', shift: 'Afternoon', shiftTime: '12:00 - 20:00', status: 'Available', email: 'linda.m@medibot.com', phone: '+1 555-0166', joined: '2023-08-30', avatar: '≡ƒæ⌐ΓÇì≡ƒö¼' },
    ]);

    // Enhanced Reports State
    const [uploadedReports, setUploadedReports] = useState([
        { id: 1, fileName: 'Blood_Work_A24.pdf', patient: 'Sarah Jennings', test: 'Complete Blood Count', date: '2024-03-15', size: '2.4 MB', status: 'Pending Review' },
        { id: 2, fileName: 'Lipid_Panel_B92.pdf', patient: 'Michael Chen', test: 'Lipid Profile', date: '2024-03-14', size: '1.8 MB', status: 'Verified' },
        { id: 3, fileName: 'Thyroid_Test_C15.pdf', patient: 'Emma Watson', test: 'Thyroid Panel', date: '2024-03-14', size: '3.1 MB', status: 'Pending Review' },
    ]);
    const [reportForm, setReportForm] = useState({ patientName: '', testType: '', file: null });

    // Slot Logic
    const [slotCapacity, setSlotCapacity] = useState(5);
    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

    const getSlotBookings = (timeSlot) => {
        const dateToCheck = filterDate || '2025-05-12';
        return bookings.filter(b => {
            const bookingTime24 = b.time.split(' ')[0];
            return bookingTime24 === timeSlot && b.date === dateToCheck && b.status !== 'Cancelled';
        });
    };

    const getSlotStatus = (timeSlot) => {
        // Simple logic: Check if any booking matches this time AND matches the currently filtered date
        const dateToCheck = filterDate || '2025-05-12'; // Default to mock date if none selected

        // Mock matching: Our mock data has '09:00 AM' format, we'll try to match loosely
        // Real app would normalize this better.
        const booking = bookings.find(b => {
            // Convert '09:00 AM' to '09:00' for comparison or vice versa
            const bookingTime24 = b.time.split(' ')[0]; // '09:00'

            // Check Date match (assuming mock data is '2025-05-12')
            const isDateMatch = b.date === dateToCheck;

            return bookingTime24 === timeSlot && isDateMatch;
        });

        if (booking) {
            // Red if booked and NOT cancelled. Green if cancelled.
            return booking.status === 'Cancelled' ? 'available' : 'booked';
        }
        return 'available'; // Default Green
    };

    const handleReportUpload = (e) => {
        // Mock Upload
        if (!reportForm.patientName) return;
        const newReport = {
            id: uploadedReports.length + 1,
            fileName: reportForm.file ? reportForm.file.name : 'Scanned_Report.pdf',
            patient: reportForm.patientName,
            test: reportForm.testType || 'General',
            date: new Date().toISOString().split('T')[0],
            size: '1.5 MB',
            status: 'Pending Review'
        };
        setUploadedReports([newReport, ...uploadedReports]);
        setReportForm({ patientName: '', testType: '', file: null });
        showToast('Report uploaded successfully');
    };

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Notifications
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3500);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showToast = (msg) => setNotification(msg);

    const handleStatusUpdate = (id, newStatus) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        showToast(`Booking #${id} updated to ${newStatus}`);
    };

    const handleAddBooking = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newBooking = {
            id: `B${Math.floor(Math.random() * 1000 + 2000)}`,
            patient: formData.get('patientName'),
            test: formData.get('testType'),
            date: '2025-05-13',
            status: 'Confirmed',
            time: formData.get('timeSlot')
        };
        setBookings([newBooking, ...bookings]);
        setShowModal(null);
        showToast('New booking added to schedule');
    };

    const handleAddTest = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTest = {
            id: Date.now(),
            name: formData.get('testName'),
            price: formData.get('price'),
            stock: 'High',
            stockLevel: 100
        };
        setTests([...tests, newTest]);
        setShowModal(null);
        showToast('Inventory updated with new package');
    };

    // --- Renderers ---

    const renderOverview = () => (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Cards Section */}
            <div className="lad-stats-grid" style={{ marginBottom: '0', flexShrink: 0 }}>
                <div className="lad-stat-card">
                    <div className="lad-stat-header">
                        <span className="lad-stat-title">Today's Appointments</span>
                        <div className="lad-stat-icon-bg" style={{ background: '#dbeafe', color: '#1e40af' }}>≡ƒôà</div>
                    </div>
                    <h2 className="lad-stat-value">{stats.todayAppointments}</h2>
                    <div className="lad-stat-trend lad-trend-up">
                        <span>Γåæ 8 new today</span>
                    </div>
                </div>

                <div className="lad-stat-card">
                    <div className="lad-stat-header">
                        <span className="lad-stat-title">Pending Collections</span>
                        <div className="lad-stat-icon-bg" style={{ background: '#e0f2fe', color: '#0369a1' }}>≡ƒ⌐╕</div>
                    </div>
                    <h2 className="lad-stat-value">{stats.pendingCollections}</h2>
                    <div className="lad-stat-trend lad-trend-down">
                        <span>High Priority</span>
                    </div>
                </div>

                <div className="lad-stat-card">
                    <div className="lad-stat-header">
                        <span className="lad-stat-title">Tests In Progress</span>
                        <div className="lad-stat-icon-bg" style={{ background: '#eff6ff', color: '#2563eb' }}>≡ƒö¼</div>
                    </div>
                    <h2 className="lad-stat-value">{stats.testsInProgress}</h2>
                    <div className="lad-stat-trend" style={{ color: '#2563eb', fontWeight: 500 }}>
                        <span>Processing now</span>
                    </div>
                </div>

                <div className="lad-stat-card">
                    <div className="lad-stat-header">
                        <span className="lad-stat-title">Reports Generated</span>
                        <div className="lad-stat-icon-bg" style={{ background: '#f0f9ff', color: '#0ea5e9' }}>≡ƒôä</div>
                    </div>
                    <h2 className="lad-stat-value">{stats.reportsRate}%</h2>
                    <div className="lad-stat-trend lad-trend-up">
                        <span>Efficiency Rate</span>
                    </div>
                </div>
            </div>

            {/* Charts Section - Single Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flex: 1, minHeight: 0 }}>

                {/* Most Requested Tests */}
                <div className="lad-content" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="lad-section-header" style={{ marginBottom: '12px' }}>
                        <h3 className="lad-section-title">Common Tests</h3>
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mostRequestedTests} layout="vertical" margin={{ left: 0, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={60} style={{ fontSize: '0.7rem', fontWeight: 600 }} />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.75rem' }}
                                />
                                <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Appointment Trends */}
                <div className="lad-content" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="lad-section-header" style={{ marginBottom: '12px' }}>
                        <h3 className="lad-section-title">Trends</h3>
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={appointmentTrends} margin={{ left: -20 }}>
                                <defs>
                                    <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} interval={2} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.75rem' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAppt)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Appointment Status */}
                <div className="lad-content" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="lad-section-header" style={{ marginBottom: '12px' }}>
                        <h3 className="lad-section-title">Appt Status</h3>
                    </div>
                    <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={appointmentStatus}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    innerRadius={40}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {appointmentStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.75rem' }}
                                />
                                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '0.7rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Report Status */}
                <div className="lad-content" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="lad-section-header" style={{ marginBottom: '12px' }}>
                        <h3 className="lad-section-title">Reports</h3>
                    </div>
                    <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reportStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    paddingAngle={0}
                                >
                                    {reportStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '0.75rem' }}
                                />
                                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '0.7rem' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -65%)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>{stats.reportsRate}%</div>
                            <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Done</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

    const renderBookings = () => {
        const filteredBookings = bookings.filter(b => {
            const matchesDate = filterDate ? b.date === filterDate : true;
            const matchesStatus = filterStatus === 'All' ? true : b.status === filterStatus;
            const matchesSearch = b.patient.toLowerCase().includes(filterSearch.toLowerCase()) ||
                b.test.toLowerCase().includes(filterSearch.toLowerCase()) ||
                b.id.toLowerCase().includes(filterSearch.toLowerCase());
            return matchesDate && matchesStatus && matchesSearch;
        });

        return (
            <div className="lad-content" style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                <div className="lad-section-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 className="lad-section-title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>All Examinations</h3>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Manage appointments, updated status & prescriptions.</p>
                    </div>
                    <button className="lad-btn-primary" onClick={() => setShowModal('booking')}>+ New Appointment</button>
                </div>

                {/* Professional Filters Bar */}
                <div style={{ background: 'white', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>≡ƒöì</span>
                        <input
                            type="text"
                            placeholder="Search patient, test or ID..."
                            value={filterSearch}
                            onChange={(e) => setFilterSearch(e.target.value)}
                            className="lad-search-input"
                            style={{ width: '100%', paddingLeft: '40px', height: '42px', border: '1px solid #cbd5e1', borderRadius: '10px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Date:</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="lad-search-input"
                            style={{ width: 'auto', height: '42px', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ height: '42px', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 36px 0 12px', background: 'white', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Arrived">Arrived</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>

                    <button
                        onClick={() => { setFilterDate(''); setFilterStatus('All'); setFilterSearch(''); }}
                        style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline' }}
                    >
                        Clear
                    </button>
                </div>

                {/* Time Slot Availability Visualizer */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ≡ƒôà Slot Availability <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#64748b' }}>for {filterDate || 'Today'}</span>
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Seats per Slot:</label>
                            <input
                                type="number"
                                min="1" max="20"
                                value={slotCapacity}
                                onChange={(e) => setSlotCapacity(parseInt(e.target.value) || 1)}
                                style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                        {timeSlots.map(time => {
                            const slotBookings = getSlotBookings(time);
                            const bookedCount = slotBookings.length;
                            const isFull = bookedCount >= slotCapacity;

                            return (
                                <div key={time} style={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    background: '#f8fafc'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                                        <span>{time}</span>
                                        <span style={{ fontSize: '0.8rem', color: isFull ? '#ef4444' : '#15803d' }}>{bookedCount}/{slotCapacity}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {[...Array(slotCapacity)].map((_, i) => {
                                            const isBooked = i < bookedCount;
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        if (isBooked) {
                                                            // Cancel the booking corresponding to this seat
                                                            const bookingToCancel = slotBookings[i];
                                                            if (bookingToCancel && window.confirm('Cancel this booking?')) {
                                                                handleStatusUpdate(bookingToCancel.id, 'Cancelled');
                                                            }
                                                        } else {
                                                            // Book this seat
                                                            const newBooking = {
                                                                id: `B${Math.floor(Math.random() * 1000 + 2000)}`,
                                                                patient: 'Walk-in Patient',
                                                                test: 'General Checkup',
                                                                date: filterDate || '2025-05-12',
                                                                status: 'Confirmed',
                                                                time: `${time} ${parseInt(time) < 12 ? 'AM' : 'PM'}`,
                                                                prescriptionUrl: 'https://placehold.co/400x600?text=Walk-in'
                                                            };
                                                            setBookings(prev => [...prev, newBooking]);
                                                            showToast('Seat booked successfully');
                                                        }
                                                    }}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        background: isBooked ? '#ef4444' : '#22c55e',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.1s',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        border: '2px solid white'
                                                    }}
                                                    title={isBooked ? "Booked (Click to Cancel)" : "Available (Click to Book)"}
                                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%' }}></span> Available (Click to Book)</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }}></span> Booked (Click to Cancel)</div>
                    </div>
                </div>

                {/* Grid of Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {filteredBookings.length > 0 ? filteredBookings.map(booking => (
                        <div key={booking.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
                        >
                            {/* Header: ID and Status */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.9rem', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>#{booking.id}</span>
                                    <h4 style={{ margin: '8px 0 0', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{booking.patient}</h4>
                                </div>
                                <select
                                    className={`lad-status-badge status-${booking.status.toLowerCase().replace(' ', '-')}`}
                                    value={booking.status}
                                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        appearance: 'none',
                                        textAlign: 'center',
                                        minWidth: '100px'
                                    }}
                                >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Arrived">Arrived</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                                    <span>≡ƒôà {booking.date} at {booking.time}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Test:</span>
                                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                                        {booking.test}
                                    </span>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                    onClick={() => setViewPrescription(booking)}
                                    style={{ flex: 1, border: '1px solid #e2e8f0', background: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                    ≡ƒôä Rx View
                                </button>
                                <button
                                    className="lad-btn-primary"
                                    style={{ flex: 1, fontSize: '0.9rem', padding: '8px' }}
                                >
                                    View Result
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#64748b', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            No appointments found matching your filters.
                        </div>
                    )}
                </div>

                {/* Prescription Modal */}
                {viewPrescription && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                        <div style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Prescription: {viewPrescription.patient}</h3>
                                <button onClick={() => setViewPrescription(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                            </div>
                            <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', background: '#f8fafc' }}>
                                <img src={viewPrescription.prescriptionUrl} alt="Prescription" style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            </div>
                            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button onClick={() => setViewPrescription(null)} className="lad-btn-ghost">Close</button>
                                <button className="lad-btn-primary">Download</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderTests = () => (
        <div className="lad-content" style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
            <div className="lad-section-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h3 className="lad-section-title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Inventory & Tests</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Track reagents, test kits, and lab supplies.</p>
                </div>
                <button className="lad-btn-primary" onClick={() => setShowModal('test')}>+ Add New Item</button>
            </div>

            {/* Modern List View */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tests.map(test => (
                    <div key={test.id} style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        transition: 'background-color 0.2s ease',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        {/* Info */}
                        <div style={{ minWidth: '200px' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>{test.category}</span>
                            <h3 style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{test.name}</h3>
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', gap: '48px', flex: 1 }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>Quantity</div>
                                <div style={{ fontWeight: 600, color: '#334155' }}>{test.quantity} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#94a3b8' }}>units</span></div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>Expiry</div>
                                <div style={{ fontWeight: 600, color: '#334155' }}>{test.expiry}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>Status</div>
                                <span style={{
                                    color: test.stockLevel < 30 ? '#ef4444' : test.stockLevel < 50 ? '#d97706' : '#15803d',
                                    fontWeight: 700,
                                    fontSize: '0.9rem'
                                }}>
                                    {test.status}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', minWidth: '350px', justifyContent: 'flex-end' }}>
                            <div style={{ width: '140px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                                    <span>Stock</span>
                                    <span>{test.stockLevel}%</span>
                                </div>
                                <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${test.stockLevel}%`, backgroundColor: test.stockLevel < 30 ? '#ef4444' : test.stockLevel < 50 ? '#f59e0b' : '#2563eb', height: '100%', borderRadius: '3px' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="lad-btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Edit</button>
                                <button className="lad-btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Restock</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="lad-content">
            <div className="lad-section-header">
                <h3 className="lad-section-title">Diagnostic Reports</h3>
            </div>

            {/* Enhanced Upload Section */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>≡ƒôä Upload Patient Result</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b' }}>Attach PDF results with patient details.</p>
                </div>

                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '32px' }}>
                    {/* Droppable Area */}
                    <div style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '32px',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: '100%'
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>Γÿü∩╕Å</div>
                        <div style={{ fontWeight: 600, color: '#334155' }}>Click to Browse or Drag PDF</div>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setReportForm({ ...reportForm, file: e.target.files[0] })}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="lad-btn-outline" style={{ marginTop: '16px', cursor: 'pointer' }}>Select PDF</label>
                        {reportForm.file && <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#2563eb', fontWeight: 600 }}>selected: {reportForm.file.name}</div>}
                    </div>

                    {/* Metadata Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Patient Name</label>
                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={reportForm.patientName}
                                onChange={(e) => setReportForm({ ...reportForm, patientName: e.target.value })}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Test Type</label>
                            <select
                                value={reportForm.testType}
                                onChange={(e) => setReportForm({ ...reportForm, testType: e.target.value })}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: 'white' }}
                            >
                                <option value="">Select Test...</option>
                                <option value="Complete Blood Count">Complete Blood Count</option>
                                <option value="Lipid Profile">Lipid Profile</option>
                                <option value="Thyroid Panel">Thyroid Panel</option>
                                <option value="General Checkup">General Checkup</option>
                            </select>
                        </div>
                        <button
                            className="lad-btn-primary"
                            onClick={handleReportUpload}
                            style={{ marginTop: '8px', padding: '12px' }}
                        >
                            Upload & Save Report
                        </button>
                    </div>
                </div>
            </div>

            <h4 style={{ margin: '1rem 0 16px', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                All Patient Reports <span style={{ background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{uploadedReports.length}</span>
            </h4>

            {/* Reports List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {uploadedReports.map(report => (
                    <div key={report.id} style={{
                        padding: '16px 20px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        transition: 'transform 0.1s'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}>PDF</div>
                            <div>
                                <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{report.fileName}</h4>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    Patient: <span style={{ fontWeight: 600, color: '#334155' }}>{report.patient}</span> ΓÇó {report.test}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2px' }}>Uploaded</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{report.date}</div>
                            </div>
                            <div style={{ textAlign: 'center', width: '100px' }}>
                                <span style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    background: report.status === 'Verified' ? '#dcfce7' : '#fef9c3',
                                    color: report.status === 'Verified' ? '#15803d' : '#a16207'
                                }}>
                                    {report.status}
                                </span>
                            </div>
                            <button className="lad-btn-outline" style={{ padding: '8px 12px' }}>Download</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSchedule = () => {
        // dynamic filters
        const roles = ['All', 'Pathologist', 'Technician', 'Phlebotomist', 'Microbiologist', 'Assistant'];

        const filteredStaff = selectedRole === 'All'
            ? technicians
            : technicians.filter(t => t.role && t.role.includes(selectedRole));

        const handleSaveStaff = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const staffData = {
                id: editingStaff ? editingStaff.id : technicians.length + 1,
                name: formData.get('name'),
                role: formData.get('role'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                shift: formData.get('shift'),
                shiftTime: formData.get('shiftTime'),
                status: formData.get('status'),
                avatar: '≡ƒæ¿ΓÇìΓÜò∩╕Å' // Default for now
            };

            if (editingStaff) {
                setTechnicians(prev => prev.map(tech => tech.id === editingStaff.id ? { ...tech, ...staffData } : tech));
                showToast(`Updated staff: ${staffData.name}`);
            } else {
                setTechnicians(prev => [...prev, { ...staffData, id: prev.length + 1, joined: new Date().toISOString().split('T')[0] }]);
                showToast(`Added new staff: ${staffData.name}`);
            }
            setStaffModal(null);
            setEditingStaff(null);
        };

        const getStaffLeaves = (id) => staffLeaves.filter(l => l.staffId === id);

        return (
            <div className="lad-content">
                <div className="lad-section-header" style={{ marginBottom: '24px' }}>
                    <div>
                        <h3 className="lad-section-title">Staff Directory & Shifts</h3>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>Manage personnel, view active shifts, and contact details.</p>
                    </div>
                    <button className="lad-btn-primary" onClick={() => { setEditingStaff(null); setStaffModal('add'); }}>+ Add Staff Member</button>
                </div>

                {/* Role Categories / Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '24px',
                                border: 'none',
                                background: selectedRole === role ? '#2563eb' : 'white',
                                color: selectedRole === role ? 'white' : '#64748b',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: selectedRole === role ? '0 4px 6px -1px rgba(37, 99, 235, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            {role === 'All' ? 'All Staff' : role + 's'}
                        </button>
                    ))}
                </div>

                {/* Unique List View Style */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredStaff.map(tech => (
                        <div key={tech.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            borderLeft: `6px solid ${tech.status === 'Available' ? '#22c55e' : tech.status === 'Off Duty' ? '#cbd5e1' : '#3b82f6'}`,
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'transform 0.2s',
                            gap: '24px'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(6px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: '#f1f5f9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    border: '2px solid white',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                }}>
                                    {tech.avatar}
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{tech.name}</h3>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{tech.role}</span>
                                        <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{tech.shift} Shift</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flex: 2, justifyContent: 'flex-end' }}>
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Contact</span>
                                        <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{tech.phone}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Hours</span>
                                        <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{tech.shiftTime}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Status</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            color: tech.status === 'Available' ? '#15803d' : tech.status === 'Off Duty' ? '#64748b' : '#1e40af',
                                            padding: '2px 8px',
                                            background: tech.status === 'Available' ? '#dcfce7' : tech.status === 'Off Duty' ? '#f1f5f9' : '#dbeafe',
                                            borderRadius: '12px',
                                            display: 'inline-block',
                                            textAlign: 'center'
                                        }}>
                                            {tech.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ height: '40px', width: '1px', background: '#e2e8f0' }}></div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="lad-btn-outline"
                                        onClick={() => { setEditingStaff(tech); setStaffModal('edit'); }}
                                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="lad-btn-primary"
                                        onClick={() => setViewLeaves(tech)}
                                        style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1' }}
                                    >
                                        Leaves
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Staff Modal (Add/Edit) */}
                {staffModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                        <form onSubmit={handleSaveStaff} style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '600px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 24px', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{staffModal === 'add' ? 'Add New Staff Member' : 'Edit Staff Details'}</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Full Name</label>
                                    <input name="name" defaultValue={editingStaff?.name} required placeholder="Dr. John Doe" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Role / Designation</label>
                                    <select name="role" defaultValue={editingStaff?.role || 'Pathologist'} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                                        {roles.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Email Address</label>
                                    <input name="email" type="email" defaultValue={editingStaff?.email} required placeholder="john@medibot.com" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Phone Number</label>
                                    <input name="phone" defaultValue={editingStaff?.phone} required placeholder="+1 555-0000" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Shift Type</label>
                                    <select name="shift" defaultValue={editingStaff?.shift || 'Morning'} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                                        <option value="Morning">Morning</option>
                                        <option value="Afternoon">Afternoon</option>
                                        <option value="Night">Night</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Working Hours</label>
                                    <input name="shiftTime" defaultValue={editingStaff?.shiftTime || '09:00 - 17:00'} placeholder="e.g. 09:00 - 17:00" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Current Status</label>
                                    <select name="status" defaultValue={editingStaff?.status || 'Available'} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}>
                                        <option value="Available">Available (On Duty)</option>
                                        <option value="In Lab">Busy (In Lab)</option>
                                        <option value="Off Duty">Off Duty</option>
                                        <option value="On Leave">On Leave</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setStaffModal(null)} className="lad-btn-ghost">Cancel</button>
                                <button type="submit" className="lad-btn-primary">Save Staff Details</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* View Leaves Modal */}
                {viewLeaves && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                        <div style={{ background: 'white', borderRadius: '20px', width: '90%', maxWidth: '500px', padding: '0', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                            <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Leave Management</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{viewLeaves.name} ΓÇó {viewLeaves.role}</p>
                                </div>
                                <button onClick={() => setViewLeaves(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>Recent & Upcoming Leaves</h4>
                                    <button
                                        className="lad-btn-outline"
                                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                        onClick={() => {
                                            const reason = prompt("Enter leave reason:");
                                            if (reason) {
                                                const newLeave = {
                                                    id: Date.now(),
                                                    staffId: viewLeaves.id,
                                                    type: 'Casual',
                                                    startDate: new Date().toISOString().split('T')[0],
                                                    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                                    status: 'Approved',
                                                    reason: reason
                                                };
                                                setStaffLeaves(prev => [...prev, newLeave]);
                                                setTechnicians(prev => prev.map(t => t.id === viewLeaves.id ? { ...t, status: 'On Leave' } : t));
                                                showToast('Leave recorded and staff status set to On Leave.');
                                            }
                                        }}
                                    >
                                        + Record Leave
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {getStaffLeaves(viewLeaves.id).length > 0 ? getStaffLeaves(viewLeaves.id).map(leave => (
                                        <div key={leave.id} style={{
                                            padding: '16px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#fff'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>{leave.type} Leave</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{leave.startDate} to {leave.endDate}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>"{leave.reason}"</div>
                                            </div>
                                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    background: leave.status === 'Approved' ? '#dcfce7' : '#fef9c3',
                                                    color: leave.status === 'Approved' ? '#15803d' : '#a16207'
                                                }}>
                                                    {leave.status}
                                                </span>
                                                <button
                                                    style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                                                    onClick={() => {
                                                        const confirmRetract = window.confirm('Are you sure you want to retract this leave? This will set the staff member status to "Available".');
                                                        if (confirmRetract) {
                                                            setTechnicians(prev => prev.map(t => t.id === viewLeaves.id ? { ...t, status: 'Available' } : t));
                                                            setStaffLeaves(prev => prev.filter(l => l.id !== leave.id));
                                                            showToast('Leave retracted and staff status set to Available.');
                                                        }
                                                    }}
                                                >
                                                    Retract
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontStyle: 'italic' }}>
                                            No leave history found for this staff member.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderSettings = () => (
        <div className="lad-content">
            <div className="lad-section-header">
                <div>
                    <h3 className="lad-section-title">Lab Management Settings</h3>
                    <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Configure laboratory operations and preferences.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontWeight: 600 }}>Operating Hours</h4>
                        <span style={{ fontSize: '1.2rem' }}>ΓÅ░</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>Set your daily opening and closing times.</p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                        <div className="lad-badge" style={{ background: '#f1f5f9', color: '#334155' }}>08:00 AM</div>
                        <span>to</span>
                        <div className="lad-badge" style={{ background: '#f1f5f9', color: '#334155' }}>08:00 PM</div>
                    </div>
                    <button className="lad-btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>Update Hours</button>
                </div>

                <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontWeight: 600 }}>Automated Messages</h4>
                        <span style={{ fontSize: '1.2rem' }}>≡ƒÆ¼</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>Manage SMS and Email templates for patients.</p>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '4px' }}>Booking Confirmed</span>
                        <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#dbeafe', color: '#1e40af', borderRadius: '4px' }}>Report Ready</span>
                    </div>
                    <button className="lad-btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>Edit Templates</button>
                </div>

                <div style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontWeight: 600 }}>Equipment Status</h4>
                        <span style={{ fontSize: '1.2rem' }}>≡ƒö¼</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>Monitor maintenance schedules for lab devices.</p>
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Centrifuge C-1</span>
                            <span style={{ color: '#16a34a' }}>Good</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Analyzer X200</span>
                            <span style={{ color: '#ca8a04' }}>Maintenance Due</span>
                        </div>
                    </div>
                    <button className="lad-btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>View Maintenance Log</button>
                </div>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="lad-content">
            <div className="lad-section-header">
                <h3 className="lad-section-title">Admin Profile</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>
                {/* Profile Card */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ height: '100px', background: '#2563eb' }}></div>
                    <div style={{ padding: '0 24px 24px', textAlign: 'center', marginTop: '-40px' }}>
                        <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>AS</div>
                        </div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>{currentUser.name}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>{currentUser.role}</p>

                        <div style={{ marginTop: '24px', textAlign: 'left' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>License Number</label>
                                <div style={{ color: '#334155', fontWeight: 500 }}>{currentUser.license}</div>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Department</label>
                                <div style={{ color: '#334155', fontWeight: 500 }}>{currentUser.department}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Email</label>
                                <div style={{ color: '#334155', fontWeight: 500 }}>{currentUser.email}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Account Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="lad-form-group">
                            <label>Display Name</label>
                            <input type="text" defaultValue={currentUser.name} className="lad-search-input" style={{ width: '100%' }} />
                        </div>
                        <div className="lad-form-group">
                            <label>Official Email</label>
                            <input type="email" defaultValue={currentUser.email} className="lad-search-input" style={{ width: '100%' }} />
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '10px' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>Security</h4>
                            <button className="lad-btn-outline" style={{ marginRight: '12px' }}>Reset Password</button>
                            <button className="lad-btn-outline" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }} onClick={handleLogout}>Log Out Everywhere</button>
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="lad-btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Laboratory Details Section */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: 0 }}>Laboratory Details</h3>
                    {!isEditingLab ? (
                        <button
                            onClick={() => { setTempLabDetails(labDetails); setIsEditingLab(true); }}
                            className="lad-btn-outline"
                            style={{ fontSize: '0.85rem' }}
                        >
                            Γ£Å∩╕Å Edit Details
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsEditingLab(false)}
                                className="lad-btn-ghost"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { setLabDetails(tempLabDetails); setIsEditingLab(false); showToast('Lab details updated successfully'); }}
                                className="lad-btn-primary"
                            >
                                Save Details
                            </button>
                        </div>
                    )}
                </div>

                {!isEditingLab ? (
                    // View Mode
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', alignItems: 'center' }}>
                        <div style={{
                            width: '100px', height: '100px',
                            background: '#f1f5f9', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid #e2e8f0', overflow: 'hidden'
                        }}>
                            {labDetails.logo ? (
                                <img src={URL.createObjectURL(labDetails.logo)} alt="Lab Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem' }}>≡ƒÅÑ</span>
                            )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lab Name</label>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>{labDetails.name}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified License</label>
                                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {labDetails.license} <span style={{ color: '#16a34a' }}>Γ£ö∩╕Å</span>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</label>
                                <div style={{ fontSize: '1rem', color: '#334155' }}>{labDetails.address}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Number</label>
                                <div style={{ fontSize: '1rem', color: '#334155' }}>{labDetails.contact}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <div style={{
                                    width: '100px', height: '100px',
                                    background: '#f1f5f9', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px dashed #cbd5e1', overflow: 'hidden'
                                }}>
                                    {tempLabDetails.logo ? (
                                        <img src={URL.createObjectURL(tempLabDetails.logo)} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '2rem', opacity: 0.5 }}>≡ƒô╖</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="logo-upload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => e.target.files[0] && setTempLabDetails({ ...tempLabDetails, logo: e.target.files[0] })}
                                />
                                <label htmlFor="logo-upload" className="lad-btn-outline" style={{ fontSize: '0.75rem', padding: '4px 8px', cursor: 'pointer' }}>Change Logo</label>
                            </div>

                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="lad-form-group">
                                    <label>Lab Name</label>
                                    <input
                                        value={tempLabDetails.name}
                                        onChange={(e) => setTempLabDetails({ ...tempLabDetails, name: e.target.value })}
                                        className="lad-search-input"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="lad-form-group">
                                    <label>Verified License No.</label>
                                    <input
                                        value={tempLabDetails.license}
                                        onChange={(e) => setTempLabDetails({ ...tempLabDetails, license: e.target.value })}
                                        className="lad-search-input"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="lad-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Address</label>
                                    <input
                                        value={tempLabDetails.address}
                                        onChange={(e) => setTempLabDetails({ ...tempLabDetails, address: e.target.value })}
                                        className="lad-search-input"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="lad-form-group">
                                    <label>Contact Number</label>
                                    <input
                                        value={tempLabDetails.contact}
                                        onChange={(e) => setTempLabDetails({ ...tempLabDetails, contact: e.target.value })}
                                        className="lad-search-input"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // --- Modals ---
    const BookingModal = () => (
        <div className="lad-modal-overlay" onClick={() => setShowModal(null)}>
            <div className="lad-modal" onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>New Appointment</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Enter patient details to schedule a new test.</p>
                <form onSubmit={handleAddBooking}>
                    <div className="lad-form-group">
                        <label>Patient Full Name</label>
                        <input name="patientName" type="text" className="lad-search-input" style={{ width: '100%' }} required placeholder="e.g. John Doe" />
                    </div>
                    <div className="lad-form-group">
                        <label>Test Package</label>
                        <select name="testType" className="lad-search-input" style={{ width: '100%' }}>
                            {tests.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="lad-form-group">
                        <label>Preferred Time</label>
                        <input name="timeSlot" type="time" className="lad-search-input" style={{ width: '100%' }} required defaultValue="09:00" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" className="lad-btn-ghost" onClick={() => setShowModal(null)}>Cancel</button>
                        <button type="submit" className="lad-btn-primary">Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const TestModal = () => (
        <div className="lad-modal-overlay" onClick={() => setShowModal(null)}>
            <div className="lad-modal" onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>New Test Package</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Add a new diagnostic test to the inventory.</p>
                <form onSubmit={handleAddTest}>
                    <div className="lad-form-group">
                        <label>Package Name</label>
                        <input name="testName" type="text" className="lad-search-input" style={{ width: '100%' }} required placeholder="e.g. Complete Metabolic Panel" />
                    </div>
                    <div className="lad-form-group">
                        <label>Base Price ($)</label>
                        <input name="price" type="number" className="lad-search-input" style={{ width: '100%' }} required placeholder="0.00" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" className="lad-btn-ghost" onClick={() => setShowModal(null)}>Cancel</button>
                        <button type="submit" className="lad-btn-primary">Save Package</button>
                    </div>
                </form>
            </div>
        </div>
    );

    // --- PIN LOCK RENDER ---
    if (loadingPin) {
        return <div className="loading-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Secure Profile...</div>;
    }

    if (!pinVerified) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(255,255,255,0.95)', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', backdropFilter: 'blur(10px)'
            }}>
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem' }}>≡ƒöÆ</div>
                    <h2 style={{ color: '#0F172A', marginTop: '10px' }}>Security Check</h2>
                    <p style={{ color: '#64748B' }}>Enter your 4-letter pass key to unlock dashboard.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                    {enteredPin.map((digit, index) => (
                        <input
                            key={index}
                            id={`dash-pin-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handlePinInput(e.target, index)}
                            onKeyDown={(e) => handlePinKeyDown(e, index)}
                            style={{
                                width: '50px', height: '50px', fontSize: '24px', textAlign: 'center',
                                borderRadius: '12px', border: '2px solid #E2E8F0', outline: 'none',
                                fontWeight: 'bold', color: '#0F172A', textTransform: 'uppercase',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                        />
                    ))}
                </div>

                {pinError && <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: '16px' }}>{pinError}</p>}

                <button onClick={handleLogout} style={{
                    marginTop: '20px', background: 'transparent', border: 'none', color: '#64748b',
                    fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline'
                }}>
                    Cancel & Logout
                </button>
            </div>
        );
    }

    return (
        <div className="lad-container">
            {/* Sidebar */}
            <aside className="lad-sidebar">
                <div className="lad-brand">
                    <img src={logoImage} alt="Logo" className="lad-brand-logo" />
                    <span className="lad-brand-text">MediBot<br /><span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#bfdbfe', letterSpacing: '0.5px' }}>Admin Portal</span></span>
                </div>

                <ul className="lad-menu">
                    {[
                        { id: 'overview', icon: '≡ƒôè', label: 'Dashboard' },
                        { id: 'bookings', icon: '≡ƒôà', label: 'Appointments' },
                        { id: 'tests', icon: '≡ƒº¬', label: 'Inventory' },
                        { id: 'reports', icon: '≡ƒôä', label: 'Reports' },
                        { id: 'schedule', icon: '≡ƒæÑ', label: 'Staff' },
                        { id: 'settings', icon: 'ΓÜÖ∩╕Å', label: 'Settings' }
                    ].map(item => (
                        <li key={item.id}>
                            <div
                                className={`lad-menu-link ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="lad-menu-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="lad-sidebar-footer">
                    <button className="lad-logout-btn" onClick={handleLogout}>
                        <span>ΓÅÅ Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lad-main">
                <header className="lad-header">
                    <div className="lad-greeting">
                        <h1>Good Morning, {currentUser.name.split(' ')[2]}!</h1>
                        <span className="lad-date">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        <button
                            style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.7, position: 'relative' }}
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            ≡ƒöö
                            <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
                        </button>

                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: '100px',
                                width: '300px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                zIndex: 50,
                                overflow: 'hidden'
                            }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Notifications</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#0d9488', cursor: 'pointer' }}>Clear all</span>
                                </div>
                                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    {notifications.map(n => (
                                        <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '12px', alignItems: 'start', cursor: 'pointer' }} className="hover:bg-gray-50">
                                            <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
                                                {n.type === 'alert' ? '≡ƒö┤' : '≡ƒö╡'}
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#334155', lineHeight: '1.4' }}>{n.message}</p>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{n.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}



                        <div
                            className="lad-profile-card"
                            style={{ cursor: 'pointer', marginLeft: '1rem' }}
                            onClick={() => setActiveTab('profile')}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{currentUser.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{currentUser.role}</div>
                            </div>
                            <div className="lad-avatar">AS</div>
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'bookings' && renderBookings()}
                    {activeTab === 'tests' && renderTests()}
                    {activeTab === 'reports' && renderReports()}
                    {activeTab === 'schedule' && renderSchedule()}
                    {activeTab === 'settings' && renderSettings()}
                    {activeTab === 'profile' && renderProfile()}
                </div>

            </main>

            {/* Overlays */}
            {showModal === 'booking' && <BookingModal />}
            {showModal === 'test' && <TestModal />}

            {notification && (
                <div style={{
                    position: 'fixed', bottom: '30px', right: '30px',
                    background: '#111827', color: 'white', padding: '1rem 2rem',
                    borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    zIndex: 200
                }}>
                    <span style={{ fontSize: '1.2rem' }}>Γ£à</span>
                    <span style={{ fontWeight: 600 }}>{notification}</span>
                </div>
            )}
        </div>
    );
};

export default LabAdminDashboard;
