import { UserProfile } from './models/user';
import { db } from './firebase';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';

// Helper function to create birthDate from age
const getBirthDateFromAge = (age: number): Timestamp => {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  return Timestamp.fromDate(new Date(birthYear, today.getMonth(), today.getDate()));
};

const testProfiles: Partial<UserProfile>[] = [
  {
    displayName: "Sophie Martin",
    gender: "female",
    birthDate: getBirthDateFromAge(28),
    bio: "Passionate about art and photography. Looking for someone to explore galleries with! ",
    photoURL: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    photos: ["https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"],
    interests: ["art", "photography", "travel"],
    location: {
      city: "Paris",
      coordinates: {
        latitude: 48.8566,
        longitude: 2.3522
      }
    },
    premium: false,
    credits: 100
  },
  {
    displayName: "Lucas Bernard",
    gender: "male",
    birthDate: getBirthDateFromAge(31),
    bio: "Tech enthusiast and coffee addict. Always up for a good conversation! ",
    photoURL: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    photos: ["https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"],
    interests: ["technology", "coffee", "music"],
    location: {
      city: "Lyon",
      coordinates: {
        latitude: 45.7640,
        longitude: 4.8357
      }
    },
    premium: true,
    credits: 500
  },
  {
    displayName: "Emma Dubois",
    gender: "female",
    birthDate: getBirthDateFromAge(26),
    bio: "Yoga instructor and plant mom. Seeking someone to share peaceful moments with ",
    photoURL: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    photos: ["https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"],
    interests: ["yoga", "meditation", "nature"],
    location: {
      city: "Marseille",
      coordinates: {
        latitude: 43.2965,
        longitude: 5.3698
      }
    },
    premium: false,
    credits: 50
  },
  {
    displayName: "Thomas Petit",
    gender: "male",
    birthDate: getBirthDateFromAge(29),
    bio: "Amateur chef and wine enthusiast. Let's cook something together! ",
    photoURL: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
    photos: ["https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg"],
    interests: ["cooking", "wine", "food"],
    location: {
      city: "Bordeaux",
      coordinates: {
        latitude: 44.8378,
        longitude: -0.5792
      }
    },
    premium: false,
    credits: 200
  },
  {
    displayName: "Julie Moreau",
    gender: "female",
    birthDate: getBirthDateFromAge(27),
    bio: "Book lover and aspiring writer. Looking for my next chapter ",
    photoURL: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
    photos: ["https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"],
    interests: ["literature", "writing", "cats"],
    location: {
      city: "Toulouse",
      coordinates: {
        latitude: 43.6043,
        longitude: 1.4442
      }
    },
    premium: false,
    credits: 150
  }
];

export async function generateTestProfiles() {
  const batch = [];
  
  for (const profile of testProfiles) {
    const profileId = Math.random().toString(36).substring(2, 15);
    const profileDoc = doc(collection(db, 'test_profiles'), profileId);
    
    batch.push(
      setDoc(profileDoc, {
        ...profile,
        id: profileId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        settings: {
          showMe: profile.gender === 'female' ? 'male' : 'female',
          ageRange: { min: 18, max: 35 },
          maxDistance: 50,
          notifications: {
            matches: true,
            messages: true,
            likes: true
          }
        }
      })
    );
  }

  await Promise.all(batch);
  console.log('Test profiles generated successfully');
}
