'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAddTask } from '@/app/hooks/useAddTask'; 

import TaskList from '@/components/ui/TasksList';

export default function Home() {
  const [newTask, setNewTask] = useState('');
  const { mutate, isError, error,isPending } = useAddTask();

  const handleAddTask = async () => {
    if (!newTask.trim()) return;  // Ne rien faire si le champ est vide

    mutate(newTask, {
      onError: (err) => {
        console.error('Erreur:', err);
      },
      onSuccess: () => {
        setNewTask('');  // Réinitialiser l'état de la nouvelle tâche
      },
    });
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🧠 Task Manager</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Nouvelle tâche..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <Button onClick={handleAddTask} disabled={isPending}>
          {isPending ? 'Ajout en cours...' : 'Ajouter'}
        </Button>
      </div>
      {isError && <p className="text-red-500">{error instanceof Error ? error.message : 'Erreur inconnue'}</p>}
      <TaskList />
    </main>
  );
}
