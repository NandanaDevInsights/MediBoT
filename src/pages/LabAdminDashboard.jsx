
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabAdminDashboard.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import logoImage from '../assets/Logo.png';


// --- Icons (SVGs) for Professional Look ---
const Icons = {
    Dashboard: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
    Calendar: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
    ),
    TestTube: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01v0a2.83 2.83 0 0 1 0-4L17 3" /><path d="m16 2 6 6" /><path d="M12 16H4" /></svg>
    ),
    Users: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    FileText: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
    ),
    Stethoscope: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.8 2.3A.3.3 0 0 1 5 2h14a.3.3 0 0 1 .2.3v3.4a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V2" /><path d="M12 2v5a7 7 0 0 1-14 0V5a3 3 0 0 1-3 3v0a3 3 0 0 1-3-3V2" /><path d="M12 7v4a5 5 0 0 0 5 5h0a5 5 0 0 0 5-5V7" /><circle cx="12" cy="20" r="2" /></svg>
    ),
    CreditCard: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
    ),
    Settings: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
    Bell: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
    ),
    Search: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    Flask: (props) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 2v7.31" /><path d="M14 2v7.31" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>
    ),
    UploadCloud: (props) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>
    ),
    Download: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
    ),
    Eye: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
    X: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    ),
    Home: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    Menu: (props) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
    ),
    ChevronDown: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9" /></svg>
    ),
    Check: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>
    ),
    Share: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
    ),
    CheckCircle: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
    Filter: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
    ),
    Trash: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
    ),
    Link: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
    ),
    User: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    Phone: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    ),
    Activity: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
    ),
    Clock: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
    LogOut: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
    ),
    ChevronUp: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="18 15 12 9 6 15" /></svg>
    ),
    Plus: (props) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
    ),
    AlertTriangle: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
    ),
    TrendingUp: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
    ),
    ChevronRight: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6" /></svg>
    ),
    ClockSmall: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
    AlertOctagon: (props) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
    ),
    MoreVertical: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
    ),
    Loader: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
    ),
    Star: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    ),
    MessageSquare: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    ),
    CalendarCheck: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
    ),
    ToggleLeft: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="12" x="2" y="6" rx="6" /><circle cx="8" cy="12" r="2" /></svg>
    ),
    ToggleRight: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="12" x="2" y="6" rx="6" /><circle cx="16" cy="12" r="2" /></svg>
    )
};

const CountUp = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);
    return <span>{count}</span>;
};

const LabAdminDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('Overview');
    const [appointments, setAppointments] = useState([]);
    const [testOrders, setTestOrders] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [reports, setReports] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [stats, setStats] = useState({
        appointmentsToday: 0,
        pendingOrders: 0,
        reportsGenerated: 0,
        activeStaff: 0,
        dailyStats: [] // For graph
    });

    // --- Search & Filter State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [appointmentFilter, setAppointmentFilter] = useState('All'); // Status: All, Pending, Completed, etc.
    const [dateFilter, setDateFilter] = useState('Today'); // New Default: Today
    const [paymentDateFilter, setPaymentDateFilter] = useState('All Time'); // Payment specific filter

    // --- Advanced Filter State ---
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        testType: '',
        technician: '',
        isDelayed: false
    });

    // --- Modals State ---
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [isSavingStaff, setIsSavingStaff] = useState(false); // New loading state
    const [newStaff, setNewStaff] = useState({
        // 1. Basic Info
        name: '', gender: 'Male', dob: '', phone: '', email: '', address: '', photo: null, photoPreview: null,
        // 2. Employment
        staffId: `STA-${Math.floor(1000 + Math.random() * 9000)}`, role: '', department: '', type: 'Full-time', joiningDate: new Date().toISOString().split('T')[0], experience: '',
        // 3. Shift
        shift: 'Morning', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '9:00 AM - 5:00 PM', homeCollection: false, maxOrders: '',
        // 5. Skills
        specializations: [], handlingCapability: [], licenseNumber: '',
        // 6. Documents
        documents: [],
        // 7. Emergency
        emergencyName: '', emergencyRelation: '', emergencyPhone: '',
        // 8. Notes
        internalNotes: '', tags: []
    });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({ patient_id: '', test_name: '', file: null });
    const [profileData, setProfileData] = useState({ lab_name: '', address: '', contact: '', admin_name: '', email: '' });

    // --- Bill Modal State ---
    const [showBillModal, setShowBillModal] = useState(false);
    const [selectedPaymentBill, setSelectedPaymentBill] = useState(null);

    // --- UI State ---
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationsList, setNotificationsList] = useState([]);
    const [notification, setNotification] = useState(null);
    const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
    const [patientHistory, setPatientHistory] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeReportTab, setActiveReportTab] = useState('Uploaded');
    const [activeReportFilter, setActiveReportFilter] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // --- Test Orders State ---
    const [orderFilter, setOrderFilter] = useState('All');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);

    // New Smart Filter States
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
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

    // Status Update Modal State
    const [staffFilter, setStaffFilter] = useState('All');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusUpdateAppointment, setStatusUpdateAppointment] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    // --- Settings States ---
    const [labSettings, setLabSettings] = useState({
        workingHours: { start: '08:00', end: '20:00' },
        workingDays: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false },
        holidays: [],
        tests: [
            { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', enabled: true },
            { id: 2, name: 'Lipid Profile', category: 'Biochemistry', enabled: true },
            { id: 3, name: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormones', enabled: true },
            { id: 4, name: 'Liver Function Test (LFT)', category: 'Biochemistry', enabled: false },
            { id: 5, name: 'Kidney Function Test (KFT)', category: 'Biochemistry', enabled: true },
        ],
        feedback: [
            { id: 1, patient: 'Rahul Sharma', rating: 5, comment: 'Excellent service and very professional staff.', date: '2024-03-24', category: 'General' },
            { id: 2, patient: 'Anita Desai', rating: 4, comment: 'Clean facility, reports were slightly delayed.', date: '2024-03-25', category: 'Facility' },
            { id: 3, patient: 'Suresh Iyer', rating: 5, comment: 'Best lab in the area. Very accurate results.', date: '2024-03-26', category: 'Accuracy' },
        ]
    });

    const [feedbackFilter, setFeedbackFilter] = useState({ rating: 'All', date: 'All' });
    const [activeSettingsTab, setActiveSettingsTab] = useState('Feedback');

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
                    console.warn("Dashboard: Backend auth check failed (401/403). ProtectedRoute will handle redirect.");
                    // Don't redirect here - ProtectedRoute already handles it
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    // Set Profile Data immediately
                    setProfileData(prev => ({
                        ...prev,
                        admin_name: data.admin_name || data.email?.split('@')[0] || 'Admin',
                        email: data.email || '',
                        lab_name: data.lab_name || '',
                        address: data.address || '',
                        contact: data.contact || ''
                    }));
                }
            } catch (err) {
                console.error("Auth Check Failed:", err);
                // Don't redirect - let ProtectedRoute handle it
            }
        };
        checkAuth();
    }, []);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications && !event.target.closest('.med-dropdown-menu.notifications') && !event.target.closest('.med-icon-btn[title="Notifications"]')) {
                setShowNotifications(false);
            }
            if (showProfileMenu && !event.target.closest('.med-dropdown-menu.profile') && !event.target.closest('.med-profile-trigger')) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications, showProfileMenu]);

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
                        // Strict filter for Royal Clinical Laboratory
                        const filtered = data.filter(a =>
                            (a.labName && a.labName.includes('Royal')) ||
                            (a.location && a.location.toLowerCase().includes('kanjirapally'))
                        );
                        setAppointments(filtered);
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
                if (activeSection === 'Appointments' || activeSection === 'Payments') url = 'http://localhost:5000/api/admin/appointments';
                if (activeSection === 'Test Orders') url = 'http://localhost:5000/api/admin/test-orders';
                if (activeSection === 'Lab Staff') url = 'http://localhost:5000/api/admin/staff';
                if (url || activeSection === 'Reports') {
                    const fetchUrl = activeSection === 'Reports' ? 'http://localhost:5000/api/admin/patients' : url;
                    const res = await fetch(fetchUrl, { credentials: 'include' });
                    if (res.status === 401 || res.status === 403) {
                        navigate('/admin/login');
                        return;
                    }
                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.message || 'Fetch failed');
                    }

                    const data = await res.json();

                    if ((activeSection === 'Appointments' || activeSection === 'Payments') && Array.isArray(data)) {
                        setAppointments(data);
                    }
                    if (activeSection === 'Test Orders' && Array.isArray(data)) setTestOrders(data);
                    if (activeSection === 'Lab Staff' && Array.isArray(data)) {
                        const sanitizedStaff = data.map(s => ({
                            ...s,
                            workingDays: Array.isArray(s.workingDays) ? s.workingDays.join(', ') : (s.workingDays || ''),
                            specializations: Array.isArray(s.specializations) ? s.specializations.join(', ') : (s.specializations || ''),
                            documents: Array.isArray(s.documents) ? s.documents.join(', ') : (s.documents || '')
                        }));
                        setStaff(sanitizedStaff);
                    }
                    if (activeSection === 'Reports' && Array.isArray(data)) setPatients(data); // Reusing patients state for Booked Users view
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
                if (activeSection === 'Lab Staff') setLoadingStaff(false);
            } catch (err) {
                console.error(err);
                if (activeSection === 'Lab Staff') setLoadingStaff(false);
                if (activeSection !== 'Settings') showToast(err.message || `Failed to load ${activeSection}`, "error");
            }
        };

        if (activeSection === 'Lab Staff') setLoadingStaff(true);

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

    // Fetch Patients for Upload Modal if not already loaded
    useEffect(() => {
        if (showUploadModal && patients.length === 0) {
            fetch('http://localhost:5000/api/admin/patients', { credentials: 'include' })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setPatients(data);
                })
                .catch(err => console.error("Failed to fetch patients for upload dropdown", err));
        }
    }, [showUploadModal, patients.length]);

    // Update notifications list based on pending appointments
    // Generate Notifications based on real events app + Mock categories
    useEffect(() => {
        // Always generate mocks + real data integration
        const newNotifs = [];

        // 1. Action Required (Yellow) - Pending Appointments
        const pending = appointments.filter(a => a.status === 'Pending').slice(0, 2);
        pending.forEach(a => {
            newNotifs.push({
                id: `notif-${a.id}`,
                type: 'action', // Yellow
                title: 'Action Required',
                message: `Pending test approval for ${a.patient}.`,
                time: '10 mins ago',
                read: false
            });
        });

        // 2. Informational (Green) - New Bookings
        const recent = appointments.slice(0, 1);
        recent.forEach(a => {
            newNotifs.push({
                id: `new-${a.id}`,
                type: 'info', // Green
                title: 'New Booking',
                message: `New booking received from ${a.patient}.`,
                time: 'Just now',
                read: false
            });
        });

        // 3. Urgent (Red) - Mock
        newNotifs.push({
            id: 'urgent-1',
            type: 'urgent', // Red
            title: 'Urgent Alert',
            message: 'Sample rejection: Kit #402 failing QC.',
            time: '1 hr ago',
            read: false
        });

        // 4. System (Blue) - Mock
        newNotifs.push({
            id: 'sys-1',
            type: 'system', // Blue
            title: 'System Update',
            message: 'Daily backup completed successfully.',
            time: '2 hrs ago',
            read: false
        });

        // Set notifications ensuring we don't overwrite read status if using complex persistent logic
        // For this localized version, we just reset list on appointments change but try to preserve mocks?
        // Actually, simple reset is fine for this context.
        setNotificationsList(newNotifs);

    }, [appointments]); // Only re-run when appointments change

    const markAsRead = (id) => {
        setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    };

    const showToast = (message, type = 'success') => {
        setNotification({ message, type });
    };

    // --- Count Helper Functions (for KPI cards) ---
    const countStatus = (status) => appointments.filter(a => a.status === status).length;
    const countToday = () => {
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter(a => a.date === today).length;
    };
    const countDelayed = () => appointments.filter(a => a.isDelayed || a.status === 'Pending').length;
    const countCompleted = () => appointments.filter(a => a.status === 'Completed').length;

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
        // Extract numeric ID - could be just a number, or have 'A-' prefix
        const numericId = typeof id === 'string' ? id.replace(/\D/g, '') : id;

        if (!numericId) {
            showToast("Invalid appointment ID", "error");
            return;
        }

        // Optimistic update - update UI immediately
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));

        try {
            const res = await fetch(`http://localhost:5000/api/admin/appointments/${numericId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });

            if (res.ok) {
                showToast(`Status updated to ${newStatus}`, "success");
            } else {
                // Revert on failure
                const appsRes = await fetch('http://localhost:5000/api/admin/appointments', { credentials: 'include' });
                if (appsRes.ok) {
                    const data = await appsRes.json();
                    setAppointments(data);
                }
                showToast("Failed to update status", "error");
            }
        } catch (e) {
            console.error("Status update error:", e);
            showToast("Update Failed - Network Error", "error");
        }
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

                    const filtered = data.filter(a =>
                        (a.labName && a.labName.includes('Royal')) ||
                        (a.location && a.location.toLowerCase().includes('kanjirapally'))
                    );
                    setAppointments(filtered);
                }
            } else {
                showToast("Booking Failed", "error");
            }
        } catch (e) {
            console.error(e);
            showToast("Error creating booking", "error");
        }
    };

    const handleStaffStatusChange = async (id, newStatus) => {
        try {
            // Optimistic update
            setStaff(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

            const res = await fetch(`http://localhost:5000/api/admin/staff/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update status');
            }
            showToast(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error(error);
            showToast("Failed to update status", "error");
            // Revert on error - refresh list
            fetchSectionData();
        }
    };

    const handleAddStaff = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Validation
        if (!newStaff.name) { showToast("Staff Name is required", "error"); return; }
        if (!newStaff.role) { showToast("Role is required", "error"); return; }
        if (!newStaff.phone) { showToast("Phone Number is required", "error"); return; }
        if (!newStaff.email) { showToast("Email is required", "error"); return; }

        setIsSavingStaff(true); // Start loading

        // Convert File to Base64
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        let finalPhoto = newStaff.photoPreview;
        if (newStaff.photo instanceof File) {
            try {
                finalPhoto = await toBase64(newStaff.photo);
            } catch (e) { console.error("Image convert error", e); }
        }

        const payload = { ...newStaff, photoPreview: finalPhoto };

        try {
            const res = await fetch('http://localhost:5000/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            if (res.ok) {
                showToast("Staff Member Added Successfully");
                setShowAddStaffModal(false);
                setNewStaff({
                    name: '', gender: 'Male', dob: '', phone: '', email: '', address: '', photo: null, photoPreview: null,
                    staffId: `STA-${Math.floor(1000 + Math.random() * 9000)}`, role: '', department: '', type: 'Full-time', joiningDate: new Date().toISOString().split('T')[0], experience: '',
                    shift: 'Morning', workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], workingHours: '9:00 AM - 5:00 PM', homeCollection: false, maxOrders: '',
                    specializations: [], handlingCapability: [], licenseNumber: '',
                    documents: [], emergencyName: '', emergencyRelation: '', emergencyPhone: '',
                    internalNotes: '', tags: []
                });
                // Force Refresh
                const refreshRes = await fetch('http://localhost:5000/api/admin/staff', { credentials: 'include' });
                const refreshData = await refreshRes.json();

                // Safety check to prevent crash if backend returns error object instead of array
                if (Array.isArray(refreshData)) {
                    // SANITIZATION: Ensure no objects/arrays are passed to simple render nodes
                    const sanitizedStaff = refreshData.map(s => ({
                        ...s,
                        workingDays: Array.isArray(s.workingDays) ? s.workingDays.join(', ') : (s.workingDays || ''),
                        specializations: Array.isArray(s.specializations) ? s.specializations.join(', ') : (s.specializations || ''),
                        documents: Array.isArray(s.documents) ? s.documents.join(', ') : (s.documents || '')
                    }));

                    try {
                        setStaff(sanitizedStaff);
                    } catch (renderError) {
                        console.error("Render Error after staff update:", renderError);
                        showToast("Staff saved, but failed to refresh list. Please reload manually.", "warning");
                    }
                } else {
                    console.error("Refresh Staff failed, expected array but got:", refreshData);
                    // Do not updating staff state if invalid, to prevent Table crash
                }
            } else {
                const data = await res.json();
                console.error("Add Staff Error:", data);
                showToast(data.message || "Failed to add staff", "error");
            }
        } catch (e) {
            console.error("Add Staff Exception:", e);
            showToast("Network error occurred", "error");
        } finally {
            setIsSavingStaff(false); // Stop loading
        }
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

    // Handle Status Update
    const handleOpenStatusModal = (appointment) => {
        setStatusUpdateAppointment(appointment);
        setNewStatus(appointment.status || 'Pending');
        setShowStatusModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!statusUpdateAppointment || !newStatus) {
            showToast("Please select a status", "error");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/admin/appointments/${statusUpdateAppointment.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update the appointments list locally
                setAppointments(appointments.map(apt =>
                    apt.id === statusUpdateAppointment.id
                        ? { ...apt, status: newStatus }
                        : apt
                ));
                showToast("Status updated successfully", "success");
                setShowStatusModal(false);
                setStatusUpdateAppointment(null);
            } else {
                const data = await res.json();
                showToast(data.message || "Failed to update status", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error updating status", "error");
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
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent immediate close
                            setShowNotifications(!showNotifications);
                            setShowProfileMenu(false);
                        }}
                    >
                        <Icons.Bell />
                        {notificationsList.some(n => !n.read) && <span className="med-badge"></span>}
                    </button>
                    {showNotifications && (
                        <div className="med-dropdown-menu notifications" style={{ width: '320px' }}>
                            <div className="med-dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Notifications</span>
                                <button
                                    onClick={markAllAsRead}
                                    style={{ background: 'none', border: 'none', color: 'var(--med-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Mark all read
                                </button>
                            </div>
                            <div className="med-notifications-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {notificationsList.length > 0 ? (
                                    notificationsList.map(n => (
                                        <div
                                            className={`med-dropdown-item notification-item ${n.read ? 'read' : 'unread'}`}
                                            key={n.id}
                                            onClick={() => markAsRead(n.id)}
                                            style={{
                                                display: 'flex', gap: '12px', alignItems: 'start', padding: '12px',
                                                borderLeft: n.read ? '3px solid transparent' :
                                                    n.type === 'urgent' ? '3px solid #ef4444' :
                                                        n.type === 'action' ? '3px solid #f59e0b' :
                                                            n.type === 'info' ? '3px solid #10b981' : '3px solid #3b82f6',
                                                background: n.read ? '#fff' : '#f8fafc',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                    <strong style={{ fontSize: '0.85rem', color: 'var(--med-text-main)' }}>{n.title}</strong>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--med-text-muted)' }}>{n.time}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--med-text-body)', lineHeight: '1.4' }}>{n.message}</p>
                                            </div>
                                            {!n.read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'red', flexShrink: 0, marginTop: '6px' }}></div>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="med-dropdown-item" style={{ padding: '20px', textAlign: 'center', color: 'var(--med-text-muted)' }}>
                                        <span>No new notifications</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <div
                        className={`med-profile-trigger ${showProfileMenu ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent immediate close
                            setShowProfileMenu(!showProfileMenu);
                            setShowNotifications(false);
                        }}
                    >
                        <div className="med-avatar-circle">
                            {profileData.admin_name ? profileData.admin_name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--med-text-main)' }}>
                            {profileData.admin_name || 'Admin'}
                        </span>
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

    const renderBillModal = () => {
        if (!showBillModal || !selectedPaymentBill) return null;

        return (
            <div className="med-modal-overlay" onClick={() => setShowBillModal(false)} style={{ zIndex: 10000 }}>
                <div className="med-modal-animate bill-modal" onClick={e => e.stopPropagation()} style={{
                    background: 'var(--med-surface)', width: '500px', borderRadius: '24px',
                    overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--med-border)'
                }}>
                    <div className="bill-modal-header" style={{
                        padding: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Invoice Detail</h3>
                            <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.85rem' }}>Transaction #{String(selectedPaymentBill.id).toUpperCase().slice(-8)}</p>
                        </div>
                        <button onClick={() => setShowBillModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
                            <Icons.X size={20} />
                        </button>
                    </div>

                    <div className="bill-modal-body" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 8px', color: 'var(--med-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billed To</h4>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--med-text-main)' }}>{selectedPaymentBill.patient}</p>
                                <p style={{ margin: '4px 0 0', color: 'var(--med-text-body)', fontSize: '0.9rem' }}>{selectedPaymentBill.contact || 'No contact provided'}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h4 style={{ margin: '0 0 8px', color: 'var(--med-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</h4>
                                <p style={{ margin: 0, fontWeight: 600, color: 'var(--med-text-main)' }}>{selectedPaymentBill.date}</p>
                                <p style={{ margin: '4px 0 0', color: 'var(--med-text-body)', fontSize: '0.9rem' }}>{selectedPaymentBill.time}</p>
                            </div>
                        </div>

                        <div style={{ border: '1px solid var(--med-border)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--med-bg)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>Description</th>
                                        <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '16px', borderBottom: '1px solid var(--med-border)' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{selectedPaymentBill.test}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--med-text-muted)' }}>Standard processing fee included</div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: 'var(--med-text-main)', borderBottom: '1px solid var(--med-border)' }}>₹{selectedPaymentBill.amount || '750'}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '12px 16px', color: 'var(--med-text-body)' }}>Tax (GST 5%)</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--med-text-body)' }}>₹{Math.round((selectedPaymentBill.amount || 750) * 0.05)}</td>
                                    </tr>
                                </tbody>
                                <tfoot style={{ background: 'var(--med-bg)' }}>
                                    <tr>
                                        <td style={{ padding: '16px', fontWeight: 700, fontSize: '1.1rem', color: 'var(--med-primary)' }}>Total Due</td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 800, fontSize: '1.25rem', color: 'var(--med-primary)' }}>₹{Math.round((selectedPaymentBill.amount || 750) * 1.05)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button className="med-btn med-btn-primary" style={{ flex: 1 }} onClick={() => window.print()}>
                                <Icons.Download size={18} /> Download PDF
                            </button>
                            <button className="med-btn" style={{ flex: 1, border: '1px solid var(--med-border)', background: 'white' }} onClick={() => setShowBillModal(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderOverview = () => (
        <>
            <div className="med-stats-grid">
                {/* 1. Total Bookings */}
                <div
                    className="med-card hover-card clickable"
                    onClick={() => { setActiveSection('Appointments'); setAppointmentFilter('All'); setDateFilter('All Time'); }}
                >
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper blue"><Icons.Calendar /></div>
                        <div className="med-drill-icon"><Icons.ChevronRight /></div>
                    </div>
                    <h3 className="med-stat-value"><CountUp end={appointments.length} /></h3>
                    <p className="med-stat-label">Total Bookings</p>
                    <div className="med-micro-insight info">
                        <Icons.ClockSmall />
                        <span>Peak time: 10:30 – 12:00</span>
                    </div>
                </div>

                {/* 2. Pending Orders */}
                <div
                    className="med-card hover-card clickable"
                    onClick={() => { setActiveSection('Appointments'); setAppointmentFilter('Pending'); }}
                >
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper orange"><Icons.TestTube /></div>
                        <div className="med-drill-icon"><Icons.ChevronRight /></div>
                    </div>
                    <h3 className="med-stat-value"><CountUp end={countStatus('Pending')} /></h3>
                    <p className="med-stat-label">Pending Orders</p>
                    <div className="med-micro-insight warning">
                        <Icons.AlertTriangle />
                        <span>{countDelayed()} awaiting action</span>
                    </div>
                </div>

                {/* 3. Reports Generated */}
                <div
                    className="med-card hover-card clickable"
                    onClick={() => { setActiveSection('Reports'); }}
                >
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper green"><Icons.FileText /></div>
                        <div className="med-drill-icon"><Icons.ChevronRight /></div>
                    </div>
                    <h3 className="med-stat-value"><CountUp end={stats.reportsGenerated} /></h3>
                    <p className="med-stat-label">Reports Generated</p>
                    <div className="med-micro-insight success">
                        <Icons.ClockSmall />
                        <span>Avg TAT: 4.2 hrs</span>
                    </div>
                </div>

                {/* 4. Active Staff */}
                <div
                    className="med-card hover-card clickable"
                    onClick={() => { setActiveSection('Lab Staff'); }}
                >
                    <div className="med-stat-header">
                        <div className="med-stat-icon-wrapper purple"><Icons.Users /></div>
                        <div className="med-drill-icon"><Icons.ChevronRight /></div>
                    </div>
                    <h3 className="med-stat-value"><CountUp end={stats.activeStaff} /></h3>
                    <p className="med-stat-label">Active Staff</p>
                    <div className="med-micro-insight purple">
                        <div className="med-status-dot success"></div>
                        <span>2 technicians online</span>
                    </div>
                </div>
            </div>

            {/* Graph Section */}
            <div className="med-card zoom-in-enter" style={{ marginBottom: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h3 className="med-table-title">Weekly Appointments Overview</h3>
                        <div className="med-insight-badge">
                            <Icons.TrendingUp />
                            Bookings increased by 18% compared to last week
                        </div>
                    </div>
                    <select style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--med-border)', outline: 'none', fontSize: '0.9rem', color: 'var(--med-text-body)' }}>
                        <option>This Week</option>
                        <option>Last Week</option>
                    </select>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.dailyStats && stats.dailyStats.length > 0 ? stats.dailyStats : [{ name: 'Mon', count: 0 }, { name: 'Tue', count: 0 }, { name: 'Wed', count: 0 }, { name: 'Thu', count: 0 }, { name: 'Fri', count: 0 }, { name: 'Sat', count: 0 }, { name: 'Sun', count: 0 }]}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #1e293b', background: '#151e32', color: '#bae6fd', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', padding: '12px' }}
                                cursor={{ stroke: '#00d4ff', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#00d4ff"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#00d4ff' }}
                            />
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
                                        <td style={{ fontWeight: 500, color: 'var(--med-text-main)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{appt.patient && appt.patient.includes('@') ? appt.patient.split('@')[0] : appt.patient}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)', fontWeight: 400 }}>@{appt.username || 'guest'}</span>
                                            </div>
                                        </td>
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

    const toggleRow = (id) => {
        if (expandedRowId === id) {
            setExpandedRowId(null);
        } else {
            setExpandedRowId(id);
        }
    };

    const handleAdvancedFilterChange = (key, value) => {
        setAdvancedFilters(prev => ({ ...prev, [key]: value }));
    };

    const removeFilter = (key) => {
        if (key === 'status') setAppointmentFilter('All');
        if (key === 'date') setDateFilter('All Time');
        if (key in advancedFilters) setAdvancedFilters(prev => ({ ...prev, [key]: key === 'isDelayed' ? false : '' }));
    };

    const handleQuickFilter = (type) => {
        if (type === 'Today') {
            setDateFilter('Today');
            setAppointmentFilter('All');
        } else if (type === 'Pending') {
            setAppointmentFilter('Pending');
            setDateFilter('All Time');
        } else if (type === 'Completed') {
            setAppointmentFilter('Completed');
            setDateFilter('All Time');
        }
    };

    const renderAppointments = () => {
        const filteredAppointments = appointments.filter(a => {
            const matchesSearch = a.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = appointmentFilter === 'All' || a.status === appointmentFilter;
            // Date filter logic moved to section splitting
            const matchesTest = advancedFilters.testType ? a.test.includes(advancedFilters.testType) : true;
            const matchesTech = advancedFilters.technician ? a.technician === advancedFilters.technician : true;
            const matchesDelay = advancedFilters.isDelayed ? (a.isDelayed || a.status === 'Pending') : true;

            return matchesSearch && matchesStatus && matchesTest && matchesTech && matchesDelay;
        });

        // Split into Today and History
        const todayStr = new Date().toISOString().split('T')[0];
        const todayAppointments = filteredAppointments.filter(a => a.date === todayStr);
        const historyAppointments = filteredAppointments.filter(a => a.date !== todayStr);

        const renderAppointmentTable = (apptList, title, emptyMsg) => (
            <div className="med-table-card premium" style={{ marginBottom: '24px' }}>
                <div className="med-table-header" style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 className="med-table-title">{title} <span className="med-badge" style={{ marginLeft: '8px', fontSize: '0.8rem' }}>{apptList.length}</span></h3>
                </div>
                <table className="med-table premium-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Patient Info</th>
                            <th>Test Details</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apptList.length > 0 ? (
                            apptList.map(appt => (
                                <React.Fragment key={appt.id}>
                                    <tr
                                        className={`med-table-row ${expandedRowId === appt.id ? 'expanded' : ''}`}
                                        onClick={() => toggleRow(appt.id)}
                                    >
                                        <td style={{ textAlign: 'center', color: 'var(--med-text-muted)' }}>
                                            {expandedRowId === appt.id ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                        </td>
                                        <td>
                                            <div className="med-user-cell">
                                                <div className="med-avatar-mini">{(appt.username || appt.patient).charAt(0).toUpperCase()}</div>
                                                <div className="info">
                                                    <span className="name">{appt.patient && appt.patient.includes('@') ? appt.patient.split('@')[0] : appt.patient}</span>
                                                    <span className="sub-text">@{appt.username || 'guest'} • ID: {appt.id}</span>
                                                </div>
                                                {appt.isDelayed && (
                                                    <div className="med-delay-badge" title="Delayed by > 2 hrs">
                                                        <Icons.ClockSmall />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td><span className="med-text-medium">{appt.test}</span></td>
                                        <td>
                                            <div className="med-time-cell">
                                                <span className="date">{appt.date}</span>
                                                <span className="time">{appt.time}</span>
                                            </div>
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <div className="med-status-dropdown-wrapper">
                                                <select
                                                    className={`med-status-dropdown ${(appt.status || 'Pending').toLowerCase().replace(/\s/g, '-')}`}
                                                    value={appt.status || 'Pending'}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(appt.id, e.target.value);
                                                    }}
                                                >
                                                    <option value="Pending">⏳ Pending</option>
                                                    <option value="Confirmed">✅ Confirmed</option>
                                                    <option value="Sample Collected">🧪 Sample Collected</option>
                                                    <option value="Processing">⚙️ Processing</option>
                                                    <option value="Completed">✔️ Completed</option>
                                                    <option value="Cancelled">❌ Cancelled</option>
                                                </select>
                                                <Icons.ChevronDown className="med-status-dropdown-arrow" />
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                            <div className="med-action-group">
                                                <button className="med-btn-icon danger" title="Cancel"><Icons.X /></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRowId === appt.id && (
                                        <tr className="med-expanded-row">
                                            <td colSpan="6">
                                                <div className="med-row-details">
                                                    <div className="med-detail-grid">
                                                        <div className="detail-item">
                                                            <span className="label">Contact Info</span>
                                                            <span className="value">{appt.contact || 'N/A'}</span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <span className="label">Sample Status</span>
                                                            <span className="value">{appt.sampleType || 'Not Collected'}</span>
                                                        </div>
                                                        <div className="detail-item">
                                                            <span className="label">Payment</span>
                                                            <span className="value success">Paid (Online)</span>
                                                        </div>
                                                        <div className="detail-item full">
                                                            <span className="label">Notes</span>
                                                            <span className="value">Patient requested result via email. Fasting sample.</span>
                                                        </div>
                                                    </div>
                                                    <div className="med-detail-actions">
                                                        <button className="med-btn-small secondary">View History</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">
                                    <div className="med-empty-state">
                                        <div className="illustration">🎨</div>
                                        <h3>{emptyMsg}</h3>
                                        <p>No appointments found in this category.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );

        return (
            <div className="med-card no-pad" style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}>
                {/* 1. Visual Header Enhancement */}
                <div className="med-premium-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 className="med-page-heading">Appointments Management</h2>
                            <p className="med-page-subheading">View, manage, and track all lab appointments in real time</p>
                        </div>
                        <button className="med-btn med-btn-gradient" onClick={() => setShowBookingModal(true)}>
                            <Icons.Plus /> New Booking
                        </button>
                    </div>

                    <div className="med-filter-pills-row">
                        <div
                            className={`med-filter-pill-item ${dateFilter === 'Today' ? 'active' : ''}`}
                            onClick={() => { setDateFilter('Today'); setAppointmentFilter('All'); }}
                        >
                            <span className="pill-dot blue"></span>
                            Today's Appointments
                            <span className="pill-count">{countToday()}</span>
                        </div>

                        <div
                            className={`med-filter-pill-item ${dateFilter === 'Upcoming' ? 'active' : ''}`}
                            onClick={() => { setDateFilter('Upcoming'); setAppointmentFilter('All'); }}
                        >
                            <span className="pill-dot orange"></span>
                            Upcoming
                            <span className="pill-count">{appointments.filter(a => new Date(a.date) > new Date(new Date().toISOString().split('T')[0])).length}</span>
                        </div>

                        <div
                            className={`med-filter-pill-item ${dateFilter === 'History' ? 'active' : ''}`}
                            onClick={() => { setDateFilter('History'); setAppointmentFilter('All'); }}
                        >
                            <span className="pill-dot green"></span>
                            History
                            <span className="pill-count">{appointments.filter(a => new Date(a.date) < new Date(new Date().toISOString().split('T')[0]) || a.status === 'Completed').length}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Today's Status Summary Chart */}
                <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="med-mini-chart-card">
                        <div className="chart-header">
                            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--med-text-muted)' }}>Today's Status Flow</h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                            <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: `${(todayAppointments.filter(a => a.status === 'Pending').length / (todayAppointments.length || 1)) * 100}%`, background: '#f59e0b' }} title="Pending"></div>
                                <div style={{ width: `${(todayAppointments.filter(a => a.status === 'Confirmed').length / (todayAppointments.length || 1)) * 100}%`, background: '#3b82f6' }} title="Confirmed"></div>
                                <div style={{ width: `${(todayAppointments.filter(a => a.status === 'Completed').length / (todayAppointments.length || 1)) * 100}%`, background: '#10b981' }} title="Completed"></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <div className="chart-legend-item"><span className="dot orange"></span> Pending: {todayAppointments.filter(a => a.status === 'Pending').length}</div>
                            <div className="chart-legend-item"><span className="dot blue"></span> Confirmed: {todayAppointments.filter(a => a.status === 'Confirmed').length}</div>
                            <div className="chart-legend-item"><span className="dot green"></span> Completed: {todayAppointments.filter(a => a.status === 'Completed').length}</div>
                        </div>
                    </div>
                </div>

                {/* 5. Tables based on filter */}
                {dateFilter === 'Today' && (
                    <>
                        <h3 style={{ margin: '0 0 16px 4px', color: 'var(--med-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icons.Calendar size={20} /> Today's Schedule
                        </h3>
                        {renderAppointmentTable(todayAppointments, "Today", "No appointments for today")}
                    </>
                )}

                {dateFilter === 'Upcoming' && (
                    <>
                        <h3 style={{ margin: '0 0 16px 4px', color: 'var(--med-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icons.TrendingUp size={20} /> Upcoming Appointments
                        </h3>
                        {renderAppointmentTable(appointments.filter(a => new Date(a.date) > new Date(new Date().toISOString().split('T')[0])), "Upcoming", "No upcoming appointments found")}
                    </>
                )}

                {dateFilter === 'History' && (
                    <>
                        <h3 style={{ margin: '0 0 16px 4px', color: 'var(--med-text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icons.ClockSmall size={20} /> Appointment History
                        </h3>
                        {renderAppointmentTable(appointments.filter(a => new Date(a.date) < new Date(new Date().toISOString().split('T')[0]) || a.status === 'Completed'), "History", "No past appointments found")}
                    </>
                )}
            </div>
        );
    };

    const renderTestOrders = () => {
        // Mock data enhancement with safety checks
        const enhancedOrders = testOrders.map(t => ({
            ...t,
            sampleType: t.sampleType || ((t.tests || []).join('').includes('Blood') ? 'Blood' : 'Urine'),
            sampleStatus: t.sampleStatus || (t.status === 'Pending' ? 'Not Collected' : 'Collected'),
            tat: t.tat || '24 hrs',
            whatsapp: t.whatsapp || '9876543210',
            isDelayed: Math.random() > 0.8
        }));

        const filteredOrders = enhancedOrders.filter(t =>
            (orderFilter === 'All' || t.status === orderFilter) &&
            ((t.patient || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.tests || []).join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const countOrderStatus = (status) => {
            if (status === 'All') return enhancedOrders.length;
            return enhancedOrders.filter(t => t.status === status).length;
        };

        const toggleRowExpansion = (id) => {
            setExpandedOrderId(expandedOrderId === id ? null : id);
        };

        const toggleSelection = (id) => {
            setSelectedOrderIds(prev =>
                prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
            );
        };

        return (
            <div className="med-test-orders-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Header & Hierarchy */}
                <div className="med-premium-header" style={{ marginBottom: 0 }}>
                    <div>
                        <h2 className="med-page-heading">Test Orders</h2>
                        <p className="med-page-subheading">Track, process, and manage incoming lab test orders</p>
                    </div>
                </div>

                {/* 2. Test Orders Filter Pills */}
                <div className="med-filter-pills-row">
                    {[
                        { label: 'Total Orders', status: 'All', color: 'blue', icon: '📊' },
                        { label: 'Pending', status: 'Pending', color: 'orange', icon: '⏳' },
                        { label: 'In Process', status: 'In Process', color: 'blue', icon: '🔄' },
                        { label: 'Completed', status: 'Completed', color: 'green', icon: '✅' }
                    ].map(kpi => (
                        <div
                            key={kpi.label}
                            className={`med-filter-pill-item ${orderFilter === kpi.status ? 'active' : ''}`}
                            onClick={() => setOrderFilter(kpi.status)}
                        >
                            <span className={`pill-dot ${kpi.color}`}></span>
                            <span style={{ marginRight: '4px' }}>{kpi.icon}</span> {kpi.label}
                            <span className="pill-count">{countOrderStatus(kpi.status)}</span>
                        </div>
                    ))}
                </div>

                {/* 10. Bulk Actions Bar (only shows when items selected) */}
                {selectedOrderIds.length > 0 && (
                    <div className="med-bulk-actions-bar">
                        <span style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{selectedOrderIds.length} orders selected</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="med-btn-outlined small">Assign Tech</button>
                            <button className="med-btn-gradient small">Process Selected</button>
                        </div>
                    </div>
                )}

                {/* 3. Modern Table Design Upgrade */}
                <div className="med-table-card premium">
                    <table className="med-table premium-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}><input type="checkbox" onChange={(e) => {
                                    if (e.target.checked) setSelectedOrderIds(filteredOrders.map(o => o.id));
                                    else setSelectedOrderIds([]);
                                }} checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length} /></th>
                                <th>Order ID</th>
                                <th>Patient</th>
                                <th>Tests</th>
                                <th>Sample</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '60px' }}>
                                        {/* 11. Empty State */}
                                        <div className="med-empty-state-content">
                                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧪</div>
                                            <h3 style={{ fontSize: '1.2rem', color: 'var(--med-text-main)', marginBottom: '8px' }}>No test orders available</h3>
                                            <p style={{ color: 'var(--med-text-muted)' }}>Waiting for new orders to process.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <React.Fragment key={order.id}>
                                        <tr
                                            className={`med-table-row ${expandedOrderId === order.id ? 'expanded' : ''}`}
                                            onClick={() => toggleRowExpansion(order.id)}
                                        >
                                            <td onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrderIds.includes(order.id)}
                                                    onChange={() => toggleSelection(order.id)}
                                                />
                                            </td>
                                            <td className="mono-text" style={{ fontWeight: 600, color: 'var(--med-primary)' }}>{order.id}</td>
                                            {/* 4. Patient Column Enhancement */}
                                            <td>
                                                <div className="med-user-cell">
                                                    <div className="info">
                                                        <span className="name">{order.patient || 'Unknown Patient'}</span>
                                                        <div className="med-contact-pill compact" title="Booked via WhatsApp" style={{ marginTop: '4px', fontSize: '0.75rem', padding: '2px 8px' }}>
                                                            <Icons.Phone size={10} color="#25D366" /> {order.whatsapp}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* 5. Tests Column */}
                                            <td>
                                                <div title={(order.tests || []).join(', ')} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontWeight: 500, color: 'var(--med-text-main)' }}>
                                                        {(order.tests && order.tests[0]) || 'N/A'}
                                                        {(order.tests && order.tests.length > 1) && <span style={{ color: 'var(--med-text-muted)', fontSize: '0.8rem', marginLeft: '6px' }}>+{order.tests.length - 1} more</span>}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* 6. Sample Column & 7. Status Column */}
                                            <td>
                                                <div className="med-sample-badge" title={order.sampleStatus === 'Collected' ? 'Sample Collected' : 'Sample Not Collected'}>
                                                    <span style={{ fontSize: '1.2rem' }}>{order.sampleType === 'Blood' ? '🩸' : '🧪'}</span>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--med-text-main)' }}>{order.sampleType}</span>
                                                        <span style={{ fontSize: '0.7rem', color: order.sampleStatus === 'Collected' ? '#16a34a' : '#ea580c' }}>{order.sampleStatus}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className={`med-status-badge ${(order.status || 'pending').toLowerCase().replace(' ', '-')}`}>
                                                        {order.status || 'Pending'}
                                                    </span>
                                                    {order.isDelayed && <div title="Order is delayed" style={{ color: '#ef4444' }}><Icons.ClockSmall size={16} /></div>}
                                                </div>
                                            </td>
                                            {/* 8. Smart Actions */}
                                            <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                                <div className="med-action-group">
                                                    {order.status === 'Pending' && (
                                                        <button className="med-btn-icon info" title="Process Order" ><Icons.Settings /></button>
                                                    )}
                                                    {['In Process', 'Processing'].includes(order.status) && (
                                                        <button className="med-btn-icon success" title="Upload Result" onClick={() => {
                                                            setUploadData({ patient_id: order.patientId, test_name: (order.tests && order.tests[0]) || '', file: null });
                                                            setShowUploadModal(true);
                                                        }}><Icons.UploadCloud /></button>
                                                    )}
                                                    <button className="med-btn-icon" title="View Details" onClick={() => toggleRowExpansion(order.id)}>
                                                        {expandedOrderId === order.id ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* 9. Expandable Row Details */}
                                        {expandedOrderId === order.id && (
                                            <tr className="med-expanded-row">
                                                <td colSpan="7">
                                                    <div className="med-row-details">
                                                        <div className="med-detail-grid">
                                                            <div className="detail-item">
                                                                <span className="label">Timeline</span>
                                                                <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>
                                                                    Created: Today, 9:00 AM
                                                                </span>
                                                            </div>
                                                            <div className="detail-item">
                                                                <span className="label">Expected TAT</span>
                                                                <span className="value">{order.tat}</span>
                                                            </div>
                                                            <div className="detail-item">
                                                                <span className="label">Technician</span>
                                                                <span className="value">Unassigned <button className="med-link-btn" style={{ fontSize: '0.8rem' }}>Assign</button></span>
                                                            </div>
                                                            <div className="detail-item">
                                                                <span className="label">Notes</span>
                                                                <span className="value" style={{ fontStyle: 'italic', color: 'var(--med-text-muted)' }}>No special instructions.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderPatients = () => {
        const filteredPatients = patients.filter(p =>
            ((p.name || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
            ((p.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
        );

        return (
            <div className="med-reports-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="med-premium-header">
                    <div>
                        <h2 className="med-page-heading">Diagnostic Intelligence</h2>
                        <p className="med-page-subheading">Manage and monitor registered patient ecosystems</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div className="med-card-mini" style={{ padding: '8px 16px', background: 'var(--med-surface)', border: '1px solid var(--med-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ color: 'var(--med-primary)' }}><Icons.Users size={18} /></div>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--med-text-muted)', textTransform: 'uppercase' }}>Active Records</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{filteredPatients.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loadingPatients ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--med-text-muted)' }}>
                        <div className="spinner" style={{
                            width: '40px', height: '40px', border: '3px solid #e2e8f0',
                            borderTopColor: 'var(--med-primary)', borderRadius: '50%',
                            animation: 'spin 1s linear infinite', margin: '0 auto 1rem'
                        }}></div>
                        <p style={{ fontWeight: 500 }}>Synchronizing intelligence...</p>
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="med-empty-state" style={{ background: 'var(--med-surface)', padding: '60px', textAlign: 'center', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ width: 80, height: 80, background: 'var(--med-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Icons.FileText size={40} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--med-text-main)', marginBottom: '8px' }}>Workspace is empty</h3>
                        <p style={{ color: 'var(--med-text-muted)' }}>No registered patients match your current filters.</p>
                    </div>
                ) : (
                    <div className="med-patients-container">
                        <table className="med-table med-patient-card-table" style={{ borderCollapse: 'separate', borderSpacing: '0 12px', width: '100%' }}>
                            <thead style={{ display: 'none' }}>
                                <tr>
                                    <th style={{ width: '80px' }}>ID</th>
                                    <th>Identity</th>
                                    <th>Latest Test</th>
                                    <th>Contact</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map(p => (
                                    <tr key={p.id} className="med-patient-card-row" style={{
                                        background: 'var(--med-surface)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        <td style={{ padding: '20px', borderRadius: '16px 0 0 16px' }}>
                                            <span style={{
                                                background: 'var(--med-bg)', padding: '4px 10px', borderRadius: '6px',
                                                fontSize: '0.85rem', fontWeight: 600, color: 'var(--med-text-muted)'
                                            }}>#{p.id}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--med-text-body)', fontSize: '1.2rem', fontWeight: 700
                                                }}>
                                                    {p.profile_pic ? (
                                                        <img src={p.profile_pic} alt={p.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <span>{(p.name || '?').charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--med-text-main)' }}>{p.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--med-text-muted)', marginTop: '4px' }}>
                                                        {p.age && p.age !== 'N/A' ? `${p.age} Y/O` : 'Age N/A'} • {p.gender || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div className="med-test-tag" style={{
                                                padding: '6px 12px', background: 'rgba(14, 165, 233, 0.1)',
                                                color: 'var(--med-primary)', borderRadius: '8px', fontSize: '0.9rem',
                                                fontWeight: 600, display: 'inline-block'
                                            }}>
                                                {p.latest_test || 'General Consult'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            {p.phone !== 'N/A' ? (
                                                <div className="med-contact-pill" style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                    padding: '8px 12px', borderRadius: '8px', background: 'var(--med-bg)',
                                                    border: '1px solid var(--med-border)', color: 'var(--med-text-main)', fontSize: '0.9rem', fontWeight: 500
                                                }}>
                                                    <div style={{ color: '#25D366' }}><Icons.Phone size={16} /></div>
                                                    {p.phone}
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--med-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No Contact</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px', borderRadius: '0 16px 16px 0', textAlign: 'right' }}>
                                            <button className="med-btn-hover-lift" onClick={() => handleViewHistory(p)} style={{
                                                background: 'var(--med-surface)', border: '1px solid var(--med-border)',
                                                color: 'var(--med-text-main)', padding: '10px 20px', borderRadius: '12px',
                                                fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                transition: 'all 0.2s'
                                            }}>
                                                <Icons.ClockSmall size={18} /> View History
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };


    const renderReports = () => {
        // Step 1: Identify patients who have at least one "Confirmed" appointment
        const confirmedUserRefs = new Set(
            appointments
                .filter(a => a.status === 'Confirmed')
                .map(a => a.username || a.patient)
        );

        // Step 2: Filter patients based on confirmed status and search term
        const filteredReports = patients.filter(p => {
            const isConfirmed = confirmedUserRefs.has(p.username) || confirmedUserRefs.has(p.name) || confirmedUserRefs.has(p.email);
            const matchesSearch = ((p.name || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
                ((p.email || '').toLowerCase().includes(searchTerm.toLowerCase()));
            return isConfirmed && matchesSearch;
        });

        return (
            <div className="med-reports-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="med-premium-header">
                    <div>
                        <h2 className="med-page-heading">Reports & Test History</h2>
                        <p className="med-page-subheading">Review diagnostic records and upload patient results</p>
                    </div>
                </div>

                {filteredReports.length === 0 ? (
                    <div className="med-empty-state" style={{ background: 'var(--med-surface)', padding: '80px 40px', textAlign: 'center', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ width: 100, height: 100, background: 'var(--med-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Icons.FileText size={48} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--med-text-main)', marginBottom: '12px' }}>No records found</h3>
                        <p style={{ color: 'var(--med-text-muted)', maxWidth: '400px', margin: '0 auto' }}>Navigate to Appointments to book users or wait for new registrations to appear here.</p>
                    </div>
                ) : (
                    <div className="med-reports-grid">
                        {filteredReports.map(p => (
                            <div key={p.id} className="med-report-user-card">
                                <div className="card-header-main">
                                    <div className="user-identity-block">
                                        <div className="card-avatar-wrapper">
                                            <div className="card-avatar">
                                                {p.profile_pic ? (
                                                    <img src={p.profile_pic} alt={p.name} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                                                ) : (p.name || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="status-indicator" title="Patient Online"></div>
                                        </div>
                                        <div className="user-meta">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <h3>{p.name}</h3>
                                                {p.uploaded_data_count > 0 && (
                                                    <span className="med-upload-sign" title="Report Uploaded">
                                                        <Icons.CheckCircle size={14} />
                                                    </span>
                                                )}
                                            </div>
                                            <span className="user-id-tag">PATIENT ID #{p.id}</span>
                                        </div>
                                    </div>
                                    <button className="med-btn-icon" style={{ opacity: 0.5 }}><Icons.MoreVertical /></button>
                                </div>

                                <div className="card-stats-grid">
                                    <div className="stat-box">
                                        <span className="label">Total Reports</span>
                                        <span className="value">{p.uploaded_data_count || 0} Files</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="label">Identity</span>
                                        <span className="value">{(p.age && p.age !== 'N/A') ? p.age : '??'}Y • {p.gender || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="latest-test-banner">
                                    <span className="test-icon">🔬</span>
                                    <div className="test-info">
                                        <span className="title">Latest Booking Type</span>
                                        <span className="name">{p.latest_test || 'General Consultation'}</span>
                                    </div>
                                </div>

                                <div className="card-footer-actions">
                                    <button
                                        className="btn-report-action primary"
                                        onClick={() => handleViewHistory(p)}
                                    >
                                        <Icons.ClockSmall size={18} /> View History
                                    </button>
                                    <button
                                        className="btn-report-action secondary"
                                        title="Upload Result"
                                        style={{ background: 'var(--med-primary)', color: 'white', border: 'none' }}
                                        onClick={() => {
                                            setUploadData({ patient_id: p.id, test_name: p.latest_test || 'General Test', file: null });
                                            setShowUploadModal(true);
                                        }}
                                    >
                                        <Icons.UploadCloud size={18} /> Upload Result
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderStaff = () => {
        // Derived state for Staff logic
        const staffKpis = [
            { label: 'Total Staff', value: staff.length, icon: 'Users', color: 'blue' },
            { label: 'Active', value: staff.filter(s => s.status === 'Active' || s.status === 'Available').length, icon: 'Activity', color: 'green' },
            { label: 'On Leave', value: staff.filter(s => s.status === 'Leave').length, icon: 'Clock', color: 'orange' },
            { label: 'Inactive', value: staff.filter(s => s.status === 'Inactive').length, icon: 'X', color: 'gray' }
        ];

        return (
            <div className="med-staff-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Header & Action Area */}
                <div className="med-premium-header" style={{ marginBottom: 0 }}>
                    <div>
                        <h2 className="med-page-heading">Lab Staff</h2>
                        <p className="med-page-subheading">Manage lab technicians, roles, and availability</p>
                    </div>
                    <button className="med-btn med-btn-gradient" onClick={() => setShowAddStaffModal(true)}>
                        <Icons.Plus /> Add Member
                    </button>
                </div>

                {/* 2. Staff Filter Pills Row */}
                <div className="med-filter-pills-row">
                    {[
                        { label: 'Total Staff', status: 'All', color: 'blue' },
                        { label: 'Active', status: 'Active', color: 'green' },
                        { label: 'Leave', status: 'Leave', color: 'orange' },
                        { label: 'Inactive', status: 'Inactive', color: 'gray' }
                    ].map(kpi => (
                        <div
                            key={kpi.label}
                            className={`med-filter-pill-item ${staffFilter === kpi.status ? 'active' : ''}`}
                            onClick={() => setStaffFilter(kpi.status)}
                        >
                            <span className={`pill-dot ${kpi.color}`}></span>
                            {kpi.label}
                            <span className="pill-count">
                                {kpi.status === 'All' ? staff.length : staff.filter(s => (s.status === 'Available' ? 'Active' : s.status) === kpi.status).length}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 3. Table Design Upgrade */}
                {loadingStaff ? (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--med-text-muted)' }}>
                        <div className="spinner" style={{
                            width: '40px', height: '40px', border: '3px solid #e2e8f0',
                            borderTopColor: 'var(--med-primary)', borderRadius: '50%',
                            animation: 'spin 1s linear infinite', margin: '0 auto 1rem'
                        }}></div>
                        <p style={{ fontWeight: 500 }}>Retrieving staff deployment data...</p>
                    </div>
                ) : (!Array.isArray(staff) || staff.length === 0) ? (
                    <div className="med-table-card premium" style={{ padding: '60px', textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, background: 'var(--med-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Icons.Users size={40} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--med-text-main)', marginBottom: '8px' }}>No staff members added yet</h3>
                        <p style={{ color: 'var(--med-text-muted)' }}>Add your first lab technician or admin to begin.</p>
                    </div>
                ) : (
                    <div className="med-table-card premium">
                        <table className="med-table premium-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Contact</th>
                                    <th>Shift</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff
                                    .filter(s => {
                                        const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
                                        const actualStatus = s.status === 'Available' ? 'Active' : s.status;
                                        const matchesFilter = staffFilter === 'All' || actualStatus === staffFilter;
                                        return matchesSearch && matchesFilter;
                                    })
                                    .map(s => (
                                        <tr key={s.id} className="med-table-row">
                                            {/* 4. Name Column Enhancement */}
                                            <td>
                                                <div className="med-user-cell">
                                                    <div className="med-avatar-circle small" style={{ background: '#e0e7ff', color: '#4338ca', fontWeight: 700, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {s.image ? (
                                                            <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            (s.name || '?').charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="info">
                                                        <span className="name">{s.name || 'Unknown Staff'}</span>
                                                        <span className="sub-text" style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)' }}>ID: {s.staffId || `STA-${s.id}`}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* 5. Role Column Enhancement */}
                                            <td>
                                                <span className={`med-role-tag ${(s.role || '').toLowerCase().replace(' ', '-')}`}
                                                    style={{
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                                                        background: s.role === 'Admin' ? '#f3e8ff' : '#dbeafe',
                                                        color: s.role === 'Admin' ? '#7e22ce' : '#1e40af'
                                                    }}>
                                                    {s.role || 'No Role'}
                                                </span>
                                            </td>
                                            <td><span style={{ color: 'var(--med-text-muted)' }}>{s.department || '-'}</span></td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--med-text-main)' }}>{s.phone || '-'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)' }}>{s.email}</div>
                                            </td>
                                            <td>
                                                <span style={{
                                                    fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--med-bg)', border: '1px solid var(--med-border)', color: 'var(--med-text-body)'
                                                }}>
                                                    {s.shift || 'General'}
                                                </span>
                                            </td>
                                            {/* 6. Status Column Upgrade */}
                                            <td>
                                                <select
                                                    className="med-status-select"
                                                    value={s.status === 'Available' ? 'Active' : s.status}
                                                    onChange={(e) => handleStaffStatusChange(s.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                                                        background: (s.status === 'Active' || s.status === 'Available') ? '#dcfce7' : (s.status === 'Leave' ? '#fef9c3' : '#f1f5f9'),
                                                        color: (s.status === 'Active' || s.status === 'Available') ? '#15803d' : (s.status === 'Leave' ? '#854d0e' : '#64748b')
                                                    }}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                    <option value="Leave">Leave</option>
                                                </select>
                                            </td>
                                            {/* 7. Action Column */}
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="med-action-group">
                                                    <button className="med-btn-icon" title="Edit Staff"><Icons.Settings /></button>
                                                    <button className="med-btn-icon danger" title="Remove"><Icons.Trash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 9. Professional Add Member Modal - Fully Upgraded */}
                {
                    showAddStaffModal && (
                        <div className="med-modal-wrapper-pro">
                            <div className="med-modal-content-pro">
                                {/* Header */}
                                <div className="med-modal-header-pro">
                                    <div className="med-modal-title-row">
                                        <div className="med-icon-box">
                                            <Icons.Users />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--med-text-main)' }}>Add New Staff Member</h3>
                                            <p style={{ margin: '4px 0 0 0', color: 'var(--med-text-muted)', fontSize: '0.9rem' }}>Create profile, assign role, and set permissions.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAddStaffModal(false)} className="med-btn-icon"><Icons.X /></button>
                                </div>

                                {/* Scrollable Body */}
                                <div className="med-modal-body-scroll">

                                    {/* 1. Basic Personal Information */}
                                    <div className="med-pro-form-section">
                                        <div className="med-section-header">
                                            <div className="med-section-number">1</div>
                                            <div className="med-section-title">
                                                <h4>Basic Personal Information</h4>
                                                <p className="med-section-subtitle">Identify the staff member clearly (Required)</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '32px' }}>
                                            {/* Avatar Upload */}
                                            <div style={{ flexShrink: 0 }}>
                                                <label className="med-label-pro">Profile Photo</label>
                                                <div className="med-avatar-preview"
                                                    style={{ backgroundImage: newStaff.photoPreview ? `url(${newStaff.photoPreview})` : 'none' }}
                                                    onClick={() => document.getElementById('staff-pfp-upload').click()}
                                                >
                                                    {!newStaff.photoPreview && <Icons.User style={{ opacity: 0.3 }} />}
                                                    <input
                                                        type="file"
                                                        id="staff-pfp-upload"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const url = URL.createObjectURL(file);
                                                                setNewStaff({ ...newStaff, photo: file, photoPreview: url });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                                    <small style={{ color: 'var(--med-primary)', cursor: 'pointer', fontWeight: 600 }}>Upload</small>
                                                </div>
                                            </div>

                                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div style={{ gridColumn: 'span 2' }}>
                                                    <label className="med-label-pro">Full Name <span style={{ color: 'red' }}>*</span></label>
                                                    <input className="med-input-pro" placeholder="e.g. Dr. Sarah Miller" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="med-label-pro">Gender</label>
                                                    <select className="med-input-pro" value={newStaff.gender} onChange={e => setNewStaff({ ...newStaff, gender: e.target.value })}>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="med-label-pro">Date of Birth</label>
                                                    <input type="date" className="med-input-pro" value={newStaff.dob} onChange={e => setNewStaff({ ...newStaff, dob: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="med-label-pro">Phone Number <span style={{ color: 'red' }}>*</span></label>
                                                    <input type="tel" className="med-input-pro" placeholder="+91 98765 43210" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} />
                                                </div>
                                                <div>
                                                    <label className="med-label-pro">Email Address <span style={{ color: 'red' }}>*</span></label>
                                                    <input type="email" className="med-input-pro" placeholder="staff@medibot.com" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} />
                                                </div>
                                                <div style={{ gridColumn: 'span 2' }}>
                                                    <label className="med-label-pro">Address</label>
                                                    <input className="med-input-pro" placeholder="Full residential address" value={newStaff.address} onChange={e => setNewStaff({ ...newStaff, address: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Employment Details */}
                                    <div className="med-pro-form-section">
                                        <div className="med-section-header">
                                            <div className="med-section-number">2</div>
                                            <div className="med-section-title">
                                                <h4>Employment Details</h4>
                                                <p className="med-section-subtitle">Define staff position and responsibilities</p>
                                            </div>
                                        </div>
                                        <div className="med-grid-3">
                                            <div>
                                                <label className="med-label-pro">Staff ID</label>
                                                <input className="med-input-pro" value={newStaff.staffId} disabled style={{ background: 'var(--med-bg)' }} />
                                            </div>
                                            <div>
                                                <label className="med-label-pro">Role / Designation <span style={{ color: 'red' }}>*</span></label>
                                                <select className="med-input-pro" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}>
                                                    <option value="">Select Role</option>
                                                    <option>Lab Technician</option>
                                                    <option>Phlebotomist</option>
                                                    <option>Pathologist</option>
                                                    <option>Receptionist</option>
                                                    <option>Admin</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="med-label-pro">Department</label>
                                                <input className="med-input-pro" placeholder="e.g. Hematology" value={newStaff.department} onChange={e => setNewStaff({ ...newStaff, department: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="med-label-pro">Employment Type</label>
                                                <select className="med-input-pro" value={newStaff.type} onChange={e => setNewStaff({ ...newStaff, type: e.target.value })}>
                                                    <option>Full-time</option>
                                                    <option>Part-time</option>
                                                    <option>Contract</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="med-label-pro">Date of Joining</label>
                                                <input type="date" className="med-input-pro" value={newStaff.joiningDate} onChange={e => setNewStaff({ ...newStaff, joiningDate: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="med-label-pro">Experience (Yrs)</label>
                                                <input type="number" className="med-input-pro" placeholder="0" value={newStaff.experience} onChange={e => setNewStaff({ ...newStaff, experience: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>



                                    {/* 4. Shift & Availability */}
                                    <div className="med-pro-form-section">
                                        <div className="med-section-header">
                                            <div className="med-section-number">3</div>
                                            <div className="med-section-title">
                                                <h4>Shift & Availability</h4>
                                                <p className="med-section-subtitle">Enable scheduling and workload management</p>
                                            </div>
                                        </div>
                                        <div className="med-shift-selector">
                                            {['Morning', 'Evening', 'Night'].map(s => (
                                                <div key={s} className={`med-shift-option ${newStaff.shift === s ? 'active' : ''}`} onClick={() => setNewStaff({ ...newStaff, shift: s })}>
                                                    {s} Shift
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: '16px' }}>
                                            <label className="med-label-pro">Working Days</label>
                                            <div className="med-day-selector">
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                    <div key={day}
                                                        className={`med-day-chip ${newStaff.workingDays.includes(day) ? 'active' : ''}`}
                                                        onClick={() => {
                                                            const newDays = newStaff.workingDays.includes(day)
                                                                ? newStaff.workingDays.filter(d => d !== day)
                                                                : [...newStaff.workingDays, day];
                                                            setNewStaff({ ...newStaff, workingDays: newDays });
                                                        }}
                                                    >
                                                        {day.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="med-grid-2" style={{ marginTop: '20px' }}>
                                            <div>
                                                <label className="med-label-pro">Daily Working Hours</label>
                                                <input className="med-input-pro" value={newStaff.workingHours} onChange={e => setNewStaff({ ...newStaff, workingHours: e.target.value })} />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
                                                <label className="med-label-pro" style={{ marginBottom: 0 }}>Home Collection?</label>
                                                <label className="med-toggle-switch">
                                                    <input type="checkbox" checked={newStaff.homeCollection} onChange={e => setNewStaff({ ...newStaff, homeCollection: e.target.checked })} />
                                                    <span className="med-toggle-slider round"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. Skills */}
                                    <div className="med-pro-form-section">
                                        <div className="med-section-header">
                                            <div className="med-section-number">4</div>
                                            <div className="med-section-title">
                                                <h4>Skills & Specialization</h4>
                                                <p className="med-section-subtitle">Assign correct tests and responsibilities</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="med-label-pro">Specializations</label>
                                            <div className="med-tag-input">
                                                {newStaff.specializations.map((spec, i) => (
                                                    <div key={i} className="med-tag-chip">
                                                        {spec} <button onClick={() => {
                                                            const newSpecs = [...newStaff.specializations];
                                                            newSpecs.splice(i, 1);
                                                            setNewStaff({ ...newStaff, specializations: newSpecs });
                                                        }}>×</button>
                                                    </div>
                                                ))}
                                                <input
                                                    style={{ border: 'none', outline: 'none', flex: 1, minWidth: '100px', fontSize: '0.9rem' }}
                                                    placeholder="Type & press Enter (e.g. Biochemistry)"
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter' && e.target.value) {
                                                            setNewStaff({ ...newStaff, specializations: [...newStaff.specializations, e.target.value] });
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 6. Documents (Optional) */}
                                    <div className="med-pro-form-section">
                                        <div className="med-section-header">
                                            <div className="med-section-number">5</div>
                                            <div className="med-section-title">
                                                <h4>Documents Upload</h4>
                                                <p className="med-section-subtitle">Compliance and verification</p>
                                            </div>
                                        </div>
                                        <div className="med-drop-zone"
                                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                    const droppedFiles = Array.from(e.dataTransfer.files);
                                                    setNewStaff(prev => ({ ...prev, documents: [...prev.documents, ...droppedFiles] }));
                                                }
                                            }}
                                        >
                                            <Icons.UploadCloud size={32} color="#cbd5e1" />
                                            <p style={{ margin: '12px 0 4px', color: 'var(--med-text-body)', fontWeight: 600 }}>Drag & drop files here</p>
                                            <p style={{ margin: 0, color: 'var(--med-text-muted)', fontSize: '0.8rem' }}>ID Proof, Certificates, Medical License</p>

                                            <input
                                                type="file"
                                                id="staff-docs-upload"
                                                multiple
                                                hidden
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const selectedFiles = Array.from(e.target.files);
                                                        setNewStaff(prev => ({ ...prev, documents: [...prev.documents, ...selectedFiles] }));
                                                    }
                                                }}
                                            />
                                            <button className="med-btn-small secondary" style={{ marginTop: '16px' }} onClick={() => document.getElementById('staff-docs-upload').click()}>
                                                Browse Files
                                            </button>

                                            {/* File List Preview */}
                                            {newStaff.documents.length > 0 && (
                                                <div style={{ width: '100%', marginTop: '16px', textAlign: 'left' }}>
                                                    {newStaff.documents.map((file, index) => (
                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--med-bg)', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px', fontSize: '0.85rem' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                <Icons.FileText size={14} color="#64748b" />
                                                                {file.name}
                                                            </span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // prevent bubbling if needed
                                                                    setNewStaff(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== index) }));
                                                                }}
                                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                                            >
                                                                <Icons.Trash size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 7. Emergency Contact */}
                                    <div className="med-pro-form-section">
                                        <div className="med-section-header">
                                            <div className="med-section-number">6</div>
                                            <div className="med-section-title">
                                                <h4>Emergency Contact</h4>
                                                <p className="med-section-subtitle">Safety & HR compliance (Optional)</p>
                                            </div>
                                        </div>
                                        <div className="med-grid-3">
                                            <div>
                                                <label className="med-label-pro">Contact Name</label>
                                                <input className="med-input-pro" value={newStaff.emergencyName} onChange={e => setNewStaff({ ...newStaff, emergencyName: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="med-label-pro">Relationship</label>
                                                <input className="med-input-pro" value={newStaff.emergencyRelation} onChange={e => setNewStaff({ ...newStaff, emergencyRelation: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="med-label-pro">Phone Number</label>
                                                <input className="med-input-pro" value={newStaff.emergencyPhone} onChange={e => setNewStaff({ ...newStaff, emergencyPhone: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>


                                </div>

                                {/* Footer Actions */}
                                <div className="med-modal-footer-pro">
                                    <button className="med-btn-outlined danger" onClick={() => setShowAddStaffModal(false)}>Cancel</button>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button type="button" className="med-btn-gradient" onClick={handleAddStaff} disabled={isSavingStaff}>
                                            {isSavingStaff ? (
                                                <>
                                                    <Icons.Loader size={16} className="spin" /> Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Icons.CheckCircle size={16} /> Save & Activate Staff
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        );
    };

    const renderSettings = () => {
        const avgRating = (labSettings.feedback.reduce((acc, f) => acc + f.rating, 0) / labSettings.feedback.length).toFixed(1);

        const toggleTest = (id) => {
            setLabSettings(prev => ({
                ...prev,
                tests: prev.tests.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
            }));
            showToast("Test status updated successfully");
        };

        const toggleDay = (day) => {
            setLabSettings(prev => ({
                ...prev,
                workingDays: { ...prev.workingDays, [day]: !prev.workingDays[day] }
            }));
            showToast(`${day} status updated`);
        };

        return (
            <div className="med-settings-page" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="med-premium-header">
                    <div>
                        <h2 className="med-page-heading">Lab Configurations</h2>
                        <p className="med-page-subheading">Manage availability, tests, and view customer feedback</p>
                    </div>
                </div>

                {/* Settings Navigation */}
                <div className="med-filter-pills-row">
                    {[
                        { id: 'Feedback', label: 'Feedback & Ratings', icon: <Icons.Star size={18} /> },
                        { id: 'Hours', label: 'Working Hours & Days', icon: <Icons.Clock size={18} /> },
                        { id: 'Tests', label: 'Test Management', icon: <Icons.Flask size={18} /> }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            className={`med-filter-pill-item ${activeSettingsTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveSettingsTab(tab.id)}
                        >
                            {tab.icon}
                            {tab.label}
                        </div>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="med-settings-content">
                    {activeSettingsTab === 'Feedback' && (
                        <div className="med-feedback-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="med-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                <div className="med-stat-card">
                                    <div className="icon" style={{ background: '#fef3c7', color: '#d97706' }}><Icons.Star /></div>
                                    <div className="info">
                                        <div className="value">{avgRating} / 5.0</div>
                                        <div className="label">Average Rating</div>
                                    </div>
                                </div>
                                <div className="med-stat-card">
                                    <div className="icon" style={{ background: '#ecfdf5', color: '#059669' }}><Icons.MessageSquare /></div>
                                    <div className="info">
                                        <div className="value">{labSettings.feedback.length}</div>
                                        <div className="label">Total Reviews</div>
                                    </div>
                                </div>
                            </div>

                            <div className="med-table-card premium">
                                <div className="med-table-header" style={{ padding: '20px', borderBottom: '1px solid var(--med-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--med-text-main)' }}>Recent Feedback</h3>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div className="med-custom-filter-wrap">
                                            <Icons.Filter size={14} className="filter-icon" />
                                            <select
                                                className="med-select-mini attractive"
                                                value={feedbackFilter.rating}
                                                onChange={e => setFeedbackFilter({ ...feedbackFilter, rating: e.target.value })}
                                            >
                                                <option value="All">All Ratings</option>
                                                <option value="5">5 Stars Only</option>
                                                <option value="4">4+ Stars</option>
                                                <option value="3">3+ Stars</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '0 20px 20px' }}>
                                    {labSettings.feedback.map(f => (
                                        <div key={f.id} className="med-feedback-item" style={{ borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
                                            <div className="med-avatar-mini" style={{ width: '40px', height: '40px', background: 'var(--med-primary-light)', color: 'var(--med-primary)', flexShrink: 0 }}>
                                                {f.patient.charAt(0)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span style={{ fontWeight: 700, color: 'var(--med-text-main)' }}>{f.patient}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--med-text-muted)' }}>{f.date}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Icons.Star key={i} size={14} fill={i < f.rating ? "#f59e0b" : "none"} color={i < f.rating ? "#f59e0b" : "#cbd5e1"} />
                                                    ))}
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--med-text-body)', lineHeight: '1.5' }}>{f.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'Hours' && (
                        <div className="med-hours-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                            <div className="med-section-card">
                                <div className="med-card-header" style={{ marginBottom: '24px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Operating Hours</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>Define when patients can book appointments</p>
                                </div>
                                <div className="med-form-group">
                                    <label>Opening Time</label>
                                    <input type="time" className="med-input-pro" value={labSettings.workingHours.start} onChange={e => setLabSettings({ ...labSettings, workingHours: { ...labSettings.workingHours, start: e.target.value } })} />
                                </div>
                                <div className="med-form-group" style={{ marginTop: '16px' }}>
                                    <label>Closing Time</label>
                                    <input type="time" className="med-input-pro" value={labSettings.workingHours.end} onChange={e => setLabSettings({ ...labSettings, workingHours: { ...labSettings.workingHours, end: e.target.value } })} />
                                </div>
                                <button className="med-btn med-btn-primary" style={{ marginTop: '24px', width: '100%' }}>Update Hours</button>
                            </div>

                            <div className="med-section-card">
                                <div className="med-card-header" style={{ marginBottom: '24px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Active Working Days</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>Toggle availability for specific days</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {Object.entries(labSettings.workingDays).map(([day, enabled]) => (
                                        <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px' }}>
                                            <span style={{ fontWeight: 600 }}>{day}</span>
                                            <div onClick={() => toggleDay(day)} style={{ cursor: 'pointer', color: enabled ? 'var(--med-primary)' : '#94a3b8' }}>
                                                {enabled ? <Icons.ToggleRight size={32} /> : <Icons.ToggleLeft size={32} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSettingsTab === 'Tests' && (
                        <div className="med-tests-section">
                            <div className="med-table-card premium">
                                <table className="med-table premium-table">
                                    <thead>
                                        <tr>
                                            <th>Test Name</th>
                                            <th>Category</th>
                                            <th>Current Status</th>
                                            <th style={{ textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labSettings.tests.map(test => (
                                            <tr key={test.id}>
                                                <td style={{ fontWeight: 600 }}>{test.name}</td>
                                                <td><span className="med-tag" style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>{test.category}</span></td>
                                                <td>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                        color: test.enabled ? 'var(--med-success)' : 'var(--med-error)',
                                                        fontSize: '0.85rem', fontWeight: 600
                                                    }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                        {test.enabled ? 'Available' : 'Disabled'}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button
                                                        className={`med-btn ${test.enabled ? 'med-btn-danger' : 'med-btn-success'}`}
                                                        style={{ padding: '6px 14px', fontSize: '0.8rem', minWidth: '100px' }}
                                                        onClick={() => toggleTest(test.id)}
                                                    >
                                                        {test.enabled ? 'Disable' : 'Enable'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderProfile = () => (
        <div className="med-form-grid">
            {/* Lab Admin Profile */}
            <div className="med-section-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ background: '#f0fdfa', padding: '10px', borderRadius: '12px', color: 'var(--med-primary)' }}>
                        <Icons.User />
                    </div>
                    <div>
                        <h3 className="med-table-title" style={{ fontSize: '1.1rem' }}>Admin Details</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>Manage your personal account information.</p>
                    </div>
                </div>

                <div className="med-form-group">
                    <label>Admin Name</label>
                    <input type="text" value={profileData.admin_name} onChange={e => setProfileData({ ...profileData, admin_name: e.target.value })} placeholder="Enter Admin Name" />
                </div>
                <div className="med-form-group">
                    <label>Email Address</label>
                    <input type="email" value={profileData.email} disabled />
                    <small style={{ display: 'block', marginTop: '6px', color: 'var(--med-text-muted)' }}>* Email cannot be changed</small>
                </div>
            </div>

            {/* Lab Profile */}
            <div className="med-section-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', color: '#3b82f6' }}>
                        <Icons.Activity />
                    </div>
                    <div>
                        <h3 className="med-table-title" style={{ fontSize: '1.1rem' }}>Laboratory Info</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>Update your lab's public details.</p>
                    </div>
                </div>

                <div className="med-form-group">
                    <label>Lab Name</label>
                    <input type="text" value={profileData.lab_name} onChange={e => setProfileData({ ...profileData, lab_name: e.target.value })} />
                </div>
                <div className="med-form-group">
                    <label>Physical Address</label>
                    <input type="text" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} />
                </div>
                <div className="med-form-group">
                    <label>Contact Number</label>
                    <input type="text" value={profileData.contact} onChange={e => setProfileData({ ...profileData, contact: e.target.value })} />
                </div>
                <div className="med-form-actions" style={{ paddingTop: '16px' }}>
                    <button className="med-btn med-btn-primary" style={{ width: '100%' }} onClick={handleSaveProfile}>
                        <Icons.CheckCircle /> Save Changes
                    </button>
                </div>
            </div>

            <div className="med-section-card" style={{ height: 'fit-content' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '12px', color: '#ef4444' }}>
                        <Icons.Settings />
                    </div>
                    <h3 className="med-table-title">System Actions</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--med-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                    Securely sign out of your session. Unsaved changes in other sections may be lost.
                </p>
                <button className="med-btn med-btn-danger" onClick={handleLogout}>
                    <Icons.LogOut /> Sign Out
                </button>
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
                                        <label style={{ fontSize: '0.8rem', color: 'var(--med-text-muted)' }}>Email</label>
                                        <div style={{ fontWeight: 500 }}>{patientHistory.details.email}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--med-text-muted)' }}>Phone</label>
                                        <div style={{ fontWeight: 500 }}>{patientHistory.details.phone || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--med-text-muted)' }}>Patient ID</label>
                                        <div style={{ fontWeight: 500 }}>#{patientHistory.details.id}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Prescriptions (WhatsApp Images) */}
                            <div className="med-section-card" style={{ marginBottom: '20px' }}>
                                <h4 style={{ marginBottom: '15px', color: 'var(--med-primary)' }}>Prescriptions & Uploads</h4>
                                {patientHistory.prescriptions.length === 0 ? (
                                    <p style={{ color: 'var(--med-text-muted)' }}>No uploaded prescriptions.</p>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                        {patientHistory.prescriptions.map(rx => (
                                            <div key={rx.id} style={{ border: '1px solid var(--med-border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--med-surface)', display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ height: '140px', background: 'var(--med-bg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--med-text-main)' }}>{rx.type || 'Prescription'}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)' }}>{rx.date}</div>
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
                                                            style={{ flex: 1, padding: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'var(--med-surface)', border: '1px solid var(--med-border)', color: 'var(--med-text-main)' }}
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
                                    <p style={{ color: 'var(--med-text-muted)' }}>No past appointments.</p>
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
                                                        <small style={{ color: 'var(--med-text-muted)' }}>{appt.time}</small>
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

    const handleGenerateBill = (appointment) => {
        showToast(`Generating bill for ${appointment.patient || 'Patient'}...`, "success");
        // Integration point for PDF generation
    };

    const renderPayments = () => {
        const todayStr = new Date().toISOString().split('T')[0];

        // Helper to check if a date is within this week
        const isThisWeek = (dateStr) => {
            const date = new Date(dateStr);
            const today = new Date();
            const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
            return date >= firstDay;
        };

        // Helper to check if a date is within this month
        const isThisMonth = (dateStr) => {
            const date = new Date(dateStr);
            const today = new Date();
            return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        };

        const filteredPaymentsByDate = (appointments || []).filter(a => {
            if (paymentDateFilter === 'Today') return a.date === todayStr;
            if (paymentDateFilter === 'This Week') return isThisWeek(a.date);
            if (paymentDateFilter === 'This Month') return isThisMonth(a.date);
            return true; // All Time
        });

        const filteredPayments = filteredPaymentsByDate.filter(a =>
            String(a.patient || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(a.id || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="med-payments-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="med-premium-header" style={{ marginBottom: 0 }}>
                    <div>
                        <h2 className="med-page-heading">Financial Settlements</h2>
                        <p className="med-page-subheading">Track transactions, pending dues, and generate invoices</p>
                    </div>
                </div>

                {/* Attractive Date Filter Pills */}
                <div className="med-filter-pills-row">
                    {[
                        { label: 'All Time', id: 'All Time', icon: '📅' },
                        { label: 'Today', id: 'Today', icon: '☀️' },
                        { label: 'This Week', id: 'This Week', icon: '📊' },
                        { label: 'This Month', id: 'This Month', icon: '🌙' }
                    ].map(pill => (
                        <div
                            key={pill.id}
                            className={`med-filter-pill-item ${paymentDateFilter === pill.id ? 'active' : ''}`}
                            onClick={() => setPaymentDateFilter(pill.id)}
                        >
                            <span style={{ marginRight: '6px' }}>{pill.icon}</span>
                            {pill.label}
                            <span className="pill-count">
                                {(appointments || []).filter(a => {
                                    if (pill.id === 'Today') return a.date === todayStr;
                                    if (pill.id === 'This Week') return isThisWeek(a.date);
                                    if (pill.id === 'This Month') return isThisMonth(a.date);
                                    return true;
                                }).length}
                            </span>
                        </div>
                    ))}
                </div>

                {filteredPayments.length === 0 ? (
                    <div className="med-empty-state" style={{ background: 'var(--med-surface)', padding: '80px 40px', textAlign: 'center', borderRadius: '24px' }}>
                        <div style={{ width: 100, height: 100, background: 'var(--med-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <Icons.CreditCard size={48} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--med-text-main)', marginBottom: '12px' }}>No transactions found</h3>
                        <p style={{ color: 'var(--med-text-muted)', maxWidth: '400px', margin: '0 auto' }}>Sync data from Appointments to begin managing settlements.</p>
                    </div>
                ) : (
                    <div className="med-table-card premium">
                        <table className="med-table premium-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Transaction ID</th>
                                    <th>Date & Time</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(appt => (
                                    <tr key={appt.id} className="med-table-row">
                                        <td>
                                            <div className="med-user-cell">
                                                <div className="med-avatar-mini" style={{ background: '#f8fafc', color: '#64748b' }}>
                                                    {appt.patient ? appt.patient.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div className="info">
                                                    <span className="name">{appt.patient || 'Unknown Patient'}</span>
                                                    <span className="sub-text">{appt.test || 'General Test'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="mono-text" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--med-primary)' }}>
                                                #{String(appt.id || '').toUpperCase().slice(-8)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{appt.date}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)' }}>{appt.time}</div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: 'var(--med-text-main)', fontSize: '1rem' }}>₹{appt.amount || '750'}</span>
                                        </td>
                                        <td>
                                            <span className={`med-status-badge ${(appt.paymentStatus || appt.status || '').toLowerCase().replace(' ', '-')}`} style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                                                background: (appt.paymentStatus === 'Paid' || appt.status === 'Completed') ? '#dcfce7' : (appt.status === 'Cancelled' ? '#fee2e2' : '#fef9c3'),
                                                color: (appt.paymentStatus === 'Paid' || appt.status === 'Completed') ? '#15803d' : (appt.status === 'Cancelled' ? '#dc2626' : '#854d0e')
                                            }}>
                                                {(appt.paymentStatus === 'Paid' || appt.status === 'Completed') ? 'Paid' : (appt.status === 'Cancelled' ? 'Cancelled' : 'Pending')}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div className="med-action-group">
                                                <button
                                                    className="med-btn-icon"
                                                    title="View Bill"
                                                    onClick={() => { setSelectedPaymentBill(appt); setShowBillModal(true); }}
                                                >
                                                    <Icons.Eye size={18} />
                                                </button>
                                                <button
                                                    className="med-btn-icon info"
                                                    title="Generate Invoice"
                                                    onClick={() => handleGenerateBill(appt)}
                                                    disabled={appt.status === 'Cancelled'}
                                                >
                                                    <Icons.FileText size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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

                    {activeSection === 'Payments' && renderPayments()}
                </div>
            </main>

            {/* Modals */}
            {renderPatientHistoryModal()}
            {renderBillModal()}

            {notification && (
                <div className="med-toast" style={{ background: notification.type === 'error' ? 'var(--med-error)' : 'var(--med-primary)' }}>
                    {notification.message}
                </div>
            )}

            {/* Upload Report Modal */}
            {showUploadModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="med-modal-animate" style={{
                        background: 'var(--med-surface)', padding: '2rem', borderRadius: '16px', width: '450px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--med-text-main)', fontSize: '1.25rem' }}>Upload Patient Report</h3>
                            <button onClick={() => setShowUploadModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--med-text-muted)', cursor: 'pointer' }}>
                                <Icons.X size={20} />
                            </button>
                        </div>

                        {!uploadData.patient_id && (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--med-text-body)' }}>Select Patient</label>
                                <select
                                    value={uploadData.patient_id}
                                    onChange={e => setUploadData({ ...uploadData, patient_id: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--med-border)', fontSize: '0.95rem', outline: 'none' }}
                                >
                                    <option value="">-- Choose Patient --</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--med-text-body)' }}>Test Name</label>
                            <div className="med-input-container">
                                <Icons.Activity className="med-input-icon" size={18} />
                                <input type="text" placeholder="e.g. Complete Blood Count" value={uploadData.test_name}
                                    onChange={e => setUploadData({ ...uploadData, test_name: e.target.value })}
                                    className="med-input-enhanced med-input-with-icon"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--med-text-body)' }}>Report File (Uploads)</label>
                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', background: 'var(--med-bg)', cursor: 'pointer' }}>
                                <input type="file"
                                    id="report-file-upload"
                                    accept="application/pdf"
                                    onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="report-file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <Icons.UploadCloud size={32} color="#64748b" />
                                    <span style={{ color: 'var(--med-text-muted)', fontSize: '0.9rem' }}>
                                        {uploadData.file ? uploadData.file.name : "Click to select file"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="med-btn bg-gray" onClick={() => setShowUploadModal(false)}>Cancel</button>
                            <button className="med-btn med-btn-primary" onClick={handleUploadReport} disabled={!uploadData.patient_id || !uploadData.file || !uploadData.test_name} style={{ opacity: (!uploadData.patient_id || !uploadData.file || !uploadData.test_name) ? 0.6 : 1 }}>
                                <Icons.Check size={18} /> Upload Report
                            </button>
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
                                background: 'var(--med-surface)', width: '1000px', maxWidth: '95vw', height: '85vh',
                                borderRadius: '24px', display: 'flex', flexDirection: 'column',
                                overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--med-border)'
                            }}>
                                {/* New Header Design */}
                                <div style={{ padding: '24px 32px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'start', background: 'var(--med-surface)' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--med-text-main)', margin: 0, letterSpacing: '-0.02em' }}>{selectedPatient.name}</h2>
                                        <p style={{ color: 'var(--med-text-muted)', margin: '4px 0 0', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                                    <button onClick={() => setShowPatientHistoryModal(false)} style={{ background: 'var(--med-bg)', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', color: 'var(--med-text-muted)', transition: 'all 0.2s' }}>
                                        <Icons.X size={20} />
                                    </button>
                                </div>

                                {/* Main Content Layout */}
                                <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '32px', gap: '32px', background: 'var(--med-surface)' }}>
                                    {/* Left: Personal Details Cards */}
                                    <div className="med-scrollbar-hidden" style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0, overflowY: 'auto', paddingRight: '4px' }}>
                                        <h4 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: 'var(--med-text-main)' }}>Personal Details</h4>

                                        {/* Age Card */}
                                        <div style={{ background: 'var(--med-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--med-border)', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)' }}>
                                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--med-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>AGE</span>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--med-text-main)' }}>{selectedPatient.age && selectedPatient.age !== 'N/A' ? `${selectedPatient.age} Years` : 'N/A'}</div>
                                        </div>

                                        {/* Gender Card */}
                                        <div style={{ background: 'var(--med-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--med-border)', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)' }}>
                                            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--med-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>GENDER</span>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--med-text-main)' }}>{selectedPatient.gender || 'N/A'}</div>
                                        </div>

                                        {/* Contact / Info Card */}
                                        <div style={{ background: 'var(--med-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--med-border)', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--med-text-muted)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>CONTACT</span>
                                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--med-text-main)' }}>{selectedPatient.phone || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--med-text-muted)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>BLOOD GROUP</span>
                                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--med-text-main)' }}>{selectedPatient.blood_group || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--med-text-muted)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>ADDRESS</span>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--med-text-main)', lineHeight: '1.4' }}>{selectedPatient.address || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Reports Section */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        {/* Tabs */}
                                        <div style={{ background: 'var(--med-bg)', padding: '4px', borderRadius: '12px', display: 'inline-flex', alignSelf: 'start', marginBottom: '24px', border: '1px solid var(--med-border)' }}>
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
                                                                background: 'var(--med-surface)', border: '1px solid var(--med-border)', borderRadius: '16px', overflow: 'hidden',
                                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.01)',
                                                                transition: 'transform 0.2s', cursor: 'default'
                                                            }}>
                                                                {/* Image Preview */}
                                                                <div style={{ height: '180px', background: 'var(--med-bg)', position: 'relative', overflow: 'hidden' }}>
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
                                                                    <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--med-text-main)' }}>{report.type || 'General Lab Test'}</h4>
                                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--med-text-muted)', fontWeight: 500 }}>{report.date ? new Date(report.date).toLocaleDateString() : 'Unknown Date'}</p>

                                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                                                                        <a
                                                                            href={report.image_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                                                padding: '10px', borderRadius: '8px', border: '1px solid #0d9488',
                                                                                background: 'var(--med-surface)', color: '#0d9488', textDecoration: 'none',
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
                                                        <div style={{ gridColumn: '1 / -1', padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0', borderRadius: '16px', color: 'var(--med-text-muted)' }}>
                                                            <Icons.FileText size={48} style={{ opacity: 0.2 }} />
                                                            <p style={{ marginTop: '16px', fontWeight: 500 }}>No uploaded reports found used.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {/* Placeholder for Generated Reports to match style if needed, or keep list */}
                                                    <div style={{ padding: '48px', textAlign: 'center', background: 'var(--med-bg)', borderRadius: '16px', color: 'var(--med-text-muted)' }}>
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
                    <div className="med-modal-animate med-scrollbar-hidden" style={{ background: 'var(--med-surface)', borderRadius: '20px', width: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: 0 }}>
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
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Full Name *</label>
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
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Age</label>
                                        <input
                                            type="number"
                                            className="med-input-enhanced"
                                            value={newBooking.age}
                                            onChange={e => setNewBooking({ ...newBooking, age: e.target.value })}
                                            placeholder="Ex: 25"
                                        />
                                    </div>
                                    <div className="med-form-group">
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Gender</label>
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
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Contact Number</label>
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
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Test Requirements *</label>
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
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Preferred Date *</label>
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
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Preferred Time *</label>
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
                                <button className="med-btn" onClick={() => setShowBookingModal(false)} style={{ background: 'var(--med-surface)', border: '1px solid var(--med-border)', color: 'var(--med-text-muted)' }}>Cancel</button>
                                <button className="med-btn med-btn-primary" onClick={handleSaveBooking} style={{ minWidth: '160px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(13, 118, 110, 0.2)' }}>
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Appointment Details Modal --- */}
            {detailsModalOpen && selectedAppointment && (
                <div className="med-modal-overlay">
                    <div className="med-modal" style={{ width: '800px', maxWidth: '95%' }}>
                        <div className="med-modal-header">
                            <h3>Appointment Details - {selectedAppointment.id}</h3>
                            <button className="med-close-btn" onClick={() => setDetailsModalOpen(false)}>×</button>
                        </div>
                        <div className="med-modal-body">
                            <div className="med-details-grid">
                                <div className="detail-section">
                                    <h4>Patient Information</h4>
                                    <div className="info-row">
                                        <label>Name:</label> <span>{selectedAppointment.patient}</span>
                                    </div>
                                    <div className="info-row">
                                        <label>Contact:</label> <span>{selectedAppointment.contact || 'N/A'}</span>
                                    </div>

                                    <h4 style={{ marginTop: '20px' }}>Test Details</h4>
                                    <div className="info-row">
                                        <label>Test Type:</label> <span>{selectedAppointment.test}</span>
                                    </div>
                                    <div className="info-row">
                                        <label>Source:</label> <span>{selectedAppointment.source}</span>
                                    </div>
                                </div>

                                <div className="detail-section border-left">
                                    <h4>Work Status</h4>
                                    <div className="med-form-group">
                                        <label>Status</label>
                                        <select
                                            value={selectedAppointment.status}
                                            onChange={(e) => {
                                                const updated = { ...selectedAppointment, status: e.target.value };
                                                setSelectedAppointment(updated);
                                                handleStatusChange(selectedAppointment.id, e.target.value);
                                            }}
                                            className="med-input"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Sample Collected">Sample Collected</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="med-form-group">
                                        <label>Assigned Technician</label>
                                        <select
                                            className="med-input"
                                            value={selectedAppointment.technician}
                                            onChange={async (e) => {
                                                const newVal = e.target.value;
                                                setSelectedAppointment(prev => ({ ...prev, technician: newVal }));
                                                // API Call to update details
                                                await fetch(`http://localhost:5000/api/admin/appointments/${selectedAppointment.id.replace('A-', '')}/details`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ technician: newVal }),
                                                    credentials: 'include'
                                                });
                                                // Refresh list in background
                                                const res = await fetch('http://localhost:5000/api/admin/appointments', { credentials: 'include' });
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    const filtered = data.filter(a =>
                                                        (a.labName && a.labName.includes('Royal')) ||
                                                        (a.location && a.location.toLowerCase().includes('kanjirapally'))
                                                    );
                                                    setAppointments(filtered);
                                                }
                                            }}
                                        >
                                            <option value="Unassigned">Unassigned</option>
                                            {staff.map(s => (
                                                <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="med-form-group">
                                        <label>Payment Status</label>
                                        <select
                                            className="med-input"
                                            value={selectedAppointment.paymentStatus}
                                            onChange={async (e) => {
                                                const newVal = e.target.value;
                                                setSelectedAppointment(prev => ({ ...prev, paymentStatus: newVal }));
                                                await fetch(`http://localhost:5000/api/admin/appointments/${selectedAppointment.id.replace('A-', '')}/details`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ paymentStatus: newVal }),
                                                    credentials: 'include'
                                                });
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Insurance">Insurance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="med-modal-footer">
                            <button className="med-btn bg-gray" onClick={() => setDetailsModalOpen(false)}>Close</button>
                            <button className="med-btn med-btn-primary" onClick={async () => {
                                // Save all changes if needed, mainly closes modal as individual fields adhere to fast updates or implement 'Save All' here
                                setDetailsModalOpen(false);
                            }}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && statusUpdateAppointment && (
                <div className="med-modal-overlay">
                    <div className="med-modal-content" style={{ maxWidth: '500px' }}>
                        <div className="med-modal-header">
                            <h3>Update Appointment Status</h3>
                            <button className="med-icon-btn" onClick={() => setShowStatusModal(false)}>
                                <Icons.X />
                            </button>
                        </div>
                        <div className="med-modal-body">
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ color: 'var(--med-text-muted)', marginBottom: '8px' }}>
                                    <strong>Patient:</strong> {statusUpdateAppointment.patient}
                                </p>
                                <p style={{ color: 'var(--med-text-muted)', marginBottom: '8px' }}>
                                    <strong>Test:</strong> {statusUpdateAppointment.test}
                                </p>
                                <p style={{ color: 'var(--med-text-muted)' }}>
                                    <strong>Date:</strong> {statusUpdateAppointment.date} at {statusUpdateAppointment.time}
                                </p>
                            </div>

                            <div className="med-form-group">
                                <label>Select New Status</label>
                                <select
                                    className="med-input"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Sample Collected">Sample Collected</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="med-modal-footer">
                            <button
                                className="med-btn bg-gray"
                                onClick={() => setShowStatusModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="med-btn med-btn-primary"
                                onClick={handleUpdateStatus}
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabAdminDashboard;
