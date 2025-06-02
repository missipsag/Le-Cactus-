import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const salle = searchParams.get("salle")
  if (!salle) {
    return NextResponse.json({ error: "Paramètre 'salle' manquant" }, { status: 400 })
  }
  // On cible le dossier public/{salle}
  const dirPath = path.join(process.cwd(), "public", salle)
  let files: string[] = []
  try {
    files = fs.readdirSync(dirPath)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .map(f => `/${salle}/${f}`)
  } catch (e) {
    return NextResponse.json({ images: [] })
  }
  return NextResponse.json({ images: files })
} 