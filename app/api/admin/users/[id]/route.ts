import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const connection = await mysql.createConnection(dbConfig)

    // Supprimer d'abord les réservations de l'utilisateur
    await connection.execute("DELETE FROM reservations WHERE user_id = ?", [id])

    // Puis supprimer l'utilisateur
    await connection.execute("DELETE FROM users WHERE id = ?", [id])

    await connection.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
