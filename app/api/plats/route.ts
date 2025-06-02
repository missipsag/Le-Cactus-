import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const salleNom = searchParams.get("salle")
    if (!salleNom) {
      return NextResponse.json({ error: "Salle non spécifiée" }, { status: 400 })
    }
    const connection = await mysql.createConnection(dbConfig)
    const [salleRows] = await connection.execute("SELECT id FROM salles WHERE nom = ?", [salleNom])
    if ((salleRows as any[]).length === 0) {
      await connection.end()
      return NextResponse.json({ error: "Salle inconnue" }, { status: 404 })
    }
    const salleId = (salleRows as any[])[0].id
    const [plats] = await connection.execute("SELECT nom, prix, categorie FROM plats WHERE salle_id = ?", [salleId])
    await connection.end()
    return NextResponse.json({ plats })
  } catch (error) {
    console.error("Erreur lors de la récupération des plats:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
} 