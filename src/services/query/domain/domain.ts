
import { getAllDomain, getDomainsById } from '@/services/api/domain/domain'
import { useQuery } from '@tanstack/react-query'



export function useGetAllDomain() {
  return useQuery({
    queryKey: ['domain'],
    queryFn: () => getAllDomain()
  })
}



export function useGetDomainById(id: string) {
  return useQuery({
    queryKey: ['domains', id],
    queryFn: () => getDomainsById(id!)
  })
}
