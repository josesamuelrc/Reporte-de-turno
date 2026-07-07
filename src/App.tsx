import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  CheckCircle2, 
  PlusCircle, 
  Database, 
  Settings, 
  History, 
  AlertOctagon, 
  AlertTriangle,
  ClipboardCheck,
  Sparkles
} from 'lucide-react';
import { 
  getAnalistas, 
  getUltimoReporteBorrador, 
  guardarReporteCompleto, 
  terminarReporte, 
  getReportePorId, 
  isSupabaseConnected 
} from './db';
import { 
  ReporteTurno, 
  ProductoTurno, 
  ProductoObservacion, 
  DesviacionSinRetencion, 
  ObservacionGeneral, 
  IdentificacionRociadoras, 
  Trazabilidad, 
  Pendiente, 
  ReporteCompleto 
} from './types';

// Tab components
import TabGeneral from './components/TabGeneral';
import TabCalidad from './components/TabCalidad';
import TabSeguimiento from './components/TabSeguimiento';
import TabRociadoras from './components/TabRociadoras';
import TabResumen from './components/TabResumen';
import TabHistorial from './components/TabHistorial';
import TabConfiguracion from './components/TabConfiguracion';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'general' | 'calidad' | 'seguimiento' | 'rociadoras' | 'resumen' | 'historial' | 'configuracion'>('general');
  const [dbConnected, setDbConnected] = useState(false);

  // Analysts State
  const [analistas, setAnalistas] = useState<string[]>([]);

  // Main Report State
  const [reporteId, setReporteId] = useState<number | undefined>(undefined);
  const [editable, setEditable] = useState(true);
  const [cabecera, setCabecera] = useState<ReporteTurno>({
    fecha: '',
    grupo: 'A',
    analista: '',
    turno: 1,
    temp_cumple: true,
    hum_cumple: true,
    caida_tension: '',
    observaciones_ambiente: '',
    estado: 'Borrador'
  });
  const [productos, setProductos] = useState<ProductoTurno[]>([]);
  const [observaciones, setObservaciones] = useState<ProductoObservacion[]>([]);
  const [desviaciones, setDesviaciones] = useState<DesviacionSinRetencion[]>([]);
  const [generales, setGenerales] = useState<ObservacionGeneral[]>([]);
  const [rociadoras, setRociadoras] = useState<IdentificacionRociadoras[]>([]);
  const [trazabilidadesNuevas, setTrazabilidadesNuevas] = useState<Trazabilidad[]>([]);
  const [trazabilidadesResueltas, setTrazabilidadesResueltas] = useState<number[]>([]);
  const [pendientesNuevos, setPendientesNuevos] = useState<Pendiente[]>([]);
  const [pendientesResueltos, setPendientesResueltos] = useState<number[]>([]);

  // Trigger to update trace/issues lists
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize dates
  const initFecha = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Load analysts list and active borrador report on mount
  const loadInitialData = async () => {
    setDbConnected(isSupabaseConnected());
    
    // Load analysts
    try {
      const list = await getAnalistas();
      setAnalistas(list);
    } catch (e) {
      console.error("Error loading analysts list", e);
    }

    // Try to load any existing "Borrador" shift report
    try {
      const draft = await getUltimoReporteBorrador();
      if (draft) {
        cargarReporteEnPantalla(draft);
      } else {
        resetearNuevoReporte();
      }
    } catch (e) {
      console.error("Error loading active draft", e);
      resetearNuevoReporte();
    }
  };

  const handleConfigChanged = () => {
    loadInitialData();
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load a complete report payload into the form states
  const cargarReporteEnPantalla = (payload: ReporteCompleto) => {
    setReporteId(payload.reporte_id);
    setCabecera(payload.cabecera);
    setProductos(payload.productos);
    setObservaciones(payload.observaciones);
    setDesviaciones(payload.desviaciones);
    setGenerales(payload.generales);
    setRociadoras(payload.rociadoras);
    setTrazabilidadesNuevas(payload.trazabilidades_nuevas);
    setTrazabilidadesResueltas(payload.trazabilidades_resueltas);
    setPendientesNuevos(payload.pendientes_nuevos || []);
    setPendientesResueltos(payload.pendientes_resueltos);
    setEditable(payload.cabecera.estado === 'Borrador');
    
    // Force lists to update
    setRefreshTrigger(prev => prev + 1);
  };

  // Clear everything and set a fresh form state
  const resetearNuevoReporte = () => {
    setReporteId(undefined);
    setCabecera({
      fecha: initFecha(),
      grupo: 'A',
      analista: '',
      turno: 1,
      temp_cumple: true,
      hum_cumple: true,
      caida_tension: '',
      observaciones_ambiente: '',
      estado: 'Borrador'
    });
    setProductos([]);
    setObservaciones([]);
    setDesviaciones([]);
    setGenerales([]);
    setRociadoras([]);
    setTrazabilidadesNuevas([]);
    setTrazabilidadesResueltas([]);
    setPendientesNuevos([]);
    setPendientesResueltos([]);
    setEditable(true);

    // Refresh trace and issue lists
    setRefreshTrigger(prev => prev + 1);
  };

  // Trigger loading report from history
  const handleLoadReportePorId = async (id: number) => {
    try {
      const rep = await getReportePorId(id);
      if (rep) {
        cargarReporteEnPantalla(rep);
        setActiveTab('general');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert(`No se encontró el reporte N°${id}.`);
      }
    } catch (err) {
      console.error("Error reading report details", err);
      alert("No se pudo cargar el reporte.");
    }
  };

  // Compile full object payload for database saving
  const recopilarPayload = (): ReporteCompleto => {
    return {
      reporte_id: reporteId,
      cabecera,
      productos,
      observaciones,
      desviaciones,
      generales,
      rociadoras,
      trazabilidades_nuevas: trazabilidadesNuevas,
      trazabilidades_resueltas: trazabilidadesResueltas,
      pendientes_nuevos: pendientesNuevos,
      pendientes_resueltos: pendientesResueltos
    };
  };

  // Action: Save progress
  const handleGuardarAvance = async (mostrarAlerta = true): Promise<boolean> => {
    if (!cabecera.analista) {
      alert('Debe seleccionar un analista antes de guardar.');
      setActiveTab('general');
      return false;
    }

    try {
      const payload = recopilarPayload();
      const newId = await guardarReporteCompleto(payload);
      setReporteId(newId);
      
      if (mostrarAlerta) {
        alert(`¡Avance guardado con éxito! ID de Reporte: N°${newId}`);
      }
      
      // Sync list
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (err: any) {
      console.error("Error saving progress", err);
      alert(`Error al guardar: ${err.message || err}`);
      return false;
    }
  };

  // Action: Terminate shift
  const handleTerminarTurno = async () => {
    if (!cabecera.analista) {
      alert('Debe seleccionar un analista antes de terminar el turno.');
      setActiveTab('general');
      return;
    }

    const confirmTerminar = window.confirm(
      '¿Está seguro de TERMINAR EL TURNO?\n\n' +
      'Una vez cerrado, el reporte quedará finalizado y bloqueado de forma permanente. ' +
      'Las tareas y trazabilidades marcadas como resueltas se consolidarán, y las nuevas pasarán como herencia al siguiente turno.'
    );

    if (!confirmTerminar) return;

    // Save first
    const saved = await handleGuardarAvance(false);
    if (!saved || !reporteId) {
      alert('No se pudo guardar el reporte antes de cerrarlo. Intente de nuevo.');
      return;
    }

    try {
      await terminarReporte(reporteId);
      setEditable(false);
      setCabecera(prev => ({ ...prev, estado: 'Terminado' }));
      alert(`¡Turno terminado y consolidado con éxito! Reporte N°${reporteId} finalizado.`);
      
      // Go to summary to review or print
      setActiveTab('resumen');
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error("Error ending shift", err);
      alert(`Error al finalizar turno: ${err.message || err}`);
    }
  };

  // Action: Start new shift
  const handleComenzarNuevoTurno = () => {
    const confirmNuevo = window.confirm('¿Desea abrir un formulario en blanco para un NUEVO TURNO?');
    if (!confirmNuevo) return;
    
    resetearNuevoReporte();
    setActiveTab('general');
  };

  // Action: Fill with comprehensive, high-fidelity sample test data representing the user's exactly requested report scenario
  const handleLlenarDatosPrueba = () => {
    // Fill out cabecera
    setCabecera({
      fecha: '2026-06-25',
      grupo: 'A',
      analista: 'BRUNO MUÑOZ',
      turno: 2,
      temp_cumple: true,
      hum_cumple: true,
      caida_tension: 'Sin caídas de tensión',
      observaciones_ambiente: 'Condiciones ambientales controladas óptimas en sala de envasado.',
      estado: 'Borrador'
    });

    // Fill out products
    setProductos([
      {
        codigo_sap: 'Y00386',
        descripcion: 'Rockstar sleek',
        lote: 'NR6J252A3',
        cantidad: '34 PAL',
        obs: 'Producción conforme'
      },
      {
        codigo_sap: 'Y00108',
        descripcion: 'Solera Light',
        lote: 'NR6J252B3',
        cantidad: '34 PAL',
        obs: 'Producción conforme'
      }
    ]);

    // Fill out observations (retenciones)
    setObservaciones([
      {
        codigo_sap: 'Y00255',
        descripcion: 'Golden Manzana',
        orden: '70161139',
        lote: 'NR6J252A3',
        defecto: 'Exposición Metálica por Rociadora 32 y Decoración Defectuosa',
        ticket: '2,3',
        nca: '2 PAL',
        causa_raiz: 'Falla técnica en sistema de rociado de máquina 32',
        acciones: 'Se rerociaron y aprobaron en el turno las paletas 5,6,7,8,9',
        obs: 'Trazabilidad Realizada:\n\n- PAL 1,2,3,4,9,10,11,12 ✅'
      }
    ]);

    // Fill out desviaciones sin retencion
    setDesviaciones([
      {
        hora: '21:30',
        codigo_sap: 'Y00108',
        descripcion: 'Solera Light',
        lote: 'L1234',
        tipo: 'Formación',
        defecto: 'Marca de formación cumple NCA',
        nca: 'N/A',
        paletas_afectadas: '0',
        pruebas_funcionales: 'Conforme',
        observaciones: 'Monitoreo preventivo continuo.'
      }
    ]);

    // Fill out observaciones generales
    setGenerales([
      {
        tipo_evento: 'OPERACION / LINEAS',
        descripcion: 'Se arrancan las líneas a las 9:00 p.m aprox por contingencia de tubería rota qué alimenta a las torres de enfriamiento. Se observa afectación en el almacén de producto terminado, moviéndose las paletas afectadas a las filas G0,G4,G5,G6,G7,O4,O8,O9.'
      },
      {
        tipo_evento: 'PROCESO / FLEJES',
        descripcion: 'Se envía correo de metodología manual de ajuste de flejes en linea con regleta de flejadora.'
      },
      {
        tipo_evento: 'CALIDAD / AVISO C3',
        descripcion: 'Se crea aviso C3 interno por contaminación interna de Rockstar Lote NR6J242A3'
      },
      {
        tipo_evento: 'REVISION / REPALETIZADO',
        descripcion: 'SKU: Pilsen sleek - Orden: 70160904 - Lote: NR6J161B3 - #Ticket: 10 CAM - Total: 10 CAM'
      },
      {
        tipo_evento: 'REVISION / REPALETIZADO 2',
        descripcion: 'SKU: Pilsen Sleek - Orden: 70160783 - Lote: NR6J191A3 - #Ticket: 8,9,6,11 - Total: 4 PAL'
      },
      {
        tipo_evento: 'REVISION / REROCIADO',
        descripcion: 'SKU: Rockstar - Orden: 70158496 - Lote: NR6B141B3 - #Ticket: 5,9,6, Resto de 10 camadas. - Total: 3 PAL + 10 CAM'
      },
      {
        tipo_evento: 'RESUMEN REVISION',
        descripcion: 'Total General: 7 PAL + 20 CAM'
      }
    ]);

    // Fill out rociadoras
    setRociadoras([
      { linea: 'L3', maquina: '32', color: 'Rojo' },
      { linea: 'L3', maquina: '34', color: 'Verde' },
      { linea: 'L1', maquina: '12', color: 'Azul' }
    ]);

    // Fill out trace list (trazabilidades nuevas)
    setTrazabilidadesNuevas([
      {
        tipo: 'Hacia adelante',
        codigo_sap: 'Y00386',
        descripcion: 'Trazabilidad de empaque',
        orden: '70161139',
        lote: 'NR6J252A3',
        defecto: 'Exposición Metálica',
        ticket: '2,3',
        estado: 'Finalizada',
        obs: 'PAL 1,2,3,4,9,10,11,12 ✅'
      }
    ]);

    // Fill out pending tasks (pendientes_nuevos)
    setPendientesNuevos([
      {
        descripcion: 'Prueba de roce',
        responsable: 'Siguiente Turno',
        observaciones: 'Verificar al inicio de la jornada',
        estado: 'Pendiente'
      }
    ]);

    alert('¡Formulario auto-completado con datos de prueba realistas! Puede revisar todas las pestañas y exportar.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
      
      {/* TOP STATUS BAR (Hidden when printing) */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-[10px] sm:text-xs font-semibold border-b border-slate-800 print:hidden flex items-center justify-between gap-4 shrink-0">
        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Sistema de Inspección de Turno v1.2.5</span>
        {dbConnected ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Supabase Cloud Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-slate-500"></span>
            LocalStorage Activo
          </span>
        )}
      </div>

      {/* HEADER BAR (Hidden when printing) */}
      <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 print:hidden shadow-xs h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-extrabold text-sm px-3 py-1.5 rounded-xl tracking-wider shadow-lg shadow-indigo-100">
              SE
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-800">Inspección de Turno</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control de Calidad e Incidencias</p>
            </div>
          </div>
        </div>
      </header>

      {/* WARNING INDICATORS (Fila Superior) (Hidden when printing) */}
      <section className="bg-slate-50/50 border-b border-slate-200 py-4 px-4 print:hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Active Shift details summary */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center gap-3">
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="block font-bold text-slate-400 uppercase text-[10px] tracking-wider">Reporte Actual</span>
              <span className="font-bold text-slate-800 block mt-0.5">
                {reporteId ? `Reporte N°${reporteId}` : 'Borrador sin Guardar'}
              </span>
              <span className="text-slate-500 block text-[10px] mt-0.5">
                {cabecera.fecha ? `Fecha: ${cabecera.fecha}` : 'Sin fecha'} | Grupo: {cabecera.grupo}
              </span>
            </div>
          </div>

          {/* Alert: Products held under observation */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center gap-3">
            <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="block font-bold text-rose-400 uppercase text-[10px] tracking-wider">Bajo Observación</span>
              <span className="font-extrabold text-rose-700 block text-sm mt-0.5">
                {observaciones.length} Lote(s) Retenido(s)
              </span>
              <span className="text-rose-500/75 block text-[10px] mt-0.5">Requieren inspección en laboratorio</span>
            </div>
          </div>

          {/* Alert: Deviations without hold */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="block font-bold text-amber-400 uppercase text-[10px] tracking-wider">Desviaciones Operativas</span>
              <span className="font-extrabold text-amber-700 block text-sm mt-0.5">
                {desviaciones.length} Desviación(es) Menor(es)
              </span>
              <span className="text-amber-600 block text-[10px] mt-0.5">Registradas en envasadoras</span>
            </div>
          </div>

        </div>
      </section>

      {/* TAB NAVIGATION (Hidden when printing) */}
      <nav className="bg-white border-b border-slate-200 print:hidden overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'general' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Datos y Operación
          </button>
          <button
            onClick={() => setActiveTab('calidad')}
            className={`py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'calidad' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔍 Calidad e Incidentes
          </button>
          <button
            onClick={() => setActiveTab('seguimiento')}
            className={`py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'seguimiento' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📌 Seguimiento y Cierre
          </button>
          <button
            onClick={() => setActiveTab('rociadoras')}
            className={`py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rociadoras' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🎨 Rociadoras
          </button>
          <button
            onClick={() => setActiveTab('resumen')}
            className={`py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'resumen' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Resumen Visual
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'historial' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Historial de Turnos
          </button>
        </div>
      </nav>

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 print:p-0">
        <div className="print:block">
          {activeTab === 'general' && (
            <TabGeneral 
              cabecera={cabecera}
              onChangeCabecera={(c) => setCabecera(prev => ({ ...prev, ...c }))}
              productos={productos}
              onChangeProductos={setProductos}
              analistas={analistas}
              editable={editable}
            />
          )}

          {activeTab === 'calidad' && (
            <TabCalidad
              observaciones={observaciones}
              onChangeObservaciones={setObservaciones}
              desviaciones={desviaciones}
              onChangeDesviaciones={setDesviaciones}
              generales={generales}
              onChangeGenerales={setGenerales}
              editable={editable}
            />
          )}

          {activeTab === 'seguimiento' && (
            <TabSeguimiento
              trazabilidadesNuevas={trazabilidadesNuevas}
              onChangeTrazabilidadesNuevas={setTrazabilidadesNuevas}
              trazabilidadesResueltas={trazabilidadesResueltas}
              onChangeTrazabilidadesResueltas={setTrazabilidadesResueltas}
              pendientesNuevos={pendientesNuevos}
              onChangePendientesNuevos={setPendientesNuevos}
              pendientesResueltos={pendientesResueltos}
              onChangePendientesResueltos={setPendientesResueltos}
              editable={editable}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'rociadoras' && (
            <TabRociadoras
              rociadoras={rociadoras}
              onChangeRociadoras={setRociadoras}
              editable={editable}
            />
          )}

          {activeTab === 'resumen' && (
            <TabResumen 
              reporte={recopilarPayload()}
            />
          )}

          {activeTab === 'historial' && (
            <TabHistorial
              onLoadReporte={handleLoadReportePorId}
              currentReporteId={reporteId}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'configuracion' && (
            <TabConfiguracion 
              onConfigChanged={handleConfigChanged}
            />
          )}
        </div>
      </main>

      {/* FOOTER ACTION BAR (Hidden when printing) */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 print:hidden shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div>
            {!editable && (
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> REPORTE FINALIZADO Y CONSOLIDADO
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!editable && (
              <button
                onClick={handleComenzarNuevoTurno}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Iniciar Nuevo Turno
              </button>
            )}

            {editable && (
              <>
                <button
                  onClick={handleLlenarDatosPrueba}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-amber-100 transition-all"
                  title="Llena todo el formulario con datos de prueba realistas"
                >
                  <Sparkles className="w-4 h-4" />
                  Cargar Datos de Prueba
                </button>
                <button
                  onClick={() => handleGuardarAvance(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-100 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Guardar Avance
                </button>
                <button
                  onClick={handleTerminarTurno}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Terminar Turno
                </button>
              </>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}
