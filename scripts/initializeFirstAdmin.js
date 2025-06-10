const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../serviceAccountKey.json');

// Initialiser Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Email de l'utilisateur à définir comme admin
const ADMIN_EMAIL = process.argv[2];

if (!ADMIN_EMAIL) {
  console.error('❌ Veuillez fournir l\'email de l\'administrateur en argument');
  console.log('Usage: node scripts/initializeFirstAdmin.js admin@example.com');
  process.exit(1);
}

async function initializeAdmin() {
  try {
    // Rechercher l'utilisateur par email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', ADMIN_EMAIL)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error(`❌ Aucun utilisateur trouvé avec l'email ${ADMIN_EMAIL}`);
      process.exit(1);
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Créer le rôle admin pour l'utilisateur
    await db.doc(`users/${userId}/roles/admin`).set({
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Créer l'entrée dans la collection globale des rôles
    await db.doc(`roles/${userId}`).set({
      userId: userId,
      roles: ['admin'],
      email: ADMIN_EMAIL,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`✅ Rôle admin attribué avec succès à ${ADMIN_EMAIL}`);
    console.log(`ID utilisateur: ${userId}`);

    // Initialiser les paramètres de matching par défaut si nécessaire
    const matchingSettingsDoc = await db.doc('settings/matching').get();
    
    if (!matchingSettingsDoc.exists) {
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
        updatedBy: userId
      };

      await db.doc('settings/matching').set(defaultMatchingSettings);
      console.log('✅ Paramètres de matching initialisés avec succès');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initializeAdmin().then(() => {
  console.log('✅ Initialisation terminée avec succès');
  process.exit(0);
});