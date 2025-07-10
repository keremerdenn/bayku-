/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import RoomChatPage from "./RoomChatPage";
import ColoredOwlIcon from "./ColoredOwlIcon";
import { useSession } from '@supabase/auth-helpers-react';

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

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeRoom, setActiveRoom] = useState<{ id: string, name?: string } | null>(null);
  const [formError, setFormError] = useState("");
  const session = useSession();

  // Email'i localStorage'dan güvenli şekilde oku
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
    console.log("Kullanıcı email:", userEmail);
    // Kullanıcının üyesi olduğu odaları getir
    const { data, error } = await supabase
      .from("room_members")
      .select("room_id, rooms(name)")
      .eq("user_email", userEmail);
    console.log("Room members data:", data);
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
      // 1. Oda oluştur
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert([{ name: roomName, created_by: userEmail }])
        .select()
        .single();
      if (roomError) throw roomError;
      console.log("Oluşturulan oda:", room);
      // 2. Kurucuyu ve davetliyi ekle
      const { error: insertError } = await supabase.from("room_members").insert([
        { room_id: room.id, user_email: userEmail, is_admin: true },
        inviteEmail ? { room_id: room.id, user_email: inviteEmail, is_admin: false } : null,
      ].filter(Boolean));
      if (insertError) {
        setError("room_members insert hatası: " + insertError.message);
        console.error("room_members insert hatası:", insertError);
      }
      setRoomName("");
      setInviteEmail("");
      fetchRooms();
    } catch (err: any) {
      setError(err.message || "Oda oluşturulamadı");
      console.error("Oda oluşturma hatası:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!session?.user?.email) return;
    await fetch('/api/rooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, email: session.user.email }),
    });
    // Oda silindikten sonra odaları tekrar çek veya sayfayı yenile
    window.location.reload();
  };

  if (activeRoom) {
    return (
      <div>
        <button onClick={() => setActiveRoom(null)} className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold">← Oda Listesine Dön</button>
        <RoomChatPage roomId={activeRoom.id} roomName={activeRoom.name} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-200 via-fuchsia-100 to-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat pb-20">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent tracking-tight flex items-center justify-center gap-2">
            <svg width='36' height='36' fill='none' viewBox='0 0 24 24'><path d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' stroke='#0ea5e9' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
            Sohbet Odalarım
          </h1>
          <div className="text-lg text-sky-600 font-semibold mt-2 animate-fade-in">Arkadaşlarınla sohbet etmek için yeni bir oda oluştur!</div>
        </div>
        <form onSubmit={handleCreateRoom} className="mb-8 space-y-3 bg-gradient-to-r from-sky-50 to-fuchsia-50 p-6 rounded-2xl border-2 border-transparent bg-clip-padding shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <input
              type="text"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              placeholder="Oda adı"
              className="flex-1 p-3 rounded-xl border border-sky-200 bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              required
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="Davet etmek istediğin kişinin maili (opsiyonel)"
              className="flex-1 p-3 rounded-xl border border-sky-200 bg-white text-gray-900 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
            />
          </div>
          {formError && <div className="text-red-500 text-center font-semibold mb-2">{formError}</div>}
          <button
            type="submit"
            className="w-full md:w-auto bg-sky-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow hover:bg-sky-600 active:scale-95 transition-all duration-200 disabled:opacity-50"
            disabled={loading || !roomName.trim()}
          >
            {loading ? "Oluşturuluyor..." : "Oda Oluştur"}
          </button>
        </form>
        {loading && <div className="flex flex-col items-center justify-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500 mb-2"></div><span className="text-sky-700">Yükleniyor...</span></div>}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {!loading && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="mt-4 text-lg bg-gradient-to-r from-sky-500 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent font-bold">Henüz hiç oda yok.</span>
          </div>
        )}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {rooms.map((room) => (
            <div key={room.room_id} className="relative bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-sky-200 transition-all duration-300 cursor-pointer p-6" onClick={() => setActiveRoom({ id: room.room_id, name: room.rooms?.name })}>
              <div className="flex items-center gap-3 mb-3">
                <ColoredOwlIcon size={32} gradientId="owlChat" gradient={{from: '#a78bfa', to: '#2563eb'}} />
                <h3 className="font-bold text-lg text-gray-800 tracking-tight">{room.rooms?.name || "Oda"}</h3>
                {session?.user?.email === 'keremerdeen@gmail.com' && (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(room.room_id); }} className="ml-2 text-red-500 hover:underline">Sil</button>
                )}
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-purple-600 font-medium">Sohbet Odası</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" style={{width:'60%'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage; 