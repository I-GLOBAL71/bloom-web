import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import i18n from './i18n';

// Wait for i18next to initialize
i18n.on('initialized', () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});

// Register service worker for image proxy
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/image-proxy-worker.js')
      .then(registration => {
        console.log('Image proxy service worker registered:', registration.scope);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  });
}