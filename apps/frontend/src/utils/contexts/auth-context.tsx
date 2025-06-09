import type { User } from "@repo/contract/schemas"
import { createContext, use, useEffect, useState } from "react"
import { authClient } from "../auth-client"

type AuthState = User | null
// type AuthAction = { type: "SET_USER"; payload: User } | { type: "LOGOUT" }

// const AuthReducer = (_state: User | null, action: AuthAction): AuthState => {
//   switch (action.type) {
//     case "LOGOUT": {
//       return null
//     }
//     case "SET_USER": {
//       return action.payload
//     }
//   }
// }

const AuthContext = createContext<AuthState>(null)
// const AuthDispatchContext = createContext<ActionDispatch<
//   [action: AuthAction]
// > | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const [state, dispatch] = useReducer(AuthReducer, null)
  const [user, setUser] = useState<AuthState>(null)
  const { data } = authClient.useSession()

  useEffect(() => {
    setUser(data?.user || null)
  }, [data])

  return (
    <AuthContext.Provider value={user}>
      {/* <AuthDispatchContext.Provider value={dispatch}> */}
      {children}
      {/* </AuthDispatchContext.Provider> */}
    </AuthContext.Provider>
  )
}

export const useAuth = () => use(AuthContext)
// export const useAuthDispatch = () => {
//   const dispatch = use(AuthDispatchContext)
//   if (dispatch === null) {
//     throw new Error("useAuthDispatch must be used within an AuthProvider")
//   }
//
//   return dispatch
// }
