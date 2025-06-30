# 🚀 Instruções de Instalação e Execução - EduCollab

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** versão 20.x ou superior
- **Python** versão 3.11 ou superior
- **pnpm** (recomendado) ou npm
- **Git** (opcional, para controle de versão)

## 🛠️ Instalação

### 1. Extrair o Projeto
Extraia o arquivo ZIP em um diretório de sua escolha.

### 2. Configurar o Backend

```bash
# Navegue para o diretório do backend
cd backend/educollab-api

# Ative o ambiente virtual (Linux/Mac)
source venv/bin/activate

# No Windows
# venv\Scripts\activate

# Instale as dependências Python
pip install -r requirements.txt
```

### 3. Configurar o Frontend

```bash
# Navegue para o diretório do frontend
cd frontend/plataforma-frontend

# Instale as dependências Node.js
pnpm install

# Ou usando npm
# npm install
```

## ▶️ Execução

### 1. Iniciar o Backend

```bash
# No diretório backend/educollab-api
cd backend/educollab-api

# Ative o ambiente virtual
source venv/bin/activate

# Execute o servidor Flask
python src/main.py
```

O backend estará disponível em: `http://localhost:5000`

### 2. Iniciar o Frontend

```bash
# Em um novo terminal, no diretório frontend/plataforma-frontend
cd frontend/plataforma-frontend

# Execute o servidor de desenvolvimento
pnpm run dev

# Ou usando npm
# npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 🔐 Dados de Acesso

O sistema vem com usuários pré-cadastrados para teste:

### Administrador
- **Email:** admin@educollab.com
- **Senha:** admin123

### Instrutor
- **Email:** silva@educollab.com
- **Senha:** prof123

### Aluno
- **Email:** joao@educollab.com
- **Senha:** 123456

## 🎯 Funcionalidades Disponíveis

### ✅ Implementadas e Funcionais

1. **Sistema de Autenticação**
   - Login e cadastro de usuários
   - Diferentes níveis de acesso (Aluno, Tutor, Admin)
   - Sistema de níveis militares

2. **Gerenciamento de Cursos**
   - Visualização de cursos disponíveis
   - Sistema de inscrições
   - Acompanhamento de progresso

3. **Anotações Colaborativas**
   - Criação e edição de anotações
   - Sistema de compartilhamento
   - Organização por tags
   - Vinculação a cursos

4. **Fórum de Discussões**
   - Criação de tópicos
   - Sistema de comentários
   - Organização por curso

5. **Dashboard Interativo**
   - Estatísticas de progresso
   - Métricas de engajamento
   - Sistema de recomendações

6. **API REST Completa**
   - Documentação OpenAPI/Swagger
   - Endpoints para todas as funcionalidades
   - Tratamento de erros

## 📊 Banco de Dados

O projeto utiliza **SQLite** como banco de dados, que é criado automaticamente na primeira execução. O arquivo do banco fica localizado em:

```
backend/educollab-api/src/database/app.db
```

### Estrutura das Tabelas

- **users** - Usuários do sistema
- **courses** - Cursos disponíveis
- **course_modules** - Módulos dos cursos
- **enrollments** - Inscrições dos usuários
- **notes** - Anotações colaborativas
- **forum_posts** - Posts do fórum
- **forum_comments** - Comentários do fórum

## 📁 Estrutura do Projeto

```
plataforma_aprendizado_colaborativo/
├── README.md                    # Documentação principal
├── INSTALL.md                   # Este arquivo
├── todo.md                      # Lista de tarefas do projeto
├── frontend/                    # Aplicação React
│   └── plataforma-frontend/
│       ├── src/
│       │   ├── App.jsx         # Componente principal
│       │   └── App.css         # Estilos CSS
│       ├── index.html          # Página HTML principal
│       └── package.json        # Dependências do frontend
├── backend/                     # API Flask
│   └── educollab-api/
│       ├── src/
│       │   ├── main.py         # Servidor principal
│       │   ├── models/         # Modelos de dados
│       │   ├── routes/         # Rotas da API
│       │   └── database/       # Banco de dados
│       ├── venv/               # Ambiente virtual Python
│       └── requirements.txt    # Dependências do backend
└── docs/                       # Documentação técnica
    ├── api-documentation.yaml  # Documentação OpenAPI
    ├── use-case-diagram.png    # Diagrama de casos de uso
    ├── class-diagram.png       # Diagrama de classes
    └── er-diagram.png          # Diagrama entidade-relacionamento
```

## 🔧 Solução de Problemas

### Erro de Porta em Uso
Se as portas 5000 ou 5173 estiverem em uso:

```bash
# Para o backend, altere a porta em src/main.py
app.run(host='0.0.0.0', port=5001, debug=True)

# Para o frontend, use uma porta diferente
pnpm run dev --port 3000
```

### Problemas com Dependências Python
Se houver problemas com as dependências:

```bash
# Recrie o ambiente virtual
python -m venv venv
source venv/bin/activate
pip install flask flask-cors flask-sqlalchemy werkzeug
```

### Problemas com Node.js
Se houver problemas com as dependências do Node:

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
pnpm install
```

## 🌐 Acesso à Aplicação

Após iniciar ambos os servidores:

1. Acesse `http://localhost:5173` no seu navegador
2. Faça login com um dos usuários de teste
3. Explore as funcionalidades disponíveis

## 📖 Documentação da API

A documentação completa da API está disponível em:
- **Arquivo:** `docs/api-documentation.yaml`
- **Formato:** OpenAPI 3.0.3
- **Visualização:** Importe o arquivo em ferramentas como Swagger UI ou Postman

## 🎨 Design e Estilo

O projeto utiliza um design militar-inspirado com:
- Cores: Verde militar e dourado
- Tipografia: Fontes em caixa alta
- Layout: Sidebar com navegação intuitiva
- Responsividade: Adaptável a diferentes dispositivos

## 🔄 Próximos Passos

Para expandir o projeto, considere:

1. **Implementar WebSockets** para anotações em tempo real
2. **Adicionar sistema de notificações**
3. **Implementar upload de arquivos**
4. **Adicionar testes automatizados**
5. **Configurar CI/CD**
6. **Migrar para PostgreSQL** em produção

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação no `README.md`
2. Verifique os logs do console do navegador
3. Verifique os logs do servidor Flask
4. Consulte a documentação da API

---

**EduCollab** - Plataforma de Aprendizado Colaborativo  
Desenvolvido com ❤️ usando React, Flask e SQLite

