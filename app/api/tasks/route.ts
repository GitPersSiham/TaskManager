import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/libs/mongodb';
import Task from '@/models/task';

export async function GET() {
  await dbConnect();
  const tasks = await Task.find();
  return NextResponse.json({ success: true, data: tasks });
}

export async function POST(request: NextRequest) {
  await dbConnect();
  const body = await request.json();
  const task = await Task.create(body);
  
  return NextResponse.json({ success: true, data: task });;
}
