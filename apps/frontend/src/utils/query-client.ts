import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { QueryClient } from "@tanstack/react-query"

const orpcSerializer = new StandardRPCJsonSerializer({
  customJsonSerializers: [],
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      // refetchOnWindowFocus: process.env.NODE_ENV === "production",
    },
    mutations: {
      throwOnError: false, // Never throw errors for mutations
    },

    // The config below is to allow working with tanstack query hydration (SSR)
    // https://orpc.unnoq.com/docs/integrations/tanstack-query#hydration
    dehydrate: {
      serializeData: (data) => {
        const [json, meta] = orpcSerializer.serialize(data)
        return { json, meta }
      },
    },
    hydrate: {
      deserializeData: (data) =>
        orpcSerializer.deserialize(data.json, data.meta),
    },
  },
})
