<<<<<<< HEAD
import React, { useState } from 'react';
import { useConversationHistory } from '../../hooks/useConversationHistory';
import ChatMessage from './ChatMessage';
import { ChatNavigation } from './ChatNavigation';
import { ChatHeader } from './ChatHeader';
import { ChatActions } from './ChatActions';
import { FlowerConfirmationModal } from './FlowerConfirmationModal';
import type { User } from '../../types';

interface Message {
  id: number;
  content?: string;
  timestamp: string;
  isOwn: boolean;
  sender?: string;
  flowerGift?: {
    count: number;
    value: number;
  };
  file?: {
    name: string;
    url: string;
  };
  image?: {
    url: string;
  };
  voiceMessage?: {
    url: string;
  };
}

interface ChatContainerProps {
  recipient: User;
  onNavigateToEvents?: () => void;
  userBalance?: number;
  onNavigateToStore?: () => void;
  onBack: () => void;
}

export function ChatContainer({
  recipient,
  onNavigateToEvents,
  userBalance = 0,
  onNavigateToStore,
  onBack
}: ChatContainerProps): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Bonjour ! Comment allez-vous ?",
      timestamp: "14:30",
      isOwn: false,
      sender: recipient.name
    },
    {
      id: 2,
      content: "Très bien, merci ! Et vous ?",
      timestamp: "14:31",
      isOwn: true
    },
    {
      id: 3,
      timestamp: "14:32",
      isOwn: false,
      sender: recipient.name,
      flowerGift: {
        count: 3,
        value: 1.50
      }
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [flowerCount, setFlowerCount] = useState(1);
  const [showFlowerModal, setShowFlowerModal] = useState(false);

  const { addToConversationHistory } = useConversationHistory();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    try {
      await addToConversationHistory(recipient.id, inputMessage);
      setMessages([...messages, newMessage]);
      setInputMessage("");
    } catch (error) {
      console.error('Error adding to conversation history:', error);
      // On ajoute quand même le message à l'interface utilisateur
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const handleShowFlowerModal = () => {
    setShowFlowerModal(true);
  };

  const handleSendFlower = async () => {
    const newMessage: Message = {
      id: messages.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      flowerGift: {
        count: flowerCount,
        value: flowerCount * 0.5
      }
    };

    try {
      await addToConversationHistory(recipient.id, `A envoyé ${flowerCount} fleur(s)`);
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error('Error adding flower gift to conversation history:', error);
      setMessages([...messages, newMessage]);
    }
    
    setShowFlowerModal(false);
    setFlowerCount(1); // Réinitialiser le compteur
  };

  const handleFlowerCountChange = (count: number) => {
    if (count >= 1) {  // Assurons-nous que le compte ne descend pas en dessous de 1
      setFlowerCount(count);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  const handleFileUpload = async (file: File) => {
    const newMessage: Message = {
      id: messages.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      file: {
        name: file.name,
        url: URL.createObjectURL(file)
      }
    };

    try {
      await addToConversationHistory(recipient.id, `A envoyé un fichier: ${file.name}`);
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error('Error adding file to conversation history:', error);
      setMessages([...messages, newMessage]);
    }
  };

  const handleImageUpload = async (image: File) => {
    const newMessage: Message = {
      id: messages.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      image: {
        url: URL.createObjectURL(image)
      }
    };

    try {
      await addToConversationHistory(recipient.id, 'A envoyé une image');
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error('Error adding image to conversation history:', error);
      setMessages([...messages, newMessage]);
    }
  };

  const handleVoiceRecord = async (audioBlob: Blob) => {
    const newMessage: Message = {
      id: messages.length + 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      voiceMessage: {
        url: URL.createObjectURL(audioBlob)
      }
    };

    try {
      await addToConversationHistory(recipient.id, 'A envoyé un message vocal');
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error('Error adding voice message to conversation history:', error);
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-rose-50 to-white z-[100]">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="border-b border-rose-100 shadow-sm">
          <ChatNavigation
            recipient={recipient}
            onBack={onBack}
          />
          <ChatHeader
            recipient={recipient}
            onCreateEvent={onNavigateToEvents}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-[30] mt-[100px]">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content || ""}
            timestamp={message.timestamp}
            isOwn={message.isOwn}
            sender={message.sender}
            flowerGift={message.flowerGift}
            file={message.file}
            image={message.image}
            voiceMessage={message.voiceMessage}
            onSendFlower={handleShowFlowerModal}
          />
        ))}
      </div>

      <div className="border-t border-rose-100 p-4 bg-white/90 backdrop-blur-sm shadow-lg sticky bottom-0 z-[60]">
        <ChatActions
          onEmojiSelect={handleEmojiSelect}
          onFileUpload={handleFileUpload}
          onImageUpload={handleImageUpload}
          onVoiceRecord={handleVoiceRecord}
          onSendFlower={handleShowFlowerModal}
          onBuyFlowers={onNavigateToStore}
          userBalance={userBalance}
        />
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-2 border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white/50 backdrop-blur-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm"
          >
            Envoyer
          </button>
        </div>
      </div>

      {showFlowerModal && (
        <FlowerConfirmationModal
          flowerCount={flowerCount}
          cost={flowerCount * 0.5}
          userBalance={userBalance}
          onConfirm={handleSendFlower}
          onCancel={() => setShowFlowerModal(false)}
          onBuyFlowers={onNavigateToStore}
          onFlowerCountChange={(count: number) => {
            console.log('ChatContainer: Updating flower count to:', count);
            setFlowerCount(count);
          }}
        />
      )}
    </div>
  );
}
=======
import React from 'react';
import { useChat } from './hooks/useChat';
import { ChatList } from './components/ChatList';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';

export function ChatContainer() {
  const {
    conversations,
    activeConversation,
    messages,
    sendMessage,
    setActiveConversation
  } = useChat('current-user-id');

  return (
    <div className="flex h-full">
      <div className="w-80 border-r bg-white">
        <ChatList
          conversations={conversations}
          activeId={activeConversation}
          onSelect={setActiveConversation}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === 'current-user-id'}
                />
              ))}
            </div>
            <ChatInput
              onSend={(content) => sendMessage(content, activeConversation)}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sélectionnez une conversation pour commencer à discuter
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
