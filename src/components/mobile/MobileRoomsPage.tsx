"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import MobileLayout from "./MobileLayout";
import MobileRoomChatPage from "./MobileRoomChatPage";
import { PlusIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const USER_KEY = "sinavPusulasiUser";

interface Room {
  room_id: string;
  rooms?: { name: string } | null;
}

interface SupabaseRoomRaw {
  room_id: string;
  rooms?: { name: string }[] | { name: string } | null;
}

interface ErrorWithMessage {
  message: string;
}

export default function MobileRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeRoom, setActiveRoom] = useState<{ id: string, name?: string } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem(USER_KEY);
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.email && typeof user.email === "string" && user.email.includes("@")) {
            setUserEmail(user.email);
          } else {
            setUserEmail(null);
          }
        } else {
          setUserEmail(null);
        }
      } catch {
        setUserEmail(null);
      }
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    if (!userEmail) {
      setError("Kullanıcı emaili bulunamadı. Lütfen tekrar giriş yapın.");
      setRooms([]);
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from("room_members")
      .select("room_id, rooms(name)")
      .eq("user_email", userEmail);
    
    if (error) setError(error.message);
    else if (data) {
      const fixed = (data as unknown[]).map((item) => {
        const raw = item as SupabaseRoomRaw;
        return {
          ...raw,
          rooms: Array.isArray(raw.rooms) ? raw.rooms[0] : raw.rooms
        } as Room;
      });
      setRooms(fixed);
    } else setRooms([]);
    setLoading(false);
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) fetchRooms();
  }, [userEmail, fetchRooms]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!roomName.trim()) {
      setFormError("Oda adı boş olamaz.");
      return;
    }
    if (roomName.length > 40) {
      setFormError("Oda adı 40 karakterden uzun olamaz.");
      return;
    }
    if (!/^[a-zA-Z0-9ğüşöçıİĞÜŞÖÇ\s]+$/.test(roomName)) {
      setFormError("Oda adı sadece harf, rakam ve boşluk içerebilir.");
      return;
    }
    if (inviteEmail && inviteEmail.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inviteEmail)) {
      setFormError("Davet edilen e-posta adresi geçersiz.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert([{ name: roomName, created_by: userEmail }])
        .select()
        .single();
      if (roomError) throw roomError;
      
      const { error: insertError } = await supabase.from("room_members").insert([
        { room_id: room.id, user_email: userEmail, is_admin: true },
        inviteEmail ? { room_id: room.id, user_email: inviteEmail, is_admin: false } : null,
      ].filter(Boolean));
      
      if (insertError) {
        setError("room_members insert hatası: " + insertError.message);
      }
      setRoomName("");
      setInviteEmail("");
      setShowCreateForm(false);
      fetchRooms();
    } catch (err: unknown) {
      const error = err as ErrorWithMessage;
      setError(error.message || "Oda oluşturulamadı");
    }
    setLoading(false);
  };

  if (activeRoom) {
    return (
      <MobileLayout currentPage="sohbet">
        <div className="space-y-4">
          <button 
            onClick={() => setActiveRoom(null)} 
            className="flex items-center space-x-2 text-sky-600 font-semibold mb-4 active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Oda Listesine Dön</span>
          </button>
          <MobileRoomChatPage roomId={activeRoom.id} roomName={activeRoom.name} />
        </div>
      </MobileLayout>
    );
  }

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

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white pb-20 overflow-x-hidden">
      {svgPattern}
      <MobileLayout currentPage="sohbet">
        <div className="relative z-10 space-y-6 p-4 pt-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-sky-700 tracking-tight drop-shadow-lg">Sohbet Odalarım</h1>
              <p className="text-sky-600 font-semibold animate-fade-in">Arkadaşlarınla çalış ve soruları tartış</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="p-4 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white rounded-2xl shadow-lg hover:from-fuchsia-500 hover:to-sky-500 active:scale-97 transition-all duration-200 animate-pop-in"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Oda Oluşturma Formu */}
          {showCreateForm && (
            <div className="bg-gradient-to-br from-white via-fuchsia-50 to-sky-50 rounded-3xl p-6 shadow-2xl border-2 border-sky-100 animate-fade-in">
              <h3 className="text-lg font-bold text-sky-700 mb-4">Yeni Oda Oluştur</h3>
              <form onSubmit={handleCreateRoom} className="space-y-4 animate-pop-in">
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-2">Oda Adı</label>
                  <input
                    type="text"
                    placeholder="Oda adını girin"
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                    className="w-full p-4 border-2 border-sky-200 rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-700 mb-2">Davet Et (Opsiyonel)</label>
                  <input
                    type="email"
                    placeholder="arkadas@email.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-full p-4 border-2 border-sky-200 rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white py-4 rounded-2xl font-semibold hover:from-fuchsia-500 hover:to-sky-500 active:scale-97 transition-all duration-200 disabled:opacity-50 animate-fade-in"
                  >
                    {loading ? "Oluşturuluyor..." : "Oda Oluştur"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-4 border-2 border-sky-200 text-sky-700 rounded-2xl font-semibold hover:bg-sky-50 transition-all duration-200 animate-fade-in"
                  >
                    İptal
                  </button>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-fade-in">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                {formError && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 animate-fade-in">
                    <p className="text-yellow-600 text-sm">{formError}</p>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Odalar Listesi */}
          <div className="mt-4">
            <h2 className="text-xl font-bold text-sky-700 mb-2">Odalarım</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
              </div>
            ) : rooms.length === 0 ? (
              <div className="bg-gradient-to-br from-white via-fuchsia-50 to-sky-50 rounded-3xl p-8 text-center shadow-2xl border-2 border-sky-100 animate-fade-in">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-sky-300 mx-auto mb-4 animate-pop-in" />
                <h3 className="text-lg font-semibold text-sky-700 mb-2">Henüz Oda Yok</h3>
                <p className="text-sky-600 mb-4">İlk sohbet odanı oluştur ve arkadaşlarınla çalışmaya başla!</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-fuchsia-500 hover:to-sky-500 transition-all duration-200 animate-fade-in"
                >
                  İlk Odayı Oluştur
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {rooms.map((room) => (
                  <div key={room.room_id} className="bg-gradient-to-br from-sky-100 via-fuchsia-50 to-white rounded-2xl shadow-xl border-2 border-sky-200 text-left cursor-pointer active:scale-97 transition-all duration-200 aspect-square flex flex-col justify-center items-center group hover:shadow-2xl animate-pop-in" onClick={() => setActiveRoom({ id: room.room_id, name: room.rooms?.name })}>
                    <h3 className="font-bold text-base text-sky-700 tracking-tight flex items-center gap-2 text-center pointer-events-none group-hover:scale-105 transition-transform duration-200">{room.rooms?.name || "Oda"}</h3>
                    <span className="mt-2 px-3 py-1 rounded-lg bg-gradient-to-r from-fuchsia-400 to-sky-400 text-white font-bold text-xs shadow pointer-events-none animate-bounce">Oda</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
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
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
      `}</style>
    </div>
  );
} 