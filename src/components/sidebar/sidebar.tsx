'use client'

import { Calendar, Home, Inbox, Search, Settings, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useAdminContext } from '@/lib/adminContext'
import { useRouter } from 'next/navigation'

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Category', url: '/dashboard/category', icon: Inbox },
  { title: 'Domain', url: '/dashboard/domain', icon: Calendar },
  { title: 'Tag', url: '/dashboard/tag', icon: Search },
  { title: 'Post', url: '/dashboard/post', icon: Search },
  { title: 'Settings', url: '#', icon: Settings }
]

export function AppSidebar() {
  const { loggedIn, logout } = useAdminContext()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout button */}
              {loggedIn && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} asChild>
                    <button className="flex items-center gap-2 w-full">
                      <LogOut />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
