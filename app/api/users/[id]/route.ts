import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const connection = await mysql.createConnection(dbConfig)
    // Suppression de l'utilisateur (les réservations et avis sont supprimés en cascade)
    await connection.execute("DELETE FROM users WHERE id = ?", [userId])
    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du compte" }, { status: 500 })
  }
} 