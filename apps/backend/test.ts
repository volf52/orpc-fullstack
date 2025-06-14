import { router } from "@/web/router"
import { OpenAPIGenerator } from "@orpc/openapi"
import { experimental_ZodToJsonSchemaConverter } from "@orpc/zod/zod4"
import { ZodToJsonSchemaConverter } from "@orpc/zod"

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
})

const specs = await generator.generate(router, {

})

console.log("Specs", specs)

