"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteCampaignButton } from "./delete-campaign-button"
import { StopCampaignModal } from "./stop-campaign-modal"
import type { Campaign } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Pause, CircleStopIcon as Stop, Play, Edit2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateCampaignStatus } from "@/app/actions"

interface CampaignsListClientProps {
  initialCampaigns: Campaign[]
}

export function CampaignsListClient({ initialCampaigns }: CampaignsListClientProps) {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [stopModalOpen, setStopModalOpen] = useState(false)
  const [campaignToStop, setCampaignToStop] = useState<Campaign | null>(null)

  const handleUpdateSuccess = (updatedCampaign: Campaign) => {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) => (campaign.id === updatedCampaign.id ? updatedCampaign : campaign)),
    )
  }

  const handleDeleteSuccess = (deletedId: string) => {
    setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.id !== deletedId))
  }

  const handleStatusUpdate = async (id: string, status: Campaign["status"]) => {
    try {
      const updatedCampaign = await updateCampaignStatus(id, status)
      handleUpdateSuccess(updatedCampaign)
      toast({
        title: "Success",
        description: `Campaign ${status === "paused" ? "paused" : "activated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating campaign status:", error)
      toast({
        title: "Error",
        description: "Failed to update campaign status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (campaigns.length === 0) {
    return <div>No campaigns found. Create one to get started!</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Bid strategy</TableHead>
            <TableHead>Campaign goal</TableHead>
            <TableHead>Ads groups</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{campaign.name}</p>
                </div>
              </TableCell>
              <TableCell>{campaign.bid_strategy}</TableCell>
              <TableCell>{campaign.goal}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {campaign.ads_groups && campaign.ads_groups.length > 0 ? (
                    campaign.ads_groups.map((group, index) => (
                      <span key={group.id}>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-blue-600"
                          onClick={() => router.push(`/ads/${group.id}`)}
                        >
                          {group.name}
                        </Button>
                        {index < campaign.ads_groups.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No associated groups</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">${campaign.budget?.toLocaleString() ?? "N/A"}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{campaign.conversions?.toLocaleString() ?? "N/A"} conversions</p>
                  <p className="text-sm text-gray-500">CTR: {campaign.ctr ?? "N/A"}%</p>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    campaign.status === "active"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "paused"
                        ? "bg-yellow-100 text-yellow-800"
                        : campaign.status === "stopped"
                          ? "bg-red-100 text-red-800"
                          : campaign.status === "learning"
                            ? "bg-blue-100 text-blue-800"
                            : campaign.status === "learning limited"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800",
                  )}
                >
                  {campaign.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {campaign.status === "paused" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusUpdate(campaign.id, "active")}
                      title="Activate Campaign"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {campaign.status === "active" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusUpdate(campaign.id, "paused")}
                      title="Pause Campaign"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  {campaign.status !== "stopped" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCampaignToStop(campaign)
                        setStopModalOpen(true)
                      }}
                      title="Stop Campaign"
                    >
                      <Stop className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/campaigns/${campaign.id}`)}
                    title="Edit Campaign"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <DeleteCampaignButton
                    id={campaign.id}
                    name={campaign.name}
                    onDelete={() => handleDeleteSuccess(campaign.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <StopCampaignModal
        isOpen={stopModalOpen}
        onClose={() => {
          setStopModalOpen(false)
          setCampaignToStop(null)
        }}
        onConfirm={async () => {
          if (campaignToStop) {
            await handleStatusUpdate(campaignToStop.id, "stopped")
            setStopModalOpen(false)
            setCampaignToStop(null)
          }
        }}
        campaignName={campaignToStop?.name || ""}
      />
    </>
  )
}

