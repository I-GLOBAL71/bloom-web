import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './fonts.css';
import './index.css';
import './i18n';
import { auth } from './lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Attendre que i18next soit initialisé avant de rendre l'application
import i18next from 'i18next';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Fonction pour rendre l'application
const renderApp = () => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

// Attendre que Firebase Auth soit prêt
const waitForAuth = async () => {
  try {
    // La persistence est déjà configurée dans config.ts
    console.log('[Main] Waiting for auth initialization');

    return new Promise<void>((resolve, reject) => {
      // Timeout de 30 secondes
      const timeout = setTimeout(() => {
        console.warn('[Main] Auth initialization timeout');
        reject(new Error('Auth initialization timeout'));
      }, 30000);

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        clearTimeout(timeout);
        console.log('[Main] Initial auth state received:', user ? 'Logged in' : 'Not logged in');
        unsubscribe();
        resolve();
      }, (error) => {
        clearTimeout(timeout);
        console.error('[Main] Auth initialization error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('[Main] Error during auth initialization:', error);
    throw error;
  }
};

// Initialiser l'application
const initializeApp = async () => {
  try {
    // Attendre l'initialisation de Firebase Auth et i18next
    await Promise.all([
      waitForAuth(),
      new Promise<void>((resolve) => {
        if (i18next.isInitialized) {
          resolve();
        } else {
          i18next.on('initialized', () => resolve());
        }
      })
    ]);

    console.log('[Main] All initializations complete');
    renderApp();
  } catch (error) {
    console.error('[Main] Error during initialization:', error);
    // En cas d'erreur critique, on essaie quand même de rendre l'app
    renderApp();
  }
};

// Démarrer l'initialisation
initializeApp();

// Écouter les erreurs non gérées
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Main] Unhandled promise rejection:', event.reason);
});
