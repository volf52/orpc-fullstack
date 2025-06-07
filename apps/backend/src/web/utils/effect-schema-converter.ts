import type { AnySchema } from "@orpc/contract"
import type {
  ConditionalSchemaConverter,
  JSONSchema,
  SchemaConvertOptions,
} from "@orpc/openapi"
import type { Promisable } from "type-fest"
import { Schema as S, JSONSchema as J } from "effect"

export class EffectSchemaConverter implements ConditionalSchemaConverter {
  condition(
    schema: AnySchema | undefined,
    options: SchemaConvertOptions,
  ): Promisable<boolean> {
    return schema !== undefined && schema["~standard"].vendor === "effect"
  }
  convert(
    schema: AnySchema | undefined,
    options: SchemaConvertOptions,
  ): Promisable<[required: boolean, jsonSchema: JSONSchema]> {
    const effectSchema = schema

    // @ts-expect-error
    const asJson = J.make(schema)
    console.debug(asJson)

    return [true, asJson as JSONSchema]
  }
}
