/**
 * Safe logging utility for production environments
 * Only logs full error details in development mode
 */

const isDev = import.meta.env.DEV;

/**
 * Safely log errors - full details in dev, sanitized in production
 */
export const logError = (message: string, error: unknown): void => {
  if (isDev) {
    console.error(message, error);
  } else {
    // In production, log only safe error message
    const safeError = error instanceof Error ? error.message : 'Unknown error';
    console.error(message, safeError);
  }
};

/**
 * Safely log warnings - full details in dev, sanitized in production
 */
export const logWarn = (message: string, data?: unknown): void => {
  if (isDev) {
    console.warn(message, data);
  } else {
    console.warn(message);
  }
};

/**
 * Development-only logging - completely suppressed in production
 */
export const logDebug = (message: string, data?: unknown): void => {
  if (isDev) {
    console.log(message, data);
  }
};
