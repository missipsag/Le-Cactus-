"use client";

import React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, DollarSign } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackgroundElements from "@/components/background-elements"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { addDays, format } from "date-fns"

const salles = [
  { id: "conference", nom: "Salle de Conférence" },
  { id: "mariage", nom: "Salle de Mariage" },
  { id: "evenement", nom: "Salle d'Événement" },
]

// Mapping des prix de base des salles (doit correspondre à la BDD)
const prixBaseSalles: Record<string, number> = {
  conference: 40000,
  evenement: 120000,
  mariage: 190000,
}

export default function ReservationPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    salle: "",
    date: "",
    heureDebut: "",
    duree: "2",
    services: [] as string[],
    plats: [] as string[],
  })
  const [prixTotal, setPrixTotal] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [servicesDynamiques, setServicesDynamiques] = useState<{ nom: string; prix: number }[]>([])
  const [platsDynamiques, setPlatsDynamiques] = useState<{ nom: string; prix: number }[]>([])
  const [disponibilites, setDisponibilites] = useState<{ date: string; heure_debut: string }[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/connexion")
      return
    }
    const salleParam = searchParams.get("salle")
    if (salleParam && salles.find((s) => s.id === salleParam)) {
      setFormData((prev) => ({ ...prev, salle: salleParam }))
    }
  }, [router, searchParams])

  // Charger dynamiquement services et plats selon la salle
  useEffect(() => {
    if (formData.salle) {
      fetch(`/api/services?salle=${formData.salle}`)
        .then((res) => res.json())
        .then((data) => setServicesDynamiques(data.services || []))
      fetch(`/api/plats?salle=${formData.salle}`)
        .then((res) => res.json())
        .then((data) => setPlatsDynamiques(data.plats || []))
    } else {
      setServicesDynamiques([])
      setPlatsDynamiques([])
    }
  }, [formData.salle])

  // Charger dynamiquement les créneaux réservés selon la salle
  useEffect(() => {
    if (formData.salle) {
      fetch(`/api/disponibilites?salle=${formData.salle}`)
        .then(res => res.json())
        .then(data => setDisponibilites(data.reservations || []))
    } else {
      setDisponibilites([])
    }
  }, [formData.salle])

  // Calcul dynamique du prix total
  useEffect(() => {
    let total = 0
    // Prix de base + durée
    const prixBase = prixBaseSalles[formData.salle] || 0
    const duree = parseInt(formData.duree, 10) || 0
    total += (duree * 70000) + prixBase
    // Services
    total += formData.services.reduce((sum, nom) => {
      const s = servicesDynamiques.find((x) => x.nom === nom)
      return sum + (s ? s.prix : 0)
    }, 0)
    // Plats
    total += formData.plats.reduce((sum, nom) => {
      const p = platsDynamiques.find((x) => x.nom === nom)
      return sum + (p ? p.prix : 0)
    }, 0)
    setPrixTotal(total)
  }, [formData.salle, formData.duree, formData.services, formData.plats, servicesDynamiques, platsDynamiques])

  // Calculer les dates où il y a au moins une réservation (toute la date grisée)
  const fullyBookedDates = React.useMemo(() => {
    const uniqueDates = Array.from(new Set(disponibilites.map(d => d.date)))
    return uniqueDates.map(date => new Date(date))
  }, [disponibilites])

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked ? [...prev.services, service] : prev.services.filter((s) => s !== service),
    }))
  }

  const handlePlatChange = (plat: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      plats: checked ? [...prev.plats, plat] : prev.plats.filter((p) => p !== plat),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salle: formData.salle,
          date: formData.date,
          heureDebut: formData.heureDebut,
          duree: formData.duree,
          services: formData.services,
          plats: formData.plats,
          prixTotal,
          userId: JSON.parse(localStorage.getItem("user") || "{}").id,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        router.push("/mes-reservations?confirmation=1")
      } else {
        setError(data.error || "Erreur lors de la réservation")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  const selectedDate = formData.date && !isNaN(Date.parse(formData.date)) ? new Date(formData.date) : undefined

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      <BackgroundElements />
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* <Calendar className="w-8 h-8 text-white" /> */}
              </div>
              <CardTitle className="text-2xl text-green-800">Réserver une salle</CardTitle>
              <CardDescription>Choisissez votre salle, date et options</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="salle">Salle</Label>
                  <Select
                    value={formData.salle}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, salle: value }))}
                  >
                    <SelectTrigger id="salle">
                      <SelectValue placeholder="Choisissez une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      {salles.map((salle) => (
                        <SelectItem key={salle.id} value={salle.id}>
                          {salle.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={date => {
                      setFormData(prev => ({ ...prev, date: date ? format(date, "yyyy-MM-dd") : "" }))
                    }}
                    disabled={fullyBookedDates}
                    fromDate={new Date()}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heureDebut">Heure de début</Label>
                  <Select
                    value={formData.heureDebut}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, heureDebut: value }))}
                  >
                    <SelectTrigger id="heureDebut">
                      <SelectValue placeholder="Choisissez une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(13)].map((_, i) => {
                        const hour = 8 + i
                        const hourStr = hour.toString().padStart(2, "0") + ":00"
                        // Désactiver si déjà réservé pour la date sélectionnée
                        const isTaken = formData.date && disponibilites.some(d => d.date === formData.date && d.heure_debut === hourStr)
                        return (
                          <SelectItem key={hour} value={hourStr} disabled={isTaken} className={isTaken ? "opacity-50 cursor-not-allowed" : ""}>
                            {hourStr} {isTaken ? "(indisponible)" : ""}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duree">Durée (heures)</Label>
                  <Select
                    value={formData.duree}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, duree: value }))}
                  >
                    <SelectTrigger id="duree">
                      <SelectValue placeholder="Durée" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8].map((duree) => (
                        <SelectItem key={duree} value={duree.toString()}>
                          {duree}h
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Message explicatif du calcul */}
                  {formData.salle && (
                    <div className="text-xs text-gray-600 mt-1">
                      (nombre d'heure × 70000 DZD + prix de base : {prixBaseSalles[formData.salle]} DZD)
                    </div>
                  )}
                </div>
                {/* Services dynamiques */}
                {servicesDynamiques.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Services disponibles</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {servicesDynamiques.map((service) => (
                        <div key={service.nom} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.nom}`}
                            checked={!!formData.services.includes(service.nom)}
                            onCheckedChange={(checked) => handleServiceChange(service.nom, Boolean(checked))}
                          />
                          <Label htmlFor={`service-${service.nom}`} className="text-sm">
                            {service.nom} (+{service.prix} DZD)
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Plats dynamiques */}
                {platsDynamiques.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Restauration</Label>
                    {/* Section Entrée */}
                    <div>
                      <div className="font-semibold text-green-700 mb-1">Entrée</div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {platsDynamiques.filter(p => p.categorie.toLowerCase() === 'entrée').map((plat) => (
                          <div key={plat.nom} className="flex items-center space-x-2">
                            <Checkbox
                              id={`plat-entree-${plat.nom}`}
                              checked={!!formData.plats.includes(plat.nom)}
                              onCheckedChange={(checked) => handlePlatChange(plat.nom, Boolean(checked))}
                            />
                            <Label htmlFor={`plat-entree-${plat.nom}`} className="text-sm">
                              {plat.nom} (+{plat.prix} DZD)
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Section Plat principal */}
                    <div>
                      <div className="font-semibold text-green-700 mb-1">Plat principal</div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {platsDynamiques.filter(p => p.categorie.toLowerCase() === 'plat principal').map((plat) => (
                          <div key={plat.nom} className="flex items-center space-x-2">
                            <Checkbox
                              id={`plat-principal-${plat.nom}`}
                              checked={!!formData.plats.includes(plat.nom)}
                              onCheckedChange={(checked) => handlePlatChange(plat.nom, Boolean(checked))}
                            />
                            <Label htmlFor={`plat-principal-${plat.nom}`} className="text-sm">
                              {plat.nom} (+{plat.prix} DZD)
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Section Dessert */}
                    <div>
                      <div className="font-semibold text-green-700 mb-1">Dessert</div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {platsDynamiques.filter(p => p.categorie.toLowerCase() === 'dessert').map((plat) => (
                          <div key={plat.nom} className="flex items-center space-x-2">
                            <Checkbox
                              id={`plat-dessert-${plat.nom}`}
                              checked={!!formData.plats.includes(plat.nom)}
                              onCheckedChange={(checked) => handlePlatChange(plat.nom, Boolean(checked))}
                            />
                            <Label htmlFor={`plat-dessert-${plat.nom}`} className="text-sm">
                              {plat.nom} (+{plat.prix} DZD)
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Section Boisson */}
                    <div>
                      <div className="font-semibold text-green-700 mb-1">Boisson</div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {platsDynamiques.filter(p => p.categorie.toLowerCase() === 'boisson').map((plat) => (
                          <div key={plat.nom} className="flex items-center space-x-2">
                            <Checkbox
                              id={`plat-boisson-${plat.nom}`}
                              checked={!!formData.plats.includes(plat.nom)}
                              onCheckedChange={(checked) => handlePlatChange(plat.nom, Boolean(checked))}
                            />
                            <Label htmlFor={`plat-boisson-${plat.nom}`} className="text-sm">
                              {plat.nom} (+{plat.prix} DZD)
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Récapitulatif */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-800">
                      Récapitulatif
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {formData.services.length > 0 && (
                      <div className="flex justify-between">
                        <span>Services ({formData.services.length})</span>
                        <span>
                          {formData.services.reduce((sum, nom) => {
                            const s = servicesDynamiques.find((x) => x.nom === nom)
                            return sum + (s ? s.prix : 0)
                          }, 0)} DZD
                        </span>
                      </div>
                    )}
                    {formData.plats.length > 0 && (
                      <div className="flex justify-between">
                        <span>Restauration ({formData.plats.length})</span>
                        <span>
                          {formData.plats.reduce((sum, nom) => {
                            const p = platsDynamiques.find((x) => x.nom === nom)
                            return sum + (p ? p.prix : 0)
                          }, 0)} DZD
                        </span>
                      </div>
                    )}
                    <hr className="border-green-300" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{prixTotal} DZD</span>
                    </div>
                  </CardContent>
                </Card>
                <Button type="submit" className="w-full" disabled={loading || !formData.salle}>
                  {loading ? "Réservation..." : "Valider la réservation"}
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
