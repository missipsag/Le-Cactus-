import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">Contactez-nous</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-800">Adresse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tizi Ouzou, Algérie
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-800">Téléphone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                +213 770 12 34 56
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-800">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                contact@lecactus.ma
                <br />
                reservation@lecactus.ma
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-800">Horaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Toujours disponible
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
