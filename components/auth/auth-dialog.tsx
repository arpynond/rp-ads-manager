"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SignInForm } from "./sign-in-form"
import { SignUpForm } from "./sign-up-form"

interface AuthDialogProps {
  children?: React.ReactNode
}

export function AuthDialog({ children }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children || <Button variant="outline">Sign In</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign In" : "Create Account"}</DialogTitle>
        </DialogHeader>
        {mode === "signin" ? (
          <SignInForm onSuccess={() => setIsOpen(false)} onToggleMode={() => setMode("signup")} />
        ) : (
          <SignUpForm onSuccess={() => setIsOpen(false)} onToggleMode={() => setMode("signin")} />
        )}
      </DialogContent>
    </Dialog>
  )
}

