"use client"

import { Button } from "@/components/ui/button"
import { useSignout } from "@/utils/hooks/authHooks"
import { toaster } from "@/utils/toast"
import { useRouter } from "next/navigation"

const LogoutBtn = () => {
  const router = useRouter()
  const signoutMut = useSignout()

  const handleClick = async () => {
    await signoutMut.mutateAsync(undefined, {
      onSuccess: () => {
        router.push("/auth/login")
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
