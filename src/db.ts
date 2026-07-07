import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  ReporteCompleto, 
  Analista, 
  ReporteTurno, 
  ProductoTurno, 
  ProductoObservacion, 
  DesviacionSinRetencion, 
  ObservacionGeneral, 
  IdentificacionRociadoras, 
  Trazabilidad, 
  Pendiente 
} from './types';

// Default analistas list
const DEFAULT_ANALISTAS: string[] = [
  'BRUNO MUÑOZ',
  'STEFFANY OSTO',
  'DARWIN MARQUEZ',
  'GABRIELA LOPEZ',
  'DIEGO SANTAMARIA',
  'JOSÉ SEGOVIA'
];

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Check for env variables or local storage configuration
const getEnvConfig = (): SupabaseConfig | null => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  if (url && anonKey && url !== 'MY_SUPABASE_URL' && anonKey !== 'MY_SUPABASE_ANON_KEY') {
    return { url, anonKey };
  }
  return null;
};

export const getSavedSupabaseConfig = (): SupabaseConfig | null => {
  const env = getEnvConfig();
  if (env) return env;

  const stored = localStorage.getItem('supabase_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem('supabase_config', JSON.stringify({ url, anonKey }));
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('supabase_config');
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSavedSupabaseConfig();
  if (!config) {
    cachedClient = null;
    return null;
  }
  
  if (!cachedClient) {
    cachedClient = createClient(config.url, config.anonKey);
  }
  return cachedClient;
};

export const isSupabaseConnected = (): boolean => {
  return getSupabaseClient() !== null;
};

// ==========================================
// LOCAL STORAGE BACKEND (FULL DATABASE ENGINE)
// ==========================================

const getLocalData = (key: string, defaultValue: any = []) => {
  const val = localStorage.getItem(`db_${key}`);
  if (!val) return defaultValue;
  try {
    return JSON.parse(val);
  } catch {
    return defaultValue;
  }
};

const setLocalData = (key: string, data: any) => {
  localStorage.setItem(`db_${key}`, JSON.stringify(data));
};

// Initialize default data if empty
const initLocalDb = () => {
  if (!localStorage.getItem('db_analistas')) {
    const analistas: Analista[] = DEFAULT_ANALISTAS.map((nombre, i) => ({
      id: i + 1,
      nombre,
      activo: true
    }));
    setLocalData('analistas', analistas);
  }
};

initLocalDb();

// ==========================================
// UNIFIED DATABASE SERVICE
// ==========================================

export const getAnalistas = async (): Promise<string[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('analistas')
        .select('nombre')
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(r => r.nombre);
      }
    } catch (e) {
      console.error("Supabase Error, falling back to Local", e);
    }
  }

  // Fallback
  const local: Analista[] = getLocalData('analistas');
  return local.filter(a => a.activo).map(a => a.nombre).sort();
};

export const getPendientesActivos = async (): Promise<Pendiente[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pendientes')
        .select('*')
        .eq('estado', 'Pendiente')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Supabase error fetching active issues", e);
    }
  }

  // Fallback
  const pendientes: Pendiente[] = getLocalData('pendientes');
  return pendientes.filter(p => p.estado === 'Pendiente');
};

export const getTrazabilidadActiva = async (): Promise<Trazabilidad[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('trazabilidad')
        .select('*')
        .eq('estado', 'Pendiente')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Supabase error fetching active traceability", e);
    }
  }

  // Fallback
  const list: Trazabilidad[] = getLocalData('trazabilidad');
  return list.filter(t => t.estado === 'Pendiente');
};

