import axios from "axios";
import { ENDPOINTS } from "../endpoints";
import { Translation, LanguageTranslations } from "../types";

export const fetchLanguageTranslations = async (
  packageName: string,
  language: string
): Promise<Translation[]> => {
  try {
    const response = await axios.get<LanguageTranslations>(
      ENDPOINTS.getLanguageTranslations(packageName, language)
    );
    return response.data.translations;
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
