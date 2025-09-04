
import { createDomains, deleteDomains, updateDomains } from '@/services/api/domain/domain'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'




export function useCreateDomains() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => createDomains(payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: () => {
      console.log('error!!!')
    },
    onSuccess: () => {
      console.log('success!!!')

      toast('Domains has been created')
      queryClient.invalidateQueries({ queryKey: ['domains'] })
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (error) {
        console.log('Show Error: ' + error)

        toast('Unable to create Domains')
      } else {
        await queryClient.invalidateQueries({ queryKey: ['domains'] })
      }
    }
  })
}





export function useUpdateDomains() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload }) => updateDomains(id, payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to update Domains')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Domains has been updated')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['domains'] })
      }
    }
  })
}


export function useDeleteDomain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDomains(id),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to delete domain')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Domain has been deleted')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['domains'] })
      }
    }
  })
}








