const TranslationPackage = require("../models/translationPackage");

// List all available packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await TranslationPackage.find({}, "packageName");
    res.json(packages.map(pkg => pkg.packageName));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get translations for a specific package
exports.getPackageTranslations = async (req, res) => {
  const { package } = req.params;
  try {
    const translationPackage = await TranslationPackage.findOne({ packageName: package });
    if (!translationPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(translationPackage.languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get translations for a specific package and language
exports.getLanguageTranslations = async (req, res) => {
  const { package, language } = req.params;
  try {
    const translationPackage = await TranslationPackage.findOne({ packageName: package });
    if (!translationPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    const languageData = translationPackage.languages.find(lang => lang.language === language);
    if (!languageData) {
      return res.status(404).json({ message: "Language not found in this package" });
    }
    res.json(languageData.translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update a package with translations for a specific language
exports.addOrUpdateTranslations = async (req, res) => {
  const { package } = req.params;
  const { language, translations } = req.body;

  try {
    let translationPackage = await TranslationPackage.findOne({ packageName: package });
    if (!translationPackage) {
      translationPackage = new TranslationPackage({ packageName: package, languages: [] });
    }

    const languageIndex = translationPackage.languages.findIndex(lang => lang.language === language);
    if (languageIndex !== -1) {
      translationPackage.languages[languageIndex].translations = translations;
    } else {
      translationPackage.languages.push({ language, translations });
    }

    await translationPackage.save();
    res.status(200).json({ message: "Translations updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
