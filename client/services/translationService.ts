import axios from "axios";
import { ENDPOINTS } from "../endpoints";
import { Translation } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fetch translations for a specific package and language from the API
export const fetchLanguageTranslations = async (
  packageName: string,
  language: string
): Promise<Translation[]> => {
  try {
    const response = await axios.get<Translation[]>(
      ENDPOINTS.getLanguageTranslations(packageName, language.toLowerCase())
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching translations:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// Save translations to local storage
export const saveTranslationsToStorage = async (
  packageName: string,
  language: string,
  translations: Translation[]
): Promise<void> => {
  try {
    const storageKey = `${packageName}_${language}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(translations));
    console.log(`Translations saved locally for ${packageName} (${language}).`);
  } catch (error) {
    console.error("Error saving translations to storage:", error);
  }
};

// Retrieve translations from local storage
export const getTranslationsFromStorage = async (
  packageName: string,
  language: string
): Promise<Translation[] | null> => {
  try {
    const storageKey = `${packageName}_${language}`;
    const storedTranslations = await AsyncStorage.getItem(storageKey);
    return storedTranslations ? JSON.parse(storedTranslations) : null;
  } catch (error) {
    console.error("Error retrieving translations from storage:", error);
    return null;
  }
};

// Check if translations for a package and language exist in local storage
export const areTranslationsSaved = async (
  packageName: string,
  language: string
): Promise<boolean> => {
  try {
    const storageKey = `${packageName}_${language}`;
    const storedTranslations = await AsyncStorage.getItem(storageKey);
    return !!storedTranslations;
  } catch (error) {
    console.error("Error checking if translations are saved:", error);
    return false;
  }
};

// Remove translations for a package and language from local storage
export const removeTranslationsFromStorage = async (
  packageName: string,
  language: string
): Promise<void> => {
  try {
    const storageKey = `${packageName}_${language}`;
    await AsyncStorage.removeItem(storageKey);
    console.log(
      `Translations removed locally for ${packageName} (${language}).`
    );
  } catch (error) {
    console.error("Error removing translations from storage:", error);
  }
};

// Clear all translations from local storage
export const clearAllTranslationsFromStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const translationKeys = keys.filter(
      (key) => key.includes("_") // Assuming translation keys follow the `${packageName}_${language}` format
    );
    await AsyncStorage.multiRemove(translationKeys);
    console.log("All translations cleared from local storage.");
  } catch (error) {
    console.error("Error clearing all translations from storage:", error);
  }
};
