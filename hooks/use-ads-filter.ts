"use client"

import { useRouter, usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export function useAdsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  useEffect(() => {
    const groupId = pathname.startsWith("/ads/") ? pathname.split("/")[2] : "all"
    setSelectedGroup(groupId)
  }, [pathname])

  const setSelectedGroupAndUpdateURL = useCallback(
    (group: string) => {
      if (group === "all") {
        router.push("/ads")
      } else {
        router.push(`/ads/${group}`)
      }
    },
    [router],
  )

  return { selectedGroup, setSelectedGroup: setSelectedGroupAndUpdateURL }
}

