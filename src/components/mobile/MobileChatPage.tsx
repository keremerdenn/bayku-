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
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) {
          window.location.href = "/";
          return;
        }
        const user = JSON.parse(userStr);
        if (!user.email) {
          localStorage.removeItem(USER_KEY);
          window.location.href = "/";
          return;
        }
        setUserEmail(user.email);
      } catch {}
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError("");
    if (!newMessage.trim()) {
      setInputError("Mesaj boş olamaz.");
      return;
    }
    if (newMessage.length > 300) {
      setInputError("Mesaj 300 karakterden uzun olamaz.");
      return;
    }
    if (/[^ 0-7FğüşöçıİĞÜŞÖÇ.,!?\s]/.test(newMessage)) {
      setInputError("Mesajda geçersiz karakter var.");
      return;
    }
    if (!userEmail) {
      setInputError("Kullanıcı doğrulanamadı. Lütfen tekrar giriş yapın.");
      return;
    }
    try {
      const newMsg: Message = {
        id: Date.now().toString(),
        user_email: userEmail,
        message: newMessage.trim(),
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
    } catch {}
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

  // SVG Pattern for background
  const svgPattern = (
    <svg className="absolute inset-0 w-full h-full" style={{zIndex:0}} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="6" fill="#e0e7ff" fillOpacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern-circles)" />
    </svg>
  );

  // Loading durumunda loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white flex items-center justify-center relative">
        {svgPattern}
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-sky-700 font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return <div></div>;
  }

  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white overflow-x-hidden">
      {svgPattern}
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-fuchsia-500 p-4 rounded-b-2xl shadow text-white text-center font-extrabold text-2xl mb-2 drop-shadow-lg animate-fade-in">Baykuş AI Asistan</div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative z-10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-sky-300 text-base animate-fade-in">
            <svg width="56" height="56" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-4 text-base">Henüz mesaj yok.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.user_email === userEmail ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                <div className={`max-w-[70%] p-3 rounded-2xl shadow-xl text-sm transition-all duration-200 ${msg.user_email === userEmail ? 'bg-gradient-to-r from-sky-400 to-fuchsia-400 text-white font-bold' : 'bg-gradient-to-r from-fuchsia-100 to-sky-100 text-sky-800 font-semibold'} animate-fade-in`}>
                  <p className="text-base leading-snug">{msg.message}</p>
                  <p className={`text-xs mt-2 ${msg.user_email === userEmail ? 'text-white/80' : 'text-sky-400'}`}>{formatTime(msg.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gradient-to-r from-white via-fuchsia-50 to-sky-50 border-t-2 border-sky-100 px-4 py-4 relative z-10 animate-fade-in">
        <form onSubmit={sendMessage} className="flex items-center gap-2 p-2 bg-white rounded-xl shadow-lg mt-2 animate-pop-in">
          {inputError && <div className="text-red-500 text-center font-semibold mb-2 w-full animate-fade-in">{inputError}</div>}
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesajınızı yazın..." className="flex-1 p-3 rounded-xl border-2 border-sky-200 text-base focus:ring-2 focus:ring-sky-400 focus:outline-none transition" />
          <button type="submit" className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-4 py-3 rounded-xl font-bold text-base shadow hover:from-fuchsia-500 hover:to-sky-500 active:scale-97 transition-all duration-200 flex items-center gap-1 animate-fade-in">
            <PaperAirplaneIcon className="w-5 h-5" /> Gönder
          </button>
        </form>
      </div>
      {/* Animasyonlar için ek CSS */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 