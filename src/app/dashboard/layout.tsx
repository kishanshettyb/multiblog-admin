'use client'

import { AppSidebar } from '@/components/sidebar/sidebar'

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex relative flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* <DashboardHeader /> */}
        <main>
          <div className="container mt-20 lg:mt-auto pt-0 lg:pt-[100px] px-4 xl:px-8 pb-4 mx-auto">
            {children}
          </div>
        </main>
        {/* <DashboardFooter /> */}
      </div>
    </div>
  )
}
