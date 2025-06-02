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

    const [rows] = await connection.execute(
      "SELECT id, nom, prenom, email, telephone, carte_identite, date_naissance FROM users ORDER BY id DESC",
    )

    await connection.end()

    const users = (rows as any[]).map((row) => ({
      id: row.id,
      nom: row.nom,
      prenom: row.prenom,
      email: row.email,
      telephone: row.telephone,
      carteIdentite: row.carte_identite,
      dateNaissance: row.date_naissance,
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des utilisateurs" }, { status: 500 })
  }
}
