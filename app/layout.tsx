import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Chemical Descriptor Calculator",
  description: "Calculate molecular descriptors from SMILES strings",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add AG Grid styles */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@30.0.6/styles/ag-grid.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ag-grid-community@30.0.6/styles/ag-theme-alpine.css"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
