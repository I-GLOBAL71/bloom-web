import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

export interface ConversationHistory {
  userId: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  recipientId: string;
}

export function useConversationHistory() {
  const { user } = useAuth();
  const [contactedUsers, setContactedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshConversations = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!user?.id) {
      setError(new Error('User not authenticated'));
      setLoading(false);
      return;
    }

    const fetchConversationHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Starting conversation history fetch for user:', user.id);
        const conversationsRef = collection(db, 'conversationHistory');
        
        // Validate user ID format first
        if (!isNaN(Number(user.id)) && String(Number(user.id)) === user.id) {
          console.warn('Current user has numeric ID:', user.id);
          setError(new Error('Invalid user ID format'));
          setLoading(false);
          return;
        }

        // Query conversations where the user is either sender or recipient
        const conversationsQuery = query(
          conversationsRef,
          where('participants', 'array-contains', user.id)
        );

        console.log('Querying conversations for user:', user.id);
        
        const conversationsSnapshot = await getDocs(conversationsQuery);
        
        // Log raw conversation data
        console.log('Raw conversations found:', {
          total: conversationsSnapshot.size,
          conversations: conversationsSnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        });

        // Detailed conversation validation
        console.log('Processing conversations:', conversationsSnapshot.size);
        const validConversations = conversationsSnapshot.docs.filter(doc => {
          const data = doc.data();
          const conversationId = doc.id;
          
          // Check conversation structure
          if (!data.participants || !Array.isArray(data.participants)) {
            console.warn('Invalid conversation structure:', { id: conversationId, data });
            return false;
          }

          // Validate participants array
          const hasValidParticipants = data.participants.every((id: any) => {
            const isValid = typeof id === 'string' && id.length > 0;
            if (!isValid) {
              console.warn('Invalid participant in conversation:', {
                conversationId,
                invalidId: id,
                type: typeof id
              });
            }
            return isValid;
          });

          // Normalize and verify current user is included
          const normalizedParticipants = data.participants.map(id =>
            // Convert numeric strings to numbers for consistent comparison
            !isNaN(Number(id)) ? String(Number(id)) : id
          );
          const normalizedUserId = !isNaN(Number(user.id)) ? String(Number(user.id)) : user.id;
          
          const includesCurrentUser = normalizedParticipants.includes(normalizedUserId);
          if (!includesCurrentUser) {
            console.warn('Conversation missing current user:', {
              conversationId,
              participants: data.participants,
              normalizedParticipants,
              currentUser: user.id,
              normalizedUserId
            });
          }

          console.log('Conversation validation:', {
            id: conversationId,
            valid: hasValidParticipants && includesCurrentUser,
            participants: data.participants
          });

          return hasValidParticipants && includesCurrentUser;
        });

        console.log('Filtered conversations:', {
          total: validConversations.length,
          conversations: validConversations.map(doc => ({
            id: doc.id,
            data: doc.data(),
            participants: doc.data().participants
          }))
        });

        if (validConversations.length === 0) {
          console.log('No valid conversations found');
          setContactedUsers([]);
          setLoading(false);
          return;
        }

        // Extraire et valider les IDs des autres participants
        const otherUserIds = Array.from(new Set(
          validConversations.flatMap(doc => {
            const data = doc.data();
            if (!data.participants || !Array.isArray(data.participants)) {
              console.warn('Invalid conversation data structure:', data);
              return [];
            }
            return data.participants
              .filter(id => {
                // Exclude current user and validate ID format
                if (id === user.id) return false;
                
                // Basic string validation
                if (!id || typeof id !== 'string' || id.length < 1) {
                  console.warn('Invalid participant ID format:', id);
                  return false;
                }
                
                // Just log numeric IDs for monitoring but allow them
                if (!isNaN(Number(id)) && String(Number(id)) === id) {
                  console.warn('Found numeric participant ID:', id);
                }
                
                return true;
              });
          })
        ));

        console.log('Filtered participant IDs:', otherUserIds);

        if (otherUserIds.length === 0) {
          console.log('No valid participant IDs found in conversations');
          setContactedUsers([]);
          setLoading(false);
          return;
        }

        // Create minimal placeholder user objects without DB lookups
        console.log('Creating minimal placeholder users for', otherUserIds.length, 'participants');
        const users = otherUserIds.map(userId => {
          console.log(`Creating placeholder user for ID: ${userId}`);
          return {
            id: userId,
            email: `${userId}@placeholder.com`,
            displayName: `User ${userId}`,
            photoURL: 'https://example.com/default-profile.png',
            phoneNumber: null,
            profileCompleted: false,
            hasCompletedOnboarding: false,
            isPremium: false,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
            isVerified: false
          } as User;
        });

        if (users.length === 0) {
          console.log('No participants to create placeholder users for');
          setContactedUsers([]);
          setLoading(false);
          return;
        }

        console.log('Created placeholder users:', users.length);
        setContactedUsers(users);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversation history:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch conversation history'));
        setLoading(false);
      }
    };

    fetchConversationHistory();
  }, [user, refreshTrigger]);

  const addToConversationHistory = async (recipientId: string, message?: string) => {
    if (!user?.id) {
      const error = new Error('User not authenticated');
      console.error(error);
      throw error;
    }

    // Basic validation
    if (!recipientId || typeof recipientId !== 'string' || recipientId.trim().length === 0) {
      const error = new Error('Valid recipient ID is required');
      console.error(error);
      throw error;
    }

    // For development/debug purposes, let's log what we're trying to validate
    console.log('Validating recipientId:', {
      recipientId,
      type: typeof recipientId,
      isNumeric: !isNaN(Number(recipientId)),
      numericString: String(Number(recipientId))
    });

    console.log('Adding to conversation history:', {
      userId: user.id,
      recipientId,
      message
    });

    try {
      // Normalize IDs for consistent comparison
      const normalizedUserId = !isNaN(Number(user.id)) ? String(Number(user.id)) : user.id;
      const normalizedRecipientId = !isNaN(Number(recipientId)) ? String(Number(recipientId)) : recipientId;

      console.log('Creating/updating conversation between users:', {
        currentUser: user.id,
        normalizedUserId,
        recipient: recipientId,
        normalizedRecipientId
      });

      const conversationId = [normalizedUserId, normalizedRecipientId].sort().join('_');
      const conversationRef = doc(collection(db, 'conversationHistory'), conversationId);

      const conversationData = {
        userId: normalizedUserId,
        recipientId: normalizedRecipientId,
        lastMessage: message || '',
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp(),
        participants: [normalizedUserId, normalizedRecipientId],
        createdAt: serverTimestamp()
      };

      console.log('Saving conversation:', conversationData);
      await setDoc(conversationRef, conversationData, { merge: true });
      
      // Add new participant to UI immediately with normalized ID
      setContactedUsers(prevUsers => {
        // Check if user already exists using normalized IDs
        const exists = prevUsers.some(u => {
          const normalizedExistingId = !isNaN(Number(u.id)) ? String(Number(u.id)) : u.id;
          return normalizedExistingId === normalizedRecipientId;
        });
        
        if (exists) {
          console.log('User already exists in UI:', normalizedRecipientId);
          return prevUsers;
        }
        
        console.log('Adding new user to UI:', normalizedRecipientId);
        // Add new placeholder user with normalized ID
        return [...prevUsers, {
          id: normalizedRecipientId,
          email: `${recipientId}@placeholder.com`,
          displayName: `User ${recipientId}`,
          photoURL: 'https://example.com/default-profile.png',
          phoneNumber: null,
          profileCompleted: false,
          hasCompletedOnboarding: false,
          isPremium: false,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false
        } as User];
      });

      // Trigger background refresh
      refreshConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error creating conversation';
      throw new Error(errorMessage);
    }
  };

  return {
    contactedUsers,
    loading,
    error,
    addToConversationHistory,
    refreshConversations,
  };
}