import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const connection = await mysql.createConnection(dbConfig)

    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ? AND mot_de_passe = ?", [email, password])

    await connection.end()

    const users = rows as any[]

    if (users.length > 0) {
      const user = users[0]
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          telephone: user.telephone,
          carteIdentite: user.carte_identite,
          dateNaissance: user.date_naissance,
        },
      })
    } else {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return NextResponse.json({ error: "Erreur de connexion à la base de données" }, { status: 500 })
  }
}
