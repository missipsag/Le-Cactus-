"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, LogOut, Calendar, Trash2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundElements from "@/components/background-elements"
import Link from "next/link"

interface UserData {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
  telephone: string
  carteIdentite: string
  email: string
}

export default function MonComptePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/connexion")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return
    try {
      const response = await fetch(`/api/users/${user.id}`, { method: "DELETE" })
      if (response.ok) {
        localStorage.removeItem("user")
        alert("Votre compte a bien été supprimé.")
        router.push("/")
      } else {
        alert("Erreur lors de la suppression du compte.")
      }
    } catch (e) {
      alert("Erreur lors de la suppression du compte.")
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
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-800">Mon Compte</CardTitle>
              <CardDescription>Informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nom</label>
                  <div className="p-3 bg-gray-50 rounded-md border">{user.nom}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prénom</label>
                  <div className="p-3 bg-gray-50 rounded-md border">{user.prenom}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date de naissance</label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {new Date(user.dateNaissance).toLocaleDateString("fr-FR")}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Téléphone</label>
                  <div className="p-3 bg-gray-50 rounded-md border">{user.telephone}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Carte d'identité</label>
                  <div className="p-3 bg-gray-50 rounded-md border">{user.carteIdentite}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="p-3 bg-gray-50 rounded-md border">{user.email}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button asChild className="flex-1">
                  <Link href="/mes-reservations">
                    <Calendar className="w-4 h-4 mr-2" />
                    Mes Réservations
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex-1">
                  <LogOut className="w-4 h-4 mr-2" />
                  Se Déconnecter
                </Button>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount} className="w-full mt-4">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer mon compte
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
