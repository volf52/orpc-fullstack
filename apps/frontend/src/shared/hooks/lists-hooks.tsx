import { orpc } from "@app/shared/orpc"
import {
  type QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "../toast"

type Params = {
  limit?: number
  page?: number
  search?: string
  status?: "active" | "inactive"
}

const listsQueryOptions = (params: Params = {}) => {
  return orpc.authenticated.groceryList.getLists.queryOptions({
    input: {
      pagination: {
        limit: params.limit ?? 10,
        page: params.page ?? 1,
      },
      filters: {
        search: params.search,
        status: params.status,
      },
    },
  })
}

const listQueryOptions = (id: string) =>
  orpc.authenticated.groceryList.getListById.queryOptions({
    input: { params: { id } },
  })

export const prefetchList = (queryClient: QueryClient, id: string) =>
  queryClient.ensureQueryData(listQueryOptions(id))
export const useList = (id: string) => useSuspenseQuery(listQueryOptions(id))

export const prefetchLists = (queryClient: QueryClient, params: Params = {}) =>
  queryClient.ensureQueryData(listsQueryOptions({ ...params }))

export const useLists = (params: Params = {}) =>
  useSuspenseQuery(listsQueryOptions(params))

export const useNewListMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: "/lists/new" })

  const listsKey = orpc.authenticated.groceryList.getLists.key()

  const mutOpts =
    orpc.authenticated.groceryList.createGroceryList.mutationOptions({
      throwOnError: false,
      onError: (err) => {
        toast.error({
          title: "Failed to create grocery list",
          message: err.message,
        })
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({
          queryKey: listsKey,
        })
        queryClient.setQueryData(
          orpc.authenticated.groceryList.getListById.key({
            input: { params: { id: data.id } },
          }),
          data,
        )
        toast.success({ message: `List ${data.name} created successfully!` })
        await navigate({
          to: `/lists/${data.id}`,
          from: "/lists/new",
          replace: false,
        })
      },
    })

  return useMutation(mutOpts, queryClient)
}

export const useUpdateListMutation = () => {
  const queryClient = useQueryClient()

  const mutOpts =
    orpc.authenticated.groceryList.updateGroceryList.mutationOptions({
      throwOnError: false,
      onError: (err) => {
        toast.error({
          title: "Failed to update grocery list",
          message: err.message,
        })
      },
      onSuccess: async (data) => {
        // Update the specific list query cache
        queryClient.setQueryData(
          orpc.authenticated.groceryList.getListById.key({
            input: { params: { id: data.id } },
          }),
          data,
        )

        // Invalidate the lists query to refresh the list view
        await queryClient.invalidateQueries({
          queryKey: orpc.authenticated.groceryList.getLists.key(),
        })

        toast.success({ message: `List ${data.name} updated successfully!` })
      },
    })

  return useMutation(mutOpts, queryClient)
}

export const useDeleteListMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: "/lists/$id" })

  const mutOpts =
    orpc.authenticated.groceryList.deleteGroceryList.mutationOptions({
      throwOnError: false,
      onError: (err) => {
        toast.error({
          title: "Failed to delete grocery list",
          message: err.message,
        })
      },
      onSuccess: async (data) => {
        toast.success({ message: "List deleted successfully!" })

        queryClient.removeQueries({
          queryKey: orpc.authenticated.groceryList.getListById.key({
            input: { params: { id: data.id } },
          }),
        })
        queryClient.invalidateQueries({
          queryKey: orpc.authenticated.groceryList.getLists.key(),
        })

        await navigate({ to: "/lists" })
      },
    })

  return useMutation(mutOpts, queryClient)
}
