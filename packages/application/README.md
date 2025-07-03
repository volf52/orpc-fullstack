# Application Layer

This package contains the application layer of the project, implementing the application services and workflows that orchestrate business operations.

## Architecture Overview

The application layer follows a clear separation between **Services** and **Workflows**:

- **Services**: Entity-focused business logic, handle domain object transformations and repository interactions
- **Workflows**: HTTP-layer orchestration, meant to be called directly by route handlers

This separation ensures clean architecture while avoiding over-engineering and unnecessary abstractions.

## Structure

```
src/
├── services/          # Application services (entity-focused logic)
├── workflows/         # HTTP-layer orchestration
├── types/            # Common application types
├── dtos/             # Data Transfer Objects with validation
└── utils/            # Validation, mapping, and result utilities
```

## Key Concepts

### Services (Entity-Focused Logic)
Application services contain entity-focused business logic and are closer to the domain layer. They handle:
- Entity-focused/domain-focused business logic
- Domain object transformations and business rule validation
- Repository interactions and data serialization/encoding
- Return `Result<T, DomainError>` types (NOT ApplicationResult)

Services focus on domain operations and return domain-level Results that workflows can then convert to ApplicationResults.

Example:
```typescript
export class GroceryListAppService {
  constructor(private readonly groceryListRepo: GroceryListRepository) {}

  async findGroceryListsForUser(
    user: UserEntity,
  ): Promise<Result<{ lists: GroceryListEncoded[] }, ValidationError>> {
    const lists = await this.groceryListRepo.findByUserId(user.id)

    const listsEncoded = Result.all(...lists.map(serialized))
      .mapErr(parseErrorsToValidationError)
      .map((lists) => ({ lists }))

    return listsEncoded
  }
}
```

### Workflows (HTTP-Layer Orchestration)
Workflows handle HTTP-layer business logic and orchestration. They are meant to be called directly by route handlers and handle:
- Request/response formatting, auth/authorization, input validation
- Orchestrate service calls and convert Results to ApplicationResults
- Return `ApplicationResult<T>` types (wrapping service Result types)
- Example: `return ApplicationResult.fromResult(await service.method())`

Workflows focus on HTTP concerns and convert domain Results to ApplicationResults for consistent API error handling.

Example:
```typescript
export class GroceryListWorkflow {
  private readonly groceryListService: GroceryListAppService

  constructor(
    private readonly groceryListRepo: GroceryListRepository,
    private readonly userRepo: UserRepository,
    private readonly itemRepo: ItemRepository,
  ) {
    this.groceryListService = new GroceryListAppService(groceryListRepo)
  }

  async listGroceryListsForUser(user: UserEntity) {
    const result = await this.groceryListService.findGroceryListsForUser(user)
    return ApplicationResult.fromResult(result)
  }
}
```

### DTOs and Validation
DTOs follow the "creation is validation" approach and are kept simple and focused on API contracts:
- All inputs are validated using domain entity schemas at creation time
- DTOs are immutable once created, ensuring data integrity
- Domain schemas from the domain layer are composed into application DTOs
- Static `create()` methods handle validation and return `Result<DTO, ValidationError>`

Example:
```typescript
export class CreateGroceryListDto implements GroceryListCreateData {
  readonly name: string
  readonly description: string

  private constructor(data: GroceryListCreateData) {
    this.name = data.name
    this.description = data.description
  }

  static create(data: unknown): Result<CreateGroceryListDto, ValidationError> {
    return validateWithEffect(GroceryListCreateSchema, data).map(
      (validatedData) => new CreateGroceryListDto(validatedData),
    )
  }
}
```

### Error Handling

The application layer uses a two-tier error handling system:

1. **Services return Result**: Services return domain `Result<T, Error>` types
2. **Workflows return ApplicationResult**: Workflows wrap service results in `ApplicationResult<T>`

All workflows return `ApplicationResult<T>` which provides consistent HTTP-layer error handling:

```typescript
// ApplicationResult is a wrapper around Result<T, AppError>
class ApplicationResult<T> {
  isOk(): boolean
  isErr(): boolean
  unwrap(): T                    // Get value (throws if error)
  safeUnwrap(): T | null        // Get value safely
  unwrapErr(): AppError         // Get error (throws if ok)
  map<U>(fn: (val: T) => U): ApplicationResult<U>
  flatMap<U>(f: (r: T) => Result<U, AppError>): ApplicationResult<U>

  static Ok<T>(val: T): ApplicationResult<T>
  static Err(err: Error): ApplicationResult<never>
  static fromResult<T, E extends Error>(result: Result<T, E>): ApplicationResult<T>
}

// Usage examples:
const result = await workflow.listGroceryListsForUser(user)

if (result.isOk()) {
  const groceryLists = result.unwrap()
  // handle success
} else {
  const error = result.unwrapErr()
  console.error(error.message)
  // handle error based on error.status
}
```

The `ApplicationResult.fromResult()` method automatically converts domain errors to appropriate HTTP status codes via the `AppError.fromErr()` mapping function.

## Usage

```typescript
import { GroceryListWorkflow, CreateGroceryListDto } from "@repo/application"

const workflow = new GroceryListWorkflow(
  groceryListRepo,
  userRepo,
  itemRepo
)

// DTO creation with validation
const dtoResult = CreateGroceryListDto.create({
  name: "Weekly Shopping",
  description: "Groceries for the week"
})

if (dtoResult.isOk()) {
  const dto = dtoResult.unwrap()
  const result = await workflow.createGroceryList(dto)

  if (result.isOk()) {
    console.log("Created list:", result.unwrap())
  } else {
    console.error("Error:", result.unwrapErr().message)
  }
} else {
  console.error("Validation error:", dtoResult.unwrapErr().message)
}
```

## Design Principles

1. **Clean Architecture without Over-Engineering**: Maintain clear separation between layers while avoiding unnecessary abstractions
2. **Services vs Workflows**: Clear distinction between entity-focused logic (services) and HTTP-layer orchestration (workflows)
3. **Pragmatic Error Handling**: Two-tier system with domain Results and HTTP ApplicationResults
4. **Validation at Creation**: DTOs validate data at creation time, ensuring immutability and data integrity
5. **Simplicity and Maintainability**: Focus on readable, maintainable code over complex patterns
6. **Performance Considerations**: Efficient data transformations and minimal overhead in the application layer

The goal is to keep the code simple and maintainable while still adhering to clean architecture principles. If it makes more sense to return data directly from a service instead of having to define a method in a workflow, do that. The architecture should serve the code, not the other way around.
