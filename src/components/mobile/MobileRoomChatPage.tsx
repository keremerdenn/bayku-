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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        
        // Admin kontrolü
        const checkAdminStatus = async () => {
          const { data, error } = await supabase
            .from("room_members")
            .select("is_admin")
            .eq("room_id", roomId)
            .eq("user_email", user.email)
            .single();
          
          if (!error && data) {
            setIsAdmin(!!data.is_admin);
          }
        };
        
        checkAdminStatus();
      } catch {
        // Geçersiz user data, landing page'e yönlendir
        localStorage.removeItem(USER_KEY);
        window.location.href = "/";
        return;
      }
      
      setIsLoading(false);
    }
  }, [roomId]);

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

  const handleDeleteRoom = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteRoom = async () => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: roomId, email: userEmail }),
      });
      
      if (response.ok) {
        // Oda silindikten sonra ana sayfaya yönlendir
        window.location.href = '/#/dashboard';
      } else {
        const data = await response.json();
        alert(data.error || "Oda kapatılamadı.");
      }
    } catch {
      alert("Oda kapatılırken bir hata oluştu.");
    }
    setShowDeleteModal(false);
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
          {isAdmin && (
            <button
              onClick={handleDeleteRoom}
              className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition-colors"
              title="Odayı Kapat"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
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
            className="flex-1 p-4 border border-gray-300 rounded-2xl !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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

      {/* Oda Kapatma Onay Modal'ı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Odayı Kapat</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Bu odayı kapatmak istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm mesajlar silinecektir.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDeleteRoom}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Evet, Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 