import { Suspense } from "react"
import { AdsGroupsListClient } from "./ads-groups-list-client"
import { fetchAdsGroups, fetchCampaigns } from "@/utils/server-actions"
import { Loader } from "@/components/ui/loader"

export async function AdsGroupsList() {
  const [adsGroups, campaigns] = await Promise.all([fetchAdsGroups(), fetchCampaigns()])

  return (
    <Suspense fallback={<Loader className="h-[50vh]" />}>
      <AdsGroupsListClient initialAdsGroups={adsGroups} campaigns={campaigns} />
    </Suspense>
  )
}

