"use client"

import { Button } from "@/components/ui/button"
import { useSignout } from "@/utils/hooks/auth-hooks"
import { toaster } from "@/utils/toast"
import { useNavigate } from "react-router"

const LogoutBtn = () => {
  const navigateTo = useNavigate()
  const signoutMut = useSignout()

  const handleClick = async () => {
    await signoutMut.mutateAsync(undefined, {
      onSuccess: () => {
        navigateTo("/auth/login")
      },
      onError: (ctx) => {
        toaster.error({
          title: "Failed to logout",
          description: ctx.message,
        })
      },
    })
  }

  return (
    <Button disabled={signoutMut.isPending} onClick={handleClick}>
      {signoutMut.isPending ? "Logging out..." : "Logout"}
    </Button>
  )
}

export default LogoutBtn
