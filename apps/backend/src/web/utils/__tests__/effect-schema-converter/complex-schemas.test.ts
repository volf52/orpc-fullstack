import { describe, expect, test } from "bun:test"
import { Schema as S } from "effect"
import { convertEffectSchemaToOpenAPI } from "../../effect-schema-converter"

describe("Effect Schema Converter - Complex Real-World Schemas", () => {
  describe("API Schemas", () => {
    test("should convert User API schema", () => {
      const UserSchema = S.Struct({
        id: S.Number.pipe(S.int(), S.positive()),
        email: S.String.pipe(S.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
        name: S.String.pipe(S.minLength(1), S.maxLength(100)),
        age: S.optional(S.Number.pipe(S.int(), S.between(0, 150))),
        isActive: S.Boolean,
        roles: S.Array(
          S.Union(
            S.Literal("admin"),
            S.Literal("user"),
            S.Literal("moderator"),
          ),
        ),
        profile: S.optional(
          S.Struct({
            bio: S.optional(S.String.pipe(S.maxLength(500))),
            avatar: S.optional(S.String.pipe(S.pattern(/^https?:\/\/.+/))),
            preferences: S.Struct({
              theme: S.Union(S.Literal("light"), S.Literal("dark")),
              notifications: S.Boolean,
              language: S.String.pipe(S.length(2)),
            }),
          }),
        ),
        createdAt: S.String,
        updatedAt: S.String,
      }).annotations({
        title: "User",
        description: "A user in the system",
      })

      const result = convertEffectSchemaToOpenAPI(UserSchema)

      expect(result).toEqual({
        type: "object",
        title: "User",
        description: "A user in the system",
        properties: {
          id: {
            type: "integer",
            minimum: 0,
            exclusiveMinimum: true,
          },
          email: {
            type: "string",
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
          },
          name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
          },
          age: {
            type: "integer",
            minimum: 0,
            maximum: 150,
          },
          isActive: {
            type: "boolean",
          },
          roles: {
            type: "array",
            items: {
              type: "string",
              enum: ["admin", "user", "moderator"],
            },
          },
          profile: {
            type: "object",
            properties: {
              bio: {
                type: "string",
                maxLength: 500,
              },
              avatar: {
                type: "string",
                pattern: "^https?:\\/\\/.+",
              },
              preferences: {
                type: "object",
                properties: {
                  theme: {
                    type: "string",
                    enum: ["light", "dark"],
                  },
                  notifications: {
                    type: "boolean",
                  },
                  language: {
                    type: "string",
                    minLength: 2,
                    maxLength: 2,
                  },
                },
                required: ["theme", "notifications", "language"],
              },
            },
            required: ["preferences"],
          },
          createdAt: {
            type: "string",
          },
          updatedAt: {
            type: "string",
          },
        },
        required: [
          "id",
          "email",
          "name",
          "isActive",
          "roles",
          "createdAt",
          "updatedAt",
        ],
      })
    })

    test("should convert Product API schema", () => {
      const ProductSchema = S.Struct({
        id: S.String.pipe(
          S.pattern(
            /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/,
          ),
        ),
        name: S.String.pipe(S.minLength(1), S.maxLength(200)),
        description: S.optional(S.String.pipe(S.maxLength(1000))),
        price: S.Number.pipe(S.positive()),
        currency: S.Union(S.Literal("USD"), S.Literal("EUR"), S.Literal("GBP")),
        category: S.Struct({
          id: S.Number.pipe(S.int(), S.positive()),
          name: S.String,
          slug: S.String.pipe(S.pattern(/^[a-z0-9-]+$/)),
        }),
        tags: S.Array(S.String.pipe(S.minLength(1))),
        inStock: S.Boolean,
        inventory: S.Struct({
          quantity: S.Number.pipe(S.int(), S.greaterThanOrEqualTo(0)),
          reserved: S.Number.pipe(S.int(), S.greaterThanOrEqualTo(0)),
          threshold: S.optional(S.Number.pipe(S.int(), S.positive())),
        }),
        variants: S.optional(
          S.Array(
            S.Struct({
              id: S.String,
              name: S.String,
              price: S.optional(S.Number.pipe(S.positive())),
              attributes: S.Record({
                key: S.String,
                value: S.Union(S.String, S.Number, S.Boolean),
              }),
            }),
          ),
        ),
        metadata: S.optional(S.Record({ key: S.String, value: S.String })),
      }).annotations({
        title: "Product",
        description: "A product in the e-commerce system",
      })

      const result = convertEffectSchemaToOpenAPI(ProductSchema)

      expect(result.type).toBe("object")
      expect(result.title).toBe("Product")
      expect(result.description).toBe("A product in the e-commerce system")
      expect(result.properties?.id).toEqual({
        type: "string",
        pattern:
          "^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$",
      })
      expect(result.required).toContain("id")
      expect(result.required).toContain("name")
      expect(result.required).toContain("price")
      expect(result.required).not.toContain("description")
      expect(result.required).not.toContain("variants")
    })

    test("should convert API Response schema with pagination", () => {
      const PaginatedResponseSchema = S.Struct({
        data: S.Array(
          S.Struct({
            id: S.Number,
            title: S.String,
            excerpt: S.optional(S.String),
          }),
        ),
        pagination: S.Struct({
          page: S.Number.pipe(S.int(), S.positive()),
          limit: S.Number.pipe(S.int(), S.between(1, 100)),
          total: S.Number.pipe(S.int(), S.greaterThanOrEqualTo(0)),
          totalPages: S.Number.pipe(S.int(), S.greaterThanOrEqualTo(0)),
          hasNext: S.Boolean,
          hasPrev: S.Boolean,
        }),
        meta: S.optional(
          S.Struct({
            requestId: S.String,
            timestamp: S.String,
            version: S.String,
          }),
        ),
      }).annotations({
        title: "Paginated Response",
        description: "A paginated API response",
      })

      const result = convertEffectSchemaToOpenAPI(PaginatedResponseSchema)

      expect(result.type).toBe("object")
      expect(result.properties?.pagination?.properties?.limit).toEqual({
        type: "integer",
        minimum: 1,
        maximum: 100,
      })
    })
  })

  describe("Configuration Schemas", () => {
    test("should convert application config schema", () => {
      const ConfigSchema = S.Struct({
        server: S.Struct({
          port: S.Number.pipe(S.int(), S.between(1, 65535)),
          host: S.String,
          ssl: S.optional(
            S.Struct({
              enabled: S.Boolean,
              cert: S.String,
              key: S.String,
            }),
          ),
        }),
        database: S.Struct({
          type: S.Union(
            S.Literal("postgres"),
            S.Literal("mysql"),
            S.Literal("sqlite"),
          ),
          host: S.String,
          port: S.Number.pipe(S.int(), S.positive()),
          database: S.String,
          username: S.String,
          password: S.String,
          pool: S.optional(
            S.Struct({
              min: S.Number.pipe(S.int(), S.greaterThanOrEqualTo(0)),
              max: S.Number.pipe(S.int(), S.positive()),
              idle: S.Number.pipe(S.int(), S.positive()),
            }),
          ),
        }),
        redis: S.optional(
          S.Struct({
            host: S.String,
            port: S.Number.pipe(S.int(), S.positive()),
            password: S.optional(S.String),
            db: S.Number.pipe(S.int(), S.between(0, 15)),
          }),
        ),
        logging: S.Struct({
          level: S.Union(
            S.Literal("error"),
            S.Literal("warn"),
            S.Literal("info"),
            S.Literal("debug"),
          ),
          format: S.Union(S.Literal("json"), S.Literal("text")),
          outputs: S.Array(
            S.Union(
              S.Literal("console"),
              S.Literal("file"),
              S.Literal("syslog"),
            ),
          ),
        }),
      })

      const result = convertEffectSchemaToOpenAPI(ConfigSchema)

      expect(result.type).toBe("object")
      expect(result.properties?.server?.properties?.port).toEqual({
        type: "integer",
        minimum: 1,
        maximum: 65535,
      })
      expect(result.properties?.database?.properties?.type).toEqual({
        type: "string",
        enum: ["postgres", "mysql", "sqlite"],
      })
    })
  })

  describe("Error handling", () => {
    test("should handle unsupported schema types gracefully", () => {
      // Test with a schema that might not be fully supported yet
      const schema = S.Struct({
        data: S.String,
      })

      expect(() => convertEffectSchemaToOpenAPI(schema)).not.toThrow()
    })
  })
})
