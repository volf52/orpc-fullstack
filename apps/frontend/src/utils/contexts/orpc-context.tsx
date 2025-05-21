"use client"

import { createORPCReactQueryUtils, type RouterUtils } from "@orpc/react-query"
import { type ContractClient, orpcClient } from "../orpc"
import { createContext, use } from "react"

type ORPCReactUtils = RouterUtils<ContractClient>

const orpc = createORPCReactQueryUtils(orpcClient)

export const ORPCCOntext = createContext<ORPCReactUtils | null>(null)

export const ORPCProvider = ({ children }: { children: React.ReactNode }) => (
  <ORPCCOntext.Provider value={orpc}>{children}</ORPCCOntext.Provider>
)

export const useORPC = (): ORPCReactUtils => {
  const orpc = use(ORPCCOntext)

  if (!orpc) {
    throw new Error("ORPC context is not provided")
  }

  return orpc
}
