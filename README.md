# EduCollab - Plataforma de Aprendizado Colaborativo

## 📋 Descrição do Projeto

EduCollab é uma plataforma fullstack de aprendizado colaborativo desenvolvida para facilitar o compartilhamento de conhecimento entre estudantes e instrutores. A plataforma oferece um ambiente militar-inspirado com funcionalidades robustas para gerenciamento de cursos, anotações colaborativas, fóruns de discussão e acompanhamento de progresso.

## 🎯 Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Cadastro e login de usuários
- Autenticação segura com hash de senhas
- Diferentes níveis de acesso (Aluno, Tutor, Admin)
- Sistema de níveis militares (Recruta, Cabo, Sargento, Capitão, Coronel)

### 📚 Gerenciamento de Cursos
- CRUD completo de cursos
- Categorização por dificuldade (Iniciante, Intermediário, Avançado)
- Sistema de inscrições
- Acompanhamento de progresso individual
- Módulos organizados por curso

### 📝 Anotações Colaborativas
- Criação e edição de anotações pessoais
- Sistema de compartilhamento público
- Organização por tags
- Vinculação a cursos específicos
- Interface intuitiva para gerenciamento

### 💬 Fórum de Discussões
- Criação de tópicos por curso
- Sistema de comentários aninhados
- Votação em posts e comentários
- Contador de visualizações
- Moderação de conteúdo

### 📊 Dashboard e Relatórios
- Estatísticas de progresso individual
- Gráficos de desempenho
- Métricas de engajamento
- Sistema de recomendações inteligentes
- Acompanhamento de atividades

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **Shadcn/ui** - Componentes de interface reutilizáveis

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **Flask-CORS** - Middleware para Cross-Origin Resource Sharing
- **Werkzeug** - Utilitários para aplicações WSGI
- **SQLite** - Banco de dados relacional

### Ferramentas de Desenvolvimento
- **pnpm** - Gerenciador de pacotes JavaScript
- **Python 3.11** - Linguagem de programação
- **Git** - Controle de versão

## 🏗️ Arquitetura do Sistema

### Estrutura de Diretórios
```
plataforma_aprendizado_colaborativo/
├── frontend/
│   └── plataforma-frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── App.jsx
│       │   └── App.css
│       ├── index.html
│       └── package.json
├── backend/
│   └── educollab-api/
│       ├── src/
│       │   ├── models/
│       │   │   └── user.py
│       │   ├── routes/
│       │   │   └── user.py
│       │   ├── database/
│       │   │   └── app.db
│       │   └── main.py
│       ├── venv/
│       └── requirements.txt
├── docs/
└── README.md
```

### Banco de Dados

#### Modelo Relacional (SQLite)
O sistema utiliza SQLite como banco de dados principal com as seguintes entidades:

**Usuários (User)**
- id (PK)
- name, username, email
- password_hash
- role (aluno, tutor, admin)
- level (Recruta, Cabo, etc.)
- avatar, created_at, last_login
- is_active

**Cursos (Course)**
- id (PK)
- title, description, category
- difficulty, duration_hours
- instructor_id (FK)
- created_at, updated_at, is_active

**Módulos (CourseModule)**
- id (PK)
- course_id (FK)
- title, description, content
- video_url, pdf_url
- order, duration_minutes
- created_at, is_active

**Inscrições (Enrollment)**
- id (PK)
- user_id (FK), course_id (FK)
- enrolled_at, completed_at
- progress_percentage, last_accessed
- is_active

**Anotações (Note)**
- id (PK)
- title, content, tags
- is_shared
- author_id (FK), course_id (FK)
- created_at, updated_at, is_active

**Posts do Fórum (ForumPost)**
- id (PK)
- title, content
- author_id (FK), course_id (FK)
- votes, views
- created_at, updated_at, is_active

**Comentários (ForumComment)**
- id (PK)
- content
- author_id (FK), post_id (FK)
- parent_id (FK) - para comentários aninhados
- votes
- created_at, updated_at, is_active

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 20.x ou superior
- Python 3.11 ou superior
- pnpm (recomendado) ou npm

### Configuração do Backend

1. **Navegue para o diretório do backend:**
```bash
cd backend/educollab-api
```

2. **Ative o ambiente virtual:**
```bash
source venv/bin/activate
```

3. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

4. **Execute o servidor:**
```bash
python src/main.py
```

O servidor estará disponível em `http://localhost:5000`

### Configuração do Frontend

1. **Navegue para o diretório do frontend:**
```bash
cd frontend/plataforma-frontend
```