export const getUltimoReporteBorrador = async (): Promise<ReporteCompleto | null> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: cabeceras, error: errCab } = await supabase
        .from('reporte_turno')
        .select('*')
        .eq('estado', 'Borrador')
        .order('id', { ascending: false })
        .limit(1);
      
      if (errCab) throw errCab;
      if (!cabeceras || cabeceras.length === 0) return null;

      const cabecera = cabeceras[0] as ReporteTurno;
      const rId = cabecera.id!;

      const [
        { data: productos },
        { data: observaciones },
        { data: desviaciones },
        { data: generales },
        { data: rociadoras },
        { data: trazabilidades_nuevas },
        { data: trazabilidades_resueltas },
        { data: pendientes_nuevos },
        { data: pendientes_resueltos }
      ] = await Promise.all([
        supabase.from('productos_turno').select('*').eq('reporte_id', rId),
        supabase.from('producto_observacion').select('*').eq('reporte_id', rId),
        supabase.from('desviaciones_sin_retencion').select('*').eq('reporte_id', rId),
        supabase.from('observaciones_generales').select('*').eq('reporte_id', rId),
        supabase.from('identificacion_rociadoras').select('*').eq('reporte_id', rId),
        supabase.from('trazabilidad').select('*').eq('reporte_creacion_id', rId),
        supabase.from('trazabilidad').select('id').eq('reporte_resolucion_id', rId),
        supabase.from('pendientes').select('*').eq('reporte_creacion_id', rId),
        supabase.from('pendientes').select('id').eq('reporte_resolucion_id', rId)
      ]);

      return {
        reporte_id: rId,
        cabecera,
        productos: productos || [],
        observaciones: observaciones || [],
        desviaciones: desviaciones || [],
        generales: generales || [],
        rociadoras: rociadoras || [],
        trazabilidades_nuevas: trazabilidades_nuevas || [],
        trazabilidades_resueltas: (trazabilidades_resueltas || []).map(r => r.id),
        pendientes_nuevos: pendientes_nuevos || [],
        pendientes_resueltos: (pendientes_resueltos || []).map(r => r.id)
      };
    } catch (e) {
      console.error("Supabase error fetching borrador, using local fallback", e);
    }
  }

  // Fallback
  const cabeceras: ReporteTurno[] = getLocalData('reporte_turno');
  const borrador = cabeceras.find(c => c.estado === 'Borrador');
  if (!borrador) return null;

  const rId = borrador.id!;
  const productos: ProductoTurno[] = getLocalData('productos_turno').filter((p: any) => p.reporte_id === rId);
  const observaciones: ProductoObservacion[] = getLocalData('producto_observacion').filter((p: any) => p.reporte_id === rId);
  const desviaciones: DesviacionSinRetencion[] = getLocalData('desviaciones_sin_retencion').filter((p: any) => p.reporte_id === rId);
  const generales: ObservacionGeneral[] = getLocalData('observaciones_generales').filter((p: any) => p.reporte_id === rId);
  const rociadoras: IdentificacionRociadoras[] = getLocalData('identificacion_rociadoras').filter((p: any) => p.reporte_id === rId);
  
  const trazabilidades_nuevas: Trazabilidad[] = getLocalData('trazabilidad').filter((p: any) => p.reporte_creacion_id === rId);
  const trazabilidades_resueltas: number[] = getLocalData('trazabilidad')
    .filter((p: any) => p.reporte_resolucion_id === rId)
    .map((p: any) => p.id);

  const pendientes_nuevos: Pendiente[] = getLocalData('pendientes').filter((p: any) => p.reporte_creacion_id === rId);
  const pendientes_resueltos: number[] = getLocalData('pendientes')
    .filter((p: any) => p.reporte_resolucion_id === rId)
    .map((p: any) => p.id);

  return {
    reporte_id: rId,
    cabecera: borrador,
    productos,
    observaciones,
    desviaciones,
    generales,
    rociadoras,
    trazabilidades_nuevas,
    trazabilidades_resueltas,
    pendientes_nuevos,
    pendientes_resueltos
  };
};

export const terminarReporte = async (reporteId: number): Promise<void> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('reporte_turno')
        .update({ estado: 'Terminado' })
        .eq('id', reporteId);
      if (error) throw error;
      return;
    } catch (e) {
      console.error("Supabase error terminating report", e);
    }
  }

  // Fallback
  const cabeceras: ReporteTurno[] = getLocalData('reporte_turno');
  const index = cabeceras.findIndex(c => c.id === reporteId);
  if (index !== -1) {
    cabeceras[index].estado = 'Terminado';
    setLocalData('reporte_turno', cabeceras);
  }
};

