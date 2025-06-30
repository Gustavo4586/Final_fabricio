import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configurações
app.config['SECRET_KEY'] = 'educollab-secret-key-2025'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Habilitar CORS para todas as rotas
CORS(app, origins="*")

# Registrar blueprints
app.register_blueprint(user_bp, url_prefix='/api')

# Inicializar banco de dados
db.init_app(app)
with app.app_context():
    db.create_all()
    
    # Criar dados de exemplo se não existirem
    from src.models.user import User, Course, Enrollment, Note, ForumPost
    
    if User.query.count() == 0:
        # Criar usuários de exemplo
        admin = User(
            name='Administrador',
            username='admin',
            email='admin@educollab.com',
            role='admin',
            level='Coronel'
        )
        admin.set_password('admin123')
        
        instructor = User(
            name='Professor Silva',
            username='prof_silva',
            email='silva@educollab.com',
            role='tutor',
            level='Capitão'
        )
        instructor.set_password('prof123')
        
        student = User(
            name='João Silva',
            username='joao_silva',
            email='joao@educollab.com',
            role='aluno',
            level='Recruta'
        )
        student.set_password('123456')
        
        db.session.add_all([admin, instructor, student])
        db.session.commit()
        
        # Criar cursos de exemplo
        courses_data = [
            {
                'title': 'Desenvolvimento Web Completo',
                'description': 'Aprenda HTML, CSS, JavaScript e frameworks modernos',
                'category': 'Desenvolvimento Web',
                'difficulty': 'intermediario',
                'duration_hours': 40,
                'instructor_id': instructor.id
            },
            {
                'title': 'Banco de Dados Fundamentals',
                'description': 'Conceitos essenciais de bancos de dados relacionais e NoSQL',
                'category': 'Banco de Dados',
                'difficulty': 'iniciante',
                'duration_hours': 30,
                'instructor_id': instructor.id
            },
            {
                'title': 'DevOps e Containers',
                'description': 'Docker, Kubernetes e práticas de DevOps',
                'category': 'DevOps',
                'difficulty': 'avancado',
                'duration_hours': 50,
                'instructor_id': instructor.id
            }
        ]
        
        courses = []
        for course_data in courses_data:
            course = Course(**course_data)
            courses.append(course)
            db.session.add(course)
        
        db.session.commit()
        
        # Criar inscrições de exemplo
        enrollments_data = [
            {'user_id': student.id, 'course_id': courses[0].id, 'progress_percentage': 85.0},
            {'user_id': student.id, 'course_id': courses[1].id, 'progress_percentage': 72.0},
            {'user_id': student.id, 'course_id': courses[2].id, 'progress_percentage': 45.0}
        ]
        
        for enrollment_data in enrollments_data:
            enrollment = Enrollment(**enrollment_data)
            db.session.add(enrollment)
        
        db.session.commit()
        
        # Criar anotações de exemplo
        notes_data = [
            {
                'title': 'Conceitos de React',
                'content': 'React é uma biblioteca JavaScript para construir interfaces de usuário...',
                'tags': '["react", "javascript", "frontend"]',
                'is_shared': True,
                'author_id': student.id,
                'course_id': courses[0].id
            },
            {
                'title': 'SQL Básico',
                'content': 'SELECT, INSERT, UPDATE, DELETE são os comandos fundamentais...',
                'tags': '["sql", "database", "query"]',
                'is_shared': True,
                'author_id': student.id,
                'course_id': courses[1].id
            }
        ]
        
        for note_data in notes_data:
            note = Note(**note_data)
            db.session.add(note)
        
        db.session.commit()
        
        # Criar posts do fórum de exemplo
        forum_posts_data = [
            {
                'title': 'Dúvida sobre React Hooks',
                'content': 'Como usar useEffect corretamente?',
                'author_id': student.id,
                'course_id': courses[0].id
            },
            {
                'title': 'Melhores práticas em SQL',
                'content': 'Quais são as melhores práticas para otimizar queries?',
                'author_id': student.id,
                'course_id': courses[1].id
            }
        ]
        
        for post_data in forum_posts_data:
            post = ForumPost(**post_data)
            db.session.add(post)
        
        db.session.commit()
        
        print("Dados de exemplo criados com sucesso!")

# Rota de health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'EduCollab API está funcionando',
        'version': '1.0.0'
    })

# Servir arquivos estáticos do frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return jsonify({'message': 'EduCollab API - Backend funcionando'}), 200

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({'message': 'EduCollab API - Backend funcionando'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

