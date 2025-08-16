import {
  createCategorys,
  createDomains,
  createTags,
  deleteCategory,
  deleteDomains,
  deleteTags,
  updateCategory,
  updateDomains,
  updateTags
} from '@/services/api/category/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => createCategorys(payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: () => {
      console.log('error!!!')
    },
    onSuccess: () => {
      console.log('success!!!')

      toast('Categories has been created')
      queryClient.invalidateQueries({ queryKey: ['category'] })
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (error) {
        console.log('Show Error: ' + error)

        toast('Unable to create Categories')
      } else {
        await queryClient.invalidateQueries({ queryKey: ['category'] })
      }
    }
  })
}

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

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload }) => updateCategory(id, payload),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to update category')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Category has been updated')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['categories'] })
      }
    }
  })
}

export function useUpdateTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload }) => updateTags(id, payload),
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

export function useUpdateDomains() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload }) => updateDomains(id, payload),
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

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) => deleteCategory(id),
    onMutate: () => {
      console.log('mutate!!!')
    },
    onError: (error) => {
      console.log('error!!!', error)
      toast('Unable to delete categories')
    },
    onSuccess: () => {
      console.log('success!!!')
      toast('Categories has been deleted')
    },
    onSettled: async (_, error) => {
      console.log('settled**')
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['category'] })
      }
    }
  })
}
export function useDeleteDomain() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) => deleteDomains(id),
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

export function useDeleteTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) => deleteTags(id),
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
