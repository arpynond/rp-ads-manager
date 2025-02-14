"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteCampaign } from "@/utils/dataOperations"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface DeleteCampaignButtonProps {
  id: string
  name: string
  onDelete: () => void
}

export function DeleteCampaignButton({ id, name, onDelete }: DeleteCampaignButtonProps) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const success = await deleteCampaign(id)
      if (success) {
        onDelete()
        setOpen(false)
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        })
      } else {
        throw new Error("Failed to delete Campaign")
      }
    } catch (error) {
      console.error("Error deleting Campaign:", error)
      toast({
        title: "Error",
        description: "Failed to delete Campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the Campaign "{name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

