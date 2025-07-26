import { motion } from 'framer-motion';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  category: string;
}

interface FormSelectorProps {
  onSelectForm: (formId: string) => void;
  isLoading?: boolean;
}

const MOCK_FORMS: FormTemplate[] = [
  {
    id: 'solicitud-generica',
    name: 'Sol·licitud Genèrica',
    description: 'Formulari general per a qualsevol tipus de sol·licitud administrativa',
    estimatedTime: '5-10 min',
    category: 'General',
  },
  {
    id: 'certificado-residencia',
    name: 'Certificat de Residència',
    description: 'Sol·licitud de certificat d\'empadronament i residència',
    estimatedTime: '3-5 min',
    category: 'Certificats',
  },
  {
    id: 'licencia-obras',
    name: 'Llicència d\'Obres Menors',
    description: 'Tramitació de llicències per a obres menors i reformes',
    estimatedTime: '10-15 min',
    category: 'Urbanisme',
  },
];

export default function FormSelector({ onSelectForm, isLoading }: FormSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Assistent de Tràmits
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Selecciona el tipus de formulari que necessites completar. 
          El nostre assistent t'ajudarà pas a pas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_FORMS.map((form, index) => (
          <motion.div
            key={form.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {form.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {form.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {form.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {form.estimatedTime}
                </div>
                
                <Button
                  onClick={() => onSelectForm(form.id)}
                  isLoading={isLoading}
                  size="sm"
                  className="group-hover:bg-blue-700 transition-colors"
                >
                  <span className="mr-1">Començar</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Com funciona?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                <span className="font-semibold">1</span>
              </div>
              <p>Selecciona el formulari</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                <span className="font-semibold">2</span>
              </div>
              <p>Respon les preguntes</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mb-2">
                <span className="font-semibold">3</span>
              </div>
              <p>Descarrega el PDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}