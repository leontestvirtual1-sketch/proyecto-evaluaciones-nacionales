import React, { useState } from 'react';
// AcademicDataContext is the SINGLE source of truth for Demo vs Production data isolation.
import { ShieldCheck } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AcademicDataProvider, useAcademicData } from './context/AcademicDataContext';
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
import { GestionUsuariosPage } from './pages/GestionUsuariosPage';
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
  reporteCienciasMock,
  reporteLenguajeMock,
  reporteLenguajeDemoMock,
  reportePremilitarRealMock,
  currentUserProfesorPremilitar
} from './data/mockData';
import { Prueba, RendicionPrueba, Pregunta, ReporteTabuladoCurso, Asignatura } from './types';

import { SandboxBanner } from './components/SandboxBanner';
import { useBancoPreguntas } from './hooks/useBancoPreguntas';
import { useEvaluaciones } from './hooks/useEvaluaciones';

function MainAppContent({
  isSandboxMode,
  setIsSandboxMode,
  pruebas,
  onCreatePrueba,
  onUpdatePruebaEstado,
}: {
  isSandboxMode: boolean;
  setIsSandboxMode: (v: boolean) => void;
  pruebas: Prueba[];
  onCreatePrueba: (nuevaPrueba: Prueba) => void;
  onUpdatePruebaEstado: (pruebaId: string, nuevoEstado: 'borrador' | 'activa' | 'finalizada') => void;
}) {
  const { user, isAuthenticated, isLoading, switchRole, approveUserByToken, logout, docentesReales } = useAuth();
  // ── DATA LAYER: consume from AcademicDataContext (single source of truth) ──
  const academicData = useAcademicData();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  // Restaurar la página activa desde localStorage (persiste al refrescar)
  const [activePage, setActivePage] = useState<PageId>(() => {
    try {
      const saved = localStorage.getItem('sysget_active_page') as PageId | null;
      const validPages: PageId[] = [
        'dashboard', 'evaluaciones', 'alumnos', 'profesores', 'cursos',
        'banco-preguntas', 'usuarios', 'configuracion'
      ];
      return saved && validPages.includes(saved) ? saved : 'dashboard';
    } catch {
      return 'dashboard';
    }
  });
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [tokenApprovalNotice, setTokenApprovalNotice] = useState<string | null>(null);

  // Si el usuario ya estaba autenticado (sesión restaurada), saltar la Landing directamente (salvo si está en registro)
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && user && authView !== 'register') {
      setShowLanding(false);
    }
  }, [isLoading, isAuthenticated, user, authView]);

  // Escuchar parámetros de aprobación directa por token (1-click approval desde email del admin)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('approve_token');
    if (token) {
      approveUserByToken(token).then((res) => {
        if (res.success) {
          setTokenApprovalNotice(res.message);
        } else {
          setTokenApprovalNotice(res.message);
        }
        // Limpiar URL sin recargar
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [approveUserByToken]);

  // Persistir página activa en localStorage cada vez que cambia
  React.useEffect(() => {
    try {
      localStorage.setItem('sysget_active_page', activePage);
    } catch { /* ignorar si localStorage no está disponible */ }
  }, [activePage]);

  // Fix: botón atrás del navegador navega dentro de la app en vez de salir
  React.useEffect(() => {
    // Push estado inicial en el historial
    window.history.pushState({ page: activePage }, '', window.location.pathname);

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.page) {
        setActivePage(e.state.page);
        setSelectedReportPruebaId(null);
      } else {
        setActivePage('dashboard');
        setSelectedReportPruebaId(null);
        window.history.pushState({ page: 'dashboard' }, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // App Data State
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>(asignaturasMock);
  const [rendiciones, setRendiciones] = useState<RendicionPrueba[]>(rendicionesMock);

  // Banco de Preguntas conectado a Supabase (con fallback y aislamiento estricto por docente)
  const {
    preguntas: bancoPreguntas,
    addPregunta: handleAddPregunta,
    updatePregunta: handleUpdatePregunta,
    deletePregunta: handleDeletePregunta,
  } = useBancoPreguntas({ user, isSandboxMode });

  // View States
  const [selectedReportPruebaId, setSelectedReportPruebaId] = useState<string | null>(null);
  const [activePruebaForRunner, setActivePruebaForRunner] = useState<Prueba | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);

  const getReporteForPrueba = (pruebaId: string): ReporteTabuladoCurso => {
    const prueba = pruebas.find(p => p.id === pruebaId);

    // 1. Entorno de Producción: Escuela Premilitar Héroes de la Concepción (2° Medio)
    if (
      academicData.isProduction ||
      pruebaId.startsWith('prueba-len2m') ||
      (prueba && (prueba.cursoNombre?.includes('2° Medio') || prueba.nivel?.includes('2° Medio') || prueba.id?.startsWith('prueba-len2m')))
    ) {
      return {
        ...reportePremilitarRealMock,
        pruebaId: prueba?.id || pruebaId,
        pruebaTitulo: prueba?.titulo || reportePremilitarRealMock.pruebaTitulo,
        cursoNombre: prueba?.cursoNombre || '2° Medio',
      };
    }

    // 2. Entorno Demo: Lenguaje (8° Básico)
    if (pruebaId === 'prueba-102' || (prueba && (prueba.asignaturaNombre.toLowerCase().includes('lenguaje') || prueba.titulo.toLowerCase().includes('lectora')))) {
      return reporteLenguajeDemoMock;
    }

    // 3. Entorno Demo: Ciencias Naturales (6° Básico)
    if (pruebaId === 'prueba-cn6b-101' || (prueba && prueba.asignaturaNombre.toLowerCase().includes('ciencia'))) {
      return { ...reporteCienciasMock, pruebaId: prueba?.id || pruebaId, pruebaTitulo: prueba?.titulo || reporteCienciasMock.pruebaTitulo, cursoNombre: prueba?.cursoNombre || reporteCienciasMock.cursoNombre };
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


  // Mientras Supabase verifica la sesión, no renderizar nada (evita flash de Landing)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Restaurando sesión...</p>
        </div>
      </div>
    );
  }

  // Show Landing page before authentication
  if (showLanding) {
    return (
      <LandingPage
        onEnterApp={async () => {
          setIsSandboxMode(false);
          await logout();
          setAuthView('login');
          setShowLanding(false);
        }}
        onSelectRoleDemo={(role, extra) => {
          setIsSandboxMode(true);
          switchRole(role, extra || (role === 'admin' ? 'demo' : undefined));
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
    onCreatePrueba(nuevaPrueba);
  };

  const handleFinishRendicion = (nuevaRendicion: RendicionPrueba) => {
    setRendiciones([nuevaRendicion, ...rendiciones]);
  };

  const handleUpdatePruebaEstado = (pruebaId: string, nuevoEstado: 'borrador' | 'activa' | 'finalizada') => {
    onUpdatePruebaEstado(pruebaId, nuevoEstado);
  };

  const getPreguntasForRunner = (prueba: Prueba, banco: Pregunta[]): Pregunta[] => {
    // 1. Si la prueba especifica preguntasIds exactas, retornarlas en su orden
    if (prueba.preguntasIds && prueba.preguntasIds.length > 0) {
      const byId = new Map(banco.map(p => [p.id, p]));
      const exactQuestions = prueba.preguntasIds
        .map(id => byId.get(id))
        .filter((p): p is Pregunta => Boolean(p));
      if (exactQuestions.length > 0) {
        return exactQuestions;
      }
    }

    // 2. Fallback por asignatura
    let matched = banco.filter(p => p.asignaturaId === prueba.asignaturaId);

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
    if (user.rol === 'profesor' || user.rol === 'admin') {
      // ── DATA ISOLATION: sourced exclusively from AcademicDataContext ──
      // getDashboardData() has been REMOVED. All data filtering is centralized
      // in AcademicDataProvider to prevent Demo/Production bleed.
      const dashboardPruebas = academicData.pruebas;
      const dashboardReporte = academicData.reporteActivo;

      // If viewing test report details
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
          // RBAC: solo admin puede acceder a Gestión de Profesores
          if (user.rol !== 'admin') {
            return (
              <ProfesorDashboard
                profesor={user}
                pruebas={dashboardPruebas}
                reporteActivo={dashboardReporte}
                isSandboxMode={isSandboxMode}
                onOpenGenerator={() => setIsGeneratorOpen(true)}
                onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
                onNavigateToEvaluaciones={() => setActivePage('evaluaciones')}
              />
            );
          }
          return (
            <ProfesoresPage
              asignaturas={asignaturas}
              onNavigateToConfig={() => {
                setSelectedReportPruebaId(null);
                setActivePruebaForRunner(null);
                setActivePage('configuracion');
              }}
            />
          );
        case 'alumnos':
          return <AlumnosPage currentUser={user} isSandboxMode={isSandboxMode} />;
        case 'cursos':
          return <CursosPage currentUser={user} isSandboxMode={isSandboxMode} />;
        case 'banco-preguntas':
          return (
            <BancoPreguntasPage
              preguntas={bancoPreguntas}
              asignaturas={asignaturas}
              ejes={ejesTematicosMock}
              habilidades={habilidadesMock}
              docentes={docentesReales}
              currentUser={user}
              onAddPregunta={handleAddPregunta}
              onUpdatePregunta={handleUpdatePregunta}
              onDeletePregunta={handleDeletePregunta}
            />
          );
        case 'evaluaciones':
          return (
            <EvaluacionesPage
              pruebas={dashboardPruebas}
              asignaturas={asignaturas}
              bancoPreguntas={bancoPreguntas}
              currentUser={user}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
              onUpdatePruebaEstado={handleUpdatePruebaEstado}
            />
          );
        case 'usuarios':
          if (user.rol !== 'admin') {
            return (
              <ProfesorDashboard
                profesor={user}
                pruebas={dashboardPruebas}
                reporteActivo={dashboardReporte}
                isSandboxMode={isSandboxMode}
                onOpenGenerator={() => setIsGeneratorOpen(true)}
                onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
                onNavigateToEvaluaciones={() => setActivePage('evaluaciones')}
              />
            );
          }
          return <GestionUsuariosPage isSandboxMode={isSandboxMode} />;
        case 'configuracion':
          // RBAC: solo admin puede acceder a Configuración
          if (user.rol !== 'admin') {
            return (
              <ProfesorDashboard
                profesor={user}
                pruebas={dashboardPruebas}
                reporteActivo={dashboardReporte}
                isSandboxMode={isSandboxMode}
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
              asignaturas={asignaturas}
              onUpdateAsignaturas={setAsignaturas}
            />
          );

        case 'dashboard':
        default: {
          return (
            <ProfesorDashboard
              profesor={user}
              pruebas={dashboardPruebas}
              reporteActivo={dashboardReporte}
              isSandboxMode={isSandboxMode}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
              onNavigateToEvaluaciones={() => setActivePage('evaluaciones')}
            />
          );
        }
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
        isSandboxMode={isSandboxMode}
        onNavigate={(page) => {
          setSelectedReportPruebaId(null);
          setActivePruebaForRunner(null);
          setActivePage(page);
          // Registrar en historial del navegador para que el botón atrás funcione dentro de la app
          window.history.pushState({ page }, '', window.location.pathname);
        }}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <SandboxBanner isDemo={isSandboxMode} />
        <Navbar
          user={user}
          onRoleChange={(role, extra) => {
            setSelectedReportPruebaId(null);
            setActivePruebaForRunner(null);
            setActivePage('dashboard');
            switchRole(role, extra);
          }}
          onGoToLanding={() => {
            if (isSandboxMode) {
              logout();
            }
            setShowLanding(true);
          }}
          onLogout={async () => {
            setIsSandboxMode(false);
            await logout();
            setAuthView('login');
            setShowLanding(false);
          }}
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

      {/* Modal de Aprobación por Token (1-click email approval) */}
      {tokenApprovalNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl animate-fade-in text-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Resultado de Aprobación Directa</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {tokenApprovalNotice}
            </p>
            <button
              onClick={() => setTokenApprovalNotice(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Generator Modal con aislamiento estricto por especialidad docente */}
      <EvaluacionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        asignaturas={user?.rol === 'profesor' && user?.asignaturaId ? asignaturasMock.filter(a => a.id === user.asignaturaId) : asignaturasMock}
        ejes={user?.rol === 'profesor' && user?.asignaturaId ? ejesTematicosMock.filter(e => e.asignaturaId === user.asignaturaId) : ejesTematicosMock}
        habilidades={user?.rol === 'profesor' && user?.asignaturaId ? habilidadesMock.filter(h => h.asignaturaId === user.asignaturaId) : habilidadesMock}
        cursos={academicData.cursos}
        bancoPreguntas={user?.rol === 'profesor' && user?.asignaturaId ? bancoPreguntas.filter(p => p.asignaturaId === user.asignaturaId) : bancoPreguntas}
        onCreatePrueba={handleCreatePrueba}
      />
    </div>
  );
}


export function App() {
  return (
    <AuthProvider>
      <MainAppContentWrapper />
    </AuthProvider>
  );
}

function MainAppContentWrapper() {
  const { user, adminBaseProfile, docentesReales } = useAuth();
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const {
    pruebas,
    addEvaluacion,
    updateEvaluacionEstado,
  } = useEvaluaciones({ currentUser: user, isSandboxMode });

  return (
    <AcademicDataProvider
      currentUser={user}
      adminBaseProfile={adminBaseProfile}
      isSandboxMode={isSandboxMode}
      customPruebas={pruebas}
      docentesReales={docentesReales}
    >
      <MainAppContent
        isSandboxMode={isSandboxMode}
        setIsSandboxMode={setIsSandboxMode}
        pruebas={pruebas}
        onCreatePrueba={addEvaluacion}
        onUpdatePruebaEstado={updateEvaluacionEstado}
      />
    </AcademicDataProvider>
  );
}

export default App;
