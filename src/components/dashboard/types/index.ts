export interface Profile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  location: string;
  interests: string[];
}

export interface MenuItem {
  icon: React.ComponentType;
  label: string;
  active?: boolean;
}

export interface Notification {
  id: number;
  type: 'match' | 'message' | 'like';
  message: string;
  time: string;
  icon: React.ComponentType;
  color: string;
}