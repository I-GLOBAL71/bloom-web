import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Lire le fichier de service account
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../serviceAccountKey.json'), 'utf8')
);

// Initialiser Firebase Admin avec le fichier de service account
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

(async () => {
  try {
    const email = 'fabricewilliam73@gmail.com';
    await db.collection('userRoles').doc(email).set({
      role: 'super-admin',
      email: email,
      updatedAt: new Date()
    });
    console.log(`Successfully set ${email} as super-admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting super-admin:', error);
    process.exit(1);
  }
})();