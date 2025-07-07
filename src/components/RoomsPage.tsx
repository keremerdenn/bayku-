import React, { useEffect, useState } from "react";
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
  const [userEmail, setUserEmail] = useState("");
  const [activeRoom, setActiveRoom] = useState<{ id: string, name?: string } | null>(null);

  useEffect(() => {
    // Kullanıcı emailini localStorage'dan al
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

  useEffect(() => {
    if (userEmail) fetchRooms();
    // eslint-disable-next-line
  }, [userEmail]);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    // Kullanıcının üyesi olduğu odaları getir
    const { data, error } = await supabase
      .from("room_members")
      .select("room_id, rooms(name)")
      .eq("user_email", userEmail);
    if (error) setError(error.message);
    else if (data) {
      // rooms alanı dizi olarak gelirse ilk elemanı al
      const fixed = (data as unknown[]).map((item: unknown) => {
        const raw = item as SupabaseRoomRaw;
        return {
          ...raw,
          rooms: Array.isArray(raw.rooms) ? raw.rooms[0] : raw.rooms
        } as Room;
      });
      setRooms(fixed);
    } else setRooms([]);
    setLoading(false);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // 2. Kurucuyu ve davetliyi ekle
      await supabase.from("room_members").insert([
        { room_id: room.id, user_email: userEmail, is_admin: true },
        inviteEmail ? { room_id: room.id, user_email: inviteEmail, is_admin: false } : null,
      ].filter(Boolean));
      setRoomName("");
      setInviteEmail("");
      fetchRooms();
    } catch (err: any) {
      setError(err.message || "Oda oluşturulamadı");
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
      </form>
      <div>
        <h3 className="text-lg font-semibold mb-2">Odalar</h3>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : rooms.length === 0 ? (
          <div>Henüz bir odan yok.</div>
        ) : (
          <ul className="space-y-2">
            {rooms.map((r) => (
              <li key={r.room_id} className="bg-gray-100 rounded-lg px-4 py-3 flex items-center justify-between">
                <span>{r.rooms?.name || "Oda"}</span>
                <button className="text-sky-600 font-bold hover:underline" onClick={() => setActiveRoom({ id: r.room_id, name: r.rooms?.name })}>Giriş Yap</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomsPage; 