"use client"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Ad } from "@/types"

interface EditAdButtonProps {
  ad: Ad
}

export function EditAdButton({ ad }: EditAdButtonProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/ads/${ad.ads_group_id}/${ad.id}`)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleEdit}>
      <Pencil className="h-4 w-4" />
    </Button>
  )
}

