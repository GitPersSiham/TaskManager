// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/libs/mongodb';
import Task from '@/models/task';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const { id } = context.params;
  const task = await Task.findById(id);
  if (!task) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: task });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await request.json();
  const task = await Task.findByIdAndUpdate(params.id, body, { new: true });
  if (!task) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: task });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const task = await Task.findByIdAndDelete(params.id);
  if (!task) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, message: 'Deleted' });
}
