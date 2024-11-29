import axios from "axios";
import { ENDPOINTS } from "../endpoints";
import { Translation } from "../types";

export const fetchLanguageTranslations = async (
  packageName: string,
  language: string
): Promise<Translation[]> => {
  try {
    // Fetch translations for the specified package and language
    const response = await axios.get<Translation[]>(
      ENDPOINTS.getLanguageTranslations(packageName, language)
    );

    // Return the list of translations directly
    return response.data; // Data is already an array of translations
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
