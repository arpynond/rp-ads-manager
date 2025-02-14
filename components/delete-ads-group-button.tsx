"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteAdsGroup } from "@/utils/dataOperations"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface DeleteAdsGroupButtonProps {
  id: string
  name: string
  onDelete: () => void
}

export function DeleteAdsGroupButton({ id, name, onDelete }: DeleteAdsGroupButtonProps) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const success = await deleteAdsGroup(id)
      if (success) {
        onDelete()
        setOpen(false)
        toast({
          title: "Success",
          description: `Ads Group "${name}" has been deleted.`,
        })
      }
    } catch (error) {
      console.error("Error deleting Ads Group:", error)
      toast({
        title: "Error",
        description: "Failed to delete Ads Group. Please try again.",
        variant: "destructive",
      })
      setOpen(false)
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
            Are you sure you want to delete the Ads Group "{name}"? This action cannot be undone.
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

