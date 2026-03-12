import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/LabHero.jpg';
import labHeroSplit from '../assets/LabHeroSplit.png';
import logoImage from '../assets/Logo.png';
import microscopeBg from '../assets/MicroscopeBg.png';
import dnaBg from '../assets/medibot_dna_bg.png';
import moleculesBg from '../assets/medibot_3d_molecules.png';
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

const IconChevronLeft = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconChevronRight = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="9 18 15 12 9 6"></polyline>
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

const IconMicroscope = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14h2" />
    <path d="M9 12a2 2 0 1 1-2-2V6h6v4a2 2 0 1 1-2 2z" />
    <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
  </svg>
);

const IconPrescription = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
    <path d="M7 7h10" />
    <path d="M7 12h10" />
    <path d="M7 17h6" />
  </svg>
);

const IconClipboard = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
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


// Test Pricing Structure - Each test has its actual price
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

// Legacy TEST_CATEGORIES for backward compatibility - now references TEST_PRICING
const TEST_CATEGORIES = {
  "Blood Tests": TEST_PRICING["Blood Tests"].map(test => test.name),
  "Urine Tests": TEST_PRICING["Urine Tests"].map(test => test.name),
  "Sputum Tests": TEST_PRICING["Sputum Tests"].map(test => test.name),
  "Stool Tests": TEST_PRICING["Stool Tests"].map(test => test.name),
  "Scanning": TEST_PRICING["Scanning"].map(test => test.name)
};

