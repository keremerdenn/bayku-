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
  const { error } = await supabase.from("rooms").delete().eq("id", id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 