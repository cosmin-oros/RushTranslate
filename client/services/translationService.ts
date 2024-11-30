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

/**
 * Translates a given text from one language to another using translations from all available packages.
 *
 * @param sourceLanguage The language to translate from.
 * @param targetLanguage The language to translate to.
 * @param text The text to be translated.
 * @returns The translated text.
 */
export const translateText = async (
  sourceLanguage: string,
  targetLanguage: string,
  text: string
): Promise<string> => {
  const availablePackages = [
    "travel_essentials",
    "business_essentials",
    "medical_care_essentials",
  ];

  try {
    // Initialize translation maps for source and target languages
    const sourceToKeyMap: Record<string, string> = {};
    const keyToTargetMap: Record<string, string> = {};

    // Fetch translations for all available packages
    for (const packageName of availablePackages) {
      const sourceTranslations = await fetchLanguageTranslations(
        packageName,
        sourceLanguage
      );
      const targetTranslations = await fetchLanguageTranslations(
        packageName,
        targetLanguage
      );

      // Populate the translation maps
      sourceTranslations.forEach((translation) => {
        sourceToKeyMap[translation.text.toLowerCase()] = translation.key;
      });
      targetTranslations.forEach((translation) => {
        keyToTargetMap[translation.key] = translation.text;
      });
    }

    // Split the input text into words
    const words = text.split(" ");

    // Translate each word
    const translatedWords = words.map((word) => {
      const key = sourceToKeyMap[word.toLowerCase()];
      if (key) {
        // Translate using the target language map
        return keyToTargetMap[key] || "?";
      } else {
        // Predict or use "?" for unknown words
        return "?";
      }
    });

    // Join the translated words into a single string
    return translatedWords.join(" ");
  } catch (error) {
    console.error("Error translating text:", error);
    return "Translation failed.";
  }
};
