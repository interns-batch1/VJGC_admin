"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import dynamic from "next/dynamic"
import { api } from "@/lib/api"

const NavUser = dynamic(() => import("@/components/nav-user").then((mod) => mod.NavUser), { ssr: false })
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Gauge,
  Database,
  Newspaper,
  Megaphone,
  Layers,
  Building,
  Settings,
} from "lucide-react"

// nav menues
const data = {
  user: {
    name: "Admin",
    email: "admin@vjsgroups.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/crm",
      icon: <Gauge className="size-4" />,
      isActive: true,
    },
    {
      title: "Content Controller",
      url: "/eCommerce/add-product",
      icon: <Database className="size-4" />,
    },
    {
      title: "News Management",
      url: "/admin/news",
      icon: <Newspaper className="size-4" />,
    },
    {
      title: "Notice",
      url: "/admin/notice",
      icon: <Megaphone className="size-4" />,
    },
    { 
      title: "Categories", 
      url: "/admin/categories",
      icon: <Layers className="size-4" />,
    },
    { 
      title: "About Us", 
      url: "/admin/about",
      icon: <Building className="size-4" />,
    },
    {
      title: "Account Settings",
      url: "/account/edit-profile",
      icon: <Settings className="size-4" />,
    },
  ],
  navSecondary: [],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentUser, setCurrentUser] = React.useState(data.user)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/admin/me")
        if (res) {
          setCurrentUser({
            name: res.name || "Admin",
            email: res.email || "admin@vjsgroups.com",
            avatar: res.avatar || "/avatars/shadcn.jpg"
          })
        }
      } catch (e) {
        // Fallback
      }
    }

    fetchUser()

    if (typeof window !== "undefined") {
      window.addEventListener("admin_profile_updated", fetchUser)
      return () => window.removeEventListener("admin_profile_updated", fetchUser)
    }
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="h-16 px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex items-center gap-3">
                  <img src="/images/vjs-logo.png" alt="VJS Logo" className="h-10 w-auto" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-lg">VJS Admin</span>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