const ENHANCED_LAB_DATA = {
  "Royal Clinical Laboratory": {
    description: "Royal Clinical Laboratory is a trusted diagnostic center located in Kanjirappally, Kottayam, offering reliable clinical testing services for patients and healthcare providers. The laboratory focuses on providing accurate and timely diagnostic results using modern equipment and experienced technicians. It specializes in routine blood tests, urine analysis, and preventive health screenings. With efficient sample processing and quick report delivery, Royal Clinical Laboratory ensures quality diagnostic support for early disease detection and patient care.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "8:30 AM – 5:30 PM",
      services: "Blood Tests, Urine Analysis, Lipid Profile, LFT, KFT, Diabetes Screening",
      homeCollection: "Available",
      reportDelivery: "Same day for routine tests",
      staff: "Lab Technician, Phlebotomist, Receptionist",
      rating: "New"
    }
  },
  "Marymatha Clinical Laboratory": {
    description: "Marymatha Clinical Laboratory is a well-equipped diagnostic facility providing 24-hour laboratory services in Kanjirappally. The lab is known for its continuous availability and reliable clinical testing for blood, urine, and other specimens. With skilled laboratory professionals and advanced diagnostic methods, Marymatha Clinical Laboratory ensures accurate results and fast turnaround time. The facility supports both walk-in patients and doctor referrals while also offering convenient home sample collection services.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "Open 24 Hours",
      services: "CBC, Thyroid Profile, Blood Sugar Test, Urine Test, Pregnancy Test",
      homeCollection: "Available",
      reportDelivery: "6–12 hours for routine tests",
      staff: "Pathologist, Lab Technician, Sample Collector",
      rating: "New"
    }
  },
  "DDRC SRL Diagnostic Center": {
    description: "DDRC SRL Diagnostic Center is a reputed diagnostic laboratory known for advanced medical testing and high-quality laboratory standards. Located in Kanjirappally, the center provides a wide range of diagnostic services including specialized blood tests, hormone testing, and preventive health packages. With experienced pathologists and modern laboratory equipment, DDRC SRL ensures precise and reliable diagnostic reports. The center also supports home sample collection and offers comprehensive diagnostic services for both individuals and healthcare institutions.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "9:15 AM – 6:30 PM",
      services: "Advanced Blood Tests, Hormone Testing, Allergy Testing, Cancer Markers, Health Checkups",
      homeCollection: "Available",
      reportDelivery: "24–48 hours depending on test",
      staff: "Pathologist, Microbiologist, Lab Technologists",
      rating: "5.0"
    }
  },
  "Sri Diagnostics Pvt (Ltd)": {
    description: "Sri Diagnostics Pvt Ltd is a clinical and medical laboratory providing reliable pathology and diagnostic testing services. The laboratory offers a wide range of routine and specialized tests including blood analysis, urine testing, and cholesterol screening. With trained laboratory technicians and a patient-friendly environment, Sri Diagnostics focuses on delivering accurate reports and quality healthcare support. The lab also offers convenient sample collection services and quick report processing for patient convenience.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "9:15 AM – 7:00 PM",
      services: "Pathology Tests, Blood Tests, Urine Analysis, Cholesterol Test, Vitamin Tests",
      homeCollection: "Available",
      reportDelivery: "Same day for routine tests",
      staff: "Lab Technicians, Sample Collectors",
      rating: "New"
    }
  },
  "Usha Clinic Laboratory": {
    description: "Usha Clinic Laboratory is a diagnostic facility associated with Usha Clinic that provides routine medical testing and diagnostic services for patients. The laboratory focuses on essential clinical tests including blood sugar analysis, CBC tests, and urine examination. With experienced medical staff and basic diagnostic equipment, the laboratory supports doctors in diagnosing and monitoring patient health conditions. It is known for providing reliable and affordable diagnostic services for the local community.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "8:00 AM – 6:30 PM",
      services: "Blood Sugar Testing, CBC, Urine Test, ECG, Health Screening",
      homeCollection: "Limited availability",
      reportDelivery: "Same day",
      staff: "Physician, Lab Technician",
      rating: "4.0"
    }
  },
  "Dianova Laboratory": {
    description: "Dianova Laboratory is a diagnostic testing center offering 24-hour clinical laboratory services for patients requiring urgent and routine medical tests. The laboratory provides accurate diagnostic support through blood tests, urine tests, and infection screening. With trained laboratory staff and reliable testing procedures, Dianova ensures quality healthcare services and timely diagnostic results for effective medical treatment.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "Open 24 Hours",
      services: "Blood Tests, Urine Tests, Infection Screening, Liver Function Tests, Kidney Function Tests",
      homeCollection: "Available",
      reportDelivery: "12–24 hours",
      staff: "Lab Technologists, Sample Collectors",
      rating: "New"
    }
  },
  "Dianova Clinical Laboratory": {
    description: "Dianova Clinical Laboratory is a diagnostic center providing routine laboratory testing services including blood tests and urine analysis. The laboratory focuses on delivering accurate results with efficient sample handling and reliable testing procedures. With experienced technicians and quality diagnostic support, the laboratory helps doctors and patients monitor health conditions and detect diseases early.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "9:45 AM – 4:30 PM",
      services: "Blood Tests, Urine Routine Test, Thyroid Tests, CBC",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Technicians",
      rating: "New"
    }
  },
  "Amala Laboratory": {
    description: "Amala Laboratory is a medical diagnostic laboratory providing a variety of routine clinical tests for patients. The laboratory offers services such as blood testing, urine analysis, diabetes screening, and thyroid testing. With extended working hours and experienced laboratory professionals, Amala Laboratory focuses on delivering accurate diagnostic results and efficient patient care.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "8:00 AM – 8:30 PM",
      services: "Blood Tests, Urine Analysis, Diabetes Screening, Thyroid Tests, Vitamin Tests",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Pathologist, Lab Technician",
      rating: "New"
    }
  },
  "Scanron Diagnostics": {
    description: "Scanron Diagnostics is a diagnostic laboratory providing comprehensive clinical testing and health diagnostic services. The center performs various laboratory tests including blood testing, hormone analysis, and preventive health checkups. With modern diagnostic equipment and trained professionals, Scanron Diagnostics aims to deliver accurate reports and reliable medical testing support.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "8:00 AM – 8:00 PM",
      services: "Scanning, Blood Tests, Clinical Laboratory Testing, Diagnostic Packages, Hormone Tests",
      homeCollection: "Available",
      reportDelivery: "Within 24 hours",
      staff: "Lab Technologists, Pathologist",
      rating: "New"
    }
  },
  "ClinoTech Laboratories": {
    description: "ClinoTech Laboratories is a modern diagnostic laboratory providing professional medical testing services for patients and healthcare providers. The laboratory offers a range of diagnostic tests including blood analysis, urine testing, and preventive health packages. With skilled laboratory technicians and advanced testing facilities, ClinoTech Laboratories ensures high-quality diagnostic services and accurate reporting for effective healthcare management.",
    details: {
      location: "Kanjirappally, Kottayam",
      workingHours: "8:30 AM – 6:00 PM",
      services: "Diagnostic Laboratory Services, Blood Tests, Urine Tests, Preventive Health Packages",
      homeCollection: "Available",
      reportDelivery: "Same day for routine tests",
      staff: "Senior Lab Technicians, Pathologist",
      rating: "5.0"
    }
  },
  "Lissy's Clinical Laboratory": {
    description: "Lissy's Clinical Laboratory is a trusted pathology testing center known for providing reliable diagnostic services for routine and specialized clinical tests. The laboratory offers accurate pathology testing with modern equipment and trained laboratory professionals. It focuses on quick report delivery and quality diagnostic support for patients and physicians.",
    details: {
      location: "Nearby",
      distance: "0.5 km",
      rating: "4.6",
      workingHours: "7:50 AM – 7:30 PM",
      services: "Pathology Tests, Blood Tests, Urine Tests, Health Screening",
      homeCollection: "Available",
      reportDelivery: "Same day for routine tests",
      staff: "Pathologists, Technicians",
    }
  },
  "Medivison": {
    description: "Medivison Diagnostic Center is a well-known clinical testing facility offering professional pathology and laboratory services. The center provides accurate blood testing, clinical diagnostics, and preventive health screening services. With experienced laboratory technicians and efficient sample processing, Medivison ensures dependable diagnostic results.",
    details: {
      location: "Nearby",
      distance: "2.8 km",
      rating: "4.8",
      workingHours: "7:20 AM – 6:30 PM",
      services: "Pathology Tests, Blood Analysis, Urine Tests, Routine Health Checkups",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Technicians"
    }
  },
  "Primedical Diagnostics": {
    description: "Primedical Diagnostics is a diagnostic testing facility providing a variety of clinical laboratory services for patients and healthcare providers. The laboratory offers pathology testing, blood analysis, and diagnostic health screenings. With trained laboratory staff and modern diagnostic tools, Primedical Diagnostics focuses on delivering reliable medical test results.",
    details: {
      location: "Nearby",
      distance: "4.2 km",
      rating: "4.0",
      workingHours: "11:50 AM – 7:30 PM",
      services: "Pathology Tests, Blood Tests, Urine Tests, Health Screening",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Staff"
    }
  },
  "Regional Public Health Laboratory": {
    description: "Regional Public Health Laboratory is a government-supported diagnostic laboratory that provides clinical testing services for disease diagnosis and public health monitoring. The laboratory conducts a variety of pathology and medical diagnostic tests with a focus on accurate results and community healthcare support.",
    details: {
      location: "Nearby",
      distance: "4.2 km",
      rating: "4.7",
      workingHours: "9:50 AM – 7:30 PM",
      services: "Pathology Tests, Public Health Screening, Blood Tests, Diagnostic Testing",
      homeCollection: "Not Available",
      reportDelivery: "1-2 days",
      staff: "Public Health Staff"
    }
  },
  "Micro Health Laboratories": {
    description: "Micro Health Laboratories specializes in microbiology and pathology diagnostic services. The laboratory performs clinical tests for infection detection, blood testing, and routine pathology screening. With professional technicians and standardized laboratory procedures, Micro Health Laboratories ensures reliable diagnostic outcomes.",
    details: {
      location: "Nearby",
      distance: "4.3 km",
      rating: "4.8",
      workingHours: "Monday – Saturday (9:00 AM – 4:30 PM)",
      services: "Microbiology Tests, Blood Tests, Pathology Testing",
      homeCollection: "Available",
      reportDelivery: "Within 24 hours",
      staff: "Microbiologists, Technicians"
    }
  },
  "Medline Diagnostics Center": {
    description: "Medline Diagnostics Center is a modern diagnostic facility offering comprehensive laboratory testing services for patients. The center performs a wide range of pathology tests and clinical diagnostics with advanced laboratory equipment and trained professionals.",
    details: {
      location: "Ernakulam",
      distance: "4.3 km",
      rating: "3.5",
      workingHours: "10:30 AM – 9:15 PM",
      services: "Blood Tests, Clinical Pathology, Diagnostic Packages",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Specialists"
    }
  },
  "Gulshan Medicare": {
    description: "Gulshan Medicare is a clinical diagnostic center providing laboratory testing and healthcare support services. The laboratory conducts routine pathology testing and medical diagnostics for disease detection and health monitoring.",
    details: {
      location: "Nearby",
      distance: "4.5 km",
      rating: "4.7",
      workingHours: "8:00 AM – 8:15 PM",
      services: "Blood Tests, Urine Tests, Clinical Diagnostics",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Medical Staff"
    }
  },
  "Hi-Tech Laboratory": {
    description: "Hi-Tech Laboratory is a clinical testing facility offering pathology and diagnostic services using modern laboratory equipment. The laboratory focuses on accurate testing and timely report generation for patients and healthcare providers.",
    details: {
      location: "Nearby",
      distance: "4.6 km",
      rating: "4.1",
      workingHours: "7:00 AM – 8:15 PM",
      services: "Pathology Tests, Blood Tests, Routine Diagnostic Tests",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Technicians"
    }
  },
  "Trust Diagnostics": {
    description: "Trust Diagnostics is a professional laboratory providing reliable diagnostic services including pathology testing and preventive health screening. The laboratory aims to deliver accurate diagnostic reports and quality healthcare support for patients.",
    details: {
      location: "Nearby",
      distance: "4.9 km",
      rating: "4.4",
      workingHours: "7:30 AM – 9:15 PM",
      services: "Blood Tests, Clinical Diagnostics, Health Checkups",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Specialists"
    }
  },
  "Medivision": {
    description: "Medivision Diagnostic Laboratory offers a range of pathology and clinical testing services for disease diagnosis and preventive healthcare. With trained laboratory staff and efficient diagnostic procedures, the laboratory provides dependable medical testing solutions.",
    details: {
      location: "Nearby",
      distance: "5.0 km",
      rating: "4.8",
      workingHours: "Monday – Sunday (9:15 AM – 5:00 PM)",
      services: "Pathology Tests, Blood Tests, Urine Analysis",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Technicians"
    }
  },
  "Celica Medical Center": {
    description: "Celica Medical Center provides clinical laboratory and diagnostic services for patients requiring medical testing and disease screening. The center offers a variety of pathology tests supported by trained laboratory technicians and healthcare professionals.",
    details: {
      location: "Ernakulam",
      distance: "5.0 km",
      rating: "4.0",
      workingHours: "8:20 AM – 8:30 PM",
      services: "Clinical Tests, Blood Tests, Pathology Diagnostics",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Physicians, Technicians"
    }
  },
  "DDRC Agilus": {
    description: "DDRC Agilus is a leading diagnostic network known for high-quality laboratory services and advanced diagnostic technologies. The laboratory provides a wide range of pathology and specialized diagnostic tests, ensuring accurate results and professional healthcare support.",
    details: {
      location: "Panampilly Nagar",
      distance: "5.6 km",
      rating: "4.0",
      workingHours: "8:10 AM – 9:15 PM",
      services: "Advanced Diagnostics, Blood Tests, Pathology Testing",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Specialists"
    }
  },
  "Amma Scans": {
    description: "Amma Scans is a diagnostic center providing laboratory testing and medical scanning services for patient diagnosis. The facility supports healthcare professionals with reliable clinical test reports and diagnostic screening services.",
    details: {
      location: "Nearby",
      distance: "5.7 km",
      rating: "4.2",
      workingHours: "11:40 AM – 6:15 PM",
      services: "Blood Tests, Clinical Diagnostics, Diagnostic Screening",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Radiologists, Technicians"
    }
  },
  "King Lab": {
    description: "King Lab is a diagnostic laboratory offering routine pathology testing and clinical laboratory services. The laboratory performs blood testing, urine analysis, and other medical diagnostic procedures to support disease detection and health monitoring.",
    details: {
      location: "Nearby",
      distance: "5.9 km",
      rating: "4.1",
      workingHours: "10:20 AM – 6:30 PM",
      services: "Blood Tests, Urine Tests, Pathology Tests",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Technicians"
    }
  },
  "Medilab": {
    description: "Medilab is a clinical diagnostic laboratory providing pathology testing and routine health screening services. The laboratory focuses on delivering accurate test results and supporting doctors in patient diagnosis.",
    details: {
      location: "Nearby",
      distance: "5.9 km",
      rating: "3.8",
      workingHours: "8:40 AM – 6:15 PM",
      services: "Pathology Tests, Blood Tests, Diagnostic Screening",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Lab Technicians"
    }
  },
  "Dr Lal Path Labs": {
    description: "Dr Lal Path Labs is one of the most recognized diagnostic laboratory chains in India, offering advanced pathology testing and diagnostic services. The laboratory provides a wide range of medical tests supported by modern technology and standardized laboratory procedures.",
    details: {
      location: "Nearby",
      distance: "6.0 km",
      rating: "3.9",
      workingHours: "9:40 AM – 8:15 PM",
      services: "Advanced Blood Tests, Pathology Tests, Preventive Health Packages",
      homeCollection: "Available",
      reportDelivery: "Same day",
      staff: "Specialized Staff"
    }
  },
  "True Life Medical Company": {
    description: "True Life Medical Company provides diagnostic laboratory services for routine clinical testing and health screening. The laboratory supports healthcare professionals by delivering accurate diagnostic reports and reliable laboratory testing services.",
    details: {
      location: "Nearby",
      distance: "6.0 km",
      rating: "3.8",
      workingHours: "As per appointment",
      services: "Clinical Tests, Blood Tests, Pathology Diagnostics",
      homeCollection: "Available",
      reportDelivery: "As per appointment",
      staff: "Medical Professionals"
    }
  }
};

// Helper function to get the price of a test

