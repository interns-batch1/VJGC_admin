"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "created_at", header: "Date" },
]

const formFields = [
  { id: "title", label: "Title" },
  { id: "author", label: "Author" },
  { id: "summary", label: "Summary", type: "textarea" },
  { id: "content", label: "Content", type: "textarea" },
  { id: "image_url", label: "Image", type: "image" },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Draft", value: "Draft" },
      { label: "Published", value: "Published" }
    ]
  },
]

export default function NewsPage() {
  return (
    <CRUDPage
      title="News Management"
      entityName="News"
      endpoint="/news"
      columns={columns}
      formFields={formFields}
    />
  )
}