export const guardarReporteCompleto = async (
  reporteCompleto: ReporteCompleto
): Promise<number> => {
  const {
    reporte_id,
    cabecera,
    productos,
    observaciones,
    desviaciones,
    generales,
    rociadoras,
    trazabilidades_nuevas,
    trazabilidades_resueltas,
    pendientes_nuevos,
    pendientes_resueltos
  } = reporteCompleto;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let rId = reporte_id;

      // 1. Guardar Cabecera (reporte_turno)
      if (rId) {
        // Actualizar
        const { error: errCab } = await supabase
          .from('reporte_turno')
          .update({
            fecha: cabecera.fecha,
            grupo: cabecera.grupo,
            analista: cabecera.analista,
            turno: cabecera.turno,
            temp_cumple: cabecera.temp_cumple,
            hum_cumple: cabecera.hum_cumple,
            caida_tension: cabecera.caida_tension,
            observaciones_ambiente: cabecera.observaciones_ambiente
          })
          .eq('id', rId);
        
        if (errCab) throw errCab;

        // Limpiar subtablas asociadas para sobreescribir
        await Promise.all([
          supabase.from('productos_turno').delete().eq('reporte_id', rId),
          supabase.from('producto_observacion').delete().eq('reporte_id', rId),
          supabase.from('desviaciones_sin_retencion').delete().eq('reporte_id', rId),
          supabase.from('observaciones_generales').delete().eq('reporte_id', rId),
          supabase.from('identificacion_rociadoras').delete().eq('reporte_id', rId),
          supabase.from('trazabilidad').delete().eq('reporte_creacion_id', rId),
          supabase.from('pendientes').delete().eq('reporte_creacion_id', rId),
          // Restaurar resoluciones previas vinculadas a este reporte
          supabase.from('trazabilidad').update({ estado: 'Pendiente', reporte_resolucion_id: null }).eq('reporte_resolucion_id', rId),
          supabase.from('pendientes').update({ estado: 'Pendiente', reporte_resolucion_id: null }).eq('reporte_resolucion_id', rId)
        ]);

      } else {
        // Insertar
        const { data, error: errCab } = await supabase
          .from('reporte_turno')
          .insert({
            fecha: cabecera.fecha,
            grupo: cabecera.grupo,
            analista: cabecera.analista,
            turno: cabecera.turno,
            temp_cumple: cabecera.temp_cumple,
            hum_cumple: cabecera.hum_cumple,
            caida_tension: cabecera.caida_tension,
            observaciones_ambiente: cabecera.observaciones_ambiente,
            estado: 'Borrador'
          })
          .select('id')
          .single();

        if (errCab) throw errCab;
        rId = data.id;
      }

      const activeId = rId!;

      // 2. Insertar subtablas
      const insertPromises: Promise<any>[] = [];

      if (productos.length > 0) {
        insertPromises.push(
          supabase.from('productos_turno').insert(
            productos.map(p => ({ ...p, reporte_id: activeId }))
          ) as any
        );
      }

      if (observaciones.length > 0) {
        insertPromises.push(
          supabase.from('producto_observacion').insert(
            observaciones.map(o => ({ ...o, reporte_id: activeId }))
          ) as any
        );
      }

      if (desviaciones.length > 0) {
        insertPromises.push(
          supabase.from('desviaciones_sin_retencion').insert(
            desviaciones.map(d => ({ ...d, reporte_id: activeId }))
          ) as any
        );
      }

      if (generales.length > 0) {
        insertPromises.push(
          supabase.from('observaciones_generales').insert(
            generales.map(g => ({ ...g, reporte_id: activeId }))
          ) as any
        );
      }

      if (rociadoras.length > 0) {
        insertPromises.push(
          supabase.from('identificacion_rociadoras').insert(
            rociadoras.map(r => ({ ...r, reporte_id: activeId }))
          ) as any
        );
      }

      if (trazabilidades_nuevas.length > 0) {
        insertPromises.push(
          supabase.from('trazabilidad').insert(
            trazabilidades_nuevas.map(t => ({
              tipo: t.tipo,
              codigo_sap: t.codigo_sap,
              descripcion: t.descripcion,
              orden: t.orden,
              lote: t.lote,
              defecto: t.defecto,
              ticket: t.ticket,
              estado: 'Pendiente',
              obs: t.obs,
              reporte_creacion_id: activeId
            }))
          ) as any
        );
      }

      if (pendientes_nuevos.length > 0) {
        insertPromises.push(
          supabase.from('pendientes').insert(
            pendientes_nuevos.map(p => ({
              descripcion: p.descripcion,
              responsable: p.responsable,
              observaciones: p.observaciones,
              estado: 'Pendiente',
              reporte_creacion_id: activeId
            }))
          ) as any
        );
      }

      // 3. Resolver Trazabilidades y Pendientes
      if (trazabilidades_resueltas.length > 0) {
        insertPromises.push(
          supabase
            .from('trazabilidad')
            .update({ estado: 'Finalizada', reporte_resolucion_id: activeId })
            .in('id', trazabilidades_resueltas) as any
        );
      }

      if (pendientes_resueltos.length > 0) {
        insertPromises.push(
          supabase
            .from('pendientes')
            .update({ estado: 'Realizado', reporte_resolucion_id: activeId })
            .in('id', pendientes_resueltos) as any
        );
      }

      await Promise.all(insertPromises);
      return activeId;

    } catch (e) {
      console.error("Supabase guardado completo falló, usando local", e);
    }
  }

  // ==========================================
  // LOCAL STORAGE FALLBACK ENGINE
  // ==========================================
  let rId = reporte_id;
  const cabeceras: ReporteTurno[] = getLocalData('reporte_turno');

  if (rId) {
    const index = cabeceras.findIndex(c => c.id === rId);
    if (index !== -1) {
      cabeceras[index] = { ...cabeceras[index], ...cabecera, id: rId };
    }
    setLocalData('reporte_turno', cabeceras);

    // Clean up associated children first to overwrite them
    const allProds: ProductoTurno[] = getLocalData('productos_turno').filter((p: any) => p.reporte_id !== rId);
    const allObs: ProductoObservacion[] = getLocalData('producto_observacion').filter((p: any) => p.reporte_id !== rId);
    const allDesv: DesviacionSinRetencion[] = getLocalData('desviaciones_sin_retencion').filter((p: any) => p.reporte_id !== rId);
    const allGen: ObservacionGeneral[] = getLocalData('observaciones_generales').filter((p: any) => p.reporte_id !== rId);
    const allRoc: IdentificacionRociadoras[] = getLocalData('identificacion_rociadoras').filter((p: any) => p.reporte_id !== rId);

    // Delete trace/issues originally created in this report
    const allTraz: Trazabilidad[] = getLocalData('trazabilidad').filter((p: any) => p.reporte_creacion_id !== rId);
    const allPend: Pendiente[] = getLocalData('pendientes').filter((p: any) => p.reporte_creacion_id !== rId);

    // Restore trace/issues marked resolved by this report back to Pendiente
    allTraz.forEach(t => {
      if (t.reporte_resolucion_id === rId) {
        t.estado = 'Pendiente';
        t.reporte_resolucion_id = null;
      }
    });
    allPend.forEach(p => {
      if (p.reporte_resolucion_id === rId) {
        p.estado = 'Pendiente';
        p.reporte_resolucion_id = null;
      }
    });

    setLocalData('productos_turno', allProds);
    setLocalData('producto_observacion', allObs);
    setLocalData('desviaciones_sin_retencion', allDesv);
    setLocalData('observaciones_generales', allGen);
    setLocalData('identificacion_rociadoras', allRoc);
    setLocalData('trazabilidad', allTraz);
    setLocalData('pendientes', allPend);

  } else {
    // Generar nuevo id
    rId = Date.now();
    const nuevoReporte: ReporteTurno = {
      ...cabecera,
      id: rId,
      estado: 'Borrador'
    };
    cabeceras.unshift(nuevoReporte); // Insertar al inicio
    setLocalData('reporte_turno', cabeceras);
  }

  const activeId = rId!;

  // Insertar hijos
  const localProds = getLocalData('productos_turno');
  productos.forEach(p => localProds.push({ ...p, id: Date.now() + Math.random(), reporte_id: activeId }));
  setLocalData('productos_turno', localProds);

  const localObs = getLocalData('producto_observacion');
  observaciones.forEach(o => localObs.push({ ...o, id: Date.now() + Math.random(), reporte_id: activeId }));
  setLocalData('producto_observacion', localObs);

  const localDesv = getLocalData('desviaciones_sin_retencion');
  desviaciones.forEach(d => localDesv.push({ ...d, id: Date.now() + Math.random(), reporte_id: activeId }));
  setLocalData('desviaciones_sin_retencion', localDesv);

  const localGen = getLocalData('observaciones_generales');
  generales.forEach(g => localGen.push({ ...g, id: Date.now() + Math.random(), reporte_id: activeId }));
  setLocalData('observaciones_generales', localGen);

  const localRoc = getLocalData('identificacion_rociadoras');
  rociadoras.forEach(r => localRoc.push({ ...r, id: Date.now() + Math.random(), reporte_id: activeId }));
  setLocalData('identificacion_rociadoras', localRoc);

  // Trace nuevas
  const localTraz: Trazabilidad[] = getLocalData('trazabilidad');
  trazabilidades_nuevas.forEach(t => localTraz.push({
    ...t,
    id: Math.floor(Math.random() * 1000000),
    estado: 'Pendiente',
    reporte_creacion_id: activeId
  }));
  
  // Trace resueltas
  trazabilidades_resueltas.forEach(id => {
    const idx = localTraz.findIndex(t => t.id === id);
    if (idx !== -1) {
      localTraz[idx].estado = 'Finalizada';
      localTraz[idx].reporte_resolucion_id = activeId;
    }
  });
  setLocalData('trazabilidad', localTraz);

  // Pendientes nuevos
  const localPend: Pendiente[] = getLocalData('pendientes');
  pendientes_nuevos.forEach(p => localPend.push({
    ...p,
    id: Math.floor(Math.random() * 1000000),
    estado: 'Pendiente',
    reporte_creacion_id: activeId
  }));

  // Pendientes resueltos
  pendientes_resueltos.forEach(id => {
    const idx = localPend.findIndex(p => p.id === id);
    if (idx !== -1) {
      localPend[idx].estado = 'Realizado';
      localPend[idx].reporte_resolucion_id = activeId;
    }
  });
  setLocalData('pendientes', localPend);

  return activeId;
};

