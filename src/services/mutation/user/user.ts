'use client'

import { useMutation } from '@tanstack/react-query'
// import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { adminLogin } from '@/services/api/user/user'
import { useAdminContext } from '@/lib/adminContext'

interface LoginPayload {
  email: string
  password: string
}

export const useAdminLogin = () => {
  const { login } = useAdminContext()

  return useMutation({
    mutationFn: (payload: LoginPayload) => adminLogin(payload),

    onError: (error) => {
      let apiMessage = 'Something went wrong. Please try again.'
      if (error instanceof AxiosError) {
        apiMessage = error.response?.data?.message ?? error.message
      } else if (error instanceof Error) {
        apiMessage = error.message
      }
      //   toast.error('Admin Login failed', { description: apiMessage })
    },

    onSuccess: (data) => {
      const token = data?.data?.token
      const user = data?.data?.user

      if (token && user) {
        login(
          {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname
          },
          token
        )

        // toast.success('Admin Login successful!', {
        //   description: `Welcome back ${user.firstname}!`
        // })

        window.location.replace('/dashboard')
      }
    }
  })
}
