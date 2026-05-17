"use client"

import React, { useState, useEffect } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { api } from "@/lib/api"

interface CRUDPageProps<T> {
  title: string
  entityName: string
  endpoint: string // e.g., "/news" or "/services"
  columns: ColumnDef<T>[]
  formFields: { id: string; label: string; type?: string; options?: { label: string; value: string }[] }[]
}

export function CRUDPage<T extends { id?: string | number; _id?: string }>({
  title,
  entityName,
  endpoint,
  columns,
  formFields,
}: CRUDPageProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [formData, setFormData] = useState<any>({})

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // We use the public endpoint for listing
      const result = await api.get(endpoint)
      // If result is not an array (e.g. for /about), wrap it in one
      setData(Array.isArray(result) ? result : result ? [result] : [])
    } catch (error: any) {
      toast.error(`Failed to fetch ${entityName}: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchData()
  }, [endpoint])

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({})
    setIsOpen(true)
  }

  const handleEdit = (item: T) => {
    setEditingItem(item)
    setFormData(item)
    setIsOpen(true)
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      await api.delete(`/admin${endpoint}/${id}`)
      setData(data.filter((item) => (item.id || item._id) !== id))
      toast.success(`${entityName} deleted successfully`)
    } catch (error: any) {
      toast.error(`Failed to delete: ${error.message}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitLoading(true)
    try {
      if (editingItem) {
        const id = editingItem.id || editingItem._id
        // Note: Update logic might vary depending on endpoint
        // For 'about', it's usually a PUT to /admin/about without ID
        const url = endpoint === "/about" ? "/admin/about" : `/admin${endpoint}/${id}`
        const result = await api.put(url, formData)
        setData(data.map((item) => ((item.id || item._id) === id ? result : item)))
        toast.success(`${entityName} updated successfully`)
      } else {
        const result = await api.post(`/admin${endpoint}`, formData)
        setData([...data, result])
        toast.success(`${entityName} added successfully`)
      }
      setIsOpen(false)
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`)
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const actionColumn: ColumnDef<T> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete((row.original.id || row.original._id)!)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }

  const allColumns = [...columns, actionColumn]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add {entityName}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={allColumns} data={data} />
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${entityName}` : `Add ${entityName}`}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingItem ? "update" : "create"} the {entityName.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === "image" ? (
                  <div className="space-y-2">
                    {formData[field.id] && (
                      <img src={formData[field.id]} alt="Preview" className="w-24 h-24 object-cover rounded" />
                    )}
                    <Input
                      id={field.id}
                      type="file"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          try {
                            const result = await api.upload(file)
                            setFormData({ ...formData, [field.id]: result.url })
                            toast.success("Image uploaded successfully")
                          } catch (error: any) {
                            toast.error("Upload failed")
                          }
                        }
                      }}
                    />
                  </div>
                ) : field.type === "select" ? (
                  <select
                    id={field.id}
                    className="w-full p-2 border rounded-md"
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    required
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    required
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type || "text"}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    required
                  />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitLoading}>
                {isSubmitLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingItem ? "Save Changes" : `Add ${entityName}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

