import { Result } from "@carbonteq/fp"
import { GroceryListCreateSchema } from "@domain/grocery-list/grocery-list.entity"
import { ComposeUtils } from "@domain/utils/compose.utils"
import { zodErrorToValidationError } from "@domain/utils/zod/error-mapper"

// const effectSchema = S.Struct({
//   bar: S.String.pipe(S.minLength(3)),
//   foo: S.BooleanFromString,
//   baz: S.Number,
//   bb: S.Struct({ nested: S.Date }),
// })
const res = GroceryListCreateSchema.safeParse({
  description: "Valid description",
  // Missing required 'name' field
})

if (res.success) {
  console.debug("Decoded successfully", res.data)
} else {
  const parsed = zodErrorToValidationError(res.error)
  console.debug("Parsed issues", parsed.issues)
}

const r = Result.Ok({ a: 1, b: 2, foo: "a" }).map(
  ComposeUtils.mergeMul({ a: 3 }, { b: 4 }, { c: 2 }),
)

console.debug(r)
