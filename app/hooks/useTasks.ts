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
