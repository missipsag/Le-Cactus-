"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("user"))
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      setIsLoggedIn(false)
      window.location.href = "/"
    }
  }

  return (
    <header className="relative z-50 bg-gradient-to-r from-green-50 via-white to-green-100 shadow-md border-b border-green-100">
      {/* Séparateur SVG décoratif en bas du header */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none">
        <svg viewBox="0 0 1200 24" className="w-full h-6 fill-green-100">
          <path d="M0,12 Q300,24 600,12 T1200,12 L1200,24 L0,24 Z" />
        </svg>
      </div>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et nom */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 group-hover:shadow-2xl relative overflow-hidden">
              {/* Effet de lumière premium */}
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-60 pointer-events-none" style={{borderRadius: 'inherit'}}></span>
              <span className="text-white font-bold text-2xl drop-shadow-lg">🌵</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800 tracking-tight">Le Cactus</h1>
              <p className="text-sm text-green-600" style={{ fontFamily: "Noto Sans Tifinagh, sans-serif" }}>
                ⵍⴽⴰⴽⵜⵓⵙ
              </p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6"></nav>

          {/* Boutons d'authentification */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/mon-compte">
                    <User className="w-4 h-4 mr-2" />
                    Mon Compte
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Se Déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/connexion">Se Connecter</Link>
                </Button>
                <Button asChild>
                  <Link href="/inscription">S'Inscrire</Link>
                </Button>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-green-100">
            <nav className="flex flex-col space-y-3 mt-4">
              {/* Aucun lien de navigation */}
              <div className="flex flex-col space-y-2 pt-3 border-t border-green-100">
                {isLoggedIn ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/mon-compte">Mon Compte</Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Se Déconnecter
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/connexion">Se Connecter</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/inscription">S'Inscrire</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