const getTestPrice = (testName, labId, customTests = null, labName = null) => {
  // 1. Check if we have custom lab settings from the backend
  if (customTests && Array.isArray(customTests)) {
    const custom = customTests.find(t => t.name === testName);
    if (custom && custom.price !== undefined) return custom.price;
  }

  // 2. Fallback to original logic if no custom price found
  for (const category in TEST_PRICING) {
    const test = TEST_PRICING[category].find(t => t.name === testName);
    if (test) {
      if (!labId && !labName) return test.price;
      // Seed based on labName or labId for consistent lab-specific prices
      const seedTarget = labName || String(labId);
      const seed = String(seedTarget).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const randomVar = (Math.sin(seed + test.price + testName.length) * 10000) % 1;
      // Vary price by -10% to +30%
      const variation = 0.9 + (Math.abs(randomVar) * 0.4);
      return Math.round((test.price * variation) / 5) * 5; // Round to nearest 5
    }
  }
  return 150;
};


// Helper function to get random available tests for a specific lab
const getLabAvailableTests = (labId, labName = null) => {
  // Use lab name or ID as seed for consistent results per lab
  const seedTarget = labName || String(labId || '');
  const seed = String(seedTarget).split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 13), 7);
  const random = (max) => (Math.sin(seed + max) * 10000) % 1;

  const availableTests = {};

  // Each lab gets 40-70% of tests from each category
  Object.keys(TEST_PRICING).forEach((category, catIndex) => {
    const tests = TEST_PRICING[category];
    const percentage = 0.4 + (Math.abs(random(catIndex + 1)) * 0.3); // 40-70%
    const count = Math.max(3, Math.floor(tests.length * percentage));

    // Shuffle and select tests
    const shuffled = [...tests].sort(() => random(catIndex + tests.length) - 0.5);
    availableTests[category] = shuffled.slice(0, count).map(t => t.name);
  });

  return availableTests;
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  const now = new Date();
  const then = new Date(dateStr.replace(' ', 'T')); // Handle format YYYY-MM-DD HH:MM
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

const groupNotifications = (notifs) => {
  const groups = { TODAY: [], YESTERDAY: [], OLDER: [] };
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

  notifs.forEach(n => {
    const date = new Date((n.date || '').replace(' ', 'T')).setHours(0, 0, 0, 0);
    if (date === today) groups.TODAY.push(n);
    else if (date === yesterday) groups.YESTERDAY.push(n);
    else groups.OLDER.push(n);
  });
  return groups;
};

