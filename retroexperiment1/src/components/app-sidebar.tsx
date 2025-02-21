"use client"

import type * as React from "react"
import { useRouter } from "next/navigation"
import { SearchForm } from "@/components/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const handleLogout = () => {
    // Here you would typically clear any authentication tokens or user data
    // For this example, we'll just redirect to the login page
    router.push("/")
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={() => (window.location.href = "/dashboard")}>Dashboard</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
          
                    onClick={() => {
                      const event = new CustomEvent("toggleAddNoteForm")
                      window.dispatchEvent(event)
                    }}
                    //  className="bg-gray-100"
                  >
                    Add Note
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                {/* <SidebarMenuButton asChild>
                  <button onClick={handleLogout} className="flex items-center ">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </SidebarMenuButton> */}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

