import { ListUpdatePage } from "@app/pages/lists/update-page"
import { prefetchList } from "@app/shared/hooks/lists-hooks"
import { createFileRoute } from "@tanstack/react-router"

const ListUpdatePageWrapper = () => {
  const { id } = Route.useParams()

  return <ListUpdatePage id={id} />
}

export const Route = createFileRoute("/_private/lists/$id/edit")({
  component: ListUpdatePageWrapper,
  head: () => ({ meta: [{ title: "Edit List" }] }),
  loader: async ({ context, params }) => {
    const { queryClient } = context

    await prefetchList(queryClient, params.id)
  },
})
