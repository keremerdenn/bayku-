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
  const [inputError, setInputError] = useState("");

  const handleSendMessage = () => {
    setInputError("");
    if (!newMessage.trim()) {
      setInputError("Mesaj boş olamaz.");
      return;
    }
    if (newMessage.length > 300) {
      setInputError("Mesaj 300 karakterden uzun olamaz.");
      return;
    }
    if (/[^\wğüşöçıİĞÜŞÖÇ.,!?\s]/.test(newMessage)) {
      setInputError("Mesajda geçersiz karakter var.");
      return;
    }
    try {
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
    } catch {} // eslint hatası için err kullanılmadı
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header - Mobil için optimize */}
      <div className="bg-white p-3 md:p-6 border-b border-gray-200 rounded-t-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">
            🦉
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-bold text-gray-900 truncate">Baykuş AI Asistan</h2>
            <p className="text-xs md:text-base text-gray-600 truncate">Sınav konularında size yardımcı oluyorum</p>
          </div>
        </div>
      </div>

      {/* Chat Messages - Mobil için optimize */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 chat-container bg-gradient-to-br from-sky-50 via-blue-50 to-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-base">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-4">Henüz mesaj yok.</span>
          </div>
        ) : (
          messages.map((msg, i) =>
            msg.type === "sent" ? (
              <div key={i} className="flex justify-end">
                <div className="px-0 md:px-2">
                  <div className="rounded-2xl px-5 py-3 shadow-lg transition-all duration-200 text-base font-medium break-words animate-fade-in bg-gradient-to-br from-sky-400 to-blue-500 text-white border-2 border-sky-300">
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-start items-end space-x-2">
                <Avatar name={msg.sender?.name || "User"} size={28} className="md:w-8 md:h-8" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 mb-1 truncate">{msg.sender?.name || "User"}</p>
                  <div className="rounded-2xl px-5 py-3 shadow-lg transition-all duration-200 text-base font-medium break-words animate-fade-in bg-white text-gray-900 border-2 border-sky-100">
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          )
        )}
        {isTyping && (
          <div className="flex justify-start items-end space-x-2">
            <Avatar name="Baykuş AI" size={28} className="md:w-8 md:h-8" />
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Baykuş AI</p>
              <div className="rounded-2xl px-5 py-3 bg-white border-2 border-sky-100 shadow-lg animate-fade-in">
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
      {/* Chat Input - Mobil için optimize */}
      <div className="bg-white p-3 md:p-6 border-t border-gray-200 rounded-b-2xl chat-input shadow-sm">
        <div className="flex space-x-2 md:space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-3 md:px-5 md:py-4 border-2 border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-sky-50 text-gray-900 text-base font-medium shadow-md"
            disabled={isTyping}
          />
          {inputError && <div className="text-red-500 text-center font-semibold mb-2 w-full">{inputError}</div>}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="px-5 py-3 md:px-6 md:py-4 bg-gradient-to-br from-sky-500 to-blue-500 text-white rounded-2xl shadow-lg hover:from-sky-600 hover:to-blue-600 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex-shrink-0"
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