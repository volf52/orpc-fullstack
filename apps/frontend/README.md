# Frontend - React + TanStack

A modern, type-safe React application built with the TanStack ecosystem, featuring SSR, type-safe API communication, and excellent developer experience.

## 🛠 Tech Stack

### Core
- **React 19.2** - UI framework with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite 7** - Fast build tool and dev server

### TanStack Ecosystem
- **@tanstack/react-router** - Type-safe file-based routing with SSR
- **@tanstack/react-query** - Server state management
- **@tanstack/react-form** - Type-safe form handling
- **@tanstack/react-start** - SSR framework integration
- **@tanstack/react-table** - Headless table component

### UI & Styling
- **Mantine 8.3.9** - Comprehensive component library
- **LightningCSS** - High-performance CSS processing

### Data & API
- **ORPC** - End-to-end type-safe RPC
- **ArkType** - Runtime type validation
- **Zustand** - Lightweight state management

### Development
- **React Compiler** - Automatic optimization
- **Biome** - Linting and formatting
- **Oxlint** - Fast linter
- **MSW** - API mocking for testing

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
src/
├── app/                    # App-specific pages and layouts
│   └── pages/             # Page components
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── LogoutBtn.tsx
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── stats/
│   │   ├── recent-lists/
│   │   └── quick-actions/
│   ├── layout/           # Layout and wrapper components
│   │   ├── DefaultErrorBoundary.tsx
│   │   ├── PageNotFound.tsx
│   │   └── PageSuspenseFallback.tsx
│   ├── lists/            # List management components
│   │   ├── ListCard.tsx
│   │   ├── list-form-card.tsx
│   │   └── item-manager.tsx
│   └── shared/           # Shared utility components
│       └── ListCard.tsx
├── routes/               # TanStack Router file-based routing
│   ├── __root.tsx        # Root layout and providers
│   ├── _private/         # Protected routes (requires auth)
│   │   ├── index.tsx     # Dashboard
│   │   └── lists/        # List management
│   └── _public/          # Public routes
│       └── auth/         # Authentication pages
├── shared/               # Shared utilities and configurations
│   ├── auth-client.ts    # Better Auth client configuration
│   ├── hooks/            # Custom React hooks
│   │   └── auth-hooks.tsx
│   ├── orpc.ts           # ORPC client setup
│   ├── query-client.ts   # TanStack Query configuration
│   ├── schemas/          # ArkType form schemas
│   │   ├── auth.ts
│   │   └── list.ts
│   ├── seo.ts            # SEO utilities
│   └── toast.ts          # Toast notification utilities
├── providers.tsx         # React context providers
├── router.tsx            # Router factory
├── styles.css            # Global styles
├── types.ts              # Global type definitions
└── vite-env.d.ts         # Vite environment types
```

## 🧭 Routing

### File-based Routing

Routes are automatically generated from the `routes/` directory structure:

```typescript
// routes/_private/lists/$id/edit.tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_private/lists/$id/edit")({
  component: EditListPage,
  loader: async ({ params }) => {
    return orpc.lists.getById({ id: params.id })
  }
})
```

### Protected Routes

Routes under `_private/` require authentication:

```typescript
// routes/_private.tsx
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href }
      })
    }
  }
})
```

### Navigation

```typescript
import { Link } from "@tanstack/react-router"

// Navigate with type safety
<Link to="/lists/$id" params={{ id: "123" }}>
  View List
</Link>

// Programmatic navigation
const navigate = useNavigate()
navigate({ to: "/lists/new" })
```

## 🔐 Authentication

### Session Management

```typescript
import { useAuthSession, useLoginMutation } from "@app/shared/hooks/auth-hooks"

function Login() {
  const login = useLoginMutation()

  const handleSubmit = (data: LoginData) => {
    login.mutate(data)
  }
}

// Check auth state
const { data: session, isLoading } = useAuthSession()
```

### Protected Resources

```typescript
// Session is automatically included in API calls
const query = useQuery({
  queryKey: ["lists"],
  queryFn: () => orpc.lists.getAll()
})
```

## 📝 Forms

### Type-safe Forms with TanStack React Form

```typescript
import { useForm } from "@tanstack/react-form"
import { newGroceryListFormSchema } from "@app/shared/schemas/list"

function NewListForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      items: []
    },
    onSubmit: async ({ value }) => {
      // Type-safe - value conforms to schema
      await orpc.lists.create(value)
    }
  })

  return (
    <form>
      <form.Field name="name">
        {(field) => (
          <input
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
    </form>
  )
}
```

### Schema Validation with ArkType

```typescript
// src/shared/schemas/list.ts
import { type } from "arktype"

export const newListSchema = type({
  name: "string>=2",
  items: type({
    name: "string>=1",
    quantity: "number.integer>0"
  }).array()
})

// Type inference
type NewList = typeof newListSchema.infer
```

## 🔄 Data Fetching

### Server State with TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@app/shared/orpc"

// Fetching data
function ListsPage() {
  const { data: lists, isLoading } = useQuery({
    queryKey: ["lists"],
    queryFn: () => orpc.lists.getAll(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Mutating data
function CreateListButton() {
  const queryClient = useQueryClient()

  const createList = useMutation({
    mutationFn: orpc.lists.create,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["lists"] })
    }
  })
}
```

### Type-safe API Calls with ORPC

```typescript
// Full type safety - autocompletion and type checking
const user = await orpc.users.getById({ id: "123" })
const lists = await orpc.lists.getAll({ search: "grocery" })

// Error handling is built-in
try {
  const result = await orpc.lists.create(listData)
  // result is typed
} catch (error) {
  // error is typed
}
```

## 🎨 UI Components

### Using Mantine

```typescript
import {
  Button,
  Container,
  Stack,
  Group,
  Title
} from "@mantine/core"

function Page() {
  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title>My Lists</Title>
          <Button>Create New</Button>
        </Group>
      </Stack>
    </Container>
  )
}
```

### Creating Reusable Components

```typescript
// components/shared/ListCard.tsx
interface ListCardProps {
  list: List
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onEdit,
  onDelete
}) => {
  // Component implementation
}
```

## 🪝 Custom Hooks

### Creating Custom Hooks

```typescript
// hooks/useLists.ts
export const useLists = (search?: string) => {
  return useQuery({
    queryKey: ["lists", { search }],
    queryFn: () => orpc.lists.getAll({ search })
  })
}

// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

## 🌐 SSR and Data Loading

### Server-side Data Loading

```typescript
// routes/_private/lists/$id.tsx
export const Route = createFileRoute("/_private/lists/$id")({
  loader: async ({ params, context }) => {
    // Runs on server for SSR
    return context.orpc.lists.getById({ id: params.id })
  },
  component: ListPage
})

function ListPage() {
  // Data is already loaded from loader
  const list = Route.useLoaderData()
}
```

### Prefetching Data

```typescript
// Prefetch on hover
const LinkWithPrefetch = ({ to, ...props }) => {
  const router = useRouter()

  return (
    <Link
      to={to}
      onMouseEnter={() => router.prefetchRoute({ to })}
      {...props}
    />
  )
}
```

## 📦 State Management

### Server State - TanStack Query

```typescript
// Already configured in shared/query-client.ts
const queryClient = getQueryClient()

// Custom hook for specific data
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => orpc.auth.profile()
  })
}
```

### Client State - Zustand

```typescript
// stores/ui.ts
import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  theme: "light" | "dark"
  toggleSidebar: () => void
  setTheme: (theme: "light" | "dark") => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: "dark",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme })
}))
```

## 🧪 Testing

### Component Testing

```typescript
// component.test.tsx
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import MyComponent from "./MyComponent"

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

test("renders component", () => {
  const queryClient = createTestQueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  )

  expect(screen.getByText("Hello")).toBeInTheDocument()
})
```

### API Mocking with MSW

```typescript
// test/mocks.ts
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

export const handlers = [
  http.get("/api/lists", () => {
    return HttpResponse.json([{ id: "1", name: "Test List" }])
  })
]

export const server = setupServer(...handlers)
```

## 🔧 Environment Variables

Create `.env.local`:

```env
VITE_SERVER_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001/api
```

## 📝 Scripts

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run Biome linter
pnpm lint:fix         # Fix linting issues
pnpm check-types      # Type checking

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report
```

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

The build outputs to `dist/` and includes:

- Client-side bundle
- Server-side bundle for SSR
- Static assets

### Environment Setup

Production requires:

```env
VITE_SERVER_URL=https://your-api.com
VITE_API_URL=https://your-api.com/api
```

## 📚 Best Practices

### Type Safety

1. **Always type your props**:
   ```typescript
   interface Props {
     data: Item[]
     onSelect: (id: string) => void
   }
   ```

2. **Use inferred types**:
   ```typescript
   type User = typeof userSchema.infer
   ```

3. **Leverage ORPC** for API calls - no need to define types manually

### Performance

1. **Use React.memo for expensive components**:
   ```typescript
   export default React.memo(ExpensiveComponent)
   ```

2. **Implement code splitting**:
   ```typescript
   const LazyComponent = React.lazy(() => import("./HeavyComponent"))
   ```

3. **Optimize queries**:
   ```typescript
   useQuery({
     queryKey: ["data"],
     queryFn: fetchData,
     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
     select: (data) => data.items // Select only needed data
   })
   ```

### Error Handling

1. **Use error boundaries**:
   ```typescript
   <ErrorBoundary fallback={<ErrorPage />}>
     <Component />
   </ErrorBoundary>
   ```

2. **Handle API errors gracefully**:
   ```typescript
   const mutation = useMutation({
     mutationFn: apiCall,
     onError: (error) => {
       toast.error(error.message)
     }
   })
   ```

### Security

1. **Never expose secrets** - use environment variables
2. **Validate all inputs** - use ArkType schemas
3. **Use HTTPS** in production
4. **Implement CSP headers**

## 🔗 Links

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [ORPC Documentation](https://orpc.unnoq.com/)
- [Mantine Components](https://mantine.dev/)
- [Better Auth](https://better-auth.com/)
- [Vite Guide](https://vitejs.dev/)

## 🤝 Contributing

1. Follow the existing code style
2. Add types for all new code
3. Include tests for new features
4. Update documentation when needed

---

Built with ❤️ using the TanStack ecosystem
