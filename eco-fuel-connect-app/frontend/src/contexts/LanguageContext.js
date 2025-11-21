import React, { createContext, useContext, useState, useEffect } from 'react';

// Language translations
const translations = {
  en: {
    // Welcome Page
    welcomeTitle: "Welcome to EcoFuelConnect",
    welcomeSubtitle: "Transforming Organic Waste into Clean Energy for South Sudan Schools",
    getStarted: "Get Started",
    learnMore: "Learn More",
    signIn: "Sign In",
    
    // Sidebar & Navigation
    dashboard: "Dashboard",
    overview: "Overview",
    wasteLogging: "Waste Logging",
    organicWasteLogging: "Organic Waste Logging",
    fuelRequestManagement: "Fuel Request Management",
    fuelRequests: "Fuel Requests",
    myRewards: "My Rewards",
    messages: "Messages",
    notifications: "Notifications",
    projects: "Projects",
    ourProjects: "Our Projects",
    about: "About",
    aboutUs: "About Us",
    contact: "Contact",
    contactUs: "Contact Us",
    reports: "Reports",
    settings: "Settings",
    help: "Help",
    logout: "Logout",
    profile: "Profile",
    
    // Dashboard Stats
    wasteLogged: "Waste Logged",
    biogasProduced: "Biogas Produced",
    schools: "Schools",
    totalUsers: "Total Users",
    carbonReduction: "Carbon Reduction",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    close: "Close",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    
    // Settings
    applicationSettings: "Application Settings",
    language: "Language",
    theme: "Theme",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    
    // Waste Logging
    logWaste: "Log Waste",
    viewEntries: "View Entries",
    wasteType: "Waste Type",
    quantity: "Quantity",
    location: "Location",
    description: "Description",
    
    // Fuel Request
    createNewFuelRequest: "Create New Fuel Request",
    myFuelRequests: "My Fuel Requests",
    fuelType: "Fuel Type",
    priority: "Priority",
    deliveryAddress: "Delivery Address",
    
    // Chatbot
    chatbot: "Chatbot",
    askQuestion: "Ask a question...",
    send: "Send",
    howCanIHelp: "How can I help you today?",
    
    // Footer
    home: "Home",
    allRightsReserved: "All rights reserved",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    footerTagline: "Empowering South Sudan through sustainable biogas technology and organic waste management.",
    
    // Admin
    educationalContent: "Educational Content",
    contentManagement: "Content Management",
    userManagement: "User Management",
    
    // About Page
    aboutPageSubtitle: "Pioneering Africa's first integrated biogas ecosystem - where technology meets sustainability",
    ourMission: "Our Mission",
    ourVision: "Our Vision",
    whatWeDo: "What We Do",
    wasteManagement: "Waste Management",
    biogasProduction: "Biogas Production",
    schoolFuelDelivery: "School Fuel Delivery",
    impactStatistics: "Impact Statistics",
    partnerOrganizations: "Partner Organizations",
    livesImpacted: "Lives Impacted",
    userSatisfaction: "User Satisfaction",
    platformUptime: "Platform Uptime",
    missionText: "We're revolutionizing South Sudan's energy landscape by creating the first comprehensive digital platform that transforms organic waste into opportunity. Our mission goes beyond technology—we're building a movement that empowers communities, protects forests, and saves lives by making clean biogas accessible to every household and school.",
    visionText: "Imagine a South Sudan where every child breathes clean air, every forest thrives, and every community has reliable energy. We're making this vision reality by 2030—connecting 10,000 households, eliminating 500,000 tons of CO₂ annually, and creating 5,000 green jobs. Our platform will become the blueprint for sustainable waste-to-energy transformation across Africa.",
    wasteManagementText: "Smart digital tracking system capturing every kilogram of waste with GPS verification, photo documentation, and blockchain-secured supplier records—ensuring complete transparency from source to biogas",
    biogasProductionText: "AI-powered analytics dashboard providing live production metrics, predictive maintenance alerts, and efficiency recommendations—maximizing output while minimizing operational costs",
    schoolFuelDeliveryText: "Automated scheduling and route optimization connecting producers directly with schools—guaranteeing on-time delivery, quality assurance, and fair pricing through our verified marketplace",
    
    // Contact Page
    contactPageSubtitle: "Get in touch with the EcoFuelConnect team",
    sendUsMessage: "Send us a Message",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    subject: "Subject",
    message: "Message",
    sendMessage: "Send Message",
    sending: "Sending...",
    messageSentSuccess: "Message sent successfully!",
    contactInformation: "Contact Information",
    address: "Address",
    phone: "Phone",
    email: "Email",
    officeHours: "Office Hours",
    mondayFriday: "Monday - Friday: 8:00 AM - 5:00 PM",
    
    // Projects Page
    projectsPageSubtitle: "Real impact, real communities, real change—witness our biogas revolution in action",
    active: "Active",
    expanding: "Expanding",
    planning: "Planning",
    combinedImpact: "Combined Impact Across All Projects",
    familiesTransformed: "Families Transformed",
    wasteDivertedDaily: "Waste Diverted Daily",
    cleanGasPerMonth: "m³ Clean Gas/Month",
    jobsCreated: "Jobs Created",
    
    // Dashboard
    welcomeBack: "Welcome Back",
    quickStats: "Quick Stats",
    recentActivity: "Recent Activity",
    viewAll: "View All",
    kg: "kg",
    liters: "liters",
    tons: "tons",
    
    // Waste Logging Page
    addNewEntry: "Add New Entry",
    myWasteEntries: "My Waste Entries",
    date: "Date",
    status: "Status",
    actions: "Actions",
    noEntriesFound: "No entries found",
    logged: "Logged",
    confirmed: "Confirmed",
    rejected: "Rejected",
    quality: "Quality",
    unit: "Unit",
    notes: "Notes",
    uploadImage: "Upload Image",
    
    // Fuel Requests Page
    requestedDate: "Requested Date",
    deliveryDate: "Delivery Date",
    requestStatus: "Request Status",
    pending: "Pending",
    approved: "Approved",
    delivered: "Delivered",
    cancelled: "Cancelled",
    
    // Rewards Page
    availableCoins: "Available Coins",
    lifetimeEarned: "Lifetime Earned",
    cashValue: "Cash Value",
    transactionHistory: "Transaction History",
    earnedFrom: "Earned From",
    convertCoins: "Convert Coins",
    withdrawFunds: "Withdraw Funds",
    
    // Profile Page
    userProfile: "User Profile",
    personalInformation: "Personal Information",
    name: "Name",
    role: "Role",
    accountSettings: "Account Settings",
    changePassword: "Change Password",
    updateProfile: "Update Profile",
    
    // Help Page
    helpCenter: "Help Center",
    frequentlyAskedQuestions: "Frequently Asked Questions",
    contactSupport: "Contact Support",
    documentation: "Documentation",
    
    // Reports Page
    generateReport: "Generate Report",
    reportType: "Report Type",
    dateRange: "Date Range",
    exportReport: "Export Report",
    wasteReport: "Waste Report",
    productionReport: "Production Report",
    
    // Notifications Page
    markAllAsRead: "Mark All as Read",
    noNotifications: "No notifications",
    newNotification: "New Notification",
    thisMonth: "This Month",
    thisWeek: "This Week",
    totalEntries: "Total Entries",
    monthlyProgress: "Monthly Progress",
    quickActions: "Quick Actions",
    trackEarnings: "Track your waste supply earnings in real-time",
    totalEarnings: "Total Earnings",
    paidAmount: "Paid Amount",
    pendingPayment: "Pending Payment",
    requestPayment: "Request Payment",
    coinsEarned: "Coins Earned",
    yourContribution: "Your contribution",
    activeSupplier: "Active Supplier",
    coins: "coins",
    monthlySupply: "Monthly supply",
    weeklySupply: "Weekly supply",
    coinsEarnedLower: "coins earned",
    wasteLogs: "Waste logs",
    recentWasteEntries: "Recent Waste Entries",
    pickup: "Pickup",
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "days ago",
    foodWaste: "Food Waste",
    organicWaste: "Organic Waste",
    marketWaste: "Market Waste",
    collected: "Collected",
    completed: "Completed",
    scheduled: "Scheduled",
    target: "Target",
    remaining: "remaining to reach monthly target",
    newEntry: "New Entry",
    earnCoins: "Earn coins by logging waste",
    conversionRate: "100 coins = $1.00",
    updatesEvery: "Updates every 5 seconds",
    allTime: "All time",
    awaitingApproval: "Awaiting approval",
    paymentHistory: "Payment History",
    mobileMoney: "Mobile Money",
    cash: "Cash",
    biogasCredit: "Biogas Credit",
    noEarningsYet: "No earnings yet. Start logging waste to earn coins!",
    earned: "Earned",
    selectLanguage: "Select Language",
    chooseYourLanguage: "Choose your language"
  },
  
  fr: {
    // Welcome Page
    welcomeTitle: "Bienvenue sur EcoFuelConnect",
    welcomeSubtitle: "Transformer les Déchets Organiques en Énergie Propre pour les Écoles du Soudan du Sud",
    getStarted: "Commencer",
    learnMore: "En Savoir Plus",
    signIn: "Se Connecter",
    
    // Sidebar & Navigation
    dashboard: "Tableau de Bord",
    overview: "Aperçu",
    wasteLogging: "Enregistrement des Déchets",
    organicWasteLogging: "Enregistrement des Déchets Organiques",
    fuelRequestManagement: "Gestion des Demandes de Carburant",
    fuelRequests: "Demandes de Carburant",
    myRewards: "Mes Récompenses",
    messages: "Messages",
    notifications: "Notifications",
    projects: "Projets",
    ourProjects: "Nos Projets",
    about: "À Propos",
    aboutUs: "À Propos de Nous",
    contact: "Contact",
    contactUs: "Contactez-Nous",
    reports: "Rapports",
    settings: "Paramètres",
    help: "Aide",
    logout: "Déconnexion",
    profile: "Profil",
    
    // Dashboard Stats
    wasteLogged: "Déchets Enregistrés",
    biogasProduced: "Biogaz Produit",
    schools: "Écoles",
    totalUsers: "Utilisateurs Totaux",
    carbonReduction: "Réduction de Carbone",
    
    // Common
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    close: "Fermer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    submit: "Soumettre",
    search: "Rechercher",
    filter: "Filtrer",
    
    // Settings
    applicationSettings: "Paramètres d'Application",
    language: "Langue",
    theme: "Thème",
    emailNotifications: "Notifications Email",
    pushNotifications: "Notifications Push",
    
    // Waste Logging
    logWaste: "Enregistrer les Déchets",
    viewEntries: "Voir les Entrées",
    wasteType: "Type de Déchet",
    quantity: "Quantité",
    location: "Emplacement",
    description: "Description",
    
    // Fuel Request
    createNewFuelRequest: "Créer une Nouvelle Demande de Carburant",
    myFuelRequests: "Mes Demandes de Carburant",
    fuelType: "Type de Carburant",
    priority: "Priorité",
    deliveryAddress: "Adresse de Livraison",
    
    // Chatbot
    chatbot: "Chatbot",
    askQuestion: "Posez une question...",
    send: "Envoyer",
    howCanIHelp: "Comment puis-je vous aider aujourd'hui?",
    
    // Footer
    home: "Accueil",
    allRightsReserved: "Tous droits réservés",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    footerTagline: "Autonomiser le Soudan du Sud grâce à la technologie durable du biogaz et à la gestion des déchets organiques.",
    
    // Admin
    educationalContent: "Contenu Éducatif",
    contentManagement: "Gestion du Contenu",
    userManagement: "Gestion des Utilisateurs",
    
    // About Page
    aboutPageSubtitle: "Pionnier du premier écosystème de biogaz intégré d'Afrique - où la technologie rencontre la durabilité",
    ourMission: "Notre Mission",
    ourVision: "Notre Vision",
    whatWeDo: "Ce Que Nous Faisons",
    wasteManagement: "Gestion des Déchets",
    biogasProduction: "Production de Biogaz",
    schoolFuelDelivery: "Livraison de Carburant aux Écoles",
    impactStatistics: "Statistiques d'Impact",
    partnerOrganizations: "Organisations Partenaires",
    livesImpacted: "Vies Impactées",
    userSatisfaction: "Satisfaction des Utilisateurs",
    platformUptime: "Disponibilité de la Plateforme",
    missionText: "Nous révolutionnons le paysage énergétique du Soudan du Sud en créant la première plateforme numérique complète qui transforme les déchets organiques en opportunités. Notre mission va au-delà de la technologie—nous construisons un mouvement qui autonomise les communautés, protège les forêts et sauve des vies en rendant le biogaz propre accessible à chaque ménage et école.",
    visionText: "Imaginez un Soudan du Sud où chaque enfant respire un air pur, chaque forêt prospère et chaque communauté dispose d'une énergie fiable. Nous concrétisons cette vision d'ici 2030—en connectant 10 000 ménages, en éliminant 500 000 tonnes de CO₂ par an et en créant 5 000 emplois verts. Notre plateforme deviendra le modèle de transformation durable des déchets en énergie à travers l'Afrique.",
    wasteManagementText: "Système de suivi numérique intelligent capturant chaque kilogramme de déchets avec vérification GPS, documentation photographique et enregistrements de fournisseurs sécurisés par blockchain—garantissant une transparence totale de la source au biogaz",
    biogasProductionText: "Tableau de bord d'analyse alimenté par l'IA fournissant des métriques de production en direct, des alertes de maintenance prédictive et des recommandations d'efficacité—maximisant la production tout en minimisant les coûts opérationnels",
    schoolFuelDeliveryText: "Planification automatisée et optimisation des itinéraires connectant directement les producteurs aux écoles—garantissant une livraison à temps, une assurance qualité et des prix équitables via notre marché vérifié",
    
    // Contact Page
    contactPageSubtitle: "Contactez l'équipe EcoFuelConnect",
    sendUsMessage: "Envoyez-nous un Message",
    firstName: "Prénom",
    lastName: "Nom",
    emailAddress: "Adresse Email",
    subject: "Sujet",
    message: "Message",
    sendMessage: "Envoyer le Message",
    sending: "Envoi en cours...",
    messageSentSuccess: "Message envoyé avec succès!",
    contactInformation: "Informations de Contact",
    address: "Adresse",
    phone: "Téléphone",
    email: "Email",
    officeHours: "Heures de Bureau",
    mondayFriday: "Lundi - Vendredi: 8h00 - 17h00",
    
    // Projects Page
    projectsPageSubtitle: "Impact réel, communautés réelles, changement réel—témoin de notre révolution du biogaz en action",
    active: "Actif",
    expanding: "En Expansion",
    planning: "En Planification",
    combinedImpact: "Impact Combiné de Tous les Projets",
    familiesTransformed: "Familles Transformées",
    wasteDivertedDaily: "Déchets Détournés Quotidiennement",
    cleanGasPerMonth: "m³ de Gaz Propre/Mois",
    jobsCreated: "Emplois Créés",
    
    // Dashboard
    welcomeBack: "Bon Retour",
    quickStats: "Statistiques Rapides",
    recentActivity: "Activité Récente",
    viewAll: "Voir Tout",
    kg: "kg",
    liters: "litres",
    tons: "tonnes",
    
    // Waste Logging Page
    addNewEntry: "Ajouter une Nouvelle Entrée",
    myWasteEntries: "Mes Entrées de Déchets",
    date: "Date",
    status: "Statut",
    actions: "Actions",
    noEntriesFound: "Aucune entrée trouvée",
    logged: "Enregistré",
    confirmed: "Confirmé",
    rejected: "Rejeté",
    quality: "Qualité",
    unit: "Unité",
    notes: "Notes",
    uploadImage: "Télécharger une Image",
    
    // Fuel Requests Page
    requestedDate: "Date de Demande",
    deliveryDate: "Date de Livraison",
    requestStatus: "Statut de la Demande",
    pending: "En Attente",
    approved: "Approuvé",
    delivered: "Livré",
    cancelled: "Annulé",
    
    // Rewards Page
    availableCoins: "Pièces Disponibles",
    lifetimeEarned: "Gagné à Vie",
    cashValue: "Valeur en Espèces",
    transactionHistory: "Historique des Transactions",
    earnedFrom: "Gagné de",
    convertCoins: "Convertir les Pièces",
    withdrawFunds: "Retirer des Fonds",
    
    // Profile Page
    userProfile: "Profil Utilisateur",
    personalInformation: "Informations Personnelles",
    name: "Nom",
    role: "Rôle",
    accountSettings: "Paramètres du Compte",
    changePassword: "Changer le Mot de Passe",
    updateProfile: "Mettre à Jour le Profil",
    
    // Help Page
    helpCenter: "Centre d'Aide",
    frequentlyAskedQuestions: "Questions Fréquemment Posées",
    contactSupport: "Contacter le Support",
    documentation: "Documentation",
    
    // Reports Page
    generateReport: "Générer un Rapport",
    reportType: "Type de Rapport",
    dateRange: "Plage de Dates",
    exportReport: "Exporter le Rapport",
    wasteReport: "Rapport sur les Déchets",
    productionReport: "Rapport de Production",
    
    // Notifications Page
    markAllAsRead: "Tout Marquer comme Lu",
    noNotifications: "Aucune notification",
    newNotification: "Nouvelle Notification",
    thisMonth: "Ce Mois",
    thisWeek: "Cette Semaine",
    totalEntries: "Entrées Totales",
    monthlyProgress: "Progrès Mensuel",
    quickActions: "Actions Rapides",
    trackEarnings: "Suivez vos gains de fourniture de déchets en temps réel",
    totalEarnings: "Gains Totaux",
    paidAmount: "Montant Payé",
    pendingPayment: "Paiement en Attente",
    requestPayment: "Demander un Paiement",
    coinsEarned: "Pièces Gagnées",
    yourContribution: "Votre contribution",
    activeSupplier: "Fournisseur Actif",
    coins: "pièces",
    monthlySupply: "Approvisionnement mensuel",
    weeklySupply: "Approvisionnement hebdomadaire",
    coinsEarnedLower: "pièces gagnées",
    wasteLogs: "Journaux de déchets",
    recentWasteEntries: "Entrées de Déchets Récentes",
    pickup: "Ramassage",
    today: "Aujourd'hui",
    yesterday: "Hier",
    daysAgo: "il y a jours",
    foodWaste: "Déchets Alimentaires",
    organicWaste: "Déchets Organiques",
    marketWaste: "Déchets de Marché",
    collected: "Collecté",
    completed: "Terminé",
    scheduled: "Programmé",
    target: "Objectif",
    remaining: "restant pour atteindre l'objectif mensuel",
    newEntry: "Nouvelle Entrée",
    earnCoins: "Gagnez des pièces en enregistrant les déchets",
    conversionRate: "100 pièces = 1,00 $",
    updatesEvery: "Mises à jour toutes les 5 secondes",
    allTime: "Tout le temps",
    awaitingApproval: "En attente d'approbation",
    paymentHistory: "Historique des Paiements",
    mobileMoney: "Argent Mobile",
    cash: "Espèces",
    biogasCredit: "Crédit Biogaz",
    noEarningsYet: "Pas encore de gains. Commencez à enregistrer les déchets pour gagner des pièces!",
    earned: "Gagné",
    selectLanguage: "Sélectionner la Langue",
    chooseYourLanguage: "Choisissez votre langue"
  },
  
  ar: {
    // Welcome Page
    welcomeTitle: "مرحباً بك في EcoFuelConnect",
    welcomeSubtitle: "تحويل النفايات العضوية إلى طاقة نظيفة لمدارس جنوب السودان",
    getStarted: "ابدأ الآن",
    learnMore: "اعرف المزيد",
    signIn: "تسجيل الدخول",
    
    // Sidebar & Navigation
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة",
    wasteLogging: "تسجيل النفايات",
    organicWasteLogging: "تسجيل النفايات العضوية",
    fuelRequestManagement: "إدارة طلبات الوقود",
    fuelRequests: "طلبات الوقود",
    myRewards: "مكافآتي",
    messages: "الرسائل",
    notifications: "الإشعارات",
    projects: "المشاريع",
    ourProjects: "مشاريعنا",
    about: "حول",
    aboutUs: "من نحن",
    contact: "اتصل بنا",
    contactUs: "اتصل بنا",
    reports: "التقارير",
    settings: "الإعدادات",
    help: "مساعدة",
    logout: "تسجيل الخروج",
    profile: "الملف الشخصي",
    
    // Dashboard Stats
    wasteLogged: "النفايات المسجلة",
    biogasProduced: "الغاز الحيوي المنتج",
    schools: "المدارس",
    totalUsers: "إجمالي المستخدمين",
    carbonReduction: "تقليل الكربون",
    
    // Common
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تحرير",
    delete: "حذف",
    view: "عرض",
    close: "إغلاق",
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    submit: "إرسال",
    search: "بحث",
    filter: "تصفية",
    
    // Settings
    applicationSettings: "إعدادات التطبيق",
    language: "اللغة",
    theme: "المظهر",
    emailNotifications: "إشعارات البريد الإلكتروني",
    pushNotifications: "الإشعارات الفورية",
    
    // Waste Logging
    logWaste: "تسجيل النفايات",
    viewEntries: "عرض الإدخالات",
    wasteType: "نوع النفايات",
    quantity: "الكمية",
    location: "الموقع",
    description: "الوصف",
    
    // Fuel Request
    createNewFuelRequest: "إنشاء طلب وقود جديد",
    myFuelRequests: "طلبات الوقود الخاصة بي",
    fuelType: "نوع الوقود",
    priority: "الأولوية",
    deliveryAddress: "عنوان التسليم",
    
    // Chatbot
    chatbot: "الدردشة الآلية",
    askQuestion: "اطرح سؤالاً...",
    send: "إرسال",
    howCanIHelp: "كيف يمكنني مساعدتك اليوم؟",
    
    // Footer
    home: "الرئيسية",
    allRightsReserved: "جميع الحقوق محفوظة",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    footerTagline: "تمكين جنوب السودان من خلال تكنولوجيا الغاز الحيوي المستدامة وإدارة النفايات العضوية.",
    
    // Admin
    educationalContent: "المحتوى التعليمي",
    contentManagement: "إدارة المحتوى",
    userManagement: "إدارة المستخدمين",
    
    // About Page
    aboutPageSubtitle: "رائدة أول نظام بيئي متكامل للغاز الحيوي في أفريقيا - حيث تلتقي التكنولوجيا بالاستدامة",
    ourMission: "مهمتنا",
    ourVision: "رؤيتنا",
    whatWeDo: "ما نقوم به",
    wasteManagement: "إدارة النفايات",
    biogasProduction: "إنتاج الغاز الحيوي",
    schoolFuelDelivery: "توصيل الوقود للمدارس",
    impactStatistics: "إحصائيات التأثير",
    partnerOrganizations: "المنظمات الشريكة",
    livesImpacted: "الأرواح المتأثرة",
    userSatisfaction: "رضا المستخدمين",
    platformUptime: "وقت تشغيل المنصة",
    missionText: "نحن نُحدث ثورة في مشهد الطاقة في جنوب السودان من خلال إنشاء أول منصة رقمية شاملة تحول النفايات العضوية إلى فرص. مهمتنا تتجاوز التكنولوجيا—نحن نبني حركة تمكن المجتمعات وتحمي الغابات وتنقذ الأرواح من خلال جعل الغاز الحيوي النظيف متاحًا لكل أسرة ومدرسة.",
    visionText: "تخيل جنوب السودان حيث يتنفس كل طفل هواءً نقيًا، وتزدهر كل غابة، ولدى كل مجتمع طاقة موثوقة. نحن نحقق هذه الرؤية بحلول عام 2030—من خلال ربط 10000 أسرة، والقضاء على 500000 طن من ثاني أكسيد الكربون سنويًا، وخلق 5000 وظيفة خضراء. ستصبح منصتنا النموذج للتحول المستدام من النفايات إلى الطاقة عبر أفريقيا.",
    wasteManagementText: "نظام تتبع رقمي ذكي يلتقط كل كيلوغرام من النفايات مع التحقق من نظام تحديد المواقع العالمي، والتوثيق الفوتوغرافي، وسجلات الموردين المؤمنة بتقنية البلوكشين—مما يضمن الشفافية الكاملة من المصدر إلى الغاز الحيوي",
    biogasProductionText: "لوحة تحليلات مدعومة بالذكاء الاصطناعي توفر مقاييس إنتاج مباشرة، وتنبيهات صيانة تنبؤية، وتوصيات كفاءة—تعظيم الإنتاج مع تقليل التكاليف التشغيلية",
    schoolFuelDeliveryText: "جدولة تلقائية وتحسين المسار يربط المنتجين مباشرة بالمدارس—مما يضمن التسليم في الوقت المحدد، وضمان الجودة، والتسعير العادل من خلال سوقنا المعتمد",
    
    // Contact Page
    contactPageSubtitle: "تواصل مع فريق EcoFuelConnect",
    sendUsMessage: "أرسل لنا رسالة",
    firstName: "الاسم الأول",
    lastName: "الاسم الأخير",
    emailAddress: "عنوان البريد الإلكتروني",
    subject: "الموضوع",
    message: "الرسالة",
    sendMessage: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    messageSentSuccess: "تم إرسال الرسالة بنجاح!",
    contactInformation: "معلومات الاتصال",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    officeHours: "ساعات العمل",
    mondayFriday: "الاثنين - الجمعة: 8:00 ص - 5:00 م",
    
    // Projects Page
    projectsPageSubtitle: "تأثير حقيقي، مجتمعات حقيقية، تغيير حقيقي—شاهد ثورة الغاز الحيوي في العمل",
    active: "نشط",
    expanding: "في توسع",
    planning: "في التخطيط",
    combinedImpact: "التأثير المجمع عبر جميع المشاريع",
    familiesTransformed: "العائلات المتحولة",
    wasteDivertedDaily: "النفايات المحولة يوميًا",
    cleanGasPerMonth: "م³ غاز نظيف/شهر",
    jobsCreated: "الوظائف المنشأة",
    
    // Dashboard
    welcomeBack: "مرحباً بعودتك",
    quickStats: "إحصائيات سريعة",
    recentActivity: "النشاط الأخير",
    viewAll: "عرض الكل",
    kg: "كجم",
    liters: "لتر",
    tons: "طن",
    
    // Waste Logging Page
    addNewEntry: "إضافة إدخال جديد",
    myWasteEntries: "إدخالات النفايات الخاصة بي",
    date: "التاريخ",
    status: "الحالة",
    actions: "الإجراءات",
    noEntriesFound: "لم يتم العثور على إدخالات",
    logged: "مسجل",
    confirmed: "مؤكد",
    rejected: "مرفوض",
    quality: "الجودة",
    unit: "الوحدة",
    notes: "ملاحظات",
    uploadImage: "تحميل صورة",
    
    // Fuel Requests Page
    requestedDate: "تاريخ الطلب",
    deliveryDate: "تاريخ التسليم",
    requestStatus: "حالة الطلب",
    pending: "قيد الانتظار",
    approved: "موافق عليه",
    delivered: "تم التسليم",
    cancelled: "ملغى",
    
    // Rewards Page
    availableCoins: "العملات المتاحة",
    lifetimeEarned: "المكتسب مدى الحياة",
    cashValue: "القيمة النقدية",
    transactionHistory: "سجل المعاملات",
    earnedFrom: "مكتسب من",
    convertCoins: "تحويل العملات",
    withdrawFunds: "سحب الأموال",
    
    // Profile Page
    userProfile: "الملف الشخصي",
    personalInformation: "المعلومات الشخصية",
    name: "الاسم",
    role: "الدور",
    accountSettings: "إعدادات الحساب",
    changePassword: "تغيير كلمة المرور",
    updateProfile: "تحديث الملف الشخصي",
    
    // Help Page
    helpCenter: "مركز المساعدة",
    frequentlyAskedQuestions: "الأسئلة الشائعة",
    contactSupport: "اتصل بالدعم",
    documentation: "التوثيق",
    
    // Reports Page
    generateReport: "إنشاء تقرير",
    reportType: "نوع التقرير",
    dateRange: "نطاق التاريخ",
    exportReport: "تصدير التقرير",
    wasteReport: "تقرير النفايات",
    productionReport: "تقرير الإنتاج",
    
    // Notifications Page
    markAllAsRead: "وضع علامة مقروء على الكل",
    noNotifications: "لا توجد إشعارات",
    newNotification: "إشعار جديد",
    thisMonth: "هذا الشهر",
    thisWeek: "هذا الأسبوع",
    totalEntries: "إجمالي الإدخالات",
    monthlyProgress: "التقدم الشهري",
    quickActions: "إجراءات سريعة",
    trackEarnings: "تتبع أرباحك من توريد النفايات في الوقت الفعلي",
    totalEarnings: "إجمالي الأرباح",
    paidAmount: "المبلغ المدفوع",
    pendingPayment: "الدفع قيد الانتظار",
    requestPayment: "طلب الدفع",
    coinsEarned: "العملات المكتسبة",
    yourContribution: "مساهمتك",
    activeSupplier: "مورد نشط",
    coins: "عملات",
    monthlySupply: "التوريد الشهري",
    weeklySupply: "التوريد الأسبوعي",
    coinsEarnedLower: "عملات مكتسبة",
    wasteLogs: "سجلات النفايات",
    recentWasteEntries: "إدخالات النفايات الأخيرة",
    pickup: "الاستلام",
    today: "اليوم",
    yesterday: "أمس",
    daysAgo: "منذ أيام",
    foodWaste: "نفايات الطعام",
    organicWaste: "نفايات عضوية",
    marketWaste: "نفايات السوق",
    collected: "تم الجمع",
    completed: "مكتمل",
    scheduled: "مجدول",
    target: "الهدف",
    remaining: "متبقي للوصول إلى الهدف الشهري",
    newEntry: "إدخال جديد",
    earnCoins: "اكسب عملات عن طريق تسجيل النفايات",
    conversionRate: "100 عملة = 1.00 $",
    updatesEvery: "تحديثات كل 5 ثواني",
    allTime: "طوال الوقت",
    awaitingApproval: "في انتظار الموافقة",
    paymentHistory: "سجل الدفع",
    mobileMoney: "المال المحمول",
    cash: "نقدًا",
    biogasCredit: "ائتمان الغاز الحيوي",
    noEarningsYet: "لا توجد أرباح بعد. ابدأ في تسجيل النفايات لكسب العملات!",
    earned: "مكتسب",
    selectLanguage: "اختر اللغة",
    chooseYourLanguage: "اختر لغتك"
  },
  
  sw: {
    // Welcome Page
    welcomeTitle: "Karibu EcoFuelConnect",
    welcomeSubtitle: "Kubadilisha Taka za Kikaboni kuwa Nishati Safi kwa Shule za Sudan Kusini",
    getStarted: "Anza",
    learnMore: "Jifunze Zaidi",
    signIn: "Ingia",
    
    // Sidebar & Navigation
    dashboard: "Dashibodi",
    overview: "Muhtasari",
    wasteLogging: "Kurekodi Taka",
    organicWasteLogging: "Kurekodi Taka za Kikaboni",
    fuelRequestManagement: "Usimamizi wa Maombi ya Mafuta",
    fuelRequests: "Maombi ya Mafuta",
    myRewards: "Tuzo Zangu",
    messages: "Ujumbe",
    notifications: "Arifa",
    projects: "Miradi",
    ourProjects: "Miradi Yetu",
    about: "Kuhusu",
    aboutUs: "Kuhusu Sisi",
    contact: "Wasiliana",
    contactUs: "Wasiliana Nasi",
    reports: "Ripoti",
    settings: "Mipangilio",
    help: "Msaada",
    logout: "Toka",
    profile: "Wasifu",
    
    // Dashboard Stats
    wasteLogged: "Taka Zilizoandikwa",
    biogasProduced: "Gesi ya Kikaboni Iliyozalishwa",
    schools: "Shule",
    totalUsers: "Watumiaji Jumla",
    carbonReduction: "Kupunguza Kaboni",
    
    // Common
    save: "Hifadhi",
    cancel: "Ghairi",
    edit: "Hariri",
    delete: "Futa",
    view: "Tazama",
    close: "Funga",
    loading: "Inapakia...",
    error: "Hitilafu",
    success: "Mafanikio",
    submit: "Wasilisha",
    search: "Tafuta",
    filter: "Chuja",
    
    // Settings
    applicationSettings: "Mipangilio ya Programu",
    language: "Lugha",
    theme: "Mandhari",
    emailNotifications: "Arifa za Barua pepe",
    pushNotifications: "Arifa za Kusukuma",
    
    // Waste Logging
    logWaste: "Rekodi Taka",
    viewEntries: "Tazama Maingizo",
    wasteType: "Aina ya Taka",
    quantity: "Kiasi",
    location: "Mahali",
    description: "Maelezo",
    
    // Fuel Request
    createNewFuelRequest: "Unda Ombi Jipya la Mafuta",
    myFuelRequests: "Maombi Yangu ya Mafuta",
    fuelType: "Aina ya Mafuta",
    priority: "Kipaumbele",
    deliveryAddress: "Anwani ya Uwasilishaji",
    
    // Chatbot
    chatbot: "Chatbot",
    askQuestion: "Uliza swali...",
    send: "Tuma",
    howCanIHelp: "Ninawezaje kukusaidia leo?",
    
    // Footer
    home: "Nyumbani",
    allRightsReserved: "Haki zote zimehifadhiwa",
    privacyPolicy: "Sera ya Faragha",
    termsOfService: "Masharti ya Huduma",
    footerTagline: "Kuwezesha Sudan Kusini kupitia teknolojia endelevu ya gesi ya kikaboni na usimamizi wa taka za kikaboni.",
    
    // Admin
    educationalContent: "Maudhui ya Elimu",
    contentManagement: "Usimamizi wa Maudhui",
    userManagement: "Usimamizi wa Watumiaji",
    
    // About Page
    aboutPageSubtitle: "Kuongoza mfumo wa kwanza wa gesi ya kikaboni uliounganishwa wa Afrika - ambapo teknolojia inakutana na uendelevu",
    ourMission: "Dhamira Yetu",
    ourVision: "Maono Yetu",
    whatWeDo: "Tunachofanya",
    wasteManagement: "Usimamizi wa Taka",
    biogasProduction: "Uzalishaji wa Gesi ya Kikaboni",
    schoolFuelDelivery: "Uwasilishaji wa Mafuta kwa Shule",
    impactStatistics: "Takwimu za Athari",
    partnerOrganizations: "Mashirika ya Ushirikiano",
    livesImpacted: "Maisha Yaliyoathiriwa",
    userSatisfaction: "Kuridhika kwa Watumiaji",
    platformUptime: "Muda wa Jukwaa",
    missionText: "Tunabadilisha mandhari ya nishati ya Sudan Kusini kwa kuunda jukwaa la kwanza la dijiti linalobadilisha taka za kikaboni kuwa fursa. Dhamira yetu inazidi teknolojia—tunajenga harakati inayowezesha jamii, kulinda misitu, na kuokoa maisha kwa kufanya gesi safi ya kikaboni ipatikane kwa kila kaya na shule.",
    visionText: "Fikiria Sudan Kusini ambapo kila mtoto anapumua hewa safi, kila msitu unastawi, na kila jamii ina nishati ya kuaminika. Tunafanya maono haya kuwa ukweli ifikapo 2030—kuunganisha kaya 10,000, kuondoa tani 500,000 za CO₂ kila mwaka, na kuunda kazi 5,000 za kijani. Jukwaa letu litakuwa kiolezo cha mabadiliko endelevu ya taka-hadi-nishati katika Afrika.",
    wasteManagementText: "Mfumo wa ufuatiliaji wa dijiti wenye akili unaokamata kila kilogramu cha taka na uthibitisho wa GPS, nyaraka za picha, na rekodi za wasambazaji zilizolindwa na blockchain—kuhakikisha uwazi kamili kutoka chanzo hadi gesi ya kikaboni",
    biogasProductionText: "Dashibodi ya uchanganuzi inayoendeshwa na AI inayotoa vipimo vya uzalishaji wa moja kwa moja, tahadhari za matengenezo ya utabiri, na mapendekezo ya ufanisi—kuongeza pato huku ikipunguza gharama za uendeshaji",
    schoolFuelDeliveryText: "Ratiba otomatiki na uboreshaji wa njia kuunganisha wazalishaji moja kwa moja na shule—kuhakikisha uwasilishaji kwa wakati, uhakikisho wa ubora, na bei nzuri kupitia soko letu lililoithibitishwa",
    
    // Contact Page
    contactPageSubtitle: "Wasiliana na timu ya EcoFuelConnect",
    sendUsMessage: "Tutumie Ujumbe",
    firstName: "Jina la Kwanza",
    lastName: "Jina la Mwisho",
    emailAddress: "Anwani ya Barua pepe",
    subject: "Mada",
    message: "Ujumbe",
    sendMessage: "Tuma Ujumbe",
    sending: "Inatuma...",
    messageSentSuccess: "Ujumbe umetumwa kwa mafanikio!",
    contactInformation: "Maelezo ya Mawasiliano",
    address: "Anwani",
    phone: "Simu",
    email: "Barua pepe",
    officeHours: "Saa za Ofisi",
    mondayFriday: "Jumatatu - Ijumaa: 8:00 AM - 5:00 PM",
    
    // Projects Page
    projectsPageSubtitle: "Athari halisi, jamii halisi, mabadiliko halisi—shuhudia mapinduzi yetu ya gesi ya kikaboni katika vitendo",
    active: "Hai",
    expanding: "Inapanuka",
    planning: "Inapanga",
    combinedImpact: "Athari Iliyounganishwa Katika Miradi Yote",
    familiesTransformed: "Familia Zilizobadilishwa",
    wasteDivertedDaily: "Taka Zilizogeuziwa Kila Siku",
    cleanGasPerMonth: "m³ Gesi Safi/Mwezi",
    jobsCreated: "Kazi Zilizotengenezwa",
    
    // Dashboard
    welcomeBack: "Karibu Tena",
    quickStats: "Takwimu za Haraka",
    recentActivity: "Shughuli za Hivi Karibuni",
    viewAll: "Tazama Zote",
    kg: "kg",
    liters: "lita",
    tons: "tani",
    
    // Waste Logging Page
    addNewEntry: "Ongeza Ingizo Jipya",
    myWasteEntries: "Maingizo Yangu ya Taka",
    date: "Tarehe",
    status: "Hali",
    actions: "Vitendo",
    noEntriesFound: "Hakuna maingizo yaliyopatikana",
    logged: "Imeandikwa",
    confirmed: "Imethibitishwa",
    rejected: "Imekataliwa",
    quality: "Ubora",
    unit: "Kitengo",
    notes: "Maelezo",
    uploadImage: "Pakia Picha",
    
    // Fuel Requests Page
    requestedDate: "Tarehe ya Ombi",
    deliveryDate: "Tarehe ya Uwasilishaji",
    requestStatus: "Hali ya Ombi",
    pending: "Inasubiri",
    approved: "Imeidhinishwa",
    delivered: "Imewasilishwa",
    cancelled: "Imeghairiwa",
    
    // Rewards Page
    availableCoins: "Sarafu Zinazopatikana",
    lifetimeEarned: "Iliyopatikana Maishani",
    cashValue: "Thamani ya Pesa",
    transactionHistory: "Historia ya Miamala",
    earnedFrom: "Imepatikana Kutoka",
    convertCoins: "Badilisha Sarafu",
    withdrawFunds: "Ondoa Fedha",
    
    // Profile Page
    userProfile: "Wasifu wa Mtumiaji",
    personalInformation: "Maelezo ya Kibinafsi",
    name: "Jina",
    role: "Jukumu",
    accountSettings: "Mipangilio ya Akaunti",
    changePassword: "Badilisha Nenosiri",
    updateProfile: "Sasisha Wasifu",
    
    // Help Page
    helpCenter: "Kituo cha Msaada",
    frequentlyAskedQuestions: "Maswali Yanayoulizwa Mara kwa Mara",
    contactSupport: "Wasiliana na Msaada",
    documentation: "Nyaraka",
    
    // Reports Page
    generateReport: "Tengeneza Ripoti",
    reportType: "Aina ya Ripoti",
    dateRange: "Kipindi cha Tarehe",
    exportReport: "Hamisha Ripoti",
    wasteReport: "Ripoti ya Taka",
    productionReport: "Ripoti ya Uzalishaji",
    
    // Notifications Page
    markAllAsRead: "Weka Alama Zote Kama Zimesomwa",
    noNotifications: "Hakuna arifa",
    newNotification: "Arifa Mpya",
    thisMonth: "Mwezi Huu",
    thisWeek: "Wiki Hii",
    totalEntries: "Maingizo Jumla",
    monthlyProgress: "Maendeleo ya Kila Mwezi",
    quickActions: "Vitendo vya Haraka",
    trackEarnings: "Fuatilia mapato yako ya usambazaji wa taka kwa wakati halisi",
    totalEarnings: "Mapato Jumla",
    paidAmount: "Kiasi Kilicholipwa",
    pendingPayment: "Malipo Yanayosubiri",
    requestPayment: "Omba Malipo",
    coinsEarned: "Sarafu Zilizopatikana",
    yourContribution: "Mchango wako",
    activeSupplier: "Msambazaji Hai",
    coins: "sarafu",
    monthlySupply: "Usambazaji wa kila mwezi",
    weeklySupply: "Usambazaji wa kila wiki",
    coinsEarnedLower: "sarafu zilizopatikana",
    wasteLogs: "Kumbukumbu za taka",
    recentWasteEntries: "Maingizo ya Hivi Karibuni ya Taka",
    pickup: "Kuchukua",
    today: "Leo",
    yesterday: "Jana",
    daysAgo: "siku zilizopita",
    foodWaste: "Taka za Chakula",
    organicWaste: "Taka za Kikaboni",
    marketWaste: "Taka za Soko",
    collected: "Imekusanywa",
    completed: "Imekamilika",
    scheduled: "Imepangwa",
    target: "Lengo",
    remaining: "zimebaki kufikia lengo la kila mwezi",
    newEntry: "Ingizo Jipya",
    earnCoins: "Pata sarafu kwa kurekodi taka",
    conversionRate: "Sarafu 100 = $1.00",
    updatesEvery: "Inasasisha kila sekunde 5",
    allTime: "Wakati wote",
    awaitingApproval: "Inasubiri idhini",
    paymentHistory: "Historia ya Malipo",
    mobileMoney: "Pesa ya Simu",
    cash: "Taslimu",
    biogasCredit: "Mkopo wa Gesi ya Kikaboni",
    noEarningsYet: "Hakuna mapato bado. Anza kurekodi taka ili kupata sarafu!",
    earned: "Imepatikana",
    selectLanguage: "Chagua Lugha",
    chooseYourLanguage: "Chagua lugha yako"
  },
  
  din: {
    // Welcome Page (Dinka)
    welcomeTitle: "Cï wëu ke EcoFuelConnect",
    welcomeSubtitle: "Cï wäär de yic ke mac alëu ke cukic de thukul ke Sudan Kec",
    getStarted: "Cï cak",
    learnMore: "Nhoŋ tënë",
    signIn: "Cï dɔŋ",
    
    // Sidebar & Navigation
    dashboard: "Bäi de wëu",
    overview: "Wëu lueel",
    wasteLogging: "Cï gɔr yic",
    organicWasteLogging: "Cï gɔr yic de mac",
    fuelRequestManagement: "Wëu de këc mac alëu",
    fuelRequests: "Këc mac alëu",
    myRewards: "Cï piɔu",
    messages: "Wëu",
    notifications: "Wëu de nhoŋ",
    projects: "Wëu de tɔ̈u",
    ourProjects: "Wëu de tɔ̈u kek",
    about: "Ke",
    aboutUs: "Ke kek",
    contact: "Cï wëu",
    contactUs: "Cï wëu kek",
    reports: "Wëu de gɔr",
    settings: "Wëu de cak",
    help: "Kɔny",
    logout: "Cï wek",
    profile: "Wëu de ran",
    
    // Dashboard Stats
    wasteLogged: "Yic agɔr",
    biogasProduced: "Mac alëu acak",
    schools: "Thukul",
    totalUsers: "Ran tënë",
    carbonReduction: "Cï wäär carbon",
    
    // Common
    save: "Cï kɔc",
    cancel: "Cï jɔk",
    edit: "Cï lɔi",
    delete: "Cï wäär",
    view: "Cï ŋic",
    close: "Cï kɔl",
    loading: "Cï kɔc...",
    error: "Bäi",
    success: "Acak",
    submit: "Cï tïŋ",
    search: "Cï piny",
    filter: "Cï lɔi",
    
    // Settings
    applicationSettings: "Wëu de cak",
    language: "Thuɔŋjäŋ",
    theme: "Wëu",
    emailNotifications: "Wëu de email",
    pushNotifications: "Wëu de nhoŋ",
    
    // Waste Logging
    logWaste: "Cï gɔr yic",
    viewEntries: "Cï ŋic wëu",
    wasteType: "Yic de lueel",
    quantity: "Tënë",
    location: "Bäi",
    description: "Wëu",
    
    // Fuel Request
    createNewFuelRequest: "Cï cak këc mac alëu",
    myFuelRequests: "Cï këc mac alëu",
    fuelType: "Mac alëu de lueel",
    priority: "Tënë",
    deliveryAddress: "Bäi de tïŋ",
    
    // Chatbot
    chatbot: "Wëu de thuɔŋjäŋ",
    askQuestion: "Cï piny...",
    send: "Cï tïŋ",
    howCanIHelp: "Ɣɔn acï kɔny ke?",
    
    // Footer
    home: "Pänh",
    allRightsReserved: "Wëu tënë akɔc",
    privacyPolicy: "Wëu de thuɔŋjäŋ",
    termsOfService: "Wëu de tɔ̈u",
    footerTagline: "Cï piɔu Sudan Kec ke mac alëu de cukic ke wëu de yic.",
    
    // Admin
    educationalContent: "Wëu de nhoŋ",
    contentManagement: "Wëu de wëu",
    userManagement: "Wëu de ran",
    
    // About Page
    aboutPageSubtitle: "Wëu de mac alëu ke Africa",
    ourMission: "Wëu kek",
    ourVision: "Wëu kek de ŋic",
    whatWeDo: "Ɣɔn kek acï tɔ̈u",
    wasteManagement: "Wëu de yic",
    biogasProduction: "Cï cak mac alëu",
    schoolFuelDelivery: "Cï tïŋ mac ke thukul",
    impactStatistics: "Wëu de tënë",
    partnerOrganizations: "Wëu de kɔc",
    livesImpacted: "Ran atɔ̈u",
    userSatisfaction: "Ran de piɔu",
    platformUptime: "Wëu de tɔ̈u",
    missionText: "Kek acï lɔi Sudan Kec ke mac alëu de cukic.",
    visionText: "Kek acï ŋic Sudan Kec ke mac alëu tënë.",
    wasteManagementText: "Wëu de yic ke cukic",
    biogasProductionText: "Wëu de mac alëu",
    schoolFuelDeliveryText: "Cï tïŋ mac ke thukul",
    
    // Contact Page
    contactPageSubtitle: "Cï wëu kek",
    sendUsMessage: "Cï tïŋ wëu",
    firstName: "Ran de cak",
    lastName: "Ran de rot",
    emailAddress: "Email",
    subject: "Wëu",
    message: "Wëu",
    sendMessage: "Cï tïŋ wëu",
    sending: "Cï tïŋ...",
    messageSentSuccess: "Wëu atïŋ!",
    contactInformation: "Wëu de wëu",
    address: "Bäi",
    phone: "Thiɔ̈ɔ̈k",
    email: "Email",
    officeHours: "Tɔ̈u de wëu",
    mondayFriday: "Cäŋ - Dhieec: 8:00 - 5:00",
    
    // Projects Page
    projectsPageSubtitle: "Wëu de tɔ̈u kek",
    active: "Tɔ̈u",
    expanding: "Cï lɔi",
    planning: "Cï cak",
    combinedImpact: "Wëu tënë",
    familiesTransformed: "Dhɔl alɔi",
    wasteDivertedDaily: "Yic de cäŋ",
    cleanGasPerMonth: "Mac alëu de dhil",
    jobsCreated: "Tɔ̈u acak",
    
    // Dashboard
    welcomeBack: "Cï wëu rot",
    quickStats: "Wëu de tënë",
    recentActivity: "Tɔ̈u de nhom",
    viewAll: "Cï ŋic tënë",
    kg: "kg",
    liters: "lita",
    tons: "ton",
    
    // Waste Logging Page
    addNewEntry: "Cï kɔc wëu",
    myWasteEntries: "Cï yic",
    date: "Cäŋ",
    status: "Wëu",
    actions: "Tɔ̈u",
    noEntriesFound: "Wëu tin",
    logged: "Agɔr",
    confirmed: "Acak",
    rejected: "Ajɔk",
    quality: "Cukic",
    unit: "Lueel",
    notes: "Wëu",
    uploadImage: "Cï kɔc piɔu",
    
    // Fuel Requests Page
    requestedDate: "Cäŋ de këc",
    deliveryDate: "Cäŋ de tïŋ",
    requestStatus: "Wëu de këc",
    pending: "Cï kɔc",
    approved: "Acak",
    delivered: "Atïŋ",
    cancelled: "Ajɔk",
    
    // Rewards Page
    availableCoins: "Piɔu",
    lifetimeEarned: "Piɔu tënë",
    cashValue: "Piɔu de yën",
    transactionHistory: "Wëu de piɔu",
    earnedFrom: "Piɔu ke",
    convertCoins: "Cï lɔi piɔu",
    withdrawFunds: "Cï wek yën",
    
    // Profile Page
    userProfile: "Wëu de ran",
    personalInformation: "Wëu de ran",
    name: "Ran",
    role: "Tɔ̈u",
    accountSettings: "Wëu de cak",
    changePassword: "Cï lɔi wëu",
    updateProfile: "Cï lɔi wëu",
    
    // Help Page
    helpCenter: "Bäi de kɔny",
    frequentlyAskedQuestions: "Piny tënë",
    contactSupport: "Cï wëu kɔny",
    documentation: "Wëu de gɔr",
    
    // Reports Page
    generateReport: "Cï cak wëu",
    reportType: "Wëu de lueel",
    dateRange: "Cäŋ",
    exportReport: "Cï tïŋ wëu",
    wasteReport: "Wëu de yic",
    productionReport: "Wëu de cak",
    
    // Notifications Page
    markAllAsRead: "Cï gɔr tënë",
    noNotifications: "Wëu tin",
    newNotification: "Wëu de nhom",
    thisMonth: "Dhil kën",
    thisWeek: "Wic kën",
    totalEntries: "Wëu tënë",
    monthlyProgress: "Tɔ̈u de dhil",
    quickActions: "Tɔ̈u de tënë",
    trackEarnings: "Cï ŋic piɔu",
    totalEarnings: "Piɔu tënë",
    paidAmount: "Yën atïŋ",
    pendingPayment: "Yën cï kɔc",
    requestPayment: "Cï këc yën",
    coinsEarned: "Piɔu apath",
    yourContribution: "Cï tɔ̈u",
    activeSupplier: "Ran de tïŋ",
    coins: "piɔu",
    monthlySupply: "Tïŋ de dhil",
    weeklySupply: "Tïŋ de wic",
    coinsEarnedLower: "piɔu apath",
    wasteLogs: "Yic agɔr",
    recentWasteEntries: "Yic de nhom",
    pickup: "Cï kɔc",
    today: "Tënë",
    yesterday: "Cäŋ rot",
    daysAgo: "cäŋ rot",
    foodWaste: "Yic de cam",
    organicWaste: "Yic de mac",
    marketWaste: "Yic de luak",
    collected: "Akɔc",
    completed: "Acak",
    scheduled: "Agɔr",
    target: "Wëu",
    remaining: "kɔc",
    newEntry: "Wëu de nhom",
    earnCoins: "Cï path piɔu",
    conversionRate: "100 piɔu = $1.00",
    updatesEvery: "Cï lɔi 5 cäŋ",
    allTime: "Tɔ̈u tënë",
    awaitingApproval: "Cï kɔc",
    paymentHistory: "Wëu de yën",
    mobileMoney: "Yën de thiɔ̈ɔ̈k",
    cash: "Yën",
    biogasCredit: "Mac alëu",
    noEarningsYet: "Piɔu tin. Cï cak gɔr yic!",
    earned: "Apath",
    selectLanguage: "Cï lɔi thuɔŋjäŋ",
    chooseYourLanguage: "Cï lɔi thuɔŋjäŋ kek"
  }
};

const LanguageContext = createContext();

export { LanguageContext };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Load language from localStorage or default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    localStorage.setItem('appLanguage', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    // Optionally sync with backend user profile
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
    localStorage.setItem('appLanguage', languageCode);
  };

  const translate = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
      { code: 'din', name: 'Dinka', nativeName: 'Thuɔŋjäŋ' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};