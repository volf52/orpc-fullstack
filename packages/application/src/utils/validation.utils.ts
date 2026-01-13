import { Result } from "@carbonteq/fp"
import type { ValidationError } from "@domain/utils/base.errors"
import { zodErrorToValidationError } from "@domain/utils/zod/error-mapper"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import { z } from "zod/v4"

export const validateWithZod = <Schema extends z.ZodTypeAny>(
  schema: Schema,
  data: unknown,
) => {
  const result = schema.safeParse(data)
  if (result.success) {
    return Result.Ok(result.data)
  }

  return Result.Err(zodErrorToValidationError(result.error))
}

type DtoSchemaInput<T, Schema extends z.ZodTypeAny> = {
  schema: Schema
  create: (data: unknown) => Result<T, ValidationError>
}

type DtoSchemaOutput<T, In> = StandardSchemaV1<In, T>

type TSimpleDto<_Name extends string, Dto> = Dto

// Ensures that DTOs are only created through the static `create` method, also prevents bypassing validation via subclassing
const RuntimeValidationToken = Symbol.for("EnsureValidationThroughCreation")

export const simpleSchemaDto = <Name extends string, Schema extends z.ZodTypeAny>(
  className: Name,
  schema: Schema,
) => {
  class SimpleDto {
    static readonly schema = schema

    protected constructor(
      readonly data: z.output<Schema>,
      token: typeof RuntimeValidationToken,
    ) {
      if (token !== RuntimeValidationToken) {
        throw new Error(
          `${className} should only be instantiated through the static create method. Use ${className}.create(input) to create a valid instance.`,
        )
      }
    }

    static create(
      input: unknown,
    ): Result<TSimpleDto<Name, SimpleDto>, ValidationError> {
      return validateWithZod(schema, input).map(
        // biome-ignore lint/complexity/noThisInStatic: Intentional factory
        (validatedData) => new this(validatedData, RuntimeValidationToken),
      )
    }
  }

  if (className) {
    Object.defineProperty(SimpleDto, "name", { value: className })
  }

  return SimpleDto
}

export const dtoStandardSchema = <T, Schema extends z.ZodTypeAny>(
  dtoConst: DtoSchemaInput<T, Schema>,
): DtoSchemaOutput<T, z.input<Schema>> => {
  return {
    "~standard": {
      vendor: "zod",
      version: 1,
      validate: (data: unknown): StandardSchemaV1.Result<T> => {
        const result = dtoConst.create(data)

        if (result.isOk()) {
          return { value: result.unwrap() }
        }

        const err = result.unwrapErr()
        const issues = err.issues.map(
          (issue) =>
            ({
              message: issue.message,
              path: issue.path,
            }) satisfies StandardSchemaV1.Issue,
        )

        return { issues }
      },
    } satisfies StandardSchemaV1.Props<z.input<Schema>, T>,
  }
}

export const zodStandardSchemaV1 = <Schema extends z.ZodTypeAny>(
  schema: Schema,
): StandardSchemaV1<z.input<Schema>, z.output<Schema>> => {
  return {
    "~standard": {
      vendor: "zod",
      version: 1,
      validate: (data: unknown) => {
        const result = schema.safeParse(data)
        if (result.success) {
          return { value: result.data }
        }

        const issues = result.error.issues.map(
          (issue) =>
            ({
              message: issue.message,
              path: issue.path.map((part) => part.toString()),
            }) satisfies StandardSchemaV1.Issue,
        )

        return { issues }
      },
    },
  }
}
