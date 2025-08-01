import { Task } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';



export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: Task) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
