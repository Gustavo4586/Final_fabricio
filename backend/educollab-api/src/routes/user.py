from flask import Blueprint, jsonify, request
from datetime import datetime
from src.models.user import User, Course, Enrollment, Note, ForumPost, ForumComment, db
import json

user_bp = Blueprint('user', __name__)

# Rotas de Autenticação
@user_bp.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Verificar se o usuário já existe
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        if User.query.filter_by(username=data.get('username', data['email'])).first():
            return jsonify({'error': 'Username já existe'}), 400
        
        # Criar novo usuário
        user = User(
            name=data['name'],
            username=data.get('username', data['email']),
            email=data['email'],
            role=data.get('role', 'aluno')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'message': 'Login realizado com sucesso',
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de Usuários
@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.filter_by(is_active=True).all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.json
        
        user.name = data.get('name', user.name)
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        user.level = data.get('level', user.level)
        user.avatar = data.get('avatar', user.avatar)
        
        if 'password' in data:
            user.set_password(data['password'])
        
        db.session.commit()
        return jsonify(user.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        user.is_active = False  # Soft delete
        db.session.commit()
        return jsonify({'message': 'Usuário desativado com sucesso'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de Cursos
@user_bp.route('/courses', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.filter_by(is_active=True).all()
        return jsonify([course.to_dict() for course in courses])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/courses', methods=['POST'])
def create_course():
    try:
        data = request.json
        course = Course(
            title=data['title'],
            description=data.get('description'),
            category=data['category'],
            difficulty=data.get('difficulty', 'iniciante'),
            duration_hours=data.get('duration_hours', 0),
            instructor_id=data['instructor_id']
        )
        
        db.session.add(course)
        db.session.commit()
        
        return jsonify(course.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    try:
        course = Course.query.get_or_404(course_id)
        return jsonify(course.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    try:
        course = Course.query.get_or_404(course_id)
        data = request.json
        
        course.title = data.get('title', course.title)
        course.description = data.get('description', course.description)
        course.category = data.get('category', course.category)
        course.difficulty = data.get('difficulty', course.difficulty)
        course.duration_hours = data.get('duration_hours', course.duration_hours)
        course.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(course.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        course = Course.query.get_or_404(course_id)
        course.is_active = False  # Soft delete
        db.session.commit()
        return jsonify({'message': 'Curso desativado com sucesso'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de Inscrições
@user_bp.route('/enrollments', methods=['POST'])
def create_enrollment():
    try:
        data = request.json
        
        # Verificar se já existe inscrição
        existing = Enrollment.query.filter_by(
            user_id=data['user_id'],
            course_id=data['course_id']
        ).first()
        
        if existing:
            return jsonify({'error': 'Usuário já inscrito neste curso'}), 400
        
        enrollment = Enrollment(
            user_id=data['user_id'],
            course_id=data['course_id']
        )
        
        db.session.add(enrollment)
        db.session.commit()
        
        return jsonify(enrollment.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>/enrollments', methods=['GET'])
def get_user_enrollments(user_id):
    try:
        enrollments = Enrollment.query.filter_by(user_id=user_id, is_active=True).all()
        return jsonify([enrollment.to_dict() for enrollment in enrollments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de Anotações
@user_bp.route('/notes', methods=['GET'])
def get_notes():
    try:
        user_id = request.args.get('user_id')
        course_id = request.args.get('course_id')
        shared_only = request.args.get('shared_only', 'false').lower() == 'true'
        
        query = Note.query.filter_by(is_active=True)
        
        if user_id:
            query = query.filter_by(author_id=user_id)
        if course_id:
            query = query.filter_by(course_id=course_id)
        if shared_only:
            query = query.filter_by(is_shared=True)
        
        notes = query.all()
        return jsonify([note.to_dict() for note in notes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/notes', methods=['POST'])
def create_note():
    try:
        data = request.json
        note = Note(
            title=data['title'],
            content=data['content'],
            tags=data.get('tags'),
            is_shared=data.get('is_shared', False),
            author_id=data['author_id'],
            course_id=data.get('course_id')
        )
        
        db.session.add(note)
        db.session.commit()
        
        return jsonify(note.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    try:
        note = Note.query.get_or_404(note_id)
        data = request.json
        
        note.title = data.get('title', note.title)
        note.content = data.get('content', note.content)
        note.tags = data.get('tags', note.tags)
        note.is_shared = data.get('is_shared', note.is_shared)
        note.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(note.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas do Fórum
@user_bp.route('/forum/posts', methods=['GET'])
def get_forum_posts():
    try:
        course_id = request.args.get('course_id')
        
        query = ForumPost.query.filter_by(is_active=True)
        if course_id:
            query = query.filter_by(course_id=course_id)
        
        posts = query.order_by(ForumPost.created_at.desc()).all()
        return jsonify([post.to_dict() for post in posts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/forum/posts', methods=['POST'])
def create_forum_post():
    try:
        data = request.json
        post = ForumPost(
            title=data['title'],
            content=data['content'],
            author_id=data['author_id'],
            course_id=data['course_id']
        )
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify(post.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/forum/posts/<int:post_id>/comments', methods=['GET'])
def get_post_comments(post_id):
    try:
        comments = ForumComment.query.filter_by(post_id=post_id, is_active=True).all()
        return jsonify([comment.to_dict() for comment in comments])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/forum/posts/<int:post_id>/comments', methods=['POST'])
def create_comment(post_id):
    try:
        data = request.json
        comment = ForumComment(
            content=data['content'],
            author_id=data['author_id'],
            post_id=post_id,
            parent_id=data.get('parent_id')
        )
        
        db.session.add(comment)
        db.session.commit()
        
        return jsonify(comment.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rotas de Dashboard/Estatísticas
@user_bp.route('/users/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    try:
        # Cursos concluídos
        completed_courses = Enrollment.query.filter_by(
            user_id=user_id, 
            is_active=True
        ).filter(Enrollment.completed_at.isnot(None)).count()
        
        # Anotações criadas
        notes_count = Note.query.filter_by(author_id=user_id, is_active=True).count()
        
        # Posts no fórum
        forum_posts = ForumPost.query.filter_by(author_id=user_id, is_active=True).count()
        
        # Progresso médio
        enrollments = Enrollment.query.filter_by(user_id=user_id, is_active=True).all()
        avg_progress = sum(e.progress_percentage for e in enrollments) / len(enrollments) if enrollments else 0
        
        return jsonify({
            'completed_courses': completed_courses,
            'notes_count': notes_count,
            'forum_posts': forum_posts,
            'average_progress': round(avg_progress, 2),
            'total_enrollments': len(enrollments)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rota de Recomendações
@user_bp.route('/users/<int:user_id>/recommendations', methods=['GET'])
def get_recommendations(user_id):
    try:
        # Buscar cursos que o usuário não está inscrito
        enrolled_courses = db.session.query(Enrollment.course_id).filter_by(user_id=user_id).subquery()
        
        # Recomendar cursos da mesma categoria dos cursos que o usuário já fez
        user_categories = db.session.query(Course.category).join(Enrollment).filter(
            Enrollment.user_id == user_id
        ).distinct().all()
        
        categories = [cat[0] for cat in user_categories]
        
        if categories:
            recommended_courses = Course.query.filter(
                Course.category.in_(categories),
                Course.id.notin_(enrolled_courses),
                Course.is_active == True
            ).limit(5).all()
        else:
            # Se não tem histórico, recomendar cursos populares
            recommended_courses = Course.query.filter(
                Course.id.notin_(enrolled_courses),
                Course.is_active == True
            ).limit(5).all()
        
        return jsonify([course.to_dict() for course in recommended_courses])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

