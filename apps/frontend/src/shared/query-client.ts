import { StandardRPCJsonSerializer } from "@orpc/client/standard"
import { QueryClient } from "@tanstack/react-query"

const orpcSerializer = new StandardRPCJsonSerializer({
  customJsonSerializers: [],
})

export const getQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 120 * 1000, // 2 minute
        refetchOnWindowFocus: false,
      },
      mutations: {
        throwOnError: false, // Never throw errors for mutations, instead handle them in the component
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

  return queryClient
}
