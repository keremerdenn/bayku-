"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { PaperAirplaneIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const USER_KEY = "sinavPusulasiUser";

interface Message {
  id: string;
  room_id: string;
  sender_email: string;
  content: string;
  created_at: string;
}

interface MobileRoomChatPageProps {
  roomId: string;
  roomName?: string;
}

export default function MobileRoomChatPage({ roomId, roomName }: MobileRoomChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputError, setInputError] = useState("");

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

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    
    if (error) {
      console.error("Mesajlar yüklenemedi:", error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }, [roomId]);

  const subscribeToMessages = useCallback(() => {
    const subscription = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    if (userEmail && roomId) {
      fetchMessages();
      const unsubscribe = subscribeToMessages();
      return unsubscribe;
    }
  }, [userEmail, roomId, fetchMessages, subscribeToMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError("");
    if (!userEmail) {
      setInputError("Kullanıcı doğrulanamadı. Lütfen tekrar giriş yapın.");
      return;
    }
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
    const messageToSend = newMessage.trim();
    setNewMessage(""); // Hemen input'u temizle
    const { error } = await supabase
      .from("messages")
      .insert([{
        room_id: roomId,
        sender_email: userEmail,
        content: messageToSend
      }]);
    if (error) {
      setInputError("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
      setNewMessage(messageToSend);
    }
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
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{roomName || "Sohbet Odası"}</h1>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Henüz mesaj yok.</div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_email === userEmail;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? 'bg-sky-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-sky-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
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
          {inputError && <div className="text-red-500 text-center font-semibold mb-2 w-full">{inputError}</div>}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            disabled={!userEmail}
            maxLength={300}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !userEmail}
            className="p-4 bg-sky-500 text-white rounded-2xl hover:bg-sky-600 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
} 