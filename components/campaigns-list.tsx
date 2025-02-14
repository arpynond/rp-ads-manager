import { Suspense } from "react"
import { CampaignsListClient } from "./campaigns-list-client"
import { fetchCampaigns } from "@/utils/server-actions"
import { Loader } from "@/components/ui/loader"

export async function CampaignsList() {
  const campaigns = await fetchCampaigns()

  return (
    <Suspense fallback={<Loader className="h-[50vh]" />}>
      <CampaignsListClient initialCampaigns={campaigns} />
    </Suspense>
  )
}

