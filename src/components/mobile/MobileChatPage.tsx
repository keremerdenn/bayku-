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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="h-12 flex items-center justify-center border-b border-gray-100 text-base font-semibold text-gray-800">Baykuş AI Asistan</div>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-300 text-base">
            <span className="text-4xl mb-2">💬</span>
            <span className="text-sm">Henüz mesaj yok.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.user_email === userEmail ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-2 rounded-lg shadow-sm text-sm ${msg.user_email === userEmail ? 'bg-blue-50 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-base leading-snug">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.user_email === userEmail ? 'text-blue-400' : 'text-gray-400'}`}>{formatTime(msg.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div className="border-t border-gray-100 px-4 py-3 bg-white">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          {inputError && <div className="text-red-500 text-center font-medium text-xs mb-1 w-full">{inputError}</div>}
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mesajınızı yazın..." className="flex-1 p-2 rounded border border-gray-200 !text-gray-900 placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none" />
          <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded font-medium text-sm hover:bg-blue-600 active:scale-95 transition flex items-center gap-1">
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
} 