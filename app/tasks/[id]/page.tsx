'use client';

import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUpdateTask } from '@/app/hooks/useUpdateTask';
import { useTasks } from '@/app/hooks/useTasks';
import { useRef, useState } from 'react';

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  // Récupérer toutes les tâches
  const { data: tasks, isLoading, isError } = useTasks();
  // État local pour le titre de la tâche
  const [title, setTitle] = useState('');
  // Hook pour la mise à jour de la tâche
  const { mutate, isPending } = useUpdateTask();
  const hasInitialized = useRef(false);
  // Si les données sont en chargement, afficher un message
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

  // Récupérer la tâche spécifique en fonction de l'ID
  const task = tasks?.find((t: { _id: string; }) => t._id === id);

  // Si la tâche n'est pas trouvée, on peut rediriger ou afficher un message
  if (!task) {
    return <p>Tâche non trouvée</p>;
  }

  // Initialiser le titre dans l'état local si la tâche est trouvée
if (task && !hasInitialized.current) {
      setTitle(task.title);
      hasInitialized.current = true;
    }
  // Fonction de mise à jour de la tâche
  const handleUpdate = () => {
    if (!title.trim()) return;

    mutate(
      { id, title, completed: task.completed },
      {
        onSuccess: () => {
           router.push('/');  // Redirige après la mise à jour
        },
      }
    );
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-10 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <h1 className="text-xl font-bold">Modifier la tâche</h1>

      <Input
        value={title}  // Lien avec l'état local `title`
        onChange={(e) => setTitle(e.target.value)}  // Met à jour l'état `title`
        placeholder="Titre de la tâche"
      />

      <Button onClick={handleUpdate} disabled={isPending}>
        {isPending ? 'Enregistrement...' : 'Mettre à jour'}
      </Button>
    </motion.div>
  );
}
