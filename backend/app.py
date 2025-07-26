import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import ollama
import json
from datetime import datetime
import uuid
from io import BytesIO
import tempfile

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql://root:password@localhost:3306/tarragona_tramits')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', './uploads')
app.config['PDF_TEMPLATES_FOLDER'] = os.getenv('PDF_TEMPLATES_FOLDER', './pdf_templates')

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Ollama configuration
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2:1b')

# Database Models
class ChatSession(db.Model):
    __tablename__ = 'chat_sessions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    form_type = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='active')  # active, completed, cancelled
    form_data = db.Column(db.Text)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = db.relationship('ChatMessage', backref='session', lazy=True, cascade='all, delete-orphan')

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = db.Column(db.String(36), db.ForeignKey('chat_sessions.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    metadata = db.Column(db.Text)  # JSON string for additional data
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Form Templates Configuration
FORM_TEMPLATES = {
    'solicitud-generica': {
        'name': 'Sol·licitud Genèrica',
        'fields': [
            {'name': 'nom_cognoms', 'label': 'Nom i cognoms', 'type': 'text', 'required': True},
            {'name': 'dni', 'label': 'DNI/NIE', 'type': 'text', 'required': True},
            {'name': 'telefon', 'label': 'Telèfon', 'type': 'phone', 'required': True},
            {'name': 'email', 'label': 'Correu electrònic', 'type': 'email', 'required': True},
            {'name': 'adreca', 'label': 'Adreça', 'type': 'text', 'required': True},
            {'name': 'motiu_solicitud', 'label': 'Motiu de la sol·licitud', 'type': 'text', 'required': True},
            {'name': 'documentacio_adjunta', 'label': 'Documentació que s\'adjunta', 'type': 'text', 'required': False},
        ],
        'system_prompt': """Ets un assistent administratiu de l'Ajuntament de Tarragona. 
        Ajudes els ciutadans a completar formularis de sol·licituds genèriques.
        
        Pregunta les dades necessàries de manera amable i professional:
        - Nom i cognoms complets
        - DNI o NIE
        - Telèfon de contacte
        - Correu electrònic
        - Adreça completa
        - Motiu detallat de la sol·licitud
        - Documentació que adjuntaran (opcional)
        
        Fes les preguntes d'una en una i valida les respostes abans de continuar.
        Parla sempre en català."""
    }
}

# Ollama Integration
def get_ollama_response(prompt, context=""):
    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[
                {
                    'role': 'system',
                    'content': context
                },
                {
                    'role': 'user', 
                    'content': prompt
                }
            ]
        )
        return response['message']['content']
    except Exception as e:
        print(f"Ollama error: {e}")
        return "Ho sento, hi ha hagut un problema tècnic. Si us plau, torneu-ho a intentar."

def extract_form_data(message, current_data, form_template):
    """Extract structured data from user message using Ollama"""
    fields = form_template['fields']
    field_names = [f['name'] for f in fields]
    
    prompt = f"""
    Extreu les dades del següent missatge i retorna'ls en format JSON.
    Missatge de l'usuari: "{message}"
    
    Dades actuals: {json.dumps(current_data, ensure_ascii=False)}
    
    Camps disponibles: {field_names}
    
    Retorna només el JSON amb les noves dades o dades actualitzades.
    Si no hi ha dades noves, retorna un objecte buit {{}}.
    """
    
    try:
        response = get_ollama_response(prompt)
        # Try to extract JSON from response
        start = response.find('{')
        end = response.rfind('}') + 1
        if start >= 0 and end > start:
            json_str = response[start:end]
            return json.loads(json_str)
        return {}
    except:
        return {}

# API Routes
@app.route('/api/forms/templates', methods=['GET'])
def get_form_templates():
    templates = []
    for key, value in FORM_TEMPLATES.items():
        templates.append({
            'id': key,
            'name': value['name'],
            'description': value.get('description', ''),
            'fields': value['fields']
        })
    
    return jsonify({
        'status': 'success',
        'data': templates,
        'message': 'Form templates retrieved successfully'
    })

@app.route('/api/chat/session', methods=['POST'])
def create_chat_session():
    data = request.get_json()
    form_type = data.get('formType')
    
    if form_type not in FORM_TEMPLATES:
        return jsonify({
            'status': 'error',
            'message': 'Invalid form type'
        }), 400
    
    # Create new session
    session = ChatSession(
        form_type=form_type,
        form_data=json.dumps({})
    )
    
    db.session.add(session)
    db.session.commit()
    
    # Create welcome message
    form_template = FORM_TEMPLATES[form_type]
    welcome_msg = f"""Hola! Sóc l'assistent de l'Ajuntament de Tarragona. 
    
T'ajudaré a completar el formulari: {form_template['name']}.

Per començar, pots dir-me el teu nom complet?"""
    
    welcome_message = ChatMessage(
        session_id=session.id,
        content=welcome_msg,
        sender='bot'
    )
    
    db.session.add(welcome_message)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'data': {
            'id': session.id,
            'formType': session.form_type,
            'status': session.status,
            'formData': json.loads(session.form_data),
            'messages': [{
                'id': welcome_message.id,
                'content': welcome_message.content,
                'sender': welcome_message.sender,
                'timestamp': welcome_message.timestamp.isoformat()
            }],
            'createdAt': session.created_at.isoformat(),
            'updatedAt': session.updated_at.isoformat()
        },
        'message': 'Chat session created successfully'
    })

