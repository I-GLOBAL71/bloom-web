import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './AppRoutes';
import './index.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { LanguageProvider } from './contexts/LanguageContext';
import { PetalCostsProvider } from './contexts/PetalCostsContext';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <AuthProvider>
          <PetalCostsProvider>
            <AppRoutes />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '10px',
                },
              }}
            />
          </PetalCostsProvider>
        </AuthProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}
