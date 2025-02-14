"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function NavigationTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("navigationHistory") || "[]")
    if (history[history.length - 1] !== pathname) {
      history.push(pathname)
      localStorage.setItem("navigationHistory", JSON.stringify(history.slice(-5))) // Keep only last 5 routes
    }
  }, [pathname])

  return null
}

