"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Play, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { type Campaign, getCampaigns } from "@/utils/dataOperations"

export function CampaignsTable() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      const fetchedCampaigns = await getCampaigns()
      setCampaigns(fetchedCampaigns)
    }
    fetchCampaigns()
  }, [])

  return (
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
                <Button variant="ghost" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

