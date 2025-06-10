import type { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sophie',
    age: 28,
    bio: 'Passionnée d\'art et de photographie 🎨📸\nJ\'aime voyager et découvrir de nouvelles cultures.',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
    ],
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    gender: 'rose',
    location: { city: 'Paris', country: 'France' },
    interests: ['art', 'photographie', 'voyage', 'cuisine'],
    profession: 'Photographe freelance',
    petals: 150,
    isPremium: true,
    lastActive: new Date(),
    isVerified: true
  },
  {
    id: '2',
    name: 'Marie',
    age: 31,
    bio: 'Juriste passionnée de danse et de théâtre 💃\nÀ la recherche d\'une belle rencontre',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    ],
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    gender: 'rose',
    location: { city: 'Lyon', country: 'France' },
    interests: ['danse', 'théâtre', 'lecture', 'yoga'],
    profession: 'Avocate',
    petals: 75,
    isPremium: false,
    lastActive: new Date(Date.now() - 3600000) // 1 heure
  },
  {
    id: '3',
    name: 'Emma',
    age: 25,
    bio: '🌱 Engagée pour l\'environnement\nStartupeuse dans la GreenTech 🚀',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263'
    ],
    photoURL: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    gender: 'rose',
    location: { city: 'Bordeaux', country: 'France' },
    interests: ['écologie', 'entrepreneuriat', 'randonnée', 'méditation'],
    profession: 'Entrepreneur',
    petals: 200,
    isPremium: true,
    lastActive: new Date(Date.now() - 86400000), // 24 heures
    isVerified: true
  },
  {
    id: '4',
    name: 'Léa',
    age: 29,
    bio: 'Médecin et mélomane 🎵\nFan de concerts et festivals',
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
      'https://images.unsplash.com/photo-1523264941339-b9fb14ebb6b1'
    ],
    photoURL: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
    gender: 'rose',
    location: { city: 'Toulouse', country: 'France' },
    interests: ['musique', 'festivals', 'voyage', 'gastronomie'],
    profession: 'Médecin',
    petals: 100,
    isPremium: false,
    lastActive: new Date()
  },
  {
    id: '5',
    name: 'Julie',
    age: 27,
    bio: 'Prof de yoga & digital nomad 🧘‍♀️\nJ\'adore les sports d\'aventure et la nature',
    photos: [
      'https://images.unsplash.com/photo-1524638431109-93d95c968f03',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e'
    ],
    photoURL: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03',
    gender: 'rose',
    location: { city: 'Nice', country: 'France' },
    interests: ['yoga', 'voyage', 'sports extrêmes', 'photographie'],
    profession: 'Professeur de yoga',
    petals: 180,
    isPremium: true,
    lastActive: new Date(Date.now() - 7200000), // 2 heures
    isVerified: true
  }
];

// Garder l'ancien mock user pour la rétrocompatibilité
export const MOCK_USER = MOCK_USERS[0];