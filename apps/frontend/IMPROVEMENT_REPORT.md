# React + TanStack Frontend Improvement Report

> Generated for apps/frontend - A modern React application using TanStack ecosystem

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Critical Issues](#critical-issues)
4. [High Priority Improvements](#high-priority-improvements)
5. [Medium Priority Enhancements](#medium-priority-enhancements)
6. [Code Quality Improvements](#code-quality-improvements)
7. [Security Enhancements](#security-enhancements)
8. [Testing Strategy](#testing-strategy)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Best Practices Already Implemented](#best-practices-already-implemented)

---

## Executive Summary

This React frontend demonstrates **excellent modern architecture** with cutting-edge technologies. The codebase shows strong technical decisions with proper type safety, SSR support, and comprehensive tooling. However, there are specific areas that can be enhanced to improve developer experience, testing coverage, and production readiness.

**Key Strengths:**
- Modern React 19 with latest features
- Full-stack TypeScript implementation
- Type-safe RPC with ORPC
- Comprehensive state management
- SSR-ready architecture

**Main Areas for Improvement:**
1. Testing infrastructure (currently missing)
2. Enhanced error handling
3. Performance optimizations
4. Security hardening

---

## Architecture Overview

### Technology Stack ✅

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.1 | UI Framework |
| **TanStack Router** | 1.140.0 | File-based routing with SSR |
| **TanStack Query** | 5.90.12 | Server state management |
| **TanStack React Form** | 1.27.1 | Type-safe forms |
| **Mantine** | 8.3.9 | UI component library |
| **Better Auth** | Latest | Authentication solution |
| **ORPC** | 1.12.2 | Type-safe RPC communication |
| **ArkType** | 2.1.28 | Runtime validation |
| **Zustand** | 5.0.9 | Client state management |
| **Vite** | 7 | Build tool and dev server |
| **React Compiler** | Latest | Automatic optimization |

### Project Structure

```
src/
├── app/                    # App-specific components
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/           # Layout components
│   ├── lists/            # List management components
│   └── shared/           # Shared utilities
├── pages/                # Page layouts
├── routes/               # TanStack Router file-based routing
│   ├── _private/         # Protected routes
│   ├── _public/          # Public routes
│   └── __root.tsx        # Root layout
├── shared/               # Shared utilities and configurations
│   ├── auth-client.ts    # Auth configuration
│   ├── hooks/            # Custom hooks
│   ├── schemas/          # Form schemas with ArkType
│   ├── orpc.ts           # ORPC client
│   └── query-client.ts   # Query client configuration
└── styles.css            # Global styles
```

---

## 🚨 Critical Issues

### 1. No Testing Infrastructure

**Current State:**
```json
"test": "echo 'no tests'" // Currently just echoes text
```

**Impact:**
- High risk of regressions
- No confidence in deployments
- Difficult to refactor safely

**Solution:**

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.0.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "msw": "^2.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

**Vitest Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*"
      ]
    }
  }
})
```

### 2. Missing Error Boundary Coverage

The current `DefaultErrorBoundary` is good but lacks error logging:

```typescript
// src/components/layout/DefaultErrorBoundary.tsx
import { useEffect } from "react"
import { Button, Container, Group, Stack, Text } from "@mantine/core"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { ErrorComponent, rootRouteId, useMatch, useRouter } from "@tanstack/react-router"

const DefaultErrorBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  // Add error logging
  useEffect(() => {
    // Log to monitoring service in production
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error)
      console.error("Application error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }
  }, [error])

  return (
    <Container
      display="flex"
      mih="50vh"
      size="sm"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Stack align="center" gap="xl">
        <Text size="xl" c="red">Something went wrong</Text>
        <Text c="dimmed">{error.message}</Text>

        <ErrorComponent error={error} />

        <Group gap="sm" wrap="wrap">
          <Button
            fw="bold"
            onClick={() => router.invalidate()}
            tt="uppercase"
            variant="light"
          >
            Try Again
          </Button>

          {isRoot ? (
            <Button
              component="a"
              href="/"
              fw="bold"
              tt="uppercase"
              variant="light"
            >
              Home
            </Button>
          ) : (
            <Button
              component="a"
              href="/"
              fw="bold"
              tt="uppercase"
              variant="light"
            >
              Go Back
            </Button>
          )}
        </Group>
      </Stack>
    </Container>
  )
}

