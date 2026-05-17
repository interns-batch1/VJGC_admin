"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/global-search"

import Footer from "@/components/layout/Footer"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

const PATH_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  crm: "CRM",
  eCommerce: "Content Management",
  "product-list": "Content List",
  "add-product": "Add Content",
  categories: "Categories",
  admin: "Admin",
  about: "About Us",
  blogs: "Blogs",
  news: "News",
  services: "Services",
  account: "Account",
  "edit-profile": "Edit Profile",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Generate dynamic breadcrumbs
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = segments.map((segment, index) => {
    const title = PATH_MAP[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    const url = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1

    return { title, url, isLast }
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className={cn(
            "px-6 sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 transition-all duration-200 border-b",
            scrolled
              ? "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
              : "bg-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            <SidebarTrigger
              size="icon"
              className="-ml-1 rounded-full h-9 w-9 [&_svg]:!size-5 hover:bg-muted/60 transition-colors"
            />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-16"
            />

            <Breadcrumb>
              <BreadcrumbList>
                {/* Always show Dashboard as root if not on dashboard */}
                {segments[0] !== "dashboard" && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard/crm">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.url}>
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.url}>{crumb.title}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!crumb.isLast && <BreadcrumbSeparator className="hidden md:block" />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto">
            <div className="flex items-center gap-1">
              <GlobalSearch />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {children}
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}