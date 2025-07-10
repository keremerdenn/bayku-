"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import MobileLayout from "./MobileLayout";
import MobileRoomChatPage from "./MobileRoomChatPage";
import { PlusIcon } from "@heroicons/react/24/outline";

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
        <div className="max-w-md mx-auto px-4 py-4">
          <button 
            onClick={() => setActiveRoom(null)} 
            className="flex items-center gap-1 text-blue-500 text-sm font-medium mb-3 px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            <span className="text-lg">←</span> Oda Listesine Dön
          </button>
          <MobileRoomChatPage roomId={activeRoom.id} roomName={activeRoom.name} />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout currentPage="sohbet">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Sohbet Odalarım</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        {showCreateForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
            <h3 className="text-base font-medium text-gray-800 mb-2">Yeni Oda Oluştur</h3>
            <form onSubmit={handleCreateRoom} className="space-y-2">
              <input
                type="text"
                placeholder="Oda adını girin"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Davet Et (opsiyonel)"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm !text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-2 rounded font-medium text-sm hover:bg-blue-600 active:scale-95 transition disabled:opacity-50"
                >
                  {loading ? "Oluşturuluyor..." : "Oda Oluştur"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-medium text-sm hover:bg-gray-200 transition"
                >
                  İptal
                </button>
              </div>
              {error && (
                <div className="text-red-500 text-xs mt-2">{error}</div>
              )}
              {formError && (
                <div className="text-yellow-600 text-xs mt-2">{formError}</div>
              )}
            </form>
          </div>
        )}
        <h2 className="text-base font-medium text-gray-700 mb-2">Odalarım</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <span className="text-4xl mb-2">💬</span>
            <span className="text-sm">Henüz Oda Yok</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {rooms.map((room) => (
              <div key={room.room_id} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition shadow-sm" onClick={() => setActiveRoom({ id: room.room_id, name: room.rooms?.name })}>
                <h3 className="font-medium text-gray-800 text-sm mb-1">{room.rooms?.name || "Oda"}</h3>
                <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium text-xs">Oda</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
} 