export default DefaultErrorBoundary
```

---

## 🔥 High Priority Improvements

### 1. Enhanced Form Validation

Current ArkType schemas are basic. Let's enhance them with more detailed validation:

```typescript
// src/shared/schemas/list.ts
import { type } from "arktype"

export const newGroceryListFormSchema = type({
  name: "string>=2<=100",
  description: "string.optional<=500",
  items: type({
    name: "string>=1<=100",
    quantity: "number.integer>0<=1000",
    notes: "string.optional<=200",
    category: "optional(['produce', 'dairy', 'meat', 'pantry', 'other'])",
    priority: "optional(['low', 'medium', 'high'])"
  }).array().max(50)
}).message({
  name: "List name must be between 2 and 100 characters",
  description: "Description must not exceed 500 characters",
  "items.name": "Item name must be between 1 and 100 characters",
  "items.quantity": "Quantity must be between 1 and 1000",
  "items": "Cannot have more than 50 items in a list"
})

export type NewGroceryListFormData = typeof newGroceryListFormSchema.infer
```

### 2. Request Cancellation Pattern

Implement proper request cancellation for better UX:

```typescript
// src/shared/hooks/useListsQuery.ts
import { useQuery } from "@tanstack/react-query"
import { orpc } from "@app/shared/orpc"
import type { List } from "@repo/contract"

export const useListsQuery = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['lists', { search: searchTerm }],
    queryFn: async ({ signal }) => {
      return orpc.lists.getAll({
        search: searchTerm
      }, {
        // Pass abort signal for cancellation
        signal
      })
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    select: (data) => {
      // Transform data if needed
      return data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
  })
}
```

### 3. Optimistic Updates

Improve perceived performance with optimistic updates:

```typescript
// src/shared/hooks/useListMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@app/shared/orpc"
import { toast } from "@app/shared/toast"
import type { List } from "@repo/contract"

export const useCreateListMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.lists.create,
    onMutate: async (newList) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['lists'] })

      // Snapshot the previous value
      const previousLists = queryClient.getQueryData<List[]>(['lists'])

      // Optimistically update to the new value
      queryClient.setQueryData(['lists'], (old: List[] = []) =>
        [...old, {
          ...newList,
          id: 'temp-' + Date.now(),
          status: 'pending',
          createdAt: new Date().toISOString()
        }]
      )

      // Return a context object with the snapshotted value
      return { previousLists }
    },

    // If the mutation fails, use the context returned from onMutate
    onError: (err, newList, context) => {
      queryClient.setQueryData(['lists'], context?.previousLists)
      toast.error({
        title: "Failed to create list",
        message: err.message
      })
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },

    onSuccess: () => {
      toast.success({
        message: "List created successfully"
      })
    }
  })
}
```

---

## 🔧 Medium Priority Enhancements

### 1. Component Composition Pattern

Create more reusable layout components:

```typescript
// src/components/layout/PageLayout.tsx
import { ReactNode } from "react"
import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Breadcrumbs,
  LoadingOverlay,
  Paper
} from "@mantine/core"
import { PageSuspenseFallback } from "./PageSuspenseFallback"

interface PageLayoutProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: ReactNode
  children: ReactNode
  loading?: boolean
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  children,
  loading = false,
  size = "lg"
}) => {
  return (
    <Container size={size} py="md" pos="relative">
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <Stack gap="lg">
        {(title || breadcrumbs || actions) && (
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between" wrap="nowrap">
              <Stack gap="xs" miw={0}>
                {breadcrumbs}
                <Title order={1}>{title}</Title>
                {subtitle && (
                  <Text size="sm" c="dimmed">{subtitle}</Text>
                )}
              </Stack>
              {actions && <Group>{actions}</Group>}
            </Group>
          </Paper>
        )}

        {children}
      </Stack>
    </Container>
  )
}
```

**Usage Example:**
```typescript
// src/routes/_private/lists/index.tsx
import { PageLayout } from "@app/components/layout/PageLayout"
import { ActionIcon, Button } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

export const ListsPage = () => {
  return (
    <PageLayout
      title="My Lists"
      subtitle="Manage your grocery lists"
      breadcrumbs={<Breadcrumbs>...</Breadcrumbs>}
      actions={
        <Button
          component={Link}
          to="/lists/new"
          leftSection={<IconPlus size={16} />}
        >
          New List
        </Button>
      }
    >
      {/* Page content */}
    </PageLayout>
  )
}
```

### 2. Custom Hooks for Complex Logic

Extract complex logic into reusable hooks:

```typescript
// src/shared/hooks/useDebounce.ts
import { useState, useEffect } from "react"

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Usage:
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)

  // Use debouncedSearch for API calls
}
```

```typescript
// src/shared/hooks/useInfiniteScroll.ts
import { useState, useEffect, useCallback } from "react"
import { throttle } from "lodash-es"

