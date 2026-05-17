"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const countryData = [
  { name: "United States", code: "US", count: "12,450", percentage: 45, color: "bg-blue-500" },
  { name: "India", code: "IN", count: "8,200", percentage: 32, color: "bg-orange-500" },
  { name: "United Kingdom", code: "GB", count: "4,500", percentage: 18, color: "bg-indigo-500" },
  { name: "Germany", code: "DE", count: "3,100", percentage: 12, color: "bg-emerald-500" },
  { name: "Canada", code: "CA", count: "2,800", percentage: 10, color: "bg-red-500" },
]

export default function UserByCountryCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Users by Country</CardTitle>
        <CardDescription>Global visitor distribution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-5">
          {countryData.map((country) => (
            <div key={country.code} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                    alt={country.name}
                    className="h-4 w-6 rounded-sm object-cover shadow-sm"
                  />
                  <span className="text-sm font-medium">{country.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{country.count}</span>
                  <span className="text-xs text-muted-foreground">{country.percentage}%</span>
                </div>
              </div>
              <Progress value={country.percentage} className={`h-1.5 ${country.color}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
