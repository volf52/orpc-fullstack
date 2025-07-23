import { ListDetailsPage } from "@app/pages/lists/details-page"
import { prefetchList } from "@app/shared/hooks/lists-hooks"
import { createFileRoute } from "@tanstack/react-router"

const ListDetailPageWrapper = () => {
  const { id } = Route.useParams()

  return <ListDetailsPage id={id} />
}

export const Route = createFileRoute("/_private/lists/$id/")({
  component: ListDetailPageWrapper,
  head: () => ({ meta: [{ title: "List Detail" }] }),
  loader: async ({ context, params }) => {
    const { queryClient } = context

    await prefetchList(queryClient, params.id)
  },
})
