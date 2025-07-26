# Sistema de Chatbot para Trámites - Ayuntamiento de Tarragona

## TechTalent Hackathon Inetum 2025

Sistema completo de asistente digital para facilitar los trámites administrativos del Ayuntamiento de Tarragona mediante un chatbot inteligente que ayuda a completar formularios PDF.

## 🚀 Características

- **Frontend**: React + TypeScript con Vite
- **Backend**: Flask (Python) con API REST
- **Base de datos**: MySQL
- **IA**: Integración con Ollama (modelo liviano)
- **Funcionalidades**:
  - Chat inteligente en catalán/español
  - Procesamiento automático de formularios PDF
  - Sistema de gestión de sesiones
  - Generación de PDFs completados
  - Dashboard de estadísticas

## 📋 Requisitos previos

### Sistema
- Node.js 18+ y npm
- Python 3.9+
- MySQL 8.0+
- Ollama instalado

### Ollama Setup
```bash
# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Descargar modelo liviano
ollama pull llama3.2:1b
```

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repo-url>
cd tarragona-chatbot-hackathon
```

### 2. Configurar Frontend
```bash
# Instalar dependencias (ya hecho)
npm install

# Crear archivo de entorno
cp .env.example .env

# Editar .env con tus configuraciones
```

### 3. Configurar Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo de entorno
cp ../.env.example .env
```

### 4. Configurar Base de Datos
```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar script de configuración
mysql -u root -p < database_setup.sql
```

### 5. Inicializar Ollama
```bash
# Asegurar que Ollama está ejecutándose
ollama serve

# En otra terminal, verificar modelo
ollama list
```

## 🚀 Ejecución

### Desarrollo local

1. **Iniciar Backend**:
```bash
cd backend
source venv/bin/activate
python app.py
```

2. **Iniciar Frontend**:
```bash
npm run dev
```

3. **Verificar Ollama**:
```bash
ollama serve
```

### URLs de desarrollo
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Ollama: http://localhost:11434

## 📁 Estructura del proyecto

```
tarragona-chatbot-hackathon/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── chat/                # Componentes del chat
│   │   ├── forms/               # Selector de formularios
│   │   ├── layout/              # Header, Footer
│   │   └── ui/                  # Componentes reutilizables
│   ├── hooks/                   # React hooks personalizados
│   ├── lib/                     # Utilidades y API client
│   └── types/                   # Definiciones TypeScript
├── backend/                     # Backend Flask
│   ├── app.py                   # Aplicación principal
│   ├── config.py                # Configuración
│   ├── requirements.txt         # Dependencias Python
│   └── uploads/                 # Archivos generados
├── database_setup.sql           # Script de inicialización BD
└── README.md                    # Este archivo
```

## 🔧 Configuración de entorno

### Variables de entorno (.env)
```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend
FLASK_ENV=development
DATABASE_URL=mysql://root:password@localhost:3306/tarragona_tramits
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
SECRET_KEY=tu-clave-secreta-aqui
```

## 📋 Formularios disponibles

1. **Sol·licitud Genèrica**: Formulario general administrativo
2. **Certificat de Residència**: Certificado de empadronamiento  
3. **Llicència d'Obres Menors**: Licencias de obras menores

## 🧪 Testing

### Frontend
```bash
npm run test
```

### Backend
```bash
cd backend
python -m pytest
```

## 📊 API Endpoints

- `GET /api/forms/templates` - Obtener plantillas de formularios
- `POST /api/chat/session` - Crear nueva sesión de chat
- `GET /api/chat/session/{id}` - Obtener sesión específica
- `POST /api/chat/{id}/message` - Enviar mensaje
- `POST /api/chat/{id}/generate-pdf` - Generar PDF completado

## 🎯 Características del Hackathon

- **Multiidioma**: Soporte catalán/español
- **Responsive**: Funciona en móvil, tablet y desktop
- **Accesible**: Cumple estándares de accesibilidad
- **Performante**: Optimizado para dispositivos lentos
- **Escalable**: Arquitectura modular y extensible

## 🔍 Troubleshooting

### Problemas comunes

1. **Error de conexión Ollama**:
   ```bash
   ollama serve
   curl http://localhost:11434/api/tags
   ```

2. **Error de base de datos**:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

3. **Puerto ocupado**:
   ```bash
   lsof -ti :5000 | xargs kill -9
   lsof -ti :5173 | xargs kill -9
   ```

## 🏆 Hackathon Team

Desarrollado para el TechTalent Hackathon de Inetum en Tarragona 2025.

## 📄 Licencia

Proyecto desarrollado específicamente para el hackathon. Todos los derechos reservados al Ajuntament de Tarragona e Inetum.

## 🤝 Contribución

Este proyecto fue creado para el hackathon. Para sugerencias post-evento, contactar con el equipo de desarrollo.

---

**¡Listos para el hackathon! 🚀**