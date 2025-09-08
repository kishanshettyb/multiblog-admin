import { addComment } from '@/services/api/comment/comment'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAddComments() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => addComment(payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: () => {
      console.log('error!!!')
    },
    onSuccess: () => {
      console.log('success!!!')

      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (error) {
        console.log('Show Error: ' + error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    }
  })
}
