"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation" // Only if you're using Next.js App Router

const menuItems = [
  { name: "Dashboard", href: "/" },
  { name: "Stations", href: "/stations" },
  { name: "Reports", href: "/reports" },
  { name: "Alerts", href: "/alerts" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname() // If you're using Next.js App Router

  // Auto-close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav className="bg-white border-b border-[#eaecf0] mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/nccg_logo.png" alt="Nairobi County Government" className="h-16 w-16" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#667085] hover:text-[#101828] hover:bg-[#eaecf0]"
                  }`}
                >
                  {item.name}
                </a>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#667085] hover:text-[#101828] hover:bg-[#eaecf0] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3b82f6]"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 border-t border-[#eaecf0] pt-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-[#3b82f6] text-white"
                      : "text-[#667085] hover:text-[#101828] hover:bg-[#eaecf0]"
                  }`}
                >
                  {item.name}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
