"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    // Reducir tiempo de transición para mayor velocidad
    const timer = setTimeout(() => setIsLoading(false), 150)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white dark:bg-secondary-900 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600 mb-2"></div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Cargando...</p>
          </div>
        </div>
      )}
      <div className={`transition-opacity duration-150 ${isLoading ? "opacity-0" : "opacity-100"}`}>{children}</div>
    </>
  )
}
