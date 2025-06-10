import React from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageTest() {
  const { i18n } = useTranslation();
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <p>Langue détectée : {i18n.language}</p>
      <p>Langue du navigateur : {navigator.language}</p>
      <p>Langues supportées : {i18n.options.supportedLngs?.join(', ')}</p>
    </div>
  );
}