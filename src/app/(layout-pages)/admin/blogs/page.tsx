"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "created_at", header: "Created At" },
]

const formFields = [
  { id: "title", label: "Title" },
  { id: "category", label: "Category" },
  { id: "author", label: "Author" },
  { id: "content", label: "Content" },
  { id: "description", label: "Full Description (Min 200 words)", type: "textarea" },
  { id: "image_url", label: "Main Hero Image", type: "image" },
  { id: "gallery_image_1", label: "Gallery Image 1 (Content)", type: "image" },
  { id: "gallery_image_2", label: "Gallery Image 2 (Content)", type: "image" },
]

export default function BlogsPage() {
  return (
    <CRUDPage
      title="Blog Management"
      entityName="Blog"
      endpoint="/news"
      columns={columns}
      formFields={formFields}
    />
  )
}

