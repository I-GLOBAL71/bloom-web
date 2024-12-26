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