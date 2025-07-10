/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import RoomChatPage from "./RoomChatPage";

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
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Sohbet Odalarım</h2>
        <form onSubmit={handleCreateRoom} className="mb-6 flex flex-col gap-3 bg-white p-4 rounded-xl shadow">
          <input
            type="text"
            placeholder="Oda adı"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            type="email"
            placeholder="Davet etmek istediğin kişinin maili (opsiyonel)"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <button type="submit" className="bg-sky-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-sky-700 transition" disabled={loading}>
            {loading ? "Oluşturuluyor..." : "Oda Oluştur"}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {formError && <div className="text-red-500 text-sm mt-2">{formError}</div>}
        </form>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {loading ? (
            <div>Yükleniyor...</div>
          ) : rooms.length === 0 ? (
            <div>Henüz bir odan yok.</div>
          ) : (
            rooms.map((room) => (
              <div key={room.room_id} className="relative aspect-square flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl border-4 border-transparent bg-clip-padding hover:border-fuchsia-400 hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer select-none" onClick={() => setActiveRoom({ id: room.room_id, name: room.rooms?.name })} tabIndex={0} role="button" aria-pressed="false">
                <h3 className="font-bold text-2xl text-sky-700 group-hover:underline tracking-tight flex items-center gap-2 text-center pointer-events-none">
                  {room.rooms?.name || "Oda"}
                </h3>
                {/* Assuming room object has a description property, otherwise this will be undefined */}
                {/* {room.description && <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-200 to-sky-200 text-sky-800 font-semibold text-sm shadow text-center pointer-events-none">{room.description}</span>} */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage; 