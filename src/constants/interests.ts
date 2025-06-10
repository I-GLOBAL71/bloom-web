import { 
  Music, Palette, Camera, Plane, Book, Utensils, 
  Bike, Film, Gamepad, Flower2, Dog, Coffee,
  Mic, Mountain, Users, Heart
} from 'lucide-react';

export const INTEREST_CATEGORIES = [
  {
    name: 'Arts & Culture',
    interests: [
      { id: 'music', title: 'Music', icon: Music },
      { id: 'art', title: 'Art', icon: Palette },
      { id: 'photography', title: 'Photography', icon: Camera },
      { id: 'literature', title: 'Literature', icon: Book }
    ]
  },
  {
    name: 'Lifestyle',
    interests: [
      { id: 'travel', title: 'Travel', icon: Plane },
      { id: 'food', title: 'Food & Cooking', icon: Utensils },
      { id: 'fitness', title: 'Fitness', icon: Bike },
      { id: 'coffee', title: 'Coffee', icon: Coffee }
    ]
  },
  {
    name: 'Entertainment',
    interests: [
      { id: 'movies', title: 'Movies', icon: Film },
      { id: 'gaming', title: 'Gaming', icon: Gamepad },
      { id: 'podcasts', title: 'Podcasts', icon: Mic },
      { id: 'social', title: 'Social Life', icon: Users }
    ]
  },
  {
    name: 'Nature & Animals',
    interests: [
      { id: 'hiking', title: 'Hiking', icon: Mountain },
      { id: 'gardening', title: 'Gardening', icon: Flower2 },
      { id: 'pets', title: 'Pets', icon: Dog },
      { id: 'romance', title: 'Romance', icon: Heart }
    ]
  }
];