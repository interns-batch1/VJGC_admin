"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  Send,
  Upload,
  X,
  Edit2,
  Layers,
  AlertCircle,
  CheckCircle2,
  Database,
  ArrowRight
} from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useRouter, useSearchParams } from "next/navigation"

const FIELD_CONFIG: any = {
  hero: [
    { id: "title", label: "Hero Title", type: "text" },
    { id: "description", label: "Subtitle", type: "text" },
    { id: "cta_text", label: "Button Text", type: "text" },
    { id: "video_url", label: "Video Background (URL)", type: "text" },
    { id: "image_url", label: "Image Background", type: "image" },
  ],
  cards: [
    { id: "title", label: "Card Title", type: "text" },
    { id: "description", label: "Description", type: "textarea" },
    { id: "video_url", label: "Video Background (URL)", type: "text" },
    { id: "image_url", label: "Card Image", type: "image" },
  ],
  news: [
    { id: "title", label: "News Title", type: "text" },
    { id: "author", label: "Author", type: "text" },
    { id: "date", label: "Date", type: "text" },
    { id: "description", label: "Description", type: "textarea" },
    { id: "video_url", label: "Video Background (URL)", type: "text" },
    { id: "image_url", label: "Feature Image", type: "image" },
  ],
  text: [
    { id: "heading", label: "Heading", type: "text" },
    { id: "description", label: "Subheading", type: "text" },
    { id: "content", label: "Content", type: "textarea" },
    { id: "author", label: "Author/Source", type: "text" },
    { id: "role", label: "Role/Tag", type: "text" },
    { id: "video_url", label: "Video Background (URL)", type: "text" },
  ]
}

const resolveImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5006/api';
  const BACKEND_BASE = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : 'http://127.0.0.1:5006';
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${BACKEND_BASE}${cleanUrl}`;
}

export default function AddProduct() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>}>
      <AddProductContent />
    </Suspense>
  )
}

function AddProductContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedPage, setSelectedPage] = useState(searchParams.get("page") || "")
  const [selectedSubpage, setSelectedSubpage] = useState(searchParams.get("subpage") || "")
  const [sections, setSections] = useState<any[]>([])
  const [selectedSectionName, setSelectedSectionName] = useState(searchParams.get("section") || "")
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedAction, setSelectedAction] = useState<string>("")

  const [formData, setFormData] = useState<any>({})
  const [cardFormData, setCardFormData] = useState<any>({})
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [published, setPublished] = useState(false)
  const [contentId, setContentId] = useState<string | null>(null)

  // Fetch sections when page or subpage changes
  useEffect(() => {
    if (selectedPage) {
      const url = `/admin/cms/sections?page=${encodeURIComponent(selectedPage)}${selectedSubpage ? `&subpage=${encodeURIComponent(selectedSubpage)}` : ""}`
      api.get(url).then(setSections).catch(() => toast.error("Failed to load sections"))
    } else {
      setSections([])
    }
  }, [selectedPage, selectedSubpage])

  // Fetch content when section changes
  const fetchCurrentContent = async () => {
    if (selectedPage && selectedSectionName) {
      const section = sections.find(s => s.name === selectedSectionName)
      if (!section) return

      setSelectedSection(section)
      setIsLoading(true)

      const url = `/admin/cms/content?mainPage=${encodeURIComponent(selectedPage)}&category=${encodeURIComponent(selectedSectionName)}${selectedSubpage ? `&subSection=${encodeURIComponent(selectedSubpage)}` : ""}`

      try {
        const res = await api.get(url)
        if (res) {
          setContentId(res._id || res.id)
          // Always treat as array for unified Create/Update/Delete flow
          let content = res.content || []
          
          if (!Array.isArray(content) && content && typeof content === 'object') {
            if (content.items) {
              content = content.items
            } else {
              content = [content] // Wrap single object in array
            }
          }

          setFormData(content)
          setPublished(res.status === "published")
          
          // Auto-select "update" if data exists and no action is chosen
          if (!selectedAction && content.length > 0) {
            setSelectedAction("update")
          }
        } else {
          setContentId(null)
          setFormData([])
          setPublished(false)
        }
      } catch (err) {
        toast.error("Failed to load content")
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchCurrentContent()
  }, [selectedPage, selectedSectionName, sections, selectedSubpage])

  const handleFieldChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleSaveAll = async (status: "draft" | "published") => {
    if (!selectedPage || !selectedSectionName) {
      toast.error("Selection required")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        mainPage: selectedPage === 'business' ? 'Business Verticals' : selectedPage,
        subSection: selectedSubpage,
        category: selectedSectionName,
        title: formData.title || "Section Content",
        description: formData.description || formData.subtitle || formData.content || "",
        image: formData.image_url || formData.image || ""
      }

      await api.post("/admin/cms/content", payload)
      toast.success("Content Saved Successfully")
      fetchCurrentContent()
    } catch (error: any) {
      toast.error("Action failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCardAction = async (action: "create_card" | "update_card" | "delete_card", cardId?: string, data?: any) => {
    setIsSaving(true)
    try {
      // --- DELETE ---
      if (action === "delete_card") {
        if (!cardId) throw new Error("No card ID provided for delete")
        await api.delete(`/admin/cms/content/${cardId}`)
        toast.success("Card deleted successfully")
        fetchCurrentContent()
        return
      }

      // Determine final image based on configuration: if image_url or video_url is explicitly in the config, use it (even if empty string)
      let finalImage = "";
      if (data && (data.video_url !== undefined || data.image_url !== undefined)) {
        finalImage = data.video_url || data.image_url || "";
      } else {
        finalImage = data?.image || "";
      }

      // --- CREATE or UPDATE ---
      const payload: any = {
        ...data,
        mainPage:   selectedPage,
        subSection: selectedSubpage,
        category:   selectedSectionName,
        image:       finalImage
      }

      if (action === "update_card" && cardId) {
        await api.put(`/admin/cms/content/${cardId}`, payload)
        toast.success("Card updated successfully")
      } else {
        await api.post("/admin/cms/content", payload)
        toast.success("Card created successfully")
        setSelectedAction("update") // switch to update view so the new card is visible
      }

      setEditingCardId(null)
      setCardFormData({})
      fetchCurrentContent()
    } catch (error: any) {
      console.error("Card action error:", error)
      toast.error(error?.message || "Card action failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* GLOBAL ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm sticky top-0 z-[100] backdrop-blur-md bg-white/80">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Database className="text-indigo-600 h-8 w-8" />
            Content Controller
          </h2>
          <p className="text-slate-500 font-medium">Manage hierarchical business content and card sections.</p>
        </div>

        {selectedSection && !["cards", "news"].includes(selectedSection.type) && (
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200" onClick={handleSaveAll.bind(null, "draft")} disabled={isSaving}>
              Save Draft
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200" onClick={handleSaveAll.bind(null, "published")} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
              Publish to Website
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT NAV - SELECTION */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-700">Target Location</CardTitle>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* PAGE */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Main Page</Label>
                <Select value={selectedPage} onValueChange={(v) => { setSelectedPage(v); setSelectedSubpage(""); setSelectedSectionName(""); setSelectedAction("") }}>
                  <SelectTrigger className="h-12 border-slate-200">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="About Us">About Us</SelectItem>
                    <SelectItem value="Business Verticals">Business Verticals</SelectItem>
                    <SelectItem value="Newsroom">Newsroom</SelectItem>
                    <SelectItem value="Blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SUBPAGE */}
              {selectedPage && ["About Us", "Business Verticals", "Newsroom"].includes(selectedPage) && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Sub-Section</Label>
                  <Select value={selectedSubpage} onValueChange={(v) => { setSelectedSubpage(v); setSelectedSectionName(""); setSelectedAction("") }}>
                    <SelectTrigger className="h-12 border-slate-200">
                      <SelectValue placeholder="Select sub-section" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPage === "About Us" && (
                        <>
                          <SelectItem value="About Group">About Group</SelectItem>
                          <SelectItem value="Our Journey">Our Journey</SelectItem>
                          <SelectItem value="Leadership">Leadership</SelectItem>
                          <SelectItem value="Awards">Awards</SelectItem>
                          <SelectItem value="Foundation">Foundation</SelectItem>
                        </>
                      )}
                      {selectedPage === "Business Verticals" && (
                        <>
                          <SelectItem value="IT Consulting">IT Consulting</SelectItem>
                          <SelectItem value="Enterprise Data Centers & Hosting Services">Enterprise Data Centers & Hosting Services</SelectItem>
                          <SelectItem value="Export & Import">Export & Import</SelectItem>
                          <SelectItem value="Plantations & Exotic Trees">Plantations & Exotic Trees</SelectItem>
                          <SelectItem value="IT Training">IT Training</SelectItem>
                          <SelectItem value="Yoga & Wellness">Yoga & Wellness</SelectItem>
                          <SelectItem value="Property Services">Property Services</SelectItem>
                          <SelectItem value="Green Energy & Solar Manufacturing">Green Energy & Solar Manufacturing</SelectItem>
                          <SelectItem value="Logistics Services">Logistics Services</SelectItem>
                          <SelectItem value="Travel & Rentals">Travel & Rentals</SelectItem>
                        </>
                      )}
                      {selectedPage === "Newsroom" && <SelectItem value="Media Release">Media Release</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* SECTION / CATEGORY */}
              {selectedPage && (["home", "blog"].includes(selectedPage) || selectedSubpage) && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Category</Label>
                  <Select value={selectedSectionName} onValueChange={(v) => { setSelectedSectionName(v); setSelectedAction("") }}>
                    <SelectTrigger className="h-12 border-slate-200">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(sections) && sections.map(s => (
                        <SelectItem key={s.name} value={s.name}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* ACTION SELECTION */}
              {selectedSection && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Management Mode</Label>
                  <Select value={selectedAction} onValueChange={(v) => { setSelectedAction(v); setEditingCardId(null); setCardFormData({}) }}>
                    <SelectTrigger className="h-12 border-indigo-200 bg-indigo-50/30 text-indigo-700 font-bold shadow-sm">
                      <SelectValue placeholder="What do you want to do?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">View & Update Items</SelectItem>
                      <SelectItem value="create">Add New Entry</SelectItem>
                      <SelectItem value="delete">Remove Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedSection && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${published ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {published ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {published ? 'Live on Site' : 'Draft Mode'}
              </div>
              <div className="h-2 w-2 rounded-full animate-pulse bg-current"></div>
            </div>
          )}
        </div>

        {/* RIGHT AREA - DYNAMIC WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-32 bg-white rounded-3xl border border-dashed">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
            </div>
          ) : !selectedSection ? (
            <div className="flex flex-col items-center justify-center p-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
                <ArrowRight className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Configure Location</h3>
              <p className="text-slate-500 text-center mt-3 max-w-sm font-medium">Select a page, sub-section, and category from the left to unlock management tools.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-8">
                  {/* UPDATE / DELETE LIST */}
                  {(selectedAction === "update" || selectedAction === "delete") && (
                    <Card className="border-slate-100 shadow-xl rounded-3xl overflow-hidden">
                      <div className="px-8 py-6 border-b bg-slate-50/50 flex items-center justify-between">
                        <CardTitle className="text-xl font-black text-slate-900">
                          {selectedAction === 'update' ? 'Stored Records' : 'Removal Zone'}
                        </CardTitle>
                        <Badge className={selectedAction === 'update' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'}>
                          {Array.isArray(formData) ? formData.length : 0} Items
                        </Badge>
                      </div>
                      <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                          {(!formData || !Array.isArray(formData) || formData.length === 0) ? (
                            <div className="p-20 text-center">
                              <p className="text-slate-400 font-bold">No entries found for this section.</p>
                            </div>
                          ) : (
                            formData.map((item: any, idx: number) => (
                              <div key={item._id || item.id || idx} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-6">
                                  {((item.image_url && item.image_url.trim() !== "") || (item.image && item.image.trim() !== "")) && (
                                    <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
                                      <img src={resolveImageUrl(item.image_url || item.image)} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')} />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-black text-slate-900 text-lg leading-tight">{item.title || item.heading || 'Untitled Entry'}</h4>
                                    <p className="text-slate-500 text-sm mt-1 max-w-lg line-clamp-1">{item.description || item.subtitle || item.content || 'No preview text.'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    className="h-10 rounded-xl border-slate-200 hover:bg-slate-50 px-6 font-bold transition-all"
                                    onClick={() => {
                                      const editData = { ...item };
                                      if (editData.image) {
                                        if (editData.image.toLowerCase().endsWith('.mp4') || editData.image.includes('/video/upload/')) {
                                          editData.video_url = editData.image;
                                        } else {
                                          editData.image_url = editData.image;
                                        }
                                      }
                                      setEditingCardId(item._id || item.id);
                                      setCardFormData(editData);
                                      setSelectedAction("edit_single");
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="h-10 w-10 p-0 flex items-center justify-center rounded-xl border-[#f0b0b0] bg-white hover:bg-[#fff0f0] transition-all"
                                    onClick={() => handleCardAction("delete_card", item._id || item.id)}
                                  >
                                    <Trash2 size={18} className="text-[#c0392b]" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* CREATE OR EDIT SINGLE FORM */}
                  {(selectedAction === "create" || selectedAction === "edit_single") && (
                    <Card className="border-slate-100 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95">
                      <div className="px-8 py-6 border-b bg-indigo-600 flex items-center justify-between text-white">
                        <CardTitle className="text-xl font-black">
                          {selectedAction === 'edit_single' ? 'Modify Entry' : 'New Entry Creation'}
                        </CardTitle>
                        <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full" onClick={() => setSelectedAction("update")}>
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <CardContent className="p-10 space-y-8">
                        {FIELD_CONFIG[selectedSection.type].map((field: any) => (
                          <div key={field.id} className="space-y-3">
                            <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">{field.label}</Label>
                            {field.type === "text" && <Input className="h-12 border-slate-200" value={cardFormData[field.id] || ""} onChange={(e) => setCardFormData({ ...cardFormData, [field.id]: e.target.value })} />}
                            {field.type === "textarea" && <Textarea rows={5} className="border-slate-200" value={cardFormData[field.id] || ""} onChange={(e) => setCardFormData({ ...cardFormData, [field.id]: e.target.value })} />}
                            {field.type === "image" && <ImageUploader value={cardFormData[field.id]} onChange={(url) => setCardFormData({ ...cardFormData, [field.id]: url })} />}
                          </div>
                        ))}
                        <div className="flex justify-end gap-4 pt-6">
                          <Button variant="ghost" className="rounded-full px-8" onClick={() => setSelectedAction("update")}>Discard</Button>
                          <Button
                            className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-10 shadow-lg shadow-indigo-100 font-bold"
                            onClick={() => handleCardAction(editingCardId ? "update_card" : "create_card", editingCardId || undefined, cardFormData)}
                            disabled={isSaving}
                          >
                            {isSaving && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                            {editingCardId ? 'Save Changes' : 'Create Entry'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* NO ACTION SELECTED FALLBACK */}
                  {!selectedAction && (
                    <div className="flex flex-col items-center justify-center p-20 bg-indigo-50/30 rounded-3xl border border-indigo-100 border-dashed">
                      <ArrowRight className="h-12 w-12 text-indigo-200 mb-6" />
                      <h4 className="text-indigo-900 font-black text-xl">Ready to Manage</h4>
                      <p className="text-indigo-600/60 font-medium mt-2 text-center">Choose an action from the "Management Mode" menu on the left to start editing this section.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const res = await api.upload(file)
        onChange(res.url)
        toast.success("Image Stored")
      } catch (err) {
        toast.error("Upload failed")
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
          <img src={resolveImageUrl(value)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="destructive" className="rounded-full" size="sm" onClick={() => onChange("")}><Trash2 className="mr-2 h-4 w-4" /> Replace Image</Button>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-3xl p-16 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="animate-spin h-10 w-10 text-indigo-600" /> : <Upload className="h-10 w-10 text-slate-200 mb-6" />}
          <p className="text-lg font-black text-slate-400">Media Portal</p>
          <p className="text-slate-400 font-medium text-sm mt-1">Click to browse your local files</p>
        </div>
      )}
      <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleUpload} />
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${className}`}>
      {children}
    </span>
  )
}
