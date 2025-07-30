import { useQuery } from '@tanstack/react-query';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      return data.data;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await fetch(`/api/tasks/${id}`);
      const data = await res.json();
   
      if (!res.ok) throw new Error('Erreur lors du chargement de la tâche');
      return data.data;
  
    },
    enabled: !!id,
  });
}
