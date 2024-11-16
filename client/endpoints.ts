export const API_BASE_URL = "http://localhost:5000/api/translations";

export const ENDPOINTS = {
  getPackages: `${API_BASE_URL}/packages`, // List all available translation packages
  getPackageTranslations: (packageName: string) =>
    `${API_BASE_URL}/${packageName}`, // Get translations for a specific package
  getLanguageTranslations: (packageName: string, language: string) =>
    `${API_BASE_URL}/${packageName}/${language}`, // Get translations for a specific language within a package
  addOrUpdateTranslations: (packageName: string) =>
    `${API_BASE_URL}/${packageName}`, // Add or update translations for a specific language in a package
};
