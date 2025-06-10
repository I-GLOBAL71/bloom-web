import React, { useEffect, useRef, useState } from 'react';
import type { User } from '../../types';

interface Conversation {
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

type CanvasContextType = CanvasRenderingContext2D | null;
type AnimationFrameId = number;

interface ConversationGardenProps {
  conversations: Conversation[];
  onSelectConversation: (user: User) => void;
  selectedUser?: User;
}

const FLOWERS_PER_PAGE = 6; // Nombre de fleurs affichées par page

export function ConversationGarden({ 
  conversations, 
  onSelectConversation,
  selectedUser 
}: ConversationGardenProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(conversations.length / FLOWERS_PER_PAGE);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d') as CanvasContextType;
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    // Ajuster la taille du canvas pour qu'il soit responsive
    const resizeCanvas = (): void => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dessiner le jardin
    const drawGarden = (): void => {
      if (!ctx || !canvas) return;
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grass background
      const gradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
      gradient.addColorStop(0, '#90EE90');
      gradient.addColorStop(1, '#228B22');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculer les conversations à afficher pour la page courante
      const startIdx = currentPage * FLOWERS_PER_PAGE;
      const endIdx = Math.min(startIdx + FLOWERS_PER_PAGE, conversations.length);
      const visibleConversations = conversations.slice(startIdx, endIdx);

      // Dessiner les indicateurs de pagination
      const paginationY = canvas.height - 20;
      for (let i = 0; i < totalPages; i++) {
        ctx.beginPath();
        ctx.arc(
          (canvas.width / 2) + ((i - totalPages / 2) * 20),
          paginationY,
          5,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = i === currentPage ? '#FF69B4' : '#FFC0CB';
        ctx.fill();
      }

      // Dessiner chaque conversation comme une fleur
      visibleConversations.forEach((conv, index) => {
        const x = (canvas.width / (FLOWERS_PER_PAGE + 1)) * (index + 1);
        const y = canvas.height - 140;
        
        // La taille de la fleur dépend du nombre de messages non lus
        const flowerSize = 30 + (conv.unreadCount * 5);
        
        // Dessiner la tige
        ctx.beginPath();
        ctx.moveTo(x, y + flowerSize);
        ctx.lineTo(x, y + flowerSize + 30);
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Animation de flottement basée sur le temps
        const floatOffset = Math.sin(Date.now() / 1000 + index) * 5;

        // Dessiner les pétales
        const isSelected = selectedUser?.id === conv.user.id;
        const petalColor = isSelected ? '#FF69B4' : '#FFB6C1';
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          ctx.beginPath();
          ctx.ellipse(
            x + Math.cos(angle) * 15,
            y + floatOffset + Math.sin(angle) * 15,
            flowerSize / 2,
            flowerSize / 4,
            angle,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = petalColor;
          ctx.fill();
        }

        // Dessiner le centre de la fleur
        ctx.beginPath();
        ctx.arc(x, y + floatOffset, flowerSize / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();

        // Ajouter le nom et le dernier message
        const nameText = conv.user.displayName;
        const messageText = conv.lastMessage.length > 15 
          ? conv.lastMessage.substring(0, 15) + '...'
          : conv.lastMessage;
        
        // Mesurer la largeur du texte
        ctx.font = 'bold 14px Arial';
        const nameWidth = ctx.measureText(nameText).width + 10;
        ctx.font = '12px Arial';
        const messageWidth = ctx.measureText(messageText).width + 10;
        const maxWidth = Math.max(nameWidth, messageWidth);
        
        // Dessiner le fond pour le texte
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(
          x - maxWidth / 2,
          y + flowerSize + 35,
          maxWidth,
          40
        );
        
        // Dessiner le nom et le message
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(nameText, x, y + flowerSize + 50);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText(messageText, x, y + flowerSize + 70);
      });

      // Dessiner les flèches de navigation si nécessaire
      if (totalPages > 1) {
        // Flèche gauche
        if (currentPage > 0) {
          ctx.beginPath();
          ctx.fillStyle = '#FF69B4';
          ctx.moveTo(30, canvas.height / 2);
          ctx.lineTo(50, canvas.height / 2 - 20);
          ctx.lineTo(50, canvas.height / 2 + 20);
          ctx.fill();
        }

        // Flèche droite
        if (currentPage < totalPages - 1) {
          ctx.beginPath();
          ctx.fillStyle = '#FF69B4';
          ctx.moveTo(canvas.width - 30, canvas.height / 2);
          ctx.lineTo(canvas.width - 50, canvas.height / 2 - 20);
          ctx.lineTo(canvas.width - 50, canvas.height / 2 + 20);
          ctx.fill();
        }
      }
    };

    // Animation
    let animationFrame: AnimationFrameId;
    const animate = (): void => {
      drawGarden();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    // Gestion des clics
    const handleClick = (event: MouseEvent): void => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d') as CanvasContextType;
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Vérifier les clics sur les flèches de navigation
      if (y > canvas.height / 2 - 20 && y < canvas.height / 2 + 20) {
        if (x < 50 && currentPage > 0) {
          setCurrentPage(prev => prev - 1);
          return;
        }
        if (x > canvas.width - 50 && currentPage < totalPages - 1) {
          setCurrentPage(prev => prev + 1);
          return;
        }
      }

      // Calculer les conversations visibles
      const startIdx = currentPage * FLOWERS_PER_PAGE;
      const endIdx = Math.min(startIdx + FLOWERS_PER_PAGE, conversations.length);
      const visibleConversations = conversations.slice(startIdx, endIdx);

      // Vérifier les clics sur les fleurs
      visibleConversations.forEach((conv, index) => {
        const flowerX = (canvas.width / (FLOWERS_PER_PAGE + 1)) * (index + 1);
        const flowerY = canvas.height - 140;
        
        const distance = Math.sqrt(
          Math.pow(x - flowerX, 2) + Math.pow(y - flowerY, 2)
        );
        
        if (distance < 40) {
          onSelectConversation(conv.user);
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrame);
    };
  }, [conversations, selectedUser, onSelectConversation, currentPage, totalPages]);

  return (
    <div className="relative w-full h-64 mb-4">
      <canvas 
        ref={canvasRef}
        className="w-full h-full rounded-lg shadow-inner"
      />
      {conversations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Aucune conversation active</p>
        </div>
      )}
    </div>
  );
}