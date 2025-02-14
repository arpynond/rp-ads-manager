import { Suspense } from "react"
import { AdsListFilter } from "./ads-list-filter"
import { AdsListTable } from "./ads-list-table"
import { fetchAds, fetchAdsGroups, fetchCampaigns } from "@/utils/server-actions"
import { Loader } from "@/components/ui/loader"
import { unstable_noStore as noStore } from "next/cache"

interface AdsListProps {
  groupId?: string
}

export async function AdsList({ groupId = "all" }: AdsListProps) {
  // Opt out of caching
  noStore()

  // Fetch all required data in parallel
  const [ads, adsGroups, campaigns] = await Promise.all([fetchAds(), fetchAdsGroups(), fetchCampaigns()])

  return (
    <Suspense fallback={<Loader className="h-[50vh]" />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ads</h1>
          <AdsListFilter adsGroups={adsGroups} campaigns={campaigns} />
        </div>
        <AdsListTable initialAds={ads} adsGroups={adsGroups} initialGroupId={groupId} />
      </div>
    </Suspense>
  )
}

