export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  }).format(date);
}

export function getRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (Math.abs(days) > 0) return rtf.format(days, 'day');
  if (Math.abs(hours) > 0) return rtf.format(hours, 'hour');
  if (Math.abs(minutes) > 0) return rtf.format(minutes, 'minute');
  return rtf.format(seconds, 'second');
}

export const formatRelativeTime = getRelativeTime;

export function formatLastActive(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Si moins de 30 secondes, considérer comme "en ligne"
  if (diffInSeconds < 30) {
    return 'en ligne';
  }

  // Si moins d'une minute
  if (diffInSeconds < 60) {
    return 'il y a quelques secondes';
  }

  // Si moins d'une heure
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  // Si moins d'un jour
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }

  // Si moins d'une semaine
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }

  // Si plus d'une semaine, afficher la date
  return formatDate(date);
}

export function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}