'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAddTask } from '@/app/hooks/useAddTask'; 

import TaskList from '@/components/ui/TasksList';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('à faire');
  const { mutate, isError, error,isPending } = useAddTask();

  const handleAddTask = async () => {
    if (!title.trim()) return;  // Ne rien faire si le champ est vide

    mutate({id: '', title,
      description,
      dueDate,
      priority,
      status,
      completed: false,
    },
      {
      onError: (err) => {
        console.error('Erreur:', err);
      },
      onSuccess: () => {
        setTitle(''); 
        setDescription('');
        setDueDate('');
        setPriority('medium');
        setStatus('à faire'); // Réinitialiser l'état de la nouvelle tâche
      },
    });
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🧠 Task Manager</h1>

      <div className="space-y-4 border rounded-xl p-4 shadow-sm">
        <Input placeholder="Titre de la tâche" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Description (facultatif)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        <div className="flex gap-2">
          <label className="flex-1">
            Priorité :
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
          </label>

          <label className="flex-1">
            Statut :
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1"
            >
              <option value="à faire">À faire</option>
              <option value="en cours">En cours</option>
              <option value="terminée">Terminée</option>
            </select>
          </label>
        </div>

        <Button onClick={handleAddTask} disabled={isPending} className="w-full">
          {isPending ? 'Ajout en cours...' : 'Ajouter la tâche'}
        </Button>

        {isError && <p className="text-red-500">{error instanceof Error ? error.message : 'Erreur inconnue'}</p>}
      </div>

      <TaskList />
    </main>
  );
}
