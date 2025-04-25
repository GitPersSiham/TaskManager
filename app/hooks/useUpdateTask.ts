import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: { id: string; title: string; completed: boolean }) => {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, completed: task.completed }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      const data = await res.json();
      return data.data;
    },
    onSuccess: () => {
      // Rafraîchir les tâches après mise à jour
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
