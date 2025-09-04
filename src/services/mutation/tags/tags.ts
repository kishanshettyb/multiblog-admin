
import { createTags, deleteTags, updateTags } from '@/services/api/tags/tags'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'



export function useCreateTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => createTags(payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: () => {
      console.log('error!!!')
    },
    onSuccess: () => {
      console.log('success!!!')

      toast('Tags has been created')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (error) {
        console.log('Show Error: ' + error)

        toast('Unable to create Tags')
      } else {
        await queryClient.invalidateQueries({ queryKey: ['tags'] })
      }
    }
  })
}





export function useUpdateTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload }) => updateTags(id, payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to update Tags')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Tags has been updated')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['tags'] })
      }
    }
  })
}





export function useDeleteTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTags(id),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to delete tags')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Tags has been deleted')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['tags'] })
      }
    }
  })
}


