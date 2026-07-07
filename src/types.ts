export interface Analista {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface ReporteTurno {
  id?: number;
  fecha: string;
  grupo: string;
  analista: string;
  turno: number;
  temp_cumple: boolean;
  hum_cumple: boolean;
  caida_tension: string;
  observaciones_ambiente: string;
  estado: 'Borrador' | 'Terminado';
  created_at?: string;
}

export interface ProductoTurno {
  id?: number;
  reporte_id?: number;
  codigo_sap: string;
  descripcion: string;
  lote: string;
  cantidad: string;
  obs: string;
}

export interface ProductoObservacion {
  id?: number;
  reporte_id?: number;
  codigo_sap: string;
  descripcion: string;
  orden: string;
  lote: string;
  defecto: string;
  ticket: string;
  nca: string;
  causa_raiz: string;
  acciones: string;
  obs: string;
}

export interface Trazabilidad {
  id?: number;
  reporte_creacion_id?: number;
  reporte_resolucion_id?: number | null;
  tipo: string;
  codigo_sap: string;
  descripcion: string;
  orden: string;
  lote: string;
  defecto: string;
  ticket: string;
  estado: 'Pendiente' | 'Finalizada';
  obs: string;
}

export interface DesviacionSinRetencion {
  id?: number;
  reporte_id?: number;
  hora: string;
  codigo_sap: string;
  descripcion: string;
  lote: string;
  tipo: string;
  defecto: string;
  nca: string;
  paletas_afectadas: string;
  pruebas_funcionales: string;
  observaciones: string;
}

export interface ObservacionGeneral {
  id?: number;
  reporte_id?: number;
  tipo_evento: string;
  descripcion: string;
}

export interface Pendiente {
  id?: number;
  reporte_creacion_id?: number;
  reporte_resolucion_id?: number | null;
  descripcion: string;
  responsable: string;
  observaciones: string;
  estado: 'Pendiente' | 'Realizado';
}

export interface IdentificacionRociadoras {
  id?: number;
  reporte_id?: number;
  linea: string;
  maquina: string;
  color: string;
}

export interface ReporteCompleto {
  reporte_id?: number;
  cabecera: ReporteTurno;
  productos: ProductoTurno[];
  observaciones: ProductoObservacion[];
  desviaciones: DesviacionSinRetencion[];
  generales: ObservacionGeneral[];
  rociadoras: IdentificacionRociadoras[];
  trazabilidades_nuevas: Trazabilidad[];
  trazabilidades_resueltas: number[]; // ids of resolved active trazabilidades
  pendientes_nuevos: Pendiente[];
  pendientes_resueltos: number[]; // ids of resolved active pendientes
}
