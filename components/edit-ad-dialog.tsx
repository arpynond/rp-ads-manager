"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateAdForm } from "./create-ad-form"
import { Edit2 } from "lucide-react"
import { useState } from "react"
import { type Ad, updateAd } from "@/utils/dataOperations"
import { toast } from "@/components/ui/use-toast"

interface EditAdDialogProps {
  ad: Ad
  onSave: (updatedAd: Ad) => void
}

export function EditAdDialog({ ad, onSave }: EditAdDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSave = async (updatedData: Partial<Ad>) => {
    try {
      const updatedAd = await updateAd(ad.id, updatedData)
      if (updatedAd) {
        onSave(updatedAd)
        setOpen(false)
        toast({
          title: "Success",
          description: "Ad updated successfully",
        })
      } else {
        throw new Error("Failed to update Ad")
      }
    } catch (error) {
      console.error("Error updating Ad:", error)
      toast({
        title: "Error",
        description: "Failed to update Ad. Please try again.",
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
          <DialogTitle>Edit Ad</DialogTitle>
        </DialogHeader>
        <CreateAdForm initialData={ad} mode="edit" onSave={handleSave} />
      </DialogContent>
    </Dialog>
  )
}

