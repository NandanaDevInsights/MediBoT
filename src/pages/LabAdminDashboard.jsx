
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabAdminDashboard.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
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
    Plus: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    ),
    Lock: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    ),
    ChevronLeft: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6" /></svg>
    ),
    ChevronRight: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6" /></svg>
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
    HelpCircle: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
    ),
    BriefcaseMedical: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 11v4" /><path d="M14 13h-4" /><rect width="16" height="12" x="4" y="9" rx="2" /><path d="M9 9V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /></svg>
    ),
    BarChart: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18" /><path d="M7 16v-4" /><path d="M11 16V9" /><path d="M15 16V5" /><path d="M19 16v-7" /></svg>
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
    ChevronLeft: (props) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6" /></svg>
    ),
    Slash: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="4.93" x2="19.07" y1="4.93" y2="19.07" /></svg>
    ),
    Edit: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    ),
    Sun: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
    ),
    Moon: (props) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" /></svg>
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

const TEST_PRICING = {
    "Blood Tests": [
        { name: "Complete Blood Count (CBC)", price: 300 },
        { name: "Hemoglobin (Hb)", price: 150 },
        { name: "Blood Group & Rh Factor", price: 200 },
        { name: "ESR (Erythrocyte Sedimentation Rate)", price: 100 },
        { name: "Peripheral Smear", price: 250 },
        { name: "Fasting Blood Sugar (FBS)", price: 80 },
        { name: "Postprandial Blood Sugar (PPBS)", price: 80 },
        { name: "Random Blood Sugar (RBS)", price: 70 },
        { name: "HbA1c", price: 400 },
        { name: "Lipid Profile", price: 600 },
        { name: "Liver Function Test (LFT)", price: 700 },
        { name: "Kidney Function Test (KFT)", price: 650 },
        { name: "Thyroid Profile (T3, T4, TSH)", price: 500 },
        { name: "C-Reactive Protein (CRP)", price: 350 },
        { name: "Widal Test", price: 200 },
        { name: "VDRL", price: 250 },
        { name: "HIV", price: 500 },
        { name: "HBsAg", price: 350 },
        { name: "Anti-HCV", price: 450 },
        { name: "Dengue (NS1, IgG, IgM)", price: 850 },
        { name: "Malaria (Antigen / Smear)", price: 300 },
        { name: "PT / INR", price: 250 }
    ],
    "Urine Tests": [
        { name: "Urine Routine Examination", price: 150 },
        { name: "Urine Microscopy", price: 180 },
        { name: "Urine Sugar", price: 100 },
        { name: "Urine Protein / Albumin", price: 120 },
        { name: "Ketone Bodies", price: 150 },
        { name: "Bile Salts & Bile Pigments", price: 200 },
        { name: "Urine Culture & Sensitivity", price: 600 },
        { name: "Pregnancy Test (hCG)", price: 250 },
        { name: "Microalbuminuria", price: 400 },
        { name: "24-Hour Urine Protein", price: 500 },
        { name: "Creatinine Clearance", price: 450 }
    ],
    "Sputum Tests": [
        { name: "Sputum AFB (ZN Stain)", price: 200 },
        { name: "Sputum AFB (Fluorescent)", price: 350 },
        { name: "CBNAAT / GeneXpert", price: 1500 },
        { name: "Sputum Culture & Sensitivity", price: 700 },
        { name: "Gram Stain", price: 150 },
        { name: "Fungal Culture", price: 800 },
        { name: "Sputum Cytology", price: 600 }
    ],
    "Stool Tests": [
        { name: "Stool Routine Examination", price: 180 },
        { name: "Stool Microscopy", price: 200 },
        { name: "Ova & Cyst", price: 250 },
        { name: "Stool Culture", price: 650 },
        { name: "Occult Blood Test", price: 220 },
        { name: "H. pylori Antigen (Stool)", price: 850 },
        { name: "Fecal Fat", price: 400 },
        { name: "Calprotectin", price: 1200 },
        { name: "Reducing Substances", price: 300 }
    ],
    "Scanning": [
        { name: "X-Ray Chest", price: 500 },
        { name: "USG Abdomen", price: 1200 },
        { name: "CT Scan Brain", price: 3500 },
        { name: "MRI Spine", price: 6500 },
        { name: "ECG", price: 300 },
        { name: "Echo Cardiogram", price: 1500 }
    ]
};

