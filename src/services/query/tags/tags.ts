
import { getAllTags, getTagsById } from '@/services/api/tags/tags'
import { useQuery } from '@tanstack/react-query'


export function useGetAllTag() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => getAllTags()
  })
}


export function useGetTagsById(id: string) {
  return useQuery({
    queryKey: ['tags', id],
    queryFn: () => getTagsById(id!)
  })
}