@app.route('/api/chat/session/<session_id>', methods=['GET'])
def get_chat_session(session_id):
    session = ChatSession.query.get_or_404(session_id)
    
    messages = []
    for message in session.messages:
        messages.append({
            'id': message.id,
            'content': message.content,
            'sender': message.sender,
            'timestamp': message.timestamp.isoformat(),
            'metadata': json.loads(message.metadata) if message.metadata else None
        })
    
    return jsonify({
        'status': 'success',
        'data': {
            'id': session.id,
            'formType': session.form_type,
            'status': session.status,
            'formData': json.loads(session.form_data),
            'messages': messages,
            'createdAt': session.created_at.isoformat(),
            'updatedAt': session.updated_at.isoformat()
        },
        'message': 'Session retrieved successfully'
    })

@app.route('/api/chat/<session_id>/message', methods=['POST'])
def send_message(session_id):
    session = ChatSession.query.get_or_404(session_id)
    data = request.get_json()
    message_content = data.get('message', '').strip()
    
    if not message_content:
        return jsonify({
            'status': 'error',
            'message': 'Message content is required'
        }), 400
    
    # Save user message
    user_message = ChatMessage(
        session_id=session_id,
        content=message_content,
        sender='user'
    )
    db.session.add(user_message)
    
    # Get form template and current data
    form_template = FORM_TEMPLATES[session.form_type]
    current_data = json.loads(session.form_data)
    
    # Extract form data from message
    new_data = extract_form_data(message_content, current_data, form_template)
    updated_data = {**current_data, **new_data}
    
    # Generate bot response
    context = form_template['system_prompt']
    conversation_context = f"""
    Dades recollides fins ara: {json.dumps(updated_data, ensure_ascii=False)}
    Camps pendents: {[f['name'] for f in form_template['fields'] if f['name'] not in updated_data]}
    
    Missatge de l'usuari: {message_content}
    """
    
    bot_response = get_ollama_response(conversation_context, context)
    
    # Save bot message
    bot_message = ChatMessage(
        session_id=session_id,
        content=bot_response,
        sender='bot'
    )
    db.session.add(bot_message)
    
    # Update session data
    session.form_data = json.dumps(updated_data)
    
    # Check if form is complete
    required_fields = [f['name'] for f in form_template['fields'] if f.get('required', False)]
    if all(field in updated_data for field in required_fields):
        session.status = 'completed'
    
    session.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'data': {
            'id': bot_message.id,
            'content': bot_message.content,
            'sender': bot_message.sender,
            'timestamp': bot_message.timestamp.isoformat()
        },
        'message': 'Message processed successfully'
    })

@app.route('/api/chat/<session_id>/generate-pdf', methods=['POST'])
def generate_pdf(session_id):
    session = ChatSession.query.get_or_404(session_id)
    form_data = json.loads(session.form_data)
    
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import A4
        
        # Create PDF in memory
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        
        # Add content to PDF
        y_position = 800
        p.drawString(50, y_position, f"SOL·LICITUD GENÈRICA - AJUNTAMENT DE TARRAGONA")
        y_position -= 40
        
        p.drawString(50, y_position, f"Data: {datetime.now().strftime('%d/%m/%Y')}")
        y_position -= 40
        
        # Add form data
        for field_name, value in form_data.items():
            if value:
                field_label = next((f['label'] for f in FORM_TEMPLATES[session.form_type]['fields'] if f['name'] == field_name), field_name)
                p.drawString(50, y_position, f"{field_label}: {value}")
                y_position -= 25
        
        p.showPage()
        p.save()
        
        buffer.seek(0)
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f'solicitud_{session_id}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error generating PDF: {str(e)}'
        }), 500

# Initialize database
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    # Ensure upload folders exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PDF_TEMPLATES_FOLDER'], exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5000)