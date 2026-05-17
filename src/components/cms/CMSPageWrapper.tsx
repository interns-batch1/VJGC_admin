"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import Hero from "@/components/cms/Hero"
import Cards from "@/components/cms/Cards"
import TextBlock from "@/components/cms/TextBlock"
import News from "@/components/cms/News"

const componentMap: any = {
  hero: Hero,
  cards: Cards,
  text: TextBlock,
  news: News,
}

export default function CMSPageWrapper({ pageName, subpageName }: { pageName: string, subpageName?: string | null }) {
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCMSContent = async () => {
    try {
      // Build query string with optional subpage
      let query = `?status=published&page=${pageName}`
      if (subpageName) {
        query += `&subpage=${subpageName}`
      }

      // Fetch all published sections for this page/subpage
      const data = await api.get(`/content${query}`)
      
      // Sort sections if they have an order property, or just use as is
      setSections(data || [])
      setError(null)
    } catch (err: any) {
      console.error(`Failed to load content for ${pageName}/${subpageName}:`, err)
      setError(err.message || "Failed to connect to VJS Cloud")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCMSContent()
    
    // Auto-refresh: Sync with backend every 5 seconds to reflect admin changes instantly
    const interval = setInterval(fetchCMSContent, 5000)
    return () => clearInterval(interval)
  }, [pageName, subpageName])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1">
        {loading ? (
          <div className="h-[70vh] flex flex-col items-center justify-center gap-6 text-slate-400">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="font-medium animate-pulse text-lg tracking-widest uppercase">
              Synchronizing with VJS Cloud...
            </p>
          </div>
        ) : error ? (
          <div className="h-[70vh] flex flex-col items-center justify-center gap-6 p-6 text-center animate-in fade-in zoom-in duration-500">
             <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertCircle className="h-10 w-10" />
             </div>
             <h1 className="text-3xl font-bold text-slate-900">Network Connection Issue</h1>
             <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                We couldn't reach the CMS servers. Please ensure your backend is running at <code className="bg-slate-100 px-2 py-1 rounded text-red-600">http://127.0.0.1:5000</code>
             </p>
             <Button onClick={fetchCMSContent} size="lg" className="mt-4 bg-indigo-600 hover:bg-indigo-700">
                Retry Connection
             </Button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000">
            {sections.length > 0 ? (
              sections.map((section: any) => {
                const Component = componentMap[section.type]
                if (!Component) {
                  console.warn(`Unknown component type: ${section.type}`)
                  return null
                }
                return <Component key={section.id || section._id} data={section.content} />
              })
            ) : (
              <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400 text-center p-6 animate-in fade-in duration-700">
                <div className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                   <Loader2 className="h-8 w-8 text-slate-200" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No Content Published</h2>
                <p className="max-w-xs mx-auto mb-8">
                   This page ({pageName}{subpageName ? ` / ${subpageName}` : ""}) has no sections published yet.
                </p>
                <Button asChild variant="outline" className="rounded-full px-8">
                   <Link href="/login">Open Admin Dashboard</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
