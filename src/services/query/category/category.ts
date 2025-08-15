import { getAllCategory, getAllDomain, getAllTags } from '@/services/api/category/category'
import { useQuery } from '@tanstack/react-query'

export function useGetAllCategory() {
  return useQuery({
    queryKey: ['category'],
    queryFn: () => getAllCategory()
  })
}

export function useGetAllTag() {
  return useQuery({
    queryKey: ['tag'],
    queryFn: () => getAllTags()
  })
}

export function useGetAllDomain() {
  return useQuery({
    queryKey: ['domain'],
    queryFn: () => getAllDomain()
  })
}
