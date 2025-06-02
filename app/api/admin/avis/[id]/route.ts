import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { definitif } = await request.json()
    const { id } = await params;
    const connection = await mysql.createConnection(dbConfig)

    if (definitif) {
      // Suppression définitive
      await connection.execute("DELETE FROM avis WHERE id = ?", [id])
    } else {
      // Marquer comme supprimé (soft delete)
      await connection.execute("UPDATE avis SET deleted = 1 WHERE id = ?", [id])
    }

    await connection.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'avis:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