const TEST_CATEGORIES = {
    "Blood Tests": TEST_PRICING["Blood Tests"].map(test => test.name),
    "Urine Tests": TEST_PRICING["Urine Tests"].map(test => test.name),
    "Sputum Tests": TEST_PRICING["Sputum Tests"].map(test => test.name),
    "Stool Tests": TEST_PRICING["Stool Tests"].map(test => test.name),
    "Scanning": TEST_PRICING["Scanning"].map(test => test.name)
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
    const [activePatientTab, setActivePatientTab] = useState('All Patients');

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
    const [reportsPage, setReportsPage] = useState(1);
    const reportsPerPage = 10;

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
        category: '',
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


    // --- Payments & Settings States ---
    const [paymentsData, setPaymentsData] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [paymentDateFilter, setPaymentDateFilter] = useState('All Time'); // Payment specific filter
    const [labSettings, setLabSettings] = useState({
        workingHours: { start: '09:00', end: '17:00' },
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        holidays: [],
        feedback: [],
        testManagement: []
    });
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [settingsActiveTab, setSettingsActiveTab] = useState('WorkingHours'); // Feedback, WorkingHours, TestManagement
    const [testCategoryFilter, setTestCategoryFilter] = useState('All');
    const [selectedManagementCategory, setSelectedManagementCategory] = useState('All');
    const [showBillModal, setShowBillModal] = useState(false);
    const [selectedPaymentBill, setSelectedPaymentBill] = useState(null);
    const [editingTest, setEditingTest] = useState(null);
    const [newTestPrice, setNewTestPrice] = useState('');

    // --- Token System State ---
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [tokenLabCapacity, setTokenLabCapacity] = useState(10);
    const [bookedTokens, setBookedTokens] = useState([]); // Array of token numbers that are booked
    const [currentTokenData, setCurrentTokenData] = useState(null); // { labName, date, time, userId }
    const [isBookingToken, setIsBookingToken] = useState(false);

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
                if (activeSection === 'Appointments') url = 'http://localhost:5000/api/admin/appointments';
                if (activeSection === 'Test Orders') url = 'http://localhost:5000/api/admin/test-orders';
                if (activeSection === 'Lab Staff') url = 'http://localhost:5000/api/admin/staff';
                if (url || activeSection === 'Reports') {
                    const fetchUrl = activeSection === 'Reports' ? 'http://localhost:5000/api/admin/reports' : url;
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

                    if (activeSection === 'Appointments' && Array.isArray(data)) {
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
                    if (activeSection === 'Reports' && Array.isArray(data)) setReports(data);
                }
                if (activeSection === 'Lab Staff') setLoadingStaff(false);
            } catch (err) {
                console.error(err);
                if (activeSection === 'Lab Staff') setLoadingStaff(false);
                if (activeSection !== 'Settings') showToast(err.message || `Failed to load ${activeSection}`, "error");
            }
        };

        if (activeSection === 'Lab Staff') setLoadingStaff(true);

        if (activeSection === 'Payments') {
            setLoadingPayments(true);
            fetch('http://localhost:5000/api/admin/payments', { credentials: 'include' })
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setPaymentsData(data); })
                .catch(err => console.error('Payments fetch error', err))
                .finally(() => setLoadingPayments(false));
        } else if (activeSection === 'Settings') {
            setLoadingSettings(true);
            Promise.all([
                fetch('http://localhost:5000/api/lab-feedback', { credentials: 'include' }).then(r => r.ok ? r.json() : { feedback: [] }).catch(() => ({ feedback: [] })),
                fetch('http://localhost:5000/api/admin/lab-settings', { credentials: 'include' }).then(r => r.ok ? r.json() : null).catch(() => null)
            ]).then(([fbData, settingsData]) => {
                const feedbackArr = Array.isArray(fbData?.feedback) ? fbData.feedback.map(f => ({
                    id: f.id, patient: f.patient_name || 'Anonymous',
                    rating: Number(f.rating) || 0, comment: f.comment || '',
                    date: f.created_at ? String(f.created_at).split('T')[0] : '',
                    category: f.category || 'General'
                })) : [];
                setLabSettings(prev => ({
                    ...prev,
                    workingHours: settingsData?.workingHours || prev.workingHours || { start: '09:00', end: '19:00' },
                    workingDays: Array.isArray(settingsData?.workingDays) ? settingsData.workingDays : (prev.workingDays || []),
                    holidays: Array.isArray(settingsData?.holidays) ? settingsData.holidays : [],
                    disabledTests: Array.isArray(settingsData?.tests) ? settingsData.tests : [],
                    feedback: feedbackArr
                }));
            }).catch(err => console.error('Settings fetch error', err))
                .finally(() => setLoadingSettings(false));
        } else if (activeSection === 'Patients') {
            setLoadingPatients(true);
            fetch('http://localhost:5000/api/admin/patients', { credentials: 'include' })
                .then(res => {
                    if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
                    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
                    return res.json();
                })
                .then(data => { if (Array.isArray(data)) setPatients(data); })
                .catch(err => { if (err.message === "Unauthorized") navigate('/admin/login'); else showToast("Failed to load patients", "error"); })
                .finally(() => setLoadingPatients(false));
        } else {
            fetchSectionData();
        }

    }, [activeSection, navigate]);

    // Reset reports page on search or section change
    useEffect(() => {
        setReportsPage(1);
    }, [searchTerm, activeSection]);

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
                    tests: Array.isArray(newBooking.test) ? newBooking.test : [newBooking.test],
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
                setNewBooking({ patientName: '', age: '', gender: 'Male', contact: '', category: '', test: '', date: '', time: '', doctor: '' });
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
                fetch('http://localhost:5000/api/admin/appointments', { credentials: 'include' }).then(r => r.json()).then(setAppointments);
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

    // --- Token System Actions ---
    const fetchTokens = async (labName, date, time) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/tokens?lab_name=${encodeURIComponent(labName)}&date=${date}&time=${time}`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                // data is array of { token_number, slot_status, user_id }
                const booked = data.filter(t => t.slot_status === 'booked').map(t => parseInt(t.token_number));
                setBookedTokens(booked);
                if (data.length > 0 && data[0].num_seats) {
                    setTokenLabCapacity(data[0].num_seats);
                }
            }
        } catch (e) {
            console.error("Fetch tokens error:", e);
        }
    };

    const handleOpenTokenModal = (appt) => {
        setCurrentTokenData({
            labName: appt.labName || profileData.lab_name,
            date: appt.date,
            time: appt.time,
            userId: appt.user_id || null
        });
        setBookedTokens([]);
        setTokenLabCapacity(10); // Default
        fetchTokens(appt.labName || profileData.lab_name, appt.date, appt.time);
        setShowTokenModal(true);
    };

    const handleBookToken = async (tokenNumber) => {
        if (!currentTokenData) return;
        setIsBookingToken(true);
        try {
            const res = await fetch('http://localhost:5000/api/admin/tokens/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lab_name: currentTokenData.labName,
                    date: currentTokenData.date,
                    time: currentTokenData.time,
                    token_number: tokenNumber,
                    user_id: currentTokenData.userId,
                    num_seats: tokenLabCapacity
                }),
                credentials: 'include'
            });

            if (res.ok) {
                showToast(`Token ${tokenNumber} booked successfully`);
                fetchTokens(currentTokenData.labName, currentTokenData.date, currentTokenData.time);
                // Also refresh main appts list to get the updated tokenNumber
                const url = 'http://localhost:5000/api/admin/appointments';
                const apptsRes = await fetch(url, { credentials: 'include' });
                if (apptsRes.ok) {
                    const data = await apptsRes.json();
                    setAppointments(data);
                }
            } else {
                showToast("Failed to book token", "error");
            }
        } catch (e) {
            console.error("Book token error:", e);
            showToast("Error booking token", "error");
        } finally {
            setIsBookingToken(false);
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
        const topMenuItems = [
            { name: 'Overview', icon: <Icons.Dashboard />, section: 'Overview' },
            { name: 'Appointments', icon: <Icons.Calendar />, section: 'Appointments' },
            { name: 'Patients', icon: <Icons.Users />, section: 'Patients' },
            { name: 'Reports', icon: <Icons.BarChart />, section: 'Reports' },
            { name: 'Test Orders', icon: <Icons.Flask />, section: 'Test Orders' },
            { name: 'Lab Staff', icon: <Icons.BriefcaseMedical />, section: 'Lab Staff' },
            { name: 'Payments', icon: <Icons.CreditCard />, section: 'Payments' },
        ];

        const bottomMenuItems = [
            { name: 'Settings', icon: <Icons.Settings />, section: 'Settings' },
        ];

        return (
            <aside className={`med-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{
                width: '260px',
                background: '#fff',
                borderRight: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 16px'
            }}>
                {/* Brand Area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px', padding: '0 8px' }}>
                    <img src={logoImage} alt="MediBot" style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'contain' }} />
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1 }}>MediBot</h1>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '4px 0 0 0' }}>Lab Management</p>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {topMenuItems.map(item => (
                            <li
                                key={item.name}
                                onClick={() => setActiveSection(item.section)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: activeSection === item.section ? 700 : 600,
                                    color: activeSection === item.section ? '#fff' : '#64748b',
                                    background: activeSection === item.section ? '#2563eb' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ display: 'flex' }}>
                                    {React.cloneElement(item.icon, {
                                        size: 20,
                                        strokeWidth: activeSection === item.section ? 2.5 : 2
                                    })}
                                </span>
                                {item.name}
                            </li>
                        ))}
                    </ul>

                    {/* Divider */}
                    <div style={{ margin: '24px 8px', height: '1px', background: '#f1f5f9' }}></div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {bottomMenuItems.map(item => (
                            <li
                                key={item.name}
                                onClick={() => setActiveSection(item.section)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: activeSection === item.section ? 700 : 600,
                                    color: activeSection === item.section ? '#fff' : '#64748b',
                                    background: activeSection === item.section ? '#2563eb' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ display: 'flex' }}>
                                    {React.cloneElement(item.icon, {
                                        size: 20,
                                        strokeWidth: activeSection === item.section ? 2.5 : 2
                                    })}
                                </span>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Collapse/Toggle button removed from header style and kept for logic if needed, but the visual matches the image now */}
                {window.innerWidth < 1024 && (
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        style={{ position: 'absolute', top: '24px', right: '16px', background: 'none', border: 'none', color: '#94a3b8' }}
                    >
                        <Icons.X size={20} />
                    </button>
                )}
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

    const renderOverview = () => (
        <div className="med-overview-container">
            {/* Header Section */}
            <div className="med-premium-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h2 className="med-page-heading" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Overview</h2>
                    <p className="med-page-subheading">Welcome back, here's what's happening today.</p>
                </div>
            </div>

            {/* KPI Section - Professional & Attractive Redesign */}
            <div className="med-stats-grid" style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {/* 1. Total Bookings */}
                <div className="med-card" style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    background: '#fff',
                    transition: 'transform 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2563eb'
                        }}>
                            <Icons.Calendar size={24} />
                        </div>
                        <div style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            background: '#ecfdf5',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Icons.TrendingUp size={12} /> +12%
                        </div>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Total Bookings</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
                            <CountUp end={appointments.length || 0} />
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem' }}>
                            <Icons.ClockSmall size={14} />
                            <span>Peak: 10:00 – 14:00</span>
                        </div>
                    </div>
                </div>

                {/* 2. Pending Orders */}
                <div className="med-card" style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    background: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: '#fff7ed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#f59e0b'
                        }}>
                            <Icons.TestTube size={24} />
                        </div>
                        <div style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            background: '#f8fafc',
                            color: '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1px solid #e2e8f0'
                        }}>
                            Stable
                        </div>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Pending Orders</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
                            <CountUp end={countStatus('Pending')} />
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem' }}>
                            <Icons.AlertTriangle size={14} />
                            <span>Avg TAT: 4.5 hours</span>
                        </div>
                    </div>
                </div>

                {/* 3. Reports Generated */}
                <div className="med-card" style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    background: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: '#f0fdf4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981'
                        }}>
                            <Icons.FileText size={24} />
                        </div>
                        <div style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            background: '#ecfdf5',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Icons.TrendingUp size={12} /> +8%
                        </div>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Reports Generated</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
                            <CountUp end={stats.reportsGenerated} />
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem' }}>
                            <Icons.Activity size={14} />
                            <span>Daily avg: 5.2 reports</span>
                        </div>
                    </div>
                </div>

                {/* 4. Active Staff */}
                <div className="med-card" style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    background: '#fff',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: '#f5f3ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#8b5cf6'
                        }}>
                            <Icons.Users size={24} />
                        </div>
                        <div style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontSize: '0.75rem',
                            fontWeight: 700
                        }}>
                            Active
                        </div>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Active Staff</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
                            <CountUp end={stats.activeStaff || 0} />
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem' }}>
                            <Icons.User size={14} />
                            <span>{stats.activeStaff || 2} Techs Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="med-card" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Weekly Appointments Overview</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>+24%</span>
                                <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.TrendingUp size={14} /> 12% from last week</span>
                            </div>
                        </div>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <select className="med-input" style={{ 
                                width: '130px', 
                                padding: '6px 32px 6px 16px', 
                                fontSize: '0.85rem', 
                                fontWeight: 700, 
                                height: '36px', 
                                background: '#fff', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '10px', 
                                appearance: 'none', 
                                cursor: 'pointer', 
                                color: '#1e293b',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                            <div style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: '#64748b', display: 'flex' }}>
                                <Icons.ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dailyStats && stats.dailyStats.length > 0 ? stats.dailyStats : [{ name: 'Mon', count: 0 }, { name: 'Tue', count: 0 }, { name: 'Wed', count: 0 }, { name: 'Thu', count: 0 }, { name: 'Fri', count: 0 }, { name: 'Sat', count: 0 }, { name: 'Sun', count: 0 }]}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis hide domain={[0, 'auto']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#2563eb' }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="med-card" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Booking Status</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time distribution</p>
                    </div>
                    <div style={{ width: '100%', height: '240px', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Completed', value: appointments.filter(a => a.status === 'Completed').length || 65 },
                                        { name: 'Scheduled', value: appointments.filter(a => a.status === 'Confirmed').length || 15 },
                                        { name: 'Processing', value: appointments.filter(a => a.status === 'Processing' || a.status === 'Sample Collected').length || 20 }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#2563eb" />
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f59e0b" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>100%</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Efficiency</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { label: 'Completed', color: '#2563eb', val: '65%' },
                            { label: 'Scheduled', color: '#10b981', val: '15%' },
                            { label: 'Processing', color: '#f59e0b', val: '20%' }
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }}></div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{item.label}</span>
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="med-table-card" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Recent Test Orders</h3>
                    <button className="med-link-btn" style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: 700 }} onClick={() => setActiveSection('Appointments')}>View All</button>
                </div>
                <div className="med-table-wrapper" style={{ padding: '0 24px 24px' }}>
                    <table className="med-table">
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Patient</th>
                                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Test Type</th>
                                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Assigned To</th>
                                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Order Date</th>
                                <th style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.slice(0, 5).map(appt => (
                                <tr key={appt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#d1a080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>
                                                {appt.patient.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{appt.patient.split('@')[0]}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {appt.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{appt.test}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icons.User size={12} color="#2563eb" />
                                            </div>
                                            Dr. {appt.technician || (staff[0] ? staff[0].name : 'Aris T.')}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#64748b' }}>{appt.date}, {appt.time}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            background: appt.status === 'Completed' ? '#ecfdf5' : '#fff7ed',
                                            color: appt.status === 'Completed' ? '#10b981' : '#f59e0b'
                                        }}>
                                            {appt.status === 'Completed' ? 'READY' : 'PROCESSING'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
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
            const matchesTest = advancedFilters.testType ? a.test.includes(advancedFilters.testType) : true;
            const matchesTech = advancedFilters.technician ? a.technician === advancedFilters.technician : true;
            const matchesDelay = advancedFilters.isDelayed ? (a.isDelayed || a.status === 'Pending') : true;

            return matchesSearch && matchesStatus && matchesTest && matchesTech && matchesDelay;
        });

        const todayStr = new Date().toISOString().split('T')[0];
        const todayAppointments = filteredAppointments.filter(a => a.date === todayStr);
        const upcomingAppointments = filteredAppointments.filter(a => new Date(a.date) > new Date(todayStr));
        const historyAppointments = filteredAppointments.filter(a => new Date(a.date) < new Date(todayStr) || a.status === 'Completed');

        const activeList = dateFilter === 'Today' ? todayAppointments : (dateFilter === 'Upcoming' ? upcomingAppointments : historyAppointments);

        const renderAppointmentTable = (apptList, emptyMsg) => (
            <div className="med-table-card" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{dateFilter}'s Schedule</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                    </div>
                </div>
                <div className="med-table-wrapper">
                    <table className="med-table">
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{ padding: '12px 24px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Patient Information</th>
                                <th style={{ padding: '12px 24px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Test Details</th>
                                <th style={{ padding: '12px 24px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Date & Time</th>
                                <th style={{ padding: '12px 24px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 24px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {apptList.length > 0 ? (
                                apptList.map(appt => (
                                    <tr key={appt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#d1a080', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '1rem' }}>
                                                    {appt.patient.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>{appt.patient.split('@')[0]}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: #MB-{String(appt.id).slice(-4)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{appt.test}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>General Screening</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>{appt.date}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{appt.time}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <select
                                                value={appt.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value;
                                                    try {
                                                        const res = await fetch(`http://localhost:5000/api/admin/appointments/${appt.id}/status`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            credentials: 'include',
                                                            body: JSON.stringify({ status: newStatus })
                                                        });
                                                        if (res.ok) {
                                                            setAppointments(appointments.map(a =>
                                                                a.id === appt.id ? { ...a, status: newStatus } : a
                                                            ));
                                                            // Also trigger fetch appointments just to be safe
                                                            const url = 'http://localhost:5000/api/admin/appointments';
                                                            const apptsRes = await fetch(url, { credentials: 'include' });
                                                            if (apptsRes.ok) {
                                                                const data = await apptsRes.json();
                                                                setAppointments(data);
                                                            }
                                                        }
                                                    } catch (err) {
                                                        console.error("Error updating status inline", err);
                                                    }
                                                }}
                                                style={{
                                                    padding: '6px 30px 6px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    background: appt.status === 'Completed' ? '#ecfdf5' : (appt.status === 'Confirmed' ? '#eff6ff' : (appt.status === 'Cancelled' ? '#f1f5f9' : '#fff7ed')),
                                                    color: appt.status === 'Completed' ? '#10b981' : (appt.status === 'Confirmed' ? '#3b82f6' : (appt.status === 'Cancelled' ? '#94a3b8' : '#f59e0b')),
                                                    border: '1px solid ' + (appt.status === 'Completed' ? '#d1fae5' : (appt.status === 'Confirmed' ? '#dbeafe' : (appt.status === 'Cancelled' ? '#e2e8f0' : '#ffedd5'))),
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                    appearance: 'none',
                                                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${appt.status === 'Completed' ? '10b981' : (appt.status === 'Confirmed' ? '3b82f6' : (appt.status === 'Cancelled' ? '94a3b8' : 'f59e0b'))}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'right 10px top 50%',
                                                    backgroundSize: '10px auto'
                                                }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Sample Collected">Sample Collected</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {appt.tokenNumber && (
                                                    <div style={{ 
                                                        background: '#f0fdf4', color: '#10b981', border: '1px solid #bbf7d0',
                                                        padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700
                                                    }}>
                                                        Token {appt.tokenNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>{emptyMsg}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Showing {Math.min(apptList.length, 5)} of {apptList.length} appointments</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="med-btn bg-gray small" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>Previous</button>
                        <button className="med-btn bg-white small" style={{ fontSize: '0.8rem', padding: '6px 16px', border: '1px solid #e2e8f0' }}>Next</button>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="med-appointments-container">
                {/* Header */}
                <div className="med-premium-header" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                        <div>
                            <h2 className="med-page-heading" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Appointments Management</h2>
                            <p className="med-page-subheading">Central hub for managing and tracking all laboratory diagnostic bookings</p>
                        </div>
                        <button className="med-btn-gradient" style={{ padding: '12px 24px', borderRadius: '10px' }} onClick={() => setShowBookingModal(true)}>
                            <Icons.Plus size={18} /> Add New Booking
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
                    {['Today', 'Upcoming', 'History'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => setDateFilter(tab)}
                            style={{
                                padding: '12px 4px',
                                fontSize: '0.95rem',
                                fontWeight: dateFilter === tab ? 800 : 500,
                                color: dateFilter === tab ? '#2563eb' : '#64748b',
                                cursor: 'pointer',
                                borderBottom: dateFilter === tab ? '3px solid #2563eb' : '3px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}'s Appointments ({tab === 'Today' ? todayAppointments.length : (tab === 'Upcoming' ? upcomingAppointments.length : historyAppointments.length)})
                        </div>
                    ))}
                </div>

                {/* Mini KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    <div className="med-card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Pending Appointments</span>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#fef2f2', color: '#ef4444', fontWeight: 700 }}>-2%</span>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{todayAppointments.filter(a => a.status === 'Pending').length || '08'}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Today</span>
                        </div>
                    </div>
                    <div className="med-card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Confirmed Bookings</span>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#f0fdf4', color: '#10b981', fontWeight: 700 }}>+5%</span>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{appointments.filter(a => a.status === 'Confirmed').length || '24'}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Active</span>
                        </div>
                    </div>
                    <div className="med-card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Completed Tests</span>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#f0fdf4', color: '#10b981', fontWeight: 700 }}>+10%</span>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>{todayAppointments.filter(a => a.status === 'Completed').length || '12'}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Today</span>
                        </div>
                    </div>
                </div>

                {renderAppointmentTable(activeList, `No appointments found for ${dateFilter.toLowerCase()}`)}
            </div>
        );
    };

    const renderTestOrders = () => {
        // Source data for Test Orders is now Appointments
        const enhancedOrders = appointments.map(a => {
            const allTestsText = (String(a.test || '') + ' ' + String(a.test_type || '') + ' ' + String(a.tests || '')).toLowerCase();
            let category = 'Other';
            if (allTestsText.includes('blood') || allTestsText.includes('cbc') || allTestsText.includes('glucose') || allTestsText.includes('hemoglobin')) category = 'Blood Tests';
            else if (allTestsText.includes('urine')) category = 'Urine Tests';
            else if (allTestsText.includes('sputum')) category = 'Sputum Tests';
            else if (allTestsText.includes('stool')) category = 'Stool Tests';
            else if (allTestsText.includes('scan') || allTestsText.includes('x-ray') || allTestsText.includes('mri') || allTestsText.includes('ct') || allTestsText.includes('usg') || allTestsText.includes('ecg') || allTestsText.includes('echo')) category = 'Scanning';

            return {
                ...a,
                id: a.id,
                patient: a.patient || a.patient_name || 'Anonymous',
                category: category,
                sampleType: a.sampleType || category.replace(' Tests', ''),
                sampleStatus: a.status === 'Pending' ? 'Not Collected' : 'Collected',
                tat: '24 hrs',
                whatsapp: a.contact || '9876543210'
            };
        });

        const filteredOrders = enhancedOrders.filter(t => {
            const matchesStatus = orderFilter === 'All' || t.status === orderFilter;
            const matchesCategory = testCategoryFilter === 'All' || t.category === testCategoryFilter;

            // For specific test filtering within the category
            const matchesTest = advancedFilters.testType === 'All' || advancedFilters.testType === '' ||
                String(t.test || '').includes(advancedFilters.testType) ||
                String(t.tests || '').includes(advancedFilters.testType);

            const matchesSearch = String(t.patient || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(t.test || '').toLowerCase().includes(searchTerm.toLowerCase());

            return matchesStatus && matchesCategory && matchesTest && matchesSearch;
        });

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
                {/* Header Section */}
                <div>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Test Orders</h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Manage, track, and validate laboratory test workflows.</p>
                </div>

                {/* Search and Filters Bar */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div className="med-header-search-container" style={{ flex: 1, maxWidth: '500px', height: '48px', margin: 0 }}>
                        <div className="med-header-search-icon"><Icons.Search size={20} /></div>
                        <input
                            type="text"
                            placeholder="Search by patient, test, or Order ID..."
                            className="med-header-search-input"
                            style={{ fontSize: '0.9rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="med-input-pro"
                        style={{ width: '180px', height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                        value={testCategoryFilter}
                        onChange={(e) => setTestCategoryFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Blood Tests">Blood Tests</option>
                        <option value="Urine Tests">Urine Tests</option>
                        <option value="Sputum Tests">Sputum Tests</option>
                        <option value="Stool Tests">Stool Tests</option>
                        <option value="Scanning">Scanning</option>
                    </select>

                    <select
                        className="med-input-pro"
                        style={{ width: '150px', height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    >
                        <option>Priority: All</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>

                {/* Tabs Row with Counts */}
                <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #f1f5f9', marginTop: '8px' }}>
                    {[
                        { label: 'All Orders', status: 'All' },
                        { label: 'Pending', status: 'Pending' },
                        { label: 'In Progress', status: 'In Process' },
                        { label: 'Completed', status: 'Completed' }
                    ].map(tab => {
                        const count = countOrderStatus(tab.status === 'In Process' ? 'Processing' : tab.status);
                        const isActive = orderFilter === tab.status;
                        return (
                            <div
                                key={tab.label}
                                onClick={() => setOrderFilter(tab.status)}
                                style={{
                                    paddingBottom: '16px',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    color: isActive ? '#2563eb' : '#64748b',
                                    cursor: 'pointer',
                                    borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                                <span style={{
                                    background: isActive ? '#dbeafe' : '#f1f5f9',
                                    color: isActive ? '#2563eb' : '#64748b',
                                    padding: '2px 8px',
                                    borderRadius: '100px',
                                    fontSize: '0.75rem'
                                }}>
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Premium Table Card */}
                <div className="med-card" style={{ padding: 0, borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                    <table className="med-table premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Order ID</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Patient Name</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Test Type</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Priority</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>No test orders found for the current selection.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, idx) => {
                                    // Visual mapping based on status for parity with image
                                    let statusPill = { label: 'Pending', bg: '#fff7ed', text: '#ea580c' };
                                    if (['Processing', 'Sample Collected', 'In Process'].includes(order.status)) {
                                        statusPill = { label: 'In Progress', bg: '#eff6ff', text: '#2563eb' };
                                    } else if (order.status === 'Completed') {
                                        statusPill = { label: 'Validated', bg: '#f0fdf4', text: '#10b981' };
                                    }

                                    // Fake priority for visual variety
                                    const priorities = [
                                        { label: 'High', bg: '#fff1f2', text: '#e11d48' },
                                        { label: 'Medium', bg: '#fefce8', text: '#ca8a04' },
                                        { label: 'Low', bg: '#f1f5f9', text: '#64748b' }
                                    ];
                                    const priority = order.status === 'Pending' ? priorities[0] : (idx % 2 === 0 ? priorities[1] : priorities[2]);

                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{ fontWeight: 800, color: '#1e293b' }}>#ORD-{String(order.id).slice(-4)}</span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '50%', background: idx % 2 === 0 ? '#e0e7ff' : '#f0fdf4',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: idx % 2 === 0 ? '#4338ca' : '#15803d'
                                                    }}>
                                                        {(order.patient || 'A').charAt(0)}
                                                    </div>
                                                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{order.patient}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{ color: '#475569', fontWeight: 500 }}>{order.test || 'General Diagnostic'}</span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                                                    background: statusPill.bg, color: statusPill.text
                                                }}>
                                                    {statusPill.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                                                    background: priority.bg, color: priority.text
                                                }}>
                                                    {priority.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{order.date || 'Oct 23, 2023'}</span>
                                            </td>
                                            <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Bar */}
                    <div style={{ padding: '20px 24px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            Showing <span style={{ fontWeight: 700, color: '#1e293b' }}>1 to {Math.min(filteredOrders.length, 10)}</span> of <span style={{ fontWeight: 700, color: '#1e293b' }}>{filteredOrders.length}</span> orders
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="med-btn bg-white small" style={{ fontSize: '0.85rem', padding: '6px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600 }}>Previous</button>
                            <button className="med-btn bg-white small" style={{ fontSize: '0.85rem', padding: '6px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, color: '#1e293b' }}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPatients = () => {

        const filteredPatients = patients.filter(p => {
            const matchesSearch = ((p.name || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
                ((p.email || '').toLowerCase().includes(searchTerm.toLowerCase()));

            if (activePatientTab === 'In Progress') {
                return matchesSearch && appointments.some(a => (a.patientId === p.id || a.patient === p.name) && ['Pending', 'Sample Collected', 'Processing'].includes(a.status));
            }
            if (activePatientTab === 'Results Ready') {
                return matchesSearch && appointments.some(a => (a.patientId === p.id || a.patient === p.name) && a.status === 'Completed');
            }
            return matchesSearch;
        });

        return (
            <div className="med-patients-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="med-premium-header" style={{ marginBottom: '8px' }}>
                    <div>
                        <h2 className="med-page-heading">Patient Directory</h2>
                        <p className="med-page-subheading">Manage patient records, history and test statuses</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="med-btn-icon" style={{ background: 'var(--med-surface)', border: '1px solid var(--med-border)' }}>
                            <Icons.Filter size={18} />
                        </button>
                        <button className="med-btn-icon" style={{ background: 'var(--med-surface)', border: '1px solid var(--med-border)' }}>
                            <Icons.MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs Row */}
                <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--med-border)', marginBottom: '8px', padding: '0 8px' }}>
                    {['All Patients', 'In Progress', 'Results Ready'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => setActivePatientTab(tab)}
                            style={{
                                padding: '12px 4px',
                                fontSize: '0.9rem',
                                fontWeight: activePatientTab === tab ? 700 : 500,
                                color: activePatientTab === tab ? 'var(--med-primary)' : 'var(--med-text-muted)',
                                cursor: 'pointer',
                                borderBottom: activePatientTab === tab ? '2px solid var(--med-primary)' : '2px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="med-table-card premium">
                    <table className="med-table premium-table">
                        <thead>
                            <tr>
                                <th>PATIENT ID</th>
                                <th>PATIENT DETAILS</th>
                                <th>CONTACT INFO</th>
                                <th>AGE/GENDER</th>
                                <th>BOOKED TESTS</th>
                                <th style={{ textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px' }}>
                                        <div className="med-empty-state-content">
                                            <Icons.Users size={48} color="#cbd5e1" />
                                            <h3>No patients found</h3>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(p => (
                                    <tr key={p.id}>
                                        <td className="mono-text" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#PT-{String(p.id).slice(-4)}</td>
                                        <td>
                                            <div className="med-user-cell">
                                                <div className="med-avatar-circle small" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                                                    <Icons.User size={20} />
                                                </div>
                                                <div className="info">
                                                    <span className="name" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{p.name}</span>
                                                    <span className="sub-text" style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)' }}>{p.tags?.[0] || 'Regular Check-up'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--med-text-main)' }}>{p.email}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)' }}>{p.phone || '555-0123'}</div>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{p.age || '28'} / {p.gender || 'Female'}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {(() => {
                                                    const patientApps = appointments.filter(a => a.patientId === p.id || a.patient === p.name);
                                                    const latestApp = patientApps[patientApps.length - 1] || { test: p.latest_test || 'General Consultation', status: 'Pending' };

                                                    const statusColors = {
                                                        'Pending': { bg: '#fff7ed', text: '#ea580c', dot: '#f97316' },
                                                        'Sample Collected': { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
                                                        'Processing': { bg: '#fefce8', text: '#a16207', dot: '#eab308' },
                                                        'Completed': { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
                                                        'Cancelled': { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444' }
                                                    };
                                                    const colors = statusColors[latestApp.status] || statusColors['Pending'];

                                                    return (
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            background: colors.bg,
                                                            padding: '4px 12px',
                                                            borderRadius: '99px',
                                                            border: `1px solid ${colors.bg}`
                                                        }}>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.text }}>{latestApp.test}</span>
                                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot }}></div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                className="med-btn-outlined small"
                                                onClick={() => handleViewHistory(p)}
                                                style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--med-primary)', borderColor: 'var(--med-border)' }}
                                            >
                                                Full History
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--med-border)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>
                            Showing <span style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>1-{Math.min(filteredPatients.length, 10)}</span> of <span style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{filteredPatients.length}</span> patients
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="med-btn-icon small" style={{ background: 'white', border: '1px solid var(--med-border)' }}><Icons.ChevronLeft size={16} /></button>
                            {[1, 2, 3].map(page => (
                                <button
                                    key={page}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: page === 1 ? 'var(--med-primary)' : 'transparent',
                                        color: page === 1 ? 'white' : 'var(--med-text-muted)',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="med-btn-icon small" style={{ background: 'white', border: '1px solid var(--med-border)' }}><Icons.ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const renderReports = () => {
        const filteredReports = (reports || []).filter(r => {
            const search = (searchTerm || '').toLowerCase();
            const pName = (r.patient_name || 'N/A').toLowerCase();
            const tName = (r.test_name || 'N/A').toLowerCase();
            return pName.includes(search) || tName.includes(search);
        });

        const pendingReports = filteredReports.filter(r => r.status === 'Pending Upload');
        const availableReportsRaw = filteredReports.filter(r => r.status === 'Available');
        
        // Pagination logic for Uploaded Reports
        const totalPages = Math.ceil(availableReportsRaw.length / reportsPerPage);
        const availableReports = availableReportsRaw.slice(
            (reportsPage - 1) * reportsPerPage,
            reportsPage * reportsPerPage
        );

        const renderReportRow = (r) => (
            <tr key={r.id}>
                <td className="mono-text" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>#{r.type === 'report' ? `REP-${r.id}` : r.id}</td>
                <td>
                    <div style={{ fontWeight: 700, color: 'var(--med-text-main)' }}>{r.patient_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.email || (r.type === 'appointment_entry' ? 'New Appointment' : 'N/A')}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{r.test_name}</td>
                <td style={{ color: 'var(--med-text-muted)' }}>{r.uploaded_at?.split(' ')[0] || r.date || 'N/A'}</td>
                <td>
                    <span style={{
                        padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                        background: r.status === 'Available' ? '#f0fdf4' : '#fff7ed',
                        color: r.status === 'Available' ? '#15803d' : '#9a3412',
                        border: r.status === 'Available' ? '1px solid #dcfce7' : '1px solid #ffedd5'
                    }}>{r.status}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {r.status === 'Pending Upload' ? (
                            <button
                                className="med-btn med-btn-gradient small"
                                onClick={() => handleUploadNewReport(r.id)}
                                style={{ padding: '6px 16px', borderRadius: '12px', fontSize: '0.8rem' }}
                            >
                                <Icons.UploadCloud size={14} /> Upload Report
                            </button>
                        ) : (
                            <button
                                className="med-btn med-btn-gradient small"
                                onClick={() => {
                                    if (r.file_path) {
                                        window.open(r.file_path, '_blank');
                                    } else if (r.type === 'report') {
                                        // Fallback for older data format
                                        window.open(`http://localhost:5000/api/view-report/${r.id}`, '_blank');
                                    }
                                }}
                                style={{ padding: '6px 16px', borderRadius: '12px', fontSize: '0.8rem', opacity: (r.type === 'report' || r.file_path) ? 1 : 0.5, cursor: (r.type === 'report' || r.file_path) ? 'pointer' : 'not-allowed' }}
                            >
                                <Icons.Eye size={14} /> View PDF
                            </button>
                        )}
                        <button
                            className="med-btn-outlined small"
                            style={{ borderColor: '#e2e8f0', color: '#64748b' }}
                            onClick={() => handleViewHistory({ id: r.patient_id, name: r.patient_name, email: r.email })}
                        >
                            History
                        </button>
                    </div>
                </td>
            </tr>
        );

        return (
            <div className="med-reports-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="med-page-heading">Reports</h2>
                        <p className="med-page-subheading">View and manage uploaded patient laboratory results</p>
                    </div>
                </div>

                <h3 style={{ margin: '0 0 -12px 0', color: 'var(--med-text-main)' }}>Pending Uploads</h3>
                <div className="med-table-card premium">
                    <table className="med-table premium-table">
                        <thead>
                            <tr>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>REPORT ID</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>PATIENT NAME</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>TEST NAME</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>DATE</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>STATUS</th>
                                <th style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingReports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: 'var(--med-text-muted)' }}>
                                        No pending uploads found.
                                    </td>
                                </tr>
                            ) : (
                                pendingReports.map(renderReportRow)
                            )}
                        </tbody>
                    </table>
                </div>

                <h3 style={{ margin: '12px 0 -12px 0', color: 'var(--med-text-main)' }}>Uploaded Reports</h3>
                <div className="med-table-card premium">
                    <table className="med-table premium-table">
                        <thead>
                            <tr>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>REPORT ID</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>PATIENT NAME</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>TEST NAME</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>DATE</th>
                                <th style={{ color: '#94a3b8', fontSize: '0.8rem' }}>STATUS</th>
                                <th style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.8rem' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availableReports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: 'var(--med-text-muted)' }}>
                                        No uploaded reports found.
                                    </td>
                                </tr>
                            ) : (
                                availableReports.map(renderReportRow)
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '12px', 
                        marginTop: '32px',
                        padding: '20px',
                        borderTop: '1px solid #f1f5f9'
                    }}>
                        <button
                            className="med-btn-outlined"
                            disabled={reportsPage === 1}
                            onClick={() => {
                                setReportsPage(prev => Math.max(prev - 1, 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ 
                                opacity: reportsPage === 1 ? 0.5 : 1, 
                                cursor: reportsPage === 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                background: '#fff',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: '#1e293b',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s',
                                boxShadow: reportsPage === 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Icons.ChevronLeft size={18} /> Previous
                        </button>
                        
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => {
                                        setReportsPage(page);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: reportsPage === page ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f8fafc',
                                        color: reportsPage === page ? '#fff' : '#64748b',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            className="med-btn-outlined"
                            disabled={reportsPage === totalPages}
                            onClick={() => {
                                setReportsPage(prev => Math.min(prev + 1, totalPages));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ 
                                opacity: reportsPage === totalPages ? 0.5 : 1, 
                                cursor: reportsPage === totalPages ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                background: '#fff',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: '#1e293b',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s',
                                boxShadow: reportsPage === totalPages ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            Next <Icons.ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const handleUploadNewReport = async (id) => {
        const appointmentId = id.replace('A-', '');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('report', file);
            formData.append('appointment_id', appointmentId);

            try {
                const res = await fetch('http://localhost:5000/api/admin/reports/upload', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });
                if (res.ok) {
                    showToast("Report uploaded successfully");
                    // Refresh reports
                    const reportsRes = await fetch('http://localhost:5000/api/admin/reports', { credentials: 'include' });
                    if (reportsRes.ok) {
                        const data = await reportsRes.json();
                        setReports(data);
                    }
                    // Refresh appointments to reflect status change to Completed
                    const apptsRes = await fetch('http://localhost:5000/api/admin/appointments', { credentials: 'include' });
                    if (apptsRes.ok) {
                        const apptsData = await apptsRes.json();
                        setAppointments(apptsData);
                    }
                } else {
                    const errData = await res.json().catch(() => ({}));
                    showToast(errData.message || "Upload failed", "error");
                }
            } catch (err) {
                console.error("Upload error:", err);
                showToast("Error uploading report", "error");
            }
        };
        input.click();
    };

    const renderStaff = () => {
        const staffKpis = [
            { label: 'Total Staff', value: staff.length, icon: 'Users', color: 'blue' },
            { label: 'Active', value: staff.filter(s => s.status === 'Active' || s.status === 'Available').length, icon: 'Activity', color: 'green' },
            { label: 'On Leave', value: staff.filter(s => s.status === 'Leave').length, icon: 'Clock', color: 'orange' },
            { label: 'Inactive', value: staff.filter(s => s.status === 'Inactive').length, icon: 'X', color: 'gray' }
        ];

        return (<div className="med-staff-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Header & Action Area */}
            {/* Header Section */}
            <div className="med-premium-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Lab Staff</h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Manage and monitor laboratory personnel, roles, and shift assignments across all departments.</p>
                </div>
                <button className="med-btn-gradient" style={{ padding: '12px 24px', borderRadius: '10px' }} onClick={() => setShowAddStaffModal(true)}>
                    <Icons.Plus size={18} /> Add Member
                </button>
            </div>

            {/* Tabs Row */}
            <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                {[
                    { label: 'All Staff', status: 'All' },
                    { label: 'Active', status: 'Active' },
                    { label: 'On Leave', status: 'Leave' },
                    { label: 'Inactive', status: 'Inactive' }
                ].map(tab => (
                    <div
                        key={tab.label}
                        onClick={() => setStaffFilter(tab.status)}
                        style={{
                            paddingBottom: '16px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: staffFilter === tab.status ? '#2563eb' : '#64748b',
                            cursor: 'pointer',
                            borderBottom: staffFilter === tab.status ? '3px solid #2563eb' : '3px solid transparent',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Search and Filters Bar */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <div className="med-header-search-container" style={{ flex: 1, height: '48px', margin: 0 }}>
                    <div className="med-header-search-icon"><Icons.Search size={20} /></div>
                    <input
                        type="text"
                        placeholder="Search staff by name, ID, or department..."
                        className="med-header-search-input"
                        style={{ fontSize: '0.9rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Premium Table Card */}
            {loadingStaff ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Icons.Loader size={40} className="spin" />
                    <p style={{ marginTop: '16px', fontWeight: 500 }}>Loading staff members...</p>
                </div>
            ) : staff.length === 0 ? (
                <div className="med-card" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <Icons.Users size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                    <h3 style={{ color: '#1e293b' }}>No staff members added yet</h3>
                    <p style={{ color: '#64748b' }}>Add your first lab technician to begin.</p>
                </div>
            ) : (
                <div className="med-card" style={{ padding: 0, borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                    <table className="med-table premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Name & ID</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Role</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Department</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Contact</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Shift</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff
                                .filter(s => {
                                    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (s.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (String(s.staffId || '').toLowerCase().includes(searchTerm.toLowerCase()));
                                    const actualStatus = (s.status === 'Available' ? 'Active' : s.status);
                                    const matchesFilter = staffFilter === 'All' || actualStatus === staffFilter;
                                    return matchesSearch && matchesFilter;
                                })
                                .map((s, idx) => {
                                    const isMorning = (s.shift || '').toLowerCase().includes('morning');
                                    const statusVal = s.status === 'Available' ? 'Active' : s.status;

                                    return (
                                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '50%', background: idx % 2 === 0 ? '#e0e7ff' : '#f0fdf4',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: idx % 2 === 0 ? '#4338ca' : '#15803d'
                                                    }}>
                                                        {(s.name || 'S').charAt(0)}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{s.name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>ID: {s.staffId || `LB-${String(s.id).padStart(3, '0')}`}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                                                    background: '#f1f5f9', color: '#475569'
                                                }}>
                                                    {s.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{ color: '#475569', fontWeight: 500 }}>{s.department || 'General'}</span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>{s.email}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{s.phone || '+1 (555) 000-0000'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                                                    {isMorning ? <Icons.Sun size={18} color="#f59e0b" /> : <Icons.Moon size={18} color="#6366f1" />}
                                                    <span style={{ fontSize: '0.85rem' }}>{s.shift || 'Morning'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <select
                                                    value={statusVal}
                                                    onChange={(e) => handleStaffStatusChange(s.id, e.target.value)}
                                                    style={{
                                                        background: 'none', border: 'none', padding: 0, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                                                        color: statusVal === 'Active' ? '#10b981' : (statusVal === 'Leave' ? '#f59e0b' : '#94a3b8')
                                                    }}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Leave">On Leave</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
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
                                                    }}>├ù</button>
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
        const tests = (labSettings && labSettings.testManagement) ? labSettings.testManagement : [];
        const categories = [...new Set(tests.map(t => t.category || 'General'))];

        return (
            <div className="med-settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="med-premium-header">
                    <div>
                        <h2 className="med-page-heading">Lab Configurations</h2>
                        <p className="med-page-subheading">Manage operational parameters and service offerings</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                    <button className={`med-btn-tab ${settingsActiveTab === 'Feedback' ? 'active' : ''}`} onClick={() => setSettingsActiveTab('Feedback')}>Feedback & Ratings</button>
                    <button className={`med-btn-tab ${settingsActiveTab === 'WorkingHours' ? 'active' : ''}`} onClick={() => setSettingsActiveTab('WorkingHours')}>Working Hours</button>
                    <button className={`med-btn-tab ${settingsActiveTab === 'TestManagement' ? 'active' : ''}`} onClick={() => setSettingsActiveTab('TestManagement')}>Test Management</button>
                </div>

                {settingsActiveTab === 'WorkingHours' && (
                    <div className="med-card premium zoom-in-enter" style={{ padding: '32px', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--med-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--med-primary)' }}>
                                <Icons.Clock size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--med-text-main)' }}>Operating Hours</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--med-text-muted)' }}>Configure lab opening and closing times</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div className="med-form-group">
                                <label className="med-label-pro" style={{ marginBottom: '8px', display: 'block' }}>Opening Time</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="med-input"
                                        type="time"
                                        value={(labSettings?.workingHours || {}).start || '09:00'}
                                        onChange={e => setLabSettings({ ...labSettings, workingHours: { ...labSettings.workingHours, start: e.target.value } })}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                            <div className="med-form-group">
                                <label className="med-label-pro" style={{ marginBottom: '8px', display: 'block' }}>Closing Time</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="med-input"
                                        type="time"
                                        value={(labSettings?.workingHours || {}).end || '19:00'}
                                        onChange={e => setLabSettings({ ...labSettings, workingHours: { ...labSettings.workingHours, end: e.target.value } })}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px' }}>
                            <label className="med-label-pro" style={{ marginBottom: '16px', display: 'block' }}>Working Days</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <label key={day} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        background: (labSettings.workingDays || []).includes(day) ? 'var(--med-primary-light)' : '#f8fafc',
                                        border: (labSettings.workingDays || []).includes(day) ? '1px solid var(--med-primary)' : '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        color: (labSettings.workingDays || []).includes(day) ? 'var(--med-primary)' : '#64748b',
                                        fontWeight: (labSettings.workingDays || []).includes(day) ? 700 : 500
                                    }}>
                                        <input
                                            type="checkbox"
                                            style={{ display: 'none' }}
                                            checked={(labSettings.workingDays || []).includes(day)}
                                            onChange={() => {
                                                const currentDays = labSettings.workingDays || [];
                                                const newDays = currentDays.includes(day)
                                                    ? currentDays.filter(d => d !== day)
                                                    : [...currentDays, day];
                                                setLabSettings({ ...labSettings, workingDays: newDays });
                                            }}
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '32px' }}>
                            <label className="med-label-pro" style={{ marginBottom: '16px', display: 'block' }}>Holidays (Specific Dates)</label>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <input
                                    className="med-input"
                                    type="date"
                                    id="holiday-picker"
                                    style={{ flex: 1 }}
                                />
                                <button className="med-btn-outlined" onClick={() => {
                                    const picker = document.getElementById('holiday-picker');
                                    if (picker.value) {
                                        const newHolidays = [...(labSettings.holidays || []), picker.value];
                                        setLabSettings({ ...labSettings, holidays: [...new Set(newHolidays)] });
                                        picker.value = '';
                                    }
                                }}>Add Holiday</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {(labSettings.holidays || []).map(date => (
                                    <div key={date} style={{
                                        padding: '4px 12px',
                                        background: '#fee2e2',
                                        color: '#ef4444',
                                        borderRadius: '99px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        border: '1px solid #fecaca'
                                    }}>
                                        {date}
                                        <Icons.X size={12} style={{ cursor: 'pointer' }} onClick={() => {
                                            setLabSettings({ ...labSettings, holidays: labSettings.holidays.filter(h => h !== date) });
                                        }} />
                                    </div>
                                ))}
                                {(labSettings.holidays || []).length === 0 && <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No specific holidays added.</span>}
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', borderTop: '1px solid var(--med-border)', paddingTop: '24px' }}>
                            <button className="med-btn-gradient" onClick={async () => {
                                try {
                                    await fetch('http://localhost:5000/api/admin/lab-settings', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            workingHours: labSettings.workingHours,
                                            workingDays: labSettings.workingDays || [],
                                            holidays: labSettings.holidays || [],
                                            tests: labSettings.disabledTests || []
                                        }),
                                        credentials: 'include'
                                    });
                                    showToast("Lab settings updated successfully");
                                } catch (err) {
                                    showToast("Failed to save settings", "error");
                                }
                            }}>
                                <Icons.CheckCircle size={18} /> Update Settings
                            </button>
                        </div>
                    </div>
                )}

                {settingsActiveTab === 'Feedback' && (
                    <div className="zoom-in-enter" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px', alignItems: 'start' }}>
                        {/* Overall Rating Header (Left Side) */}
                        <div className="med-card premium" style={{ padding: '32px' }}>
                            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>
                                        {labSettings.feedback?.length > 0 ? (labSettings.feedback.reduce((sum, f) => sum + f.rating, 0) / labSettings.feedback.length).toFixed(1) : "0.0"}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', gap: '2px', color: '#ea580c', fontSize: '1.2rem' }}>
                                            ★★★★<span style={{ color: '#ea580c', WebkitTextStroke: '1px #ea580c', WebkitTextFillColor: 'transparent' }}>★</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                                            Out of 5.0 ({labSettings.feedback?.length} reviews)
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { star: 5, pct: 45 },
                                        { star: 4, pct: 30 },
                                        { star: 3, pct: 12 },
                                        { star: 2, pct: 8 },
                                        { star: 1, pct: 5 }
                                    ].map(({ star, pct }) => (
                                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '12px', fontWeight: 800, fontSize: '0.85rem', color: '#111827', textAlign: 'center' }}>{star}</div>
                                            <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: '#ea580c', borderRadius: '4px' }}></div>
                                            </div>
                                            <div style={{ width: '32px', textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>{pct}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Real Feedback Data (Right Side) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {labSettings.feedback?.length > 0 ? (
                                labSettings.feedback.map((fb, idx) => {
                                    const catColors = {
                                        "GENERAL": { bg: "#ffedd5", text: "#ea580c" },
                                        "LAB TESTS": { bg: "#dbeafe", text: "#3b82f6" },
                                        "CONSULTATIONS": { bg: "#fef3c7", text: "#d97706" }
                                    };
                                    const category = String(fb.category || "GENERAL").toUpperCase();
                                    const style = catColors[category] || catColors["GENERAL"];

                                    return (
                                        <div key={idx} className="med-card premium" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--med-primary-light)', color: 'var(--med-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, overflow: 'hidden' }}>
                                                        {(fb.patient || "A").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '1rem' }}>{fb.patient || "Anonymous"}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{fb.date || "Unknown date"}</div>
                                                    </div>
                                                </div>
                                                <div style={{ background: style.bg, color: style.text, padding: '4px 12px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                                                    {category}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    i < fb.rating
                                                        ? <span key={i} style={{ color: '#ea580c', fontSize: '1.2rem' }}>★</span>
                                                        : <span key={i} style={{ color: '#ea580c', WebkitTextStroke: '1px #ea580c', WebkitTextFillColor: 'transparent', fontSize: '1.2rem' }}>★</span>
                                                ))}
                                            </div>
                                            <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
                                                {fb.comment}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                                                <button style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                                                    Reply
                                                </button>
                                                <div style={{ display: 'flex', gap: '16px', color: '#9ca3af' }}>
                                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg></button>
                                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="med-card" style={{ padding: '60px', textAlign: 'center' }}>
                                    <Icons.Loader size={48} color="var(--med-border-dark)" />
                                    <p style={{ marginTop: '16px', color: 'var(--med-text-muted)' }}>Waiting for patient feedback...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {settingsActiveTab === 'TestManagement' && (
                    <div className="med-table-card premium zoom-in-enter">
                        <div className="med-table-header" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Icons.TestTube size={24} color="var(--med-primary)" />
                                <h3 style={{ margin: 0 }}>Active Test Services</h3>
                            </div>
                            <div className="med-custom-filter-wrap">
                                <Icons.Filter className="filter-icon" size={14} />
                                <select
                                    className="med-select-mini attractive"
                                    value={selectedManagementCategory}
                                    onChange={(e) => setSelectedManagementCategory(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    {Object.keys(TEST_PRICING).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <table className="med-table premium-table">
                            <thead>
                                <tr>
                                    <th>Service Name</th>
                                    <th>Standard Rate</th>
                                    <th>Current Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(TEST_PRICING).filter(cat => selectedManagementCategory === 'All' || cat === selectedManagementCategory).map(cat => (
                                    TEST_PRICING[cat].map(test => {
                                        const isEnabled = !labSettings.disabledTests?.includes(test.name);
                                        return (
                                            <tr key={test.name}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{test.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)' }}>{cat}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 700, color: 'var(--med-text-main)' }}>₹{test.price}</div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <label className="med-toggle-switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={isEnabled}
                                                                onChange={async () => {
                                                                    const disabled = labSettings.disabledTests || [];
                                                                    const newDisabled = isEnabled
                                                                        ? [...disabled, test.name]
                                                                        : disabled.filter(n => n !== test.name);

                                                                    const newSettings = { ...labSettings, disabledTests: newDisabled };
                                                                    setLabSettings(newSettings);

                                                                    try {
                                                                        await fetch('http://localhost:5000/api/admin/lab-settings', {
                                                                            method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({
                                                                                workingHours: labSettings.workingHours,
                                                                                workingDays: labSettings.workingDays || [],
                                                                                holidays: labSettings.holidays || [],
                                                                                tests: newDisabled
                                                                            }),
                                                                            credentials: 'include'
                                                                        });
                                                                        showToast(`${test.name} ${isEnabled ? 'Disabled' : 'Enabled'}`);
                                                                    } catch (err) {
                                                                        showToast("Failed to sync settings", "error");
                                                                    }
                                                                }}
                                                            />
                                                            <span className="med-toggle-slider round"></span>
                                                        </label>
                                                        <span className={`med-status-badge ${isEnabled ? 'confirmed' : 'pending'}`}>
                                                            {isEnabled ? 'Enabled' : 'Disabled'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        <button
                                                            className="med-btn-outlined small"
                                                            onClick={() => {
                                                                setEditingTest(test);
                                                                setNewTestPrice(test.price);
                                                            }}
                                                            style={{ color: 'var(--med-primary)', borderColor: 'var(--med-border)' }}
                                                        >
                                                            <Icons.Edit size={14} /> Edit Amount
                                                        </button>
                                                        <button
                                                            className={`med-btn-outlined small ${isEnabled ? 'danger' : 'success'}`}
                                                            onClick={async () => {
                                                                const disabled = labSettings.disabledTests || [];
                                                                const newDisabled = isEnabled
                                                                    ? [...disabled, test.name]
                                                                    : disabled.filter(n => n !== test.name);

                                                                const newSettings = { ...labSettings, disabledTests: newDisabled };
                                                                setLabSettings(newSettings);

                                                                try {
                                                                    await fetch('http://localhost:5000/api/admin/lab-settings', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({
                                                                            workingHours: labSettings.workingHours,
                                                                            workingDays: labSettings.workingDays || [],
                                                                            holidays: labSettings.holidays || [],
                                                                            tests: newDisabled
                                                                        }),
                                                                        credentials: 'include'
                                                                    });
                                                                    showToast(`${test.name} ${isEnabled ? 'Disabled' : 'Enabled'}`);
                                                                } catch (err) {
                                                                    showToast("Failed to sync settings", "error");
                                                                }
                                                            }}
                                                        >
                                                            {isEnabled ? <><Icons.Slash size={14} /> Disable</> : <><Icons.Check size={14} /> Enable</>}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ))}
                            </tbody>
                        </table>

                        {/* Edit Test Rate Modal */}
                        {editingTest && (
                            <div className="med-modal-overlay">
                                <div className="med-modal zoom-in-enter" style={{ maxWidth: '400px' }}>
                                    <div className="med-modal-header">
                                        <h3>Update Test Pricing</h3>
                                        <button className="med-close-btn" onClick={() => setEditingTest(null)}>×</button>
                                    </div>
                                    <div className="med-modal-body">
                                        <div style={{ padding: '12px 16px', background: 'var(--med-primary-light)', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid var(--med-primary)' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--med-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Service</div>
                                            <div style={{ fontWeight: 700, color: 'var(--med-text-main)' }}>{editingTest.name}</div>
                                        </div>

                                        <div className="med-form-group">
                                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--med-text-muted)' }}>Enter New Amount (₹)</label>
                                            <div style={{ position: 'relative', marginTop: '8px' }}>
                                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--med-text-muted)' }}>₹</span>
                                                <input
                                                    className="med-input"
                                                    type="number"
                                                    value={newTestPrice}
                                                    onChange={e => setNewTestPrice(e.target.value)}
                                                    style={{ paddingLeft: '32px' }}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="med-modal-footer">
                                        <button className="med-btn-outlined" onClick={() => setEditingTest(null)} style={{ border: 'none' }}>Cancel</button>
                                        <button className="med-btn-gradient" onClick={() => {
                                            showToast(`Updated ${editingTest.name} rate to ₹${newTestPrice}`, "success");
                                            setEditingTest(null);
                                        }}>
                                            Confirm Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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

        const allReports = patientHistory ? (patientHistory.prescriptions || []) : [];
        // Prescriptions from WhatsApp/user uploads (not lab-generated 'rep-' reports)
        const uploadedReports = allReports.filter(r => !r.id || !r.id.toString().startsWith('rep-'));
        // Lab-generated PDF reports (rep- prefix)
        const generatedReports = allReports.filter(r => r.id && r.id.toString().startsWith('rep-'));
        const displayPatient = patientHistory?.details || selectedPatient;
        // Helper: best name to display for a prescription (prefer patient_name, then patient name)
        const getPrescriptionSender = (report) => report.patient_name || displayPatient.name || 'Unknown Sender';

        // --- Lightbox state (local to this render) ---
        // We use a ref-style trick with a parent div id to keep things simple without extra useState
        const openLightbox = (url) => {
            if (!url) return;
            const existing = document.getElementById('rx-lightbox-overlay');
            if (existing) existing.remove();
            const overlay = document.createElement('div');
            overlay.id = 'rx-lightbox-overlay';
            Object.assign(overlay.style, {
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.92)', zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'zoom-out', animation: 'fadeIn 0.2s ease'
            });
            const img = document.createElement('img');
            img.src = url;
            Object.assign(img.style, {
                maxWidth: '92vw', maxHeight: '92vh', borderRadius: '12px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                objectFit: 'contain', userSelect: 'none'
            });
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            Object.assign(closeBtn.style, {
                position: 'absolute', top: '20px', right: '28px',
                background: 'rgba(255,255,255,0.15)', border: 'none',
                color: 'white', fontSize: '2rem', lineHeight: 1, width: '44px', height: '44px',
                borderRadius: '50%', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 300,
                backdropFilter: 'blur(4px)'
            });
            closeBtn.onclick = (e) => { e.stopPropagation(); overlay.remove(); };
            overlay.onclick = () => overlay.remove();
            img.onclick = (e) => e.stopPropagation();
            overlay.appendChild(img);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
        };

        return (
            <div className="modal-overlay" onClick={() => setShowPatientHistoryModal(false)} style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
                zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px'
            }}>
                <div className="med-modal-animate" onClick={e => e.stopPropagation()} style={{
                    background: '#f8fafc', width: '1000px', maxWidth: '100%', maxHeight: '95vh',
                    borderRadius: '24px', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.45)', border: '1px solid #e2e8f0',
                    animation: 'modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {/* Header: Fixed Top */}
                    <div style={{
                        padding: '24px 40px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 20
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '1.5rem', fontWeight: 700,
                                boxShadow: '0 8px 16px -4px rgba(14, 165, 233, 0.3)'
                            }}>
                                {(displayPatient.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                    Patient Clinical History
                                </h2>
                                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Record for <span style={{ color: '#0ea5e9', fontWeight: 700 }}>{displayPatient.name}</span>
                                    <span style={{ color: '#e2e8f0' }}>|</span>
                                    PID: #{displayPatient.id}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPatientHistoryModal(false)}
                            className="med-btn-icon"
                            style={{
                                background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '50%',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <Icons.X size={20} color="#64748b" />
                        </button>
                    </div>

                    {/* Content Section: Scrollable */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }} className="med-scrollbar-hidden">
                        {!patientHistory ? (
                            <div style={{ padding: '100px 0', textAlign: 'center', color: '#64748b' }}>
                                <div className="spinner" style={{
                                    width: '48px', height: '48px', border: '3px solid #e2e8f0',
                                    borderTopColor: '#0ea5e9', borderRadius: '50%',
                                    animation: 'spin 1s linear infinite', margin: '0 auto 20px'
                                }}></div>
                                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Retrieving comprehensive patient record...</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                                {/* 1. Professional Profile Section */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    gap: '32px',
                                    position: 'relative',
                                    border: '1px solid #f1f5f9',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, width: '6px', height: '100%',
                                        background: 'linear-gradient(to bottom, #0284c7, #38bdf8)'
                                    }}></div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                            <Icons.User size={18} color="#0ea5e9" />
                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Patient Profile
                                            </h3>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                            gap: '24px 40px'
                                        }}>
                                            {/* Name first */}
                                            <div className="profile-info-row">
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Full Name</div>
                                                <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>{displayPatient.name || 'N/A'}</div>
                                            </div>
                                            <div className="profile-info-row">
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Contact Number</div>
                                                <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>{displayPatient.phone || 'Not Provided'}</div>
                                            </div>
                                            <div className="profile-info-row">
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Age / Gender</div>
                                                <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>
                                                    {displayPatient.age ? `${displayPatient.age} Yrs` : 'N/A'} • {displayPatient.gender || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="profile-info-row">
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Blood Group</div>
                                                <div style={{
                                                    color: (displayPatient.blood_group || '').includes('+') ? '#ef4444' : '#0ea5e9',
                                                    fontWeight: 800, fontSize: '1rem'
                                                }}>
                                                    {displayPatient.blood_group || 'N/A'}
                                                </div>
                                            </div>
                                            {/* Email last */}
                                            <div className="profile-info-row">
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</div>
                                                <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-all' }}>{displayPatient.email || 'N/A'}</div>
                                            </div>
                                            {displayPatient.address && displayPatient.address !== 'N/A' && (
                                                <div className="profile-info-row" style={{ gridColumn: 'span 2' }}>
                                                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Primary Address</div>
                                                    <div style={{ color: '#475569', fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.5 }}>{displayPatient.address}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. WhatsApp Prescriptions & Uploads Section */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                                    border: '1px solid #f1f5f9'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a'
                                            }}>
                                                <Icons.Share size={18} />
                                            </div>
                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Prescriptions & Uploads
                                            </h3>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '4px 12px', borderRadius: '99px', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                                            {uploadedReports.length} Items Found
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                                        {uploadedReports.length > 0 ? (
                                            uploadedReports.map(report => (
                                                <div key={report.id} className="history-card-premium" style={{
                                                    border: '1px solid #e8f5e9',
                                                    borderRadius: '20px',
                                                    overflow: 'hidden',
                                                    background: 'white',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                                                }}>
                                                    {/* Image Preview Area */}
                                                    <div style={{
                                                        height: '190px', background: '#f1f8f1', position: 'relative',
                                                        borderBottom: '1px solid #e8f5e9', overflow: 'hidden',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }} onClick={() => report.image_url && openLightbox(report.image_url)}>
                                                        {report.image_url ? (
                                                            <img
                                                                src={report.image_url}
                                                                alt={`Prescription by ${getPrescriptionSender(report)}`}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                                                className="hover-zoom"
                                                            />
                                                        ) : null}
                                                        {/* Fallback when no image or image fails */}
                                                        <div style={{
                                                            display: report.image_url ? 'none' : 'flex',
                                                            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                            gap: '8px', color: '#94a3b8', width: '100%', height: '100%',
                                                            position: 'absolute', top: 0, left: 0, background: '#f8fdf8'
                                                        }}>
                                                            <Icons.FileText size={40} />
                                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Prescription Document</span>
                                                        </div>
                                                        {/* WhatsApp badge */}
                                                        <div style={{
                                                            position: 'absolute', top: '10px', left: '10px',
                                                            padding: '3px 9px', borderRadius: '8px',
                                                            background: '#25D366', color: 'white',
                                                            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.5px',
                                                            display: 'flex', alignItems: 'center', gap: '4px',
                                                            boxShadow: '0 2px 8px rgba(37,211,102,0.4)'
                                                        }}>
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                                            WhatsApp
                                                        </div>
                                                        {/* ID badge */}
                                                        <div style={{
                                                            position: 'absolute', top: '10px', right: '10px',
                                                            padding: '3px 8px', borderRadius: '8px',
                                                            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
                                                            color: 'white', fontSize: '0.65rem', fontWeight: 700
                                                        }}>
                                                            #{report.id}
                                                        </div>
                                                    </div>

                                                    {/* Card Info */}
                                                    <div style={{ padding: '16px 18px' }}>
                                                        {/* Sender Name */}
                                                        <div style={{ marginBottom: '10px' }}>
                                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>
                                                                Sent By
                                                            </div>
                                                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #25D366, #128C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0 }}>
                                                                    {getPrescriptionSender(report).charAt(0).toUpperCase()}
                                                                </div>
                                                                {getPrescriptionSender(report)}
                                                            </div>
                                                        </div>

                                                        {/* Type + Date + View button */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{report.type || 'Prescription'}</span>
                                                                <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                                    <Icons.ClockSmall size={11} /> {report.date}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => report.image_url && openLightbox(report.image_url)}
                                                                disabled={!report.image_url}
                                                                style={{
                                                                    width: '34px', height: '34px', borderRadius: '10px',
                                                                    background: report.image_url ? '#ecfdf5' : '#f1f5f9',
                                                                    border: report.image_url ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                                                                    color: report.image_url ? '#16a34a' : '#94a3b8',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    cursor: report.image_url ? 'pointer' : 'default',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                title={report.image_url ? 'View Full Image' : 'No image available'}
                                                            >
                                                                <Icons.Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{
                                                gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center',
                                                background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0'
                                            }}>
                                                <Icons.Flask size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                                                <p style={{ color: '#94a3b8', margin: 0, fontWeight: 500 }}>No WhatsApp prescriptions or manual uploads available.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Medical Report Downloads Section */}
                                <div style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '32px',
                                    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                                    border: '1px solid #f1f5f9',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9'
                                        }}>
                                            <Icons.FileText size={18} />
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            Lab Result Reports
                                        </h3>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                        {generatedReports.length > 0 ? (
                                            generatedReports.map(report => (
                                                <div key={report.id} style={{
                                                    background: '#f8fafc',
                                                    borderRadius: '16px',
                                                    padding: '20px',
                                                    border: '1px solid #f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px'
                                                }}>
                                                    <div style={{
                                                        width: '56px', height: '56px', borderRadius: '12px', background: 'white',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981',
                                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <Icons.FileText size={28} />
                                                    </div>
                                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {report.type}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                                                            {report.date} • {report.status || 'Verified'}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => window.open(report.image_url, '_blank')}
                                                        style={{
                                                            background: '#0ea5e9', color: 'white', border: 'none',
                                                            width: '36px', height: '36px', borderRadius: '10px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.2)'
                                                        }}
                                                    >
                                                        <Icons.Download size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{
                                                gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center',
                                                background: '#f8fafc', borderRadius: '16px'
                                            }}>
                                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>No official reports have been issued yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const handleGenerateBill = (appointment) => {
        showToast(`Generating bill for ${appointment.patient || 'Patient'}...`, "success");
        // Integration point for PDF generation
    };

    const renderPayments = () => {
        const filteredPayments = paymentsData.filter(p => {
            const matchesSearch = String(p.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(p.payment_id || '').toLowerCase().includes(searchTerm.toLowerCase());

            const dateStr = p.payment_date || p.created_at;
            if (!dateStr) return matchesSearch;

            const paymentDate = new Date(dateStr);
            const now = new Date();

            if (paymentDateFilter === 'Today') {
                const today = now.toISOString().split('T')[0];
                return matchesSearch && String(dateStr).includes(today);
            }
            if (paymentDateFilter === 'This Week') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return matchesSearch && paymentDate >= oneWeekAgo;
            }
            if (paymentDateFilter === 'This Month') {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return matchesSearch && paymentDate >= startOfMonth;
            }
            return matchesSearch;
        });

        const totalRevenue = filteredPayments.reduce((sum, p) => sum + (Number(p.payment_amount) || 0), 0);
        const pendingAmount = filteredPayments
            .filter(p => (p.payment_status || '').toLowerCase() === 'pending')
            .reduce((sum, p) => sum + (Number(p.payment_amount) || 0), 0);
        const successfulPayouts = filteredPayments
            .filter(p => (p.payment_status || 'Paid').toLowerCase() === 'paid').length;

        const pendingPercent = totalRevenue > 0 ? Math.round((pendingAmount / totalRevenue) * 100) : 0;

        return (
            <div className="med-payments-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="med-premium-header">
                    <div>
                        <h2 className="med-page-heading">Financial Transactions</h2>
                        <p className="med-page-subheading">Monitor revenue, payment methods, and transaction status</p>
                    </div>
                </div>

                {/* 3 Premium KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {/* Total Revenue */}
                    <div className="med-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', background: '#fff', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                <Icons.CreditCard size={24} />
                            </div>
                            <div style={{ padding: '4px 10px', borderRadius: '100px', background: '#ecfdf5', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Icons.TrendingUp size={12} /> +12.5%
                            </div>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Total Revenue</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                            ₹<CountUp end={totalRevenue} />
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '8px' }}>Growth vs previous month</p>
                    </div>

                    {/* Pending Invoices */}
                    <div className="med-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', background: '#fff' }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Pending Invoices</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 16px 0' }}>
                            ₹<CountUp end={pendingAmount} />
                        </h3>
                        <div style={{ height: '8px', width: '100%', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                            <div style={{ height: '100%', width: `${pendingPercent || 15}%`, background: '#2563eb', borderRadius: '4px' }}></div>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{pendingPercent || 15}% of total value pending</p>
                    </div>

                    {/* Successful Payouts */}
                    <div className="med-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', background: '#fff' }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Successful Payouts</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 16px 0' }}>
                            <CountUp end={successfulPayouts} />
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                            <span>System operating at 99.9% uptime</span>
                        </div>
                    </div>
                </div>

                {/* Filter Row */}
                <div className="med-card" style={{ padding: '12px', borderRadius: '16px', border: '1px solid #f1f5f9', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', padding: '4px', borderRadius: '12px' }}>
                        {['All Time', 'Today', 'This Week', 'This Month'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setPaymentDateFilter(filter)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: paymentDateFilter === filter ? '#fff' : 'transparent',
                                    color: paymentDateFilter === filter ? '#2563eb' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: paymentDateFilter === filter ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {loadingPayments ? (
                    <div style={{ textAlign: 'center', padding: '100px' }}>
                        <div className="med-loader-premium"></div>
                        <p style={{ marginTop: '16px', color: 'var(--med-text-muted)', fontWeight: 600 }}>Syncing Financial Records...</p>
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="med-card" style={{ textAlign: 'center', padding: '60px' }}>
                        <div className="med-empty-state-content">
                            <Icons.CreditCard size={48} color="#cbd5e1" />
                            <h3>No transactions found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    </div>
                ) : (
                    <div className="med-payments-tickets-grid">
                        {filteredPayments.map(p => (
                            <div key={p.id} className="med-payment-ticket">
                                <div className="ticket-header">
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--med-text-main)', fontSize: '1.1rem' }}>{p.patient_name || p.username || 'Patient'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--med-text-muted)', fontFamily: 'monospace' }}>ID: {p.id || p.transaction_id}</div>
                                    </div>
                                    <span className={`med-status-badge ${String(p.payment_status || 'Paid').toLowerCase()}`} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem' }}>
                                        {p.payment_status || 'Paid'}
                                    </span>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: 'var(--med-text-body)', fontWeight: 600, margin: '8px 0' }}>
                                    Tests: {p.tests_booked || 'General Checkup'}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
                                    <div className="med-tag small" style={{ background: 'var(--med-primary-light)', color: 'var(--med-primary)' }}>{p.payment_method || 'Online'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--med-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Icons.Calendar size={12} /> {String(p.payment_date || p.created_at).split(' ')[0]}
                                    </div>
                                </div>

                                <div className="ticket-divider"></div>

                                <div className="ticket-footer">
                                    <div className="ticket-amount">₹{p.payment_amount || 0}</div>
                                    <button
                                        className="med-btn-gradient small"
                                        title="View Receipt"
                                        onClick={() => {
                                            setSelectedPaymentBill(p);
                                            setShowBillModal(true);
                                        }}
                                    >
                                        <Icons.Eye size={16} /> Receipt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div >
        );
    };

    const renderBillModal = () => {
        if (!showBillModal || !selectedPaymentBill) return null;
        const p = selectedPaymentBill;
        return (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
                <div className="med-modal-animate" style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Icons.CheckCircle size={32} color="#10b981" />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--med-text-main)' }}>Payment Receipt</h2>
                        <p style={{ color: 'var(--med-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>TXN: {p.payment_id}</p>
                    </div>

                    <div style={{ borderTop: '1px dashed var(--med-border)', borderBottom: '1px dashed var(--med-border)', padding: '24px 0', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--med-text-muted)', fontSize: '0.9rem' }}>Patient Name</span>
                            <span style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{p.patient_name || p.username || 'Patient'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--med-text-muted)', fontSize: '0.9rem' }}>Date</span>
                            <span style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{String(p.payment_date || p.created_at).split(/[ T]/)[0]}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--med-text-muted)', fontSize: '0.9rem' }}>Time</span>
                            <span style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{String(p.payment_date || p.created_at).split(/[ T]/)[1]?.slice(0, 5) || '10:00'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--med-text-muted)', fontSize: '0.9rem' }}>Tests Ordered</span>
                            <span style={{ fontWeight: 600, color: 'var(--med-primary)', textAlign: 'right', maxWidth: '60%' }}>{p.tests_booked || 'General Checkup'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--med-text-muted)', fontSize: '0.9rem' }}>Payment Method</span>
                            <span style={{ fontWeight: 600, color: 'var(--med-text-main)' }}>{p.method || 'Online'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--med-text-main)' }}>Total Amount</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--med-primary)' }}>₹{p.payment_amount || 0}</span>
                        </div>
                    </div>

                    <button className="med-btn-gradient" style={{ width: '100%', padding: '14px', borderRadius: '14px', marginTop: '20px' }} onClick={() => setShowBillModal(false)}>
                        <Icons.CheckCircle size={18} /> Done & Close
                    </button>
                    <button className="med-btn-outlined small" style={{ width: '100%', marginTop: '12px', border: '1px solid var(--med-border)', borderRadius: '12px' }} onClick={() => window.print()}>
                        <Icons.Download size={16} /> Print Receipt
                    </button>
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

                    {activeSection === 'Payments' && renderPayments()}
                </div>
            </main>

            {/* Modals */}
            {renderPatientHistoryModal()}
            {renderBillModal && renderBillModal()}

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
            {/* New Booking Modal */}
            {
                showBookingModal && (
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

                                <div className="med-grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
                                    <div className="med-form-group">
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Category *</label>
                                        <select
                                            className="med-input-enhanced med-select-enhanced"
                                            value={newBooking.category || ''}
                                            onChange={e => {
                                                const cat = e.target.value;
                                                setNewBooking({ ...newBooking, category: cat, test: TEST_CATEGORIES[cat]?.[0] || '' });
                                            }}
                                        >
                                            <option value="">-- Choose Category --</option>
                                            {Object.keys(TEST_CATEGORIES).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="med-form-group">
                                        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--med-text-body)', marginBottom: '6px', display: 'block' }}>Test Name *</label>
                                        <select
                                            className="med-input-enhanced med-select-enhanced"
                                            value={newBooking.test}
                                            onChange={e => setNewBooking({ ...newBooking, test: e.target.value })}
                                            disabled={!newBooking.category}
                                        >
                                            <option value="">-- Select Test --</option>
                                            {(TEST_CATEGORIES[newBooking.category] || []).map(test => (
                                                <option key={test} value={test}>{test}</option>
                                            ))}
                                        </select>
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
                )
            }
            {/* --- Appointment Details Modal --- */}
            {
                detailsModalOpen && selectedAppointment && (
                    <div className="med-modal-overlay">
                        <div className="med-modal" style={{ width: '800px', maxWidth: '95%' }}>
                            <div className="med-modal-header">
                                <h3>Appointment Details - {selectedAppointment.id}</h3>
                                <button className="med-close-btn" onClick={() => setDetailsModalOpen(false)}>├ù</button>
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
                )
            }

            {/* Status Update Modal */}
            {
                showStatusModal && statusUpdateAppointment && (
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
                )
            }
            {
                showTokenModal && currentTokenData && (
                    <div className="med-modal-overlay" style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                        <div className="med-modal-content" style={{ maxWidth: '900px', width: '90%', borderRadius: '24px', padding: '32px', background: '#f8fafc', overflow: 'visible' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ margin: '0 0 8px 0', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                                        Select Booking Slot
                                    </h2>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b', maxWidth: '400px', lineHeight: '1.5' }}>
                                        Browse available laboratory resources and reserve your preferred time slot for clinical testing.
                                    </p>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Lab Capacity (Persons)</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                                            <Icons.Users size={18} />
                                        </div>
                                        <input 
                                            type="number" 
                                            value={tokenLabCapacity} 
                                            onChange={(e) => setTokenLabCapacity(parseInt(e.target.value) || 0)}
                                            min="1"
                                            max="100"
                                            style={{ 
                                                width: '180px', padding: '12px 16px 12px 42px', 
                                                border: '1px solid #e2e8f0', borderRadius: '12px',
                                                fontSize: '1rem', fontWeight: 700, color: '#1e293b',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <button onClick={() => setShowTokenModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                        <Icons.X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
                                        Tokens: {new Date(currentTokenData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', color: '#64748b' }}>
                                            <Icons.ChevronLeft size={16} />
                                        </button>
                                        <button style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', color: '#1e293b' }}>
                                            <Icons.ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="med-token-cards-grid">
                                    {Array.from({ length: tokenLabCapacity }, (_, i) => i + 1).map(num => {
                                        const isBooked = bookedTokens.includes(num);
                                        return (
                                            <button
                                                key={num}
                                                className={`med-token-card ${isBooked ? 'booked' : 'available'}`}
                                                onClick={() => !isBooked && handleBookToken(num)}
                                                disabled={isBookingToken || isBooked}
                                            >
                                                <div className="token-icon">
                                                    {isBooked ? <Icons.Check size={14} strokeWidth={3} /> : <Icons.Lock size={14} strokeWidth={2.5} />}
                                                </div>
                                                <div className="token-time">Token {num}</div>
                                                <div className="token-status">{isBooked ? 'BOOKED' : 'AVAILABLE'}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowTokenModal(false)}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#e2e8f0',
                                        color: '#475569',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#cbd5e1'}
                                    onMouseOut={(e) => e.target.style.background = '#e2e8f0'}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default LabAdminDashboard;
