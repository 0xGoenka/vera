import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * API configuration
 * Uses environment variables when available, falls back to defaults
 */

const getApiBaseUrl = (): string => {
  // Check for environment variable first
  const envUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  if (envUrl && typeof envUrl === "string") {
    return envUrl;
  }

  // Check for __DEV__ flag (development mode) and web platform
  if (__DEV__ && Platform.OS === "web") {
    return "http://localhost:3001";
  }

  // Production fallback
  return "https://vera-assignment-api.vercel.app";
};

export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    stream: "/api/stream",
  },
} as const;

/**
 * Get full URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};
