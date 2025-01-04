import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useChat } from '../../chat/hooks/useChat';
import { useSocket } from '../../chat/hooks/useSocket';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export function MessagesSection() {
  const { currentUser } = useAuth();
  const { conversations, loadConversations } = useChat(currentUser?.uid || '');
  const { sendMessage, emitTyping } = useSocket(currentUser?.uid || '');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadConversations();
      } catch (err) {
        setError('Failed to load conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [loadConversations]);

  const handleConversationClick = (conversationId: string) => {
    navigate(`/dashboard/home/messages/${conversationId}`);
  };

  const getParticipantInfo = (conversationId: string) => {
    // TODO: Implement participant info fetching
    return {
      name: 'Participant',
      photo: 'https://via.placeholder.com/150',
      lastSeen: Date.now()
    };
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MessageCircle className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Messages</h1>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          {error}
        </div>
      ) : (
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {conversations.length > 0 ? conversations.map(conversation => (
            <motion.div
              key={conversation.id}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="relative">
                <img
                  src={getParticipantInfo(conversation.id).photo}
                  alt={getParticipantInfo(conversation.id).name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">
                    {getParticipantInfo(conversation.id).name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
            </motion.div>
          )) : (
            <div className="p-6 text-center text-gray-500">
              No conversations found
            </div>
          )}
        </motion.div>
      )}
      <Outlet />
    </div>
  );
}
