const express = require('express');
const router = express.Router();
const { translations } = require('../middleware/i18n');

router.get('/translations/:lang', (req, res) => {
  const { lang } = req.params;
  const supportedLangs = ['en', 'ar'];
  
  if (!supportedLangs.includes(lang)) {
    return res.status(400).json({
      success: false,
      message: 'Unsupported language',
      supportedLanguages: supportedLangs
    });
  }
  
  res.json({
    success: true,
    language: lang,
    translations: translations[lang] || translations.en
  });
});

router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true }
    ],
    default: 'en'
  });
});

module.exports = router;
