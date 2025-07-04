import { authenticated } from "../utils/orpc"

const base = authenticated.groceryList

const getListByIdHandler = base.getListById.handler(async ({ input }) => {
  throw new Error("Not implemented yet")
})

const getRecentListsHandler = base.getRecentLists.handler(async () => {
  throw new Error("Not implemented yet")
})

const getStatsHandler = base.getStats.handler(async () => {
  throw new Error("Not implemented yet")
})

export default base.router({
  getListById: getListByIdHandler,
  getRecentLists: getRecentListsHandler,
  getStats: getStatsHandler,
})
