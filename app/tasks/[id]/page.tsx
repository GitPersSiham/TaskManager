'use client';

import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUpdateTask } from '@/app/hooks/useUpdateTask';
import { useTask } from '@/app/hooks/useTasks';
import { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: task, isLoading, isError } = useTask(id);
 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('à faire');

  const { mutate, isPending } = useUpdateTask();
  const hasInitialized = useRef(false);
  
  if (isLoading) {
    return (
      <motion.div
        className="text-center text-muted-foreground text-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
      >
        ⏳ Chargement en cours...
      </motion.div>
    );
  }
  
  if (isError) {
    return (
      <motion.div
        className="text-center text-red-500 text-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        ❌ Une erreur est survenue lors du chargement des tâches.
      </motion.div>
    );
  }

 
  if (!task) {
    return <p>Tâche non trouvée</p>;
  }


  if (task && !hasInitialized.current) {
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
    setPriority(task.priority || 'medium');
    setStatus(task.status || 'à faire');
    hasInitialized.current = true;
  }

  const handleUpdate = () => {
    if (!title.trim()) return;
    mutate(
      {
        id,
        title,
        description,
        dueDate,
        priority,
        status,
        completed: task.completed,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10"
      initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
    >
      <div className="bg-white shadow-xl rounded-xl p-6 space-y-5 border">
        <h1 className="text-2xl font-bold text-center mb-2">Modifier la tâche</h1>
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (facultatif)"
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
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
        </div>
        <Button onClick={handleUpdate} disabled={isPending} className="w-full mt-4">
          {isPending ? 'Enregistrement...' : 'Mettre à jour'}
        </Button>
      </div>
    </motion.div>
  );
}
