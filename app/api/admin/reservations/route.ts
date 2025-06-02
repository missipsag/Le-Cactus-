import { type NextRequest, NextResponse } from "next/server"
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
      SELECT r.*, u.nom as user_nom, u.prenom as user_prenom, u.email as user_email, s.nom as salle_nom
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN salles s ON r.salle_id = s.id
      ORDER BY r.date DESC
    `)
    // Pour chaque réservation, récupérer les plats et services associés
    const reservations = []
    for (const row of rows as any[]) {
      // Plats
      const [platsRows] = await connection.execute(
        `SELECT p.nom FROM reservation_plat rp JOIN plats p ON rp.plat_id = p.id WHERE rp.reservation_id = ?`,
        [row.id],
      )
      // Services
      const [servicesRows] = await connection.execute(
        `SELECT s.nom FROM reservation_service rs JOIN services s ON rs.service_id = s.id WHERE rs.reservation_id = ?`,
        [row.id],
      )
      reservations.push({
        id: row.id,
        userId: row.user_id,
        userName: `${row.user_prenom} ${row.user_nom}`,
        userEmail: row.user_email,
        salle: row.salle_nom,
        date: row.date,
        heureDebut: row.heure_debut,
        duree: row.duree,
        plats: platsRows.map((p: any) => p.nom),
        services: servicesRows.map((s: any) => s.nom),
        prixTotal: row.total,
        status: row.status,
        messageAdmin: row.admin_message,
        createdAt: row.date,
      })
    }
    await connection.end()
    return NextResponse.json({ reservations })
  } catch (error) {
    console.error("Erreur lors du chargement des réservations admin:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des réservations" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, messageAdmin } = await request.json()
    const connection = await mysql.createConnection(dbConfig)
    await connection.execute("UPDATE reservations SET status = ?, admin_message = ? WHERE id = ?", [status, messageAdmin || null, id])
    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}
