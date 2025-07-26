import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ajuntament de Tarragona</h3>
                <p className="text-gray-400 text-sm">Assistent Digital</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Facilitant els tràmits administratius amb tecnologia d'intel·ligència artificial 
              per oferir un servei més àgil i accessible a la ciutadania.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacte</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Plaça de la Font, 1, 43003 Tarragona</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>977 296 100</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>info@tarragona.cat</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enllaços útils</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Seu Electrònica
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Tràmits en línia
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Normativa
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Accessibilitat
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Privacitat
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Ajuntament de Tarragona. Tots els drets reservats. 
            Desenvolupat per al TechTalent Hackathon Inetum.
          </p>
        </div>
      </div>
    </footer>
  );
}