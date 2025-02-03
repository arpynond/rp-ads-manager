"use client"

import { useEffect } from "react"

export function AttributeCleaner() {
  useEffect(() => {
    document.body.removeAttribute("data-new-gr-c-s-check-loaded")
    document.body.removeAttribute("data-gr-ext-installed")
  }, [])

  return null
}

