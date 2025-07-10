import React, { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

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

interface Member {
  user_email: string;
  is_admin?: boolean;
}

const RoomChatPage = ({ roomId, roomName }: { roomId: string, roomName?: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserEmail(user.email || "");
        } catch {}
      }
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });
    if (!error) setMessages((data as Message[]) || []);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    if (roomId) fetchMessages();
  }, [roomId, fetchMessages]);

  // Supabase Realtime subscription
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel('room-messages-' + roomId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [roomId, fetchMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("room_members")
        .select("user_email, is_admin")
        .eq("room_id", roomId);
      if (!error) {
        const membersData = (data as Member[]) || [];
        setMembers(membersData);
        // Kullanıcı admin mi?
        const me = membersData.find((m) => m.user_email === userEmail);
        setIsAdmin(!!me?.is_admin);
      }
    };
    fetchMembers();
  }, [roomId, userEmail]);

  const handleSendMessage = async (e: React.FormEvent) => {
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
    setLoading(true);
    await supabase.from("messages").insert({
      room_id: roomId,
      sender_email: userEmail,
      content: newMessage.trim(),
    });
    setNewMessage("");
    fetchMessages();
    setLoading(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    if (!inviteEmail.trim()) return;
    if (members.some((m) => m.user_email === inviteEmail)) {
      setInviteError("Bu kullanıcı zaten üye.");
      return;
    }
    const { error } = await supabase.from("room_members").insert({
      room_id: roomId,
      user_email: inviteEmail,
      is_admin: false
    });
    if (error) setInviteError(error.message);
    else setInviteEmail("");
    // Üyeler listesini güncelle
    const { data } = await supabase
      .from("room_members")
      .select("user_email, is_admin")
      .eq("room_id", roomId);
    setMembers((data as Member[]) || []);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{roomName || "Oda Sohbeti"}</h2>
            <p className="text-sky-100 text-sm mt-1">{members.length} üye</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a6 6 0 1 0 0 12A6 6 0 0 0 12 6z" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Üyeler Listesi */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-gray-700">Üyeler:</span>
          <div className="flex flex-wrap gap-2">
            {members.map((member, i) => (
              <span key={i} className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium border border-sky-200">
                {member.user_email.split("@")[0]}
              </span>
            ))}
          </div>
        </div>
        
        {/* Admin Davet Formu */}
        {isAdmin && (
          <form onSubmit={handleInvite} className="flex gap-3 items-center">
            <input
              type="email"
              placeholder="Davet edilecek e-posta"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
              required
            />
            <button type="submit" className="bg-sky-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-sky-600 transition-colors">
              Davet Et
            </button>
            {inviteError && <span className="text-red-500 text-xs">{inviteError}</span>}
          </form>
        )}
      </div>

      {/* Mesajlar Alanı */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-[400px] max-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            <span className="ml-3 text-gray-600">Yükleniyor...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 4a6 6 0 1 0 0 12A6 6 0 0 0 12 6z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="mt-4 text-lg">Henüz mesaj yok.</span>
            <p className="text-sm mt-2">İlk mesajı göndererek sohbeti başlatın!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender_email === userEmail ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md ${msg.sender_email === userEmail ? "order-2" : "order-1"}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm
                    ${msg.sender_email === userEmail 
                      ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white" 
                      : "bg-white text-gray-800 border border-gray-200"
                    }
                  `}>
                    <span className="block whitespace-pre-line">{msg.content}</span>
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${msg.sender_email === userEmail ? "text-right" : "text-left"}`}>
                    {msg.sender_email === userEmail ? "Siz" : msg.sender_email.split("@")[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mesaj Gönderme Formu */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            placeholder="Mesajınızı yazın..."
            maxLength={300}
          />
          <button 
            type="submit" 
            className="bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl px-6 py-3 font-semibold hover:from-sky-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading || !newMessage.trim()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        {inputError && <div className="text-red-500 text-center font-semibold mt-2 text-sm">{inputError}</div>}
      </div>
    </div>
  );
};

export default RoomChatPage; 