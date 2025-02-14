"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateAdsGroupForm } from "./create-ads-group-form"
import { type AdsGroup, updateAdsGroup } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"
import type { Campaign } from "@/types"

interface EditAdsGroupDialogProps {
  group: AdsGroup
  campaigns: Campaign[]
  onSave: (updatedGroup: AdsGroup) => void
  children: React.ReactNode
}

export function EditAdsGroupDialog({ group, onSave, campaigns, children }: EditAdsGroupDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSave = async (updatedData: Partial<AdsGroup>) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const updatedGroup = await updateAdsGroup(group.id, updatedData)
      if (updatedGroup) {
        onSave(updatedGroup)
        setIsOpen(false)
        toast({
          title: "Success",
          description: "Ads Group updated successfully",
        })
      } else {
        throw new Error("Failed to update Ads Group: No data returned")
      }
    } catch (error) {
      console.error("Error updating Ads Group:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update Ads Group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(true)
          }}
        >
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background pt-6 pb-4 mb-4">
          <DialogTitle>Edit Ads Group</DialogTitle>
        </DialogHeader>
        <CreateAdsGroupForm initialData={group} mode="edit" onSave={handleSave} campaigns={campaigns} />
      </DialogContent>
    </Dialog>
  )
}

