import { AdsGroupsList } from "@/components/ads-groups-list"
import { CreateAdsGroupDialog } from "@/components/create-ads-group-dialog"

export default function AdsGroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ads groups</h1>
        <CreateAdsGroupDialog />
      </div>
      <AdsGroupsList />
    </div>
  )
}