export const getHistorialReportes = async (): Promise<ReporteTurno[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reporte_turno')
        .select('*')
        .order('fecha', { ascending: false })
        .order('id', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Supabase error fetching history", e);
    }
  }

  // Fallback
  return getLocalData('reporte_turno');
};

export const getReportePorId = async (id: number): Promise<ReporteCompleto | null> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: cabeceras, error: errCab } = await supabase
        .from('reporte_turno')
        .select('*')
        .eq('id', id)
        .single();
      
      if (errCab) throw errCab;
      if (!cabeceras) return null;

      const cabecera = cabeceras as ReporteTurno;

      const [
        { data: productos },
        { data: observaciones },
        { data: desviaciones },
        { data: generales },
        { data: rociadoras },
        { data: trazabilidades_nuevas },
        { data: trazabilidades_resueltas },
        { data: pendientes_nuevos },
        { data: pendientes_resueltos }
      ] = await Promise.all([
        supabase.from('productos_turno').select('*').eq('reporte_id', id),
        supabase.from('producto_observacion').select('*').eq('reporte_id', id),
        supabase.from('desviaciones_sin_retencion').select('*').eq('reporte_id', id),
        supabase.from('observaciones_generales').select('*').eq('reporte_id', id),
        supabase.from('identificacion_rociadoras').select('*').eq('reporte_id', id),
        supabase.from('trazabilidad').select('*').eq('reporte_creacion_id', id),
        supabase.from('trazabilidad').select('id').eq('reporte_resolucion_id', id),
        supabase.from('pendientes').select('*').eq('reporte_creacion_id', id),
        supabase.from('pendientes').select('id').eq('reporte_resolucion_id', id)
      ]);

      return {
        reporte_id: id,
        cabecera,
        productos: productos || [],
        observaciones: observaciones || [],
        desviaciones: desviaciones || [],
        generales: generales || [],
        rociadoras: rociadoras || [],
        trazabilidades_nuevas: trazabilidades_nuevas || [],
        trazabilidades_resueltas: (trazabilidades_resueltas || []).map(r => r.id),
        pendientes_nuevos: pendientes_nuevos || [],
        pendientes_resueltos: (pendientes_resueltos || []).map(r => r.id)
      };
    } catch (e) {
      console.error("Supabase error fetching report details", e);
    }
  }

  // Fallback
  const cabeceras: ReporteTurno[] = getLocalData('reporte_turno');
  const cabecera = cabeceras.find(c => c.id === id);
  if (!cabecera) return null;

  const productos: ProductoTurno[] = getLocalData('productos_turno').filter((p: any) => p.reporte_id === id);
  const observaciones: ProductoObservacion[] = getLocalData('producto_observacion').filter((p: any) => p.reporte_id === id);
  const desviaciones: DesviacionSinRetencion[] = getLocalData('desviaciones_sin_retencion').filter((p: any) => p.reporte_id === id);
  const generales: ObservacionGeneral[] = getLocalData('observaciones_generales').filter((p: any) => p.reporte_id === id);
  const rociadoras: IdentificacionRociadoras[] = getLocalData('identificacion_rociadoras').filter((p: any) => p.reporte_id === id);
  
  const trazabilidades_nuevas: Trazabilidad[] = getLocalData('trazabilidad').filter((p: any) => p.reporte_creacion_id === id);
  const trazabilidades_resueltas: number[] = getLocalData('trazabilidad')
    .filter((p: any) => p.reporte_resolucion_id === id)
    .map((p: any) => p.id);

  const pendientes_nuevos: Pendiente[] = getLocalData('pendientes').filter((p: any) => p.reporte_creacion_id === id);
  const pendientes_resueltos: number[] = getLocalData('pendientes')
    .filter((p: any) => p.reporte_resolucion_id === id)
    .map((p: any) => p.id);

  return {
    reporte_id: id,
    cabecera,
    productos,
    observaciones,
    desviaciones,
    generales,
    rociadoras,
    trazabilidades_nuevas,
    trazabilidades_resueltas,
    pendientes_nuevos,
    pendientes_resueltos
  };
};

