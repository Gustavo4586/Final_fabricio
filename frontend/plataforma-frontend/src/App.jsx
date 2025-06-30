import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Star, 
  Play, 
  Clock, 
  Award,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Target,
  Trophy,
  Zap,
  Plus,
  Edit,
  Trash2,
  Share2,
  ThumbsUp,
  Eye
} from 'lucide-react'
import './App.css'

// API Base URL
const API_BASE = 'http://localhost:5000/api'

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Componente Header
const Header = ({ user, onLogout, onMenuToggle, isMenuOpen }) => (
  <header className="military-header">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle}
          className="md:hidden text-white hover:text-green-400 transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center space-x-2">
          <div className="military-logo">
            <Target className="text-green-400" size={32} />
          </div>
          <h1 className="military-title">EDUCOLLAB</h1>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-green-600 text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold">{user.name}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLogout}
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
          >
            <LogOut size={16} className="mr-2" />
            SAIR
          </Button>
        </div>
      )}
    </div>
  </header>
)

// Componente Sidebar
const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => (
  <div className={`military-sidebar ${isOpen ? 'open' : ''}`}>
    <div className="p-6">
      <nav className="space-y-2">
        {[
          { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
          { id: 'courses', label: 'CURSOS', icon: BookOpen },
          { id: 'notes', label: 'ANOTAÇÕES', icon: MessageSquare },
          { id: 'forum', label: 'FÓRUM', icon: Users },
          { id: 'profile', label: 'PERFIL', icon: User },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id)
              onClose()
            }}
            className={`military-nav-item ${activeTab === id ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
            <ChevronRight size={16} className="ml-auto" />
          </button>
        ))}
      </nav>
    </div>
  </div>
)

// Componente Login
const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const response = await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        })
        onLogin(response.user)
      } else {
        const response = await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        })
        onLogin(response.user)
      }
    } catch (error) {
      setError(error.message || 'Erro ao fazer login/cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen military-bg flex items-center justify-center p-4">
      <div className="military-hero-overlay" />
      <Card className="w-full max-w-md military-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="military-logo">
              <Target className="text-green-400" size={48} />
            </div>
          </div>
          <CardTitle className="military-title text-2xl">EDUCOLLAB</CardTitle>
          <CardDescription className="text-gray-300">
            PLATAFORMA DE APRENDIZADO COLABORATIVO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="military-tab">ENTRAR</TabsTrigger>
              <TabsTrigger value="register" className="military-tab">CADASTRAR</TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">NOME COMPLETO</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    className="military-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">EMAIL</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  className="military-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">SENHA</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="military-input"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full military-button" disabled={loading}>
                <Zap className="mr-2" size={16} />
                {loading ? 'PROCESSANDO...' : (isLogin ? 'ENTRAR NA PLATAFORMA' : 'CRIAR CONTA')}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente Dashboard
const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await apiCall(`/users/${user.id}/stats`)
        setStats(statsData)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="military-loading w-8 h-8 rounded-full"></div>
      </div>
    )
  }

  const displayStats = [
    { label: 'CURSOS CONCLUÍDOS', value: stats?.completed_courses || '0', icon: Trophy, color: 'text-green-400' },
    { label: 'TOTAL DE INSCRIÇÕES', value: stats?.total_enrollments || '0', icon: BookOpen, color: 'text-blue-400' },
    { label: 'ANOTAÇÕES CRIADAS', value: stats?.notes_count || '0', icon: MessageSquare, color: 'text-yellow-400' },
    { label: 'RANK ATUAL', value: user.level, icon: Award, color: 'text-purple-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="military-welcome">
        <h2 className="military-section-title">
          BEM-VINDO, {user.name.toUpperCase()}!
        </h2>
        <p className="text-gray-300">
          Continue sua jornada de aprendizado colaborativo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <Card key={index} className="military-stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-semibold">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`${stat.color}`} size={32} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="military-card">
          <CardHeader>
            <CardTitle className="military-card-title">PROGRESSO MÉDIO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Progresso Geral</span>
                <span className="text-green-400 font-bold">{stats?.average_progress || 0}%</span>
              </div>
              <div className="military-progress-bar">
                <div 
                  className="military-progress-fill" 
                  style={{width: `${stats?.average_progress || 0}%`}} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="military-card">
          <CardHeader>
            <CardTitle className="military-card-title">ATIVIDADE RECENTE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-semibold">Login realizado</span> na plataforma
                  </p>
                  <p className="text-gray-400 text-xs">Agora</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente Cursos
const CoursesSection = ({ user }) => {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('available')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          apiCall('/courses'),
          apiCall(`/users/${user.id}/enrollments`)
        ])
        setCourses(coursesData)
        setEnrollments(enrollmentsData)
      } catch (error) {
        console.error('Erro ao carregar cursos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  const handleEnroll = async (courseId) => {
    try {
      await apiCall('/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          course_id: courseId
        })
      })
      
      // Recarregar dados
      const enrollmentsData = await apiCall(`/users/${user.id}/enrollments`)
      setEnrollments(enrollmentsData)
    } catch (error) {
      console.error('Erro ao se inscrever:', error)
    }
  }

  const enrolledCourseIds = enrollments.map(e => e.course_id)
  const availableCourses = courses.filter(c => !enrolledCourseIds.includes(c.id))
  const myCourses = courses.filter(c => enrolledCourseIds.includes(c.id))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="military-loading w-8 h-8 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="military-section-title">MÓDULO DE CURSOS</h2>
        <div className="flex space-x-2">
          <Button
            variant={activeView === 'available' ? 'default' : 'outline'}
            onClick={() => setActiveView('available')}
            className="military-button"
          >
            DISPONÍVEIS
          </Button>
          <Button
            variant={activeView === 'enrolled' ? 'default' : 'outline'}
            onClick={() => setActiveView('enrolled')}
            className="military-button"
          >
            MEUS CURSOS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeView === 'available' ? availableCourses : myCourses).map(course => {
          const enrollment = enrollments.find(e => e.course_id === course.id)
          
          return (
            <Card key={course.id} className="military-card military-hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-white mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-gray-300 text-sm">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${
                      course.difficulty === 'iniciante' ? 'bg-green-600' :
                      course.difficulty === 'intermediario' ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                  >
                    {course.difficulty.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {course.duration_hours}h
                    </span>
                    <span className="flex items-center">
                      <User size={16} className="mr-1" />
                      {course.instructor_name}
                    </span>
                  </div>
                  
                  {enrollment && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Progresso</span>
                        <span className="text-sm text-green-400 font-bold">
                          {enrollment.progress_percentage}%
                        </span>
                      </div>
                      <div className="military-progress-bar">
                        <div 
                          className="military-progress-fill" 
                          style={{width: `${enrollment.progress_percentage}%`}} 
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {activeView === 'available' ? (
                      <Button 
                        onClick={() => handleEnroll(course.id)}
                        className="flex-1 military-button"
                        size="sm"
                      >
                        <Plus size={16} className="mr-2" />
                        INSCREVER-SE
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 military-button"
                        size="sm"
                      >
                        <Play size={16} className="mr-2" />
                        CONTINUAR
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Componente Anotações
const NotesSection = ({ user }) => {
  const [notes, setNotes] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    course_id: '',
    is_shared: false,
    tags: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesData, coursesData] = await Promise.all([
          apiCall(`/notes?user_id=${user.id}`),
          apiCall('/courses')
        ])
        setNotes(notesData)
        setCourses(coursesData)
      } catch (error) {
        console.error('Erro ao carregar anotações:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiCall('/notes', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          author_id: user.id,
          course_id: formData.course_id || null
        })
      })
      
      // Recarregar anotações
      const notesData = await apiCall(`/notes?user_id=${user.id}`)
      setNotes(notesData)
      
      // Limpar formulário
      setFormData({
        title: '',
        content: '',
        course_id: '',
        is_shared: false,
        tags: ''
      })
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao criar anotação:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="military-loading w-8 h-8 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="military-section-title">ANOTAÇÕES COLABORATIVAS</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="military-button"
        >
          <Plus size={16} className="mr-2" />
          NOVA ANOTAÇÃO
        </Button>
      </div>

      {showForm && (
        <Card className="military-card">
          <CardHeader>
            <CardTitle className="military-card-title">CRIAR ANOTAÇÃO</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">TÍTULO</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="military-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">CURSO (OPCIONAL)</Label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                  className="military-input w-full"
                >
                  <option value="">Selecione um curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">CONTEÚDO</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="military-input min-h-32"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">TAGS (separadas por vírgula)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="military-input"
                  placeholder="react, javascript, frontend"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="shared"
                  checked={formData.is_shared}
                  onChange={(e) => setFormData({...formData, is_shared: e.target.checked})}
                  className="w-4 h-4"
                />
                <Label htmlFor="shared" className="text-gray-300">
                  COMPARTILHAR COM OUTROS USUÁRIOS
                </Label>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="military-button">
                  SALVAR ANOTAÇÃO
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-600 text-gray-300"
                >
                  CANCELAR
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <Card key={note.id} className="military-card military-hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-white">{note.title}</CardTitle>
                {note.is_shared && (
                  <Badge variant="secondary" className="bg-blue-600">
                    <Share2 size={12} className="mr-1" />
                    COMPARTILHADA
                  </Badge>
                )}
              </div>
              {note.course_title && (
                <CardDescription className="text-gray-400">
                  Curso: {note.course_title}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {note.content}
              </p>
              
              {note.tags && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {JSON.parse(note.tags || '[]').map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="p-1 h-auto">
                    <Edit size={14} />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1 h-auto text-red-400">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Componente Fórum
const ForumSection = ({ user }) => {
  const [posts, setPosts] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    course_id: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, coursesData] = await Promise.all([
          apiCall('/forum/posts'),
          apiCall('/courses')
        ])
        setPosts(postsData)
        setCourses(coursesData)
      } catch (error) {
        console.error('Erro ao carregar fórum:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiCall('/forum/posts', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          author_id: user.id
        })
      })
      
      // Recarregar posts
      const postsData = await apiCall('/forum/posts')
      setPosts(postsData)
      
      // Limpar formulário
      setFormData({
        title: '',
        content: '',
        course_id: ''
      })
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao criar post:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="military-loading w-8 h-8 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="military-section-title">FÓRUM DE DISCUSSÕES</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="military-button"
        >
          <Plus size={16} className="mr-2" />
          NOVO TÓPICO
        </Button>
      </div>

      {showForm && (
        <Card className="military-card">
          <CardHeader>
            <CardTitle className="military-card-title">CRIAR TÓPICO</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">TÍTULO</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="military-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">CURSO</Label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                  className="military-input w-full"
                  required
                >
                  <option value="">Selecione um curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-300">CONTEÚDO</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="military-input min-h-32"
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" className="military-button">
                  PUBLICAR TÓPICO
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-600 text-gray-300"
                >
                  CANCELAR
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="military-card military-hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-white mb-2">{post.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Por {post.author_name} em {post.course_title}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <ThumbsUp size={16} className="mr-1" />
                    {post.votes}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare size={16} className="mr-1" />
                    {post.comments_count}
                  </span>
                  <span className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    {post.views}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <Button size="sm" className="military-button">
                  VER DISCUSSÃO
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Componente principal App
function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="military-app">
      <Header 
        user={user} 
        onLogout={handleLogout}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="military-main">
          <div className="container mx-auto px-4 py-6">
            {activeTab === 'dashboard' && <Dashboard user={user} />}
            {activeTab === 'courses' && <CoursesSection user={user} />}
            {activeTab === 'notes' && <NotesSection user={user} />}
            {activeTab === 'forum' && <ForumSection user={user} />}
            {activeTab === 'profile' && (
              <div className="text-center py-12">
                <User size={64} className="mx-auto text-green-400 mb-4" />
                <h2 className="military-section-title mb-4">PERFIL DO USUÁRIO</h2>
                <p className="text-gray-300">Funcionalidade em desenvolvimento...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

