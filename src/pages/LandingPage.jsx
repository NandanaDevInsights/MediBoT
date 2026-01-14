import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/LabHero.jpg';
import logoImage from '../assets/Logo.png';
import './LandingPage.css';
import { getUserProfile, getUserReports, updateUserProfile } from '../services/api';

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

const LABS_DATA = [
  {
    id: 1,
    name: 'City Care Diagnostics',
    rating: 4.5,
    location: 'Civil Lines', // Approx Bangalore Central
    tags: ['CBC', 'Lipid Profile', 'Thyroid'],
    price: 450,
    colorClass: 'color-1',
    lat: 12.9716,
    lon: 77.5946
  },
  {
    id: 2,
    name: 'MediPlus Path Labs',
    rating: 4.8,
    location: 'Gandhi Nagar', // Approx slightly north
    tags: ['Full Body', 'Diabetes', 'Vita-D'],
    price: 600,
    colorClass: 'color-2',
    lat: 12.9856,
    lon: 77.5760
  },
  {
    id: 3,
    name: 'Apex Health Center',
    rating: 4.2,
    location: 'West End', // Approx West
    tags: ['Iron Studies', 'Liver Function'],
    price: 550,
    colorClass: 'color-3',
    lat: 12.9696,
    lon: 77.5660
  },
  {
    id: 4,
    name: 'BioLine Diagnostics',
    rating: 4.6,
    location: 'Sector 4', // Approx East
    tags: ['KFT', 'CBC', 'Glucose'],
    price: 400,
    colorClass: 'color-4',
    lat: 12.9248,
    lon: 77.6320
  }
];

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
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [visibleLimit, setVisibleLimit] = useState(8);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // New State for Features
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [patientDetails, setPatientDetails] = useState({ age: '', gender: '', savedLocation: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Chat Widget State
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: "ai", text: "Hello! I'm your MediBot Assistant. How can I help you today?" }
  ]);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  // Notifications & Reminders State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your report for CBC is ready.", time: "2 hrs ago", isRead: false },
    { id: 2, text: "Appointment confirmed at City Care.", time: "5 hrs ago", isRead: false }
  ]);

  const [reminders, setReminders] = useState([
    { id: 1, text: "Fasting required for Thyroid test tomorrow.", time: "Tomorrow, 8 AM" },
    { id: 2, text: "Follow-up checkup pending.", time: "Next Week" }
  ]);

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotification = (id) => {
    if (window.confirm("Remove this notification?")) {
      setNotifications(notifications.filter(n => n.id !== id));
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
  const [paymentMethod, setPaymentMethod] = useState('Pay at Lab');
  const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'upi_scan', 'card_form'

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

  const handleDeleteBooking = (id) => {
    if (window.confirm("Are you sure you want to remove this booking from your history?")) {
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  const finalizeBooking = async () => {
    // Step 1: Routing based on Method
    if (paymentStep === 'select') {
      if (paymentMethod === 'UPI') {
        setPaymentStep('upi_scan');
        return;
      }
      if (paymentMethod === 'Credit/Debit Card') {
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
    if (feedbackRating >= 4) message = "We're glad you had a great experience!";
    else if (feedbackRating > 0 && feedbackRating < 4) message = "Thanks. We'll try to improve.";

    alert(message);
    setShowFeedbackModal(false);
    setFeedbackRating(0);
    setFeedbackText("");
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const newMsg = { id: Date.now(), type: "user", text: chatInput };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: "ai",
        text: "I can help you find labs, book appointments, or view your reports. Is there anything specific you need?"
      }]);
    }, 1000);
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
        alert("Booking cancelled.");
        fetchBookings(); // Refresh list
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (e) {
      console.error(e);
      alert("Error cancelling booking.");
    }
  };

  const handleConfirmBooking = async () => {
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
          doctor: newBooking.doctor,
          date: newBooking.date,
          time: newBooking.time,
          tests: newBooking.tests,
          location: newBooking.location
        })
      });
      if (response.ok) {
        // Wait for server to process, then fetch fresh list
        await fetchBookings();
        setShowBookingModal(false);
        // Alert removed or kept? User flow might be interrupted. 
        // Keeping it for now as per previous logic, or maybe the feedbackmodal handles it.
        // Actually, handleConfirmBooking is called, THEN success triggers confirm.
        // But let's rely on fetchBookings to update state.
        alert("Booking Confirmed! Check 'Bookings' in the navbar.");
      } else {
        alert("Failed to confirm booking with server.");
      }
    } catch (e) {
      console.error(e);
      // Fallback
      alert("Network Error. Booking might not be saved remotely.");
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

  // Update filtered labs when inputs change
  useEffect(() => {
    filterLabs(activeFilter, searchTerm, userCoords);
  }, [userCoords, activeFilter, searchTerm]);

  // Fetch Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile(data);

        // Populate editable state
        setPatientDetails({
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
      setTimeout(() => {
        const coords = { lat: 9.5586, lon: 76.7915 };
        setUserCoords(coords);
        sessionStorage.setItem('user_location_coords', JSON.stringify({ ...coords, name: userLocationInput }));
        setShowLocationModal(false);
        setLocationLoading(false);
      }, 800); // Small fake delay for realism
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

      try {
        // Attempt to treat as location first
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          // It IS a valid location
          const { lat, lon } = data[0];
          const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };

          // Update Location Context
          setUserCoords(coords);
          setUserLocationInput(query);
          sessionStorage.setItem('user_location_coords', JSON.stringify({ ...coords, name: query }));
        } else {
          // Not a location, so it stays as a keyword filter (handled by useEffect/filterLabs)
          // Just ensure we are focusing on the list
          console.log("Keyword search: Filtering existing list...");
        }
      } catch (err) {
        console.error("Search error (likely network), falling back to keyword filter", err);
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
  const filterLabs = (filter, search, coords) => {
    let processingLabs;

    // SIMULATION: If we have user coordinates, "fetch" (mock) labs near them.
    if (coords) {
      // Extract city name for dynamic naming
      const cityInput = userLocationInput.toLowerCase();
      // Handle various spellings/shortcodes for Kanjirapally
      const isKanjirapally = cityInput.includes('kanjirapally') || cityInput.includes('kanjirappally') || cityInput.includes('kply');

      const niceName = userLocationInput.split(',')[0].trim(); // Display name for generic labs

      const labImages = [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1516549655169-df83a092fc96?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600'
      ];

      let dynamicLabs = [];

      if (isKanjirapally) {
        // Specific data provided for Kanjirapally
        const kLabs = [
          { name: "Scanron Diagnostics", location: "Kanjirappally, Kottayam", tags: ["Medical Lab", "ECG", "Scanning"], rate: "New", time: "08:30 PM", price: 500 },
          { name: "Sri Diagnostics Pvt (Ltd)", location: "Kanjirappally, Kottayam", tags: ["Pathology", "Blood", "Urine", "Sputum"], rate: "New", time: "06:30 PM", price: 450 },
          { name: "DDRC SRLl Diagnostic Center", location: "Kanjirappally, Kottayam", tags: ["Diagnostic Center", "Lab"], rate: 5.0, time: "24 Hours", price: 600 },
          { name: "Amala Laboratary", location: "Kanjirappally, Kottayam", tags: ["Blood", "Urine", "Sputum", "Stool"], rate: "New", time: "04:30 PM", price: 400 },
          { name: "Dianova", location: "Kanjirappally, Kottayam", tags: ["Clinical", "Medical Lab", "Blood", "Sputum"], rate: "New", time: "06:30 PM", price: 550 },
          { name: "Royal Clinical Laboratory", location: "Kanjirappally, Kottayam", tags: ["Clinical Tests"], rate: "New", time: "07:00 PM", price: 480 },
          { name: "Marymatha Clinical Laboratory", location: "Kanjirappally, Kottayam", tags: ["Blood", "Urine", "Stool", "Body Fluids"], rate: "New", time: "05:30 PM", price: 420 },
          { name: "Dianova Clinical Laboratory", location: "Kanjirappally, Kottayam", tags: ["Clinical Laboratory"], rate: "New", time: "06:00 PM", price: 500 },
          { name: "ClinoTech Laboratories", location: "Kanjirappally, Kottayam", tags: ["Diagnostic Laboratory"], rate: 5.0, time: "08:00 PM", price: 650 },
          { name: "Usha Clinic", location: "Kanjirappally, Kottayam", tags: ["Medical Lab", "Clinic"], rate: 4.0, time: "07:00 PM", price: 350 }
        ];

        dynamicLabs = kLabs.map((l, i) => ({
          id: i + 1,
          name: l.name,
          rating: l.rate,
          location: l.location,
          tags: l.tags,
          price: l.price,
          openTime: l.time,
          image: labImages[i % labImages.length],
          lat: coords.lat + (Math.random() - 0.5) * 0.015,
          lon: coords.lon + (Math.random() - 0.5) * 0.015
        }));

      } else {
        // Generic simulation for other places to mimic OSM findings
        const uniqueNames = new Set();
        for (let i = 0; i < 12; i++) {
          const gNames = [
            `${niceName} Medical Centre`,
            `${niceName} Diagnostic Hub`,
            `Apollo Diagnostics ${niceName}`,
            `${niceName} Path Labs`,
            `City Care ${niceName}`,
            `Metropolis Labs ${niceName}`,
            `Thyrocare ${niceName}`,
            `${niceName} Healthcare`,
            `Trust Lab ${niceName}`,
            `Prime Diagnostics ${niceName}`,
            `${niceName} Clinical Lab`,
            `Global Reference Lab ${niceName}`
          ];
          const gLocs = [`Main Road, ${niceName}`, `Station Road, ${niceName}`, `Civil Lines, ${niceName}`, `Market Area, ${niceName}`];

          let name = gNames[i] || `${niceName} Lab ${i + 1}`;
          // Ensure uniqueness
          if (uniqueNames.has(name)) name = `${name} ${i + 1}`;
          uniqueNames.add(name);

          dynamicLabs.push({
            id: i + 1,
            name: name,
            rating: (4 + Math.random() * 1).toFixed(1),
            location: gLocs[i % gLocs.length] || `Near Bus Stand, ${niceName}`,
            tags: ['CBC', 'Lipid Profile', 'Thyroid'],
            price: 400 + Math.floor(Math.random() * 500),
            image: labImages[i % labImages.length],
            lat: coords.lat + (Math.random() - 0.5) * 0.05,
            lon: coords.lon + (Math.random() - 0.5) * 0.05
          });
        }
      }

      processingLabs = dynamicLabs.map(lab => {
        const dist = calculateDistance(coords.lat, coords.lon, lab.lat, lab.lon);
        return { ...lab, distanceVal: dist, distance: `${dist.toFixed(1)} km` };
      });

    } else {
      // Fallback: Show Generic Labs for filtering if no location is selected but search term exists
      if (search && search.length > 2) {
        // Use the imported LABS_DATA as a base, simulating a "global search"
        const labImages = [
          'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1516549655169-df83a092fc96?auto=format&fit=crop&q=80&w=600'
        ];

        // Mock some extra global labs
        const extraLabs = [
          { id: 101, name: "Metropolis Healthcare", location: "Global Network", tags: ["Full Body", "Thyroid"], rating: 4.5, price: 800 },
          { id: 102, name: "Dr. Lal PathLabs", location: "Nationwide", tags: ["CBC", "Diabetes"], rating: 4.7, price: 550 },
          { id: 103, name: "SRL Diagnostics", location: "Multiple Cities", tags: ["KFT", "LFT"], rating: 4.4, price: 600 },
          { id: 104, name: "Thyrocare Technologies", location: "Pan India", tags: ["Thyroid", "Vitamins"], rating: 4.6, price: 400 }
        ];

        const allMock = [...LABS_DATA, ...extraLabs];

        processingLabs = allMock.map((lab, i) => ({
          ...lab,
          image: labImages[i % labImages.length],
          distance: 'N/A', // Distance unknown
          distanceVal: 9999
        }));
      } else {
        processingLabs = [];
      }
    }

    // Apply Search
    if (search && processingLabs.length > 0) {
      const term = search.toLowerCase();
      processingLabs = processingLabs.filter(lab =>
        lab.name.toLowerCase().includes(term) ||
        lab.location.toLowerCase().includes(term) ||
        lab.tags.some(tag => tag.toLowerCase().includes(term))
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
      processingLabs.sort((a, b) => a.distanceVal - b.distanceVal);
    }

    setFilteredLabs(processingLabs);
    setVisibleLimit(8); // Reset limit on filter change
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
            <span className="brand-logo">MediBot</span>
          </div>

          <div className="search-bar-nav" style={{ display: 'none' }}></div>

          <div className="nav-links">
            <button className="nav-item-btn" onClick={handleHomeClick}>
              <IconHome />
              <span>Home</span>
            </button>
            {/* Notifications & Reminders - Only visible if location entered */}
            {/* Notifications & Reminders - Always visible */}
            <div style={{ position: 'relative' }}>
              <button
                className="nav-item-btn"
                onClick={() => { setShowNotifications(!showNotifications); setShowReminders(false); }}
              >
                <IconBell />
                <span>Notifications</span>
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  background: '#ef4444', color: 'white',
                  fontSize: '0.6rem', padding: '2px 5px', borderRadius: '50%',
                  fontWeight: 'bold'
                }}>2</span>
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <button
                className="nav-item-btn"
                onClick={() => { setShowReminders(!showReminders); setShowNotifications(false); }}
              >
                <IconClock />
                <span>Reminders</span>
              </button>
            </div>

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
                {displayName}
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
        </div>
      </nav >

      {/* Reports Modal */}

      {/* Full Screen Reports Section */}
      {/* Full Screen Reports Section */}
      {/* Reports Modal (Redesigned) */}
      {/* Reports Page */}
      {/* Reports Page */}
      {showReportsModal && (
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

              <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {/* Uploaded Reports */}
                {activeReportTab === 'Uploaded' && (
                  <>
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <div key={report.id} className="report-card" style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          cursor: 'default',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.03)'; }}
                        >
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                              <div style={{ background: '#eff6ff', padding: '0.8rem', borderRadius: '12px', color: 'var(--primary)' }}>
                                <IconFileText size={24} />
                              </div>
                              <span style={{
                                background: report.status === 'Verified' ? '#dcfce7' : '#fef9c3',
                                color: report.status === 'Verified' ? '#166534' : '#854d0e',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                {report.status || 'Pending'}
                              </span>
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1e293b' }}>Prescription Upload #{report.id}</h4>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <IconCalendar size={14} /> {new Date(report.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '0.8rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                            <a href={report.file_path} target="_blank" rel="noopener noreferrer" style={{
                              flex: 1,
                              textAlign: 'center',
                              padding: '0.7rem',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              color: '#475569',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              textDecoration: 'none',
                              transition: 'background 0.2s'
                            }}>
                              View
                            </a>
                            <button
                              onClick={() => downloadFile(report.file_path, `Prescription_${report.id}.pdf`)}
                              style={{
                                flex: 1,
                                padding: '0.7rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'var(--primary-soft)',
                                color: 'var(--primary-dark)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem'
                              }}
                            >
                              <IconDownload size={16} /> Download
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ background: '#f1f5f9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                          <IconUploadCloud size={40} color="#94a3b8" />
                        </div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>No Prescriptions Yet</h3>
                        <p style={{ color: '#64748b' }}>Upload your prescription to get started with your order.</p>
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
                          background: 'white',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          border: '1px solid #e2e8f0', // Green tint border
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#16a34a' }}></div>

                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                              <div style={{ background: '#dcfce7', padding: '0.8rem', borderRadius: '12px', color: '#16a34a' }}>
                                <IconActivity size={24} />
                              </div>
                              <span style={{
                                background: '#16a34a',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center', gap: '4px'
                              }}>
                                <IconCheckCircle size={12} /> Ready
                              </span>
                            </div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1e293b' }}>Lab Report #{report.id}</h4>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <IconCalendar size={14} /> {new Date(report.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>

                          <button
                            onClick={() => downloadFile(report.file_path, `Lab_Result_${report.id}.pdf`)}
                            style={{
                              width: '100%',
                              padding: '0.8rem',
                              borderRadius: '12px',
                              border: 'none',
                              background: '#16a34a',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.3)',
                              marginTop: '1rem'
                            }}
                          >
                            <IconDownload size={18} /> Download Full Report
                          </button>
                        </div>
                      ))
                    ) : (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ background: '#f1f5f9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                          <IconActivity size={40} color="#94a3b8" />
                        </div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>No Lab Results Yet</h3>
                        <p style={{ color: '#64748b' }}>Once your tests are processed, your digital reports will appear here.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}




      {/* Full Screen Profile Section */}
      {/* Full Screen Profile Section */}
      {/* Profile Page */}
      {showProfileModal && (
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
                    <label className="fs-label" style={{ color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Full Name</label>
                    {isEditingProfile ? (
                      <input
                        className="fs-input"
                        value={patientDetails.displayName !== undefined ? patientDetails.displayName : (userProfile?.displayName || (userProfile?.email ? userProfile.email.split('@')[0] : ''))}
                        onChange={e => setPatientDetails({ ...patientDetails, displayName: e.target.value })}
                      />
                    ) : (
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{displayName}</div>
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
      )}

      {/* Notifications Page */}
      {showNotifications && (
        <div className="page-container">
          <div className="page-content-wrapper">
            <div className="page-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2>Notifications</h2>
                <span className="badge-count" style={{ background: 'var(--primary)' }}>{notifications.filter(n => !n.isRead).length} New</span>
              </div>
              {notifications.length > 0 && (
                <button onClick={clearAllNotifications} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                  Clear All
                </button>
              )}
            </div>

            <div className="form-card" style={{ maxWidth: '800px', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className="list-item-card" style={{
                    borderLeft: n.isRead ? '4px solid #cbd5e1' : '4px solid var(--primary)',
                    opacity: n.isRead ? 0.8 : 1,
                    background: 'white',
                    marginBottom: '1rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                      <div style={{
                        background: n.isRead ? '#f1f5f9' : '#eff6ff',
                        padding: '0.75rem',
                        borderRadius: '50%',
                        transition: 'all 0.3s'
                      }}>
                        <IconBell size={20} color={n.isRead ? '#94a3b8' : 'var(--primary)'} />
                      </div>
                      <div>
                        <p style={{
                          margin: '0 0 0.25rem 0',
                          fontWeight: n.isRead ? 500 : 700,
                          fontSize: '1.05rem',
                          color: n.isRead ? 'var(--text-muted)' : 'var(--text-main)'
                        }}>
                          {n.text}
                        </p>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.time}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!n.isRead && (
                        <button
                          onClick={() => markNotificationRead(n.id)}
                          title="Mark as Read"
                          style={{
                            border: '1px solid #dcfce7',
                            background: '#f0fdf4',
                            color: '#166534',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                  <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <IconBell size={24} color="#94a3b8" />
                  </div>
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reminders Page */}
      {showReminders && (
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
      )}

      {/* My Bookings Page */}
      {showMyBookingsModal && (
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
                        <strong style={{ color: 'var(--text-body)' }}>{b.tests.join(', ')}</strong>
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
      )}

      {/* 2. Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="hero-content">
          <h1>Find Best Laboratories Near You</h1>
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
              onClick={() => handleSearchSubmit({ key: 'Enter' })} // Simulate Enter key
            >
              Search
            </button>
          </div>
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
      {showPaymentModal && selectedLab && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-content">

            {/* Payment Content based on Step - Refined Professional UI */}
            {paymentStep === 'select' && (
              <div className="payment-step-container">
                <div className="payment-header" style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  color: 'white',
                  boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  {/* Decorative circles - subtle */}
                  <div style={{ position: 'absolute', top: -30, left: -20, width: 80, height: 80, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }}></div>

                  <div style={{ textAlign: 'left', zIndex: 1 }}>
                    <span className="payment-subtitle" style={{ display: 'block', fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Payable</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Includes all taxes</span>
                  </div>
                  <h2 className="payment-total" style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1 }}>₹{selectedLab.price + (selectedTests.length * 150)}</h2>
                </div>

                <h3 className="payment-section-title" style={{ fontSize: '0.75rem', marginBottom: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Payment Method</h3>

                <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '350px', overflowY: 'auto' }}>
                  {['Pay at Lab', 'UPI', 'Credit/Debit Card'].map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`payment-method-btn ${paymentMethod === method ? 'selected' : ''}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.8rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: paymentMethod === method ? '1.5px solid #2563eb' : '1px solid #f1f5f9',
                        background: paymentMethod === method ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative',
                        boxShadow: paymentMethod === method ? '0 4px 6px -1px rgba(37, 99, 235, 0.1)' : 'none',
                      }}
                    >
                      <div className="payment-method-icon" style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: paymentMethod === method ? 'white' : '#f8fafc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: paymentMethod === method ? '#2563eb' : '#64748b',
                        border: '1px solid #e2e8f0'
                      }}>
                        {method === 'Pay at Lab' && <IconHome size={18} />}
                        {method === 'UPI' && <span style={{ fontSize: '1rem' }}>📱</span>}
                        {method === 'Credit/Debit Card' && <span style={{ fontSize: '1rem' }}>💳</span>}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <span style={{ display: 'block', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{method}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {method === 'Pay at Lab' ? 'Pay at counter' : method === 'UPI' ? 'GPay, PhonePe' : 'Cards'}
                        </span>
                      </div>
                      <div className={`radio-circle ${paymentMethod === method ? 'checked' : ''}`} style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: paymentMethod === method ? '5px solid #2563eb' : '1.5px solid #cbd5e1',
                        background: 'white'
                      }}>
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <button
                    className="payment-confirm-btn"
                    onClick={finalizeBooking}
                    style={{
                      width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 700,
                      borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                  >
                    <IconShield size={18} />
                    {paymentMethod === 'Pay at Lab' ? `Confirm Booking` : `Pay ₹${selectedLab.price + (selectedTests.length * 150)}`}
                  </button>
                  <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      style={{
                        background: '#fff1f2',
                        border: '1px solid #fecdd3',
                        color: '#e11d48',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '12px',
                        fontWeight: 600,
                        width: '100%',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <IconX size={16} /> Cancel Transaction
                    </button>
                  </p>
                </div>
              </div>
            )}

            {paymentStep === 'upi_scan' && (
              <div className="payment-step-container">
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h3 className="payment-section-title" style={{ fontSize: '1rem', marginBottom: '0.2rem', fontWeight: 700 }}>Scan QR to Pay</h3>
                  <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Use any UPI app on your phone</p>
                </div>

                <div className="qr-container" style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '260px', margin: '0 auto 1.5rem auto' }}>
                  <div className="qr-code-mock" style={{ width: '140px', height: '140px', padding: '8px', background: 'white', border: '2px solid #0f172a', borderRadius: '12px', position: 'relative' }}>
                    <div style={{ width: '100%', height: '100%', background: `repeating-linear-gradient(45deg, #0f172a 0, #0f172a 4px, #fff 4px, #fff 8px)` }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '4px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>₹</span>
                    </div>
                  </div>

                  <div className="payment-options" style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '1rem', width: '100%' }}>
                    {/* App Logos Placeholder */}
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <div key={app} style={{ width: 32, height: 32, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#64748b', fontWeight: 700 }}>{app[0]}</div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="back-link" onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <IconX size={16} /> Cancel
                  </button>
                  <button
                    className="payment-confirm-btn"
                    onClick={finalizeBooking}
                    style={{ flex: 2, padding: '0.8rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: '10px', background: '#16a34a', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)', cursor: 'pointer' }}
                  >
                    Paid ₹{selectedLab.price + (selectedTests.length * 150)}
                  </button>
                </div>

                <button className="back-link" onClick={() => setPaymentStep('select')} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>
                  &larr; Choose different method
                </button>
              </div>
            )}

            {paymentStep === 'card_form' && (
              <div className="payment-step-container">
                <h3 className="payment-section-title" style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>Enter Card Details</h3>

                {/* Card visual - Compact */}
                <div className="card-visual" style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  color: 'white',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 15px -5px rgba(15, 23, 42, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ width: 32, height: 22, background: 'rgba(255,255,255,0.2)', borderRadius: 4 }}></div>
                    <span style={{ fontSize: '0.8rem', fontStyle: 'italic', fontWeight: 700, opacity: 0.8 }}>VISA</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', letterSpacing: '0.1em', marginBottom: '1rem', fontFamily: 'monospace' }}>•••• •••• •••• 4242</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', opacity: 0.8 }}>
                    <span>CARD HOLDER</span>
                    <span>EXPIRES</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span>NANDANA PRAMOD</span>
                    <span>12/28</span>
                  </div>
                </div>

                <div className="card-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div className="card-input-group">
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Card Number</label>
                    <div style={{ position: 'relative' }}>
                      <input type="text" placeholder="0000 0000 0000 0000" className="card-input" maxLength={19} style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                      <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>💳</span>
                    </div>
                  </div>

                  <div className="card-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card-input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="card-input" maxLength={5} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }} />
                    </div>
                    <div className="card-input-group">
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem', display: 'block' }}>CVV</label>
                      <div style={{ position: 'relative' }}>
                      </div>
                    </div>

                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button className="back-link" onClick={() => setShowPaymentModal(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <IconX size={16} /> Cancel
                  </button>
                  <button
                    className="payment-confirm-btn"
                    onClick={finalizeBooking}
                    style={{ flex: 2, padding: '0.8rem', fontSize: '0.95rem', fontWeight: 700, borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)', cursor: 'pointer' }}
                  >
                    Pay ₹{selectedLab.price + (selectedTests.length * 150)}
                  </button>
                </div>
                <button className="back-link" onClick={() => setPaymentStep('select')} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}>
                  &larr; Choose different method
                </button>
              </div>
            )}

            <div className="payment-secure-badge" style={{ textAlign: 'center', marginTop: '1.5rem', padding: '0.4rem 0.8rem', background: '#f0fdf4', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#16a34a', border: '1px solid #bbf7d0', width: 'fit-content', margin: '0 auto' }}>
              <IconShield size={12} /> 100% Secure & Safe
            </div>
          </div>
        </div>
      )}

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
          <div className="chat-tooltip">Chat with AI</div>
        )}
        <button className="chat-fab" onClick={() => setShowChatSidebar(true)}>
          <IconMessageCircle size={32} className="chat-icon-svg" />
        </button>
      </div>

      {/* Chat Sidebar */}
      {
        showChatSidebar && (
          <div className="chat-sidebar">
            <div className="chat-header">
              <span>MediBot AI Support</span>
              <button
                onClick={() => setShowChatSidebar(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-dark)' }}
              >
                <IconX size={24} />
              </button>
            </div>

            <div className="chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-msg ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <input
                className="chat-input"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              />
              <button className="chat-send-btn" onClick={handleChatSend}>
                <IconSend size={18} />
              </button>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default LandingPage;
