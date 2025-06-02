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
    const { nom, prenom, dateNaissance, telephone, carteIdentite, email, password } = await request.json()

    const connection = await mysql.createConnection(dbConfig)

    // Vérifier si l'email existe déjà
    const [existingUsers] = await connection.execute("SELECT id FROM users WHERE email = ?", [email])

    if ((existingUsers as any[]).length > 0) {
      await connection.end()
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Créer le nouvel utilisateur
    const [result] = await connection.execute(
      "INSERT INTO users (nom, prenom, date_naissance, telephone, carte_identite, email, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nom, prenom, dateNaissance, telephone, carteIdentite, email, password],
    )

    const insertResult = result as any
    const userId = insertResult.insertId

    await connection.end()

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        nom,
        prenom,
        email,
        telephone,
        carteIdentite,
        dateNaissance,
      },
    })
  } catch (error: any) {
    console.error("Erreur d'inscription:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de l'inscription" }, { status: 500 })
  }
}
