import { CampaignsList } from "@/components/campaigns-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Link href="/campaigns/new">
          <Button>Create New Campaign</Button>
        </Link>
      </div>
      <CampaignsList />
    </div>
  )
}

