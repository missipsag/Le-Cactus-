"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Heart, Briefcase } from "lucide-react"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useState, useEffect } from "react"

const salles = [
  {
    id: "conference",
    nom: "Salle de Conférence",
    description: "Espace professionnel équipé pour vos réunions et présentations",
    capacite: "50 personnes",
    icon: Briefcase,
    image: "/images/conference.jpg",
    couleur: "from-blue-500 to-blue-600",
  },
  {
    id: "mariage",
    nom: "Salle de Mariage",
    description: "Cadre romantique et élégant pour votre jour J",
    capacite: "150 personnes",
    icon: Heart,
    image: "/images/mariage.jpg",
    couleur: "from-pink-500 to-pink-600",
  },
  {
    id: "evenement",
    nom: "Salle d'Événement",
    description: "Espace polyvalent pour toutes vos célébrations",
    capacite: "100 personnes",
    icon: Users,
    image: "/images/evenement-special.jpg",
    couleur: "from-purple-500 to-purple-600",
  },
]

export default function SallesSection() {
  const [openGallery, setOpenGallery] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (openGallery) {
      fetch(`/api/salle-images?salle=${openGallery}`)
        .then(res => res.json())
        .then(data => setGalleryImages(data.images || []))
    } else {
      setGalleryImages([])
      setSelectedImage(null)
    }
  }, [openGallery])

  return (
    <section className="py-20 px-4 relative">
      {/* Séparateur SVG */}
      <div className="absolute top-0 left-0 w-full">
        <svg viewBox="0 0 1200 60" className="w-full h-15 fill-green-100/50">
          <path d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z" />
        </svg>
      </div>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">Nos Espaces</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Choisissez l'espace parfait pour votre événement parmi nos trois salles uniques
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {salles.map((salle) => (
            <Card
              key={salle.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={salle.image || "/placeholder.svg"}
                  alt={salle.nom}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${salle.couleur} rounded-full flex items-center justify-center`}
                >
                  <salle.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl text-green-800">{salle.nom}</CardTitle>
                <CardDescription className="text-gray-600">{salle.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Capacité</span>
                  <span className="font-semibold text-green-700">{salle.capacite}</span>
                </div>
                <Button className="w-full mb-2" asChild>
                  <Link href={`/reservation?salle=${salle.id}`}>Réserver cette salle</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setOpenGallery(salle.id)}>
                  Voir salle
                </Button>
                {/* Galerie d'images en modal/grille */}
                {openGallery === salle.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => setOpenGallery(null)}>
                        ✕
                      </button>
                      <h3 className="text-lg font-bold mb-4">Galerie - {salle.nom}</h3>
                      {galleryImages.length === 0 ? (
                        <div className="text-center text-gray-400">Aucune image trouvée</div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {galleryImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Photo ${idx + 1} de ${salle.nom}`}
                              className="w-full h-28 object-cover rounded shadow cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setSelectedImage(img)}
                            />
                          ))}
                        </div>
                      )}
                      {/* Modale d'image agrandie */}
                      {selectedImage && (
                        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setSelectedImage(null)}>
                          <img
                            src={selectedImage}
                            alt="Agrandissement"
                            className="max-w-3xl max-h-[80vh] rounded shadow-lg border-4 border-white"
                            onClick={e => e.stopPropagation()}
                          />
                          <button className="absolute top-4 right-8 text-white text-3xl font-bold" onClick={() => setSelectedImage(null)}>
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
