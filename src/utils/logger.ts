const DEBUG = true;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
}

const logs: LogEntry[] = [];

const formatData = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
};

export const logger = {
  debug: (component: string, message: string, data?: any) => {
    if (!DEBUG) return;
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'debug' as LogLevel,
      component,
      message,
      data
    };
    logs.push(entry);
    console.debug(`[${entry.timestamp}] [${component}] ${message}`, data || '');
  },

  info: (component: string, message: string, data?: any) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'info' as LogLevel,
      component,
      message,
      data
    };
    logs.push(entry);
    console.info(`[${entry.timestamp}] [${component}] ${message}`, data || '');
  },

  warn: (component: string, message: string, data?: any) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'warn' as LogLevel,
      component,
      message,
      data
    };
    logs.push(entry);
    console.warn(`[${entry.timestamp}] [${component}] ${message}`, data || '');
  },

  error: (component: string, message: string, error?: any) => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: 'error' as LogLevel,
      component,
      message,
      data: {
        error: error?.message || error,
        stack: error?.stack,
        code: error?.code
      }
    };
    logs.push(entry);
    console.error(`[${entry.timestamp}] [${component}] ${message}`, entry.data);
  },

  // Méthodes spécifiques pour le debugging Firebase
  firebase: {
    auth: (action: string, data?: any) => {
      logger.debug('Firebase/Auth', action, data);
    },
    firestore: (action: string, data?: any) => {
      logger.debug('Firebase/Firestore', action, data);
    },
    error: (component: string, error: any) => {
      logger.error('Firebase/' + component, 'Error occurred', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        serverResponse: error?.serverResponse
      });
    }
  },

  // Récupérer tous les logs
  getLogs: () => [...logs],

  // Nettoyer les logs
  clearLogs: () => {
    logs.length = 0;
  }
};
