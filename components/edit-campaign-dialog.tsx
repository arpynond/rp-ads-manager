"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateCampaignForm } from "./create-campaign-form"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { type Campaign, updateCampaign } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"

interface EditCampaignDialogProps {
  campaign: Campaign
  onSave: (updatedCampaign: Campaign) => void
}

export function EditCampaignDialog({ campaign, onSave }: EditCampaignDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSave = async (updatedData: Partial<Campaign>) => {
    try {
      const updatedCampaign = await updateCampaign(campaign.id, updatedData)
      if (updatedCampaign) {
        onSave(updatedCampaign)
        setOpen(false)
        toast({
          title: "Success",
          description: "Campaign updated successfully",
        })
      } else {
        throw new Error("Failed to update Campaign")
      }
    } catch (error) {
      console.error("Error updating Campaign:", error)
      toast({
        title: "Error",
        description: "Failed to update Campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <CreateCampaignForm initialData={campaign} mode="edit" onSave={handleSave} />
      </DialogContent>
    </Dialog>
  )
}

