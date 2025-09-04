
import { getAllCategory, getCategoryById } from '@/services/api/category/category'
import { useQuery } from '@tanstack/react-query'

export function useGetAllCategory() {
  return useQuery({
    queryKey: ['category'],
    queryFn: () => getAllCategory()
  })
}


export function useGetCategoryById(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id!),
    enabled: !!id
  })
}

