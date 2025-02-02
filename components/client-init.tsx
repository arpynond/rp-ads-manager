"use client"

import { useEffect } from "react"
import { initializeData } from "@/utils/initializeData"

export function ClientInit() {
  useEffect(() => {
    initializeData()
  }, [])

  return null
}

