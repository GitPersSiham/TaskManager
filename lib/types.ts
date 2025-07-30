import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

// lib/types.ts
export type Subtask = {
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // Correction ici : string au lieu de Timestamp
  priority?: string;
  category?: string;
  status?: string;
  subtasks?: Subtask[];
  created_at?: string;
  updated_at?: string;
};