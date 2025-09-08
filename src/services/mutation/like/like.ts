import { addLike } from '@/services/api/like/like'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAddLikes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => addLike(payload),
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
