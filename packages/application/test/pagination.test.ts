import { describe, expect, test } from "bun:test"
import {
  calculateOffset,
  createPaginatedResult,
  PaginationParamsSchema,
} from "../src/utils/pagination.utils"

describe("Pagination Utils", () => {
  describe("PaginationParamsSchema", () => {
    test("should validate correct pagination params", () => {
      const validParams = {
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "asc" as const,
      }

      const result = PaginationParamsSchema.safeParse(validParams)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validParams)
      }
    })

    test("should apply default values", () => {
      const minimalParams = {}

      const result = PaginationParamsSchema.safeParse(minimalParams)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(10)
        expect(result.data.sortOrder).toBe("asc")
      }
    })

    test("should reject invalid params", () => {
      const invalidParams = {
        page: 0,
        limit: 101,
        sortOrder: "invalid",
      }

      const result = PaginationParamsSchema.safeParse(invalidParams)
      expect(result.success).toBe(false)
    })
  })

  describe("createPaginatedResult", () => {
    test("should create correct paginated result", () => {
      const items = [1, 2, 3, 4, 5]
      const totalCount = 20
      const page = 2
      const limit = 5

      const result = createPaginatedResult(items, totalCount, page, limit)

      expect(result).toEqual({
        items: [1, 2, 3, 4, 5],
        totalCount: 20,
        page: 2,
        limit: 5,
        totalPages: 4,
        hasNext: true,
        hasPrevious: true,
      })
    })

    test("should handle first page", () => {
      const items = [1, 2, 3]
      const result = createPaginatedResult(items, 10, 1, 3)

      expect(result.hasNext).toBe(true)
      expect(result.hasPrevious).toBe(false)
    })

    test("should handle last page", () => {
      const items = [10]
      const result = createPaginatedResult(items, 10, 4, 3)

      expect(result.hasNext).toBe(false)
      expect(result.hasPrevious).toBe(true)
    })
  })

  describe("calculateOffset", () => {
    test("should calculate correct offset", () => {
      expect(calculateOffset(1, 10)).toBe(0)
      expect(calculateOffset(2, 10)).toBe(10)
      expect(calculateOffset(3, 5)).toBe(10)
    })
  })
})
