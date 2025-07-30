// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/libs/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { data: task, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', (await params).id)
    .single();

  if (error || !task) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: task });
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  const body = await request.json();

  const { id } = params;
  console.log('Reçu PUT pour id :', id);
  console.log('Données envoyées :', body);
  console.log('ID transmis au backend :', id);  
  const { data: task, error } = await supabase
    .from('tasks')
    .update(body)
    .eq('id', id)
    .select()
    .single();
 
  if (error || !task) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: task });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', (await params).id);

  if (error) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Deleted' });
}
