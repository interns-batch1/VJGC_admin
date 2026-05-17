"use client"
import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  MoreVertical,
  Plus,
  FileText,
  RotateCcw,
  Edit,
  History,
  Trash2,
  Search,
  Loader2,
  Layout,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const statusVariant = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/30"
    case "draft":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/30"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function ProductList() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [contentList, setContentList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const res = await api.get("/admin/cms/content")
      setContentList(res || [])
    } catch (err) {
      toast.error("Failed to load content list")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const handleUndo = async (id: string) => {
    try {
      await api.post(`/admin/cms/content/${id}/undo`, {})
      toast.success("Changes reverted to previous version")
      fetchContent()
    } catch (err: any) {
      toast.error(err.message || "Undo failed")
    }
  }

  // ☑️ Checkbox logic
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? paginatedContent.map(p => p._id) : [])
  }
  
  const toggleOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // 🔍 Search filter
  const filteredContent = useMemo(() => {
    return contentList.filter((item) =>
      `${item.page} ${item.subpage || ""} ${item.section} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, contentList])

  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(filteredContent.length / PAGE_SIZE))

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const paginatedContent = filteredContent.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6">

      {/* KPI CARDS (Static for now based on actual data) */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sections"
          value={contentList.length.toString()}
          icon={<Layers className="text-primary" />}
        />
        <StatCard
          title="Published"
          value={contentList.filter(c => c.status === "published").length.toString()}
          icon={<CheckCircle2 className="text-green-500" />}
        />
        <StatCard
          title="Drafts"
          value={contentList.filter(c => c.status === "draft").length.toString()}
          icon={<AlertCircle className="text-yellow-500" />}
        />
        <StatCard
          title="Pages Managed"
          value={new Set(contentList.map(c => c.page)).size.toString()}
          icon={<Layout className="text-blue-500" />}
        />
      </div>

      {/* CONTENT LIST */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b py-4 flex-wrap gap-3">
          <div>
          <CardTitle className="text-lg mb-0 text-primary">Website Content Explorer</CardTitle>
          <CardDescription>
            Manage and track changes across all website sections
          </CardDescription>
          </div>
          {/* Search */}
          <div className="relative mb-0 max-w-lg w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sections..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1) 
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {/* Action Bar */}
          <div className="flex flex-wrap gap-3 justify-between items-center pb-2">
            <div className="flex gap-3 items-center">
               <h3 className="text-sm font-medium">All Website Modules</h3>
            </div>

            <Link href="/eCommerce/add-product">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="mr-1 h-4 w-4" />
                Create New Section
              </Button>
            </Link>
          </div>

          {/* TABLE */}
          <div className="relative w-full overflow-x-auto rounded-md border">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Fetching latest website content...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={paginatedContent.length > 0 && selected.length === paginatedContent.length}
                        onCheckedChange={(val) => toggleAll(!!val)}
                      />
                    </TableHead>
                    <TableHead>Page / Subpage</TableHead>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedContent.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No content found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedContent.map((item) => (
                      <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <Checkbox
                            checked={selected.includes(item._id)}
                            onCheckedChange={() => toggleOne(item._id)}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground capitalize">{item.page}</span>
                            {item.subpage && (
                              <span className="text-xs text-muted-foreground bg-muted w-fit px-1.5 py-0.5 rounded mt-1 border">
                                {item.subpage}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-primary/60" />
                            <span className="font-medium">{item.section}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="secondary" className="capitalize font-normal">
                             {item.type}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge className={statusVariant(item.status)} variant="outline">
                            {item.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-muted-foreground text-xs">
                          {item.updated_at ? new Date(item.updated_at).toLocaleString() : "Initial"}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                             <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:text-primary"
                              title="Edit Content"
                              onClick={() => {
                                router.push(`/eCommerce/add-product?page=${item.page}&section=${item.section}${item.subpage ? `&subpage=${item.subpage}` : ""}`)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:text-orange-500"
                              title="Undo last change"
                              disabled={!item.versions || item.versions.length === 0}
                              onClick={() => handleUndo(item._id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/eCommerce/add-product?page=${item.page}&section=${item.section}${item.subpage ? `&subpage=${item.subpage}` : ""}`)}>
                                  <History className="mr-2 h-4 w-4" /> View History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && contentList.length > 0 && (
            <div className="flex items-center justify-between px-2 py-2">
              <div className="text-sm text-muted-foreground">
                Showing { (page - 1) * PAGE_SIZE + 1 } - { Math.min(page * PAGE_SIZE, filteredContent.length) } of { filteredContent.length }
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                   {[...Array(totalPages)].map((_, i) => (
                     <Button
                        key={i}
                        variant={page === i + 1 ? "default" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage(i + 1)}
                     >
                       {i + 1}
                     </Button>
                   ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card className="hover:shadow-md transition-shadow border-primary/10">
      <CardContent className="flex justify-between items-center p-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className="rounded-2xl bg-primary/10 p-4 border border-primary/10 shadow-inner">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
