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

    await connection.execute("DELETE FROM reservations WHERE id = ?", [id])

    await connection.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
