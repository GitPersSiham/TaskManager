import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: string) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask, completed: false }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      return data.data;
    },
    onSuccess: () => {
      // Rafraîchir les tâches après ajout
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
