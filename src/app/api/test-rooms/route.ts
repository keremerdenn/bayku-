import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Rooms tablosunun tüm verilerini getir
    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("*");
    
    if (roomsError) {
      return NextResponse.json({ error: roomsError.message }, { status: 500 });
    }

    // Room_members tablosunun tüm verilerini getir
    const { data: members, error: membersError } = await supabase
      .from("room_members")
      .select("*");
    
    if (membersError) {
      return NextResponse.json({ error: membersError.message }, { status: 500 });
    }

    return NextResponse.json({
      rooms,
      members,
      message: "Rooms ve members tabloları başarıyla getirildi"
    });
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
} 