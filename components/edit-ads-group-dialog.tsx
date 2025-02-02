"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateAdsGroupForm } from "./create-ads-group-form"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { type AdsGroup, updateAdsGroup } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"

interface EditAdsGroupDialogProps {
  group: AdsGroup
  onSave: (updatedGroup: AdsGroup) => void
}

export function EditAdsGroupDialog({ group, onSave }: EditAdsGroupDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSave = async (updatedData: Partial<AdsGroup>) => {
    try {
      const updatedGroup = await updateAdsGroup(group.id, updatedData)
      if (updatedGroup) {
        onSave(updatedGroup)
        setOpen(false)
        toast({
          title: "Success",
          description: "Ads Group updated successfully",
        })
      } else {
        throw new Error("Failed to update Ads Group")
      }
    } catch (error) {
      console.error("Error updating Ads Group:", error)
      toast({
        title: "Error",
        description: "Failed to update Ads Group. Please try again.",
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
          <DialogTitle>Edit Ads Group</DialogTitle>
        </DialogHeader>
        <CreateAdsGroupForm initialData={group} mode="edit" onSave={handleSave} />
      </DialogContent>
    </Dialog>
  )
}

