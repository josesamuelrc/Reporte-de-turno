// TabResumen.tsx - Display Lote column inside tables & grid summaries
import React, { useRef, useState, useEffect } from 'react';
import { Printer, AlertOctagon, AlertTriangle, CheckCircle, XCircle, Tag, Layers, FileText, ArrowRightLeft, FileCheck, Copy, Package, ShieldAlert, RotateCcw } from 'lucide-react';
import { ReporteCompleto, LotePBO, Paleta, Reproceso } from '../types';
import { getLotesPBO, getPaletasPBO, getReprocesosPBO, getSavedSupabaseConfig } from '../db';
import { CATALOGO_PRODUCTOS_PBO } from './TabPBO';
import CompanyLogo from './CompanyLogo';

interface TabResumenProps {
  reporte: ReporteCompleto | null;
}

export default function TabResumen({ reporte }: TabResumenProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [pboLotes, setPboLotes] = useState<LotePBO[]>([]);
  const [pboPaletas, setPboPaletas] = useState<Paleta[]>([]);
  const [pboReprocesos, setPboReprocesos] = useState<Reproceso[]>([]);
  const [logoSrc, setLogoSrc] = useState<string>('/logo.png');

  useEffect(() => {
    const config = getSavedSupabaseConfig();
    if (config && config.url) {
      const cleanUrl = config.url.replace(/\/$/, '');
      setLogoSrc(`${cleanUrl}/storage/v1/object/public/logos/logo.png`);
    } else {
      setLogoSrc('/logo.png');
    }
  }, []);

  useEffect(() => {
    const loadPboData = async () => {
      try {
        const l = await getLotesPBO();
        const p = await getPaletasPBO();
        const r = await getReprocesosPBO();
        setPboLotes(l);
        setPboPaletas(p);
        setPboReprocesos(r);
      } catch (err) {
        console.error("Error loading PBO in TabResumen", err);
      }
    };
    loadPboData();
  }, []);

  if (!reporte) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-12 text-center text-slate-400">
        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3 animate-bounce" />
        <p className="text-base font-semibold">No hay datos activos en este turno.</p>
        <p className="text-xs mt-1">Guarde su avance o cargue un turno anterior para ver el resumen visual.</p>
      </div>
    );
  }

  const { cabecera, productos, observaciones, desviaciones, generales, rociadoras, trazabilidades_nuevas, pendientes_nuevos } = reporte;

  // Filter PBO lotes created/registered in this shift
  const matchingPboLotes = pboLotes.filter(
    l => l.fecha_registro === cabecera.fecha && l.turno_registro === cabecera.turno
  );

  const matchingReprocesos = pboReprocesos.filter(
    r => r.fecha_registro === cabecera.fecha && r.turno_registro === cabecera.turno
  );

  const handlePrint = () => {
    window.print();
  };

  const generateWhatsAppText = () => {
    // Format Date from YYYY-MM-DD to DD/MM/YY
    let formattedDate = cabecera.fecha;
    if (cabecera.fecha) {
      const parts = cabecera.fecha.split('-');
      if (parts.length === 3) {
        const year = parts[0].substring(2);
        const month = parts[1];
        const day = parts[2];
        formattedDate = `${day}/${month}/${year}`;
      }
    }

    let text = `====================================\n`;
    text += `❄️  *REPORTE DE TURNO - POLAR*  ❄️\n`;
    text += `📝 *Código:* ${cabecera.fecha ? `${cabecera.fecha.replace(/-/g, '')}-T${cabecera.turno}-${cabecera.grupo}` : 'TEMP'}\n`;
    text += `====================================\n\n`;
    
    text += `📅 *Fecha:* ${formattedDate}\n`;
    text += `👥 *Grupo:* ${cabecera.grupo} | ⏰ *Turno:* T${cabecera.turno}\n`;
    text += `👤 *Analista:* ${cabecera.analista || 'No asignado'}\n`;
    text += `⭐ *Start Quality:* ${cabecera.temp_cumple !== false ? 'CUMPLE ✅' : 'NO CUMPLE ❌'}\n`;
    text += `🎛️ *Equipos de Medición:* ${cabecera.hum_cumple !== false ? 'CUMPLE ✅' : 'NO CUMPLE ❌'}\n`;
    if (cabecera.caida_tension) {
      text += `⚡ *Caídas de Tensión:* ${cabecera.caida_tension}\n`;
    }
    if ((cabecera.temp_cumple === false || cabecera.hum_cumple === false) && cabecera.observaciones_ambiente) {
      text += `⚠️ *Obs. Desviaciones:* ${cabecera.observaciones_ambiente}\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- PRODUCTOS ---
    text += `📦 *1. PRODUCCIÓN DEL TURNO*\n`;
    if (productos.length > 0) {
      productos.forEach(p => {
        text += `• SAP: *${p.codigo_sap}* - ${p.descripcion}\n`;
        text += `  - *Orden:* ${p.orden || '—'} | *Lote:* ${p.lote} | *Paletas:* ${p.paletas || '—'} | *Camadas:* ${p.camadas || '—'}\n`;
        if (p.obs) {
          text += `  - _Obs:_ ${p.obs}\n`;
        }
      });
    } else {
      text += `• Sin productos registrados en este turno.\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- PBO MOVEMENTS OF THE SHIFT ---
    text += `🔴 *2. PRODUCTO BAJO OBSERVACIÓN (PBO)*\n`;
    if (matchingPboLotes.length > 0) {
      text += `⚠️ *Total:* ${matchingPboLotes.length} lote(s) registrados o movidos:\n`;
      matchingPboLotes.forEach(l => {
        const lotePalets = pboPaletas.filter(p => p.id_pbo === l.id_pbo);
        const paletasCompletas = lotePalets.filter(p => p.camadas_sueltas === 0).length;
        const camadasSueltasTotal = lotePalets.reduce((acc, p) => acc + p.camadas_sueltas, 0);
        const catalogItem = CATALOGO_PRODUCTOS_PBO.find(c => c.nombre.toUpperCase() === l.producto.toUpperCase());
        const codigoSap = catalogItem ? catalogItem.codigo : 'N/D';
        const ncaGral = lotePalets.length > 0 ? lotePalets[0].nca : 'N/D';

        text += `• *SAP:* ${codigoSap} | *Desc:* ${l.producto}\n`;
        text += `  - *Lote:* ${l.lote} | *Orden:* ${l.orden}\n`;
        text += `  - *Paletas:* ${paletasCompletas} | *Camadas:* ${camadasSueltasTotal}\n`;
        text += `  - *Defecto:* _${l.defecto_general}_\n`;
        text += `  - *NCA:* ${ncaGral}\n`;
      });
    } else {
      text += `✅ Sin movimientos de Producto Bajo Observación (PBO) creados en este turno.\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- DESVIACIONES SIN RETENCION ---
    text += `🟡 *3. DESVIACIONES SIN RETENCIÓN*\n`;
    if (desviaciones.length > 0) {
      text += `⚠️ *Total:* ${desviaciones.length} desv. menores:\n`;
      desviaciones.forEach(d => {
        text += `• *[${d.hora}]* - Lugar: ${d.tipo || 'No especificado'}\n`;
        text += `  - *Defecto:* _${d.defecto}_ | *Paletas Afectadas:* ${d.paletas_afectadas}\n`;
        text += `  - *Pruebas Funcionales:* ${d.pruebas_funcionales}\n`;
        if (d.observaciones) {
          text += `  - _Obs:_ ${d.observaciones}\n`;
        }
      });
    } else {
      text += `✅ Todo conforme. Marca de formación cumple NCA sin novedades.\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- NOVEDADES GENERALES ---
    text += `📝 *4. OBSERVACIONES GENERALES*\n`;
    if (generales.length > 0) {
      generales.forEach(g => {
        text += `• *${g.tipo_evento}:* ${g.descripcion}\n`;
      });
    } else {
      text += `• Sin novedades generales reportadas.\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- TRAZABILIDAD ---
    text += `🔍 *5. TRAZABILIDADES REALIZADAS EN EL TURNO*\n`;
    if (trazabilidades_nuevas.length > 0) {
      trazabilidades_nuevas.forEach(t => {
        text += `• *[${t.tipo}]* SAP: ${t.codigo_sap} | Lote: ${t.lote}\n`;
        text += `  - *Defecto:* _${t.defecto}_\n`;
        if (t.descripcion) {
          text += `  - *Detalle:* ${t.descripcion}\n`;
        }
        if (t.ticket) {
          text += `  - *Ticket:* ${t.ticket}\n`;
        }
        if (t.obs) {
          text += `  - *Instrucciones:* ${t.obs}\n`;
        }
      });
    } else {
      text += `• No hay trazabilidades registradas en el turno.\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- PENDIENTES ---
    text += `📌 *6. TAREAS Y PENDIENTES ENTREGADOS*\n`;
    if (pendientes_nuevos.length > 0) {
      pendientes_nuevos.forEach(p => {
        text += `• *Pendiente:* ${p.descripcion}\n`;
        text += `  - *Responsable:* ${p.responsable || 'No especificado'}\n`;
        if (p.observaciones) {
          text += `  - _Detalles:_ ${p.observaciones}\n`;
        }
      });
    } else {
      text += `• No hay pendientes entregados al siguiente turno.\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- REPROCESOS PBO ---
    text += `🔄 *7. REPROCESOS REALIZADOS DURANTE EL TURNO*
`;
    if (matchingReprocesos.length > 0) {
      const groupedRepros: Record<string, { sap: string; orden: string; lote: string; tickets: string[]; paletas: number; camadas: number; }> = {};
      matchingReprocesos.forEach(r => {
        const pboInfo = pboLotes.find(l => l.id_pbo === r.id_pbo);
        if (!pboInfo) return;
        const catalogItem = CATALOGO_PRODUCTOS_PBO.find(c => c.nombre.toUpperCase() === pboInfo.producto.toUpperCase());
        const codigoSap = catalogItem ? catalogItem.codigo : 'N/D';
        const key = `${codigoSap}-${pboInfo.orden}-${pboInfo.lote}`;
        if (!groupedRepros[key]) {
          groupedRepros[key] = { sap: codigoSap, orden: pboInfo.orden, lote: pboInfo.lote, tickets: [], paletas: 0, camadas: 0 };
        }
        if (r.nuevo_ticket_reprocesado && r.nuevo_ticket_reprocesado !== 'N/A') {
           groupedRepros[key].tickets.push(r.nuevo_ticket_reprocesado);
        }
        groupedRepros[key].paletas += (r.paletas_nuevas !== undefined ? r.paletas_nuevas : 1);
        if (r.camadas_sueltas > 0) {
           groupedRepros[key].camadas += r.camadas_sueltas;
        }
      });
      
      const groups = Object.values(groupedRepros);
      text += `⚠️ *Total:* ${groups.length} código(s) SAP con reproceso(s):
`;
      groups.forEach(group => {
        text += `• *SAP:* ${group.sap} | *Lote:* ${group.lote} | *Orden:* ${group.orden}
`;
        text += `  - *Tickets Reprocesados:* ${group.tickets.join(', ') || 'N/A'}
`;
        text += `  - *Total Generado:* ${group.paletas} Paletas, ${group.camadas} Camadas
`;
      });
    } else {
      text += `✅ No se registraron reprocesos de PBO en este turno.
`;
    }
    text += `
------------------------------------

`;

    // --- ROCIADORAS ---
    if (rociadoras.length > 0) {
      text += `🏷️ *8. COLORES DE ROCIADORAS ACTIVAS*\n`;
      rociadoras.forEach(r => {
        text += `• Maq ${r.maquina} (${r.linea}): *${r.color}* (${r.hora || 'S/H'})\n`;
      });
      text += `\n------------------------------------\n\n`;
    }

    text += `👉 *Generado desde la App Polar de Control de Calidad*\n`;
    text += `====================================`;

    return text;
  };

  const handleWhatsAppShare = async () => {
    const formattedText = generateWhatsAppText();
    
    // Copy to clipboard silently as a super convenient backup
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn("Silent copy to clipboard failed:", err);
      // Fallback manual copy
      const textArea = document.createElement("textarea");
      textArea.value = formattedText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (copyErr) {
        console.warn("Fallback copy failed:", copyErr);
      }
      document.body.removeChild(textArea);
    }

    // Open WhatsApp URL with formatted text preloaded
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const cantObs = matchingPboLotes.length;
  const cantDesv = desviaciones.length;

  return (
    <div className="space-y-4">
      {/* ACTION BAR (Hidden during printing) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-4 flex flex-col md:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-800">Visualización de Reporte Final</h2>
          <p className="text-xs text-slate-500">Revise la infografía compacta del turno. Imprima, guarde como PDF o comparta.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleWhatsAppShare}
            className={`flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer ${
              copied 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' 
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                ¡Enviando a WhatsApp! 💬
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Enviar a WhatsApp 💬
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-slate-200 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF 🖨️
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PRINTABLE AREA (Compact, Elegant, Space-Saving Layout) */}
      {/* ======================================================== */}
      <div ref={printAreaRef} className="print-report bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 max-w-[1200px] mx-auto shadow-xs print:border-none print:shadow-none print:p-0 print:space-y-3">
        
        {/* BRAND & HEADER BLOCK */}
        <div className="flex flex-row justify-between items-center pb-3 border-b border-slate-150 gap-4">
          <div className="flex items-center gap-4">
            {/* Elegant Logo Badge - Large on the left */}
            <CompanyLogo className="h-12 sm:h-16 w-auto object-contain shrink-0" />
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                Reporte de Turno
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                Control de Calidad
              </p>
            </div>
          </div>
          
          {/* Metadata Grid */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-150 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Fecha:</span>
              <span className="font-extrabold text-slate-700">{cabecera.fecha}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-slate-200 pl-3 h-3.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Grupo:</span>
              <span className="font-extrabold text-slate-700">Grupo {cabecera.grupo}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-slate-200 pl-3 h-3.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Turno:</span>
              <span className="font-extrabold text-slate-700">Turno {cabecera.turno}</span>
            </div>
            <div className="flex items-center gap-1 border-l border-slate-200 pl-3 h-3.5">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Analista:</span>
              <span className="font-extrabold text-slate-700 truncate max-w-[120px]" title={cabecera.analista}>
                {cabecera.analista || 'S/N'}
              </span>
            </div>
          </div>
        </div>

        {/* METRICS & PARAMETERS CHECK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Start Quality Status */}
          <div className="bg-slate-50 border border-slate-150 px-3 py-2 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none">Start Quality</span>
              <span className="text-[10px] font-extrabold text-slate-500 leading-none mt-1 block">Arranque de Turno</span>
            </div>
            {cabecera.temp_cumple !== false ? (
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> CUMPLE
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-rose-200 animate-pulse">
                <XCircle className="w-3 h-3 text-rose-600" /> NO CUMPLE
              </span>
            )}
          </div>

          {/* Equipos de Medición */}
          <div className="bg-slate-50 border border-slate-150 px-3 py-2 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none">Equipos de Medición</span>
              <span className="text-[10px] font-extrabold text-slate-500 leading-none mt-1 block">Instrumentación</span>
            </div>
            {cabecera.hum_cumple !== false ? (
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> CUMPLE
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-rose-200 animate-pulse">
                <XCircle className="w-3 h-3 text-rose-600" /> NO CUMPLE
              </span>
            )}
          </div>

          {/* Caídas de Tensión */}
          <div className="bg-slate-50 border border-slate-150 px-3 py-2 rounded-xl text-xs flex flex-col justify-center">
            <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none">Caídas de Tensión</span>
            <span className="text-[11px] font-extrabold text-slate-700 block truncate mt-1">
              {cabecera.caida_tension || 'Sin caídas de tensión'}
            </span>
          </div>
        </div>

        {/* Start Quality Obs */}
        {cabecera.observaciones_ambiente && (
          <div className={`border px-3 py-1.5 rounded-lg text-[10px] leading-relaxed ${
            cabecera.temp_cumple === false 
              ? 'bg-rose-50/40 border-rose-100 text-rose-900' 
              : 'bg-indigo-50/40 border-indigo-100 text-indigo-900'
          }`}>
            <span className="font-extrabold uppercase text-[9px] tracking-wider mr-1">
              {cabecera.temp_cumple === false ? 'Observación de No Cumplimiento:' : 'Comentario de Arranque:'}
            </span>
            {cabecera.observaciones_ambiente}
          </div>
        )}

        {/* ALERTAS CENTRALES DEL TURNO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Tarjeta Alerta 1: Retenciones */}
          <div className="border-l-4 border-red-600 bg-red-50/10 rounded-xl px-3 py-2 border border-slate-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-red-50 text-red-600 p-1 rounded-lg border border-red-150 shrink-0">
                <AlertOctagon className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="block text-[9px] font-extrabold text-red-500 uppercase tracking-wider leading-none">Bloqueo de Producto (Retención)</span>
                <span className="text-xs font-black text-red-700 block mt-0.5">{cantObs} Lote(s) Retenido(s)</span>
              </div>
            </div>
            {cantObs > 0 && (
              <span className="text-[9px] text-slate-600 font-bold bg-white px-1.5 py-0.5 rounded border shadow-2xs truncate max-w-[150px]" title={`Lote ${matchingPboLotes[cantObs - 1].lote}: ${matchingPboLotes[cantObs - 1].defecto_general}`}>
                Lote: {matchingPboLotes[cantObs - 1].lote}
              </span>
            )}
          </div>

          {/* Tarjeta Alerta 2: Desviaciones Menores */}
          <div className="border-l-4 border-amber-500 bg-amber-50/10 rounded-xl px-3 py-2 border border-slate-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-50 text-amber-600 p-1 rounded-lg border border-amber-150 shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="block text-[9px] font-extrabold text-amber-500 uppercase tracking-wider leading-none">Desviaciones sin retención</span>
                <span className="text-xs font-black text-amber-700 block mt-0.5">{cantDesv} Desviación(es) Menor(es)</span>
              </div>
            </div>
            {cantDesv > 0 && (
              <span className="text-[9px] text-slate-600 font-bold bg-white px-1.5 py-0.5 rounded border shadow-2xs truncate max-w-[150px]" title={desviaciones[cantDesv - 1].defecto}>
                {desviaciones[cantDesv - 1].defecto}
              </span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* DETALLE GRID (MANDATORY MODULES) */}
        {/* ======================================================== */}
        <div className="space-y-4">
          
          {/* 1. Productos Fabricados */}
          {productos.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                1. Productos del Turno
              </h3>
              
              {/* MOBILE CARDS (Hidden in Print) */}
              <div className="block md:hidden print:hidden space-y-2">
                {productos.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">{p.codigo_sap}</span>
                      <span className="font-extrabold text-indigo-700 bg-indigo-50/60 px-2 py-0.5 rounded text-[10px]">Lote: {p.lote}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{p.descripcion}</div>
                      <div className="text-slate-500 font-medium text-[10px] mt-0.5">Orden: {p.orden || '—'}</div>
                      {p.obs && <div className="text-slate-400 italic mt-1 text-[10px]">Obs: {p.obs}</div>}
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60 text-[10px]">
                      <div>
                        <span className="text-slate-400 uppercase font-bold mr-1">Paletas:</span>
                        <span className="font-extrabold text-slate-700 mr-3">{p.paletas || '0'}</span>
                        <span className="text-slate-400 uppercase font-bold mr-1">Camadas:</span>
                        <span className="font-extrabold text-slate-700">{p.camadas || '0'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP/PRINT TABLE */}
              <div className="hidden md:block print:block overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-2.5 w-[12%]">Código SAP</th>
                      <th className="py-1.5 px-2.5 w-[33%]">Descripción del Producto</th>
                      <th className="py-1.5 px-2.5 w-[15%]">Orden</th>
                      <th className="py-1.5 px-2.5 w-[12%]">Lote</th>
                      <th className="py-1.5 px-2.5 w-[10%]">Paletas</th>
                      <th className="py-1.5 px-2.5 w-[10%]">Camadas</th>
                      <th className="py-1.5 px-2.5 w-[8%]">Comentarios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-755">
                    {productos.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-slate-600">{p.codigo_sap}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{p.descripcion}</td>
                        <td className="py-1.5 px-2.5">{p.orden || '—'}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{p.lote}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{p.paletas || '0'}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{p.camadas || '0'}</td>
                        <td className="py-1.5 px-2.5 text-slate-400 italic">{p.obs || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Movimientos de Producto Bajo Observación (PBO) del Turno */}
          <div className="space-y-1.5 pt-1">
            <h3 className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              2. PRODUCTO BAJO OBSERVACIÓN (PBO)
            </h3>
            {matchingPboLotes.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-[11px] text-slate-400 font-bold italic text-center">
                ✓ No se registraron folios de Producto Bajo Observación (PBO) creados durante el turno actual.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-orange-50/50 text-orange-800 font-bold border-b border-orange-100">
                    <tr>
                      <th className="py-1.5 px-2.5">Código SAP</th>
                      <th className="py-1.5 px-2.5">Descripción</th>
                      <th className="py-1.5 px-2.5">Lote</th>
                      <th className="py-1.5 px-2.5">Orden</th>
                      <th className="py-1.5 px-2.5">Paletas</th>
                      <th className="py-1.5 px-2.5">Camadas</th>
                      <th className="py-1.5 px-2.5">Defecto General</th>
                      <th className="py-1.5 px-2.5">NCA General</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {matchingPboLotes.map(l => {
                      const lotePalets = pboPaletas.filter(p => p.id_pbo === l.id_pbo);
                      const paletasCompletas = lotePalets.filter(p => p.camadas_sueltas === 0).length;
                      const camadasSueltasTotal = lotePalets.reduce((acc, p) => acc + p.camadas_sueltas, 0);
                      
                      const catalogItem = CATALOGO_PRODUCTOS_PBO.find(c => c.nombre.toUpperCase() === l.producto.toUpperCase());
                      const codigoSap = catalogItem ? catalogItem.codigo : 'N/D';
                      
                      return (
                        <tr key={l.id_pbo} className="hover:bg-orange-50/20">
                          <td className="py-1.5 px-2.5 font-bold font-mono text-slate-700">{codigoSap}</td>
                          <td className="py-1.5 px-2.5 font-bold text-slate-800">{l.producto}</td>
                          <td className="py-1.5 px-2.5 font-mono text-slate-600">{l.lote}</td>
                          <td className="py-1.5 px-2.5 font-mono text-slate-600">{l.orden}</td>
                          <td className="py-1.5 px-2.5 font-semibold text-center">{paletasCompletas}</td>
                          <td className="py-1.5 px-2.5 font-semibold text-center">{camadasSueltasTotal}</td>
                          <td className="py-1.5 px-2.5 italic text-slate-600">{l.defecto_general}</td>
                          <td className="py-1.5 px-2.5 font-bold text-center">
                            {lotePalets.length > 0 ? lotePalets[0].nca : 'N/D'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* 3. Desviaciones Sin Retención */}
          {desviaciones.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-amber-650 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-650" />
                3. Desviaciones Detectadas sin Retención
              </h3>

              {/* MOBILE CARDS (Hidden in Print) */}
              <div className="block md:hidden print:hidden space-y-2">
                {desviaciones.map((d, idx) => (
                  <div key={idx} className="bg-amber-50/10 border border-amber-200/60 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-850 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{d.hora}</span>
                        <span className="font-mono font-bold text-slate-500 text-[10px]">{d.codigo_sap}</span>
                      </div>
                      <span className="font-bold text-amber-750 bg-amber-50 px-2 py-0.5 rounded text-[10px]">{d.paletas_afectadas} paleta(s)</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{d.descripcion}</div>
                      <div className="text-amber-700 font-semibold mt-1 text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> {d.defecto}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600">
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">Lote:</span>
                        <span className="font-semibold text-slate-800">{d.lote || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">Lugar:</span>
                        <span className="font-semibold text-slate-800">{d.tipo || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">NCA:</span>
                        <span className="font-semibold text-slate-800">{d.nca}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">Observaciones:</span>
                        <span className="font-semibold text-slate-700 leading-normal">{d.observaciones || '—'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP/PRINT TABLE */}
              <div className="hidden md:block print:block overflow-x-auto rounded-xl border border-amber-200/60">
                <table className="w-full text-left border-collapse text-[11px] min-w-[800px] lg:min-w-0 lg:w-full">
                  <thead className="bg-amber-50/20 text-amber-800 font-bold border-b border-amber-100">
                    <tr>
                      <th className="py-1.5 px-2.5 w-[7%]">Hora</th>
                      <th className="py-1.5 px-2.5 w-[8%]">Código SAP</th>
                      <th className="py-1.5 px-2.5 w-[18%]">Descripción</th>
                      <th className="py-1.5 px-2.5 w-[10%]">Lote</th>
                      <th className="py-1.5 px-2.5 w-[10%]">Lugar</th>
                      <th className="py-1.5 px-2.5 w-[12%]">Defecto</th>
                      <th className="py-1.5 px-2.5 w-[6%]">NCA</th>
                      <th className="py-1.5 px-2.5 w-[10%]">Paletas</th>
                      <th className="py-1.5 px-2.5 w-[19%]">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-50 text-slate-755">
                    {desviaciones.map((d, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/5">
                        <td className="py-1.5 px-2.5 font-bold">{d.hora}</td>
                        <td className="py-1.5 px-2.5 font-mono">{d.codigo_sap}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{d.descripcion}</td>
                        <td className="py-1.5 px-2.5 font-medium">{d.lote || '—'}</td>
                        <td className="py-1.5 px-2.5">{d.tipo || '—'}</td>
                        <td className="py-1.5 px-2.5 font-medium text-amber-700">{d.defecto}</td>
                        <td className="py-1.5 px-2.5">{d.nca}</td>
                        <td className="py-1.5 px-2.5 font-bold">{d.paletas_afectadas} paleta(s)</td>
                        <td className="py-1.5 px-2.5 text-slate-500 whitespace-normal break-words">{d.observaciones}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Observaciones Generales */}
          {generales.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                4. Observaciones Generales de Turno
              </h3>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-150 text-[11px]">
                {generales.map((g, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="font-bold text-slate-700 block uppercase text-[9px]">↳ {g.tipo_evento}</span>
                    <p className="text-slate-600 pl-3">{g.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Trazabilidades realizadas en el turno */}
          {trazabilidades_nuevas.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                5. Trazabilidades realizadas en el turno
              </h3>

              {/* MOBILE CARDS (Hidden in Print) */}
              <div className="block md:hidden print:hidden space-y-2">
                {trazabilidades_nuevas.map((t, idx) => (
                  <div key={idx} className="bg-indigo-50/10 border border-indigo-200/60 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${t.tipo === 'Hacia adelante' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'}`}>
                        {t.tipo}
                      </span>
                      <span className="font-mono font-semibold text-slate-500 text-[10px]">Ticket: {t.ticket || 'S/N'}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{t.defecto}</div>
                      <div className="text-slate-500 mt-1 text-[10px]">{t.descripcion}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600">
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">SAP / Lote:</span>
                        <span className="font-mono font-bold text-slate-700">{t.codigo_sap}</span>
                        <span className="block text-slate-400 text-[9px]">Lote: {t.lote}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">Instrucciones:</span>
                        <span className="italic font-semibold text-slate-700 leading-normal">{t.obs || 'Proceder según protocolo'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP/PRINT TABLE */}
              <div className="hidden md:block print:block overflow-x-auto rounded-xl border border-indigo-200/60">
                <table className="w-full text-left border-collapse text-[11px] min-w-[800px] lg:min-w-0 lg:w-full">
                  <thead className="bg-indigo-50/20 text-indigo-800 font-bold border-b border-indigo-100">
                    <tr>
                      <th className="py-1.5 px-2.5 w-[15%]">Tipo</th>
                      <th className="py-1.5 px-2.5 w-[15%]">SAP / Lote</th>
                      <th className="py-1.5 px-2.5 w-[45%]">Descripción del Defecto / Trazado</th>
                      <th className="py-1.5 px-2.5 w-[10%]">Ticket</th>
                      <th className="py-1.5 px-2.5 w-[15%]">Instrucciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-50 text-slate-755">
                    {trazabilidades_nuevas.map((t, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/5">
                        <td className="py-1.5 px-2.5">
                          <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${t.tipo === 'Hacia adelante' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'}`}>
                            {t.tipo}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5">
                          <div className="font-bold">{t.codigo_sap}</div>
                          <div className="text-slate-400 text-[9px]">Lote: {t.lote}</div>
                        </td>
                        <td className="py-1.5 px-2.5">
                          <div className="font-semibold">{t.defecto}</div>
                          <div className="text-slate-500 text-[10px] whitespace-normal break-words">{t.descripcion}</div>
                        </td>
                        <td className="py-1.5 px-2.5 font-mono">{t.ticket || 'S/N'}</td>
                        <td className="py-1.5 px-2.5 italic text-slate-500 whitespace-normal break-words">{t.obs || 'Proceder según protocolo'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Nuevos Pendientes */}
          {pendientes_nuevos.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                6. Tareas / Pendientes Entregados
              </h3>

              {/* MOBILE CARDS (Hidden in Print) */}
              <div className="block md:hidden print:hidden space-y-2">
                {pendientes_nuevos.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Responsable Sugerido</span>
                      <span className="font-extrabold text-slate-750 bg-slate-200 px-2 py-0.5 rounded text-[10px]">{p.responsable || 'Cualquiera'}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{p.descripcion}</div>
                    </div>
                    {p.observaciones && (
                      <div className="pt-1.5 border-t border-slate-200/60 text-[10px]">
                        <span className="text-slate-400 uppercase font-bold block">Detalles de Operación:</span>
                        <span className="text-slate-500 block leading-normal">{p.observaciones}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* DESKTOP/PRINT TABLE */}
              <div className="hidden md:block print:block overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-50 text-slate-650 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-2.5 w-[50%]">Descripción de la Tarea</th>
                      <th className="py-1.5 px-2.5 w-[25%]">Responsable Sugerido</th>
                      <th className="py-1.5 px-2.5 w-[25%]">Detalles de Operación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-755">
                    {pendientes_nuevos.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30">
                        <td className="py-1.5 px-2.5 font-semibold whitespace-normal break-words">{p.descripcion}</td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-600">{p.responsable || 'Cualquiera'}</td>
                        <td className="py-1.5 px-2.5 text-slate-500 whitespace-normal break-words">{p.observaciones || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Reprocesos realizados durante el turno */}
          {matchingReprocesos.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <h3 className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                7. Reprocesos realizados durante el turno
              </h3>
              
              <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-indigo-50/50 text-indigo-800 font-bold border-b border-indigo-100">
                    <tr>
                      <th className="py-1.5 px-2.5">Código SAP</th>
                      <th className="py-1.5 px-2.5">Orden</th>
                      <th className="py-1.5 px-2.5">Lote</th>
                      <th className="py-1.5 px-2.5">Tickets Reprocesados (Nuevos)</th>
                      <th className="py-1.5 px-2.5">Total Generado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(() => {
                      // Group by PBO (which gives us SAP, Orden, Lote)
                      const groupedRepros: Record<string, {
                        sap: string;
                        orden: string;
                        lote: string;
                        tickets: string[];
                        paletas: number;
                        camadas: number;
                      }> = {};

                      matchingReprocesos.forEach(r => {
                        const pboInfo = pboLotes.find(l => l.id_pbo === r.id_pbo);
                        if (!pboInfo) return;
                        
                        const catalogItem = CATALOGO_PRODUCTOS_PBO.find(c => c.nombre.toUpperCase() === pboInfo.producto.toUpperCase());
                        const codigoSap = catalogItem ? catalogItem.codigo : 'N/D';
                        const key = `${codigoSap}-${pboInfo.orden}-${pboInfo.lote}`;

                        if (!groupedRepros[key]) {
                          groupedRepros[key] = {
                            sap: codigoSap,
                            orden: pboInfo.orden,
                            lote: pboInfo.lote,
                            tickets: [],
                            paletas: 0,
                            camadas: 0
                          };
                        }

                        if (r.nuevo_ticket_reprocesado && r.nuevo_ticket_reprocesado !== 'N/A') {
                           groupedRepros[key].tickets.push(r.nuevo_ticket_reprocesado);
                        }
                        groupedRepros[key].paletas += (r.paletas_nuevas !== undefined ? r.paletas_nuevas : 1);
                        if (r.camadas_sueltas > 0) {
                           groupedRepros[key].camadas += r.camadas_sueltas;
                        }
                      });

                      return Object.values(groupedRepros).map((group, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/20">
                          <td className="py-1.5 px-2.5 font-bold font-mono">{group.sap}</td>
                          <td className="py-1.5 px-2.5 font-mono">{group.orden}</td>
                          <td className="py-1.5 px-2.5 font-mono">{group.lote}</td>
                          <td className="py-1.5 px-2.5 font-mono text-indigo-700 font-semibold">{group.tickets.join(', ') || 'N/A'}</td>
                          <td className="py-1.5 px-2.5 font-semibold text-slate-800">
                            {group.paletas} Paletas, {group.camadas} Camadas
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. Colores de Rociadoras Activas */}
          {rociadoras.length > 0 && (            <div className="space-y-1.5 pt-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                8. Colores de Rociadoras Activas
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                {rociadoras.map((r, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none">Maq {r.maquina}</span>
                      <span className="text-[10px] font-extrabold text-slate-600 mt-1 block">{r.linea}</span>
                    </div>
                    <div className="text-right">
                      <span className="bg-white text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 block shadow-xs">{r.color}</span>
                      <span className="text-[9px] font-semibold text-slate-400 mt-1 block">{r.hora || 'S/H'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
