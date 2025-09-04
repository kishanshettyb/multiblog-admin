
import { getAllPosts, getPostById } from '@/services/api/posts/posts'
import { useQuery } from '@tanstack/react-query'


export function useGetAllPosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => getAllPosts()
  })
}






export function useGetPostById(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPostById(id!),
    enabled: !!id
  })
}




