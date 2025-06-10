<<<<<<< HEAD
import { clsx, type ClassValue } from 'clsx';
=======
import { ClassValue, clsx } from 'clsx';
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
<<<<<<< HEAD
}
=======
}
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
