import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/LabHero.jpg';
import logoImage from '../assets/Logo.png';
import './LandingPage.css';
import { getUserProfile, getUserReports } from '../services/api';

// --- Icon Components ---
const IconHome = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
const IconActivity = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconDroplet = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.74 5.74c.9 1 1.63 2.16 2.1 3.44.48 1.28.6 2.65.37 4-.24 1.34-1 2.54-2.2 3.32-1.2.78-2.6 1-4.01.65-2.66-.65-4.5-3.05-4.5-5.8V2.69z"></path>
  </svg>
);

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconX = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconClock = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const IconChevronDown = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
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

  // Mock Notifications
  const notifications = [
    { id: 1, text: "Your report for CBC is ready.", time: "2 hrs ago" },
    { id: 2, text: "Appointment confirmed at City Care.", time: "5 hrs ago" }
  ];

  // Mock Reminders
  const reminders = [
    { id: 1, text: "Fasting required for Thyroid test tomorrow.", time: "Tomorrow, 8 AM" },
    { id: 2, text: "Follow-up checkup pending.", time: "Next Week" }
  ];



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

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);

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

  const handleConfirmBooking = () => {
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

    setBookings([...bookings, newBooking]);
    setShowBookingModal(false);
    alert("Booking Confirmed! Check 'Bookings' in the navbar.");
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
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Check if the search term is a location
      const query = searchTerm.trim();

      try {
        // optimistically try to find it as a location
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };

          // Update Location
          setUserCoords(coords);
          setUserLocationInput(query); // Update the "current location" name
          sessionStorage.setItem('user_location_coords', JSON.stringify({ ...coords, name: query }));

          // Clear filtered text so we see all labs in this new location
          // Or keep it? User might be searching "Xray in Mumbai".
          // If we update location to Mumbai, and keep "Xray in Mumbai" as filter, it might match nothing if "Mumbai" is not in lab name/tags.
          // Better logic: If we successfully switched location, maybe clear the search term OR strip the location part.
          // For now, let's just switch location and let the user refine if needed, or keep the search term.
          // If I type "Mumbai", and location switches to Mumbai, the labs at Mumbai will appear. Then we filter by "Mumbai".
          // The labs generated at Mumbai will likely have "Mumbai" in their address, so it should be fine.

        } else {
          // If not a location, just strict filter existing labs (already happens via useEffect)
          // If not a location, just strict filter existing labs (already happens via useEffect)
          console.log("Not a location or not found, filtering list...");

          // Optionally: Explicitly tell the user we couldn't find that location?
          // For now, silently failing to update location is safer, leaving the keyword search active.
          // But if userCoords was null, we rely on the keyword fallback we added to filterLabs.
        }
      } catch (err) {
        console.error("Search error", err);
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
  const displayName = userProfile?.email ? userProfile.email.split('@')[0] : (patientDetails.displayName || userProfile?.displayName || 'Guest');

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
              {locationLoading ? 'Searching...' : 'Find Laboratories'} <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal (New) */}
      {showBookingModal && selectedLab && (
        <div style={{ position: 'fixed', top: '73px', left: 0, right: 0, bottom: 0, zIndex: 900, background: '#f8fafc', overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', minHeight: 'calc(100vh - 120px)' }}>

            {/* Sidebar Card - Floating Style */}
            <div className="fs-sidebar-card" style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2rem 1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              height: 'fit-content',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'sticky',
              top: '2rem',
              border: '1px solid white'
            }}>

              <div className="sidebar-avatar" style={{
                backgroundImage: `url(${selectedLab.image})`,
                backgroundSize: 'cover',
                width: 100,
                height: 100,
                marginBottom: '1rem',
                borderRadius: '50%',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                marginTop: '1rem'
              }}>
                {!selectedLab.image && <IconMapPin size={50} />}
              </div>

              <div className="sidebar-info" style={{ width: '100%' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#1e293b', fontWeight: 700 }}>{selectedLab.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem', color: '#f59e0b', fontWeight: 700, fontSize: '1rem' }}>
                  <span>{selectedLab.rating}</span> <IconStar fill="currentColor" size={18} />
                  <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.9rem' }}>({selectedLab.rating > 4.5 ? 'Excellent' : 'Good'})</span>
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <IconMapPin size={14} /> {selectedLab.location}
                </p>

                {selectedLab.distance && (
                  <p style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#2563eb', fontWeight: 600 }}>
                    Distance: {selectedLab.distance}
                  </p>
                )}

                <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid #f1f5f9', width: '100%' }}>
                  <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.85rem', color: '#64748b' }}>Consultation Starts</p>
                  <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1d4ed8' }}>₹{selectedLab.price}</p>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {selectedLab.tags && selectedLab.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '20px', color: '#475569', fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Card - Floating Style */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              height: 'fit-content',
              minHeight: '100%',
              border: '1px solid white'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#1e293b', fontWeight: 700 }}>Patient Details</h3>
              <div className="fs-form-grid" style={{ gap: '2rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600, color: '#334155', fontSize: '1.1rem' }}>Select Tests</label>

                  {/* Category Tabs */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {Object.keys(TEST_CATEGORIES).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveTestCategory(cat)}
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: '30px',
                          border: 'none',
                          background: activeTestCategory === cat ? '#2563eb' : 'white',
                          color: activeTestCategory === cat ? 'white' : '#64748b',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          boxShadow: activeTestCategory === cat ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        <span>{cat === "Urine Tests" ? "🚽" : cat === "Sputum Tests" ? "🫁" : cat === "Stool Tests" ? "💩" : "🩸"}</span>
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {TEST_CATEGORIES[activeTestCategory].map(test => (
                      <div
                        key={test}
                        onClick={() => toggleTestSelection(test)}
                        style={{
                          padding: '1.25rem',
                          border: `1.5px solid ${selectedTests.includes(test) ? '#2563eb' : '#e2e8f0'}`,
                          borderRadius: '16px',
                          cursor: 'pointer',
                          background: selectedTests.includes(test) ? '#eff6ff' : 'white',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          minHeight: '80px',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          minWidth: 20, width: 20, height: 20, borderRadius: '6px',
                          border: `1.5px solid ${selectedTests.includes(test) ? '#2563eb' : '#cbd5e1'}`,
                          background: selectedTests.includes(test) ? '#2563eb' : 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {selectedTests.includes(test) && <IconCheckCircle size={14} color="white" />}
                        </div>
                        <span style={{ fontWeight: 600, color: '#334155', lineHeight: 1.4, fontSize: '0.95rem' }}>{test}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Preferred Date</label>
                    <input className="fs-input" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} style={{ padding: '0.8rem', width: '100%', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Preferred Time</label>
                    <input className="fs-input" type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} style={{ padding: '0.8rem', width: '100%', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                  </div>
                </div>

                <div style={{ gridColumn: '1/-1', borderTop: '1px solid #f1f5f9', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Total Estimated Cost</p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>₹{selectedLab.price + (selectedTests.length * 150)}</p>
                  </div>
                  <button className="location-submit-btn" style={{ padding: '0 3rem', height: '56px', fontSize: '1.1rem', borderRadius: '16px', background: '#2563eb', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }} onClick={handleConfirmBooking}>
                    Confirm Appointment
                  </button>
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
            {userCoords && (
              <>
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
              </>
            )}

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
      {/* Full Screen Reports Section */}
      {showReportsModal && (
        <div className="fullscreen-section">
          <div className="fullscreen-content">

            {/* Toggle Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
              <button
                onClick={() => setActiveReportTab('Uploaded')}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeReportTab === 'Uploaded' ? 'var(--primary)' : '#e2e8f0',
                  color: activeReportTab === 'Uploaded' ? 'white' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: activeReportTab === 'Uploaded' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <IconUploadCloud size={20} /> Uploaded Reports
              </button>
              <button
                onClick={() => setActiveReportTab('Generated')}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeReportTab === 'Generated' ? '#16a34a' : '#e2e8f0',
                  color: activeReportTab === 'Generated' ? 'white' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: activeReportTab === 'Generated' ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <IconFileText size={20} /> Generated Reports
              </button>
            </div>

            {/* Section 1: Uploaded Reports */}
            {activeReportTab === 'Uploaded' && (
              <div className="fs-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <IconUploadCloud size={24} color="var(--primary)" style={{ marginRight: '0.75rem' }} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Uploaded Papers</h3>
                </div>

                {reports.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Showing ALL reports here as "Uploaded" for now since all come from upload */}
                    {reports.map((report) => (
                      <div key={report.id} className="notification-item" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--primary)', padding: '1.5rem' }}>

                        {/* Left Side: Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>Prescription #{report.id}</span>
                            <span className={`status-badge ${report.status}`} style={{ textTransform: 'capitalize' }}>{report.status}</span>
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconCalendar size={14} />
                            <span>Uploaded on {new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Right Side: Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <a href={report.file_path} target="_blank" rel="noopener noreferrer" className="book-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                            <IconEye size={16} style={{ marginRight: 6 }} /> View
                          </a>
                          <a href={report.file_path} download className="book-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center' }}>
                            <IconDownload size={16} style={{ marginRight: 6 }} /> Download
                          </a>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
                    <IconFileText size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>No prescriptions uploaded yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Generated Reports */}
            {activeReportTab === 'Generated' && (
              <div className="fs-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <IconFileText size={24} color="#16a34a" style={{ marginRight: '0.75rem' }} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Generated Results</h3>
                </div>

                {reports.filter(r => r.status === 'Completed').length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {reports.filter(r => r.status === 'Completed').map((report) => (
                      <div key={`gen-${report.id}`} className="notification-item" style={{ flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', borderLeft: '4px solid #16a34a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>Lab Result #{report.id}</span>
                          <span className="status-badge Completed" style={{ background: '#dcfce7', color: '#166534' }}>Ready</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                          <IconCalendar size={14} style={{ marginRight: 4 }} />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', width: '100%' }}>
                          <a href={report.file_path} target="_blank" rel="noopener noreferrer" className="book-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, textAlign: 'center', background: '#16a34a', color: 'white', border: 'none' }}>
                            <IconDownload size={16} style={{ marginRight: 6 }} /> Download PDF
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px' }}>
                    <IconFileText size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                    <p>No generated reports returned yet.</p>
                    <p style={{ fontSize: '0.85rem' }}>Once your tests are completed by the lab, the results will appear here.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}




      {/* Full Screen Profile Section */}
      {/* Full Screen Profile Section */}
      {showProfileModal && (
        <div className="fullscreen-section">
          {/* Header Removed */}
          <div className="fullscreen-content">
            <div className="fs-split-layout">
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
                  <button className="book-btn" style={{ marginTop: '2rem', width: '100%', borderColor: '#ef4444', color: '#ef4444', background: 'transparent' }} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>

              <div className="fs-main-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-main)' }}>My Profile</h3>
                  {!isEditingProfile && (
                    <button className="book-btn" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsEditingProfile(true)}>
                      <IconUser size={16} /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="fs-form-grid">
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Full Name</label>
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#64748b' }}>Email Address</label>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{userProfile?.email || 'No Email'}</div>
                  </div>

                  {/* Editable Fields */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Age</label>
                    {isEditingProfile ? (
                      <input className="fs-input" type="number" placeholder="Eg. 28" value={patientDetails.age} onChange={e => setPatientDetails({ ...patientDetails, age: e.target.value })} />
                    ) : (
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{patientDetails.age || '--'}</div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Gender</label>
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Blood Group</label>
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
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Contact Number</label>
                    {isEditingProfile ? (
                      <input className="fs-input" type="tel" placeholder="+91 9876543210" value={patientDetails.contact} onChange={e => setPatientDetails({ ...patientDetails, contact: e.target.value })} />
                    ) : (
                      <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{patientDetails.contact || '--'}</div>
                    )}
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: isEditingProfile ? 'var(--primary)' : '#64748b' }}>Home Address</label>
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
                    <button className="location-submit-btn" style={{ width: 'auto', padding: '0.8rem 2rem' }} onClick={() => {
                      // Mock Save
                      setIsEditingProfile(false);
                      alert('Profile Updated Successfully!');
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

      {/* Full Screen Notifications Section */}
      {showNotifications && (
        <div className="fullscreen-section">
          {/* Header Removed */}
          <div className="fullscreen-content">
            {notifications.map(n => (
              <div key={n.id} className="notification-item">
                <div style={{ background: '#e0f2fe', padding: '0.8rem', borderRadius: '50%', height: 'fit-content' }}>
                  <IconBell size={20} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '1.1rem' }}>{n.text}</p>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Screen Reminders Section */}
      {showReminders && (
        <div className="fullscreen-section">
          {/* Header Removed */}
          <div className="fullscreen-content">
            {reminders.map(r => (
              <div key={r.id} className="notification-item" style={{ borderLeftColor: '#f59e0b' }}>
                <div style={{ background: '#fffbeb', padding: '0.8rem', borderRadius: '50%', height: 'fit-content' }}>
                  <IconClock size={20} color="#d97706" />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '1.1rem' }}>{r.text}</p>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Screen My Bookings Section */}
      {showMyBookingsModal && (
        <div className="fullscreen-section">
          {/* Header Removed */}
          <div className="fullscreen-content">
            {bookings.length > 0 ? (
              <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                {bookings.map(b => (
                  <div key={b.id} className="booking-ticket">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: 'var(--primary-dark)' }}>{b.labName}</h3>
                      <span className="status-badge Completed" style={{ background: '#dcfce7', color: '#166534' }}>{b.status}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                      <div>
                        <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem' }}>Date</span>
                        <strong>{b.date}</strong>
                      </div>
                      <div>
                        <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem' }}>Time</span>
                        <strong>{b.time}</strong>
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem' }}>Tests</span>
                        <strong>{b.tests.join(', ')}</strong>
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <span style={{ display: 'block', color: '#64748b', fontSize: '0.8rem' }}>Location</span>
                        {b.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                <IconCalendar size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <p>No confirmed bookings yet.</p>
              </div>
            )}
          </div>
        </div>
      )
      }

      {/* 2. Hero Section */}
      <section className="hero-section" style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="hero-content">
          <h1>Find Best Laboratories Near You</h1>
          <p>Don't wait in lines. Book your tests now and get results faster than ever.</p>
        </div>
      </section>

      {/* 3. Filters & Labs List */}
      <main className="main-content" ref={labsSectionRef}>
        <div className="section-header-card">
          <h2>Featured Laboratories</h2>
          <div className="header-actions">
            <div className="section-search-bar">
              <IconSearch size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search labs, tests or location..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // If the current search term DOES match existing labs in the view, 
                    // we might NOT want to re-trigger a location search if the user is just filtering.
                    // However, if the list is empty, or they explicitly want to switch location, they hit Enter.
                    // We will attempt location search.
                    handleSearchSubmit(e);
                  }
                }}
              />
            </div>

            <div className="filter-chips">
              {['All Labs', 'Nearby', 'Top Rated', 'Low Cost'].map(filter => (
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
                <div style={{ display: 'flex', gap: '4px', color: '#f59e0b', marginBottom: '1rem' }}>
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
    </div >
  );
};

export default LandingPage;
