import { authClient } from "@app/utils/auth-client"
import { toast } from "@app/utils/toast"
import { Button } from "@mantine/core"
import { LogOutIcon } from "lucide-react"
import { memo, useState } from "react"

type LogoutBtnProps = {
  onLogoutSuccess: () => Promise<void>
}

const LogoutBtn = ({ onLogoutSuccess }: LogoutBtnProps) => {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleClick = async () => {
    setLoggingOut(true)
    const signOutRes = await authClient.signOut()
    setLoggingOut(false)

    if (signOutRes.error) {
      toast.error({
        title: "Failed to logout",
        message: signOutRes.error.message,
      })
    } else {
      await onLogoutSuccess()
    }
  }

  return (
    <Button
      fullWidth
      justify="start"
      loading={loggingOut}
      onClick={handleClick}
      variant="transparent"
    >
      <LogOutIcon />
      <span>Logout</span>
    </Button>
  )
}

export default memo(LogoutBtn)
