import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Ajuntament de Tarragona
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Assistent Digital de Tràmits
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Inici
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Tràmits
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Ajuda
            </a>
            <Button variant="outline" size="sm">
              Seu Electrònica
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-3">
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Inici
              </a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Tràmits
              </a>
              <a href="#" className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Ajuda
              </a>
              <Button variant="outline" size="sm" className="mt-2">
                Seu Electrònica
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}