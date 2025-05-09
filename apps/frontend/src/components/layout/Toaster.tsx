"use client"

import { toaster } from "@/utils/toast"
import { Toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { XIcon } from "lucide-react"

const Toaster = () => {
  return (
    <Toast.Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root key={toast.id}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>

          {toast.action && (
            <Toast.ActionTrigger asChild>
              <Button variant="link" size="sm">
                {toast.action.label}
              </Button>
            </Toast.ActionTrigger>
          )}

          <Toast.CloseTrigger asChild>
            <IconButton size="sm" variant="link">
              <XIcon />
            </IconButton>
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toast.Toaster>
  )
}

export default Toaster
