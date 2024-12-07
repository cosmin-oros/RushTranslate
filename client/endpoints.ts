import { EXPO_PUBLIC_API_BASE_URL } from "@env";

export const ENDPOINTS = {
  getPackages: `${EXPO_PUBLIC_API_BASE_URL}/packages`, // List all available translation packages
  getPackageTranslations: (packageName: string) =>
    `${EXPO_PUBLIC_API_BASE_URL}/${packageName}`, // Get all translations for a specific package
  getLanguageTranslations: (packageName: string, language: string) =>
    `${EXPO_PUBLIC_API_BASE_URL}/${packageName}/${language}`, // Get translations for a specific language in a package
  addOrUpdateTranslations: (packageName: string) =>
    `${EXPO_PUBLIC_API_BASE_URL}/${packageName}`, // Add or update translations for a specific language in a package
};
