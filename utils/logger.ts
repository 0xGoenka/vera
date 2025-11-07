/**
 * Centralized logging utility
 * Provides consistent logging across the application with environment-aware behavior
 */

const isDevelopment = __DEV__;

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Logger interface
 */
interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/**
 * Creates a log message with timestamp and level
 */
const createLogMessage = (level: LogLevel, ...args: unknown[]): void => {
  if (!isDevelopment && level === LogLevel.DEBUG) {
    return; // Don't log debug messages in production
  }

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;

  switch (level) {
    case LogLevel.DEBUG:
      console.log(prefix, ...args);
      break;
    case LogLevel.INFO:
      console.log(prefix, ...args);
      break;
    case LogLevel.WARN:
      console.warn(prefix, ...args);
      break;
    case LogLevel.ERROR:
      console.error(prefix, ...args);
      break;
  }
};

/**
 * Logger instance
 */
export const logger: Logger = {
  debug: (...args: unknown[]) => createLogMessage(LogLevel.DEBUG, ...args),
  info: (...args: unknown[]) => createLogMessage(LogLevel.INFO, ...args),
  warn: (...args: unknown[]) => createLogMessage(LogLevel.WARN, ...args),
  error: (...args: unknown[]) => createLogMessage(LogLevel.ERROR, ...args),
};
