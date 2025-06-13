import { useSignout } from "@app/utils/hooks/auth-hooks"
import { toast } from "@app/utils/toast"
import { Button } from "@mantine/core"
import { LogOutIcon } from "lucide-react"
import { memo, useState } from "react"
import AnchorLink from "../layout/AnchorLink"
import { authClient } from "@app/utils/auth-client"

type LogoutBtnProps = {
  onLogoutSuccess: () => Promise<void>
}

const LogoutBtn = ({ onLogoutSuccess }: LogoutBtnProps) => {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleClick = async () => {
    setLoggingOut(true)
    const signOutRes = await authClient.signOut()

    if (signOutRes.error) {
      setLoggingOut(false)

      toast.error({
        // title: "Failed to logout",
        title: signOutRes.error.statusText,
        message: signOutRes.error.message,
      })
    } else {
      setLoggingOut(false)
      await onLogoutSuccess()
    }
  }

  return (
    <Button component={AnchorLink} loading={loggingOut} onClick={handleClick}>
      <LogOutIcon />
      <span>Logout</span>
    </Button>
  )
}

export default memo(LogoutBtn)
