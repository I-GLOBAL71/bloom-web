import { Flower, Leaf, TreePine } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface GardenIdentity {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const GARDEN_IDENTITIES: GardenIdentity[] = [
  { 
    id: 'rose', 
    label: 'Rose', 
    icon: Flower, 
    description: 'I identify as a woman' 
  },
  { 
    id: 'bumblebee', 
    label: 'Bumblebee', 
    icon: Leaf, 
    description: 'I identify as a man' 
  },
  { 
    id: 'garden', 
    label: 'Garden', 
    icon: TreePine, 
    description: 'I identify as non-binary' 
  }
];