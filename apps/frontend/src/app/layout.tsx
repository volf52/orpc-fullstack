import "./globals.css"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Providers from "@/components/layout/Providers"
import Toaster from "@/components/layout/Toaster"
import Navbar from "@/components/layout/Navbar"
import { Box } from "@/styled-system/jsx"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CT Starter - Frontend",
  description: "Carbonteq",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navbar />
          <Box
            minH="90vh"
            bgGradient="to-br"
            gradientFrom="teal.a5"
            gradientTo="teal.a2"
            pt="4"
          >
            {children}
          </Box>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
