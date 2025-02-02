"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateAdForm } from "./create-ad-form"
import { useState } from "react"
import type { Ad } from "@/utils/dataOperations"

interface CreateAdDialogProps {
  onCreateSuccess: (newAd: Ad) => void
}

export function CreateAdDialog({ onCreateSuccess }: CreateAdDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Ad</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Ad</DialogTitle>
        </DialogHeader>
        <CreateAdForm
          mode="create"
          onSave={() => setOpen(false)}
          onCreateSuccess={(newAd) => {
            onCreateSuccess(newAd)
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

