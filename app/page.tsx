import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import SallesSection from "@/components/salles-section"
import AvisSection from "@/components/avis-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import BackgroundElements from "@/components/background-elements"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      <BackgroundElements />
      <Header />
      <main>
        <HeroSection />
        <div className="flex justify-center my-8">
          <a href="/admin">
            <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded shadow">
              Accès Administration
            </button>
          </a>
        </div>
        <SallesSection />
        <AvisSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
