"use client";

import React, { useState } from "react";

// Avatar bileşeni - yerel SVG oluşturur
const Avatar = ({ name = "User", size = 32, className = "" }: { name?: string; size?: number; className?: string }) => {
  const colors = [
    '#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color,
        fontSize: `${Math.max(size * 0.4, 12)}px`
      }}
    >
      {initials}
    </div>
  );
};

const exampleUsers = [
  { name: "Ayşe" },
  { name: "Mehmet" },
  { name: "Zeynep" },
  { name: "Can" },
];
const currentUser = { name: "Ben" };

type Message = {
  id: number;
  text: string;
  type: string;
  sender?: { name: string; avatar?: string };
  timestamp: Date;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Merhaba! Ben Baykuş AI asistanınız. Size nasıl yardımcı olabilirim?",
      type: "received",
      sender: { name: "Baykuş AI", avatar: "🦉" },
      timestamp: new Date()
    },
    {
      id: 2,
      text: "Merhaba! Matematik konusunda yardıma ihtiyacım var.",
      type: "sent",
      timestamp: new Date()
    },
    {
      id: 3,
      text: "Tabii ki! Hangi matematik konusunda yardıma ihtiyacınız var? TYT mi yoksa AYT konularından mı?",
      type: "received",
      sender: { name: "Baykuş AI", avatar: "🦉" },
      timestamp: new Date()
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      type: "sent",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simüle edilmiş AI yanıtı
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "Anlıyorum! Size bu konuda yardımcı olabilirim. Hangi spesifik soru veya konu hakkında yardım istiyorsunuz?",
        type: "received",
        sender: { name: "Baykuş AI", avatar: "🦉" },
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-white p-4 md:p-6 border-b border-gray-200 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
            🦉
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Baykuş AI Asistan</h2>
            <p className="text-sm md:text-base text-gray-600">Sınav konularında size yardımcı oluyorum</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 chat-container">
        {messages.map((msg, i) =>
          msg.type === "sent" ? (
            <div key={i} className="flex justify-end">
              <div className="chat-bubble-sent px-4 py-2 max-w-xs md:max-w-md lg:max-w-lg break-words chat-message">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start items-end space-x-2">
              <Avatar name={msg.sender?.name || "User"} size={32} />
              <div>
                <p className="text-sm text-gray-500 mb-1">{msg.sender?.name || "User"}</p>
                <div className="chat-bubble-received px-4 py-2 max-w-xs md:max-w-md lg:max-w-lg break-words chat-message">
                  {msg.text}
                </div>
              </div>
            </div>
          )
        )}
        
        {isTyping && (
          <div className="flex justify-start items-end space-x-2">
            <Avatar name="Baykuş AI" size={32} />
            <div>
              <p className="text-sm text-gray-500 mb-1">Baykuş AI</p>
              <div className="chat-bubble-received px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="bg-white p-4 md:p-6 border-t border-gray-200 rounded-b-2xl chat-input">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-3 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent form-input"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="px-6 py-3 md:py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed form-button"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 