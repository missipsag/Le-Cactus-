import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function POST(request: NextRequest) {
  try {
    const { rating, commentaire, userId } = await request.json()
    if (!rating || !commentaire || !userId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }
    const connection = await mysql.createConnection(dbConfig)
    const date = new Date().toISOString().slice(0, 10)
    await connection.execute(
      "INSERT INTO avis (rating, commentaire, date, user_id) VALUES (?, ?, ?, ?)",
      [rating, commentaire, date, userId]
    )
    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'avis:", error)
    return NextResponse.json({ error: "Erreur lors de l'ajout de l'avis" }, { status: 500 })
  }
} 