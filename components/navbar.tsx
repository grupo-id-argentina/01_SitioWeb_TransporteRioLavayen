"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/mixpanel-config"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    trackEvent("Theme Toggle", {
      page: pathname,
      from_theme: theme,
      to_theme: newTheme,
    })
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
    trackEvent("Menu Toggle", {
      page: pathname,
      action: !isMenuOpen ? "open" : "close",
      device_type: window.innerWidth < 1024 ? "mobile" : "desktop",
    })
  }

  const handleLogoClick = () => {
    trackEvent("Logo Click", {
      page: pathname,
      destination: "/",
    })
  }

  const handleNavClick = (destination: string, label: string) => {
    trackEvent("Navigation Click", {
      page: pathname,
      nav_item: label,
      destination: destination,
      nav_type: "main_menu",
    })
    setIsMenuOpen(false)
  }

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-secondary-800/90 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-secondary-800 shadow-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={handleLogoClick}>
              <Image
                src="/logo.png"
                alt="Transporte Río Lavayen"
                width={32}
                height={32}
                className="mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-base sm:text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
                Transporte Rio Lavayen | Ribotta
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-white sm:hidden">TRL | Ribotta</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <Link
              href="/"
              onClick={() => handleNavClick("/", "Inicio")}
              className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 xl:px-3 py-2 rounded-md transition-colors text-sm xl:text-base ${
                pathname === "/" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/servicios"
              onClick={() => handleNavClick("/servicios", "Servicios")}
              className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 xl:px-3 py-2 rounded-md transition-colors text-sm xl:text-base ${
                pathname === "/servicios" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
              }`}
            >
              Servicios
            </Link>
            <Link
              href="/convenios"
              onClick={() => handleNavClick("/convenios", "Convenios")}
              className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 xl:px-3 py-2 rounded-md transition-colors text-sm xl:text-base ${
                pathname === "/convenios" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
              }`}
            >
              Convenios
            </Link>
            <Link
              href="/contacto"
              onClick={() => handleNavClick("/contacto", "Contacto")}
              className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 xl:px-3 py-2 rounded-md transition-colors text-sm xl:text-base ${
                pathname === "/contacto" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
              }`}
            >
              Contacto
            </Link>
            <Link
              href="/calculadora"
              onClick={() => handleNavClick("/calculadora", "Cotizar Ahora")}
              className="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 xl:px-4 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm xl:text-base"
            >
              <span className="hidden xl:inline">Cotizar Ahora</span>
              <span className="xl:hidden">Cotizar</span>
            </Link>

            {/* Theme toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            <button
              onClick={handleMenuToggle}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-3 pt-2 animate-slide-down">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  pathname === "/" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
                }`}
                onClick={() => handleNavClick("/", "Inicio")}
              >
                Inicio
              </Link>
              <Link
                href="/servicios"
                className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  pathname === "/servicios" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
                }`}
                onClick={() => handleNavClick("/servicios", "Servicios")}
              >
                Servicios
              </Link>
              <Link
                href="/convenios"
                className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  pathname === "/convenios" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
                }`}
                onClick={() => handleNavClick("/convenios", "Convenios")}
              >
                Convenios
              </Link>
              <Link
                href="/contacto"
                className={`text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  pathname === "/contacto" ? "text-primary-600 dark:text-primary-400 font-medium" : ""
                }`}
                onClick={() => handleNavClick("/contacto", "Contacto")}
              >
                Contacto
              </Link>
              <Link
                href="/calculadora"
                className="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 py-2 rounded-md font-medium text-center transition-all duration-200 shadow-md text-sm sm:text-base"
                onClick={() => handleNavClick("/calculadora", "Cotizar Ahora")}
              >
                Cotizar Ahora
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
