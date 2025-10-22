'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminContext } from '@/lib/adminContext'

export const AdminSessionRedirect = () => {
  const { loggedIn } = useAdminContext()
  const router = useRouter()

  useEffect(() => {
    if (loggedIn) {
      router.replace('/dashboard')
    }
  }, [loggedIn, router])

  return null
}
