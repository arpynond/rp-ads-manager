import { CampaignPageClient } from "@/components/campaign-page-client"

export default function CampaignPage({ params }: { params: { id: string } }) {
  return <CampaignPageClient id={params.id} />
}

