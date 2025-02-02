"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditCampaignDialog } from "./edit-campaign-dialog"
import { DeleteCampaignButton } from "./delete-campaign-button"
import { CreateCampaignDialog } from "./create-campaign-dialog"
import { useEffect, useState } from "react"
import { type Campaign, getCampaigns } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)
        const fetchedCampaigns = await getCampaigns()
        setCampaigns(fetchedCampaigns)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch campaigns:", err)
        setError("Failed to load campaigns. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  const handleCreateSuccess = (newCampaign: Campaign) => {
    setCampaigns((prevCampaigns) => [...prevCampaigns, newCampaign])
  }

  const handleUpdateSuccess = (updatedCampaign: Campaign) => {
    setCampaigns((prevCampaigns) =>
      prevCampaigns.map((campaign) => (campaign.id === updatedCampaign.id ? updatedCampaign : campaign)),
    )
  }

  const handleDeleteSuccess = (deletedId: string) => {
    setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.id !== deletedId))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <CreateCampaignDialog onCreateSuccess={handleCreateSuccess} />
      </div>
      {campaigns.length === 0 ? (
        <div>No campaigns found. Create one to get started!</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CAMPAIGN</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>BUDGET</TableHead>
              <TableHead>PERFORMANCE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-gray-500">{campaign.type}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      campaign.status === "live" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {campaign.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">of ${campaign.totalBudget.toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{campaign.conversions.toLocaleString()} conversions</p>
                    <p className="text-sm text-gray-500">CTR: {campaign.ctr}%</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditCampaignDialog
                      campaign={campaign}
                      onSave={(updatedCampaign) => {
                        handleUpdateSuccess(updatedCampaign)
                        toast({
                          title: "Success",
                          description: "Campaign updated successfully",
                        })
                      }}
                    />
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
      )}
    </>
  )
}

