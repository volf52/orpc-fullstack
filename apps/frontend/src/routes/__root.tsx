import Navbar from "@/components/layout/Navbar"
import Providers from "@/components/layout/Providers"
import Toaster from "@/components/layout/Toaster"
import { Box } from "@/styled-system/jsx"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import "./globals.css"

export const Route = createRootRoute({
  component: () => (
    <>
      <Providers>
        <Navbar />
        <Box
          minH="90vh"
          bgGradient="to-br"
          gradientFrom="teal.a5"
          gradientTo="teal.a2"
          pt="4"
        >
          <Outlet />
        </Box>
      </Providers>
      <Toaster />
    </>
  ),
})
