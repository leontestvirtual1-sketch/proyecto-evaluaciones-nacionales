import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, PageId } from './components/Sidebar';
import { ProfesorDashboard } from './components/ProfesorDashboard';
import { ReporteTabuladoView } from './components/ReporteTabuladoView';
import { EvaluacionGeneratorModal } from './components/EvaluacionGeneratorModal';
import { AlumnoPortal } from './components/AlumnoPortal';
import { AlumnoEvaluationView } from './components/AlumnoEvaluationView';
import { AlumnoPerfilView } from './components/AlumnoPerfilView';
import { ProfesoresPage } from './pages/ProfesoresPage';
import { AlumnosPage } from './pages/AlumnosPage';
import { BancoPreguntasPage } from './pages/BancoPreguntasPage';
import { CursosPage } from './pages/CursosPage';
import { EvaluacionesPage } from './pages/EvaluacionesPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import {
  asignaturasMock,
  ejesTematicosMock,
  habilidadesMock,
  preguntasMock,
  cursosMock,
  pruebasMock,
  rendicionesMock,
  reporteCursoMock,
  reporteLenguajeMock
} from './data/mockData';
import { Prueba, RendicionPrueba, Pregunta, ReporteTabuladoCurso } from './types';

function MainAppContent() {
  const { user, isAuthenticated, switchRole } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // App Data State
  const [bancoPreguntas, setBancoPreguntas] = useState<Pregunta[]>(preguntasMock);
  const [pruebas, setPruebas] = useState<Prueba[]>(pruebasMock);
  const [rendiciones, setRendiciones] = useState<RendicionPrueba[]>(rendicionesMock);

  // View States
  const [selectedReportPruebaId, setSelectedReportPruebaId] = useState<string | null>(null);
  const [activePruebaForRunner, setActivePruebaForRunner] = useState<Prueba | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);

  const getReporteForPrueba = (pruebaId: string): ReporteTabuladoCurso => {
    const prueba = pruebas.find(p => p.id === pruebaId);
    if (pruebaId === 'prueba-102' || (prueba && (prueba.asignaturaNombre.toLowerCase().includes('lenguaje') || prueba.titulo.toLowerCase().includes('lectora')))) {
      return reporteLenguajeMock;
    }
    if (prueba) {
      return {
        ...reporteCursoMock,
        pruebaId: prueba.id,
        pruebaTitulo: prueba.titulo,
        cursoNombre: prueba.cursoNombre,
      };
    }
    return reporteCursoMock;
  };


  // Show Landing page before authentication
  if (showLanding) {
    return (
      <LandingPage
        onEnterApp={() => setShowLanding(false)}
        onSelectRoleDemo={(role, extra) => {
          switchRole(role, extra);
          setShowLanding(false);
        }}
      />
    );
  }

  // If user is not authenticated, show Login or Register page
  if (!isAuthenticated || !user) {
    if (authView === 'register') {
      return <RegisterPage onGoToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onGoToRegister={() => setAuthView('register')} />;
  }

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleCreatePrueba = (nuevaPrueba: Prueba) => {
    setPruebas([nuevaPrueba, ...pruebas]);
  };

  const handleFinishRendicion = (nuevaRendicion: RendicionPrueba) => {
    setRendiciones([nuevaRendicion, ...rendiciones]);
  };

  // Preguntas handlers
  const handleAddPregunta = (p: Pregunta) => {
    setBancoPreguntas([p, ...bancoPreguntas]);
  };

  const handleUpdatePregunta = (p: Pregunta) => {
    setBancoPreguntas(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const handleDeletePregunta = (id: string) => {
    setBancoPreguntas(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdatePruebaEstado = (pruebaId: string, nuevoEstado: 'borrador' | 'activa' | 'finalizada') => {
    setPruebas(prev => prev.map(p => p.id === pruebaId ? { ...p, estado: nuevoEstado } : p));
  };

  const getPreguntasForRunner = (prueba: Prueba, banco: Pregunta[]): Pregunta[] => {
    // Filter questions by subject ID
    let matched = banco.filter(p => p.asignaturaId === prueba.asignaturaId);

    // Fallback match by subject name if ID didn't match
    if (matched.length === 0) {
      if (prueba.asignaturaNombre.toLowerCase().includes('lenguaje') || prueba.titulo.toLowerCase().includes('lectora')) {
        matched = banco.filter(p => p.asignaturaId === 'asig-2');
      } else if (prueba.asignaturaNombre.toLowerCase().includes('ciencia')) {
        matched = banco.filter(p => p.asignaturaId === 'asig-3');
      } else {
        matched = banco.filter(p => p.asignaturaId === 'asig-1');
      }
    }

    if (matched.length === 0) {
      matched = banco;
    }

    // Ensure we return exactly totalPreguntas count with questions of that subject
    const targetCount = prueba.totalPreguntas || matched.length || 5;
    const result: Pregunta[] = [];

    for (let i = 0; i < targetCount; i++) {
      const basePreg = matched[i % matched.length];
      result.push({
        ...basePreg,
        id: `${basePreg.id}-idx-${i}`
      });
    }

    return result;
  };

  // Render active content area
  const renderMainContent = () => {
    // Admin and Profesor share the same staff view
    if (user.rol === 'admin' || user.rol === 'profesor') {
      if (selectedReportPruebaId) {
        return (
          <ReporteTabuladoView
            reporte={getReporteForPrueba(selectedReportPruebaId)}
            onBack={() => setSelectedReportPruebaId(null)}
          />
        );
      }

      switch (activePage) {
        case 'profesores':
          return <ProfesoresPage />;
        case 'alumnos':
          return <AlumnosPage />;
        case 'cursos':
          return <CursosPage />;
        case 'banco-preguntas':
          return (
            <BancoPreguntasPage
              preguntas={bancoPreguntas}
              asignaturas={asignaturasMock}
              ejes={ejesTematicosMock}
              habilidades={habilidadesMock}
              currentUser={user}
              onAddPregunta={handleAddPregunta}
              onUpdatePregunta={handleUpdatePregunta}
              onDeletePregunta={handleDeletePregunta}
            />
          );
        case 'evaluaciones':
          return (
            <EvaluacionesPage
              pruebas={pruebas}
              asignaturas={asignaturasMock}
              currentUser={user}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
              onUpdatePruebaEstado={handleUpdatePruebaEstado}
            />
          );
        case 'configuracion':
          // RBAC: solo admin puede acceder a Configuración
          if (user.rol !== 'admin') {
            return (
              <ProfesorDashboard
                profesor={user}
                pruebas={pruebas}
                reporteActivo={reporteCursoMock}
                onOpenGenerator={() => setIsGeneratorOpen(true)}
                onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
                onNavigateToEvaluaciones={() => setActivePage('evaluaciones')}
              />
            );
          }
          return (
            <ConfiguracionPage
              user={user}
              darkMode={darkMode}
              onToggleDarkMode={handleToggleDarkMode}
            />
          );
        case 'dashboard':
        default:
          return (
            <ProfesorDashboard
              profesor={user}
              pruebas={pruebas}
              reporteActivo={reporteCursoMock}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
              onNavigateToEvaluaciones={() => setActivePage('evaluaciones')}
            />
          );
      }
    } else {
      // Student View
      if (activePruebaForRunner) {
        return (
          <AlumnoEvaluationView
            prueba={activePruebaForRunner}
            preguntas={getPreguntasForRunner(activePruebaForRunner, bancoPreguntas)}
            alumno={user}
            onFinish={handleFinishRendicion}
            onCancel={() => setActivePruebaForRunner(null)}
          />
        );
      }

      if (activePage === 'configuracion') {
        return (
          <AlumnoPerfilView
            alumno={user}
            historialRendiciones={rendiciones.filter(r => r.alumnoId === user.id)}
            darkMode={darkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        );
      }

      return (
        <AlumnoPortal
          alumno={user}
          pruebasDisponibles={pruebas.filter(p => p.estado === 'activa')}
          historialRendiciones={rendiciones.filter(r => r.alumnoId === user.id)}
          onStartEvaluation={(prueba) => setActivePruebaForRunner(prueba)}
        />
      );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setSelectedReportPruebaId(null);
          setActivePage(page);
        }}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          user={user}
          onRoleChange={(role) => {
            setSelectedReportPruebaId(null);
            setActivePruebaForRunner(null);
            switchRole(role);
          }}
          onGoToLanding={() => setShowLanding(true)}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderMainContent()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p><strong>Sysget Saber</strong> — Plataforma de Evaluaciones y Ensayos Académicos © 2026 — Chile</p>
          <p className="text-[11px] text-slate-400 mt-1">Diseñado con React, Vite, Tailwind CSS y Supabase</p>
        </footer>
      </div>

      {/* Generator Modal */}
      <EvaluacionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        asignaturas={asignaturasMock}
        ejes={ejesTematicosMock}
        habilidades={habilidadesMock}
        cursos={cursosMock}
        bancoPreguntas={bancoPreguntas}
        onCreatePrueba={handleCreatePrueba}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
