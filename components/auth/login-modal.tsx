"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

export function LoginModal() {
  const { user, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  useEffect(() => {
    if (!isLoading && !user) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [user, isLoading])

  // Prevent closing by clicking outside or pressing escape
  const handleOpenChange = (open: boolean) => {
    if (!user) return
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign In" : "Create Account"}</DialogTitle>
        </DialogHeader>
        {mode === "signin" ? (
          <SignInForm onToggleMode={() => setMode("signup")} />
        ) : (
          <SignUpForm onToggleMode={() => setMode("signin")} />
        )}
      </DialogContent>
    </Dialog>
  )
}

