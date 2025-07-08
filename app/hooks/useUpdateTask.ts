import { useMutation, useQueryClient } from '@tanstack/react-query';

export type UpdateTaskPayload = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  completed: boolean;
};

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: UpdateTaskPayload) => {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          status: task.status,
          completed: task.completed,
        }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      const data = await res.json();
      return data.data;
    },
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
