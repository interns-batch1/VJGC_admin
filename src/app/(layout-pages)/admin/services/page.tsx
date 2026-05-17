"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const columns = [
  { accessorKey: "title", header: "Service Name" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "icon", header: "Icon Class" },
]

const formFields = [
  { id: "title", label: "Service Name" },
  { id: "description", label: "Description", type: "textarea" },
  { id: "icon", label: "Icon Class (e.g., flaticon-development)" },
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

export default function ServicesPage() {
  return (
    <CRUDPage
      title="Services Management"
      entityName="Service"
      endpoint="/services"
      columns={columns}
      formFields={formFields}
    />
  )
}

