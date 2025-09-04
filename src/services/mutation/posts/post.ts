
import { createPost, deletePost, updatePost } from '@/services/api/posts/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
















export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => createPost(payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: () => {
      console.log('error!!!')
    },
    onSuccess: () => {
      console.log('success!!!')

      toast('Post has been created')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (error) {
        console.log('Show Error: ' + error)

        toast('Unable to create Post')
      } else {
        await queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    }
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload }) => updatePost(id, payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to update Post')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Post has been updated')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    }
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to delete Post')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Post has been deleted')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    }
  })
}
