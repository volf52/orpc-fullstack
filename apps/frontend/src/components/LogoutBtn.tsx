"use client"

import { Button } from "@/components/ui/button"
import { useAuthDispatch } from "@/utils/contexts/auth-context"
import { useRouter } from "next/navigation"

const LogoutBtn = () => {
  const router = useRouter()
  const dispatch = useAuthDispatch()

  const handleClick = () => {
    dispatch({ type: "LOGOUT" })
    router.push("/auth/login")
  }

  return <Button onClick={handleClick}>Logout</Button>
}

export default LogoutBtn
