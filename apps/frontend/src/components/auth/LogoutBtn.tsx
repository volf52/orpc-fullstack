"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/utils/auth-client"
import { toaster } from "@/utils/toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

const LogoutBtn = () => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    await authClient.signOut(
      {},
      {
        onSuccess: () => {
          router.push("/auth/login")
        },
        onError: (ctx) => {
          setIsPending(false)
          toaster.error({
            title: "Failed to logout",
            description: ctx.error.message,
          })
        },
      },
    )
  }

  return (
    <Button disabled={isPending} onClick={handleClick}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  )
}

export default LogoutBtn
