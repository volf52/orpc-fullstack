import { useSignout } from "@app/utils/hooks/auth-hooks"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@ui/button"
import { useToast } from "@ui/toast/use-toast"

const LogoutBtn = () => {
  const navigateTo = useNavigate()
  const signoutMut = useSignout()
  const { toast } = useToast()

  const handleClick = async () => {
    await signoutMut.mutateAsync(undefined, {
      onSuccess: () => {
        navigateTo({ to: "/auth/login" })
      },
      onError: (ctx) => {
        toast({
          title: "Failed to logout",
          description: ctx.message,
          variant: "destructive",
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
