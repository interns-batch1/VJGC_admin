"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic"

// Clean default-based dynamic imports with ssr: false to prevent hydration warnings on charts and dynamic ids
const WebsiteVisitorsCard = dynamic(() =>
  import("../../widgets/data/WebsiteVisitorsCard"), { ssr: false }
)

const NewCustomersCard = dynamic(() =>
  import("../..//widgets/data/NewCustomersCard"), { ssr: false }
)

const TotalSessionsCard = dynamic(() =>
  import("../..//widgets/data/TotalSessionsCard"), { ssr: false }
)

const AreaStatsCard = dynamic(() =>
  import("../..//widgets/data/AreaStatsCard"), { ssr: false }
)

const VisitorsSalesStackedCard = dynamic(() =>
  import("../..//widgets/data/VisitorsSalesStackedCard"), { ssr: false }
)

const TopTrafficChannelsCard = dynamic(() =>
  import("../..//widgets/data/TopTrafficChannelsCard"), { ssr: false }
)

const TotalPagesCard = dynamic(() =>
  import("../..//widgets/data/TotalPagesCard"), { ssr: false }
)

const NewVsOldVisitors = dynamic(() =>
  import("../..//widgets/data/NewVsOldVisitors"), { ssr: false }
)

const TrafficTable = dynamic(() =>
  import("../..//dashboard/analytics/TrafficTable"), { ssr: false }
)

const UserByCountryCard = dynamic(() =>
  import("../..//widgets/data/UserByCountryCard"), { ssr: false }
)

const RecentActivityCard = dynamic(() =>
  import("../..//widgets/data/RecentActivityCard"), { ssr: false }
)

// Skeleton
function CardSkeleton({ height = 250 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-xl bg-muted animate-pulse"
      style={{ height }}
    />
  )
}

export default function CrmDashboard() {
  return (
    <div className="space-y-6 crm-dashboard-wrapper">

      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Suspense fallback={<CardSkeleton height={160} />}>
          <WebsiteVisitorsCard />
        </Suspense>

        <Suspense fallback={<CardSkeleton height={160} />}>
          <NewCustomersCard />
        </Suspense>

        <Suspense fallback={<CardSkeleton height={160} />}>
          <TotalSessionsCard />
        </Suspense>

        <Suspense fallback={<CardSkeleton height={160} />}>
          <AreaStatsCard />
        </Suspense>

      </div>

      {/* Mid Section - Activity & Stats */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Suspense fallback={<CardSkeleton height={350} />}>
            <VisitorsSalesStackedCard />
          </Suspense>
          <Suspense fallback={<CardSkeleton height={350} />}>
            <UserByCountryCard />
          </Suspense>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Suspense fallback={<CardSkeleton height={350} />}>
            <RecentActivityCard />
          </Suspense>
        </div>
      </div>

      {/* Mid Section 2 */}
      <div className="grid grid-cols-12 gap-6">

        <div className="col-span-12 lg:col-span-6 xl:col-span-4">
          <Suspense fallback={<CardSkeleton height={280} />}>
            <NewVsOldVisitors />
          </Suspense>
        </div>

        <div className="col-span-12 lg:col-span-6 xl:col-span-4">
          <Suspense fallback={<CardSkeleton height={280} />}>
            <TopTrafficChannelsCard />
          </Suspense>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <Suspense fallback={<CardSkeleton height={280} />}>
            <TotalPagesCard />
          </Suspense>
        </div>

      </div>


      {/* Table */}
      <Suspense fallback={<CardSkeleton height={400} />}>
        <TrafficTable />
      </Suspense>

    </div>
  )
}