const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../serviceAccountKey.json');

// Initialiser Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Paramètres de matching par défaut
const defaultMatchingSettings = {
  weights: {
    interestMatch: 0.25,
    distance: 0.20,
    activity: 0.10,
    photoQuality: 0.05,
    personalityMatch: 0.15,
    interactionHistory: 0.10,
    eventParticipation: 0.10,
    profileCompleteness: 0.05,
  },
  preferences: {
    dealBreakers: {
      mustHavePhoto: true,
      minProfileCompletion: 0.5,
      maxDistance: 100,
      hasVerifiedProfile: false,
      noReports: true,
    },
    boostFactors: {
      verifiedProfile: 0.2,
      premium: 0.3,
      mutualConnections: 0.2,
      activeInLastWeek: 0.1,
    },
  },
  updatedAt: new Date(),
};

async function initializeSettings() {
  try {
    // Vérifier si les paramètres existent déjà
    const settingsDoc = await db.doc('settings/matching').get();
    
    if (!settingsDoc.exists) {
      // Créer les paramètres s'ils n'existent pas
      await db.doc('settings/matching').set(defaultMatchingSettings);
      console.log('✅ Paramètres de matching initialisés avec succès');
    } else {
      console.log('ℹ️ Les paramètres de matching existent déjà');
      
      // Mettre à jour avec les nouveaux champs si nécessaire
      const currentSettings = settingsDoc.data();
      const updatedSettings = {
        ...defaultMatchingSettings,
        ...currentSettings,
        weights: {
          ...defaultMatchingSettings.weights,
          ...(currentSettings.weights || {})
        },
        preferences: {
          ...defaultMatchingSettings.preferences,
          ...(currentSettings.preferences || {}),
          dealBreakers: {
            ...defaultMatchingSettings.preferences.dealBreakers,
            ...(currentSettings.preferences?.dealBreakers || {})
          },
          boostFactors: {
            ...defaultMatchingSettings.preferences.boostFactors,
            ...(currentSettings.preferences?.boostFactors || {})
          }
        }
      };

      if (JSON.stringify(currentSettings) !== JSON.stringify(updatedSettings)) {
        await db.doc('settings/matching').update(updatedSettings);
        console.log('✅ Paramètres de matching mis à jour avec les nouveaux champs');
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des paramètres:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initializeSettings().then(() => process.exit(0));