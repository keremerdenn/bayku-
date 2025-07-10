import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(request: Request) {
  const { id, email } = await request.json();
  if (email !== "keremerdeen@gmail.com") {
    return new Response(JSON.stringify({ error: "Yetkisiz işlem" }), { status: 403 });
  }
  if (!id) {
    return new Response(JSON.stringify({ error: "Eksik id" }), { status: 400 });
  }
  
  try {
    // Önce room_members tablosundaki ilgili kayıtları sil
    const { error: membersError } = await supabase
      .from("room_members")
      .delete()
      .eq("room_id", id);
    
    if (membersError) {
      return new Response(JSON.stringify({ error: "Üye kayıtları silinemedi: " + membersError.message }), { status: 500 });
    }
    
    // Sonra messages tablosundaki ilgili mesajları sil
    const { error: messagesError } = await supabase
      .from("messages")
      .delete()
      .eq("room_id", id);
    
    if (messagesError) {
      return new Response(JSON.stringify({ error: "Mesaj kayıtları silinemedi: " + messagesError.message }), { status: 500 });
    }
    
    // En son odayı sil
    const { error: roomError } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id);
    
    if (roomError) {
      return new Response(JSON.stringify({ error: "Oda silinemedi: " + roomError.message }), { status: 500 });
    }
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Bilinmeyen hata: " + (error as Error).message }), { status: 500 });
  }
} 