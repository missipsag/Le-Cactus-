import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"
const dbConfig = {
  host: "127.0.0.1",
  user: "missipsa",
  password: "missipsa",
  database: "le_cactus_db",
}

// Helper pour récupérer l'id d'une salle à partir de son nom (ex: "conference")
async function getSalleIdByNom(nom: string, connection: any) {
  const [rows] = await connection.execute("SELECT id FROM salles WHERE nom = ?", [nom])
  if ((rows as any[]).length > 0) return (rows as any[])[0].id
  throw new Error("Salle non trouvée")
}

export async function POST(request: NextRequest) {
  try {
    const { salle, date, heureDebut, duree, services, plats, prixTotal, userId } = await request.json()
    const connection = await mysql.createConnection(dbConfig)

    // Récupérer l'id de la salle
    const salleId = await getSalleIdByNom(salle, connection)

    // Forcer le format de l'heure de début pour le champ TIME
    let heureDebutSQL = heureDebut
    if (typeof heureDebut === 'number') {
      heureDebutSQL = heureDebut.toString().padStart(2, '0') + ':00'
    } else if (/^\d{1,2}$/.test(heureDebut)) {
      heureDebutSQL = heureDebut.padStart(2, '0') + ':00'
    }

    // Vérifier si le créneau est disponible
    const [existingReservations] = await connection.execute(
      "SELECT id FROM reservations WHERE salle_id = ? AND date = ? AND heure_debut = ?",
      [salleId, date, heureDebutSQL],
    )
    if ((existingReservations as any[]).length > 0) {
      await connection.end()
      return NextResponse.json({ error: "Ce créneau n'est pas disponible" }, { status: 400 })
    }

    // Vérification des champs obligatoires
    if (!heureDebutSQL || heureDebutSQL === "") {
      await connection.end()
      return NextResponse.json({ error: "Veuillez sélectionner une heure de début." }, { status: 400 })
    }
    if (!userId || isNaN(Number(userId))) {
      await connection.end()
      return NextResponse.json({ error: "Utilisateur non authentifié ou invalide. Veuillez vous reconnecter." }, { status: 400 })
    }

    // Créer la réservation
    const [result] = await connection.execute(
      "INSERT INTO reservations (user_id, salle_id, date, heure_debut, duree, total, status) VALUES (?, ?, ?, ?, ?, ?, 'en_attente')",
      [userId, salleId, date, heureDebutSQL, duree, prixTotal],
    )
    const reservationId = (result as any).insertId

    // Insérer les plats dans la table de liaison
    if (plats && plats.length > 0) {
      for (const platNom of plats) {
        const [platRows] = await connection.execute("SELECT id FROM plats WHERE nom = ? AND salle_id = ?", [platNom, salleId])
        if ((platRows as any[]).length > 0) {
          await connection.execute("INSERT INTO reservation_plat (reservation_id, plat_id) VALUES (?, ?)", [reservationId, (platRows as any[])[0].id])
        }
      }
    }
    // Insérer les services dans la table de liaison
    if (services && services.length > 0) {
      for (const serviceNom of services) {
        const [serviceRows] = await connection.execute("SELECT id FROM services WHERE nom = ? AND salle_id = ?", [serviceNom, salleId])
        if ((serviceRows as any[]).length > 0) {
          await connection.execute("INSERT INTO reservation_service (reservation_id, service_id) VALUES (?, ?)", [reservationId, (serviceRows as any[])[0].id])
        }
      }
    }
    await connection.end()
    return NextResponse.json({ success: true, reservationId })
  } catch (error) {
    console.error("Erreur de réservation:", error)
    return NextResponse.json({ error: "Erreur lors de la réservation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const connection = await mysql.createConnection(dbConfig)
    // Récupérer les réservations de l'utilisateur avec les infos salle, plats, services
    const [rows] = await connection.execute(
      `SELECT r.*, s.nom as salle_nom FROM reservations r JOIN salles s ON r.salle_id = s.id WHERE r.user_id = ? ORDER BY r.date DESC`,
      [userId],
    )
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
    console.error("Erreur lors du chargement des réservations:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des réservations" }, { status: 500 })
  }
}
