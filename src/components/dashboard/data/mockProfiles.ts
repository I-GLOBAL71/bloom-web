import { Profile } from '../types';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'Sophie',
    age: 28,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'
    ],
    bio: 'Passionnée d\'art et de voyages ✈️',
    location: 'Paris',
    interests: ['Art', 'Voyages', 'Photographie']
  },
  {
    id: '2',
    name: 'Marie',
    age: 25,
    photos: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'
    ],
    bio: 'Amoureuse de la nature et du sport 🌿',
    location: 'Lyon',
    interests: ['Sport', 'Nature', 'Cuisine']
  }
];