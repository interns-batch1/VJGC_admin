"use client"

import React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import CMSPageWrapper from "@/components/cms/CMSPageWrapper"
import MainFooter from "@/components/cms/MainFooter"

export default function DynamicCMSPage() {
  const params = useParams()
  const slug = params.slug as string[] // e.g., ["about", "journey"] or ["business", "infrastructure"]

  // Logic to map slug to page/subpage
  // Rule:
  // /about -> page="about", subpage="about-group" (default for about)
  // /about/journey -> page="about", subpage="journey"
  // /business/infrastructure -> page="business", subpage="infrastructure"
  // /newsroom/media-release -> page="newsroom", subpage="media-release"
  
  let page = slug[0]
  let subpage = slug.length > 1 ? slug[1] : null

  // Special defaults for top-level pages that expect a subpage
  if (page === "about" && !subpage) {
    subpage = "about-group"
  }
  if (page === "business" && !subpage) {
    subpage = "infrastructure" // Default business page
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Dynamic Navbar */}
      <header className="px-8 h-24 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:rotate-6 transition-transform">
              V
            </div>
            <div className="flex flex-col">
               <span className="text-xl font-black tracking-tight text-slate-900 leading-none">VJS GLOBAL</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Group of Companies</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          
          <div className="group relative">
            <Link href="/about" className={`hover:text-indigo-600 transition-colors ${page === 'about' ? 'text-indigo-600' : ''}`}>About Us</Link>
            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
               <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-56 flex flex-col gap-2">
                  <Link href="/about" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">About Group</Link>
                  <Link href="/about/journey" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">Our Journey</Link>
                  <Link href="/about/leadership" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">Leadership</Link>
                  <Link href="/about/awards" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">Awards</Link>
               </div>
            </div>
          </div>

          <div className="group relative">
            <Link href="/business/infrastructure" className={`hover:text-indigo-600 transition-colors ${page === 'business' ? 'text-indigo-600' : ''}`}>Businesses</Link>
            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
               <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 w-64 grid grid-cols-1 gap-2">
                  <Link href="/business/infrastructure" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">Infrastructure</Link>
                  <Link href="/business/energy" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">Energy & Utilities</Link>
                  <Link href="/business/transport" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">Transport & Logistics</Link>
                  <Link href="/business/real-estate" className="hover:bg-slate-50 p-2 rounded-lg transition-colors">Real Estate</Link>
               </div>
            </div>
          </div>

          <Link href="/newsroom/media-release" className={`hover:text-indigo-600 transition-colors ${page === 'newsroom' ? 'text-indigo-600' : ''}`}>Newsroom</Link>
          
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6">
             <Link href="/login">Admin Panel</Link>
          </Button>
        </nav>

        {/* Mobile menu icon could go here */}
      </header>

      {/* Dynamic Content Loader */}
      <CMSPageWrapper pageName={page} subpageName={subpage} />

      {/* Premium Footer */}
      <MainFooter />
    </div>
  )
}
