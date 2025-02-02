"use client"

import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteAd } from "@/utils/dataOperations"
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

interface DeleteAdButtonProps {
  id: string
  name: string
  onDelete: () => void
}

export function DeleteAdButton({ id, name, onDelete }: DeleteAdButtonProps) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteAd(id)
      onDelete()
      setOpen(false)
      toast({
        title: "Success",
        description: "Ad deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting Ad:", error)
      toast({
        title: "Error",
        description: "Failed to delete Ad. Please try again.",
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
            Are you sure you want to delete the Ad "{name}"? This action cannot be undone.
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

