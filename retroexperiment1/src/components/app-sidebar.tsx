"use client"

import type * as React from "react"
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-gray-300">
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="bg-gray-300">
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={() => (window.location.href = "/dashboard" )} >
                    Dashboard</button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                {/* <SidebarMenuButton asChild>
                  <button
                    onClick={() => (window.location.href = "/addnote" )}
                  >
                    Add Note
                  </button>
                </SidebarMenuButton> */}
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

