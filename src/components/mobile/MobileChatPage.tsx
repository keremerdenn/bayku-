"use client";
import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const USER_KEY = "sinavPusulasiUser";

interface Message {
  id: string;
  user_email: string;
  message: string;
  created_at: string;
}

export default function MobileChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) {
          // Kullanıcı giriş yapmamış, landing page'e yönlendir
          window.location.href = "/";
          return;
        }
        
        const user = JSON.parse(userStr);
        if (!user.email) {
          // Geçersiz user data, landing page'e yönlendir
          localStorage.removeItem(USER_KEY);
          window.location.href = "/";
          return;
        }
        
        setUserEmail(user.email);
      } catch {
        // Geçersiz user data, landing page'e yönlendir
        localStorage.removeItem(USER_KEY);
        window.location.href = "/";
        return;
      }
      
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userEmail) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      user_email: userEmail,
      message: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamış kullanıcılar için boş div (yönlendirme yapılacak)
  if (!userEmail) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Genel Sohbet</h1>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-br from-sky-50 via-blue-50 to-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-4 text-base">Henüz mesaj yok.</span>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.user_email === userEmail;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-5 py-3 shadow-lg transition-all duration-200 text-base font-medium break-words animate-fade-in
                      ${isOwnMessage
                        ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white border-2 border-sky-300'
                        : 'bg-white text-gray-900 border-2 border-sky-100'}
                    `}
                  >
                    <p className="text-base leading-snug">{message.message}</p>
                    <p className={`text-xs mt-2 ${isOwnMessage ? 'text-sky-100' : 'text-gray-500'}`}>{formatTime(message.created_at)}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={sendMessage} className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 p-4 border-2 border-sky-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-400 bg-sky-50 text-gray-900 text-base font-medium shadow-md"
            disabled={!userEmail}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !userEmail}
            className="p-4 bg-gradient-to-br from-sky-500 to-blue-500 text-white rounded-2xl shadow-lg hover:from-sky-600 hover:to-blue-600 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
} 