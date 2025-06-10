import { logger } from './logger';

export const splashLogger = {
  mounted: () => {
    logger.info('SplashScreen', 'Component mounted', {
      timestamp: new Date().toISOString()
    });
  },

  fadeOut: () => {
    logger.info('SplashScreen', 'Fade out animation started', {
      timestamp: new Date().toISOString()
    });
  },

  navigationAttempt: () => {
    logger.info('SplashScreen', 'Navigation attempt detected', {
      timestamp: new Date().toISOString()
    });
  },

  navigationSuccess: () => {
    logger.info('SplashScreen', 'Navigation successful', {
      timestamp: new Date().toISOString()
    });
  },

  navigationError: (error: any) => {
    logger.error('SplashScreen', 'Navigation error', {
      error,
      timestamp: new Date().toISOString()
    });
  },

  cleanup: () => {
    logger.debug('SplashScreen', 'Component cleanup', {
      timestamp: new Date().toISOString()
    });
  }
};
