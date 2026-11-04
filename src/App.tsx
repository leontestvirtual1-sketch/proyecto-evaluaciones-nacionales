import React, { useState } from 'react';
// AcademicDataContext is the SINGLE source of truth for Demo vs Production data isolation.
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AcademicDataProvider, useAcademicData } from './context/AcademicDataContext';
import { Navbar } from './components/Navbar';
import { Sidebar, PageId } from './components/Sidebar';
import { ProfesorDashboard } from './components/ProfesorDashboard';
import { DirectorDashboard } from './components/DirectorDashboard';
import { UtpDashboard } from './components/UtpDashboard';
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

import { BibliotecaPage } from './pages/BibliotecaPage';
import { DescargaDemrePage } from './pages/DescargaDemrePage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { GestionUsuariosPage } from './pages/GestionUsuariosPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import {
  asignaturasMock,
  ejesTematicosMock,
  habilidadesMock,
  rendicionesMock,
  reporteCursoMock,
  reporteCienciasMock,
  reporteLenguajeDemoMock
} from './data/mockData';
import { Prueba, RendicionPrueba, Pregunta, ReporteTabuladoCurso, Asignatura } from './types';

import { SandboxBanner } from './components/SandboxBanner';
import { useBancoPreguntas } from './hooks/useBancoPreguntas';
import { useEvaluaciones } from './hooks/useEvaluaciones';
import { CuentaCaducadaBloqueo } from './components/CuentaCaducadaBloqueo';
import { isUserExpiredOrBlocked } from './utils/userAccess';
import { supabase } from './lib/supabaseClient';

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
        'banco-preguntas', 'biblioteca', 'descarga-demre', 'usuarios', 'configuracion'
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

    // Capturar código de evaluación asignada para alumnos (?codigo=... o ?code=...)
    const code = params.get('codigo') || params.get('code');
    if (code) {
      sessionStorage.setItem('pending_eval_code', code.trim());
      setShowLanding(false);
      setAuthView('login');
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
  const [activePruebaPreguntas, setActivePruebaPreguntas] = useState<Pregunta[] | null>(null);
  const [isLoadingPreguntas, setIsLoadingPreguntas] = useState<boolean>(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);

  const getReporteForPrueba = (pruebaId: string): ReporteTabuladoCurso => {
    const prueba = pruebas.find(p => p.id === pruebaId);

    // 1. Entorno de Producción: reporte legítimo vacío (Directiva 1 y 2)
    if (academicData.isProduction) {
      return {
        ...reporteCursoMock,
        pruebaId: prueba?.id || pruebaId,
        pruebaTitulo: prueba?.titulo || 'Evaluación',
        cursoNombre: prueba?.cursoNombre || 'Curso',
        totalAlumnosRendidos: 0,
        totalAlumnosMatriculados: 0,
        promedioPorcentajeLogro: 0,
        promedioEscalaNacional: 0,
        desgloseEjes: [],
        desgloseHabilidades: [],
        preguntasMasFalladas: [],
        planAccionReforzamiento: [],
        rendiciones: []
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

  // Verificación estricta de cuenta caducada (0 días restantes de prueba) o desactivada
  const accessCheck = isUserExpiredOrBlocked(user);
  if (accessCheck.isBlocked && !user.esSuperAdmin && (user.rol as string) !== 'superadmin') {
    return (
      <CuentaCaducadaBloqueo
        user={user}
        reason={accessCheck.reason}
        title={accessCheck.title}
        message={accessCheck.message}
        onLogout={logout}
      />
    );
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

  const isPaesMat1 = (p: Prueba) => {
    const id = (p.id || '').toLowerCase();
    const code = (p.codigoPublico || '').toLowerCase();
    const tit = (p.titulo || '').toLowerCase();
    return (
      id === 'eval-paes-mat1-2023-f113' ||
      id === 'prueba-paes-m1-2026' ||
      code === 'eval-001' ||
      code === 'paes-m1-2026' ||
      ((tit.includes('matemática 1') || tit.includes('matematica 1') || tit.includes('m1')) && tit.includes('paes'))
    );
  };

  const handleStartEvaluation = async (prueba: Prueba) => {
    const isFlorencia = user?.email?.toLowerCase().trim() === 'florenciaangelicaleonpizarro@gmail.com';
    if (isFlorencia && !isPaesMat1(prueba)) {
      alert('Acceso restringido: Florencia León Pizarro tiene habilitado exclusivamente el ensayo PAES Competencia Matemática 1 (M1).');
      return;
    }
    setActivePruebaForRunner(prueba);
    setIsLoadingPreguntas(true);
    setActivePruebaPreguntas(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/evaluaciones-catalogo?action=preguntas&evaluacion_id=${encodeURIComponent(prueba.id)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data?.preguntas && data.preguntas.length > 0) {
          const mapped: Pregunta[] = data.preguntas.map((p: any) => ({
            id: p.id,
            asignaturaId: p.asignatura_id || prueba.asignaturaId,
            ejeTematicoId: p.eje_tematico_id || '',
            habilidadId: p.habilidad_id || '',
            tipo: p.tipo || 'seleccion_multiple',
            nivel: p.nivel || prueba.nivel,
            dificultad: p.dificultad || 'media',
            enunciado: p.enunciado || '',
            imagenUrl: p.imagen_url || undefined,
            tablaMarkdown: p.tabla_markdown || undefined,
            alternativas: Array.isArray(p.alternativas) ? p.alternativas : [],
            respuestaCorrecta: null,
            puntaje: Number(p.puntaje) || 1,
            fuente: p.fuente || 'DEMRE Oficial'
          }));
          setActivePruebaPreguntas(mapped);
          setIsLoadingPreguntas(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[handleStartEvaluation] Error cargando preguntas desde API:', err);
    }

    const fallback = getPreguntasForRunner(prueba, bancoPreguntas);
    setActivePruebaPreguntas(fallback);
    setIsLoadingPreguntas(false);
  };

  const getPreguntasForRunner = (prueba: Prueba, banco: Pregunta[]): Pregunta[] => {
    let rawList: Pregunta[] = [];

    // 1. Si la prueba especifica preguntasIds exactas, retornarlas en su orden
    if (prueba.preguntasIds && prueba.preguntasIds.length > 0) {
      const byId = new Map(banco.map(p => [p.id, p]));
      const exactQuestions = prueba.preguntasIds
        .map(id => byId.get(id))
        .filter((p): p is Pregunta => Boolean(p));
      if (exactQuestions.length > 0) {
        rawList = exactQuestions;
      }
    }

    // 2. Fallback por asignatura si no hay preguntas explícitas
    if (rawList.length === 0) {
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
      rawList = result;
    }

    // ── SEGURIDAD (Fase 3.2): Sanitización estricta para el estudiante ──
    // Las claves de respuesta (respuestaCorrecta y alternativas[].es_correcta)
    // NUNCA deben estar presentes en el árbol de componentes ni en memoria del alumno.
    return rawList.map(p => ({
      ...p,
      respuestaCorrecta: null,
      alternativas: p.alternativas.map(a => ({
        letra: a.letra,
        texto: a.texto,
        es_correcta: false
      }))
    }));
  };

  // Render active content area
  const renderMainContent = () => {
    // Admin, Director, UTP and Profesor share the staff view
    if (user.rol === 'profesor' || user.rol === 'admin' || user.rol === 'director' || user.rol === 'utp') {
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
          // RBAC: admin, director y utp pueden acceder al listado del equipo docente
          if (user.rol === 'profesor') {
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
        case 'biblioteca':
          return <BibliotecaPage />;
        case 'descarga-demre':
          return <DescargaDemrePage />;

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
          if (user.rol === 'director') {
            return (
              <DirectorDashboard
                director={user}
                pruebas={dashboardPruebas}
                onNavigateToEvaluaciones={() => setActivePage('evaluaciones')}
                onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
              />
            );
          }
          if (user.rol === 'utp') {
            return (
              <UtpDashboard
                utp={user}
                pruebas={dashboardPruebas}
                onNavigateToEvaluaciones={() => setActivePage('evaluaciones')}
                onSelectPruebaReporte={(id) => setSelectedReportPruebaId(id)}
              />
            );
          }
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
        if (isLoadingPreguntas || !activePruebaPreguntas) {
          return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-white">Preparando tu evaluación...</h3>
                <p className="text-sm text-slate-400">Cargando las preguntas oficiales de {activePruebaForRunner.titulo}</p>
              </div>
            </div>
          );
        }

        return (
          <AlumnoEvaluationView
            prueba={activePruebaForRunner}
            preguntas={activePruebaPreguntas}
            alumno={user}
            onFinish={handleFinishRendicion}
            onCancel={() => {
              setActivePruebaForRunner(null);
              setActivePruebaPreguntas(null);
            }}
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

      // Filtrar evaluaciones exclusivas para el alumno:
      // Si es Florencia León Pizarro, restricción estricta: ÚNICAMENTE PAES Matemática 1 (M1).
      const isFlorencia = user.email?.toLowerCase().trim() === 'florenciaangelicaleonpizarro@gmail.com';
      const pendingCode = sessionStorage.getItem('pending_eval_code');
      const pruebasParaAlumno = (() => {
        const activas = pruebas.filter(p => p.estado === 'activa');
        if (isFlorencia) {
          const matchFlorencia = activas.filter(isPaesMat1);
          return matchFlorencia;
        }
        if (pendingCode) {
          const match = activas.filter(
            p => p.codigoPublico?.toLowerCase() === pendingCode.toLowerCase() || p.id.toLowerCase() === pendingCode.toLowerCase()
          );
          if (match.length > 0) return match;
        }
        return activas;
      })();

      return (
        <AlumnoPortal
          alumno={user}
          pruebasDisponibles={pruebasParaAlumno}
          historialRendiciones={rendiciones.filter(r => r.alumnoId === user.id)}
          onStartEvaluation={handleStartEvaluation}
        />
      );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col`}>
      {/* Banner de aviso si un docente/admin tiene abierto un enlace con código de alumno */}
      {typeof window !== 'undefined' && sessionStorage.getItem('pending_eval_code') && user.rol !== 'alumno' && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-2 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Enlace de evaluación para alumnos detectado (Código: <strong>{sessionStorage.getItem('pending_eval_code')}</strong>).
              Tienes sesión abierta como <strong>{user.nombre} {user.apellido}</strong> ({user.rol}).
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const pending = sessionStorage.getItem('pending_eval_code')?.toLowerCase();
                const found = pruebas.find(p => p.codigoPublico?.toLowerCase() === pending || p.id.toLowerCase() === pending);
                if (found) {
                  handleStartEvaluation(found);
                }
              }}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Previsualizar como Alumno
            </button>
            <button
              onClick={async () => {
                await logout();
                setShowLanding(false);
                setAuthView('login');
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Cerrar Sesión para Alumno
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 flex">
      {/* Sidebar Navigation — oculto para rol alumno */}
      {user.rol !== 'alumno' && (<Sidebar
        activePage={activePage}
        isSandboxMode={isSandboxMode}
        onNavigate={(page) => {
          setSelectedReportPruebaId(null);
          setActivePruebaForRunner(null);
          setActivePage(page);
          // Registrar en historial del navegador para que el botón atrás funcione dentro de la app
          window.history.pushState({ page }, '', window.location.pathname);
        }}
      />)}

      {/* Main Container */}
      <div className={`flex-1 ${user.rol !== 'alumno' ? 'lg:pl-64' : ''} flex flex-col min-w-0`}>
        <SandboxBanner isDemo={isSandboxMode} />
        {/* Banner informativo si un docente/admin abre el enlace de un alumno */}
        {user.rol !== 'alumno' && typeof window !== 'undefined' && sessionStorage.getItem('pending_eval_code') && (
          <div className="bg-amber-600/90 text-white text-xs font-semibold px-4 py-2.5 flex items-center justify-between shadow-md">
            <span>
              ℹ️ Abriste un enlace de evaluación para alumnos (código: <strong>{sessionStorage.getItem('pending_eval_code')}</strong>). Tienes sesión activa como <strong>{user.nombre} ({user.rol})</strong>.
            </span>
            <button
              onClick={async () => {
                await logout();
                setAuthView('login');
              }}
              className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition-all text-[11px] whitespace-nowrap"
            >
              Cerrar sesión e ingresar como alumno
            </button>
          </div>
        )}
        <Navbar
          user={user}
          onRoleChange={(role, extra) => {
            setSelectedReportPruebaId(null);
            setActivePruebaForRunner(null);
            setActivePage('dashboard');
            switchRole(role, extra);
          }}
          onGoToLanding={user.rol !== 'alumno' ? () => {
            if (isSandboxMode) {
              logout();
            }
            setShowLanding(true);
          } : undefined}
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
