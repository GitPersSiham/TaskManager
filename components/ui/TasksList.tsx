// components/ui/TaskList.tsx

import { useTasks } from '@/app/hooks/useTasks';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from './card';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useDeleteTask } from '@/app/hooks/useDeleteTask';
import { useUpdateTask } from '@/app/hooks/useUpdateTask';


type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  completed: boolean;
};
const TaskList = () => {
  const { data: tasks = [] } = useTasks();  // Utilisation du hook useTasks
  const [open, setOpen] = useState(false);  // Etat pour contrôler l'ouverture du Dialog
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);  // Etat pour garder la tâche sélectionnée
  const { mutate: deleteTask , isPending , error} = useDeleteTask();
  const { mutate: updateTask } = useUpdateTask();
 
  const toggleComplete = (task: Task) => {
    updateTask({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      completed: !task.completed,
    });
  };
  
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Liste des tâches</h1>
      <ul className="space-y-6">
      {tasks.map((task: Task) => {
        let borderColor = 'border-yellow-400';
        if (task.completed) borderColor = 'border-green-400';
        else if (task.status === 'en cours') borderColor = 'border-blue-400';
        return (
          <Card key={task.id} className={`bg-white shadow-xl border-l-8 ${borderColor} p-0 transition-transform hover:scale-[1.02]`}>
            <CardContent className="flex flex-col gap-4 py-6 px-6">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-2xl font-extrabold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                  onClick={() => toggleComplete(task)}
                  style={{ cursor: 'pointer' }}
                  title="Marquer comme terminé"
                >
                  {task.title}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm
                  ${task.completed ? 'bg-green-100 text-green-700 border border-green-300' :
                    task.status === 'en cours' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                    'bg-yellow-100 text-yellow-700 border border-yellow-300'}
                `}>{task.status}</span>
              </div>
              <div className="text-base text-gray-700 whitespace-pre-line min-h-[32px]">
                {task.description || <span className="italic text-gray-400">Pas de description</span>}
              </div>
              <div className="flex flex-wrap gap-8 text-sm text-gray-500 mt-1">
                <div><span className="font-semibold">Échéance :</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
                <div><span className="font-semibold">Priorité :</span> <span className={`font-bold ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{task.priority}</span></div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Button asChild size="sm" className="rounded-full px-5 py-2 font-semibold transition-colors hover:bg-blue-600 hover:text-white">
                  <Link href={`/tasks/${task.id}`}>Modifier</Link>
                </Button>
                <AlertDialog open={open && selectedTaskId === task.id} onOpenChange={setOpen}>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="rounded-full px-5 py-2 font-semibold transition-colors hover:bg-red-600 hover:text-white"
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setOpen(true);
                      }}
                    >
                      {isPending && selectedTaskId === task.id ? 'Suppression...' : 'Supprimer'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer cette tâche ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Tu vas perdre cette tâche.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setOpen(false)}>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        if (!selectedTaskId) return;
                        deleteTask(selectedTaskId);
                        setOpen(false);
                      }}
                      disabled={isPending && selectedTaskId === task.id}>
                        Confirmer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button size="sm" variant={task.completed ? 'secondary' : 'outline'}
                  className="rounded-full px-5 py-2 font-semibold transition-colors hover:bg-green-600 hover:text-white"
                  onClick={() => toggleComplete(task)}
                >
                  {task.completed ? 'Non terminé' : 'Terminer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      </ul>
    </div>
  );
};

export default TaskList;
