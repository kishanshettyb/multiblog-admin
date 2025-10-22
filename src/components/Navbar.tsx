'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { AdminLoginForm } from '@/components/login-form'
import { useAdminContext } from '@/lib/adminContext'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function Navbar() {
  const { loggedIn, logout } = useAdminContext()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/') // redirect to home after logout
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* ✅ Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-semibold text-lg tracking-tight text-slate-800">
            Blogspot Admin
          </span>
        </Link>

        {/* ✅ Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-slate-700 font-medium">
          {/* <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link> */}
          {/* <Link href="/blogs" className="hover:text-blue-600 transition">
            Blogs
          </Link>
          <Link href="/categories" className="hover:text-blue-600 transition">
            Categories
          </Link>
          <Link href="/tags" className="hover:text-blue-600 transition">
            Tags
          </Link> */}
        </nav>

        {/* ✅ Auth Buttons */}
        {loggedIn ? (
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="ml-4 rounded-full flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-4 rounded-full">Login</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] rounded-2xl">
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl font-semibold text-slate-800">
                  Admin Login
                </DialogTitle>
                <DialogDescription>
                  Sign in to manage your blogspot locations and content.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <AdminLoginForm />
              </div>
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  )
}
