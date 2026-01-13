// // biome-ignore lint/suspicious/noExplicitAny: Better type inference
// type Merged<U extends Record<string, any>[]> = U extends [
//   infer First,
//   ...infer Rest,
// ]
//   ? // biome-ignore lint/suspicious/noExplicitAny: Better type inference
//     First extends Record<string, any>
//     ? // biome-ignore lint/suspicious/noExplicitAny: Better type inference
//       Rest extends Record<string, any>[]
//       ? First & Merged<Rest>
//       : First
//     : // biome-ignore lint/suspicious/noExplicitAny: Better type inference
//       Merged<Rest extends Record<string, any>[] ? Rest : []>
//   : // biome-ignore lint/complexity/noBannedTypes: Intentionally handle empty array
//     {}

type Merged<U extends object[]> = U extends [
  infer F extends object,
  ...infer R extends object[],
]
  ? F & Merged<R>
  : // biome-ignore lint/complexity/noBannedTypes: Intentionally handle empty array
    {}

// simpleMergeMul requires no direct type utils, making it more performant
// but with the coming tsgo compiler, it is probably not necessary
// Putting it here for reference, but not using it in the codebase

// biome-ignore lint/suspicious/noExplicitAny: better type inference
type Rec = Record<string, any>
function _simpleMergeMul<A extends Rec>(a: A): <T extends Rec>(base: T) => T & A
function _simpleMergeMul<A extends Rec, B extends Rec>(
  a: A,
  b: B,
): <T extends Rec>(base: T) => T & A & B
function _simpleMergeMul<A extends Rec, B extends Rec, C extends Rec>(
  a: A,
  b: B,
  c: C,
): <T extends Rec>(base: T) => T & A & B & C
function _simpleMergeMul(...args: Rec[]) {
  return <T extends Rec>(base: T) => {
    const merged = { ...base }

    for (const arg of args) {
      for (const key in arg) {
        // @ts-expect-error don't worry about it
        merged[key] = arg[key]
      }
    }

    return merged
  }
}

export const ComposeUtils = {
  merge:
    <U extends Record<string, unknown>>(toAdd: U) =>
    <T extends Record<string, unknown>>(base: T): T & U => ({
      ...base,
      ...toAdd,
    }),

  mergeMul:
    // biome-ignore lint/suspicious/noExplicitAny: Better type inference
    <U extends Record<string, any>[], M = Merged<U>>(...toAdd: U) =>
      <T extends Record<string, unknown>>(base: T): T & M => {
        const merged = Object.assign({}, base, ...toAdd) as T & M

        return merged
      },
} as const
