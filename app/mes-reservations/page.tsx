"use client";

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, MessageSquare } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundElements from "@/components/background-elements"

interface Reservation {
  id: number
  salle: string
  date: string
  heureDebut: number
  duree: number
  plats: string[]
  services: string[]
  prixTotal: number
  status: "en_attente" | "confirmee" | "rejetee"
  messageAdmin?: string
  createdAt: string
}

const sallesNoms = {
  conference: "Salle de Conférence",
  mariage: "Salle de Mariage",
  evenement: "Salle d'Événement",
}

const statutColors = {
  en_attente: "bg-yellow-100 text-yellow-800",
  confirmee: "bg-green-100 text-green-800",
  rejetee: "bg-red-100 text-red-800",
}

const statutLabels = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  rejetee: "Rejetée",
}

export default function MesReservationsPage() {
  const [user, setUser] = useState(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const confirmation = searchParams.get("confirmation")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchReservations(JSON.parse(userData).id)
    } else {
      router.push("/connexion")
    }
  }, [router])

  const fetchReservations = async (userId: number) => {
    try {
      const response = await fetch(`/api/reservations?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setReservations(data.reservations)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      <BackgroundElements />
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {confirmation === "1" && (
            <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow text-yellow-900">
              <div className="font-bold text-lg mb-2">Votre réservation est en attente.</div>
              <div className="mb-1">Vous devez vous présenter dans les 5 jours maximum avec votre carte d'identité pour confirmer votre réservation.</div>
              <div className="font-semibold">Attention : Passé ce délai, votre réservation sera automatiquement annulée.</div>
            </div>
          )}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Mes Réservations</h1>
            <p className="text-gray-600">Consultez l'historique de vos réservations</p>
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : reservations.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune réservation</h3>
                <p className="text-gray-500">Vous n'avez pas encore effectué de réservation.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {reservations.map((reservation) => (
                <Card key={reservation.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-green-800">
                          {sallesNoms[reservation.salle as keyof typeof sallesNoms]}
                        </CardTitle>
                        <CardDescription>Réservation #{reservation.id}</CardDescription>
                      </div>
                      <Badge className={statutColors[reservation.status]}>{statutLabels[reservation.status]}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{new Date(reservation.date).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>
                          {reservation.heureDebut} ({reservation.duree}h)
                        </span>
                      </div>
                    </div>

                    {reservation.services.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {reservation.services.map((service, index) => (
                            <Badge key={index} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {reservation.plats.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Restauration</h4>
                        <div className="flex flex-wrap gap-2">
                          {reservation.plats.map((plat, index) => (
                            <Badge key={index} variant="outline">
                              {plat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">{reservation.prixTotal} DZD</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Créée le {new Date(reservation.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    {reservation.messageAdmin && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <h5 className="font-semibold text-blue-800">Message de l'administration</h5>
                            <p className="text-blue-700 text-sm">{reservation.messageAdmin}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
