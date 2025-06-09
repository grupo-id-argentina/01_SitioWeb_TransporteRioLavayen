import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { GlobalFeedbackWidget } from "@/components/global-feedback-widget"
import { ChatWidget } from "@/components/chat-widget"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Transporte Río Lavayen - Logística y Transporte de Calidad",
  description:
    "Más de 30 años brindando servicios de logística y transporte de calidad en todo el país. Cotiza tu envío ahora.",
  keywords: "transporte, logística, envíos, Argentina, Jujuy, San Pedro",
  authors: [{ name: "Transporte Río Lavayen" }],
  openGraph: {
    title: "Transporte Río Lavayen - Logística y Transporte de Calidad",
    description: "Más de 30 años brindando servicios de logística y transporte de calidad en todo el país.",
    type: "website",
    locale: "es_AR",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AnalyticsProvider>
            <Suspense>
              {children}
              <ChatWidget />
              <GlobalFeedbackWidget />
            </Suspense>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
