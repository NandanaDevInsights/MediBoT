import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/LabHero.jpg';
import labHeroSplit from '../assets/LabHeroSplit.png';
import logoImage from '../assets/Logo.png';
import microscopeBg from '../assets/MicroscopeBg.png';
import lab1 from '../assets/lab1.png';
import lab2 from '../assets/lab2.png';
import lab3 from '../assets/lab3.png';
import lab4 from '../assets/lab4.png';
import lab5 from '../assets/lab5.png';
import lab6 from '../assets/lab6.png';
import lab7 from '../assets/lab7.png';
import lab8 from '../assets/lab8.png';

import './LandingPage.css';
import { getUserProfile, getUserReports, updateUserProfile, getUserNotifications } from '../services/api';

// --- Icon Components ---
const IconHome = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
const IconActivity = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconArrowRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const IconArrowLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const IconDroplet = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2.69l5.74 5.74c.9 1 1.63 2.16 2.1 3.44.48 1.28.6 2.65.37 4-.24 1.34-1 2.54-2.2 3.32-1.2.78-2.6 1-4.01.65-2.66-.65-4.5-3.05-4.5-5.8V2.69z"></path>
  </svg>
);

const IconCalendar = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconFileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconUser = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconX = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const IconBell = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconClock = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconShield = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconStar = ({ size = 20, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const IconCheckCircle = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconUploadCloud = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"></polyline>
    <line x1="12" y1="12" x2="12" y2="21"></line>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
    <polyline points="16 16 12 12 8 16"></polyline>
  </svg>
);

const IconMessageCircle = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconSend = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const IconTrash = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);




const IconCreditCard = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconGrid = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconGooglePay = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const IconPhonePeShape = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="1" y="1" width="22" height="22" rx="6" fill="#5F259F" />
    <path d="M15 8H8.5V6.5H15V8ZM13 8V12.5C13 14 12 15 10.5 15H9V17H7V13H8.5C9 13 9.5 12.8 9.5 12V8H11V17H13V8Z" fill="white" />
  </svg>
);

const IconPaytm = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 24" fill="none">
    <rect x="0" y="2" width="32" height="20" rx="4" fill="#fff" />
    <path d="M4 12h2.5v1.2h1.2V11H10v5h-1.2v-1.2h-1.5V16H6v-3.2H4v-0.8zm8 0h1.2v4h-1.2v-4zm2.5 0h1.4l1 2.5 1-2.5h1.4v4h-1.2v-2.8l-1 2.8h-0.4l-1-2.8V16h-1.2v-4z" fill="#002970" />
    <path d="M2.5 8C2.5 8 10 7 16 7C22 7 29.5 8 29.5 8" stroke="#00BAF2" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconBHIM = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3L3.5 18H20.5L12 3Z" fill="#F47B20" />
    <path d="M12 21L5.5 10H18.5L12 21Z" fill="#189934" style={{ mixBlendMode: 'multiply' }} opacity="0.8" />
    <circle cx="12" cy="13" r="1.5" fill="white" />
  </svg>
);

const IconSBI = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#280071" />
    <circle cx="12" cy="12" r="4" fill="white" />
    <rect x="11" y="12" width="2" height="10" fill="white" />
  </svg>
);

const IconHDFC = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#004C8F" />
    <rect x="2" y="9" width="20" height="6" fill="#ED232A" />
    <rect x="9" y="2" width="6" height="20" fill="#ED232A" />
    <rect x="9" y="9" width="6" height="6" fill="#ffffff" />
  </svg>
);

const IconICICI = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#F37E13" />
    <path d="M2 14h20v6H2z" fill="#053c6d" />
    <circle cx="12" cy="10" r="3" fill="white" />
    <path d="M10 10h4v6h-4z" fill="white" />
  </svg>
);

const IconAxis = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 22h20L12 2zm0 4l6 14H6l6-14z" fill="#97144D" />
    <path d="M14 14l-2-4-2 4h4z" fill="#97144D" />
  </svg>
);

const IconKotak = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="#ED1C24" />
    <path d="M7 6v12h3V6H7zm9 0h-3l-3 6 3 6h3l-3-6 3-6z" fill="white" />
  </svg>
);

const IconCanara = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 22h20L12 2z" fill="#0091D5" />
    <path d="M12 8L7 18h10L12 8z" fill="#F4E04D" />
  </svg>
);

const IconUnion = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="4" fill="#E21D25" />
    <path d="M7 4v16M17 4v16" stroke="white" strokeWidth="4" />
  </svg>
);


const ALL_TESTS = [
  "Complete Blood Count (CBC)",
  "Lipid Profile",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Profile (T3, T4, TSH)",
  "Blood Glucose (Fasting/PP)",
  "HbA1c",
  "Urine Routine",
  "Vitamin D Total",
  "Vitamin B12",
  "Iron Profile",
  "Dengue NS1 Antigen",
  "Malaria Parasite",
  "Stool Routine",
  "ECG",
  "X-Ray Chest"
];

// LABS_DATA removed - Using OpenStreetMap Live Data

const TEST_CATEGORIES = {
  "Blood Tests": [
    "Complete Blood Count (CBC)", "Hemoglobin (Hb)", "Blood Group & Rh Factor", "ESR (Erythrocyte Sedimentation Rate)",
    "Peripheral Smear", "Fasting Blood Sugar (FBS)", "Postprandial Blood Sugar (PPBS)", "Random Blood Sugar (RBS)",
    "HbA1c", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile (T3, T4, TSH)",
    "C-Reactive Protein (CRP)", "Widal Test", "VDRL", "HIV", "HBsAg", "Anti-HCV", "Dengue (NS1, IgG, IgM)",
    "Malaria (Antigen / Smear)", "PT / INR"
  ],
  "Urine Tests": [
    "Urine Routine Examination", "Urine Microscopy", "Urine Sugar", "Urine Protein / Albumin", "Ketone Bodies",
    "Bile Salts & Bile Pigments", "Urine Culture & Sensitivity", "Pregnancy Test (hCG)", "Microalbuminuria",
    "24-Hour Urine Protein", "Creatinine Clearance"
  ],
  "Sputum Tests": [
    "Sputum AFB (ZN Stain)", "Sputum AFB (Fluorescent)", "CBNAAT / GeneXpert", "Sputum Culture & Sensitivity",
    "Gram Stain", "Fungal Culture", "Sputum Cytology"
  ],
  "Stool Tests": [
    "Stool Routine Examination", "Stool Microscopy", "Ova & Cyst", "Stool Culture", "Occult Blood Test",
    "H. pylori Antigen (Stool)", "Fecal Fat", "Calprotectin", "Reducing Substances"
  ]
};

const LandingPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const labsSectionRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Labs');
  const [labsList, setLabsList] = useState([]); // Raw labs from OSM
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [visibleLimit, setVisibleLimit] = useState(20); // Show more labs by default
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // New State for Features
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [patientDetails, setPatientDetails] = useState({ username: '', displayName: '', age: '', gender: '', savedLocation: '', bloodGroup: '', contact: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Chat Widget State
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: "ai", text: "👋 Welcome to MediBot! I'm your healthcare assistant. You can ask me how to search for labs, book a test, or where to find your medical reports. How can I help you today?" }
  ]);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  // Notifications & Reminders State
  const [notifications, setNotifications] = useState([]);

  const [reminders, setReminders] = useState([
    { id: 1, text: "Fasting required for Thyroid test tomorrow.", time: "Tomorrow, 8 AM" },
    { id: 2, text: "Follow-up checkup pending.", time: "Next Week" }
  ]);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotification = async (id) => {
    // If id is local (created via Date.now() for demo purposes only and large enough), we might not find it in backend, but we'll try. 
    // Actually all notifications should now come from backend or be removed if just frontend.
    // We will try backend delete, if fails (or if it was a frontend-only note), we still remove from UI.

    if (!window.confirm("Remove this notification?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/user/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      // Remove from UI regardless of backend status to stay responsive, 
      // effectively treating failure as "already gone" or "local only".
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error("Error deleting notification:", e);
      // Still remove from UI
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const clearAllNotifications = () => {
    if (notifications.length === 0) return;
    if (window.confirm("Clear all notifications?")) {
      setNotifications([]);
    }
  };

  const clearReminder = (id) => {
    if (window.confirm("Remove this reminder?")) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  const clearAllReminders = () => {
    if (reminders.length === 0) return;
    if (window.confirm("Clear all reminders?")) {
      setReminders([]);
    }
  };



  // Location Logic
  const [userLocationInput, setUserLocationInput] = useState('');
  const [userCoords, setUserCoords] = useState(null); // {lat, lon}
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Booking Logic
  const [bookings, setBookings] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMyBookingsModal, setShowMyBookingsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Pay Online'); // Default to Online for better UX
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'upi_scan', 'netbanking_selection', 'card_form'
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'download.pdf'; // specific default
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback
      window.open(url, '_blank');
    }
  };

  const handleProceedToPayment = () => {
    if (selectedTests.length === 0) {
      alert("Please select at least one test.");
      return;
    }
    if (!bookingDate) {
      alert("Please select a preferred date for your appointment.");
      return;
    }
    if (!bookingTime) {
      alert("Please select a preferred time.");
      return;
    }
    setPaymentStep('select');
    setShowPaymentModal(true);
  };

  const initiateRazorpayPayment = async () => {
    try {
      // Calculate total amount
      const totalAmount = (selectedLab?.price || 0) + (selectedTests.length * 150);

      // Formatted list of tests for Razorpay notes
      const formattedTests = selectedTests.map(t => typeof t === 'object' ? t.name : t).join(', ');

      // Step 1: Create order on backend
      const orderResponse = await fetch('http://localhost:5000/api/create-payment-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          notes: {
            lab: selectedLab?.name,
            tests: formattedTests,
            date: bookingDate,
            time: bookingTime
          }
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create payment order.");
      }

      const orderData = await orderResponse.json();

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MediBot Healthcare",
        description: `Booking for ${selectedLab?.name}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyRes = await fetch('http://localhost:5000/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              // Payment verified successfully
              setPaymentMethod('Online');
              setPaymentStatus('Paid');

              // Confirm booking with updated status
              await handleConfirmBooking('Online', 'Paid');

              setShowPaymentModal(false);
              setShowFeedbackModal(true);
              showToast("✓ Payment successful! Booking confirmed.", 'success');
            } else {
              const errorData = await verifyRes.json().catch(() => ({}));
              setPaymentStep('select');
              showToast(errorData.message || "Payment verification failed. Please contact support.", 'error');
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStep('select');
            showToast("Error verifying payment. Please contact support.", 'error');
          }
        },
        prefill: {
          name: userProfile?.displayName || userProfile?.username || "Guest",
          email: userProfile?.email || "",
          contact: userProfile?.contactNumber || ""
        },
        theme: {
          color: "#2563eb"
        },
        modal: {
          ondismiss: function () {
            // User closed Razorpay modal
            setPaymentStep('select');
            showToast("Payment cancelled", 'error');
          }
        }
      };

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page.");
      }

      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setPaymentStep('select');
        showToast(`Payment failed: ${response.error.description || 'Please try again'}`, 'error');
      });

      rzp.open();

    } catch (err) {
      console.error("Razorpay Error:", err);
      setPaymentStep('select');
      showToast(err.message || "Something went wrong with the payment gateway. Please try again.", 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to remove this booking from your history?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/user/appointments/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
        showToast("Booking removed successfully.", 'success');
      } else {
        showToast("Failed to remove booking.", 'error');
      }
    } catch (e) {
      console.error(e);
      showToast("Error removing booking.", 'error');
    }
  };

  const finalizeBooking = async () => {
    // Step 1: Routing based on Method
    if (paymentStep === 'select') {
      if (paymentMethod === 'UPI') {
        setPaymentStep('upi_scan');
        return;
      }
      if (paymentMethod === 'Net Banking') {
        setPaymentStep('card_form');
        return;
      }
      // If Pay at Lab, fall through to confirm
    }

    // Step 2: Final Confirmation (called by sub-steps or Pay at Lab)
    setShowPaymentModal(false);
    await handleConfirmBooking();
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    // Determine message based on rating
    let message = "Thank you for your feedback!";
    let type = 'success';
    if (feedbackRating >= 4) message = "⭐ We're glad you had a great experience!";
    else if (feedbackRating > 0 && feedbackRating < 4) {
      message = "📝 Thanks. We'll try to improve.";
      type = 'success';
    }

    showToast(message, type);
    setShowFeedbackModal(false);
    setFeedbackRating(0);
    setFeedbackText("");
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const newMsg = { id: Date.now(), type: "user", text: chatInput };

    // Optimistic update
    const currentHistory = chatMessages; // Capture current history
    setChatMessages([...chatMessages, newMsg]);
    setChatInput("");

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          history: currentHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: "ai",
          text: data.response
        }]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: "ai",
          text: errorData.response || "I'm experiencing a minor brain freeze. Can you ask that again?"
        }]);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      // Backend should now be robust, so if we are here, it's likely a network/CORS failure.
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: "ai",
        text: "I'm having trouble retrieving a response from the server. Please check your internet connection."
      }]);
    }
  };

  // Advanced Features State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showLabDetailsModal, setShowLabDetailsModal] = useState(false);
  const [activeLabTab, setActiveLabTab] = useState('Overview'); // Overview, Tests, Reviews
  const [activeTestCategory, setActiveTestCategory] = useState('Blood Tests');

  // Scroll Listener for Navbar
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock Body Scroll when Booking Modal is open
  useEffect(() => {
    if (showBookingModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBookingModal]);

  // ... (existing useEffects)

  // Booking Actions
  const handleBookNow = (lab) => {
    setSelectedLab(lab);
    setBookingDate(new Date().toISOString().split('T')[0]); // Default to today
    setBookingTime('09:00');
    // Default select all tags as suggested tests or let user pick. Let's select first one.
    setSelectedTests(lab.tags && lab.tags.length > 0 ? [lab.tags[0]] : []);
    setShowBookingModal(true);
    setShowLabDetailsModal(false); // Close details if open
  };

  const handleViewDetails = (lab) => {
    setSelectedLab(lab);
    setActiveLabTab('Overview');
    setShowLabDetailsModal(true);
  };

  // Fetch Bookings from Backend
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/appointments', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    }
  };

  // Fetch on mount and when modal opens
  useEffect(() => {
    fetchBookings();
  }, [showMyBookingsModal]);

  // Initial fetch on mount
  useEffect(() => {
    fetchBookings();

    // Fetch Notifications
    const fetchNotes = async () => {
      try {
        const notes = await getUserNotifications();
        if (notes) setNotifications(notes);
      } catch (e) { console.error(e); }
    };
    fetchNotes();

    // Poll for new notifications every 10 seconds
    const notificationInterval = setInterval(() => {
      fetchNotes();
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(notificationInterval);
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch('http://localhost:5000/api/user/appointments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ appointment_id: bookingId })
      });

      if (response.ok) {
        showToast("✓ Booking cancelled successfully.", 'success');
        fetchBookings(); // Refresh list
      } else {
        showToast("Failed to cancel booking.", 'error');
      }
    } catch (e) {
      console.error(e);
      showToast("Error cancelling booking.", 'error');
    }
  };

  const handleConfirmBooking = async (method = paymentMethod, pStatus = paymentStatus) => {
    if (!bookingDate || !bookingTime || selectedTests.length === 0) {
      alert("Please select date, time, and at least one test.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      labName: selectedLab.name,
      doctor: 'Dr. Smith (Ref)', // Mock
      date: bookingDate,
      time: bookingTime,
      tests: selectedTests,
      status: 'Confirmed',
      location: selectedLab.location
    };

    // Send to Backend
    try {
      const response = await fetch('http://localhost:5000/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          labName: newBooking.labName,
          // NEW Layout of Data:
          labAddress: selectedLab.address || selectedLab.location,
          lat: selectedLab.lat,
          lon: selectedLab.lon,
          location: selectedLab.location, // General area name

          doctor: newBooking.doctor,
          date: newBooking.date,
          time: newBooking.time,
          tests: newBooking.tests,

          // Patient Details from state
          patientName: patientDetails.displayName || patientDetails.username || 'Guest',
          age: patientDetails.age,
          gender: patientDetails.gender,
          email: userProfile?.email,
          contact: patientDetails.contact,

          // Payment Info
          paymentMethod: method,
          paymentStatus: pStatus
        })
      });
      if (response.ok) {
        // Wait for server to process, then fetch fresh list
        await fetchBookings();
        setShowBookingModal(false);

        // Notification for Royal Clinical Laboratory
        if (selectedLab.name === 'Royal Clinical Laboratory') {
          setNotifications(prev => [
            { id: Date.now(), text: `Booking confirmed at Royal Clinical Laboratory`, time: "Just now", isRead: false },
            ...prev
          ]);
          setShowNotifications(true); // Open notification dropdown to show user
        }

        showToast("🎉 Booking Confirmed! Check 'Bookings' in the navbar.", 'success');
      } else {
        showToast("Failed to confirm booking with server.", 'error');
      }
    } catch (e) {
      console.error(e);
      // Fallback
      showToast("Network Error. Booking might not be saved remotely.", 'error');
      setBookings([...bookings, newBooking]); // Optimistic update fallback
      setShowBookingModal(false);
    }
  };

  const toggleTestSelection = (test) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  // ... (existing functions)


  // Reports State
  const [reports, setReports] = useState([]);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('Uploaded');

  const isAnyModalOpen = showNotifications || showReminders || showMyBookingsModal || showReportsModal || showProfileModal || showBookingModal;

  const handleHomeClick = () => {
    setShowNotifications(false);
    setShowReminders(false);
    setShowMyBookingsModal(false);
    setShowReportsModal(false);
    setShowProfileModal(false);
    setShowBookingModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial Load - Check Location
  useEffect(() => {
    // Strictly show location modal on every entry to Landing Page as requested
    setShowLocationModal(true);

    // Optional: If we still want to persist but force confirmation, we could read it but still show the modal.
    // For now, we strictly follow "must show a pop up".
  }, []);

  // Fetch Labs from OSM when User Coordinates Change
  useEffect(() => {
    const fetchOsmLabs = async () => {
      if (!userCoords) return;

      setLocationLoading(true);

      const labImages = [lab1, lab2, lab3, lab4, lab5, lab6, lab7, lab8];

      // Helper to generate fallback/demo labs
      const generateFallbackLabs = (lat, lon, locationName) => {
        const baseName = locationName ? locationName.split(',')[0].trim() : "Local";
        const demos = [];
        for (let i = 1; i <= 6; i++) {
          demos.push({
            id: 9000 + i,
            name: `${baseName} Diagnostic Center ${i}`,
            lat: lat + (Math.random() - 0.5) * 0.015,
            lon: lon + (Math.random() - 0.5) * 0.015,
            location: `${baseName} Main Road`,
            address: `${baseName} Street, District`,
            rating: (4.0 + Math.random()).toFixed(1),
            price: 400 + Math.floor(Math.random() * 400),
            tags: ['General', 'Blood Test', 'Pathology'],
            image: labImages[i % labImages.length],
            openTime: "08:00 AM - 09:00 PM"
          });
        }
        return demos;
      };

      // CHECK FOR KANJIRAPALLY DEMO DATA
      // If user searched for Kanjirapally, we FORCE these specific results as per requirement.
      const locationLower = userLocationInput ? userLocationInput.toLowerCase() : "";
      if (locationLower.includes("kanjirapally") || locationLower.includes("kanjirappally") || locationLower.includes("kply")) {
        const kLabsData = [
          { name: "Scanron Diagnostics", location: "Kanjirappally, Kottayam", desc: "Laboratory, Medical Laboratory, Clinical Laboratory, ECG Clinic", time: "08:30 PM", rating: "New", price: 450 },
          { name: "Sri Diagnostics Pvt (Ltd)", location: "Kanjirappally, Kottayam", desc: "Clinical and Medical Laboratory, Pathology Lab, Blood, Urine, Sputum", time: "06:30 PM", rating: "New", price: 500 },
          { name: "DDRC SRLl Diagnostic Center", location: "Kanjirappally, Kottayam", desc: "Diagnostic center and Laboratory", time: "24 Hours", rating: 5.0, price: 600 },
          { name: "Amala Laboratary", location: "Kanjirappally, Kottayam", desc: "Clinical and Medical Laboratory, Blood, Urine, Sputum, Stool", time: "04:30 PM", rating: "New", price: 400 },
          { name: "Dianova", location: "Kanjirappally, Kottayam", desc: "Clinical and Medical Laboratory, Blood, Urine, Sputum, Stool", time: "06:30 PM", rating: "New", price: 550 },
          { name: "Royal Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Clinical laboratory and other clinical tests", time: "07:00 PM", rating: "New", price: 480 },
          { name: "Marymatha Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Clinical Testing of All Specimens, Blood, Urine, Stool, Body Fluids", time: "05:30 PM", rating: "New", price: 420 },
          { name: "Dianova Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Clinical Laboratory", time: "24 Hours", rating: "New", price: 500 },
          { name: "ClinoTech Laboratories", location: "Kanjirappally, Kottayam", desc: "Diagnostic Laboratory", time: "08:00 PM", rating: 5.0, price: 650 },
          { name: "Usha Clinic", location: "Kanjirappally, Kottayam", desc: "Clinical Laboratory, Medical Laboratory", time: "07:00 PM", rating: 4.0, price: 350 }
        ];

        const mappedKLabs = kLabsData.map((lab, i) => ({
          id: 8000 + i,
          name: lab.name,
          // Deterministic coordinates based on index to prevent backend duplicates
          lat: userCoords.lat + (((i % 4) - 1.5) * 0.005),
          lon: userCoords.lon + ((Math.floor(i / 4) - 1) * 0.005),
          location: lab.location,
          address: "Near Junction, Kanjirapally", // Generic address if not provided
          rating: lab.rating,
          price: lab.price,
          tags: lab.desc.split(',').map(s => s.trim()).slice(0, 3), // Take first 3 tags
          image: labImages[i % labImages.length],
          openTime: lab.time.includes("24") ? "24 Hours" : `Open until ${lab.time}`
        }));

        setLabsList(mappedKLabs);
        setLocationLoading(false);
        return; // Skip fetch
      }

      try {
        // Robust Query: 10km radius to ensure results, explicit types for reliability.
        // Timeout set to 25s to handle slower connections or server load.
        const query = `
          [out:json][timeout:25];
          (
            node["healthcare"="laboratory"](around:10000,${userCoords.lat},${userCoords.lon});
            way["healthcare"="laboratory"](around:10000,${userCoords.lat},${userCoords.lon});
            relation["healthcare"="laboratory"](around:10000,${userCoords.lat},${userCoords.lon});
            node["amenity"="laboratory"](around:10000,${userCoords.lat},${userCoords.lon});
            way["amenity"="laboratory"](around:10000,${userCoords.lat},${userCoords.lon});
            relation["amenity"="laboratory"](around:10000,${userCoords.lat},${userCoords.lon});
          );
          out center;
        `;

        const encodedQuery = encodeURIComponent(query.replace(/\s+/g, ' ').trim());
        const mirrors = [
          'https://overpass-api.de/api/interpreter',
          'https://overpass.kumi.systems/api/interpreter',
          'https://overpass.osm.ch/api/interpreter'
        ];

        let data = null;
        let lastError = null;

        for (const mirror of mirrors) {
          try {
            const url = `${mirror}?data=${encodedQuery}`;
            const res = await fetch(url, {
              headers: {
                'Accept': 'application/json',
                // Proper User-Agent is required by OSM/Overpass usage policies
                'User-Agent': 'MediBot/1.0 (https://medibot.example.com; contact@example.com)'
              },
              mode: 'cors'
            });

            if (res.ok) {
              data = await res.json();
              if (data) break;
            } else {
              console.warn(`Mirror ${mirror} failed with status: ${res.status}`);
            }
          } catch (mirrorErr) {
            console.warn(`Mirror ${mirror} failed:`, mirrorErr);
            lastError = mirrorErr;
          }
        }

        // If Overpass fails across all mirrors, try a limited fallback via Nominatim
        if (!data) {
          console.log("All Overpass mirrors failed. Trying Nominatim fallback...");
          try {
            const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=laboratory&lat=${userCoords.lat}&lon=${userCoords.lon}&addressdetails=1&limit=30`;
            const nomRes = await fetch(nomUrl, {
              headers: { 'User-Agent': 'MediBot/1.0' }
            });
            if (nomRes.ok) {
              const nomData = await nomRes.json();
              data = {
                elements: nomData.map(item => ({
                  id: item.place_id,
                  lat: item.lat,
                  lon: item.lon,
                  tags: {
                    name: item.display_name.split(',')[0],
                    'addr:address': item.display_name,
                    ...item.address
                  }
                }))
              };
            }
          } catch (nomErr) {
            console.error("Nominatim fallback also failed:", nomErr);
          }
        }

        if (!data) throw lastError || new Error("Unable to reach OpenStreetMap servers");

        let mappedLabs = [];
        if (data.elements && data.elements.length > 0) {
          mappedLabs = data.elements
            .filter(element => {
              // Must have a name or operator to be displayed as a "real" lab
              return element.tags && (element.tags.name || element.tags.operator);
            })
            .map((element, i) => {
              const lat = element.lat || (element.center && element.center.lat);
              const lon = element.lon || (element.center && element.center.lon);
              const t = element.tags || {};
              const validName = t.name || t.operator;

              // Construct a meaningful address/location string
              const street = t['addr:street'] || '';
              const city = t['addr:city'] || t['addr:suburb'] || t['addr:district'] || '';
              const postcode = t['addr:postcode'] || '';
              const fullAddr = [street, city, postcode].filter(Boolean).join(', ');

              const district = t['addr:district'] || t['addr:suburb'] || city || "Nearby";

              return {
                id: element.id,
                name: validName,
                lat: lat,
                lon: lon,
                location: district || "Detailed Location",
                address: fullAddr || "Address available on map",
                rating: (3.5 + Math.random() * 1.5).toFixed(1),
                price: Math.floor((300 + Math.random() * 400) / 50) * 50,
                tags: ['Pathology', 'Clinical Test'],
                image: labImages[i % labImages.length],
                openTime: t.opening_hours || "09:00 AM - 06:00 PM",
                phone: t.phone || t['contact:phone'] || "Contact via App"
              };
            });
        }

        if (mappedLabs.length === 0) {
          console.warn("OSM returned 0 named labs.");
          // STRICTLY NO FALLBACK SIMULATION as per user request.
          showToast(`No registered laboratories found within 15km of this location.`, 'error');
          setLabsList([]);
        } else {
          setLabsList(mappedLabs);
        }

      } catch (e) {
        console.error("OSM Fetch Failed:", e);
        showToast("Unable to fetch data from OpenStreetMap.", 'error');
        setLabsList([]); // No fallback
      } finally {
        setLocationLoading(false);
      }
    };

    fetchOsmLabs();
  }, [userCoords]);


  // Update filtered labs when inputs or labsList change
  useEffect(() => {
    filterLabs(activeFilter, searchTerm, userCoords);
  }, [labsList, activeFilter, searchTerm, userCoords]);

  // Fetch Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile(data);

        // Populate editable state
        setPatientDetails({
          username: data.username || '',
          displayName: data.displayName || '',
          age: data.age || '',
          gender: data.gender || '',
          bloodGroup: data.bloodGroup || '',
          contact: data.contact || '',
          savedLocation: data.savedLocation || data.address || ''
        });
        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }

        // Auto-redirect admins who land here (e.g. after Google Login or direct link)
        // Commented out to allow access to Landing Page for testing/viewing
        /*
        if (data.role === 'LAB_ADMIN') {
          // Redirect directly to dashboard; Dashboard handles the secure PIN overlay
          navigate('/lab-admin-dashboard', { replace: true });
        } else if (data.role === 'SUPER_ADMIN') {
          navigate('/super-admin-dashboard', { replace: true });
        }
        */

      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Haversine Distance Formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleLocationSubmit = async () => {
    if (!userLocationInput.trim()) return;
    setLocationLoading(true);
    setLocationError('');

    // Pre-check for Kanjirapally demo to ensure robustness
    const inputLower = userLocationInput.toLowerCase();
    if (inputLower.includes('kanjirapally') || inputLower.includes('kanjirappally') || inputLower.includes('kply')) {
      // Hardcoded approximate coords for Kanjirapally to guarantee demo works
      const coords = { lat: 9.5586, lon: 76.7915 };
      setUserCoords(coords);
      sessionStorage.setItem('user_location_coords', JSON.stringify({ ...coords, name: userLocationInput }));
      setShowLocationModal(false);
      setLocationLoading(false);
      return;
    }

    try {
      // Use OpenStreetMap Nominatim API
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userLocationInput)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
        setUserCoords(coords);
        sessionStorage.setItem('user_location_coords', JSON.stringify({ ...coords, name: userLocationInput }));
        setShowLocationModal(false);
      } else {
        setLocationError('Location not found within OpenStreetMap. Please try a major city or area.');
      }
    } catch (e) {
      setLocationError('Error fetching location. Please check your internet connection.');
    } finally {
      setLocationLoading(false);
    }
  };


  // Handle Main Search Bar Enter Key
  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter') {
      // Always scroll to results first so user feels "action"
      scrollToLabs();

      if (!searchTerm.trim()) return;

      const query = searchTerm.trim();

      // Show loading equivalent or toast
      showToast(`Searching for "${query}"...`, 'info');

      try {
        // Attempt to treat as location first
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
          // It IS a valid location
          const { lat, lon, display_name } = data[0];
          const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };

          // Extract a shorter name for display if possible (first part of comma separated)
          const shortName = display_name.split(',')[0];

          // Update Location Context
          setUserCoords(coords);
          setUserLocationInput(shortName || query);
          sessionStorage.setItem('user_location_coords', JSON.stringify({ ...coords, name: shortName || query }));

          // CRITICAL: Clear the search term so we don't filter the new labs by this string
          // We want to see ALL labs in this new location.
          setSearchTerm('');

          showToast(`Location updated to ${shortName || query}. Loading labs...`, 'success');
        } else {
          // Not a location, so it stays as a keyword filter (handled by useEffect/filterLabs)
          console.log("Not a location match. Using as keyword filter.");
          showToast(`Filtering labs by "${query}"`, 'info');
        }
      } catch (err) {
        console.error("Search error (likely network), using as keyword filter", err);
        // Fallback to keyword filter (do nothing, let state persist)
      }
    }
  };

  // Fetch Reports
  const fetchReports = async () => {
    try {
      const data = await getUserReports();
      setReports(data);
      setShowReportsModal(true);
    } catch (e) {
      alert("Failed to load reports or no reports found.");
    }
  };

  // Derive Display Name
  const displayName = userProfile?.displayName || (userProfile?.email ? userProfile.email.split('@')[0] : 'Guest');

  // Core Filter Logic
  // Core Filter Logic - Refactored to use fetched labsList
  const filterLabs = (filter, search, coords) => {
    let processingLabs = [...labsList];

    // Calculate Distances
    if (coords) {
      processingLabs = processingLabs.map(lab => {
        const dist = calculateDistance(coords.lat, coords.lon, lab.lat, lab.lon);
        return { ...lab, distanceVal: dist, distance: `${dist.toFixed(1)} km` };
      });
    }

    // Apply Search
    if (search) {
      const term = search.toLowerCase();
      processingLabs = processingLabs.filter(lab =>
        lab.name.toLowerCase().includes(term) ||
        lab.location.toLowerCase().includes(term) ||
        (lab.tags && lab.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    // Apply Categories
    if (filter === 'Nearby') {
      processingLabs.sort((a, b) => a.distanceVal - b.distanceVal);
    } else if (filter === 'Top Rated') {
      processingLabs = processingLabs.filter(lab => lab.rating >= 4.5);
    } else if (filter === 'Low Cost') {
      processingLabs = processingLabs.filter(lab => lab.price < 500);
    } else if (filter === 'All Labs') {
      // Default sort
      processingLabs.sort((a, b) => (a.distanceVal || 0) - (b.distanceVal || 0));
    }

    setFilteredLabs(processingLabs);
    setVisibleLimit(20); // Reset limit on filter change
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  // Search Logic
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };



  // Scroll to Labs
  const scrollToLabs = () => {
    labsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Upload Prescription Action
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Prescription "${file.name}" uploaded successfully! Our team will analyze it and contact you.`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      sessionStorage.removeItem('user_location_coords');
      sessionStorage.removeItem('auth_role');
      navigate('/login');
    }
  };

  const handleLoadMore = () => {
    setVisibleLimit(prev => prev + 4);
  };

  return (
    <div className="landing-container">
      {/* Hidden File Input for Upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*,.pdf"
        onChange={handleFileChange}
      />

      {/* Location Modal */}
      {/* Location Modal (Professional) */}
      {showLocationModal && (
        <div className="location-modal-overlay">
          <div className="location-modal-content">
            <div className="location-icon-wrapper">
              <IconMapPin />
            </div>

            <h3>Where are you located?</h3>
            <p>
              To find the best laboratories and diagnostic centers near you, please enter your city or area.
            </p>

            <div className="location-input-group">
              <IconSearch className="location-input-icon" size={20} />
              <input
                type="text"
                placeholder="E.g. Kanjirapally, Kochi, Bangalore"
                value={userLocationInput}
                onChange={(e) => setUserLocationInput(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSubmit()}
              />
            </div>

            {locationError && <p className="msg-error">{locationError}</p>}

            <button
              className="location-submit-btn"
              onClick={handleLocationSubmit}
              disabled={locationLoading}
            >
              {locationLoading ? 'Searching...' : 'Find Laboratories'}
            </button>
          </div>
        </div>
      )}

      {/* Booking Page (Professional) */}
      {showBookingModal && selectedLab && (
        <div className="page-container">
          <div className="page-content-wrapper">
            {/* Header Removed as requested */}
            <div className="page-header" style={{ borderBottom: 'none', padding: '0 0 1rem 0' }}>
              {/* Empty header or minimal spacer if needed, or fully removed content */}
            </div>

            <div className="fs-split-layout">
              {/* Sidebar Card - Enhanced */}
              <div className="fs-sidebar-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)' }}>
                <div className="sidebar-avatar" style={{ backgroundImage: `url(${selectedLab.image})`, width: '100px', height: '100px', border: '4px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  {!selectedLab.image && <IconMapPin size={40} />}
                </div>

                <div className="sidebar-info">
                  <h3 style={{ fontSize: '1.4rem', color: '#1e293b' }}>{selectedLab.name}</h3>

                  <div className="sidebar-rating" style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
                    <span style={{ color: '#d97706', fontWeight: 800 }}>{selectedLab.rating}</span>
                    <IconStar fill="#f59e0b" color="#f59e0b" size={16} />
                  </div>

                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.5rem', color: '#64748b' }}>
                    <IconMapPin size={14} /> {selectedLab.location}
                  </p>

                  <div className="sidebar-price-row" style={{ marginTop: '2rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Consultation Fee</p>
                    <p style={{ margin: 0, fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, textShadow: '0 2px 4px rgba(14, 165, 233, 0.1)' }}>₹{selectedLab.price}</p>
                  </div>
                </div>
              </div>

              {/* Main Form - Enhanced */}
              <div className="fs-main-card" style={{ padding: '2.5rem', borderRadius: '24px', boxShadow: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h3 className="fs-section-title" style={{ marginBottom: '0.5rem', fontSize: '1.5rem', color: '#0f172a' }}>Patient Details</h3>
                    <p className="fs-section-subtitle" style={{ fontSize: '0.95rem', color: '#64748b' }}>Fill in the details to schedule your appointment.</p>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><IconX size={20} /></button>
                </div>

                <div className="fs-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Category & Selection Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                    {/* Test Category */}
                    <div>
                      <label className="fs-label" style={{ marginBottom: '0.75rem' }}><IconDroplet size={16} style={{ marginBottom: -3, marginRight: 8, color: 'var(--primary)' }} /> Test Category</label>
                      <div className="select-wrapper">
                        <select
                          className="fs-input"
                          value={activeTestCategory}
                          onChange={(e) => setActiveTestCategory(e.target.value)}
                          style={{ marginBottom: 0, height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                        >
                          {Object.keys(TEST_CATEGORIES).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Test Selection */}
                    <div>
                      <label className="fs-label" style={{ marginBottom: '0.75rem' }}><IconActivity size={16} style={{ marginBottom: -3, marginRight: 8, color: 'var(--primary)' }} /> Select Test</label>
                      <select
                        className="fs-input"
                        onChange={(e) => {
                          if (e.target.value) toggleTestSelection(e.target.value);
                          e.target.value = "";
                        }}
                        style={{ marginBottom: 0, height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                      >
                        <option value="">-- Choose a test --</option>
                        {TEST_CATEGORIES[activeTestCategory].map(test => (
                          <option key={test} value={test} disabled={selectedTests.includes(test)}>
                            {test} {selectedTests.includes(test) ? '(Selected)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Selected Tests Tags - Full Width */}
                  <div style={{ minHeight: '40px', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    {selectedTests.length === 0 && <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>No tests selected yet.</span>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {selectedTests.map(test => (
                        <div key={test} className="selected-test-chip" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', padding: '0.5rem 1rem' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{test}</span>
                          <button onClick={() => toggleTestSelection(test)} style={{ background: '#fee2e2', color: '#ef4444', borderRadius: '50%', padding: 2, display: 'flex' }}>
                            <IconX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label className="fs-label" style={{ marginBottom: '0.75rem' }}><IconCalendar size={16} style={{ marginBottom: -3, marginRight: 8, color: 'var(--primary)' }} /> Preferred Date</label>
                      <input className="fs-input" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} style={{ marginBottom: 0, height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    </div>
                    <div>
                      <label className="fs-label" style={{ marginBottom: '0.75rem' }}><IconClock size={16} style={{ marginBottom: -3, marginRight: 8, color: 'var(--primary)' }} /> Preferred Time</label>
                      <input className="fs-input" type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} style={{ marginBottom: 0, height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="booking-footer" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p className="total-est-label" style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Estimated Cost</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', color: '#cbd5e1', textDecoration: 'line-through' }}>₹{selectedLab.price + (selectedTests.length * 200) + 100}</span>
                        <p className="total-est-amount" style={{ fontSize: '2rem', color: '#0f172a' }}>₹{selectedLab.price + (selectedTests.length * 150)}</p>
                      </div>
                    </div>
                    <button className="confirm-booking-btn" onClick={handleProceedToPayment} style={{ borderRadius: '12px', padding: '1rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)' }}>
                      Proceed to Payment &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Details Modal (New Tab-Based) */}
      {showLabDetailsModal && selectedLab && (
        <div className="modal-overlay" onClick={() => setShowLabDetailsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', height: '80vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: 'var(--text-main)' }}>{selectedLab.name}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span className="rating-badge" style={{ fontSize: '0.9rem' }}>{selectedLab.rating} <IconStar size={14} fill="currentColor" /></span>
                  <span style={{ color: 'var(--text-body)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconMapPin size={14} /> {selectedLab.location}
                  </span>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowLabDetailsModal(false)}><IconX /></button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 1.5rem' }}>
              {['Overview', 'Tests & Pricing', 'Reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveLabTab(tab)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeLabTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                    color: activeLabTab === tab ? 'var(--primary)' : 'var(--text-body)',
                    fontWeight: activeLabTab === tab ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {activeLabTab === 'Overview' && (
                <div style={{ ani: 'fadeIn 0.3s' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>About Laboratory</h4>
                  <p style={{ lineHeight: 1.6, color: '#475569', marginBottom: '1.5rem' }}>
                    {selectedLab.name} is a state-of-the-art diagnostic center providing comprehensive services.
                    Known for accurate reports and quick turnaround time. Verified by MediBot for quality assurance.
                  </p>

                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Available Amenities</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {['Home Collection', 'Digital Reports', '24/7 Support', 'Wheelchair Access'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                        <IconCheckCircle size={16} style={{ color: 'var(--secondary)' }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLabTab === 'Tests & Pricing' && (
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Available Tests</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedLab.tags.map((test, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <div>
                          <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)' }}>{test}</span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Report in 24 hrs</span>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                          ₹{selectedLab.price + (idx * 150)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLabTab === 'Reviews' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '12px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97706' }}>{selectedLab.rating}</div>
                    <div>
                      <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.25rem' }}>
                        {[...Array(5)].map((_, i) => <IconStar key={i} fill={i < Math.floor(selectedLab.rating) ? "currentColor" : "none"} size={18} />)}
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#92400e' }}>Based on 124 Verified Reviews</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[1, 2].map(r => (
                      <div key={r} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600 }}>Ramesh K.</span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>2 days ago</span>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>Excellent service. The phlebotomist was very professional and hygienic.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Consultation Fee</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{selectedLab.price}</span>
              </div>
              <button
                className="location-submit-btn"
                style={{ width: 'auto', padding: '0.8rem 2rem' }}
                onClick={() => handleBookNow(selectedLab)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Navbar */}
      <nav className={`glass-navbar ${isScrolled || isAnyModalOpen ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo-section" onClick={handleHomeClick}>
            <div className="logo-icon-wrapper" style={{ background: 'transparent', width: 'auto', height: 'auto', padding: 0 }}>
              <img src={logoImage} alt="MediBot Logo" style={{ width: 40, height: 'auto' }} />
            </div>
            <span className="brand-logo" style={{ color: '#2563eb', fontWeight: '800' }}>MediBot</span>
          </div>

          <div className="search-bar-nav" style={{ display: 'none' }}></div>

          <div className="nav-links">
            <button className="nav-item-btn" onClick={handleHomeClick}>
              <IconHome />
              <span>Home</span>
            </button>
            {/* Notifications & Reminders - Only visible if location entered */}
            {/* Notifications & Reminders - Always visible */}


            <button
              className="nav-item-btn"
              onClick={() => { setShowNotifications(true); setShowReminders(false); setShowMyBookingsModal(false); setShowReportsModal(false); setShowProfileModal(false); }}
            >
              <IconBell />
              <span>Notifications {notifications.filter(n => !n.isRead).length > 0 && `(${notifications.filter(n => !n.isRead).length})`}</span>
            </button>


            <button className="nav-item-btn" onClick={() => setShowMyBookingsModal(true)}>
              <IconCalendar />
              <span>Bookings {bookings.length > 0 && `(${bookings.length})`}</span>
            </button>
            <button className="nav-item-btn" onClick={fetchReports}>
              <IconFileText />
              <span>Reports</span>
            </button>

            <button
              className="profile-btn-group"
              onClick={() => setShowProfileModal(true)}
              title="View Profile"
            >
              <span className="profile-name" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userProfile?.username ? `@${userProfile.username}` : displayName}
              </span>
              <div className="avatar-circle" style={{
                backgroundImage: profilePic ? `url(${profilePic})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {!profilePic && <IconUser />}
              </div>
            </button>
          </div>
        </div >
      </nav >

      {/* Reports Modal */}

      {/* Full Screen Reports Section */}
      {/* Full Screen Reports Section */}
      {/* Reports Modal (Redesigned) */}
      {/* Reports Page */}
      {/* Reports Page */}
      {
        showReportsModal && (
          <div className="page-container">
            <div className="page-content-wrapper">
              <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.03em' }}>Medical Reports</h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '1.05rem' }}>Access and manage your digital health records securely.</p>
              </div>

              <div className="form-card" style={{ maxWidth: '900px', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                {/* Toggle Buttons */}
                <div className="report-tabs-container" style={{
                  background: 'white',
                  padding: '0.5rem',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  gap: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                  marginBottom: '2rem',
                  border: '1px solid #e2e8f0'
                }}>
                  {['Uploaded', 'Generated'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveReportTab(tab)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: activeReportTab === tab ? 'var(--primary)' : 'transparent',
                        color: activeReportTab === tab ? 'white' : '#64748b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        fontSize: '0.95rem'
                      }}
                    >
                      {tab === 'Uploaded' ? <IconUploadCloud size={18} /> : <IconFileText size={18} />}
                      {tab === 'Uploaded' ? 'Prescriptions' : 'Lab Results'}
                    </button>
                  ))}
                </div>

                <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                  {/* Uploaded Reports */}
                  {activeReportTab === 'Uploaded' && (
                    <>
                      {reports.length > 0 ? (
                        reports.map((report) => (
                          <div key={report.id} className="report-card" style={{
                            background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-8px)';
                              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(37, 99, 235, 0.15)';
                              e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.05)';
                              e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                          >
                            <div style={{
                              position: 'absolute',
                              top: '-20px',
                              right: '-20px',
                              width: '80px',
                              height: '80px',
                              background: 'rgba(37, 99, 235, 0.05)',
                              borderRadius: '50%',
                              zIndex: 0
                            }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                  padding: '1rem',
                                  borderRadius: '16px',
                                  color: '#2563eb',
                                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
                                }}>
                                  <IconUploadCloud size={24} />
                                </div>
                                <span style={{
                                  background: report.status === 'Verified' ? '#dcfce7' : '#fef9c3',
                                  color: report.status === 'Verified' ? '#166534' : '#854d0e',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  padding: '0.4rem 1rem',
                                  borderRadius: '100px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                  {report.status || 'Processing'}
                                </span>
                              </div>

                              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#1e293b', fontWeight: 700 }}>Prescription #{report.id}</h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                <IconCalendar size={14} />
                                <span>{new Date(report.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                              </div>

                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href={report.file_path} target="_blank" rel="noopener noreferrer" style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  padding: '0.8rem',
                                  borderRadius: '14px',
                                  background: '#f1f5f9',
                                  color: '#475569',
                                  fontWeight: 700,
                                  fontSize: '0.95rem',
                                  textDecoration: 'none',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <IconEye size={18} /> View
                                </a>
                                <button
                                  onClick={() => downloadFile(report.file_path, `Prescription_${report.id}.pdf`)}
                                  style={{
                                    flex: 1.5,
                                    padding: '0.8rem',
                                    borderRadius: '14px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                                  }}
                                >
                                  <IconDownload size={18} /> Download
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                          <div style={{ background: 'white', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                            <IconUploadCloud size={48} color="#94a3b8" />
                          </div>
                          <h3 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 700 }}>No Prescriptions</h3>
                          <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>Upload your medical prescriptions to keep them organized and accessible anytime.</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Generated Reports */}
                  {activeReportTab === 'Generated' && (
                    <>
                      {reports.filter(r => r.status === 'Completed').length > 0 ? (
                        reports.filter(r => r.status === 'Completed').map((report) => (
                          <div key={`gen-${report.id}`} className="report-card" style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid #dcfce7',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(22, 163, 74, 0.05)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-8px)';
                              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(22, 163, 74, 0.15)';
                              e.currentTarget.style.borderColor = '#16a34a';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(22, 163, 74, 0.05)';
                              e.currentTarget.style.borderColor = '#dcfce7';
                            }}
                          >
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'linear-gradient(to bottom, #10b981, #059669)' }}></div>

                            <div style={{ marginBottom: '2rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                  background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                  padding: '1rem',
                                  borderRadius: '16px',
                                  color: '#16a34a',
                                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.1)'
                                }}>
                                  <IconActivity size={24} />
                                </div>
                                <div style={{
                                  background: '#16a34a',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: 900,
                                  padding: '0.5rem 1rem',
                                  borderRadius: '100px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.1em',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)'
                                }}>
                                  <IconCheckCircle size={14} /> VERIFIED
                                </div>
                              </div>
                              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#064e3b', fontWeight: 800 }}>Clinical Lab Report #{report.id}</h4>
                              <p style={{ margin: 0, color: '#059669', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, opacity: 0.8 }}>
                                <IconCalendar size={14} /> Issued on {new Date(report.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}
                              </p>
                            </div>

                            <button
                              onClick={() => downloadFile(report.file_path, `Lab_Result_${report.id}.pdf`)}
                              style={{
                                width: '100%',
                                padding: '1.2rem',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                            >
                              <IconDownload size={20} /> Download Final Report
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: '#f0fdf4', borderRadius: '32px', border: '2px dashed #bbf7d0' }}>
                          <div style={{ background: 'white', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.05)' }}>
                            <IconActivity size={48} color="#86efac" />
                          </div>
                          <h3 style={{ color: '#064e3b', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 700 }}>No Lab Results Yet</h3>
                          <p style={{ color: '#059669', maxWidth: '400px', margin: '0 auto' }}>Once your clinical samples are processed, your verified digital reports will appear here automatically.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }




      {/* Full Screen Profile Section */}
      {/* Full Screen Profile Section */}
      {/* Profile Page */}
      {
        showProfileModal && (
          <div className="page-container">
            <div className="page-content-wrapper">
              <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h2>My Profile</h2>
                </div>
              </div>

              <div className="fs-split-layout">
                {/* Sidebar: Avatar & Actions */}
                <div className="fs-sidebar-card">
                  <input
                    type="file"
                    ref={profilePicInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                  />
                  <div
                    className="sidebar-avatar"
                    onClick={() => profilePicInputRef.current.click()}
                    style={{
                      backgroundImage: profilePic ? `url(${profilePic})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    title="Click to upload profile picture"
                  >
                    {!profilePic && <IconUser />}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: 'var(--primary)',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconUploadCloud size={12} color="white" />
                    </div>
                  </div>

                  <div className="sidebar-info">
                    <h3>{displayName}</h3>
                    {userProfile?.username && <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>@{userProfile.username}</p>}
                    <p>{userProfile?.email || 'No Email'}</p>
                  </div>

                  <button className="book-btn" style={{ marginTop: '2rem', width: '100%', borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }} onClick={handleLogout}>
                    Logout
                  </button>
                </div>

                {/* Main Content: Details Form */}
                <div className="fs-main-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-main)' }}>Personal Information</h3>
                    {!isEditingProfile && (
                      <button className="book-btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsEditingProfile(true)}>
                        <IconUser size={16} /> Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="fs-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div>
                      <label className="fs-label" style={{ color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Username</label>
                      {isEditingProfile ? (
                        <input
                          className="fs-input"
                          value={patientDetails.username !== undefined ? patientDetails.username : (userProfile?.username || '')}
                          onChange={e => setPatientDetails({ ...patientDetails, username: e.target.value })}
                          placeholder="Enter username"
                        />
                      ) : (
                        <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{userProfile?.username ? `@${userProfile.username}` : '--'}</div>
                      )}
                    </div>


                    <div>
                      <label className="fs-label">Email Address</label>
                      <div style={{ fontSize: '1.1rem', fontWeight: 500, padding: '0.9rem 0' }}>{userProfile?.email || 'No Email'}</div>
                    </div>

                    <div>
                      <label className="fs-label" style={{ color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Age</label>
                      {isEditingProfile ? (
                        <input className="fs-input" type="number" placeholder="Eg. 28" value={patientDetails.age} onChange={e => setPatientDetails({ ...patientDetails, age: e.target.value })} />
                      ) : (
                        <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{patientDetails.age || '--'}</div>
                      )}
                    </div>

                    <div>
                      <label className="fs-label" style={{ color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Gender</label>
                      {isEditingProfile ? (
                        <select className="fs-input" value={patientDetails.gender} onChange={e => setPatientDetails({ ...patientDetails, gender: e.target.value })}>
                          <option value="">Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      ) : (
                        <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{patientDetails.gender || '--'}</div>
                      )}
                    </div>

                    <div>
                      <label className="fs-label" style={{ color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Blood Group</label>
                      {isEditingProfile ? (
                        <select className="fs-input" value={patientDetails.bloodGroup} onChange={e => setPatientDetails({ ...patientDetails, bloodGroup: e.target.value })}>
                          <option>Select</option>
                          <option>A+</option>
                          <option>O+</option>
                          <option>B+</option>
                          <option>AB+</option>
                          <option>A-</option>
                          <option>O-</option>
                          <option>B-</option>
                          <option>AB-</option>
                        </select>
                      ) : (
                        <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{patientDetails.bloodGroup || '--'}</div>
                      )}
                    </div>

                    <div>
                      <label className="fs-label" style={{ color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Contact Number</label>
                      {isEditingProfile ? (
                        <input className="fs-input" type="tel" placeholder="+91 9876543210" value={patientDetails.contact} onChange={e => setPatientDetails({ ...patientDetails, contact: e.target.value })} />
                      ) : (
                        <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{patientDetails.contact || '--'}</div>
                      )}
                    </div>

                    <div style={{ gridColumn: '1/-1' }}>
                      <label className="fs-label" style={{ color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Home Address</label>
                      {isEditingProfile ? (
                        <textarea className="fs-input" rows="3" placeholder="Enter full address for home collection..." value={patientDetails.savedLocation} onChange={e => setPatientDetails({ ...patientDetails, savedLocation: e.target.value })}></textarea>
                      ) : (
                        <div style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>{patientDetails.savedLocation || '--'}</div>
                      )}
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div style={{ marginTop: '2rem', textAlign: 'right', borderTop: '1px solid #f1f5f9', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                      <button className="book-btn" style={{ borderColor: '#cbd5e1', color: '#64748b' }} onClick={() => setIsEditingProfile(false)}>Cancel</button>
                      <button className="location-submit-btn" style={{ width: 'auto', padding: '0.8rem 2rem' }} onClick={async () => {
                        try {
                          await updateUserProfile({
                            username: patientDetails.username,
                            displayName: patientDetails.displayName,
                            age: patientDetails.age,
                            gender: patientDetails.gender,
                            bloodGroup: patientDetails.bloodGroup,
                            contact: patientDetails.contact,
                            savedLocation: patientDetails.savedLocation,
                            profilePic: profilePic
                          });
                          alert('Profile Updated Successfully!');
                          setIsEditingProfile(false);
                          const data = await getUserProfile();
                          setUserProfile(data);
                        } catch (e) {
                          alert('Failed to save profile.');
                          console.error(e);
                        }
                      }}>
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Notifications Page */}
      {
        showNotifications && (
          <div className="page-container">
            <div className="page-content-wrapper">
              <div className="page-header" style={{ justifyContent: 'space-between', borderBottom: '2px solid var(--primary)', paddingBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconBell size={28} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '2rem' }}>Notifications</h2>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Stay updated with your appointments and reports</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="badge-count" style={{
                      background: 'var(--primary)',
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem'
                    }}>
                      {notifications.filter(n => !n.isRead).length} New
                    </span>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#ef4444',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#fecaca'}
                      onMouseOut={(e) => e.target.style.background = '#fee2e2'}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="form-card" style={{ maxWidth: '900px', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="list-item-card" style={{
                      borderLeft: n.isRead ? '4px solid #cbd5e1' : '4px solid var(--primary)',
                      background: n.isRead ? 'white' : 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
                      marginBottom: '1rem',
                      transition: 'all 0.3s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      padding: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Decorative corner element for unread */}
                      {!n.isRead && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '60px',
                          height: '60px',
                          background: 'linear-gradient(135deg, var(--primary) 0%, transparent 100%)',
                          opacity: 0.1,
                          borderRadius: '0 0 0 100%'
                        }} />
                      )}

                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flex: 1, zIndex: 1 }}>
                        <div style={{
                          background: n.isRead ? '#f1f5f9' : 'var(--primary-soft)',
                          padding: '1rem',
                          borderRadius: '12px',
                          transition: 'all 0.3s',
                          boxShadow: n.isRead ? 'none' : '0 4px 6px -1px rgba(14, 165, 233, 0.2)'
                        }}>
                          <IconCheckCircle size={24} color={n.isRead ? '#94a3b8' : 'var(--primary)'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            margin: '0 0 0.75rem 0',
                            fontWeight: n.isRead ? 500 : 700,
                            fontSize: '1.1rem',
                            color: n.isRead ? '#64748b' : '#1e293b',
                            lineHeight: 1.6
                          }}>
                            {n.message}
                          </p>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#94a3b8',
                            fontSize: '0.9rem'
                          }}>
                            <IconClock size={14} />
                            <span>{n.date}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', zIndex: 1 }}>
                        {!n.isRead && (
                          <button
                            onClick={() => markNotificationRead(n.id)}
                            title="Mark as Read"
                            style={{
                              border: '1px solid #dcfce7',
                              background: '#f0fdf4',
                              color: '#166534',
                              padding: '0.6rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#dcfce7';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#f0fdf4';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <IconCheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(n.id)}
                          title="Clear"
                          style={{
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            color: '#ef4444',
                            padding: '0.6rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#fee2e2';
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#fef2f2';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          <IconX size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '6rem 2rem',
                    background: 'white',
                    borderRadius: '24px',
                    border: '2px dashed #e2e8f0'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 2rem auto',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                      <IconBell size={48} color="#94a3b8" />
                    </div>
                    <h3 style={{ color: '#1e293b', marginBottom: '0.5rem', fontSize: '1.5rem' }}>No Notifications Yet</h3>
                    <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>You're all caught up! New notifications will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Reminders Page */}
      {
        showReminders && (
          <div className="page-container">
            <div className="page-content-wrapper">
              <div className="page-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h2>Reminders</h2>
                  <span className="badge-count" style={{ background: 'var(--accent)' }}>{reminders.length} Pending</span>
                </div>
                {reminders.length > 0 && (
                  <button onClick={clearAllReminders} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                    Clear All
                  </button>
                )}
              </div>

              <div className="form-card" style={{ maxWidth: '800px', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                {reminders.length > 0 ? (
                  reminders.map(r => (
                    <div key={r.id} className="list-item-card" style={{
                      borderLeft: '4px solid var(--accent)',
                      background: 'white',
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        <div style={{ background: '#fffbeb', padding: '0.75rem', borderRadius: '50%' }}>
                          <IconClock size={20} color="var(--accent)" />
                        </div>
                        <div>
                          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)' }}>{r.text}</p>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.time}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => clearReminder(r.id)}
                        title="Dismiss"
                        style={{
                          border: '1px solid #fee2e2',
                          background: '#fef2f2',
                          color: '#ef4444',
                          padding: '0.5rem',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <IconX size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                    <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <IconClock size={24} color="#94a3b8" />
                    </div>
                    <p>No upcoming reminders</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* My Bookings Page */}
      {
        showMyBookingsModal && (
          <div className="page-container">
            <div className="page-content-wrapper">
              <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h2>My Bookings</h2>
                </div>
              </div>

              <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {bookings.length > 0 ? (
                  bookings.map(b => (
                    <div key={b.id} className="list-item-card" style={{ display: 'block', padding: '1.5rem', borderTop: '4px solid var(--secondary)', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>{b.labName}</h3>
                          <span style={{
                            background: b.status === 'Cancelled' ? '#fee2e2' : '#dcfce7',
                            color: b.status === 'Cancelled' ? '#991b1b' : '#166534',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '0.25rem'
                          }}>
                            {b.status}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteBooking(b.id); }}
                          title="Remove from history"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#cbd5e1',
                            cursor: 'pointer',
                            padding: '0.25rem'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                        <div>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Date</span>
                          <strong style={{ color: 'var(--text-body)' }}>{b.date}</strong>
                        </div>
                        <div>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Time</span>
                          <strong style={{ color: 'var(--text-body)' }}>{b.time}</strong>
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Tests</span>
                          <strong style={{ color: 'var(--text-body)' }}>
                            {Array.isArray(b.tests) ? b.tests.join(', ') : (b.tests || 'No tests specified')}
                          </strong>
                        </div>
                        <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-body)' }}>
                          <IconMapPin size={14} />
                          {b.location}
                        </div>

                        {/* Cancel Button */}
                        {b.status !== 'Cancelled' && (
                          <div style={{ gridColumn: '1/-1', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              style={{
                                width: '100%',
                                padding: '0.6rem',
                                borderRadius: '8px',
                                border: '1px solid #fee2e2',
                                background: '#fff1f2',
                                color: '#e11d48',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => e.target.style.background = '#ffe4e6'}
                              onMouseOut={(e) => e.target.style.background = '#fff1f2'}
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', gridColumn: '1/-1' }}>
                    <IconCalendar size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <p>No confirmed bookings yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* 2. Hero Section - Split Layout */}
      <section className="hero-section-split">
        <div className="hero-left">
          <div className="hero-content-left">
            <h1>Find Best Laboratories<br />Near You</h1>
            <p>Don't wait in lines. Book your tests now and get results faster than ever.</p>

            <div className="hero-search-container">
              <div className="hero-search-input-wrapper">
                <IconSearch className="hero-search-icon" size={22} />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search for labs, tests, or location..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(e);
                    }
                  }}
                />
              </div>
              <button
                className="hero-search-btn"
                onClick={() => handleSearchSubmit({ key: 'Enter' })}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <img src={labHeroSplit} alt="Modern Laboratory" className="hero-lab-image" />
        </div>
      </section>

      {/* 3. Filters & Labs List */}
      <main className="main-content" ref={labsSectionRef}>
        <div className="section-header-card">
          <h2>Featured Laboratories</h2>
          <div className="header-actions">
            {/* Search Bar Moved to Hero */}

            <div className="filter-chips">
              {['All Labs', 'Nearby', 'Top Rated'].map(filter => (
                <button
                  key={filter}
                  className={`chip ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => handleFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>


        <div className="labs-grid">
          {filteredLabs.length > 0 ? (
            filteredLabs.slice(0, visibleLimit).map((lab) => (
              <div className="lab-card" key={lab.id} onClick={() => handleViewDetails(lab)} style={{ cursor: 'pointer' }}>
                <div className="lab-image-placeholder" style={{
                  backgroundImage: `url(${lab.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {/* Empty div for cover image, overlay handled by CSS */}
                </div>
                <div className="lab-details">
                  <div className="lab-header">
                    <h3>{lab.name}</h3>
                    <span className="rating-badge">{lab.rating} <IconStar size={12} fill="currentColor" /></span>
                  </div>
                  <p className="lab-location"><IconMapPin /> {lab.distance} • {lab.location}</p>
                  <div className="tags">
                    {lab.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                  </div>
                  <div className="price-row">
                    <span className="price">Starts ₹{lab.price}</span>
                    <button className="book-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={(e) => { e.stopPropagation(); handleBookNow(lab); }}>Book Now</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', gridColumn: '1/-1', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {!userCoords && (!searchTerm || searchTerm.length < 3) ? (
                <>
                  <IconMapPin size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>Please enter your location to view available laboratories.</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>We need your location to find the best diagnostic centers near you.</p>
                </>
              ) : (
                <div>
                  <IconSearch size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>
                    {userCoords ? `No laboratories found matching "${searchTerm}" near ${userLocationInput || 'your location'}.` : `No laboratories found for "${searchTerm}".`}
                  </p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try checking your spelling or search for a specific location (e.g. "Kochi").</p>
                </div>
              )}
            </div>
          )}
        </div>

        {
          filteredLabs.length > visibleLimit && (
            <div className="load-more-container" style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="book-btn" style={{ background: 'white', color: '#0f172a', border: '1px solid #cbd5e1' }} onClick={handleLoadMore}>
                Load More Laboratories
              </button>
            </div>
          )
        }
      </main >

      {/* 6. Why Choose MediBot Section */}
      < section className="why-choose-section" >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">Why Choose MediBot?</h2>
          <p className="section-subtitle">We ensure the best healthcare experience with speed, accuracy, and trust.</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-box"><IconCheckCircle size={32} /></div>
              <h3>Verified Labs</h3>
              <p>100% verified NABL certified laboratories.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><IconFileText size={32} /></div>
              <h3>Digital Reports</h3>
              <p>Access your reports instantly on your phone.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box"><IconClock size={32} /></div>
              <h3>Home Collection</h3>
              <p>Sample collection from the comfort of your home.</p>
            </div>
            <div className="feature-card">
              <div className="icon-box" style={{ color: '#25D366' }}><IconBell size={32} /></div>
              <h3>Updates on WhatsApp</h3>
              <p>Get real-time updates and reports on WhatsApp.</p>
            </div>
          </div>
        </div>
      </section >



      {/* 8. Verified Reviews Section */}
      < section className="reviews-section" >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Patient Stories</h2>
          <div className="reviews-slider">
            {[1, 2, 3].map(i => (
              <div key={i} className="review-card">
                <div className="review-stars" style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map(s => <IconStar key={s} fill="currentColor" size={16} />)}
                </div>
                <p className="review-text">"MediBot made it so easy to book my tests. The home collection was on time and the reports were delivered directly to my WhatsApp!"</p>
                <div className="review-author">
                  <div className="avatar-small">S</div>
                  <div>
                    <strong>Sneha P.</strong>
                    <span>Verified Patient</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >


      {/* Contact Section Removed in favor of CTA and Footer specifics */}


      {/* 5. Footer */}
      {/* 10. Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-logo">MediBot</span>
            <p>Smart healthcare for modern lives.</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              {/* Social Placeholders */}
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
              <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Company</h4>
            <a href="#">About MediBot</a>
            <a href="#">Partner Labs</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>

          <div className="footer-links-group">
            <h4>Services</h4>
            <a href="#">Book Tests</a>
            <a href="#">Health Checkups</a>
            <a href="#">Home Collection</a>
            <a href="#">Corporate Health</a>
          </div>

          <div className="footer-links-group">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Report Issue</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 MediBot Healthcare Inc. All rights reserved.</p>
        </div>
      </footer>
      {
        showPaymentModal && selectedLab && (
          <div className="payment-modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.65)', // Slightly darker for better focus
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}>
            {paymentStep === 'success' ? (
              // --- STANDALONE SUCCESS MODAL ---
              // --- STANDALONE SUCCESS MODAL ---
              <div className="payment-success-modal" style={{
                background: 'white',
                width: '400px',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'left',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative'
              }}>
                <style>{`
                    @keyframes popIn {
                      0% { opacity: 0; transform: scale(0.8); }
                      100% { opacity: 1; transform: scale(1); }
                    }
                    @keyframes slideUpFade {
                      0% { opacity: 0; transform: translateY(10px); }
                      100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes checkScale {
                      0% { transform: scale(0); }
                      80% { transform: scale(1.2); }
                      100% { transform: scale(1); }
                    }
                 `}</style>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: 70, height: 70, background: '#dcfce7', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <IconCheckCircle size={40} color="#16a34a" />
                  </div>
                  <h2 style={{ fontSize: '1.6rem', color: '#16a34a', margin: '0', fontWeight: 700 }}>Payment Successful</h2>
                </div>

                <div className="success-steps" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
                  {[
                    { text: "Payment Processed", delay: 0 },
                    { text: "Booking Slot Confirmed", delay: 1000 },
                    { text: "Lab Notified", delay: 2000 },
                    { text: "Receipt Generated", delay: 3000 }
                  ].map((step, index) => (
                    <div key={index} style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      opacity: 0, animation: `slideUpFade 0.5s ease-out forwards ${step.delay}ms`
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', background: '#16a34a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: `checkScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${step.delay + 200}ms`,
                        transform: 'scale(0)'
                      }}>
                        <IconCheckCircle size={14} color="white" />
                      </div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#334155' }}>{step.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ opacity: 0, animation: 'slideUpFade 0.5s ease-out forwards 3500ms' }}>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setShowFeedbackModal(true);
                    }}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: '12px', background: '#0f172a', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Close & Finish
                  </button>
                </div>
              </div>
            ) : (
              // --- SPLIT LAYOUT FOR SELECTION & PROCESSING ---
              <div className="payment-modal-container" style={{
                display: 'flex',
                width: paymentStep === 'processing' ? '450px' : '900px',
                height: paymentStep === 'processing' ? 'auto' : '580px',
                minHeight: paymentStep === 'processing' ? '400px' : '580px',
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.3s ease-in-out'
              }}>
                {/* Left Half: Image */}
                {paymentStep !== 'processing' && (
                  <div className="payment-image-side" style={{
                    flex: 1,
                    backgroundImage: `url(${microscopeBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '2.5rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                    }}>
                      <div style={{ color: 'white' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>MediBot Healthcare</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.2 }}>Secure Payment Gateway</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Half: Content */}
                <div className="payment-content-side" style={{
                  flex: 1.2, // Give content slightly more space
                  padding: '3.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                }}>
                  {/* Close Button */}
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748b',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                  >
                    <IconX size={20} />
                  </button>

                  {/* --- PHASE 1: SELECTION --- */}
                  {paymentStep === 'select' && (
                    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>

                      {/* Bill Summary - Compact Design */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        padding: '1.2rem',
                        borderRadius: '14px',
                        border: '1px solid #e2e8f0',
                        marginBottom: '1.5rem',
                        boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.05)'
                      }}>
                        {/* Bill Header */}
                        <div style={{
                          marginBottom: '1rem',
                          paddingBottom: '0.6rem',
                          borderBottom: '1px solid #e2e8f0'
                        }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}>
                            <span style={{ fontSize: '1.1rem' }}>📋</span>
                            Bill Summary
                          </h3>
                        </div>

                        {/* Combined Details Card */}
                        <div style={{
                          background: 'white',
                          padding: '0.8rem',
                          borderRadius: '10px',
                          marginBottom: '0.8rem',
                          border: '1px solid #e2e8f0'
                        }}>
                          {/* Top Row: Lab Name & Location */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                            <div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontSize: '1.1rem' }}>🏥</span>
                                {selectedLab?.name || 'Lab'}
                              </div>
                              {selectedLab?.location && (
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '1.5rem', marginTop: '0.1rem' }}>
                                  📍 {selectedLab.location}
                                </div>
                              )}
                            </div>
                            {/* Date & Time Compact */}
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                                📅 {bookingDate ? new Date(bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '--'}
                              </div>
                              <div style={{ marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                                ⏰ {bookingTime || '--'}
                              </div>
                            </div>
                          </div>

                          {/* Tests List - Compact */}
                          <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '0.6rem' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                              Selected Tests ({selectedTests.length})
                            </div>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.4rem'
                            }}>
                              {selectedTests.length > 0 ? selectedTests.map((test, idx) => (
                                <span key={idx} style={{
                                  fontSize: '0.75rem',
                                  color: '#334155',
                                  padding: '0.2rem 0.6rem',
                                  background: '#f1f5f9',
                                  borderRadius: '100px',
                                  border: '1px solid #e2e8f0',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}>
                                  <span style={{ color: '#10b981', fontSize: '0.6rem' }}>●</span>
                                  {test.name || test}
                                </span>
                              )) : (
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>None</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bill Breakdown - Compact Row */}
                        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                          <div style={{
                            flex: 1,
                            padding: '0.6rem',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Service Fee</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>₹{selectedLab?.price || 0}</span>
                          </div>
                          <div style={{
                            flex: 1,
                            padding: '0.6rem',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tests Total</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>₹{selectedTests.length * 150}</span>
                          </div>
                        </div>

                        {/* Total & Pay - Compact */}
                        <div style={{
                          borderTop: '1px dashed #cbd5e1',
                          paddingTop: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem'
                        }}>
                          {/* Total Display */}
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TOTAL TO PAY</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                              ₹{(selectedLab?.price || 0) + (selectedTests.length * 150)}
                            </div>
                          </div>

                          {/* Action Buttons Group */}
                          <div style={{ display: 'flex', gap: '0.6rem', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {/* Cancel Button */}
                            <button
                              onClick={() => setShowPaymentModal(false)}
                              style={{
                                padding: '0.8rem',
                                borderRadius: '10px',
                                background: 'transparent',
                                color: '#94a3b8',
                                border: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f1f5f9'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                            >
                              Cancel
                            </button>

                            {/* Pay at Lab Button */}
                            <button
                              onClick={async () => {
                                setPaymentMethod('Pay at Lab');
                                await handleConfirmBooking();
                                setShowPaymentModal(false);
                                setShowFeedbackModal(true);
                              }}
                              style={{
                                padding: '0.8rem 1rem',
                                borderRadius: '10px',
                                background: 'white',
                                color: '#0f172a',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                            >
                              Pay at Lab
                            </button>

                            {/* Pay Online Button */}
                            <button
                              onClick={() => {
                                initiateRazorpayPayment();
                              }}
                              style={{
                                flex: 1,
                                minWidth: '140px',
                                maxWidth: '200px',
                                padding: '0.8rem 1rem',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                              }}
                            >
                              🔒 Pay Online
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Security Badges */}
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 600,
                          color: '#16a34a', background: '#f0fdf4', padding: '0.3rem 0.6rem', borderRadius: '50px'
                        }}>
                          <IconShield size={12} /> SSL Secure
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 600,
                          color: '#2563eb', background: '#eff6ff', padding: '0.3rem 0.6rem', borderRadius: '50px'
                        }}>
                          <IconCheckCircle size={12} /> Razorpay
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Simulated steps for UPI/Net Banking removed in favor of real Razorpay checkout */}

                  {/* --- PHASE 4: PROCESSING --- */}
                  {paymentStep === 'processing' && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>

                      {/* Decorative Background Elements */}
                      <div className="pulse-circle"></div>
                      <div className="pulse-circle delay-1"></div>

                      <div className="modern-loader-container">
                        <svg className="circular-loader" viewBox="25 25 50 50">
                          <circle className="loader-path" cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10" />
                        </svg>
                        <div className="shield-icon-wrapper">
                          <IconShield size={22} />
                        </div>
                      </div>

                      <style>{`
                        .modern-loader-container {
                          position: relative;
                          width: 80px;
                          height: 80px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          margin-bottom: 2rem;
                          z-index: 10;
                        }
                        
                        .circular-loader {
                          width: 100%;
                          height: 100%;
                          animation: rotate 2s linear infinite;
                          position: absolute;
                        }
                        
                        .loader-path {
                          stroke: #2563eb;
                          stroke-linecap: round;
                          animation: dash 1.5s ease-in-out infinite;
                        }

                        .shield-icon-wrapper {
                          color: #2563eb;
                          background: white;
                          padding: 10px;
                          border-radius: 50%;
                          box-shadow: 0 4px 12px rgba(37,99,235,0.1);
                          animation: pulse-shield 1.5s ease-in-out infinite;
                          position: relative;
                          z-index: 11;
                        }

                        @keyframes rotate {
                          100% { transform: rotate(360deg); }
                        }
                        
                        @keyframes dash {
                          0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
                          50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
                          100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
                        }

                        @keyframes pulse-shield {
                          0%, 100% { transform: scale(1); }
                          50% { transform: scale(1.1); }
                        }

                        .pulse-circle {
                          position: absolute;
                          width: 120px;
                          height: 120px;
                          border-radius: 50%;
                          background: rgba(37, 99, 235, 0.05);
                          animation: ripple 2s infinite ease-out;
                          top: 40%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                        }
                        
                        .delay-1 { animation-delay: 0.6s; }

                        @keyframes ripple {
                          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
                          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
                        }
                      `}</style>

                      <h3 style={{ color: '#0f172a', margin: '0 0 0.5rem 0', fontSize: '1.6rem', fontWeight: 700, zIndex: 10 }}>Processing...</h3>
                      <p style={{ color: '#64748b', fontSize: '1rem', zIndex: 10, maxWidth: '80%', lineHeight: '1.5' }}>
                        Completing your secure payment.<br />Please do not close this window.
                      </p>

                      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                        <IconShield size={14} /> 256-bit SSL Encrypted
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
            }
          </div >
        )
      }

      {/* Enhanced Feedback & Rating Modal */}
      {
        showFeedbackModal && (
          <div className="payment-modal-overlay">
            <div className="feedback-modal-content">
              <div className="feedback-header">
                {/* Dynamic Emoji based on rating */}
                <span className="emoji-reaction">
                  {feedbackRating === 0 ? "🤔" :
                    feedbackRating <= 2 ? "😔" :
                      feedbackRating === 3 ? "😐" :
                        feedbackRating === 4 ? "😊" : "🤩"}
                </span>
                <h3>Rate Your Experience</h3>
                <p>How was your booking process with MediBot?</p>
              </div>

              <div className="feedback-body">
                <div className="rating-stars-container">
                  {[1, 2, 3, 4, 5].map(star => (
                    <div
                      key={star}
                      className={`star-item ${star <= feedbackRating ? 'active' : ''}`}
                      onClick={() => setFeedbackRating(star)}
                    >
                      <IconStar size={36} />
                    </div>
                  ))}
                </div>

                <div className="feedback-input-wrapper">
                  <textarea
                    className="feedback-textarea-enhanced"
                    placeholder="Tell us what you liked or how we can improve..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>

                <button
                  className="submit-feedback-btn"
                  onClick={submitFeedback}
                >
                  Submit Feedback
                </button>

                <button
                  className="skip-btn"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Chat Widget */}
      {/* Floating Action Button */}
      <div className="chat-fab-container">
        {!showChatSidebar && (
          <div className="chat-tooltip">Chat with MediBot</div>
        )}
        <button className="chat-fab" onClick={() => setShowChatSidebar(!showChatSidebar)}>
          {showChatSidebar ? <IconX size={32} /> : <IconMessageCircle size={32} className="chat-icon-svg" />}
        </button>
      </div>

      {/* Simple Chat Sidebar */}
      {
        showChatSidebar && (
          <div className="simple-chat-sidebar">
            <div className="simple-chat-header">
              <h3>MediBot Assistant</h3>
              <button className="simple-chat-close" onClick={() => setShowChatSidebar(false)}>
                <IconX size={18} />
              </button>
            </div>

            <div className="simple-chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`simple-msg ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="simple-chat-input-area">
              <input
                className="simple-chat-input"
                placeholder="Ask me something..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              />
              <button className="simple-chat-send" onClick={handleChatSend}>
                <IconSend size={20} />
              </button>
            </div>
          </div>
        )
      }

      {/* Toast Notifications Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px'
      }}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              background: toast.type === 'success'
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              animation: 'slideInRight 0.3s ease-out',
              minWidth: '320px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => dismissToast(toast.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
            }}
          >
            {/* Progress bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: 'rgba(255, 255, 255, 0.3)',
              animation: 'shrink 4s linear',
              transformOrigin: 'left'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flex: 1
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {toast.type === 'success' ? (
                  <IconCheckCircle size={24} />
                ) : (
                  <IconX size={24} />
                )}
              </div>
              <span style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                lineHeight: 1.4
              }}>
                {toast.message}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissToast(toast.id);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '0.4rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <IconX size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Toast Animation Styles */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>

    </div >
  );
};

export default LandingPage;
