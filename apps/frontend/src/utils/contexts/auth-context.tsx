"use client"

import type { User } from "@repo/contract/schemas"
import {
  type ActionDispatch,
  createContext,
  useContext,
  useReducer,
} from "react"

type AuthState = User | null
type AuthAction = { type: "SET_USER"; payload: User } | { type: "LOGOUT" }

const AuthReducer = (_state: User | null, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGOUT": {
      return null
    }
    case "SET_USER": {
      return action.payload
    }
  }
}

const AuthContext = createContext<AuthState>(null)
const AuthDispatchContext = createContext<ActionDispatch<
  [action: AuthAction]
> | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, null)

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export const useAuthDispatch = () => {
  const dispatch = useContext(AuthDispatchContext)
  if (dispatch === null) {
    throw new Error("useAuthDispatch must be used within an AuthProvider")
  }

  return dispatch
}
