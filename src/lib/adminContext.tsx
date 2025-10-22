'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

export interface AdminUser {
  id: number
  firstname: string
  lastname: string
}

export interface AdminContextType {
  admin: AdminUser | null
  token: string | null
  loggedIn: boolean
  login: (userData: AdminUser, token: string) => void
  logout: () => void
  updateAdmin: (userData: Partial<AdminUser>) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)

  // Initialize from cookies/localStorage
  useEffect(() => {
    const savedToken = Cookies.get('admin_token')
    const savedAdmin = Cookies.get('admin_user')
    if (savedToken && savedAdmin) {
      setToken(savedToken)
      setAdmin(JSON.parse(savedAdmin))
      setLoggedIn(true)
    }
  }, [])

  const login = (userData: AdminUser, authToken: string) => {
    setAdmin(userData)
    setToken(authToken)
    setLoggedIn(true)

    Cookies.set('admin_token', authToken, { expires: 7, secure: true, sameSite: 'strict' })
    Cookies.set('admin_user', JSON.stringify(userData))
    localStorage.setItem('admin_session', 'true')
  }

  const updateAdmin = (userData: Partial<AdminUser>) => {
    setAdmin((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...userData }
      Cookies.set('admin_user', JSON.stringify(updated))
      return updated
    })
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    setLoggedIn(false)
    Cookies.remove('admin_token')
    Cookies.remove('admin_user')
    localStorage.removeItem('admin_session')
    window.location.replace('/')
  }

  const value: AdminContextType = {
    admin,
    token,
    loggedIn,
    login,
    logout,
    updateAdmin
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext)
  if (!context) throw new Error('useAdminContext must be used within AdminProvider')
  return context
}
