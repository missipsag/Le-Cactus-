import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    const [rows] = await connection.execute(`
      SELECT a.*, u.nom, u.prenom 
      FROM avis a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.date DESC
    `)
    await connection.end()
    const avis = (rows as any[]).map((row) => ({
      id: row.id,
      userName: `${row.prenom} ${row.nom}`,
      rating: row.rating,
      commentaire: row.commentaire,
      date: row.date,
      deleted: !!row.deleted,
    }))
    return NextResponse.json({ avis })
  } catch (error) {
    console.error("Erreur lors du chargement des avis:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des avis" }, { status: 500 })
  }
}
