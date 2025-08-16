import {
  getAllCategory,
  getAllDomain,
  getAllTags,
  getCategoryById,
  getDomainsById,
  getTagsById
} from '@/services/api/category/category'
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

export function useGetCategoryById(id: string | number) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id!)
  })
}

export function useGetTagsById(id: string | number) {
  return useQuery({
    queryKey: ['tags', id],
    queryFn: () => getTagsById(id!)
  })
}

export function useGetDomainById(id: string | number) {
  return useQuery({
    queryKey: ['domains', id],
    queryFn: () => getDomainsById(id!)
  })
}