export const useInfiniteScroll = (
  fetchMore: () => Promise<void>,
  hasMore: boolean,
  threshold = 1000
) => {
  const [loading, setLoading] = useState(false)

  const handleScroll = useCallback(
    throttle(async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - threshold
      ) {
        if (hasMore && !loading) {
          setLoading(true)
          try {
            await fetchMore()
          } finally {
            setLoading(false)
          }
        }
      }
    }, 200),
    [hasMore, loading, fetchMore, threshold]
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      handleScroll.cancel()
    }
  }, [handleScroll])

  return { loading }
}
```

```typescript
// src/shared/hooks/useLocalStorage.ts
import { useState, useEffect } from "react"

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
```

### 3. Performance Monitoring

Add performance tracking to identify bottlenecks:

```typescript
// src/shared/analytics.ts
import { performance } from "perf_hooks"

export const trackPageView = (path: string, title?: string) => {
  if (import.meta.env.PROD && typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
      page_title: title
    })
  }
}

export const trackPerformance = (name: string, duration: number) => {
  // Always log in development
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${name}: ${duration}ms`)

    // Warn about slow operations
    if (duration > 100) {
      console.warn(`[Performance Warning] ${name} is slow (${duration}ms)`)
    }
  }

  // Report slow operations in production
  if (import.meta.env.PROD && duration > 1000) {
    // Send to monitoring service
    // Example: Sentry.addBreadcrumb({
    //   message: `Slow operation: ${name}`,
    //   data: { duration },
    //   level: 'warning'
    // })
  }
}

// Hook for tracking component render performance
export const usePerformanceTracker = (componentName: string) => {
  useEffect(() => {
    const start = performance.now()

    return () => {
      const duration = performance.now() - start
      trackPerformance(`${componentName} render`, duration)
    }
  })
}

// Higher-order component for tracking
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  name: string
) => {
  const WrappedComponent = (props: P) => {
    usePerformanceTracker(name)
    return <Component {...props} />
  }

  WrappedComponent.displayName = `withPerformanceTracking(${name})`
  return WrappedComponent
}
```

---

## 📊 Code Quality Improvements

### 1. TypeScript Strict Mode

Enhance `tsconfig.json` for better type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 2. Component Props Pattern

Implement consistent prop patterns:

```typescript
// src/components/lists/ListCard.tsx
import { ReactNode } from "react"
import { Card, Text, Group, Badge, ActionIcon } from "@mantine/core"
import { IconEdit, IconTrash, IconUsers } from "@tabler/icons-react"
import type { List } from "@repo/contract"

interface ListCardProps {
  /** The list data to display */
  list: List
  /** Callback when edit button is clicked */
  onEdit?: (id: string) => void
  /** Callback when delete button is clicked */
  onDelete?: (id: string) => void
  /** Callback when share button is clicked */
  onShare?: (id: string) => void
  /** Additional CSS classes */
  className?: string
  /** Show loading state */
  loading?: boolean
  /** Custom footer content */
  footer?: ReactNode
  /** Variant of the card */
  variant?: "default" | "compact" | "detailed"
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onEdit,
  onDelete,
  onShare,
  className,
  loading = false,
  footer,
  variant = "default"
}) => {
  return (
    <Card
      withBorder
      p="md"
      className={className}
      opacity={loading ? 0.7 : 1}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500} size="lg">{list.name}</Text>
          <Group gap="xs">
            {onShare && (
              <ActionIcon
                variant="light"
                size="sm"
                onClick={() => onShare(list.id)}
                aria-label={`Share ${list.name}`}
              >
                <IconUsers size={16} />
              </ActionIcon>
            )}
            {onEdit && (
              <ActionIcon
                variant="light"
                size="sm"
                onClick={() => onEdit(list.id)}
                aria-label={`Edit ${list.name}`}
              >
                <IconEdit size={16} />
              </ActionIcon>
            )}
            {onDelete && (
              <ActionIcon
                variant="light"
                color="red"
                size="sm"
                onClick={() => onDelete(list.id)}
                aria-label={`Delete ${list.name}`}
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Card.Section>

      {variant === "detailed" && list.description && (
        <Text size="sm" color="dimmed" mt="sm">
          {list.description}
        </Text>
      )}

      <Group mt="sm">
        <Badge variant="light">{list.items.length} items</Badge>
        {list.shared && <Badge color="blue">Shared</Badge>}
      </Group>

      {footer && (
        <Card.Section inheritPadding py="xs">
          {footer}
        </Card.Section>
      )}
    </Card>
  )
}
```

### 3. Bundle Analysis

Monitor and optimize bundle size:

```json
{
  "devDependencies": {
    "@rollup/plugin-visualizer": "^5.9.0",
    "vite-bundle-analyzer": "^0.7.0"
  },
  "scripts": {
    "build:analyze": "vite build && npx vite-bundle-analyzer dist",
    "build:visualize": "vite build && npx rollup-plugin-visualizer dist/stats.html"
  }
}
```

Add to `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          tanstack: ['@tanstack/react-router', '@tanstack/react-query'],
          ui: ['@mantine/core', '@mantine/hooks'],
          utils: ['arktype', 'immer', 'zustand']
        }
      }
    },
    reportCompressedSize: true
  }
})
```

---

## 🔒 Security Enhancements

### 1. Content Security Policy

Add CSP headers for production:

```typescript
// src/entry-client.tsx or router config
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://www.googletagmanager.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: [
      "'self'",
      import.meta.env.VITE_SERVER_URL
    ],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }
}
```

### 2. API Rate Limiting and Security Headers

```typescript
// src/shared/orpc.ts
const securityLink = new RPCLink({
  ...baseRpcLinkOpts,
  interceptors: [
    {
      async request(request, next) {
        // Add security headers
        request.headers.set('X-Requested-With', 'XMLHttpRequest')

        // Add CSRF token if available
        const csrfToken = getCsrfToken()
        if (csrfToken) {
          request.headers.set('X-CSRF-Token', csrfToken)
        }

        return next(request)
      }
    },
    {
      async response(response) {
        // Handle rate limit headers
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
        if (rateLimitRemaining && parseInt(rateLimitRemaining) < 10) {
          console.warn('Rate limit running low:', rateLimitRemaining)
        }

        return response
      }
    }
  ]
})
```

### 3. Input Sanitization

```typescript
// src/shared/utils/sanitization.ts
import DOMPurify from 'dompurify'

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "") // Basic HTML tag removal
    .trim()
}

export const sanitizeHtml = (html: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href', 'target']
    })
  }
  return html
}

// Validate URLs
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}
```

---

## 🧪 Testing Strategy

### 1. Test Setup

```typescript
// src/test/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Close server after all tests
afterAll(() => server.close())

// Extend Vitest's expect
import '@testing-library/jest-dom/vitest'
```

### 2. Mock Server Setup

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { testLists, testUsers } from './data'

export const handlers = [
  // Auth endpoints
  http.post('/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any

    const user = testUsers.find(u => u.email === email)
    if (user && password === 'password123') {
      return HttpResponse.json({
        data: { user, session: { token: 'mock-token' } }
      })
    }

    return HttpResponse.json(
      { error: { message: 'Invalid credentials' } },
      { status: 401 }
    )
  }),

  // Lists endpoints
  http.get('/rpc/lists.getAll', () => {
    return HttpResponse.json({
      data: testLists
    })
  }),

  http.post('/rpc/lists.create', async ({ request }) => {
    const newList = await request.json() as any
    const created = {
      ...newList,
      id: `list-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    testLists.push(created)

    return HttpResponse.json({
      data: created
    })
  })
]

export const server = setupServer(...handlers)
```

### 3. Component Testing Examples

```typescript
// src/components/auth/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from './LoginForm'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: 'Login' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Login successful')).toBeInTheDocument()
    })
  })

  it('handles login error', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'wrong@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})
```

### 4. Hook Testing

```typescript
// src/shared/hooks/useListsQuery.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { server } from '../test/mocks/server'
import { useListsQuery } from './useListsQuery'

describe('useListsQuery', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
  })

  it('fetches lists successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )

    const { result } = renderHook(() => useListsQuery(), { wrapper })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toHaveLength(3)
    })
  })

  it('filters lists by search term', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )

    const { result } = renderHook(() => useListsQuery('grocery'), { wrapper })

    await waitFor(() => {
      expect(result.current.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: expect.stringContaining('grocery') })
        ])
      )
    })
  })
})
```

---

## 📈 Implementation Roadmap

### Phase 1: Critical (Week 1-2)

1. **Testing Infrastructure**
   - [ ] Set up Vitest + Testing Library
   - [ ] Configure MSW for API mocking
   - [ ] Write tests for critical paths (auth, lists)
   - [ ] Achieve 80% code coverage

2. **Error Handling**
   - [ ] Implement error tracking (Sentry/LogRocket)
   - [ ] Enhance error boundaries
   - [ ] Add retry mechanisms

3. **Request Handling**
   - [ ] Implement request cancellation
   - [ ] Add loading states for all async operations
   - [ ] Create retry logic for failed requests

### Phase 2: High Priority (Week 3-4)

1. **Data Fetching**
   - [ ] Implement optimistic updates
   - [ ] Add infinite scroll for large lists
   - [ ] Implement proper caching strategies
   - [ ] Add prefetching for improved UX

2. **Form Enhancements**
   - [ ] Enhance validation with ArkType
   - [ ] Add form auto-save
   - [ ] Implement multi-step forms

3. **Performance**
   - [ ] Add performance monitoring
   - [ ] Implement route-based code splitting
   - [ ] Optimize bundle size
   - [ ] Add service worker for caching

### Phase 3: Medium Priority (Month 2)

1. **UI/UX Improvements**
   - [ ] Create reusable layout components
   - [ ] Implement skeleton loaders
   - [ ] Add dark mode support
   - [ ] Improve accessibility (ARIA labels, keyboard nav)

2. **Code Quality**
   - [ ] Enable TypeScript strict mode
   - [ ] Add bundle analyzer
   - [ ] Implement component documentation
   - [ ] Set up pre-commit hooks

3. **Security**
   - [ ] Implement CSP headers
   - [ ] Add rate limiting
   - [ ] Implement CSRF protection
   - [ ] Add input sanitization

---

## ✅ Best Practices Already Implemented

This codebase already follows many excellent practices:

### Architecture Patterns ✅
- **Clean separation of concerns** with dedicated folders for components, pages, and shared utilities
- **Feature-based organization** for better scalability
- **Consistent naming conventions** throughout the codebase

### Type Safety ✅
- **Full-stack TypeScript** with proper typing
- **Type-safe API communication** with ORPC
- **Runtime validation** with ArkType schemas
- **Proper generics** for reusable components

### State Management ✅
- **Server state**: TanStack Query with proper caching
- **Client state**: Zustand for global state
- **Form state**: TanStack React Form with validation
- **Auth state**: Better Auth with session management

### Performance ✅
- **React Compiler** for automatic optimizations
- **Lazy loading** with TanStack Router
- **Code splitting** at route level
- **Efficient caching** strategies

### Developer Experience ✅
- **Hot Module Replacement** with Vite
- **DevTools** for debugging (React, Router, Query)
- **Linting** with Biome and Oxlint
- **Auto-imports** and path mapping

### Security ✅
- **Session-based auth** with secure cookies
- **Type-safe API** with ORPC
- **Input validation** at multiple layers
- **CORS configuration** for development

### Error Handling ✅
- **Global error boundaries** with recovery options
- **Toast notifications** for user feedback
- **Graceful degradation** patterns
- **Loading states** throughout the app

---

## 📚 Resources & Links

### Documentation
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [ORPC](https://orpc.unnoq.com/)
- [Mantine](https://mantine.dev/)
- [Better Auth](https://better-auth.com/)
- [ArkType](https://arktype.io/)

### Testing
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW](https://mswjs.io/)

### Performance
- [React Profiler](https://react.dev/reference/react/Profiler)
- [Bundle Analyzer](https://www.npmjs.com/package/@rollup/plugin-visualizer)
- [Web Vitals](https://web.dev/vitals/)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## Conclusion

This React frontend is built on a **solid foundation** with modern best practices. The architecture is well-thought-out, type-safe, and scalable. The main areas for improvement revolve around adding a comprehensive testing strategy, enhancing error handling, and implementing performance optimizations.

With the suggested improvements implemented, this will be a **production-ready, enterprise-grade application** that provides excellent user experience and developer productivity.

The code quality is high, and the team has made excellent technology choices. The roadmap provided will help take this application to the next level while maintaining the high standards already established.
