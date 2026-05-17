"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const columns = [
  { accessorKey: "title", header: "Page Title" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "updated_at", header: "Last Updated" },
]

const formFields = [
  { id: "title", label: "Page Title" },
  { id: "description", label: "Description", type: "textarea" },
  { id: "mission", label: "Mission", type: "textarea" },
  { id: "vision", label: "Vision", type: "textarea" },
  { id: "image_url", label: "Hero Image", type: "image" },
]

export default function AboutPage() {
  return (
    <CRUDPage
      title="About Us Content"
      entityName="About Content"
      endpoint="/about"
      columns={columns}
      formFields={formFields}
    />
  )
}

