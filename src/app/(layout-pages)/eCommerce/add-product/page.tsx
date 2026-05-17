"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

const AddProduct = dynamic(() => import("./AddProduct"), { ssr: false })

export default function Page() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <AddProduct />
    </Suspense>
  )
}
