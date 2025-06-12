import { useSignout } from "@app/utils/hooks/auth-hooks"
import { toast } from "@app/utils/toast"
import { Button } from "@mantine/core"
import { useNavigate } from "@tanstack/react-router"
import { LogOutIcon } from "lucide-react"
import AnchorLink from "../layout/AnchorLink"

const LogoutBtn = () => {
  const navigateTo = useNavigate()
  const signoutMut = useSignout()

  const handleClick = async () => {
    await signoutMut.mutateAsync(undefined, {
      onSuccess: () => {
        navigateTo({ to: "/auth/login" })
      },
      onError: (ctx) => {
        toast.error({
          title: "Failed to logout",
          message: ctx.message,
        })
      },
    })
  }

  return (
    <Button
      component={AnchorLink}
      loading={signoutMut.isPending}
      onClick={handleClick}>
      <LogOutIcon />
      <span>Logout</span>
    </Button>
  )
}

export default LogoutBtn
