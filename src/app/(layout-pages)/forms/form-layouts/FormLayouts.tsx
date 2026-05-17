"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Send } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function FormManagement() {
  const [formFields, setFormFields] = useState<{ id: number; label: string; type: string }[]>([
    { id: 1, label: "Full Name", type: "text" },
    { id: 2, label: "Email Address", type: "email" },
  ])
  const [submissions, setSubmissions] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", date: "2024-05-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", date: "2024-05-02" },
  ])

  const addField = () => {
    setFormFields([...formFields, { id: Date.now(), label: "New Field", type: "text" }])
  }

  const removeField = (id: number) => {
    setFormFields(formFields.filter(f => f.id !== id))
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Form Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Form Builder */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dynamic Form Builder</CardTitle>
            <Button size="sm" onClick={addField}>
              <Plus className="mr-2 h-4 w-4" /> Add Field
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formFields.map((field) => (
              <div key={field.id} className="flex items-center gap-4 p-3 border rounded-md">
                <div className="flex-1 space-y-1">
                  <Label>Field Label</Label>
                  <Input 
                    value={field.label} 
                    onChange={(e) => {
                      const updated = [...formFields]
                      const f = updated.find(uf => uf.id === field.id)
                      if (f) f.label = e.target.value
                      setFormFields(updated)
                    }}
                  />
                </div>
                <Button variant="ghost" size="icon" className="text-destructive mt-6" onClick={() => removeField(field.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submissions Display */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>{sub.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}