2. **Instale as dependências:**
```bash
pnpm install
```

3. **Execute o servidor de desenvolvimento:**
```bash
pnpm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário

### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/{id}` - Obter usuário específico
- `PUT /api/users/{id}` - Atualizar usuário
- `DELETE /api/users/{id}` - Desativar usuário
- `GET /api/users/{id}/stats` - Estatísticas do usuário
- `GET /api/users/{id}/recommendations` - Recomendações para o usuário

### Cursos
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Criar curso
- `GET /api/courses/{id}` - Obter curso específico
- `PUT /api/courses/{id}` - Atualizar curso
- `DELETE /api/courses/{id}` - Desativar curso

### Inscrições
- `POST /api/enrollments` - Criar inscrição
- `GET /api/users/{id}/enrollments` - Listar inscrições do usuário

### Anotações
- `GET /api/notes` - Listar anotações (com filtros)
- `POST /api/notes` - Criar anotação
- `PUT /api/notes/{id}` - Atualizar anotação

### Fórum
- `GET /api/forum/posts` - Listar posts do fórum
- `POST /api/forum/posts` - Criar post
- `GET /api/forum/posts/{id}/comments` - Listar comentários
- `POST /api/forum/posts/{id}/comments` - Criar comentário

### Sistema
- `GET /api/health` - Health check da API

## 🎨 Design e Interface

### Tema Visual
A plataforma utiliza um design militar-inspirado com:
- **Cores principais:** Verde militar (#22C55E), Dourado (#F59E0B)
- **Fundo:** Tons escuros (#0F172A, #1E293B)
- **Tipografia:** Fontes em caixa alta para títulos
- **Elementos:** Bordas angulares, efeitos de hover militares

### Responsividade
- Design adaptável para desktop, tablet e mobile
- Sidebar colapsível em dispositivos móveis
- Componentes otimizados para touch

### Acessibilidade
- Contraste adequado entre texto e fundo
- Navegação por teclado
- Elementos semânticos HTML
- Labels descritivos para formulários

## 🔒 Segurança

### Autenticação
- Senhas hasheadas com Werkzeug
- Validação de entrada em todos os endpoints
- Sanitização de dados do usuário

### CORS
- Configuração adequada para desenvolvimento
- Headers de segurança implementados

### Validação
- Validação de tipos de dados
- Verificação de permissões por role
- Soft delete para preservar integridade

## 📈 Performance

### Frontend
- Lazy loading de componentes
- Otimização de re-renderizações React
- Bundling otimizado com Vite

### Backend
- Queries otimizadas com SQLAlchemy
- Indexação adequada no banco
- Paginação para listas grandes

### Banco de Dados
- Relacionamentos bem definidos
- Constraints de integridade
- Soft delete para auditoria

## 🧪 Testes

### Testes Funcionais
- Autenticação e autorização
- CRUD de todas as entidades
- Integração frontend-backend
- Responsividade da interface

### Testes de Usabilidade
- Fluxo de navegação intuitivo
- Feedback visual para ações
- Tratamento de erros amigável

## 📚 Dados de Exemplo

O sistema vem pré-configurado com dados de exemplo:

### Usuários
- **Admin:** admin@educollab.com / admin123
- **Instrutor:** silva@educollab.com / prof123  
- **Aluno:** joao@educollab.com / 123456

### Cursos
- Desenvolvimento Web Completo (Intermediário)
- Banco de Dados Fundamentals (Iniciante)
- DevOps e Containers (Avançado)

### Conteúdo
- Anotações de exemplo sobre React e SQL
- Posts do fórum com dúvidas técnicas
- Inscrições e progresso simulados

## 🚀 Deploy

### Desenvolvimento
O projeto está configurado para execução local com:
- Frontend em `localhost:5173`
- Backend em `localhost:5000`
- Banco SQLite local

### Produção
Para deploy em produção:
1. Configure variáveis de ambiente
2. Use banco PostgreSQL ou MySQL
3. Configure HTTPS
4. Implemente cache Redis
5. Configure monitoramento

## 🤝 Contribuição

### Estrutura de Commits
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes

### Padrões de Código
- ESLint para JavaScript/React
- Black para Python
- Prettier para formatação
- Conventional Commits

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico e está disponível para fins educacionais.

## 👥 Equipe

**Desenvolvido por:** Leone e Gustavo
**Data:** Junho 2025  
**Versão:** 1.0.0



---

**EduCollab** - Transformando o aprendizado através da colaboração 🎓⚡

