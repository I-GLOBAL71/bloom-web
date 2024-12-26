import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const femalePhotos = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
];

const malePhotos = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'
];

const cities = [
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Lyon', lat: 45.7578, lng: 4.8320 },
  { name: 'Marseille', lat: 43.2965, lng: 5.3698 },
  { name: 'Bordeaux', lat: 44.8378, lng: -0.5792 },
  { name: 'Lille', lat: 50.6292, lng: 3.0573 }
];

const interests = [
  'Voyage', 'Photographie', 'Cuisine', 'Sport', 'Musique',
  'Art', 'Cinéma', 'Lecture', 'Danse', 'Nature',
  'Yoga', 'Mode', 'Tech', 'Gaming', 'Randonnée'
];

const femaleNames = [
  'Sophie', 'Emma', 'Louise', 'Alice', 'Chloé',
  'Julie', 'Léa', 'Marie', 'Clara', 'Camille'
];

const maleNames = [
  'Lucas', 'Hugo', 'Thomas', 'Nathan', 'Louis',
  'Gabriel', 'Léo', 'Jules', 'Arthur', 'Adam'
];

const bios = [
  "Passionnée de voyage et de photographie. J'aime découvrir de nouvelles cultures et capturer des moments uniques.",
  "Amateur de bons restaurants et de soirées conviviales. La vie est faite pour être savourée !",
  "Sportif dans l'âme, je pratique la course à pied et le yoga. À la recherche d'une personne qui partage ma passion.",
  "Creative et spontanée, j'aime l'art sous toutes ses formes. Fan de musées et d'expositions.",
  "Entrepreneur dans la tech, je cherche quelqu'un qui partage mon ambition et mon envie d'innovation."
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function createTestUsers() {
  try {
    // Créer 5 profils féminins
    for (let i = 0; i < 5; i++) {
      const city = getRandomElement(cities);
      const birthDate = getRandomDate(new Date('1990-01-01'), new Date('2000-12-31'));
      
      await addDoc(collection(db, 'users'), {
        displayName: femaleNames[i],
        photoURL: `${femalePhotos[i]}?w=400`,
        photos: [`${femalePhotos[i]}?w=800`],
        bio: getRandomElement(bios),
        birthDate: Timestamp.fromDate(birthDate),
        gender: 'female',
        location: {
          city: city.name,
          coordinates: {
            latitude: city.lat,
            longitude: city.lng
          }
        },
        interests: getRandomElements(interests, 5),
        premium: Math.random() > 0.7,
        credits: Math.floor(Math.random() * 1000),
        settings: {
          maxDistance: 50,
          ageRange: {
            min: 25,
            max: 35
          },
          showMe: 'male',
          notifications: {
            matches: true,
            messages: true,
            likes: true
          }
        },
        stats: {
          matches: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 200),
          superLikes: Math.floor(Math.random() * 20)
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }

    // Créer 5 profils masculins
    for (let i = 0; i < 5; i++) {
      const city = getRandomElement(cities);
      const birthDate = getRandomDate(new Date('1990-01-01'), new Date('2000-12-31'));
      
      await addDoc(collection(db, 'users'), {
        displayName: maleNames[i],
        photoURL: `${malePhotos[i]}?w=400`,
        photos: [`${malePhotos[i]}?w=800`],
        bio: getRandomElement(bios),
        birthDate: Timestamp.fromDate(birthDate),
        gender: 'male',
        location: {
          city: city.name,
          coordinates: {
            latitude: city.lat,
            longitude: city.lng
          }
        },
        interests: getRandomElements(interests, 5),
        premium: Math.random() > 0.7,
        credits: Math.floor(Math.random() * 1000),
        settings: {
          maxDistance: 50,
          ageRange: {
            min: 25,
            max: 35
          },
          showMe: 'female',
          notifications: {
            matches: true,
            messages: true,
            likes: true
          }
        },
        stats: {
          matches: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 200),
          superLikes: Math.floor(Math.random() * 20)
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }

    console.log('✅ 10 profils de test créés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la création des profils :', error);
  }
}

// Exécuter le script
createTestUsers();
