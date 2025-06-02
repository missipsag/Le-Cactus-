import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12 px-4 relative">
      {/* Vagues SVG en haut du footer */}
      <div className="absolute top-0 left-0 w-full">
        <svg viewBox="0 0 1200 60" className="w-full h-15 fill-green-800">
          <path d="M0,60 C300,0 900,60 1200,0 L1200,60 Z" />
        </svg>
      </div>

      <div className="container mx-auto pt-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-green-800 font-bold">🌵</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Le Cactus</h3>
                <p className="text-sm opacity-80" style={{ fontFamily: "Noto Sans Tifinagh, sans-serif" }}>
                  ⵍⴽⴰⴽⵜⵓⵙ
                </p>
              </div>
            </div>
            <p className="text-green-100">
              Votre destination de choix pour des événements mémorables dans un cadre exceptionnel.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-100 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/salles" className="text-green-100 hover:text-white transition-colors">
                  Nos Salles
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="text-green-100 hover:text-white transition-colors">
                  Réservation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-green-100">Salle de Conférence</span>
              </li>
              <li>
                <span className="text-green-100">Salle de Mariage</span>
              </li>
              <li>
                <span className="text-green-100">Salle d'Événement</span>
              </li>
              <li>
                <span className="text-green-100">Services Traiteur</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-green-100">
              <p>Tizi Ouzou, Algérie</p>
              <p>+213 770 12 34 56</p>
              <p>contact@lecactus.ma</p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-green-100">© 2024 Le Cactus. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
