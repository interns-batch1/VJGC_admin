import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Globe, Info, Mail, Newspaper, Settings, Briefcase } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function TotalPagesCard() {
    const [isMounted, setIsMounted] = useState(false)
    const [growthValues, setGrowthValues] = useState<string[]>([])

    const pages = [
        { name: "Home Page", icon: Globe, color: "emerald", value: 85, visits: "12,450" },
        { name: "About Us", icon: Info, color: "indigo", value: 65, visits: "8,200" },
        { name: "Services", icon: Briefcase, color: "pink", value: 75, visits: "9,800" },
        { name: "Newsroom", icon: Newspaper, color: "teal", value: 45, visits: "4,500" },
        { name: "Sustainability", icon: FileText, color: "yellow", value: 55, visits: "5,100" },
        { name: "Contact Us", icon: Mail, color: "violet", value: 35, visits: "3,200" },
        { name: "Business Verticals", icon: Settings, color: "orange", value: 70, visits: "8,900" },
    ]

    useEffect(() => {
        setIsMounted(true)
        setGrowthValues(pages.map(() => (Math.random() * 10).toFixed(1)))
    }, [])

    const getColorClasses = (color: string) => {
        const mapping: Record<string, string> = {
            emerald: "bg-emerald-100 text-emerald-600 dark:border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10 [&>div]:bg-emerald-500",
            indigo: "bg-indigo-100 text-indigo-600 dark:border-indigo-500/20 dark:text-indigo-400 dark:bg-indigo-500/10 [&>div]:bg-indigo-500",
            pink: "bg-pink-100 text-pink-600 dark:border-pink-500/20 dark:text-pink-400 dark:bg-pink-500/10 [&>div]:bg-pink-500",
            teal: "bg-teal-100 text-teal-600 dark:border-teal-500/20 dark:text-teal-400 dark:bg-teal-500/10 [&>div]:bg-teal-500",
            yellow: "bg-yellow-100 text-yellow-600 dark:border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/10 [&>div]:bg-yellow-500",
            violet: "bg-violet-100 text-violet-600 dark:border-violet-500/20 dark:text-violet-400 dark:bg-violet-500/10 [&>div]:bg-violet-500",
            orange: "bg-orange-100 text-orange-600 dark:border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/10 [&>div]:bg-orange-500",
        }
        return mapping[color] || ""
    }

    return (
        <Card>
            <CardHeader className="space-y-0">
                <CardTitle className="text-lg">Top Pages</CardTitle>
                <CardDescription>Website content analytics</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                <div className="flex flex-col gap-6">
                    {pages.map((page, index) => (
                        <div key={page.name} className="flex items-center gap-5">
                            <div className={`
                                flex h-10 w-10 items-center justify-center rounded-xl
                                flex-shrink-0
                                ${getColorClasses(page.color).split(' [&>div]')[0]}
                            `}>
                                <page.icon className="h-5 w-5" />
                            </div>
                            <div className="w-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-md text-muted-foreground">{page.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{page.visits}</span>
                                        <span className={`flex items-center text-sm ${getColorClasses(page.color).split(' ')[1]}`}>
                                            +{isMounted ? growthValues[index] : "0.0"}%
                                        </span>
                                    </div>
                                </div>
                                <Progress 
                                    value={page.value} 
                                    className={`mt-2 h-1.5 bg-muted ${getColorClasses(page.color).split(' ').pop()} [&>div]:rounded-full`} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
