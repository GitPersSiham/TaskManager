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
  _id: string;
  title: string;
  completed: boolean;
};
const TaskList = () => {
  const { data: tasks = [] } = useTasks();  // Utilisation du hook useTasks
  const [open, setOpen] = useState(false);  // Etat pour contrôler l'ouverture du Dialog
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);  // Etat pour garder la tâche sélectionnée
  const { mutate: deleteTask , isPending , error} = useDeleteTask();
  const { mutate: updateTask } = useUpdateTask();
 
  const toggleComplete = (id: string, title:string,completed: boolean) => {
    updateTask({ id, title , completed: !completed });
  };
  
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Liste des tâches</h1>
      <ul className="space-y-2">
      {tasks.map((task: Task) => (
          <Card key={task._id}>
            <CardContent className="flex items-center justify-between py-4 px-2">
              <span
                className={`cursor-pointer text-lg flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                onClick={() => toggleComplete(task._id, task.title,task.completed)}
              >
                {task.title}
              </span>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button className='mr-2' variant="destructive"
                   onClick={() => {
                    setSelectedTaskId(task._id); 
                    setOpen(true);
                  }}
                  >
                 {isPending ? 'Supression  en cours...' : 'Suprimmer'}
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
                 disabled={isPending}>
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button asChild >
                <Link href={`/tasks/${task._id}`}>Modifier</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
