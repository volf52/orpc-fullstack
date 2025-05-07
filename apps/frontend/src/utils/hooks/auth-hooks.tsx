"use client"

import { useRouter } from "next/navigation"
import { useAuthDispatch } from "../contexts/auth-context"
import type { User } from "@repo/contract/schemas"
import { useCallback } from "react"

export const useSetUser = () => {
  const dispatch = useAuthDispatch()
  const router = useRouter()

  const setUserFn = useCallback(
    (user: User) => {
      dispatch({ type: "SET_USER", payload: user })
      router.push("/")
    },
    [router, dispatch],
  )

  return setUserFn
}

export const useLogout = () => {
  const dispatch = useAuthDispatch()
  const router = useRouter()

  const logoutFn = useCallback(() => {
    dispatch({ type: "LOGOUT" })
    router.push("/auth/login")
  }, [router, dispatch])

  return logoutFn
}
