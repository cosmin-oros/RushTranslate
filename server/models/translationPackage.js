const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  text: { type: String, required: true }
});

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  translations: [translationSchema]
});

const translationPackageSchema = new mongoose.Schema({
  packageName: { type: String, required: true, unique: true },
  languages: [languageSchema]
});

module.exports = mongoose.model("TranslationPackage", translationPackageSchema);
