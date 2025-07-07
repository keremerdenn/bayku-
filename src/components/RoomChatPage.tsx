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
    if (!newMessage.trim()) return;
    setLoading(true);
    await supabase.from("messages").insert({
      room_id: roomId,
      sender_email: userEmail,
      content: newMessage,
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
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[70vh] bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">{roomName || "Oda Sohbeti"}</h2>
      <div className="mb-2 text-sm text-gray-600 flex flex-wrap gap-2 items-center">
        <span className="font-semibold">Üyeler:</span>
        {members.map((member, i) => (
          <span key={i} className="bg-sky-100 text-sky-700 px-2 py-1 rounded-lg">{member.user_email}</span>
        ))}
      </div>
      {isAdmin && (
        <form onSubmit={handleInvite} className="mb-2 flex gap-2 items-center">
          <input
            type="email"
            placeholder="Davet edilecek e-posta"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
            required
          />
          <button type="submit" className="bg-sky-600 text-white rounded-lg px-3 py-1 text-sm font-semibold hover:bg-sky-700 transition">Davet Et</button>
          {inviteError && <span className="text-red-500 text-xs ml-2">{inviteError}</span>}
        </form>
      )}
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-3">
        {loading ? (
          <div>Yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div>Henüz mesaj yok.</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`mb-2 flex ${msg.sender_email === userEmail ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender_email === userEmail ? "bg-sky-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                <div className="text-xs font-semibold mb-1">{msg.sender_email}</div>
                <div>{msg.content}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Mesajınızı yazın..."
        />
        <button type="submit" className="bg-sky-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-sky-700 transition" disabled={loading || !newMessage.trim()}>
          Gönder
        </button>
      </form>
    </div>
  );
};

export default RoomChatPage; 