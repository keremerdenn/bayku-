"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import MobileLayout from "./MobileLayout";
import MobileRoomChatPage from "./MobileRoomChatPage";
import { PlusIcon, ChatBubbleLeftRightIcon, UserGroupIcon } from "@heroicons/react/24/outline";

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
            className="flex items-center space-x-2 text-sky-600 font-semibold mb-4"
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

  return (
    <MobileLayout currentPage="sohbet">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sohbet Odalarım</h1>
            <p className="text-gray-600">Arkadaşlarınla çalış ve soruları tartış</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-4 bg-sky-500 text-white rounded-2xl shadow-lg hover:bg-sky-600 transition-all duration-200 active:scale-95"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Oda Oluşturma Formu */}
        {showCreateForm && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Yeni Oda Oluştur</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Oda Adı</label>
                <input
                  type="text"
                  placeholder="Oda adını girin"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Davet Et (Opsiyonel)</label>
                <input
                  type="email"
                  placeholder="arkadas@email.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-sky-500 text-white py-4 rounded-2xl font-semibold hover:bg-sky-600 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Oluşturuluyor..." : "Oda Oluştur"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  İptal
                </button>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Odalar Listesi */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Odalarım</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Oda Yok</h3>
              <p className="text-gray-600 mb-4">İlk sohbet odanı oluştur ve arkadaşlarınla çalışmaya başla!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-sky-600 transition-all duration-200"
              >
                İlk Odayı Oluştur
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.room_id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
                  onClick={() => setActiveRoom({ id: room.room_id, name: room.rooms?.name })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {room.rooms?.name || "Oda"}
                        </h3>
                        <p className="text-gray-500 text-sm">Sohbet odası</p>
                      </div>
                    </div>
                    <div className="text-sky-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
} 