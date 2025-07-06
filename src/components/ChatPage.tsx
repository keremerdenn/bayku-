"use client";

import React, { useState } from "react";

// Avatar bileşeni - yerel SVG oluşturur
const Avatar = ({ name = "User", size = 22, className = "" }: { name?: string; size?: number; className?: string }) => {
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
        fontSize: `${Math.max(size * 0.4, 11)}px`
      }}
    >
      {initials}
    </div>
  );
};

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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header - Daha kompakt ve küçük */}
      <div className="bg-white px-2 py-1 md:p-6 border-b border-gray-200 rounded-t-2xl shadow-sm flex items-center gap-2 md:gap-3 min-h-[44px]">
        <div className="w-7 h-7 md:w-10 md:h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-lg">
          🦉
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm md:text-xl font-bold text-gray-900 truncate">Baykuş AI Asistan</h2>
          <p className="text-[11px] md:text-base text-gray-600 truncate">Sınav konularında size yardımcı oluyorum</p>
        </div>
      </div>

      {/* Chat Messages - Daha küçük balonlar ve spacing */}
      <div className="flex-1 overflow-y-auto px-1 py-1 md:p-6 space-y-1.5 md:space-y-4 chat-container">
        {messages.map((msg, i) =>
          msg.type === "sent" ? (
            <div key={i} className="flex justify-end">
              <div className="chat-bubble-sent px-2 py-1.5 md:px-4 md:py-2 max-w-[85%] md:max-w-md lg:max-w-lg break-words chat-message text-xs md:text-base">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start items-end space-x-1.5">
              <Avatar name={msg.sender?.name || "User"} size={18} className="md:w-8 md:h-8" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-sm text-gray-500 mb-0.5 truncate">{msg.sender?.name || "User"}</p>
                <div className="chat-bubble-received px-2 py-1.5 md:px-4 md:py-2 max-w-[85%] md:max-w-md lg:max-w-lg break-words chat-message text-xs md:text-base">
                  {msg.text}
                </div>
              </div>
            </div>
          )
        )}
        
        {isTyping && (
          <div className="flex justify-start items-end space-x-1.5">
            <Avatar name="Baykuş AI" size={18} className="md:w-8 md:h-8" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] md:text-sm text-gray-500 mb-0.5">Baykuş AI</p>
              <div className="chat-bubble-received px-2 py-1.5 md:px-4 md:py-2">
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
      
      {/* Chat Input - Daha küçük ve kompakt */}
      <div className="bg-white px-1 py-1 md:p-6 border-t border-gray-200 rounded-b-2xl chat-input shadow-sm">
        <div className="flex space-x-1.5 md:space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-2 py-1.5 md:px-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent form-input text-xs md:text-base"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="px-2 py-1.5 md:px-6 md:py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed form-button flex-shrink-0"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 