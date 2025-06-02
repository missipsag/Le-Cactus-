"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

const API_URL = "/api/admin/avis"

export default function AvisSection() {
  const [user, setUser] = useState<any>(null)
  const [note, setNote] = useState(5)
  const [commentaire, setCommentaire] = useState("")
  const [avisList, setAvisList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user")
      if (userData) setUser(JSON.parse(userData))
    }
    // Fonction pour charger les avis depuis l'API
    const fetchAvis = () => {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          if (data.avis) {
            setAvisList(data.avis.filter((a: any) => !a.deleted && !a.supprime))
          }
        })
    }
    fetchAvis()
    // Rafraîchissement toutes les 10 secondes
    const interval = setInterval(fetchAvis, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: note,
          commentaire,
          userId: user.id,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess("Merci pour votre avis !")
        setAvisList([{ id: Date.now(), userName: user.nom + " " + user.prenom[0] + ".", rating: note, commentaire, date: new Date().toISOString().slice(0,10) }, ...avisList])
        setCommentaire("")
        setNote(5)
      } else {
        setError(data.error || "Erreur lors de l'envoi de l'avis")
      }
    } catch (e) {
      setError("Erreur lors de l'envoi de l'avis")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 px-4 bg-green-50/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">Avis de nos Clients</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de leurs expériences au Cactus
          </p>
        </div>

        {user && (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12 bg-white p-6 rounded shadow space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-green-800">Votre note :</span>
              {[1,2,3,4,5].map((n) => (
                <button type="button" key={n} onClick={() => setNote(n)}>
                  <Star className={`w-6 h-6 ${n <= note ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{note} / 5</span>
            </div>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Votre commentaire..."
              value={commentaire}
              onChange={e => setCommentaire(e.target.value)}
              required
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>
              {loading ? "Envoi..." : "Laisser un avis"}
            </button>
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </form>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {avisList.map((avis) => (
            <Card key={avis.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < (avis.rating || avis.note) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">{avis.date ? new Date(avis.date).toLocaleDateString("fr-FR") : ""}</span>
                </div>
                <p className="text-gray-700 mb-4 italic">"{avis.commentaire}"</p>
                <p className="font-semibold text-green-800">- {avis.userName || avis.nom}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
