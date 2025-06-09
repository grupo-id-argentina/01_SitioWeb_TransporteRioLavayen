import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-secondary-900 text-white pt-12 pb-6 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image src="/logo.png" alt="Transporte Río Lavayen" width={40} height={40} className="mr-3" />
              <h4 className="text-xl font-bold">Transporte Río Lavayen</h4>
            </div>
            <p className="text-gray-300 mb-4">
              Más de 30 años brindando servicios de logística y transporte de calidad en todo el país.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#servicios" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/convenios" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Convenios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/calculadora" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Calculadora de Envíos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Contacto Casa Central</h4>
            <div className="space-y-3">
              <p className="flex items-start">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-primary-400" />
                <span>3888 44-6213 (Administración)</span>
              </p>
              <p className="flex items-start">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-primary-400" />
                <span>3888 51-6860 (Logística)</span>
              </p>
              <p className="flex items-start">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-primary-400" />
                <span>tteriolavayensanpedro@gmail.com</span>
              </p>
              <p className="flex items-start">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-primary-400" />
                <span>3888 43-5275 (Comercial)</span>
              </p>
              <p className="flex items-start">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-primary-400" />
                <span>consulta.tteriolavayen@gmail.com</span>
              </p>
            </div>
          </div>

          
          

          <div>
            <h4 className="text-xl font-bold mb-4">Horarios de Atención</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Lunes a Viernes</li>
              <li> &#10145; 8:00 - 13:00 | 16:00 - 19:00</li>
              <li>Sábados y feriados</li>
              <li> &#10145; 9:00 - 13:00</li>
              <li>Domingos</li>
              <li>&#10145; Sólo logística</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Transporte Río Lavayen. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
