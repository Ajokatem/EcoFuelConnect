import React, { createContext, useContext, useState, useEffect } from 'react';

// Language translations
const translations = {
  en: {
    // Dashboard
    dashboard: "Dashboard",
    overview: "Overview",
    wasteLogged: "Waste Logged",
    biogasProduced: "Biogas Produced",
    fuelRequests: "Fuel Requests",
    schools: "Schools",
    
    // Navigation
    organicWasteLogging: "Organic Waste Logging",
    fuelRequestManagement: "Fuel Request Management",
    reports: "Reports",
    settings: "Settings",
    about: "About",
    help: "Help",
    logout: "Logout",
    
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
    
    // Settings
    applicationSettings: "Application Settings",
    notifications: "Notifications",
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
    deliveryAddress: "Delivery Address"
  },
  
  fr: {
    // Dashboard
    dashboard: "Tableau de Bord",
    overview: "Aperçu",
    wasteLogged: "Déchets Enregistrés",
    biogasProduced: "Biogaz Produit",
    fuelRequests: "Demandes de Carburant",
    schools: "Écoles",
    
    // Navigation
    organicWasteLogging: "Enregistrement des Déchets Organiques",
    fuelRequestManagement: "Gestion des Demandes de Carburant",
    reports: "Rapports",
    settings: "Paramètres",
    about: "À Propos",
    help: "Aide",
    logout: "Déconnexion",
    
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
    
    // Settings
    applicationSettings: "Paramètres d'Application",
    notifications: "Notifications",
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
    deliveryAddress: "Adresse de Livraison"
  },
  
  ar: {
    // Dashboard
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة",
    wasteLogged: "النفايات المسجلة",
    biogasProduced: "الغاز الحيوي المنتج",
    fuelRequests: "طلبات الوقود",
    schools: "المدارس",
    
    // Navigation
    organicWasteLogging: "تسجيل النفايات العضوية",
    fuelRequestManagement: "إدارة طلبات الوقود",
    reports: "التقارير",
    settings: "الإعدادات",
    about: "حول",
    help: "مساعدة",
    logout: "تسجيل الخروج",
    
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
    
    // Settings
    applicationSettings: "إعدادات التطبيق",
    notifications: "الإشعارات",
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
    deliveryAddress: "عنوان التسليم"
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load language from default or backend user profile
  useEffect(() => {
    // TODO: Optionally fetch user language from backend profile
    setCurrentLanguage('en');
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    // Optionally sync with backend user profile
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
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
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};