"use client"

import { Toast } from "@/components/ui/toast"
import type { Store as ToastStore } from "@zag-js/toast"

export const toaster: ToastStore<string> = Toast.createToaster({
  placement: "bottom-end",
  overlap: true,
  gap: 16,
})
