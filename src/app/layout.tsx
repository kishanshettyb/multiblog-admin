import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider } from '@/components/ui/sidebar'
import ReactQueryProvider from '@/lib/provider/ReactQueryProvider'
import { AdminProvider } from '@/lib/adminContext'
import { Navbar } from '@/components/Navbar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Blogspot Admin Dashboard',
  description: 'Manage your blogspot locations and content easily.'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        <SidebarProvider>
          <ReactQueryProvider>
            <AdminProvider>
              {/* ✅ Fixed Navbar */}
              <Navbar />

              {/* ✅ Main content wrapper (with padding to avoid overlap) */}
              <main className="pt-[72px] min-h-screen">{children}</main>
            </AdminProvider>
          </ReactQueryProvider>
        </SidebarProvider>

        <Toaster />
      </body>
    </html>
  )
}
