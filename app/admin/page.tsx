"use client";

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Calendar, Users, MessageSquare, Check, X, Trash2, Star } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundElements from "@/components/background-elements"

interface AdminAuth {
  username: string
  password: string
}

interface Reservation {
  id: number
  userId: number
  userName: string
  userEmail: string
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
  deleted: boolean
}

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  carteIdentite: string
  dateNaissance: string
  deleted: boolean
}

interface Avis {
  id: number
  userName: string
  note: number
  commentaire: string
  date: string
  supprime: boolean
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authData, setAuthData] = useState<AdminAuth>({ username: "", password: "" })
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [avis, setAvis] = useState<Avis[]>([])
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null)
  const [adminMessage, setAdminMessage] = useState("")
  const [error, setError] = useState("")

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Authentification simple (à remplacer par une vraie authentification)
    if (authData.username === "admin" && authData.password === "admin") {
      setIsAuthenticated(true)
      fetchAllData()
    } else {
      setError("Identifiants incorrects")
    }
  }

  const fetchAllData = async () => {
    try {
      // Fetch reservations
      const resResponse = await fetch("/api/admin/reservations")
      const resData = await resResponse.json()
      if (resResponse.ok) setReservations(resData.reservations)

      // Fetch users
      const usersResponse = await fetch("/api/admin/users")
      const usersData = await usersResponse.json()
      if (usersResponse.ok) setUsers(usersData.users)

      // Fetch avis
      const avisResponse = await fetch("/api/admin/avis")
      const avisData = await avisResponse.json()
      if (avisResponse.ok) setAvis(avisData.avis)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    }
  }

  const updateReservationStatus = async (id: number, status: string, message?: string) => {
    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, messageAdmin: message }),
      })

      if (response.ok) {
        fetchAllData()
        setSelectedReservation(null)
        setAdminMessage("")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const deleteUser = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchAllData()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const deleteReservation = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      try {
        const response = await fetch(`/api/admin/reservations/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchAllData()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const deleteAvis = async (id: number, definitif = false) => {
    const message = definitif
      ? "Êtes-vous sûr de vouloir supprimer définitivement cet avis ?"
      : "Êtes-vous sûr de vouloir supprimer cet avis ?"

    if (confirm(message)) {
      try {
        const response = await fetch(`/api/admin/avis/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ definitif }),
        })

        if (response.ok) {
          fetchAllData()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
        <BackgroundElements />
        <Header />

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-800">Administration</CardTitle>
                <CardDescription>Accès réservé aux administrateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      value={authData.username}
                      onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={authData.password}
                      onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Se connecter
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      <BackgroundElements />
      <Header />

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Tableau de bord Admin</h1>
            <p className="text-gray-600">Gestion des réservations, utilisateurs et avis</p>
          </div>

          <Tabs defaultValue="reservations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reservations" className="flex items-center space-x-2">
                <span>Réservations</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <span>Utilisateurs</span>
              </TabsTrigger>
              <TabsTrigger value="avis" className="flex items-center space-x-2">
                <span>Avis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reservations" className="space-y-4">
              {reservations.filter(r => !r.deleted).map((reservation) => (
                <Card key={reservation.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Réservation n°{reservation.id} - {reservation.salle}
                        </CardTitle>
                        <CardDescription>
                          {reservation.userName} ({reservation.userEmail})
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          reservation.status === "confirmee"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "rejetee"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {reservation.status === "confirmee"
                          ? "Confirmée"
                          : reservation.status === "rejetee"
                            ? "Rejetée"
                            : "En attente"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>Date: {new Date(reservation.date).toLocaleDateString("fr-FR")}</div>
                      <div>
                        Heure: {reservation.heureDebut} ({reservation.duree}h)
                      </div>
                      <div>Prix: {reservation.prixTotal} DZD</div>
                      <div>Créée: {new Date(reservation.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
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
                    {selectedReservation === reservation.id ? (
                      <div className="space-y-3 border-t pt-4">
                        <Textarea
                          placeholder="Message pour l'utilisateur (optionnel)"
                          value={adminMessage}
                          onChange={(e) => setAdminMessage(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateReservationStatus(reservation.id, "confirmee", adminMessage)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Confirmer
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateReservationStatus(reservation.id, "rejetee", adminMessage)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReservation(null)
                              setAdminMessage("")
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2 border-t pt-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedReservation(reservation.id)}>
                          Gérer
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteReservation(reservation.id)}>
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              {users.filter(u => !u.deleted).map((user) => (
                <Card key={user.id} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="grid md:grid-cols-2 gap-4 flex-1">
                        <div>
                          <h3 className="font-semibold">
                            {user.prenom} {user.nom}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Tél: {user.telephone}</div>
                          <div>CIN: {user.carteIdentite}</div>
                          <div>Né(e) le: {new Date(user.dateNaissance).toLocaleDateString("fr-FR")}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="avis" className="space-y-4">
              {avis.filter(a => !a.deleted).map((avisItem) => (
                <Card key={avisItem.id} className="shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{avisItem.userName}</h3>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < (avisItem.rating || avisItem.note) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">"{avisItem.commentaire}"</p>
                        <p className="text-sm text-gray-500">{new Date(avisItem.date).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="destructive" onClick={() => deleteAvis(avisItem.id, false)}>
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
