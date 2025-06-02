import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      {/* Vagues SVG en haut */}
      <div className="absolute top-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-green-200/30">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,0 L0,0 Z" />
        </svg>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-green-800 mb-6">Bienvenue au Cactus</h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Découvrez nos espaces exceptionnels pour vos événements les plus précieux. Salles de conférence, mariages et
          célébrations dans un cadre unique.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/reservation">Réserver Maintenant</Link>
          </Button>
        </div>
      </div>

      {/* Filigrane tifinagh */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 text-9xl font-bold text-green-800 pointer-events-none">
        ⵍⴽⴰⴽⵜⵓⵙ
      </div>
    </section>
  )
}
