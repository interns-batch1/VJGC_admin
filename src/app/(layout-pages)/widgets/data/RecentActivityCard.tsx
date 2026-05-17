"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { History, CheckCircle2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function RecentActivityCard() {
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.get("/admin/cms/activity")
      .then(setActivities)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent CMS Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
             ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-8">
            No recent activity found.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                <div className="mt-1">
                  {activity.status === "published" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none mb-1">
                    Updated <span className="text-primary font-bold">{activity.section}</span> on {activity.page}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {activity.status} • {activity.updated_at ? formatDistanceToNow(new Date(activity.updated_at), { addSuffix: true }) : 'just now'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
