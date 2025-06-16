import { OpenAPIGenerator } from "@orpc/openapi"
import { ZodToJsonSchemaConverter } from "@orpc/zod"
import { router } from "@/web/router"

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
})

const specs = await generator.generate(router, {})

console.log("Specs", specs)