export const getSqlSchema = (): string => {
  return `-- SQL de inicialización para Supabase (Copia y pega esto en la sección "SQL Editor" de tu panel Supabase)

CREATE TABLE IF NOT EXISTS analistas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar los analistas fijos
INSERT INTO analistas (nombre) VALUES 
('BRUNO MUÑOZ'),
('STEFFANY OSTO'),
('DARWIN MARQUEZ'),
('GABRIELA LOPEZ'),
('DIEGO SANTAMARIA'),
('JOSÉ SEGOVIA')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS reporte_turno (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    grupo TEXT NOT NULL,
    analista TEXT NOT NULL,
    turno INTEGER NOT NULL,
    temp_cumple BOOLEAN NOT NULL,
    hum_cumple BOOLEAN NOT NULL,
    caida_tension TEXT,
    observaciones_ambiente TEXT,
    estado TEXT DEFAULT 'Borrador',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos_turno (
    id SERIAL PRIMARY KEY,
    reporte_id INTEGER NOT NULL REFERENCES reporte_turno(id) ON DELETE CASCADE,
    codigo_sap TEXT,
    descripcion TEXT,
    lote TEXT,
    cantidad TEXT,
    obs TEXT
);

CREATE TABLE IF NOT EXISTS producto_observacion (
    id SERIAL PRIMARY KEY,
    reporte_id INTEGER NOT NULL REFERENCES reporte_turno(id) ON DELETE CASCADE,
    codigo_sap TEXT,
    descripcion TEXT,
    orden TEXT,
    lote TEXT,
    defecto TEXT,
    ticket TEXT,
    nca TEXT,
    causa_raiz TEXT,
    acciones TEXT,
    obs TEXT
);

CREATE TABLE IF NOT EXISTS trazabilidad (
    id SERIAL PRIMARY KEY,
    reporte_creacion_id INTEGER NOT NULL REFERENCES reporte_turno(id) ON DELETE CASCADE,
    reporte_resolucion_id INTEGER REFERENCES reporte_turno(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL,
    codigo_sap TEXT,
    descripcion TEXT,
    orden TEXT,
    lote TEXT,
    defecto TEXT,
    ticket TEXT,
    estado TEXT DEFAULT 'Pendiente',
    obs TEXT
);

CREATE TABLE IF NOT EXISTS desviaciones_sin_retencion (
    id SERIAL PRIMARY KEY,
    reporte_id INTEGER NOT NULL REFERENCES reporte_turno(id) ON DELETE CASCADE,
    hora TEXT,
    codigo_sap TEXT,
    descripcion TEXT,
    lote TEXT,
    tipo TEXT,
    defecto TEXT,
    nca TEXT,
    paletas_afectadas TEXT,
    pruebas_funcionales TEXT,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS observaciones_generales (
    id SERIAL PRIMARY KEY,
    reporte_id INTEGER NOT NULL REFERENCES reporte_turno(id) ON DELETE CASCADE,
    tipo_evento TEXT,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS pendientes (
    id SERIAL PRIMARY KEY,
    reporte_creacion_id INTEGER NOT NULL REFERENCES reporte_turno(id) ON DELETE CASCADE,
    reporte_resolucion_id INTEGER REFERENCES reporte_turno(id) ON DELETE SET NULL,
    descripcion TEXT NOT NULL,
    responsable TEXT,
    observaciones TEXT,
    estado TEXT DEFAULT 'Pendiente'
);

CREATE TABLE IF NOT EXISTS identificacion_rociadoras (
    id SERIAL PRIMARY KEY,
    reporte_id INTEGER NOT NULL REFERENCES reporte_turno(id) ON DELETE CASCADE,
    linea TEXT NOT NULL,
    maquina TEXT NOT NULL,
    color TEXT
);
`;
};
