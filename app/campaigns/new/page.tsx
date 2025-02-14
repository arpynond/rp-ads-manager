import { CampaignForm } from "@/components/campaign-form"

export default function NewCampaignPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>
      <CampaignForm mode="create" />
    </div>
  )
}

