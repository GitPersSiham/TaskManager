import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/libs/supabaseClient';

export async function GET() {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: tasks });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // On retire tous les champs uuid vides
  const { id, user_id, ...rest } = body;
  const insertData: any = { ...rest, subtasks: body.subtasks ?? null };

  // Si user_id est défini et non vide, on l’ajoute
  if (user_id) insertData.user_id = user_id;

  const { data: task, error } = await supabase
    .from('tasks')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: task });
}
