import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const salle = searchParams.get("salle")
    if (!salle) {
      return NextResponse.json({ error: "Salle non spécifiée" }, { status: 400 })
    }
    const connection = await mysql.createConnection(dbConfig)
    // Récupérer l'id de la salle
    const [salleRows] = await connection.execute("SELECT id FROM salles WHERE nom = ?", [salle])
    if ((salleRows as any[]).length === 0) {
      await connection.end()
      return NextResponse.json({ error: "Salle inconnue" }, { status: 404 })
    }
    const salleId = (salleRows as any[])[0].id
    // Récupérer les réservations pour cette salle
    const [rows] = await connection.execute(
      "SELECT date, heure_debut FROM reservations WHERE salle_id = ? AND status != 'rejetee'",
      [salleId]
    )
    await connection.end()
    return NextResponse.json({ reservations: rows })
  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
} 