// --- Custom Calendar Picker Component ---
const CalendarPicker = ({ selectedDate, onSelect, labSettings }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate || new Date()));

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const isHoliday = (date) => {
    if (!labSettings) return false;

    // Check working days (weekdays)
    const dayName = weekDays[date.getDay()];
    const workingDays = labSettings.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (!workingDays.includes(dayName)) return true;

    // Check specific holiday dates
    const dateStr = date.toISOString().split('T')[0];
    const holidays = labSettings.holidays || [];
    if (holidays.includes(dateStr)) return true;

    return false;
  };

  const calendarDays = [];
  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);

  // Padding for previous month
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(null);
  }

  // Days of current month
  for (let d = 1; d <= totalDays; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={prevMonth} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><IconChevronLeft size={18} /></button>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{monthNames[month]} {year}</span>
        <button onClick={nextMonth} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}><IconChevronRight size={18} /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {weekDays.map(d => <div key={d} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', paddingBottom: '8px' }}>{d.toUpperCase()}</div>)}
        {calendarDays.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;

          const isPast = date < today;
          const holiday = isHoliday(date);
          const isSelected = selectedDate === date.toISOString().split('T')[0];

          return (
            <button
              key={date.getTime()}
              disabled={isPast || holiday}
              onClick={() => onSelect(date.toISOString().split('T')[0])}
              style={{
                aspectRatio: '1/1',
                border: 'none',
                borderRadius: '10px',
                background: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected ? 'white' : (holiday ? '#ef4444' : (isPast ? '#cbd5e1' : '#334155')),
                fontWeight: 700,
                cursor: (isPast || holiday) ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={e => !isPast && !holiday && !isSelected && (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
            >
              {date.getDate()}
              {holiday && !isPast && <div style={{ position: 'absolute', bottom: '4px', width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }}></div>}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></div> Holiday</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}></div> Selected</div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const labsSectionRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Labs');
  const [labsList, setLabsList] = useState([]); // Raw labs from OSM
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [visibleLimit, setVisibleLimit] = useState(20); // Show more labs by default
  const [userProfile, setUserProfile] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
    { id: 1, type: "ai", text: "👋 Welcome to MediBot! I'm your advanced healthcare assistant. I can help you find laboratories, book diagnostic tests, track your reports, or assist with site navigation. How can I help you today?" }
  ]);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  // Notifications & Reminders State
  const [notifications, setNotifications] = useState([]);

  // Bill Notification Modal State
  const [selectedBillNotification, setSelectedBillNotification] = useState(null);
  const [showBillNotificationModal, setShowBillNotificationModal] = useState(false);

  const [reminders, setReminders] = useState([
    { id: 1, text: "Fasting required for Thyroid test tomorrow.", time: "Tomorrow, 8 AM" },
    { id: 2, text: "Follow-up checkup pending.", time: "Next Week" }
  ]);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  // Booking State Variables
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [activeTestCategory, setActiveTestCategory] = useState('Blood Tests');
  const [selectedTests, setSelectedTests] = useState([]);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Additional modal states
  const [showLabDetailsModal, setShowLabDetailsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [showMyBookingsModal, setShowMyBookingsModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocationInput, setUserLocationInput] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [userCoords, setUserCoords] = useState(null);
  const [labSettings, setLabSettings] = useState(null); // Fetch from backend when lab selected

  useEffect(() => {
    if (selectedLab) {
      setLabSettings(null); // Clear previous lab's settings
      // Try to fetch custom settings for this lab from backend
      fetch(`/api/labs/public-settings?name=${encodeURIComponent(selectedLab.name)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setLabSettings(data);
            // If the lab has specific working hours, we could set defaults here
            if (data.workingHours && data.workingHours.start) {
              setBookingTime(data.workingHours.start);
            }
          } else {
            setLabSettings(null);
          }
        })
        .catch(err => {
          console.error("Error fetching lab settings:", err);
          setLabSettings(null);
        });
    } else {
      setLabSettings(null);
    }
  }, [selectedLab]);

  // Real-time polling for settings updates when booking modal is open
  useEffect(() => {
    if (!selectedLab || !showBookingModal) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/labs/public-settings?name=${encodeURIComponent(selectedLab.name)}`);
        if (res.ok) {
          const data = await res.json();
          // Check timestamp nested in workingDays (where backend persists it)
          if (data && data.workingDays && data.workingDays.lastUpdated) {
            const currentTimestamp = labSettings?.workingDays?.lastUpdated;
            if (!currentTimestamp || new Date(data.workingDays.lastUpdated) > new Date(currentTimestamp)) {
              // Settings have been updated, refresh them
              setLabSettings(data);
              if (data.workingHours && data.workingHours.start) {
                setBookingTime(data.workingHours.start);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error polling lab settings:", err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [selectedLab, showBookingModal, labSettings?.workingDays?.lastUpdated]);

  // Sync fetched labSettings to list
  useEffect(() => {
    if (selectedLab && labSettings && labSettings.workingHours && labSettings.workingHours.start) {
      const newTime = `${labSettings.workingHours.start} - ${labSettings.workingHours.end}`;
      setLabsList(prev => prev.map(l => l.name === selectedLab.name && l.openTime !== newTime ? { ...l, openTime: newTime } : l));
      setFilteredLabs(prev => prev.map(l => l.name === selectedLab.name && l.openTime !== newTime ? { ...l, openTime: newTime } : l));
    }
  }, [labSettings, selectedLab]);

  // Derived categories based on settings or default
  const currentTestCategories = React.useMemo(() => {
    if (labSettings && Array.isArray(labSettings.tests) && labSettings.tests.length > 0) {
      const disabledTests = labSettings.tests;
      const cats = {};
      Object.keys(TEST_CATEGORIES).forEach(category => {
        const activeTests = TEST_CATEGORIES[category].filter(t => !disabledTests.includes(t));
        if (activeTests.length > 0) {
          cats[category] = activeTests;
        }
      });
      return Object.keys(cats).length > 0 ? cats : TEST_CATEGORIES;
    }
    return TEST_CATEGORIES;
  }, [labSettings]);

  // Payment and additional booking states
  const [bookings, setBookings] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [paymentStep, setPaymentStep] = useState('select'); // 'select', 'upi_scan', 'netbanking_selection', 'card_form'
  const [selectedUpiApp, setSelectedUpiApp] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

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
      const response = await fetch(`/api/user/notifications/${id}`, {
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

  // Handler Functions for Booking
  const handleBookNow = (lab) => {
    setSelectedLab(lab);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingTime('09:00');
    setSelectedTests([]);
    setActiveTestCategory('Blood Tests');
    setShowBookingModal(true);
    setShowLabDetailsModal(false);
  };

  const handleViewDetails = (lab) => {
    setSelectedLab(lab);
    setShowLabDetailsModal(true);
  };

  const toggleTestSelection = (testName) => {
    setSelectedTests(prev => {
      if (prev.includes(testName)) {
        return prev.filter(t => t !== testName);
      } else {
        return [...prev, testName];
      }
    });
  };

  const handleConfirmBooking = async () => {
    try {
      const username = sessionStorage.getItem('username');
      if (!username) {
        alert('Please login to book tests');
        return;
      }

      const bookingData = {
        username,
        labName: selectedLab?.name || '',
        labLocation: selectedLab?.location || '',

        tests: selectedTests.map(t => typeof t === 'object' ? t.name : t),
        date: bookingDate,
        time: bookingTime,
        paymentMethod: paymentMethod,

        totalAmount: selectedTests.reduce((total, test) => total + getTestPrice(test.name || test, selectedLab?.id, labSettings?.tests, selectedLab.name), 0)
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        showToast('Booking confirmed successfully!', 'success');
      } else {
        showToast('Booking failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      showToast('Booking failed. Please try again.', 'error');
    }
  };

  const downloadFile = async (url, filename) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;

      // Determine filename
      let finalFilename = filename;
      if (!finalFilename) {
        const parts = url.split('/');
        finalFilename = parts[parts.length - 1].split('?')[0] || 'download';
      }

      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: simple redirect/open
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = filename || '';
      link.click();
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


      // Calculate total amount - No service fee, only test prices
      const totalAmount = selectedTests.reduce((total, test) => total + getTestPrice(test.name || test, selectedLab?.id, labSettings?.tests, selectedLab.name), 0);

      // Formatted list of tests for Razorpay notes
      const formattedTests = selectedTests.map(t => typeof t === 'object' ? t.name : t).join(', ');

      // Step 1: Create order on backend
      const orderResponse = await fetch('/api/create-payment-order', {
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
        description: "Medical Laboratory Booking",
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            const patientName = sessionStorage.getItem('username') || 'Guest';

            // Verify payment on backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: totalAmount,
                lab_name: selectedLab?.name,
                patient_name: patientName,
                tests: formattedTests,
                appointment_date: bookingDate,
                appointment_time: bookingTime
              })
            });

            if (verifyRes.ok) {
              // Payment verified successfully
              setPaymentMethod('Online');
              setPaymentStatus('Paid');

              // Confirm booking with updated status
              await handleConfirmBooking();

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
    try {
      const response = await fetch(`/api/user/appointments/${id}`, {
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

  const submitFeedback = async () => {
    // Validate that a rating was selected
    if (feedbackRating === 0) {
      showToast("Please select a star rating before submitting.", 'error');
      return;
    }

    // Determine message based on rating
    let message = "Thank you for your feedback!";
    let type = 'success';
    if (feedbackRating >= 4) message = "⭐ We're glad you had a great experience!";
    else if (feedbackRating > 0 && feedbackRating < 4) {
      message = "📝 Thanks. We'll try to improve.";
      type = 'success';
    }

    try {
      const res = await fetch('/api/labs/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lab_id: selectedLab?.id,
          lab_name: selectedLab?.name,
          patient_name: userProfile?.displayName || userProfile?.username || "Guest",
          username: userProfile?.username,
          rating: feedbackRating,
          comment: feedbackText,
          category: "General"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Feedback submission failed:", errData);
        showToast(errData.message || "Failed to submit feedback. Please try again.", 'error');
        return;
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      showToast("Failed to submit feedback. Please try again.", 'error');
      return;
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
      const response = await fetch('/api/chat', {
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
  const [activeLabTab, setActiveLabTab] = useState('Overview'); // Overview, Tests, Reviews


  // Scroll Listener for Navbar
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll Chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

  // Fetch Bookings from Backend
  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/user/appointments', {
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

  // Fetch Reports
  const loadReports = async () => {
    try {
      const response = await fetch('/api/reports', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (e) {
      console.error("Failed to fetch reports:", e);
    }
  };

  useEffect(() => {
    loadReports();
  }, [showReportsModal]); // Refresh when modal opens

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

  // ... (existing functions)

  // Additional reports state
  const [reports, setReports] = useState([]);
  const [activeReportTab, setActiveReportTab] = useState('Uploaded');
  const [selectedReport, setSelectedReport] = useState(null);

  const isAnyModalOpen = showNotifications || showReminders || showMyBookingsModal || showReportsModal || showProfileModal || showBookingModal || showViewerModal;

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
            testPrice: 400 + Math.floor(Math.random() * 400),
            price: 0, // No service fee
            tags: ['General', 'Blood Test', 'Pathology'],
            image: labImages[i % labImages.length],
            openTime: `${7 + (i % 3)}:${15 + (i % 4) * 10} AM - ${6 + (i % 5)}:${(i % 3) * 20} PM`
          });
        }
        return demos;
      };

      // CHECK FOR KANJIRAPALLY DEMO DATA
      // If user searched for Kanjirapally, we FORCE these specific results as per requirement.
      const locationLower = userLocationInput ? userLocationInput.toLowerCase() : "";
      if (locationLower.includes("kanjirapally") || locationLower.includes("kanjirappally") || locationLower.includes("kply")) {
        const kLabsData = [
          { name: "Royal Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Blood Tests, Urine Analysis, Lipid Profile, LFT, KFT, Diabetes Screening", time: "8:30 AM – 5:30 PM", rating: "New", testPrice: 480 },
          { name: "Marymatha Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "CBC, Thyroid Profile, Blood Sugar Test, Urine Test, Pregnancy Test", time: "Open 24 Hours", rating: "New", testPrice: 420 },
          { name: "DDRC SRL Diagnostic Center", location: "Kanjirappally, Kottayam", desc: "Advanced Blood Tests, Hormone Testing, Allergy Testing, Cancer Markers, Health Checkups", time: "9:15 AM – 6:30 PM", rating: "5.0", testPrice: 600 },
          { name: "Sri Diagnostics Pvt (Ltd)", location: "Kanjirappally, Kottayam", desc: "Pathology Tests, Blood Tests, Urine Analysis, Cholesterol Test, Vitamin Tests", time: "9:15 AM – 7:00 PM", rating: "New", testPrice: 500 },
          { name: "Usha Clinic Laboratory", location: "Kanjirappally, Kottayam", desc: "Blood Sugar Testing, CBC, Urine Test, ECG, Health Screening", time: "8:00 AM – 6:30 PM", rating: "4.0", testPrice: 350 },
          { name: "Dianova Laboratory", location: "Kanjirappally, Kottayam", desc: "Blood Tests, Urine Tests, Infection Screening, Liver Function Tests, Kidney Function Tests", time: "Open 24 Hours", rating: "New", testPrice: 550 },
          { name: "Dianova Clinical Laboratory", location: "Kanjirappally, Kottayam", desc: "Blood Tests, Urine Routine Test, Thyroid Tests, CBC", time: "9:45 AM – 4:30 PM", rating: "New", testPrice: 500 },
          { name: "Amala Laboratory", location: "Kanjirappally, Kottayam", desc: "Blood Tests, Urine Analysis, Diabetes Screening, Thyroid Tests, Vitamin Tests", time: "8:00 AM – 8:30 PM", rating: "New", testPrice: 400 },
          { name: "Scanron Diagnostics", location: "Kanjirappally, Kottayam", desc: "Blood Tests, Clinical Laboratory Testing, Diagnostic Packages, Hormone Tests", time: "8:00 AM – 8:00 PM", rating: "New", testPrice: 450 },
          { name: "ClinoTech Laboratories", location: "Kanjirappally, Kottayam", desc: "Diagnostic Laboratory Services, Blood Tests, Urine Tests, Preventive Health Packages", time: "8:30 AM – 6:00 PM", rating: "5.0", testPrice: 650 }
        ];

        const mappedKLabs = kLabsData.map((lab, i) => ({
          id: 8000 + i,
          name: lab.name,
          // Deterministic coordinates based on index to prevent backend duplicates
          lat: userCoords.lat + (((i % 4) - 1.5) * 0.005),
          lon: userCoords.lon + ((Math.floor(i / 4) - 1) * 0.005),
          location: lab.location,
          address: "Central Junction Area, Kanjirapally", // More specific but generic
          rating: String(lab.rating),
          testPrice: lab.testPrice,
          price: 0, // No service fee
          tags: lab.desc.split(',').map(s => s.trim()).slice(0, 3), // Take first 3 tags
          image: labImages[i % labImages.length],
          openTime: lab.time,
          phone: "Contact via App"
        }));

        setLabsList(mappedKLabs);
        setLocationLoading(false);
        return; // Skip fetch
      }

      // CHECK FOR KOCHI DEMO DATA
      if (locationLower.includes("kochi") || locationLower.includes("ernakulam") || locationLower.includes("kochi city")) {
        const kochiLabsData = [
          { name: "Lissy's Clinical Laboratory", location: "Kochi, Kerala", desc: "Pathology Tests, Blood Tests, Urine Tests, Health Screening", time: "7:50 AM – 7:30 PM", rating: "4.6", distance: "0.5 km" },
          { name: "Medivison", location: "Kochi, Kerala", desc: "Pathology Tests, Blood Analysis, Urine Tests, Routine Health Checkups", time: "7:20 AM – 6:30 PM", rating: "4.8", distance: "2.8 km" },
          { name: "Primedical Diagnostics", location: "Kochi, Kerala", desc: "Pathology Tests, Blood Tests, Urine Tests, Health Screening", time: "11:50 AM – 7:30 PM", rating: "4.0", distance: "4.2 km" },
          { name: "Regional Public Health Laboratory", location: "Kochi, Kerala", desc: "Pathology Tests, Public Health Screening, Blood Tests, Diagnostic Testing", time: "9:50 AM – 7:30 PM", rating: "4.7", distance: "4.2 km" },
          { name: "Micro Health Laboratories", location: "Kochi, Kerala", desc: "Microbiology Tests, Blood Tests, Pathology Testing", time: "9:00 AM – 4:30 PM", rating: "4.8", distance: "4.3 km" },
          { name: "Medline Diagnostics Center", location: "Ernakulam, Kochi", desc: "Blood Tests, Clinical Pathology, Diagnostic Packages", time: "10:30 AM – 9:15 PM", rating: "3.5", distance: "4.3 km" },
          { name: "Gulshan Medicare", location: "Kochi, Kerala", desc: "Blood Tests, Urine Tests, Clinical Diagnostics", time: "8:00 AM – 8:15 PM", rating: "4.7", distance: "4.5 km" },
          { name: "Hi-Tech Laboratory", location: "Kochi, Kerala", desc: "Pathology Tests, Blood Tests, Routine Diagnostic Tests", time: "7:00 AM – 8:15 PM", rating: "4.1", distance: "4.6 km" },
          { name: "Trust Diagnostics", location: "Kochi, Kerala", desc: "Blood Tests, Clinical Diagnostics, Health Checkups", time: "7:30 AM – 9:15 PM", rating: "4.4", distance: "4.9 km" },
          { name: "Medivision", location: "Kochi, Kerala", desc: "Pathology Tests, Blood Tests, Urine Analysis", time: "9:15 AM – 5:00 PM", rating: "4.8", distance: "5.0 km" },
          { name: "Celica Medical Center", location: "Ernakulam, Kochi", desc: "Clinical Tests, Blood Tests, Pathology Diagnostics", time: "8:20 AM – 8:30 PM", rating: "4.0", distance: "5.0 km" },
          { name: "DDRC Agilus", location: "Panampilly Nagar, Kochi", desc: "Advanced Diagnostics, Blood Tests, Pathology Testing", time: "8:10 AM – 9:15 PM", rating: "4.0", distance: "5.6 km" },
          { name: "Amma Scans", location: "Kochi, Kerala", desc: "Blood Tests, Clinical Diagnostics, Diagnostic Screening", time: "11:40 AM – 6:15 PM", rating: "4.2", distance: "5.7 km" },
          { name: "King Lab", location: "Kochi, Kerala", desc: "Blood Tests, Urine Tests, Pathology Tests", time: "10:20 AM – 6:30 PM", rating: "4.1", distance: "5.9 km" },
          { name: "Medilab", location: "Kochi, Kerala", desc: "Pathology Tests, Blood Tests, Diagnostic Screening", time: "8:40 AM – 6:15 PM", rating: "3.8", distance: "5.9 km" },
          { name: "Dr Lal Path Labs", location: "Kochi, Kerala", desc: "Advanced Blood Tests, Pathology Tests, Preventive Health Packages", time: "9:40 AM – 8:15 PM", rating: "3.9", distance: "6.0 km" },
          { name: "True Life Medical Company", location: "Kochi, Kerala", desc: "Clinical Tests, Blood Tests, Pathology Diagnostics", time: "As per appointment", rating: "3.8", distance: "6.0 km" }
        ];

        const mappedKochiLabs = kochiLabsData.map((lab, i) => ({
          id: 9000 + i,
          name: lab.name,
          lat: userCoords.lat + (((i % 5) - 2) * 0.006),
          lon: userCoords.lon + ((Math.floor(i / 5) - 1.5) * 0.006),
          location: lab.location,
          address: `${lab.name}, ${lab.location}`,
          rating: String(lab.rating),
          distance: lab.distance,
          testPrice: 350 + (i * 10),
          price: 0,
          tags: lab.desc.split(',').map(s => s.trim()).slice(0, 3),
          image: labImages[i % labImages.length],
          openTime: lab.time,
          phone: "Contact via App"
        }));

        setLabsList(mappedKochiLabs);
        setLocationLoading(false);
        return;
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
                rating: ENHANCED_LAB_DATA[validName]?.details.rating || (3.5 + Math.random() * 1.5).toFixed(1),
                testPrice: Math.floor((300 + Math.random() * 400) / 50) * 50,
                price: 0, // No service fee
                tags: ['Pathology', 'Clinical Test'],
                image: labImages[i % labImages.length],
                openTime: ENHANCED_LAB_DATA[validName]?.details.workingHours || t.opening_hours || `${7 + (i % 5)}:${(i % 6) * 10 || '00'} AM - ${6 + (i % 4)}:${(i % 3) * 15 || '15'} PM`,
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

  // Fetch working hours for each lab from backend after labs are loaded
  useEffect(() => {
    if (labsList.length > 0) {
      const fetchWorkingHoursForLabs = async () => {
        const updatedLabs = await Promise.all(labsList.map(async (lab) => {
          try {
            const response = await fetch(`http://localhost:5000/api/labs/working-hours?name=${encodeURIComponent(lab.name)}`);
            if (response.ok) {
              const data = await response.json();
              if (data.workingHours) {
                const start = data.workingHours.start || '09:00';
                const end = data.workingHours.end || '19:00';

                // Convert 24-hour format to 12-hour format with AM/PM
                const formatTime = (time24) => {
                  const [hours, minutes] = time24.split(':');
                  const h = parseInt(hours);
                  const ampm = h >= 12 ? 'PM' : 'AM';
                  const h12 = h % 12 || 12;
                  return `${h12}:${minutes} ${ampm}`;
                };

                return {
                  ...lab,
                  openTime: `${formatTime(start)} - ${formatTime(end)}`
                };
              }
            }
          } catch (e) {
            console.error(`Error fetching working hours for ${lab.name}:`, e);
          }
          return lab;
        }));

        // Only update if there were actual changes to avoid infinite loop
        const hasChanges = updatedLabs.some((lab, idx) => lab.openTime !== labsList[idx].openTime);
        if (hasChanges) {
          setLabsList(updatedLabs);
        }
      };

      fetchWorkingHoursForLabs();
    }
  }, [labsList.length]); // Only run when labs count changes


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
      } finally {
        setIsInitialLoading(false);
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

  // Lock body scroll when modals are open to prevent double scrollers
  useEffect(() => {
    const isModalOpen = showReportsModal || showLabDetailsModal || showViewerModal || showPaymentModal || showReminders || showMyBookingsModal;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showReportsModal, showLabDetailsModal, showViewerModal, showPaymentModal, showReminders, showMyBookingsModal]);

  if (isInitialLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f9ff' }}>
        <div className="spinner"></div>
        <span style={{ marginLeft: '12px', color: '#3b82f6', fontWeight: 600 }}>Loading MediBot...</span>
      </div>
    );
  }

  return (
    <div className="landing-container" style={{
      backgroundImage: `linear-gradient(rgba(240, 249, 255, 0.95), rgba(240, 249, 255, 0.98)), url(${dnaBg})`,
      backgroundAttachment: 'fixed',
      backgroundSize: '800px'
    }}>
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
                {/* Professional Lab Logo/Image Container */}
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                  {/* Outer gradient ring */}
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    right: '-6px',
                    bottom: '-6px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #3b82f6 100%)',
                    borderRadius: '50%',
                    padding: '3px',
                    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3), 0 0 0 4px rgba(14, 165, 233, 0.1)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}>
                    {/* White ring separator */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'white',
                      borderRadius: '50%',
                      padding: '4px'
                    }}>
                      {/* Main image container */}
                      <div className="sidebar-avatar" style={{
                        backgroundImage: `url(${selectedLab.image})`,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.1)',
                        background: selectedLab.image
                          ? `url(${selectedLab.image})`
                          : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Medical icon overlay when no image */}
                        {!selectedLab.image && (
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {/* Medical cross/plus icon */}
                            <div style={{
                              width: '36px',
                              height: '36px',
                              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
                            }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M2 12h20" />
                              </svg>
                            </div>
                            {/* Lab beaker icon */}
                            <div style={{
                              fontSize: '10px',
                              color: '#0ea5e9',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Lab
                            </div>
                          </div>
                        )}

                        {/* Verified badge */}
                        <div style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '50%',
                          border: '3px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                          zIndex: 10
                        }}>
                          <IconCheckCircle size={16} color="white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pulse animation */}
                <style>{`
                  @keyframes pulse {
                    0%, 100% {
                      box-shadow: 0 8px 32px rgba(14, 165, 233, 0.3), 0 0 0 4px rgba(14, 165, 233, 0.1);
                    }
                    50% {
                      box-shadow: 0 8px 32px rgba(14, 165, 233, 0.5), 0 0 0 8px rgba(14, 165, 233, 0.15);
                    }
                  }
                `}</style>

                <div className="sidebar-info">
                  <h3 style={{ fontSize: '1.4rem', color: '#1e293b' }}>{selectedLab.name}</h3>

                  <div className="sidebar-rating" style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
                    <span style={{ color: '#d97706', fontWeight: 800 }}>{selectedLab.rating}</span>
                    <IconStar fill="#f59e0b" color="#f59e0b" size={16} />
                  </div>

                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.5rem', color: '#64748b' }}>
                    <IconMapPin size={14} /> {selectedLab.location}
                  </p>
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
                          {Object.keys(currentTestCategories).map(cat => (
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
                        {(() => {
                          const availableTests = labSettings && labSettings.tests && labSettings.tests.length > 0
                            ? (labSettings.tests.filter(t => t.category === activeTestCategory && t.enabled).map(t => t.name))
                            : (getLabAvailableTests(selectedLab.id, selectedLab.name)[activeTestCategory] || []);

                          return availableTests.map(test => (
                            <option key={test} value={test} disabled={selectedTests.includes(test)}>
                              {test} - ₹{getTestPrice(test, selectedLab?.id, labSettings?.tests, selectedLab.name)} {selectedTests.includes(test) ? '(Selected)' : ''}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>
                  </div>

                  {/* Selected Tests Tags - Full Width */}
                  <div style={{ minHeight: '40px', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    {selectedTests.length === 0 && <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>No tests selected yet.</span>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {selectedTests.map(test => (


                        <div key={test} className="selected-test-chip" style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', padding: '0.5rem 1rem' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{test} (₹{getTestPrice(test, selectedLab?.id, labSettings?.tests, selectedLab.name)})</span>
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
                      <CalendarPicker
                        selectedDate={bookingDate}
                        onSelect={setBookingDate}
                        labSettings={labSettings}
                      />
                    </div>
                    <div>
                      <label className="fs-label" style={{ marginBottom: '0.75rem' }}><IconClock size={16} style={{ marginBottom: -3, marginRight: 8, color: 'var(--primary)' }} /> Preferred Time</label>
                      <input className="fs-input" type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} style={{ marginBottom: 0, height: '48px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="booking-footer" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p className="total-est-label" style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Testing Cost</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '0.5rem' }}>


                        <p className="total-est-amount" style={{ fontSize: '2rem', color: '#0f172a' }}>₹{selectedTests.reduce((total, test) => total + getTestPrice(test.name || test, selectedLab?.id, labSettings?.tests, selectedLab.name), 0)}</p>
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
                    {ENHANCED_LAB_DATA[selectedLab.name]?.description || `${selectedLab.name} is a state-of-the-art diagnostic center providing comprehensive services. Known for accurate reports and quick turnaround time. Verified by MediBot for quality assurance.`}
                  </p>

                  {ENHANCED_LAB_DATA[selectedLab.name] && (
                    <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a' }}>Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                          <IconMapPin size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Location:</strong> {ENHANCED_LAB_DATA[selectedLab.name].details.location}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                          <IconClock size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Working Hours:</strong> {(labSettings && labSettings.workingHours && labSettings.workingHours.start) ? `${labSettings.workingHours.start} - ${labSettings.workingHours.end}` : ENHANCED_LAB_DATA[selectedLab.name].details.workingHours}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                          <IconActivity size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Services:</strong> {ENHANCED_LAB_DATA[selectedLab.name].details.services}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                          <IconShield size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Home Sample Collection:</strong> {ENHANCED_LAB_DATA[selectedLab.name].details.homeCollection}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                          <IconBell size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Report Delivery:</strong> {ENHANCED_LAB_DATA[selectedLab.name].details.reportDelivery}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                          <IconUser size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Staff:</strong> {ENHANCED_LAB_DATA[selectedLab.name].details.staff}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#475569', fontSize: '0.95rem' }}>
                          <IconStar size={18} style={{ color: '#0ea5e9', flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Rating:</strong> {ENHANCED_LAB_DATA[selectedLab.name].details.rating}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!ENHANCED_LAB_DATA[selectedLab.name] && (
                    <>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Available Amenities</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                        {['Home Collection', 'Digital Reports', '24/7 Support', 'Wheelchair Access'].map(item => (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                            <IconCheckCircle size={16} style={{ color: 'var(--secondary)' }} />
                            {item}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}


              {activeLabTab === 'Tests & Pricing' && (
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Available Tests</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(() => {
                      let displayTests = [];

                      const labTests = getLabAvailableTests(selectedLab.id, selectedLab.name);
                      const allNames = Object.values(labTests).flat();
                      displayTests = allNames.map(name => ({ name, price: getTestPrice(name, selectedLab.id, null, selectedLab.name) }));

                      if (labSettings && Array.isArray(labSettings.tests) && labSettings.tests.length > 0) {
                        displayTests = displayTests.filter(t => !labSettings.tests.includes(t.name));
                      }

                      return displayTests.map((test, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                          <div>
                            <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)' }}>{test.name}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Report in 24 hrs</span>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                            ₹{test.price}
                          </div>
                        </div>
                      ));
                    })()}
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
              <div style={{ visibility: 'hidden' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Test Price (per test)</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{selectedLab.testPrice}</span>
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
            <button className="nav-item-btn" onClick={() => { setShowReportsModal(true); loadReports(); }}>
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

                <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {/* Uploaded Reports */}
                  {activeReportTab === 'Uploaded' && (
                    <>
                      {reports.filter(r => r.type === 'Uploaded').length > 0 ? (
                        reports.filter(r => r.type === 'Uploaded').map((report) => (
                          <div key={report.id} className="report-card" style={{
                            background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                            borderRadius: '20px',
                            padding: '1.25rem',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
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

                              {/* Prescription Image Preview */}
                              <div style={{
                                height: '110px',
                                background: '#f1f5f9',
                                borderRadius: '16px',
                                marginBottom: '1.5rem',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #e2e8f0',
                                position: 'relative'
                              }}>
                                {report.file_path ? (
                                  <img
                                    src={report.file_path}
                                    alt="Prescription"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : null}
                                <div style={{ position: 'absolute', color: '#cbd5e1', zIndex: 0 }}>
                                  <IconFileText size={48} />
                                </div>
                              </div>

                              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#1e293b', fontWeight: 700 }}>{report.test_name || `Prescription #${report.id}`}</h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                <IconCalendar size={14} />
                                <span>{report.date ? new Date(report.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                              </div>

                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                  onClick={() => { setSelectedReport(report); setShowViewerModal(true); }}
                                  style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '0.8rem',
                                    borderRadius: '14px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                  }}
                                >
                                  <IconEye /> View
                                </button>
                                <button
                                  onClick={() => {
                                    const isPdf = report.file_path.toLowerCase().endsWith('.pdf');
                                    downloadFile(report.file_path, `Prescription_${report.id}.${isPdf ? 'pdf' : 'jpg'}`);
                                  }}
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
                                  <IconDownload /> Download
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
                      {reports.filter(r => r.type === 'Generated').length > 0 ? (
                        reports.filter(r => r.type === 'Generated').map((report) => (
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
                              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#064e3b', fontWeight: 800 }}>{report.test_name || `Lab Report #${report.id}`}</h4>
                              <p style={{ margin: 0, color: '#059669', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, opacity: 0.8 }}>
                                <IconCalendar size={14} /> Issued on {new Date(report.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}
                              </p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <button
                                onClick={() => { setSelectedReport(report); setShowViewerModal(true); }}
                                style={{
                                  flex: 1,
                                  padding: '1rem',
                                  borderRadius: '16px',
                                  border: 'none',
                                  background: '#dcfce7',
                                  color: '#059669',
                                  fontWeight: 800,
                                  fontSize: '0.95rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#bbf7d0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#dcfce7'}
                              >
                                <IconEye size={20} /> View
                              </button>
                              <button
                                onClick={() => downloadFile(report.file_path, `Lab_Result_${report.id}.pdf`)}
                                style={{
                                  flex: 1.5,
                                  padding: '1rem',
                                  borderRadius: '16px',
                                  border: 'none',
                                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                  color: 'white',
                                  fontWeight: 800,
                                  fontSize: '0.95rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.5rem',
                                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                              >
                                <IconDownload size={20} /> Download
                              </button>
                            </div>
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
              {/* Professional Header */}
              <div style={{
                padding: '0 0 1.5rem 0',
                borderBottom: '3px solid #e0f2fe',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#0c4a6e',
                  letterSpacing: '-0.02em'
                }}>My Profile</h2>
              </div>

              <div className="fs-split-layout">
                {/* Sidebar: Avatar & Actions */}
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  maxWidth: '320px'
                }}>
                  <input
                    type="file"
                    ref={profilePicInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                  />

                  {/* Professional Avatar */}
                  <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <div
                      onClick={() => profilePicInputRef.current.click()}
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: profilePic
                          ? `url(${profilePic})`
                          : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        border: '4px solid #f0f9ff',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.15)';
                      }}
                      title="Click to upload profile picture"
                    >
                      {!profilePic && <IconUser size={60} color="#0ea5e9" />}

                      {/* Edit Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        background: '#0ea5e9',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '3px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)'
                      }}>
                        <IconUploadCloud size={16} color="white" />
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#0c4a6e',
                      letterSpacing: '-0.02em'
                    }}>{displayName}</h3>
                    {userProfile?.username && (
                      <p style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '0.95rem',
                        color: '#64748b',
                        fontWeight: 500
                      }}>@{userProfile.username}</p>
                    )}
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#94a3b8',
                      fontWeight: 400
                    }}>{userProfile?.email || 'No Email'}</p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.5rem',
                      borderRadius: '12px',
                      border: '2px solid #fee2e2',
                      background: 'white',
                      color: '#ef4444',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#fee2e2';
                    }}
                  >
                    Logout
                  </button>
                </div>

                {/* Main Content: Details Form */}
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f1f5f9',
                  flex: 1
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.6rem',
                      margin: 0,
                      color: '#0c4a6e',
                      fontWeight: 700,
                      letterSpacing: '-0.02em'
                    }}>Personal Information</h3>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        style={{
                          padding: '0.7rem 1.5rem',
                          borderRadius: '10px',
                          border: '2px solid #0ea5e9',
                          background: 'white',
                          color: '#0ea5e9',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                        }}
                      >
                        <IconUser size={16} /> Edit Profile
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem 3rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>Username</label>
                      {isEditingProfile ? (
                        <input
                          className="fs-input"
                          value={patientDetails.username !== undefined ? patientDetails.username : (userProfile?.username || '')}
                          onChange={e => setPatientDetails({ ...patientDetails, username: e.target.value })}
                          placeholder="Enter username"
                          style={{
                            marginBottom: 0,
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: '#0ea5e9',
                          padding: '0.3rem 0'
                        }}>{userProfile?.username ? `@${userProfile.username}` : '--'}</div>
                      )}
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>Email Address</label>
                      <div style={{
                        fontSize: '1.05rem',
                        fontWeight: 500,
                        color: '#0c4a6e',
                        padding: '0.3rem 0'
                      }}>{userProfile?.email || 'No Email'}</div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>Age</label>
                      {isEditingProfile ? (
                        <input
                          className="fs-input"
                          type="number"
                          placeholder="Eg. 28"
                          value={patientDetails.age}
                          onChange={e => setPatientDetails({ ...patientDetails, age: e.target.value })}
                          style={{
                            marginBottom: 0,
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 500,
                          color: '#0c4a6e',
                          padding: '0.3rem 0'
                        }}>{patientDetails.age || '--'}</div>
                      )}
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>Gender</label>
                      {isEditingProfile ? (
                        <select
                          className="fs-input"
                          value={patientDetails.gender}
                          onChange={e => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                          style={{
                            marginBottom: 0,
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        >
                          <option value="">Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      ) : (
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 500,
                          color: '#0c4a6e',
                          padding: '0.3rem 0'
                        }}>{patientDetails.gender || '--'}</div>
                      )}
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>Blood Group</label>
                      {isEditingProfile ? (
                        <select
                          className="fs-input"
                          value={patientDetails.bloodGroup}
                          onChange={e => setPatientDetails({ ...patientDetails, bloodGroup: e.target.value })}
                          style={{
                            marginBottom: 0,
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        >
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
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 500,
                          color: '#0c4a6e',
                          padding: '0.3rem 0'
                        }}>{patientDetails.bloodGroup || '--'}</div>
                      )}
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>Contact Number</label>
                      {isEditingProfile ? (
                        <input
                          className="fs-input"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={patientDetails.contact}
                          onChange={e => setPatientDetails({ ...patientDetails, contact: e.target.value })}
                          style={{
                            marginBottom: 0,
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 500,
                          color: '#0c4a6e',
                          padding: '0.3rem 0'
                        }}>{patientDetails.contact || '--'}</div>
                      )}
                    </div>

                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.6rem',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em'
                      }}>Home Address</label>
                      {isEditingProfile ? (
                        <textarea
                          className="fs-input"
                          rows="3"
                          placeholder="Enter full address for home collection..."
                          value={patientDetails.savedLocation}
                          onChange={e => setPatientDetails({ ...patientDetails, savedLocation: e.target.value })}
                          style={{
                            marginBottom: 0,
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem',
                            resize: 'vertical'
                          }}
                        ></textarea>
                      ) : (
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 500,
                          lineHeight: 1.6,
                          color: '#0c4a6e',
                          padding: '0.3rem 0'
                        }}>{patientDetails.savedLocation || '--'}</div>
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

              <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                {notifications.length > 0 ? (() => {
                  const groups = groupNotifications(notifications);
                  return Object.entries(groups).map(([label, notifs]) => {
                    if (notifs.length === 0) return null;
                    return (
                      <div key={label}>
                        <div className="notif-group-header">{label}</div>
                        {notifs.map(n => {
                          // Detect bill notification
                          const isBill = n.message && n.message.startsWith('BILL_JSON:');
                          let billData = null;
                          if (isBill) {
                            try { billData = JSON.parse(n.message.replace('BILL_JSON:', '')); } catch (e) { }
                          }

                          const config = (() => {
                            if (isBill) {
                              return {
                                title: 'Payment Receipt',
                                icon: <IconCreditCard size={24} color="#10b981" />,
                                bg: '#ecfdf5',
                                type: 'bill'
                              };
                            }
                            const msg = n.message.toLowerCase();
                            if (msg.includes('confirmed') || msg.includes('appointment')) {
                              return {
                                title: 'Appointment Confirmed',
                                icon: <IconCalendar size={24} color="#f97316" />,
                                bg: '#fff7ed',
                                type: 'appointment'
                              };
                            }
                            if (msg.includes('report') || msg.includes('results')) {
                              return {
                                title: 'New Laboratory Results',
                                icon: <IconMicroscope size={24} color="#3b82f6" />,
                                bg: '#eff6ff',
                                type: 'report'
                              };
                            }
                            if (msg.includes('prescription')) {
                              return {
                                title: 'Prescription Refill Ready',
                                icon: <IconClipboard size={24} color="#10b981" />,
                                bg: '#ecfdf5',
                                type: 'prescription'
                              };
                            }
                            if (msg.includes('survey') || msg.includes('feedback')) {
                              return {
                                title: 'Post-Visit Survey',
                                icon: <IconMessageCircle size={24} color="#f59e0b" />,
                                bg: '#fffbeb',
                                type: 'survey'
                              };
                            }
                            return {
                              title: 'Notification',
                              icon: <IconBell size={24} color="var(--primary)" />,
                              bg: 'var(--primary-light)',
                              type: 'default'
                            };
                          })();

                          // Extract clean description
                          const cleanDesc = isBill && billData
                            ? `Payment of ₹${billData.payment_amount} for ${billData.tests_booked || 'tests'} at ${billData.lab_name} — ${billData.payment_status}`
                            : n.message
                              .replace(/\*/g, '')
                              .replace(/✅|🏥|📅|🧪|💳|👤|🔑/g, '')
                              .trim();

                          return (
                            <div key={n.id} className="notif-card" style={{ opacity: n.isRead ? 0.7 : 1 }}>
                              <div className="notif-icon-container" style={{ background: config.bg }}>
                                {config.icon}
                              </div>
                              <div className="notif-content">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                  <div style={{ flex: 1 }}>
                                    <h3 className="notif-title">{config.title}</h3>
                                    <p className="notif-desc">
                                      {cleanDesc}
                                    </p>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <span className="notif-time">{getRelativeTime(n.date)}</span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); clearNotification(n.id); }}
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fee2e2'; }}
                                      onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                                      title="Delete notification"
                                    >
                                      <IconTrash size={16} />
                                    </button>
                                  </div>
                                </div>

                                {config.type === 'bill' && billData && (
                                  <div className="notif-actions">
                                    <button
                                      className="notif-btn notif-btn-primary"
                                      onClick={() => { setSelectedBillNotification(billData); setShowBillNotificationModal(true); markNotificationRead(n.id); }}
                                    >
                                      View Bill
                                    </button>
                                  </div>
                                )}

                                {config.type === 'report' && (
                                  <div className="notif-actions">
                                    <button className="notif-btn notif-btn-primary" onClick={() => setShowReportsModal(true)}>View All Reports</button>
                                  </div>
                                )}

                                {!n.isRead && (
                                  <button
                                    className="notif-badge"
                                    onClick={() => markNotificationRead(n.id)}
                                    style={{
                                      background: 'var(--primary)',
                                      width: '10px',
                                      height: '10px',
                                      borderRadius: '50%',
                                      padding: 0,
                                      border: '2px solid white',
                                      cursor: 'pointer'
                                    }}
                                    title="Mark as read"
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  });
                })() : (
                  <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ background: 'var(--primary-light)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <IconBell size={40} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>All Caught Up!</h3>
                    <p style={{ color: '#64748b' }}>No new notifications at the moment. We'll alert you when something important happens.</p>
                  </div>
                )}

                {notifications.length > 5 && (
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button className="notif-btn notif-btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      View Older Notifications <IconActivity size={16} style={{ transform: 'rotate(90deg)' }} />
                    </button>
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
          {/* Decorative Molecule Background */}
          <img
            src={moleculesBg}
            alt=""
            style={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '300px',
              opacity: 0.05,
              pointerEvents: 'none',
              animation: 'spin-slow 60s linear infinite'
            }}
          />
          <style>{`
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
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
              <div className="lab-card" key={lab.id} onClick={() => handleViewDetails(lab)} style={{ cursor: 'pointer', position: 'relative' }}>
                {/* Working Hours Floating Tag */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.5)'
                }}>
                  <IconClock size={14} /> {lab.openTime}
                </div>
                <div className="lab-image-placeholder">
                  <img src={lab.image} alt={lab.name} onError={(e) => e.target.style.display = 'none'} />
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

                      {/* Bill Summary - Professional Invoice Design */}
                      <div style={{
                        background: 'white',
                        padding: '0',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                      }}>
                        {/* Bill Header - Receipt Style */}
                        <div style={{
                          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
                          padding: '0.8rem 1rem',
                          borderBottom: '2px dashed #e2e8f0',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* Decorative circles for receipt feel */}
                          <div style={{
                            position: 'absolute',
                            left: '-6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '12px',
                            height: '12px',
                            background: '#f8fafc',
                            borderRadius: '50%'
                          }}></div>
                          <div style={{
                            position: 'absolute',
                            right: '-6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '12px',
                            height: '12px',
                            background: '#f8fafc',
                            borderRadius: '50%'
                          }}></div>

                          <h3 style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            <span style={{ fontSize: '1rem' }}>📋</span>
                            Bill Summary
                          </h3>
                          <p style={{
                            margin: '0.2rem 0 0 0',
                            fontSize: '0.7rem',
                            color: '#bae6fd',
                            fontWeight: 500
                          }}>Invoice for Laboratory Services</p>
                        </div>

                        {/* Laboratory Info Card */}
                        <div style={{
                          padding: '0.8rem 1rem',
                          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                          borderBottom: '2px dashed #cbd5e1'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: '#0c4a6e',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.5rem'
                              }}>
                                <span style={{ fontSize: '1rem' }}>🏥</span>
                                {selectedLab?.name || 'Laboratory'}
                              </div>
                              {selectedLab?.location && (
                                <div style={{
                                  fontSize: '0.85rem',
                                  color: '#64748b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem'
                                }}>
                                  <span>📍</span> {selectedLab.location}
                                </div>
                              )}
                            </div>

                            {/* Date & Time Badge */}
                            <div style={{
                              background: 'white',
                              padding: '0.8rem 1rem',
                              borderRadius: '10px',
                              border: '2px solid #0ea5e9',
                              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.15)'
                            }}>
                              <div style={{
                                fontSize: '0.75rem',
                                color: '#64748b',
                                fontWeight: 600,
                                marginBottom: '0.3rem',
                                textAlign: 'center'
                              }}>Appointment</div>
                              <div style={{
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#0c4a6e',
                                fontSize: '0.9rem'
                              }}>
                                <span>📅</span> {bookingDate ? new Date(bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '--'}
                              </div>
                              <div style={{
                                marginTop: '0.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#0c4a6e',
                                fontSize: '0.9rem',
                                fontWeight: 600
                              }}>
                                <span>⏰</span> {bookingTime || '--'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tests List Section */}
                        <div style={{ padding: '0.8rem 1rem', background: 'white' }}>
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#64748b',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            paddingBottom: '0.5rem',
                            borderBottom: '1px solid #e2e8f0'
                          }}>
                            Selected Tests ({selectedTests.length})
                          </div>

                          {/* Tests Items */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {selectedTests.length > 0 ? selectedTests.map((test, idx) => (
                              <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem',
                                background: '#f8fafc',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700
                                  }}>{idx + 1}</span>
                                  <span style={{
                                    fontSize: '0.9rem',
                                    color: '#0f172a',
                                    fontWeight: 600
                                  }}>
                                    {test.name || test}
                                  </span>
                                </div>
                                <span style={{
                                  fontSize: '0.95rem',
                                  fontWeight: 700,
                                  color: '#0c4a6e'
                                }}>
                                  ₹{getTestPrice(test.name || test, selectedLab?.id, labSettings?.tests, selectedLab.name)}
                                </span>
                              </div>
                            )) : (
                              <div style={{
                                textAlign: 'center',
                                padding: '2rem',
                                color: '#94a3b8',
                                fontSize: '0.9rem'
                              }}>
                                No tests selected
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Subtotal Section */}
                        <div style={{
                          padding: '0.6rem 1rem',
                          background: '#f8fafc',
                          borderTop: '1px dashed #cbd5e1',
                          borderBottom: '1px dashed #cbd5e1'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                              Tests Subtotal
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                              ₹{selectedTests.reduce((total, test) => total + getTestPrice(test.name || test, selectedLab?.id, labSettings?.tests, selectedLab.name), 0)}
                            </span>
                          </div>
                        </div>

                        {/* Total Section - Highlighted */}
                        <div style={{
                          padding: '0.8rem 1rem',
                          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                          borderTop: '3px solid #0ea5e9'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.8rem'
                          }}>
                            <div>
                              <div style={{
                                fontSize: '0.8rem',
                                color: '#64748b',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '0.3rem'
                              }}>Total Amount</div>
                              <div style={{
                                fontSize: '2rem',
                                fontWeight: 800,
                                color: '#0c4a6e',
                                lineHeight: 1
                              }}>
                                ₹{selectedTests.reduce((total, test) => total + getTestPrice(test.name || test, selectedLab?.id, labSettings?.tests, selectedLab.name), 0)}
                              </div>
                            </div>

                            {/* Payment Icon */}
                            <div style={{
                              width: '50px',
                              height: '50px',
                              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                            }}>
                              <span style={{ fontSize: '1.5rem' }}>💳</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {/* Cancel Button */}
                            <button
                              onClick={() => setShowPaymentModal(false)}
                              style={{
                                padding: '0.7rem 1rem',
                                borderRadius: '8px',
                                background: 'white',
                                color: '#64748b',
                                border: '2px solid #e2e8f0',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
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
                                flex: 1,
                                padding: '0.7rem 1rem',
                                borderRadius: '8px',
                                background: 'white',
                                color: '#0c4a6e',
                                border: '2px solid #0ea5e9',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f9ff'; }}
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
                                flex: 1.5,
                                padding: '0.7rem 1rem',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                color: 'white',
                                border: 'none',
                                fontSize: '0.9rem',
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

            <div className="simple-chat-messages" ref={chatMessagesRef}>
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


      {/* Report Viewer Modal */}
      {
        showViewerModal && selectedReport && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '2rem'
          }}>
            <div style={{
              background: 'white',
              width: '100%',
              maxWidth: '750px',
              height: '80vh',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <div>
                  <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 700 }}>{selectedReport.test_name || 'Medical Document'}</h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' }) : 'Date unknown'}
                  </p>
                </div>
                <button
                  onClick={() => setShowViewerModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '12px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                  <IconX size={20} />
                </button>
              </div>

              <div style={{ flex: 1, position: 'relative', background: '#f8fafc', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {selectedReport.file_path && (selectedReport.file_path.toLowerCase().includes('.pdf') || selectedReport.file_type === 'application/pdf') ? (
                  <iframe
                    src={selectedReport.file_path}
                    title="PDF Viewer"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <img
                      src={selectedReport.file_path}
                      alt="Prescription"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '55vh',
                        objectFit: 'contain',
                        borderRadius: '12px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        cursor: 'zoom-in',
                        backgroundColor: 'white'
                      }}
                      onClick={() => window.open(selectedReport.file_path, '_blank')}
                      onError={(e) => {
                        if (!e.target.src.includes('placeholder')) {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x600?text=Wait+for+Sync...+Or+View+Original';
                        }
                      }}
                    />
                    <div style={{ marginTop: '1.5rem' }}>
                      <button
                        onClick={() => window.open(selectedReport.file_path, '_blank')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#3b82f6',
                          textDecoration: 'underline',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <IconEye size={18} /> View High Quality Original
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexShrink: 0 }}>
                <button
                  onClick={() => setShowViewerModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  Close
                </button>
                <button
                  onClick={() => downloadFile(selectedReport.file_path, `${selectedReport.test_name || 'Report'}_${selectedReport.id}.${selectedReport.file_path.toLowerCase().includes('.pdf') ? 'pdf' : 'jpg'}`)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  <IconDownload size={18} /> Download
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Bill Receipt Modal (from payment notification) */}
      {showBillNotificationModal && selectedBillNotification && (() => {
        const b = selectedBillNotification;
        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '450px', maxWidth: '95vw', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Payment Receipt</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>TXN: {b.payment_id || 'N/A'}</p>
              </div>

              <div style={{ borderTop: '1px dashed #e2e8f0', borderBottom: '1px dashed #e2e8f0', padding: '24px 0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Patient Name</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.patient_name || 'Patient'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Laboratory</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.lab_name || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Date</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.payment_date || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Time</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.payment_time || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Tests Ordered</span>
                  <span style={{ fontWeight: 600, color: '#0369a1', textAlign: 'right', maxWidth: '60%' }}>{b.tests_booked || 'General Checkup'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Payment Method</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.payment_method || 'Online'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Total Amount</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1' }}>₹{b.payment_amount || 0}</span>
                </div>
              </div>

              <button
                onClick={() => { setShowBillNotificationModal(false); setSelectedBillNotification(null); }}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', marginTop: '4px', border: 'none', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                Done &amp; Close
              </button>
              <button
                onClick={() => window.print()}
                style={{ width: '100%', marginTop: '12px', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <IconDownload size={16} /> Print Receipt
              </button>
            </div>
          </div>
        );
      })()}
    </div >
  );
};

export default LandingPage;
