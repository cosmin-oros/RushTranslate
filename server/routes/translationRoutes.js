const express = require("express");
const router = express.Router();
const {
  getPackages,
  getPackageTranslations,
  getLanguageTranslations,
  addOrUpdateTranslations
} = require("../controllers/translationController");

// List all packages
router.get("/packages", getPackages);

// Get all translations for a specific package
router.get("/:package", getPackageTranslations);

// Get translations for a specific package and language
router.get("/:package/:language", getLanguageTranslations);

// Add or update translations for a specific package and language
router.post("/:package", addOrUpdateTranslations);

module.exports = router;
