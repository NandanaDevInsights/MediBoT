import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import './SuperAdminDashboard.css';
import logoImage from '../assets/Logo.png';
import {
    getSuperAdminStats,
    getSuperAdminLabs,
    getSuperAdminBookings,
    getSuperAdminUsers,
    getSuperAdminChartData,
    getSuperAdminNotifications
} from '../services/api';

// --- Icon System (SVG Components) ---
const Icon = {
    Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Labs: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Bookings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    Tests: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
    Revenue: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Alerts: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Filter: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    More: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>,
    ArrowUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
    ArrowDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
    Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
};

const MapComponent = ({ center, zoom, labs }) => {
    const mapRef = React.useRef(null);
    const mapInstance = React.useRef(null);
    const markersRef = React.useRef([]);

    React.useEffect(() => {
        const loadLeaflet = () => {
            if (!window.L) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);

                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;
                script.onload = () => initMap();
                document.head.appendChild(script);
            } else {
                initMap();
            }
        };

        const initMap = () => {
            if (!mapRef.current) return;

            const L = window.L;
            if (mapInstance.current) {
                mapInstance.current.setView(center, zoom);
                return;
            }

            mapInstance.current = L.map(mapRef.current).setView(center, zoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstance.current);
        };

        loadLeaflet();
    }, [center, zoom]);

    React.useEffect(() => {
        if (window.L && mapInstance.current && labs) {
            const L = window.L;
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];

            labs.forEach(lab => {
                // Try to guess coords if missing, or just skip. 
                // For now we skip as geocoding all lab locations is heavy.
                if (lab.lat && lab.lon) {
                    const marker = L.marker([lab.lat, lab.lon]).addTo(mapInstance.current)
                        .bindPopup(`<b>${lab.name}</b><br>${lab.location}`);
                    markersRef.current.push(marker);
                }
            });
        }
    }, [labs]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px', zIndex: 1, minHeight: '300px' }} />;
};

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [selectedLab, setSelectedLab] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('All Locations');
    const [notifications, setNotifications] = useState([]);
    const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Default Bangalore
    const [mapZoom, setMapZoom] = useState(11);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [allBackendLabs, setAllBackendLabs] = useState([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('All Roles');
    const [bookingSearchQuery, setBookingSearchQuery] = useState('');
    const [bookingLocationFilter, setBookingLocationFilter] = useState('All Locations');
    const [bookingLabFilter, setBookingLabFilter] = useState('All Labs');
    const [bookingOsmLabsList, setBookingOsmLabsList] = useState([]);
    const [isBookingLabsLoading, setIsBookingLabsLoading] = useState(false);

    // New states for Test & Categorization Management
    const [testCategoryFilter, setTestCategoryFilter] = useState('All Categories');
    const [testSearchQuery, setTestSearchQuery] = useState('');
    const [editingTest, setEditingTest] = useState(null);
    const [viewingTest, setViewingTest] = useState(null);
    const [viewingBooking, setViewingBooking] = useState(null);

    const [allTestsData, setAllTestsData] = useState([
        { id: 1, name: 'Complete Blood Count (CBC)', cat: 'Blood Tests', price: '₹300', meta: 'Popular', status: 'Active' },
        { id: 2, name: 'Urine Routine Examination', cat: 'Urine Tests', price: '₹150', meta: 'Essential', status: 'Active' },
        { id: 3, name: 'Sputum AFB (ZN Stain)', cat: 'Sputum Tests', price: '₹200', meta: 'Specialized', status: 'Active' },
        { id: 4, name: 'Stool Routine Examination', cat: 'Stool Tests', price: '₹180', meta: 'Common', status: 'Active' },
        { id: 5, name: 'Lipid Profile', cat: 'Blood Tests', price: '₹600', meta: 'High Demand', status: 'Active' },
        { id: 6, name: 'HbA1c', cat: 'Blood Tests', price: '₹400', meta: 'Diabetes', status: 'Active' },
        { id: 7, name: 'Pregnancy Test (hCG)', cat: 'Urine Tests', price: '₹250', meta: 'Screening', status: 'Active' },
    ]);

    const [revenueLocationFilter, setRevenueLocationFilter] = useState('All Locations');
    const [activeUserDropdown, setActiveUserDropdown] = useState(null);

    // --- Global Click Listener to Close Menus ---
    useEffect(() => {
        const handleClickOutside = () => setActiveUserDropdown(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // --- Dynamic System State (Settings & Logs) ---
    const [notificationsListData, setNotificationsListData] = useState([
        { id: 1, title: 'New Lab Registration', desc: 'Apex Diagnostics submitted a request.', time: '10 mins ago', type: 'info' },
        { id: 2, title: 'Payment Failed', desc: 'Transaction #TX99281 failed for user Rahul.', time: '1 hour ago', type: 'error' },
        { id: 3, title: 'Revenue Target Hit', desc: 'Monthly revenue crossed ₹4L target!', time: '5 hours ago', type: 'success' },
        { id: 4, title: 'Service Interruption', desc: 'Scheduled maintenance for API nodes tomorrow at 02:00 AM.', time: '8 hours ago', type: 'warning' },
    ]);

    const [activityTimelineData, setActivityTimelineData] = useState([
        { id: 1, event: 'Lab Approval', icon: '🏛️', time: 'Just now', desc: 'Apex Diagnostics registration approved by system.' },
        { id: 2, event: 'High Revenue', icon: '📈', time: '2 hours ago', desc: 'Platform reached daily revenue milestone of 50k.' },
        { id: 3, event: 'System Alert', icon: '⚠️', time: '4 hours ago', desc: 'Payment gateway latency detected in South region.' },
        { id: 4, event: 'New Test', icon: '🧪', time: 'Yesterday', desc: '"Neuro-Marker Gamma" added to global test catalog.' },
        { id: 5, event: 'Data Sync', icon: '🔄', time: 'Yesterday', desc: 'OSM data synchronization completed for 45 active nodes.' },
    ]);

    const [platformSettings, setPlatformSettings] = useState({
        name: 'MediBot Laboratory Portal',
        email: 'admin@medibot.pro',
        currency: 'INR (₹)',
        maintenance: false,
        commission: 15,
        tax: 18,
        settlement: 'T + 2 Days (Typical)'
    });

    const [superAdminData, setSuperAdminData] = useState({
        name: 'Super Admin',
        role: 'Platform Owner & System Architect',
        email: 'medibot.care@gmail.com',
        since: 'January 2024',
        lastLogin: 'Today, 09:42 AM',
        accessLevel: 'Level 10 (Root Account)',
        securityStatus: 'Encrypted & 2FA Active'
    });

    const [isEditingProfile, setIsEditingProfile] = useState(false);


    const fetchOsmLabs = async (lat, lon, locationName = "Laboratory") => {
        const query = `
          [out:json][timeout:25];
          (
            node["healthcare"="laboratory"](around:10000,${lat},${lon});
            way["healthcare"="laboratory"](around:10000,${lat},${lon});
            relation["healthcare"="laboratory"](around:10000,${lat},${lon});
            node["amenity"="laboratory"](around:10000,${lat},${lon});
            way["amenity"="laboratory"](around:10000,${lat},${lon});
            relation["amenity"="laboratory"](around:10000,${lat},${lon});
          );
          out center;
        `;
        const encodedQuery = encodeURIComponent(query.replace(/\s+/g, ' ').trim());
        try {
            const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodedQuery}`);
            if (res.ok) {
                const data = await res.json();
                if (data.elements) {
                    const mappedLabs = data.elements
                        .filter(el => el.tags && (el.tags.name || el.tags.operator))
                        .map((el, i) => {
                            const lLat = el.lat || (el.center && el.center.lat);
                            const lLon = el.lon || (el.center && el.center.lon);
                            const name = el.tags.name || el.tags.operator;

                            // Check if we have this lab in our backend data
                            const backendLab = allBackendLabs.find(b => b.name.toLowerCase() === name.toLowerCase());

                            if (backendLab) {
                                return { ...backendLab, lat: lLat, lon: lLon };
                            }

                            return {
                                id: `osm-${el.id}`,
                                name: name,
                                location: el.tags['addr:district'] || el.tags['addr:city'] || locationName,
                                bookings: Math.floor(Math.random() * 50),
                                active: Math.floor(Math.random() * 20),
                                completed: Math.floor(Math.random() * 30),
                                pending: Math.floor(Math.random() * 10),
                                revenue: `₹${Math.floor(Math.random() * 50000)}`,
                                status: 'Open',
                                lat: lLat,
                                lon: lLon,
                                openingHours: el.tags.opening_hours || "09:00 AM - 07:00 PM",
                                phone: el.tags.phone || el.tags['contact:phone'] || "+91 98765 43210",
                                tests: ['Blood Test', 'Pathology']
                            };
                        });
                    setLabsList(mappedLabs);
                }
            }
        } catch (err) {
            console.error("OSM Fetch Error:", err);
        }
    };

    const handleLocationSearch = async (specificLocation = null) => {
        const targetLoc = specificLocation || locationFilter;
        if (!targetLoc || targetLoc === 'All Locations' || targetLoc.trim() === '') {
            setLabsList(allBackendLabs);
            setMapCenter([12.9716, 77.5946]);
            setMapZoom(11);
            return;
        }

        setIsGeocoding(true);
        const inputLower = targetLoc.toLowerCase();

        // Kanjirapally Demo Fallback
        if (inputLower.includes('kanjirapally') || inputLower.includes('kanjirappally') || inputLower.includes('kply')) {
            const coords = { lat: 9.5586, lon: 76.7915 };
            setMapCenter([coords.lat, coords.lon]);
            setMapZoom(13);

            // Core hardcoded data matching LandingPage.jsx
            const kLabsData = [
                { name: "Scanron Diagnostics", location: "Kanjirappally, Kottayam", desc: "Laboratory, Medical Laboratory, Clinical Laboratory, ECG Clinic", time: "08:30 PM", rating: "New", testPrice: 450 },
                { name: "Sri Diagnostics Pvt (Ltd)", location: "Kanjirappally, Kottayam", desc: "Clinical and Medical Laboratory, Pathology Lab, Blood, Urine, Sputum", time: "06:30 PM", rating: "New", testPrice: 500 },
                { name: "DDRC SRLl Diagnostic Center", location: "Kanjirappally, Kottayam", desc: "Diagnostic center and Laboratory", time: "24 Hours", rating: 5.0, testPrice: 600 },
                { name: "Amala Laboratary", location: "Kanjirappally, Kottayam", desc: "Clinical and Medical Laboratory, Blood, Urine, Sputum, Stool", time: "04:30 PM", rating: "New", testPrice: 400 },
                { name: "Dianova", location: "Kanjirappally, Kottayam", desc: "Clinical and Medical Laboratory, Blood, Urine, Sputum, Stool", time: "06:30 PM", rating: "New", testPrice: 550 },
                { name: "Royal Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Clinical laboratory and other clinical tests", time: "07:00 PM", rating: "New", testPrice: 480 },
                { name: "Marymatha Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Clinical Testing of All Specimens, Blood, Urine, Stool, Body Fluids", time: "05:30 PM", rating: "New", testPrice: 420 },
                { name: "Dianova Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Clinical Laboratory", time: "24 Hours", rating: "New", testPrice: 500 },
                { name: "ClinoTech Laboratories", location: "Kanjirappally, Kottayam", desc: "Diagnostic Laboratory", time: "08:00 PM", rating: 5.0, testPrice: 650 },
                { name: "Usha Clinic", location: "Kanjirappally, Kottayam", desc: "Clinical Laboratory, Medical Laboratory", time: "07:00 PM", rating: 4.0, testPrice: 350 }
            ];

            const mappedKLabs = kLabsData.map((lab, i) => {
                const lLat = coords.lat + (((i % 4) - 1.5) * 0.005);
                const lLon = coords.lon + ((Math.floor(i / 4) - 1) * 0.005);
                return {
                    id: 8000 + i,
                    name: lab.name,
                    location: lab.location,
                    lat: lLat,
                    lon: lLon,
                    bookings: Math.floor(Math.random() * 50) + 10,
                    active: Math.floor(Math.random() * 8) + 2,
                    completed: Math.floor(Math.random() * 30) + 5,
                    pending: Math.floor(Math.random() * 5),
                    revenue: `₹${(Math.floor(Math.random() * 20) + 10) * 1000}`,
                    status: 'Open',
                    openingHours: lab.time.includes("24") ? "Open 24 Hours" : `08:00 AM - ${lab.time}`,
                    phone: "+91 99000 88000",
                    tests: lab.desc.split(',').map(s => s.trim())
                };
            });

            setLabsList(mappedKLabs);
            setIsGeocoding(false);
            return;
        }

        // Kochi/Ernakulam Demo Fallback
        if (inputLower.includes('kochi') || inputLower.includes('ernakulam')) {
            const coords = { lat: 9.9312, lon: 76.2673 };
            setMapCenter([coords.lat, coords.lon]);
            setMapZoom(12);

            const kochiLabsData = [
                { name: "Lisie Hospital Laboratory", location: "Kochi, Ernakulam", desc: "Advanced Diagnostics, Pathology, Hematology", time: "24 Hours", rating: 4.8, testPrice: 850 },
                { name: "Medical Trust Laboratory", location: "Kochi, Ernakulam", desc: "Clinical Biochemistry, Microbiology", time: "24 Hours", rating: 4.7, testPrice: 700 },
                { name: "Aster Medcity Diagnostics", location: "Cheranallur, Kochi", desc: "Precision Medicine, Genetic Testing", time: "24 Hours", rating: 4.9, testPrice: 1200 },
                { name: "Amrita Institute Laboratory", location: "Edappally, Kochi", desc: "Super-specialty Lab Services", time: "24 Hours", rating: 4.8, testPrice: 950 },
                { name: "Rajagiri Hospital Diagnostics", location: "Aluva, Kochi", desc: "Comprehensive Health Checkups", time: "24 Hours", rating: 4.7, testPrice: 600 },
                { name: "VPS Lakeshore Laboratory", location: "Nettoor, Kochi", desc: "Clinical and Molecular Pathology", time: "24 Hours", rating: 4.6, testPrice: 800 },
                { name: "Apollo Adlux Diagnostics", location: "Angamaly, Kochi", desc: "Advanced Imaging and Blood tests", time: "24 Hours", rating: 4.8, testPrice: 1100 },
                { name: "Renai Medicity Lab", location: "Palarivattom, Kochi", desc: "Modern Diagnostic Center", time: "24 Hours", rating: 4.7, testPrice: 550 },
                { name: "Sunrise Hospital Lab", location: "Kakkanad, Kochi", desc: "Specialized Laboratory Services", time: "08:00 PM", rating: 4.5, testPrice: 450 },
                { name: "Kindred Diagnostics", location: "Vytila, Kochi", desc: "Laboratory and Radio-imaging", time: "09:00 PM", rating: 4.4, testPrice: 500 }
            ];

            const mappedKochiLabs = kochiLabsData.map((lab, i) => {
                const lLat = coords.lat + (((i % 4) - 1.5) * 0.012);
                const lLon = coords.lon + ((Math.floor(i / 4) - 1) * 0.012);
                return {
                    id: 9000 + i,
                    name: lab.name,
                    location: lab.location,
                    lat: lLat,
                    lon: lLon,
                    bookings: Math.floor(Math.random() * 150) + 50,
                    active: Math.floor(Math.random() * 20) + 10,
                    completed: Math.floor(Math.random() * 100) + 30,
                    pending: Math.floor(Math.random() * 15),
                    revenue: `₹${(Math.floor(Math.random() * 100) + 50) * 1000}`,
                    status: 'Open',
                    openingHours: lab.time,
                    phone: "+91 91234 56789",
                    tests: lab.desc.split(',').map(s => s.trim())
                };
            });

            setLabsList(mappedKochiLabs);
            setIsGeocoding(false);
            return;
        }

        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(targetLoc)}`);
            const data = await resp.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLat = parseFloat(lat);
                const newLon = parseFloat(lon);
                setMapCenter([newLat, newLon]);
                setMapZoom(13);
                await fetchOsmLabs(newLat, newLon, targetLoc);
            }
        } catch (err) {
            console.error("Geocoding error:", err);
        } finally {
            setIsGeocoding(false);
        }
    };

    useEffect(() => {
        if (!bookingLocationFilter || bookingLocationFilter === 'All Locations') {
            setBookingOsmLabsList([]);
            return;
        }

        const fetchOsmForBookings = async () => {
            setIsBookingLabsLoading(true);
            const inputLower = bookingLocationFilter.toLowerCase();
            let coords = null;
            let mockLabs = [];

            // Kanjirapally Demo Fallback
            if (inputLower.includes('kanjirapally') || inputLower.includes('kanjirappally') || inputLower.includes('kply')) {
                coords = { lat: 9.5586, lon: 76.7915 };
                mockLabs = ["Scanron Diagnostics", "Sri Diagnostics Pvt (Ltd)", "DDRC SRLl Diagnostic Center", "Amala Laboratary", "Dianova", "Royal Clinical Laboratory", "Marymatha Clinical Laboratory", "Dianova Clinical Laboratory", "ClinoTech Laboratories", "Usha Clinic"];
            }

            try {
                if (!coords) {
                    const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(bookingLocationFilter)}`);
                    const data = await resp.json();
                    if (data && data.length > 0) {
                        coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                    }
                }

                if (coords) {
                    const query = `
                      [out:json][timeout:25];
                      (
                        node["healthcare"="laboratory"](around:10000,${coords.lat},${coords.lon});
                        way["healthcare"="laboratory"](around:10000,${coords.lat},${coords.lon});
                        node["amenity"="laboratory"](around:10000,${coords.lat},${coords.lon});
                        way["amenity"="laboratory"](around:10000,${coords.lat},${coords.lon});
                      );
                      out center;
                    `;
                    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                    if (res.ok) {
                        const osmData = await res.json();
                        const osmNames = osmData.elements
                            .filter(el => el.tags && (el.tags.name || el.tags.operator))
                            .map(el => el.tags.name || el.tags.operator);
                        mockLabs = Array.from(new Set([...mockLabs, ...osmNames]));
                    }
                }

                const backendMatch = allBackendLabs
                    .filter(l => (l.location || '').toLowerCase().includes(inputLower) || (l.name || '').toLowerCase().includes(inputLower))
                    .map(l => l.name);

                setBookingOsmLabsList(Array.from(new Set([...mockLabs, ...backendMatch])).sort());
            } catch (err) {
                console.error("Booking OSM Error:", err);
            } finally {
                setIsBookingLabsLoading(false);
            }
        };

        fetchOsmForBookings();
    }, [bookingLocationFilter, allBackendLabs]);

    const downloadCSV = (data, filename) => {
        if (!data || data.length === 0) return;

        // Filter out complex objects or map them to strings
        const processValue = (val) => {
            if (val === null || val === undefined) return '';
            if (typeof val === 'object') return JSON.stringify(val).replace(/"/g, '""');
            return String(val).replace(/"/g, '""');
        };

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row =>
            Object.values(row).map(val => `"${processValue(val)}"`).join(',')
        ).join('\n');

        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Real Data State ---
    const [dashboardStats, setDashboardStats] = useState(null);
    const [labsList, setLabsList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [chartDataReal, setChartDataReal] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Mock Data (Fallbacks) ---
    const stats_fallback = [
        { label: 'Total Bookings', value: '12,845', trend: '+12.5%', icon: <Icon.Bookings />, color: '#0ea5e9' },
        { label: 'Active Laboratories', value: '42', trend: '+2', icon: <Icon.Labs />, color: '#10b981' },
        { label: 'Total Revenue', value: '₹4.58L', trend: '+8.2%', icon: <Icon.Revenue />, color: '#f59e0b' },
        { label: 'Tests Conducted Today', value: '245', trend: '+15.3%', icon: <Icon.Tests />, color: '#3b82f6' },
        { label: 'Pending Reports', value: '18', trend: '-5', icon: <Icon.Alerts />, color: '#ef4444' },
        { label: 'New Users', value: '+1,240', trend: '+18.1%', icon: <Icon.Users />, color: '#8b5cf6' },
    ];

    const fetchData = async () => {
        setLoading(true);
        // Helper to fetch and return empty array/null on fail
        const safeFetch = async (fn, fallback = []) => {
            try { return await fn(); } catch (e) { console.error("Fetch failed:", e); return fallback; }
        };

        try {
            const [statsRes, labsRes, bookingsRes, usersRes, chartRes, notifRes] = await Promise.all([
                safeFetch(getSuperAdminStats, null),
                safeFetch(getSuperAdminLabs, []),
                safeFetch(getSuperAdminBookings, []),
                safeFetch(getSuperAdminUsers, []),
                safeFetch(getSuperAdminChartData, []),
                safeFetch(getSuperAdminNotifications, [])
            ]);

            setDashboardStats(statsRes);
            setLabsList(labsRes);
            setAllBackendLabs(labsRes);
            setBookingsList(Array.isArray(bookingsRes) ? bookingsRes : []);
            setUsersList(usersRes);
            setChartDataReal(chartRes);

            // Populate Real-time Notifications
            if (Array.isArray(notifRes) && notifRes.length > 0) {
                const mappedNotifs = notifRes.map(n => ({
                    id: n.id,
                    title: n.title,
                    desc: n.description,
                    time: new Date(n.created_at).toLocaleString(),
                    type: n.type || 'info',
                    icon: n.icon || '🔔'
                }));
                setNotificationsListData(mappedNotifs);

                // Also update the Global Event Log in sidebar
                setActivityTimelineData(mappedNotifs.map(n => ({
                    id: n.id,
                    event: n.title,
                    icon: n.icon || '🔔',
                    time: n.time,
                    desc: n.desc
                })));
            }
        } catch (err) {
            console.error("Critical Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Auto-refresh notifications for Super Admin every 30 seconds
        const pollInterval = setInterval(() => {
            getSuperAdminNotifications()
                .then(res => {
                    if (Array.isArray(res) && res.length > 0) {
                        const mapped = res.map(n => ({
                            id: n.id,
                            title: n.title,
                            desc: n.description,
                            time: new Date(n.created_at).toLocaleString(),
                            type: n.type || 'info',
                            icon: n.icon || '📅'
                        }));
                        setNotificationsListData(mapped);
                        setActivityTimelineData(mapped.map(n => ({
                            id: n.id,
                            event: n.title,
                            icon: n.icon || '🔔',
                            time: n.time,
                            desc: n.desc
                        })));
                    }
                })
                .catch(err => console.error("Notification Polling Error:", err));
        }, 30000);

        return () => clearInterval(pollInterval);
    }, []);

    // Re-fetch bookings when switching to bookings tab to ensure fresh data
    useEffect(() => {
        if (activeTab === 'bookings') {
            getSuperAdminBookings().then(res => {
                setBookingsList(Array.isArray(res) ? res : []);
            }).catch(err => {
                console.error("Bookings Refresh Error:", err);
                setBookingsList([]);
            });
        }
    }, [activeTab]);

    // Derived stats for display
    const stats = useMemo(() => {
        if (!dashboardStats) return stats_fallback;
        return [
            { label: 'Total Bookings', value: (dashboardStats.total_bookings || 0).toLocaleString(), trend: '+0%', icon: <Icon.Bookings />, color: '#0ea5e9' },
            { label: 'Active Laboratories', value: (dashboardStats.active_labs || 0).toString(), trend: '+0', icon: <Icon.Labs />, color: '#10b981' },
            { label: 'Total Revenue', value: `₹${((dashboardStats.total_revenue || 0) / 100000).toFixed(2)}L`, trend: '+0%', icon: <Icon.Revenue />, color: '#f59e0b' },
            { label: 'Total Users', value: (dashboardStats.total_users || 0).toLocaleString(), trend: '+0%', icon: <Icon.Users />, color: '#8b5cf6' },
            { label: 'Pending Reports', value: (dashboardStats.pending_reports || 0).toString(), trend: '0', icon: <Icon.Alerts />, color: '#ef4444' },
            { label: 'Conduct. Today', value: (dashboardStats.conducted_today || 0).toString(), trend: '0', icon: <Icon.Tests />, color: '#3b82f6' },
        ];
    }, [dashboardStats]);

    const labPerformance = useMemo(() => labsList.length > 0 ? labsList : [], [labsList]);
    const chartData = useMemo(() => chartDataReal.length > 0 ? chartDataReal : [
        { name: 'Mon', bookings: 0, revenue: 0 },
        { name: 'Tue', bookings: 0, revenue: 0 },
        { name: 'Wed', bookings: 0, revenue: 0 },
        { name: 'Thu', bookings: 0, revenue: 0 },
        { name: 'Fri', bookings: 0, revenue: 0 },
        { name: 'Sat', bookings: 0, revenue: 0 },
        { name: 'Sun', bookings: 0, revenue: 0 },
    ], [chartDataReal]);

    // Derived chart data for the selected lab
    const labChartData = useMemo(() => {
        if (!selectedLab) return [];

        // Initialize last 7 days with 0s
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                dateStr: d.toISOString().split('T')[0],
                bookings: 0
            });
        }

        // Count bookings for this specifically selected lab
        // Important: Matching by lab name as ID might differ in structure
        bookingsList.forEach(b => {
            if (b.lab === selectedLab.name && b.date) {
                // b.date is "YYYY-MM-DD ..." or ISO
                const bDatePart = b.date.split(' ')[0];
                const match = days.find(d => d.dateStr === bDatePart);
                if (match) {
                    match.bookings++;
                }
            }
        });

        return days;
    }, [selectedLab, bookingsList]);

    const labTests = useMemo(() => {
        if (!selectedLab) return [];
        if (!selectedLab.tests_config) return ['General Health Checkup', 'Blood Sugar Test', 'Cholesterol Test', 'Liver Function Test'];
        try {
            const parsed = JSON.parse(selectedLab.tests_config);
            if (Array.isArray(parsed)) return parsed.map(t => t.name || t.test_name || t);
            if (typeof parsed === 'object') return Object.keys(parsed);
            return selectedLab.tests_config.split(',').map(t => t.trim());
        } catch (e) {
            return selectedLab.tests_config.split(',').map(t => t.trim());
        }
    }, [selectedLab]);

    const filteredBookings = useMemo(() => {
        const list = Array.isArray(bookingsList) ? bookingsList : [];
        const search = (bookingSearchQuery || '').trim().toLowerCase();

        return list.filter(b => {
            // 1. Search Match (Patient Name or ID)
            const patient = (b.patient || '').trim().toLowerCase();
            const bIdStr = (b.id || '').toString();
            return search === '' || patient.includes(search) || bIdStr.includes(search);
        });
    }, [bookingsList, bookingSearchQuery]);

    // Aggregate ALL tests from ALL labs for a comprehensive platform view
    const aggregatedTests = useMemo(() => {
        const tests = [];

        // 1. Initial global standards (Standards Registry)
        allTestsData.forEach(t => tests.push({ ...t, source: 'Global Registry', meta: 'Platform Standard' }));

        const guessCategory = (testName) => {
            const name = testName.toLowerCase();
            if (name.includes('blood') || name.includes('cbc') || name.includes('hemoglobin') || name.includes('lipid') || name.includes('sugar') || name.includes('glucose') || name.includes('hba1c') || name.includes('thyroid') || name.includes('liver') || name.includes('plasma') || name.includes('serum')) return 'Blood Tests';
            if (name.includes('urine')) return 'Urine Tests';
            if (name.includes('sputum')) return 'Sputum Tests';
            if (name.includes('stool')) return 'Stool Tests';
            if (name.includes('scan') || name.includes('mri') || name.includes('ct') || name.includes('ultrasound') || name.includes('usg') || name.includes('doppler')) return 'Scanning';
            if (name.includes('x-ray') || name.includes('xray') || name.includes('radiography')) return 'X-ray';
            if (name.includes('ecg') || name.includes('electro') || name.includes('echo') || name.includes('tmt') || name.includes('holter')) return 'ECG';
            if (name.includes('pathology') || name.includes('biopsy') || name.includes('cytology')) return 'Pathology';
            return 'General Diagnostics';
        };

        const allPlatformLabs = Array.from(new Set([...allBackendLabs, ...labsList]));

        // 2. Scan every lab's landing page configuration
        allPlatformLabs.forEach(lab => {
            if (!lab.tests_config) return;
            try {
                let labTestsArray = [];
                const parsed = JSON.parse(lab.tests_config);
                if (Array.isArray(parsed)) {
                    labTestsArray = parsed;
                } else if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                    labTestsArray = Object.entries(parsed).map(([name, price]) => ({ name, price }));
                }

                labTestsArray.forEach(lt => {
                    const name = lt.name || lt.test_name || (typeof lt === 'string' ? lt : '');
                    if (!name) return;
                    const registryMatch = allTestsData.find(rt => rt.name.toLowerCase() === name.toLowerCase());
                    tests.push({
                        id: `at-${lab.id || lab.name}-${name}-${Math.random()}`,
                        name: name,
                        cat: lt.category || lt.cat || (registryMatch ? registryMatch.cat : guessCategory(name)),
                        price: lt.price ? `₹${lt.price}` : 'Market Dynamic',
                        meta: `Exclusive via ${lab.name}`,
                        status: 'Active',
                        source: 'Lab Config'
                    });
                });
            } catch (e) {
                if (typeof lab.tests_config === 'string' && lab.tests_config.includes(',')) {
                    lab.tests_config.split(',').forEach(tStr => {
                        const name = tStr.trim();
                        if (!name) return;
                        const registryMatch = allTestsData.find(rt => rt.name.toLowerCase() === name.toLowerCase());
                        tests.push({
                            id: `ts-${lab.id}-${name}-${Math.random()}`,
                            name: name,
                            cat: registryMatch ? registryMatch.cat : guessCategory(name),
                            price: 'Regional Price',
                            meta: `Registered by ${lab.name}`,
                            status: 'Active',
                            source: 'Metadata String'
                        });
                    });
                }
            }

            // Priority 2: tests array (Common in mock/external data)
            if (Array.isArray(lab.tests)) {
                lab.tests.forEach(testName => {
                    const name = testName.trim();
                    if (!name) return;
                    const registryMatch = allTestsData.find(rt => rt.name.toLowerCase() === name.toLowerCase());
                    tests.push({
                        id: `m-${lab.id}-${name}-${Math.random()}`,
                        name: name,
                        cat: registryMatch ? registryMatch.cat : guessCategory(name),
                        price: 'Inquire',
                        meta: `Service at ${lab.name}`,
                        status: 'Active',
                        source: 'Lab Services'
                    });
                });
            }

            // Priority 3: desc parsing (Many landing pages list tests in description string)
            if (lab.desc && typeof lab.desc === 'string') {
                lab.desc.split(/[,|;]/).forEach(part => {
                    const name = part.trim();
                    if (name.length > 3 && name.length < 50 && !name.toLowerCase().includes('laboratory')) {
                        const registryMatch = allTestsData.find(rt => rt.name.toLowerCase() === name.toLowerCase());
                        tests.push({
                            id: `dp-${lab.id || lab.name}-${name}-${Math.random()}`,
                            name: name,
                            cat: registryMatch ? registryMatch.cat : guessCategory(name),
                            price: 'Profile Reference',
                            meta: `Extracted from ${lab.name} Profile`,
                            status: 'Active',
                            source: 'Metadata'
                        });
                    }
                });
            }
        });

        return tests;
    }, [allBackendLabs, allTestsData, labsList]);

    const availableCategories = useMemo(() => {
        const cats = new Set(['Blood Tests', 'Urine Tests', 'Sputum Tests', 'Stool Tests', 'Scanning', 'X-ray', 'ECG', 'Pathology']);
        aggregatedTests.forEach(t => { if (t.cat) cats.add(t.cat); });
        return Array.from(cats).sort();
    }, [aggregatedTests]);

    const filteredTests = useMemo(() => {
        return aggregatedTests.filter(t => {
            const searchLower = (testSearchQuery || '').toLowerCase();
            const matchesSearch = searchLower === '' ||
                (t.name || '').toLowerCase().includes(searchLower) ||
                (t.meta || '').toLowerCase().includes(searchLower);
            const matchesCat = testCategoryFilter === 'All Categories' || t.cat === testCategoryFilter;
            return matchesSearch && matchesCat;
        });
    }, [aggregatedTests, testSearchQuery, testCategoryFilter]);

    const bookingLocations = useMemo(() => {
        const uniqueSet = new Set();

        // Define clean, standardized presets first
        const presets = [
            'Kanjirappally, Kottayam', 'Kochi', 'Thiruvananthapuram',
            'Thrissur', 'Kozhikode', 'Bangalore', 'Palai', 'Changanassery',
            'Mundakayam', 'Alappuzha', 'Kollam', 'Pathanamthitta', 'Idukki',
            'Malappuram', 'Wayanad', 'Kannur', 'Kasaragod'
        ];

        // Use a normalization map to avoid near-duplicates like different casing or spacing
        const normalizationMap = new Map();

        const addLocation = (loc) => {
            if (!loc || typeof loc !== 'string') return;
            const normalized = loc.trim().toLowerCase().replace(/\s+/g, ' ');
            if (!normalizationMap.has(normalized)) {
                normalizationMap.set(normalized, loc.trim());
            }
        };

        // Standardize presets
        presets.forEach(p => addLocation(p));

        // Add dynamic data locations (they will be merged if they match a preset)
        bookingsList.forEach(b => { if (b.location) addLocation(b.location); });
        allBackendLabs.forEach(l => { if (l.location) addLocation(l.location); });

        const finalLocations = Array.from(normalizationMap.values()).sort();
        return ['All Locations', ...finalLocations];
    }, [bookingsList, allBackendLabs]);

    const bookingLabs = useMemo(() => {
        if (bookingLocationFilter === 'All Locations') {
            const labs = new Set(bookingsList.map(b => b.lab).filter(Boolean));
            return ['All Labs', ...Array.from(labs).sort()];
        }

        const inputLower = bookingLocationFilter.toLowerCase();

        // Filter backend labs that match the selected location
        const matchedBackendLabs = allBackendLabs
            .filter(l => (l.location || '').toLowerCase().includes(inputLower))
            .map(l => l.name);

        // Also include labs that appear in the actual bookings data for this location
        const matchedDataLabs = bookingsList
            .filter(b => (b.location || '').toLowerCase().includes(inputLower))
            .map(b => b.lab)
            .filter(Boolean);

        if (isBookingLabsLoading && bookingOsmLabsList.length === 0) {
            return ['All Labs', 'Loading labs from OSM...', ...Array.from(new Set([...matchedBackendLabs, ...matchedDataLabs])).sort()];
        }

        const combined = new Set(['All Labs', ...matchedBackendLabs, ...matchedDataLabs, ...bookingOsmLabsList]);
        return Array.from(combined).sort((a, b) => {
            if (a === 'All Labs') return -1;
            if (b === 'All Labs') return 1;
            return a.localeCompare(b);
        });
    }, [bookingsList, bookingLocationFilter, bookingOsmLabsList, isBookingLabsLoading, allBackendLabs]);



    const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // --- Effects ---
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Security Check (Placeholder)
    useEffect(() => {
        const role = sessionStorage.getItem('auth_role');
        if (role !== 'SUPER_ADMIN') {
            // navigate('/admin/login?role=ADMIN');
        }
    }, [navigate]);

    // --- Tab Content Renders ---

    const renderOverview = () => (
        <div className="section-content">
            <div className="kpi-grid">
                {stats.map((stat, idx) => (
                    <div className="kpi-card" key={idx}>
                        <div className="kpi-header">
                            <div className="kpi-icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className={`kpi-trend ${stat.trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                                {stat.trend.startsWith('+') ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="kpi-label">{stat.label}</div>
                        <div className="kpi-value">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="dashboard-main-row">
                <div className="glass-card">
                    <div className="card-title">
                        <span>Booking & Revenue Performance</span>
                        <div className="filter-group">
                            <select className="styled-select" style={{ minWidth: '120px' }}>
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ minHeight: 'auto' }}>
                    <div className="card-title">Activity Timeline</div>
                    <div className="timeline" style={{ position: 'relative', paddingLeft: '20px' }}>
                        <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', background: 'var(--border-light)' }}></div>
                        {activityTimelineData.map((item, idx) => (
                            <div key={item.id} style={{ marginBottom: '24px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-18px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid #fff', boxShadow: '0 0 0 4px var(--primary-light)' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.event} {item.icon}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.time}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-ghost" style={{ width: '100%', borderTop: '1px solid var(--border-light)', borderRadius: 0, marginTop: '20px' }}>View Full Audit Trail</button>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header-controls">
                    <h3 className="card-title" style={{ margin: 0 }}>Recent Laboratory Activity</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" onClick={() => downloadCSV(labPerformance.slice(0, 10), 'recent_lab_activity.csv')}><Icon.Download /> Report</button>
                        <button className="btn btn-primary" onClick={() => setActiveTab('labs')}>View All Monitor</button>
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Lab Name</th>
                            <th>Location</th>
                            <th>Today Bookings</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labPerformance.slice(0, 4).map(lab => (
                            <tr key={lab.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{lab.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lab.id}</div>
                                </td>
                                <td>{lab.location}</td>
                                <td>{lab.bookings || 0}</td>
                                <td>
                                    <span className={`status-badge ${lab.status === 'Open' ? 'status-active' : 'status-closed'}`}>
                                        {lab.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-action-eye" onClick={() => { setSelectedLab(lab); setActiveTab('lab-detail'); }} title="View Lab Dossier">
                                        <Icon.Eye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLabs = () => (
        <div className="section-content">
            <div className="dashboard-main-row" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                <div className="table-container">
                    <div className="table-header-controls">
                        <div className="filter-group">
                            <div className="search-wrapper">
                                <i className="search-icon"><Icon.Search /></i>
                                <input
                                    type="text"
                                    className="styled-input"
                                    placeholder="Search labs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '250px', paddingLeft: '44px' }}
                                />
                            </div>
                            <div className="search-wrapper">
                                <i className="search-icon"><Icon.MapPin /></i>
                                <input
                                    type="text"
                                    className="styled-input"
                                    placeholder="Enter location to view on map..."
                                    value={locationFilter === 'All Locations' ? '' : locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                                    style={{ width: '250px', paddingLeft: '44px' }}
                                />
                                {isGeocoding && <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--primary)' }}>Geocoding...</span>}
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => downloadCSV(labPerformance, 'laboratories_monitoring_report.csv')}>
                            <Icon.Download /> Download Full Report
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Laboratory</th>
                                <th>Stats (A/C/P)</th>
                                <th>Revenue</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labPerformance.filter(l =>
                                (searchQuery === '' || l.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            ).map(lab => (
                                <tr key={lab.id}>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{lab.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{lab.location} • {lab.id}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>{lab.active}</span>/
                                            <span>{lab.completed}</span>/
                                            <span style={{ color: 'var(--danger)' }}>{lab.pending}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{lab.revenue}</td>
                                    <td>
                                        <span className={`status-badge ${lab.status === 'Open' ? 'status-active' : 'status-closed'}`}>
                                            {lab.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-action-eye" onClick={() => { setSelectedLab(lab); setActiveTab('lab-detail'); }} title="Open Detailed Report"><Icon.Eye /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '12px', alignSelf: 'flex-start', aspectRatio: '1/1', minHeight: '400px' }}>
                    <div className="card-title" style={{ padding: '12px' }}>Laboratory Location Map (OpenStreetMap)</div>
                    <div style={{ flex: 1, position: 'relative', background: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <MapComponent
                            center={mapCenter}
                            zoom={mapZoom}
                            labs={labPerformance.filter(l =>
                                (searchQuery === '' || l.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLabDetail = () => {
        if (!selectedLab) { setActiveTab('labs'); return null; }
        return (
            <div className="section-content">
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn btn-ghost" onClick={() => setActiveTab('labs')} style={{ paddingLeft: 0 }}>
                        ← Back to Laboratories
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn btn-primary" onClick={() => downloadCSV([selectedLab], `lab_details_${selectedLab.id}.csv`)}><Icon.Download /> Export Details</button>
                    </div>
                </div>

                <div className="dashboard-main-row" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                    <div className="glass-card" style={{ minHeight: 'auto', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 300%)' }}>
                        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                            <div style={{ width: '110px', height: '110px', borderRadius: '24px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-lg)' }}>
                                <Icon.Labs size={48} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h2 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>{selectedLab.name}</h2>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>LAB-SPECIFIC ID: {selectedLab.id}</div>
                                    </div>
                                    <span className={`status-badge ${selectedLab.status === 'Open' ? 'status-active' : 'status-closed'}`} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                        {selectedLab.status}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--text-body)', alignItems: 'center' }} title="Location District"><Icon.MapPin color="var(--primary)" /> {selectedLab.location}</div>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--text-body)', alignItems: 'center' }} title="Business Hours"><Icon.Clock color="var(--primary)" /> {selectedLab.openingHours || "08:00 - 20:00"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ minHeight: 'auto' }}>
                        <h3 className="card-title">Live Operational Analytics</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="lab-stat-box">
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Active Orders</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>{selectedLab.active}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>↑ 12% vs last week</div>
                            </div>
                            <div className="lab-stat-box">
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cumulative Revenue</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--success)', marginTop: '4px' }}>{selectedLab.revenue}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>Verified Settlement</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main-row">
                    <div className="glass-card">
                        <h3 className="card-title">Laboratory-Specific Booking Flux</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={labChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                        cursor={{ fill: 'var(--primary-light)', opacity: 0.4 }}
                                    />
                                    <Bar dataKey="bookings" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={35} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="glass-card">
                        <h3 className="card-title">Laboratory Documents</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { name: 'Medical License.pdf', size: '2.4 MB', type: 'PDF' },
                                { name: 'Safety Audit.pdf', size: '1.8 MB', type: 'PDF' },
                            ].map((doc, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{ padding: '8px', background: 'var(--bg-main)', borderRadius: '6px' }}>📄</div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doc.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size}</div>
                                        </div>
                                    </div>
                                    <button className="btn btn-ghost" style={{ padding: '4px' }}><Icon.Download /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ marginTop: '24px', minHeight: 'auto' }}>
                    <h3 className="card-title">Available Tests & Pricing Catalog</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                        {labTests.map((test, idx) => (
                            <div key={idx} style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: COLORS[idx % COLORS.length] }}></div>
                                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{test}</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Standard Rate</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>₹{499 + (idx * 75)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderBookings = () => (
        <div className="section-content">
            <div className="table-container">
                <div className="table-header-controls">
                    <div className="filter-group">
                        <div className="search-wrapper">
                            <i className="search-icon"><Icon.Search /></i>
                            <input
                                type="text"
                                className="styled-input"
                                placeholder="Search patient or ID..."
                                value={bookingSearchQuery}
                                onChange={(e) => setBookingSearchQuery(e.target.value)}
                                style={{ width: '250px', paddingLeft: '44px' }}
                            />
                        </div>
                        <div className="search-wrapper">
                            <i className="search-icon"><Icon.MapPin /></i>
                            <select
                                className="styled-select"
                                style={{ width: '220px', paddingLeft: '44px' }}
                                value={bookingLocationFilter}
                                onChange={(e) => {
                                    setBookingLocationFilter(e.target.value);
                                    setBookingLabFilter('All Labs');
                                }}
                            >
                                {bookingLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>
                        <div className="search-wrapper">
                            <i className="search-icon"><Icon.Labs /></i>
                            <select
                                className="styled-select"
                                style={{ width: '220px', paddingLeft: '44px' }}
                                value={bookingLabFilter}
                                onChange={(e) => setBookingLabFilter(e.target.value)}
                            >
                                {bookingLabs.map(lab => <option key={lab} value={lab}>{lab}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" onClick={() => fetchData()} title="Refresh Data">🔄</button>
                        <button className="btn btn-primary" onClick={() => downloadCSV(filteredBookings, 'bookings_catalog.csv')}>
                            <Icon.Download /> Export Bookings
                        </button>
                    </div>
                </div>

                {bookingLocationFilter !== 'All Locations' && bookingLabFilter !== 'All Labs' ? (
                    <div className="formatted-report">
                        <div style={{ margin: '32px 0 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-light)', paddingBottom: '12px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Clinical Appointments Registry</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                                    Verified laboratory interactions for <strong>{bookingLabFilter}</strong> in <strong>{bookingLocationFilter}</strong>
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem' }}>
                                    {filteredBookings.length} Active Records Found
                                </span>
                            </div>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Patient Identity</th>
                                    <th>Test / Protocol</th>
                                    <th>Clinical Partner</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? filteredBookings.map((b, i) => (
                                    <tr key={b.id || i}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                    {b.patient?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{b.patient || 'Guest User'}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {b.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{b.test}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.payment || 'PREPAID'}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{b.lab}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.location}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{b.date || 'TBD'}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.time || 'Flexible'}</div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${b.status?.toLowerCase() === 'completed' || b.status?.toLowerCase() === 'confirmed' ? 'status-active' :
                                                b.status?.toLowerCase() === 'pending' ? 'status-pending' :
                                                    b.status?.toLowerCase() === 'cancelled' ? 'status-closed' : 'status-neutral'
                                                }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                            <button
                                                className="btn-action-eye"
                                                onClick={() => setViewingBooking(b)}
                                                title="View Booking Details"
                                            >
                                                <Icon.Eye />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📁</div>
                                            <div>No patient bookings matches found for the selected criteria.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '120px 40px', textAlign: 'center', borderRadius: '40px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-main) 100%)', marginTop: '24px' }}>
                        <div style={{ width: '100px', height: '100px', background: 'var(--primary-soft)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px auto' }}>
                            <Icon.Bookings size={50} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '-0.5px' }}>Global Booking Command</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
                            Initialize the administrative interface by selecting a <strong>Geographic Region</strong> and a <strong>Laboratory Partner</strong>. You will then be able to audit clinical patient bookings via a formatted table report.
                        </p>
                    </div>
                )}
                {viewingBooking && (
                    <div className="modal-overlay" onClick={() => setViewingBooking(null)}>
                        <div className="glass-card" style={{ maxWidth: '650px', width: '95%', padding: '48px', position: 'relative', borderRadius: '32px' }} onClick={e => e.stopPropagation()}>
                            <button className="btn-close-modal" onClick={() => setViewingBooking(null)}>✕</button>
                            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '40px' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, boxShadow: 'var(--shadow-lg)' }}>
                                    {viewingBooking.patient?.charAt(0) || 'P'}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)', margin: 0 }}>{viewingBooking.patient}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>Administrative Booking ID: <strong>{viewingBooking.id}</strong></p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div className="detail-item">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Clinical Procedure</label>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary)' }}>{viewingBooking.test}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Laboratory Partner</label>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{viewingBooking.lab}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Geographic Region</label>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{viewingBooking.location}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scheduled Date</label>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{viewingBooking.date || 'To Be Confirmed'}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time Slot</label>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{viewingBooking.time || 'Flexible'}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Summary</label>
                                    <div style={{ fontWeight: 950, fontSize: '1.1rem', color: 'var(--success)' }}>{viewingBooking.payment || 'PAID'}</div>
                                </div>
                                <div className="detail-item">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Lifecycle</label>
                                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{viewingBooking.status}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '48px' }}>
                                <button className="btn btn-primary" style={{ flex: 1, height: '56px', borderRadius: '16px', fontSize: '1rem', fontWeight: 800 }} onClick={() => setViewingBooking(null)}>Done</button>
                                <button className="btn btn-outline" style={{ flex: 1, height: '56px', borderRadius: '16px', fontSize: '1rem', fontWeight: 800 }} onClick={() => alert('Printing booking summary...')}>Print Receipt</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );


    const renderNotifications = () => (
        <div className="section-content" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>

            <div className="notifications-main">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>System Alerts & Notifications</h2>
                    <button className="btn btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--danger)' }} onClick={() => setNotificationsListData([])}>Clear All</button>
                </div>
                {notificationsListData.length > 0 ? notificationsListData.map(n => (
                    <div key={n.id} className="glass-card" style={{ minHeight: 'auto', marginBottom: '16px', display: 'flex', gap: '20px', borderLeft: `4px solid ${n.type === 'error' ? 'var(--danger)' : n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`, padding: '24px' }}>
                        <div style={{ background: 'var(--bg-main)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            {n.type === 'error' ? '❌' : n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{n.title}</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{n.time}</span>
                            </div>
                            <p style={{ marginTop: '8px', color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: '1.5' }}>{n.desc}</p>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 800 }} onClick={() => setNotificationsListData(notificationsListData.filter(item => item.id !== n.id))}>Dismiss</button>
                                <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 800 }} onClick={() => alert(`Detailed system log for ${n.title} would be retrieved here.`)}>View Context</button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-main)', borderRadius: '24px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎐</div>
                        <p style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Inbox is clear. No active alerts.</p>
                    </div>
                )}
            </div>

            <div className="system-logs-sidebar">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '6px', background: 'var(--primary-soft)', borderRadius: '8px' }}><Icon.Clock size={16} color="var(--primary)" /></span>
                    Global Event Log
                </h3>
                <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
                    {activityTimelineData.map((log, idx) => (
                        <div key={log.id} style={{ display: 'flex', gap: '16px', paddingBottom: idx === activityTimelineData.length - 1 ? 0 : '24px', position: 'relative' }}>
                            {idx !== activityTimelineData.length - 1 && (
                                <div style={{ position: 'absolute', left: '16px', top: '32px', bottom: 0, width: '2px', background: 'var(--border-light)' }}></div>
                            )}
                            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, border: '1px solid var(--border-light)' }}>
                                {log.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{log.event}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>{log.time}</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>{log.desc}</p>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '24px', fontSize: '0.75rem', padding: '10px' }}>Download Full Log History</button>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => {
        const handleSettingsSave = () => {
            alert('Security confirmation: Platform settings have been encrypted and synchronized across all nodes.');
        };

        return (
            <div className="section-content">

                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>Platform Governance & Branding</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Configure global parameters for the MediBot decentralized laboratory network.</p>
                </div>

                <div className="dashboard-main-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 className="card-title" style={{ marginBottom: '24px' }}>General Environment</h3>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Platform Display Name</label>
                                <input
                                    className="styled-input"
                                    value={platformSettings.name}
                                    onChange={(e) => setPlatformSettings({ ...platformSettings, name: e.target.value })}
                                    style={{ padding: '12px 16px', borderRadius: '12px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Administrative Contact</label>
                                <input
                                    className="styled-input"
                                    value={platformSettings.email}
                                    onChange={(e) => setPlatformSettings({ ...platformSettings, email: e.target.value })}
                                    style={{ padding: '12px 16px', borderRadius: '12px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Operation Currency</label>
                                <select
                                    className="styled-select"
                                    value={platformSettings.currency}
                                    onChange={(e) => setPlatformSettings({ ...platformSettings, currency: e.target.value })}
                                    style={{ borderRadius: '12px' }}
                                >
                                    <option>INR (₹)</option>
                                    <option>USD ($)</option>
                                    <option>GBP (£)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Maintenance State</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: platformSettings.maintenance ? 'var(--danger-soft)' : 'var(--success-soft)',
                                        borderRadius: '12px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setPlatformSettings({ ...platformSettings, maintenance: !platformSettings.maintenance })}
                                >
                                    <div style={{ width: '40px', height: '20px', background: platformSettings.maintenance ? 'var(--danger)' : 'var(--success)', borderRadius: '20px', padding: '2px', position: 'relative' }}>
                                        <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', right: platformSettings.maintenance ? '2px' : '22px', transition: '0.2s' }}></div>
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: platformSettings.maintenance ? 'var(--danger)' : 'var(--success)' }}>
                                        {platformSettings.maintenance ? 'System Locked' : 'Online & Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px', padding: '24px', background: 'var(--bg-main)', borderRadius: '20px', border: '1px dashed var(--border-light)' }}>
                            <h4 style={{ fontWeight: 900, marginBottom: '16px' }}>Branding Guidelines</h4>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Identity Color (Primary)</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ width: '44px', height: '44px', background: '#0ea5e9', borderRadius: '10px', boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)' }}></div>
                                        <input className="styled-input" value="#0ea5e9" readOnly style={{ flex: 1, borderRadius: '10px' }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Typography Family</label>
                                    <select className="styled-select" style={{ borderRadius: '10px' }}><option>Plus Jakarta Sans</option></select>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ marginTop: '32px', width: '100%', height: '52px', fontWeight: 900, borderRadius: '16px' }} onClick={handleSettingsSave}>Synchronize All Platform Settings</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div className="glass-card" style={{ padding: '32px' }}>
                            <h3 className="card-title" style={{ marginBottom: '24px' }}>Fiscal Configuration</h3>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Platform Commission (%)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <input
                                        type="range"
                                        min="0" max="30"
                                        style={{ flex: 1 }}
                                        value={platformSettings.commission}
                                        onChange={(e) => setPlatformSettings({ ...platformSettings, commission: parseInt(e.target.value) })}
                                    />
                                    <span style={{ padding: '6px 14px', background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 900, borderRadius: '8px', minWidth: '60px', textAlign: 'center' }}>
                                        {platformSettings.commission}%
                                    </span>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Service Taxation (GST/VAT %)</label>
                                <input
                                    className="styled-input"
                                    type="number"
                                    value={platformSettings.tax}
                                    onChange={(e) => setPlatformSettings({ ...platformSettings, tax: parseInt(e.target.value) })}
                                    style={{ padding: '12px 16px', borderRadius: '12px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Settlement Frequency</label>
                                <select
                                    className="styled-select"
                                    value={platformSettings.settlement}
                                    onChange={(e) => setPlatformSettings({ ...platformSettings, settlement: e.target.value })}
                                    style={{ borderRadius: '12px' }}
                                >
                                    <option>T + 1 Days (Fast Track)</option>
                                    <option>T + 2 Days (Typical)</option>
                                    <option>Weekly Settlement</option>
                                    <option>Monthly Settlement</option>
                                </select>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '32px', background: 'var(--primary)', color: '#fff', border: 'none' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '12px' }}>Operational Backup</h3>
                            <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '24px' }}>Download an encrypted snapshot of the current global configuration to use during recovery procedures.</p>
                            <button className="btn btn-outline" style={{ width: '100%', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', fontWeight: 800 }}>Download CFG Snapshot</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUsers = () => {
        if (loading) return <div className="section-content">Accessing global identity database...</div>;

        const handleUserAction = (type, u) => {
            if (type === 'delete') {
                if (window.confirm(`Are you sure you want to permanently remove user ${u.name}?`)) {
                    setUsersList(usersList.filter(user => user.email !== u.email));
                }
            } else if (type === 'edit') {
                alert(`Redirecting to profile management for ${u.name}...`);
            } else if (type === 'disable') {
                alert(`${u.name}'s platform access has been suspended.`);
            }
            setActiveUserDropdown(null);
        };

        const filteredUsers = usersList.filter(u => {
            const matchesSearch = (u.name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase());

            const roleMap = {
                'Lab Admin': 'LAB_ADMIN',
                'Patient': 'USER'
            };
            const targetRole = roleMap[userRoleFilter] || 'All Roles';
            const matchesRole = targetRole === 'All Roles' || u.role === targetRole;

            return matchesSearch && matchesRole;
        });

        return (
            <div className="section-content">
                <div className="table-container">
                    <div className="table-header-controls">
                        <div className="filter-group">
                            <div className="search-wrapper">
                                <i className="search-icon"><Icon.Search /></i>
                                <input
                                    type="text"
                                    className="styled-input"
                                    placeholder="Search users..."
                                    style={{ width: '300px', paddingLeft: '44px' }}
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="styled-select"
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                            >
                                <option>All Roles</option>
                                <option>Lab Admin</option>
                                <option>Patient</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={() => downloadCSV(filteredUsers, 'user_management_report.csv')}>
                            <Icon.Download /> Export Users
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User Identity</th>
                                <th>Role</th>
                                <th>Email Address</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right', paddingRight: '32px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map((u, i) => (
                                <tr key={i}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' }}>{u.name?.charAt(0) || 'U'}</div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>{u.name || 'External User'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Entity</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span style={{ background: u.role === 'LAB_ADMIN' ? 'var(--primary-soft)' : 'var(--bg-main)', color: u.role === 'LAB_ADMIN' ? 'var(--primary)' : 'var(--text-muted)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{u.role === 'LAB_ADMIN' ? 'Lab Admin' : u.role === 'USER' ? 'Patient' : u.role}</span></td>
                                    <td><div style={{ fontWeight: 500 }}>{u.email}</div></td>
                                    <td>{u.date ? new Date(u.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jan 01, 2024'}</td>
                                    <td>
                                        <span className={`status-badge status-active`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Active Node</span>
                                    </td>
                                    <td style={{ textAlign: 'right', paddingRight: '24px', position: 'relative' }}>
                                        <button
                                            className="btn-action-more"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveUserDropdown(activeUserDropdown === i ? null : i);
                                            }}
                                            title="Administrative Operations"
                                        >
                                            <Icon.More />
                                        </button>
                                        {activeUserDropdown === i && (
                                            <div className="action-dropdown" style={{ top: '80%', right: '24px', zIndex: 1000 }} onClick={e => e.stopPropagation()}>
                                                <div className="dropdown-item" onClick={() => handleUserAction('edit', u)}>
                                                    <Icon.Edit size={14} /> Modify Credentials
                                                </div>
                                                <div className="dropdown-item" onClick={() => handleUserAction('disable', u)}>
                                                    <Icon.Settings size={14} /> Adjust Permissions
                                                </div>
                                                <div className="divider"></div>
                                                <div className="dropdown-item danger" onClick={() => handleUserAction('delete', u)}>
                                                    <Icon.Trash size={14} /> Erase Record
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '100px 20px', fontSize: '1.2rem', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>No users found matching these criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderTests = () => {
        const handleDeleteTest = (id) => {
            if (window.confirm('Are you sure you want to remove this test from the platform?')) {
                setAllTestsData(allTestsData.filter(t => t.id !== id));
            }
        };

        return (
            <div className="section-content">
                <div className="dashboard-main-row" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', minHeight: 'auto' }}>
                    <div className="glass-card" style={{ minHeight: 'auto', padding: '24px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-light) 400%)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Global Taxonomy</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', color: 'var(--primary)' }}>{new Set(aggregatedTests.map(t => t.cat)).size} Categories</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Aggregated from {allBackendLabs.length} Labs</div>
                    </div>
                    <div className="glass-card" style={{ minHeight: 'auto', padding: '24px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Service Portfolio</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px' }}>{aggregatedTests.length} Unified Tests</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700, marginTop: '4px' }}>↑ Live synchronization active</div>
                    </div>
                    <div className="glass-card" style={{ minHeight: 'auto', padding: '24px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Provisioning</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '12px', color: 'var(--text-main)' }}>Dynamic Lab Ingestion</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--info)', fontWeight: 700, marginTop: '4px' }}>Scanning lab landing pages...</div>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-header-controls">
                        <div className="filter-group">
                            <div className="search-wrapper">
                                <i className="search-icon"><Icon.Search /></i>
                                <input
                                    className="styled-input"
                                    placeholder="Search global test catalog..."
                                    style={{ paddingLeft: '44px', width: '300px' }}
                                    value={testSearchQuery}
                                    onChange={(e) => setTestSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="styled-select"
                                style={{ width: '220px' }}
                                value={testCategoryFilter}
                                onChange={(e) => setTestCategoryFilter(e.target.value)}
                            >
                                <option>All Categories</option>
                                {availableCategories.sort().map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={() => downloadCSV(filteredTests, 'unified_test_catalog.csv')}>
                            <Icon.Download /> Full Marketplace Audit
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Test Nomenclature</th>
                                <th>Category</th>
                                <th>Reference Pricing</th>
                                <th style={{ width: '25%' }}>Availability Context</th>
                                <th>System Origin</th>
                                <th style={{ textAlign: 'center' }}>Directives</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTests.map((t) => (
                                <tr key={t.id}>
                                    <td>
                                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{t.status} NODE</div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            background: 'var(--primary-soft)',
                                            color: 'var(--primary)',
                                            border: '1px solid var(--primary-light)'
                                        }}>{t.cat}</span>
                                    </td>
                                    <td style={{ fontWeight: 900, color: 'var(--text-main)' }}>{t.price}</td>
                                    <td>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-body)' }}>{t.meta}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Verified via Platform Hub</div>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: t.source === 'Global Registry' ? 'var(--bg-main)' : 'var(--success-light)',
                                            color: t.source === 'Global Registry' ? 'var(--text-muted)' : 'var(--success)',
                                            border: '1px solid var(--border-light)'
                                        }}>{t.source}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <button
                                                className="btn-action-edit"
                                                title="Synchronize Parameters"
                                                onClick={() => setEditingTest(t)}
                                            ><Icon.Edit size={16} /></button>
                                            <button
                                                className="btn-action-eye"
                                                style={{ width: '38px', height: '38px' }}
                                                title="Inspect Entity"
                                                onClick={() => setViewingTest(t)}
                                            ><Icon.Eye size={16} /></button>
                                            <button
                                                className="btn-action-trash"
                                                title="Discard Definition"
                                                onClick={() => handleDeleteTest(t.id)}
                                            ><Icon.Trash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Inline Modals for Actions */}
                {viewingTest && (
                    <div className="modal-overlay" onClick={() => setViewingTest(null)}>
                        <div className="glass-card" style={{ maxWidth: '520px', width: '90%', padding: '40px', position: 'relative', borderRadius: '32px' }} onClick={e => e.stopPropagation()}>
                            <button
                                style={{ position: 'absolute', right: '28px', top: '28px', border: 'none', background: 'var(--bg-main)', borderRadius: '12px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => setViewingTest(null)}
                            >✕</button>
                            <div style={{ width: '64px', height: '64px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                <Icon.Tests size={32} />
                            </div>
                            <h3 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{viewingTest.name}</h3>
                            <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '32px' }}>
                                CATEGORY: {viewingTest.cat.toUpperCase()}
                            </div>

                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Catalog Price</span>
                                    <span style={{ fontWeight: 900, color: 'var(--primary)' }}>{viewingTest.price}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Platform Sentiment</span>
                                    <span style={{ fontWeight: 800, color: 'var(--accent)' }}>{viewingTest.meta}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Active Status</span>
                                    <span style={{ fontWeight: 900, color: 'var(--success)' }}>Node Verified</span>
                                </div>
                            </div>

                            <button className="btn btn-primary" style={{ marginTop: '32px', width: '100%', height: '54px', borderRadius: '16px', fontWeight: 900 }} onClick={() => setViewingTest(null)}>Acknowledge & Exit</button>
                        </div>
                    </div>
                )}

                {editingTest && (
                    <div className="modal-overlay" onClick={() => setEditingTest(null)}>
                        <div className="glass-card" style={{ maxWidth: '500px', width: '90%', padding: '40px', position: 'relative', borderRadius: '32px' }} onClick={e => e.stopPropagation()}>
                            <button
                                style={{ position: 'absolute', right: '28px', top: '28px', border: 'none', background: 'var(--bg-main)', borderRadius: '12px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => setEditingTest(null)}
                            >✕</button>
                            <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Refine Test Parameters</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Adjusting global definitions for {editingTest.name}.</p>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const updated = {
                                    ...editingTest,
                                    name: formData.get('name'),
                                    price: formData.get('price'),
                                    meta: formData.get('meta')
                                };
                                setAllTestsData(allTestsData.map(t => t.id === updated.id ? updated : t));
                                setEditingTest(null);
                                alert('Test parameters synchronized successfully!');
                            }}>
                                <div className="form-grid" style={{ gap: '24px' }}>
                                    <div className="form-group field-full">
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Canonical Test Name</label>
                                        <input name="name" className="styled-input" style={{ padding: '14px 18px', borderRadius: '14px' }} defaultValue={editingTest.name} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Standard Market Rate</label>
                                        <input name="price" className="styled-input" style={{ padding: '14px 18px', borderRadius: '14px' }} defaultValue={editingTest.price} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Platform Tag</label>
                                        <select name="meta" className="styled-select" style={{ padding: '14px 18px', borderRadius: '14px', height: '54px' }} defaultValue={editingTest.meta}>
                                            <option>Popular</option>
                                            <option>Essential</option>
                                            <option>Specialized</option>
                                            <option>Common</option>
                                            <option>Diabetes</option>
                                            <option>Screening</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                                    <button type="button" className="btn btn-ghost" style={{ flex: 1, height: '54px', borderRadius: '16px' }} onClick={() => setEditingTest(null)}>Abort</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '54px', borderRadius: '16px', fontWeight: 900 }}>Synchronize Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderRevenue = () => {
        // Create a unified master list of all known clinical nodes
        const masterLabs = [];
        const labMap = new Map();

        [...allBackendLabs, ...labsList].forEach(l => {
            if (l.name && !labMap.has(l.name.toLowerCase())) {
                masterLabs.push(l);
                labMap.set(l.name.toLowerCase(), l);
            }
        });

        const filteredLabsForRevenue = masterLabs.filter(l => {
            if (revenueLocationFilter === 'All Locations') return true;
            const loc = (l.location || '').toLowerCase();
            const target = revenueLocationFilter.toLowerCase();
            return loc.includes(target);
        });

        const revenueChartData = filteredLabsForRevenue.map(l => {
            const rawRev = l.revenue || '₹0';
            const numericRev = parseInt(rawRev.toString().replace(/[₹,]/g, '')) || 0;
            return {
                lab: l.name.length > 15 ? l.name.substring(0, 13) + '..' : l.name,
                rev: numericRev,
                fullName: l.name
            };
        }).sort((a, b) => b.rev - a.rev);

        const totalFilteredRev = filteredLabsForRevenue.reduce((acc, l) => acc + (parseInt((l.revenue || '₹0').replace(/[₹,]/g, '')) || 0), 0);

        return (
            <div className="section-content">
                <div className="table-header-controls" style={{ marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Regional Revenue Control</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Analyzing financial inflow from laboratories in {revenueLocationFilter}</p>
                    </div>
                    <div className="filter-group">
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter Location:</span>
                        <select
                            className="styled-select"
                            style={{ width: '220px' }}
                            value={revenueLocationFilter}
                            onChange={(e) => {
                                const newLoc = e.target.value;
                                setRevenueLocationFilter(newLoc);
                                handleLocationSearch(newLoc);
                            }}
                        >
                            {bookingLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>

                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-label">Selected Region Revenue</div>
                        <div className="kpi-value">₹{(totalFilteredRev / 1000).toFixed(1)}k</div>
                        <div className="trend-up" style={{ fontSize: '0.75rem', marginTop: '8px' }}>Active Labs: {filteredLabsForRevenue.length}</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-label">Estimated Commission (15%)</div>
                        <div className="kpi-value">₹{(totalFilteredRev * 0.15 / 1000).toFixed(1)}k</div>
                        <div className="trend-up" style={{ fontSize: '0.75rem', marginTop: '8px' }}>Region: {revenueLocationFilter}</div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-label">Average Lab Payout</div>
                        <div className="kpi-value">₹{filteredLabsForRevenue.length ? (totalFilteredRev / filteredLabsForRevenue.length / 1000).toFixed(1) : 0}k</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '8px', color: '#64748b' }}>Per diagnostic center</div>
                    </div>
                </div>

                <div className="glass-card" style={{ marginBottom: '32px' }}>
                    <h3 className="card-title">Laboratory Revenue: {revenueLocationFilter}</h3>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={revenueChartData.length ? revenueChartData : [{ lab: 'No Data', rev: 0 }]}>
                                <XAxis dataKey="lab" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                                />
                                <Bar dataKey="rev" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="table-container">
                    <div className="table-header-controls">
                        <h3 className="card-title" style={{ margin: 0 }}>Laboratory Earnings Breakdown</h3>
                        <button className="btn btn-outline" onClick={() => downloadCSV(filteredLabsForRevenue, `revenue_${revenueLocationFilter}.csv`)}>
                            <Icon.Download /> Export Data
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Lab Name</th>
                                <th>Location</th>
                                <th>Contact Status</th>
                                <th>Total Revenue</th>
                                <th>Admin Commission</th>
                                <th>Net Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLabsForRevenue.length > 0 ? filteredLabsForRevenue.map((l, i) => {
                                const rev = parseInt((l.revenue || '₹0').replace(/[₹,]/g, '')) || 0;
                                const comm = Math.round(rev * 0.15);
                                const net = rev - comm;
                                return (
                                    <tr key={l.id || i}>
                                        <td style={{ fontWeight: 700 }}>{l.name}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{l.location}</td>
                                        <td><span className="status-badge status-active">Active</span></td>
                                        <td style={{ fontWeight: 600 }}>₹{rev.toLocaleString()}</td>
                                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{comm.toLocaleString()}</td>
                                        <td style={{ fontWeight: 600 }}>₹{net.toLocaleString()}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No laboratories found in {revenueLocationFilter}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderProfile = () => {
        const handleSaveProfile = () => {
            setIsEditingProfile(false);
            alert('Profile configuration updated successfully.');
        };

        const recentActivities = [
            { id: 1, action: 'Updated Global Commission', time: '2 hours ago', status: 'Success' },
            { id: 2, action: 'Approved 4 New Laboratories', time: '5 hours ago', status: 'Verified' },
            { id: 3, action: 'Synchronized OSM Datasets', time: 'Yesterday', status: 'Automated' },
            { id: 4, action: 'Resolved Critical Payment Latency', time: '2 days ago', status: 'Manual Fix' },
            { id: 5, action: 'Generated Monthly Revenue Audit', time: 'Feb 28, 2024', status: 'Report' }
        ];

        return (
            <div className="section-content">
                <div className="glass-card" style={{ padding: '48px', overflow: 'hidden', position: 'relative' }}>

                    {/* Decorative Background Element */}
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'var(--primary-soft)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6, zIndex: 0 }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '40px', marginBottom: '48px' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '140px', height: '140px', borderRadius: '40px', background: 'linear-gradient(135deg, var(--primary) 0%, #0c4a6e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 950, color: '#fff', boxShadow: '0 20px 40px rgba(14, 165, 233, 0.3)' }}>S</div>
                                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '36px', height: '36px', background: 'var(--success)', border: '6px solid var(--bg-card)', borderRadius: '50%' }}></div>
                            </div>

                            <div style={{ flex: 1, paddingTop: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        {isEditingProfile ? (
                                            <input
                                                className="styled-input"
                                                value={superAdminData.name}
                                                onChange={(e) => setSuperAdminData({ ...superAdminData, name: e.target.value })}
                                                style={{ fontSize: '2.4rem', fontWeight: 950, width: '100%', marginBottom: '4px' }}
                                            />
                                        ) : (
                                            <h1 style={{ fontSize: '2.4rem', fontWeight: 950, margin: 0, letterSpacing: '-1px', color: 'var(--text-main)' }}>{superAdminData.name}</h1>
                                        )}
                                        {isEditingProfile ? (
                                            <input
                                                className="styled-input"
                                                value={superAdminData.role}
                                                onChange={(e) => setSuperAdminData({ ...superAdminData, role: e.target.value })}
                                                style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 800, width: '100%' }}
                                            />
                                        ) : (
                                            <p style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 800, marginTop: '4px' }}>{superAdminData.role}</p>
                                        )}
                                    </div>
                                    <button
                                        className="btn btn-outline"
                                        style={{ borderRadius: '14px', padding: '10px 20px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                                        onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                                    >
                                        {isEditingProfile ? 'Save Changes' : <><Icon.Edit size={16} /> Edit Profile Configuration</>}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '24px', marginTop: '32px' }}>
                                    <div style={{ padding: '16px 24px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-light)', flex: 1 }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Current Privilege</label>
                                        <span style={{ fontWeight: 900, fontSize: '1rem' }}>{superAdminData.accessLevel}</span>
                                    </div>
                                    <div style={{ padding: '16px 24px', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-light)', flex: 1 }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Account History</label>
                                        <span style={{ fontWeight: 900, fontSize: '1rem' }}>Active since {superAdminData.since}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '24px', color: 'var(--text-main)' }}>Administrative Credentials</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', background: 'var(--bg-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Icon.Search /></div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>AUTHORIZED EMAIL</p>
                                            {isEditingProfile ? (
                                                <input
                                                    className="styled-input"
                                                    value={superAdminData.email}
                                                    onChange={(e) => setSuperAdminData({ ...superAdminData, email: e.target.value })}
                                                    style={{ fontWeight: 900, fontSize: '1rem', width: '100%' }}
                                                />
                                            ) : (
                                                <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem' }}>{superAdminData.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', background: 'var(--bg-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}><Icon.Dashboard /></div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>LAST AUTH SESSION</p>
                                            <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem' }}>{superAdminData.lastLogin}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', background: 'var(--bg-main)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><Icon.Settings /></div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>SECURITY PERSISTENCE</p>
                                            <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: 'var(--success)' }}>{superAdminData.securityStatus}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '48px', padding: '32px', background: 'var(--primary)', borderRadius: '24px', color: '#fff', boxShadow: '0 15px 30px var(--primary-light)' }}>
                                    <h4 style={{ fontWeight: 900, marginBottom: '12px' }}>System Command Tip</h4>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: '1.6', margin: 0 }}>You have full read/write access to all platform nodes. Ensure periodic rotation of your access credentials for maximum security.</p>
                                </div>
                            </div>

                            <div style={{ background: 'var(--bg-main)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 950, margin: 0 }}>Recent Administrative Actions</h3>
                                    <button className="btn btn-ghost" style={{ fontSize: '0.75rem', fontWeight: 900 }}>Filter Timeline</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {recentActivities.map(act => (
                                        <div key={act.id} style={{ display: 'flex', gap: '20px', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }}></div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontWeight: 900, fontSize: '0.95rem' }}>{act.action}</span>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{act.time}</span>
                                                </div>
                                                <div style={{ marginTop: '8px', display: 'inline-block', padding: '4px 10px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900 }}>
                                                    {act.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-outline" style={{ width: '100%', marginTop: '24px', borderRadius: '12px', height: '48px', fontSize: '0.85rem', fontWeight: 800 }}>Explore Full Audit History</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };



    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'labs': return renderLabs();
            case 'lab-detail': return renderLabDetail();
            case 'bookings': return renderBookings();
            case 'notifications': return renderNotifications();
            case 'settings': return renderSettings();
            case 'users': return renderUsers();
            case 'revenue': return renderRevenue();
            case 'tests': return renderTests();
            case 'profile': return renderProfile();
            default: return renderOverview();
        }
    };


    return (
        <div className="super-admin-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <img src={logoImage} alt="M" style={{ width: '24px' }} />
                    </div>
                    <span className="logo-text">MEDIBOT</span>
                </div>

                <div className="sidebar-nav">
                    <div className="nav-group">
                        <div className="nav-label">Main Menu</div>
                        <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                            <span className="nav-icon"><Icon.Dashboard /></span>
                            <span>Dashboard</span>
                        </div>
                        <div className={`nav-item ${['labs', 'lab-detail'].includes(activeTab) ? 'active' : ''}`} onClick={() => setActiveTab('labs')}>
                            <span className="nav-icon"><Icon.Labs /></span>
                            <span>Laboratory Monitoring</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                            <span className="nav-icon"><Icon.Bookings /></span>
                            <span>Booking Management</span>
                        </div>
                    </div>

                    <div className="nav-group">
                        <div className="nav-label">Management</div>
                        <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                            <span className="nav-icon"><Icon.Users /></span>
                            <span>User Management</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>
                            <span className="nav-icon"><Icon.Tests /></span>
                            <span>Test & Categorization</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'revenue' ? 'active' : ''}`} onClick={() => setActiveTab('revenue')}>
                            <span className="nav-icon"><Icon.Revenue /></span>
                            <span>Financial Analytics</span>
                        </div>
                    </div>

                    <div className="nav-group">
                        <div className="nav-label">System</div>
                        <div className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                            <span className="nav-icon"><Icon.Alerts /></span>
                            <span>Alerts & Logs</span>
                        </div>
                        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            <span className="nav-icon"><Icon.Settings /></span>
                            <span>Platform Settings</span>
                        </div>

                        {/* Super Admin Profile Entry */}
                        <div className={`user-profile-mini ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                            style={{ cursor: 'pointer', marginTop: '20px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>S</div>
                            <div className="user-info-mini">
                                <h4>Super Admin</h4>
                                <p>System Administrator</p>
                            </div>
                        </div>
                    </div>

                </div>



            </aside>

            {/* Main Content Area */}
            <main className="main-area">
                <header className="header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <span className="breadcrumb-item">Platform</span>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-item active" style={{ textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="search-wrapper">
                            <i className="search-icon"><Icon.Search /></i>
                            <input type="text" className="header-search" placeholder="Quick search..." />
                        </div>
                        <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button className="icon-btn" onClick={() => setActiveTab('notifications')}>
                            <Icon.Alerts />
                            <span className="notification-badge"></span>
                        </button>
                        <button className="btn btn-outline" style={{ borderRadius: '20px' }} onClick={() => navigate('/admin/login')}>
                            Logout
                        </button>
                    </div>
                </header>

                <div className="content-wrapper">
                    <div className="section-title-group">
                        <div>
                            <h1 className="section-title" style={{ textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</h1>
                            <p className="section-subtitle">Manage and monitor the entire laboratory ecosystem at a glance.</p>
                        </div>
                        <div className="action-btns" style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '0 24px' }} onClick={() => {
                                if (activeTab === 'labs') {
                                    downloadCSV(labsList, 'labs_report.csv');
                                } else if (activeTab === 'bookings') {
                                    downloadCSV(filteredBookings, 'patient_bookings_report.csv');
                                } else if (activeTab === 'users') {
                                    downloadCSV(usersList, 'users_report.csv');
                                } else if (activeTab === 'tests') {
                                    downloadCSV(allTestsData, 'test_catalog_report.csv');
                                } else if (activeTab === 'notifications') {
                                    downloadCSV(notificationsListData, 'system_alerts_logs.csv');
                                } else if (activeTab === 'revenue') {
                                    downloadCSV(labsList, 'revenue_control_report.csv');
                                } else if (activeTab === 'settings') {
                                    downloadCSV([platformSettings], 'platform_configuration.csv');
                                } else {
                                    window.print();
                                }
                            }}>
                                <Icon.Download /> {activeTab === 'overview' ? 'Print Summary' : 'Export Full Report'}
                            </button>
                        </div>
                    </div>

                    {renderContent()}
                </div>
            </main>

            {/* Modal Components (Example for Add Lab) */}
            {modalType === 'add-lab' && (
                <div className="modal-overlay" onClick={() => setModalType(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Register New Laboratory</h3>
                            <button className="btn-icon" onClick={() => setModalType(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group field-full">
                                    <label>Laboratory Name</label>
                                    <input className="styled-input" placeholder="e.g. Apex Diagnostics Center" />
                                </div>
                                <div className="form-group">
                                    <label>City / Location</label>
                                    <input className="styled-input" placeholder="Bangalore" />
                                </div>
                                <div className="form-group">
                                    <label>Admin Name</label>
                                    <input className="styled-input" placeholder="Dr. John Doe" />
                                </div>
                                <div className="form-group">
                                    <label>Contact Number</label>
                                    <input className="styled-input" placeholder="+91 99887 76655" />
                                </div>
                                <div className="form-group">
                                    <label>Business License ID</label>
                                    <input className="styled-input" placeholder="LIC-99281-AX" />
                                </div>
                                <div className="form-group field-full">
                                    <label>Address</label>
                                    <textarea className="styled-input" placeholder="Full physical address..." rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setModalType(null)}>Cancel</button>
                            <button className="btn btn-primary">Register Laboratory</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
