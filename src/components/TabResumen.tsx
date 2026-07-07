// TabResumen.tsx - Display Lote column inside tables & grid summaries
import React, { useRef, useState } from 'react';
import { Printer, AlertOctagon, AlertTriangle, CheckCircle, XCircle, Tag, Layers, FileText, ArrowRightLeft, FileCheck, Copy } from 'lucide-react';
import { ReporteCompleto } from '../types';

interface TabResumenProps {
  reporte: ReporteCompleto | null;
}

export default function TabResumen({ reporte }: TabResumenProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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
    text += `🌡️ *Ambiente:* Temp: ${cabecera.temp_cumple ? 'CUMPLE ✅' : 'FUERA ❌'} | Hum: ${cabecera.hum_cumple ? 'CUMPLE ✅' : 'FUERA ❌'}\n`;
    if (cabecera.caida_tension) {
      text += `⚡ *Fluctuación Eléctrica:* ${cabecera.caida_tension}\n`;
    }
    if (cabecera.observaciones_ambiente) {
      text += `📝 *Observación Ambiente:* ${cabecera.observaciones_ambiente}\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- PRODUCTOS ---
    text += `📦 *1. PRODUCCIÓN DEL TURNO*\n`;
    if (productos.length > 0) {
      productos.forEach(p => {
        text += `• SAP: *${p.codigo_sap}* - ${p.descripcion}\n`;
        text += `  - *Lote:* ${p.lote} | *Cant:* ${p.cantidad}\n`;
        if (p.obs) {
          text += `  - _Obs:_ ${p.obs}\n`;
        }
      });
    } else {
      text += `• Sin productos registrados en este turno.\n`;
    }
    text += `\n------------------------------------\n\n`;

    // --- RETENCIONES ---
    text += `🔴 *2. PRODUCTO BAJO OBSERVACIÓN (RETENIDO)*\n`;
    if (observaciones.length > 0) {
      text += `⚠️ *Total:* ${observaciones.length} lote(s) retenidos:\n`;
      observaciones.forEach((o) => {
        text += `• *[Lote ${o.lote}]* - ${o.descripcion} (SAP: ${o.codigo_sap})\n`;
        text += `  - *Orden:* ${o.orden} | *Ticket:* ${o.ticket || 'S/N'} | *NCA:* ${o.nca || '—'}\n`;
        text += `  - *Defecto:* _${o.defecto}_\n`;
        if (o.causa_raiz) {
          text += `  - *Causa:* ${o.causa_raiz}\n`;
        }
        if (o.acciones) {
          text += `  - *Acción:* ${o.acciones}\n`;
        }
        if (o.obs) {
          text += `  - *Detalles:* ${o.obs}\n`;
        }
      });
    } else {
      text += `✅ No se registraron bloqueos ni retenciones de producto en el turno.\n`;
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

    // --- ROCIADORAS ---
    if (rociadoras.length > 0) {
      text += `🏷️ *7. COLORES DE ROCIADORAS ACTIVAS*\n`;
      rociadoras.forEach(r => {
        text += `• Maq ${r.maquina} (${r.linea}): *${r.color}*\n`;
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

  const cantObs = observaciones.length;
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
          <div className="flex items-center gap-2.5">
            {/* Elegant Logo Badge */}
            <div className="bg-indigo-600 text-white font-black text-sm px-3 py-1.5 rounded-xl tracking-wider select-none border border-indigo-700">
              SE
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-slate-800 tracking-tight uppercase">
                CÓDIGO: <span className="font-mono text-indigo-600 font-extrabold">{cabecera.fecha ? `${cabecera.fecha.replace(/-/g, '')}-T${cabecera.turno}-${cabecera.grupo}` : 'TEMP'}</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Control de Calidad (Reg: #{reporte.reporte_id || 'TEMP'})</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Temperature Status */}
          <div className="bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none">Temp. Ambiente</span>
              <span className="text-[10px] font-extrabold text-slate-500 leading-none mt-1 block">Normativa</span>
            </div>
            {cabecera.temp_cumple ? (
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> OK
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-rose-200">
                <XCircle className="w-3 h-3 text-rose-600" /> FUERA
              </span>
            )}
          </div>

          {/* Humidity Status */}
          <div className="bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none">Hum. Relativa</span>
              <span className="text-[10px] font-extrabold text-slate-500 leading-none mt-1 block">Normativa</span>
            </div>
            {cabecera.hum_cumple ? (
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> OK
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 border border-rose-200">
                <XCircle className="w-3 h-3 text-rose-600" /> FUERA
              </span>
            )}
          </div>

          {/* Voltage Drops */}
          <div className="bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl text-xs col-span-1 md:col-span-2">
            <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none">Fluctuaciones de Tensión</span>
            <span className="text-[11px] font-extrabold text-slate-700 block truncate mt-1">
              {cabecera.caida_tension || 'Sin caídas reportadas'}
            </span>
          </div>
        </div>

        {/* Ambient notes */}
        {cabecera.observaciones_ambiente && (
          <div className="bg-indigo-50/40 border border-indigo-100 px-3 py-1.5 rounded-lg text-[10px] text-indigo-900 leading-relaxed">
            <span className="font-extrabold uppercase text-[9px] tracking-wider mr-1 text-indigo-750">Obs. Ambientales:</span>
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
              <span className="text-[9px] text-slate-600 font-bold bg-white px-1.5 py-0.5 rounded border shadow-2xs truncate max-w-[150px]" title={`Lote ${observaciones[cantObs - 1].lote}: ${observaciones[cantObs - 1].defecto}`}>
                Lote: {observaciones[cantObs - 1].lote}
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
                      {p.obs && <div className="text-slate-400 italic mt-1 text-[10px]">Obs: {p.obs}</div>}
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60 text-[10px]">
                      <span className="text-slate-400 uppercase font-bold">Cantidad:</span>
                      <span className="font-extrabold text-slate-700">{p.cantidad}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP/PRINT TABLE */}
              <div className="hidden md:block print:block overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-1.5 px-2.5 w-[15%]">Código SAP</th>
                      <th className="py-1.5 px-2.5 w-[45%]">Descripción del Producto</th>
                      <th className="py-1.5 px-2.5 w-[15%]">Lote</th>
                      <th className="py-1.5 px-2.5 w-[12%]">Cantidad</th>
                      <th className="py-1.5 px-2.5 w-[13%]">Comentarios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-755">
                    {productos.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-slate-600">{p.codigo_sap}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{p.descripcion}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{p.lote}</td>
                        <td className="py-1.5 px-2.5">{p.cantidad}</td>
                        <td className="py-1.5 px-2.5 text-slate-400 italic">{p.obs || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Productos Retenidos */}
          {observaciones.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-red-650 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <AlertOctagon className="w-3.5 h-3.5 animate-pulse text-red-650" />
                2. Producto Bajo Observación (Retención)
              </h3>

              {/* MOBILE CARDS (Hidden in Print) */}
              <div className="block md:hidden print:hidden space-y-2">
                {observaciones.map((o, idx) => (
                  <div key={idx} className="bg-red-50/10 border border-red-200/60 p-3 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded text-[10px]">{o.codigo_sap}</span>
                      <span className="font-bold text-red-750 bg-red-100/60 px-2 py-0.5 rounded text-[10px]">Lote: {o.lote}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{o.descripcion}</div>
                      <div className="text-red-650 font-bold mt-1 text-[11px] flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3 text-red-600" /> {o.defecto}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600">
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">Orden:</span>
                        <span className="font-semibold text-slate-800">{o.orden}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">Ticket / Boleto:</span>
                        <span className="font-mono font-semibold text-slate-800">{o.ticket || 'S/N'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">NCA:</span>
                        <span className="font-semibold text-slate-800">{o.nca}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-bold block">Causa Raíz:</span>
                        <span className="font-semibold text-slate-700">{o.causa_raiz || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 uppercase font-bold block">Acciones:</span>
                        <span className="font-semibold text-slate-700 leading-normal">{o.acciones || '—'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP/PRINT TABLE */}
              <div className="hidden md:block print:block overflow-x-auto rounded-xl border border-red-200/60">
                <table className="w-full text-left border-collapse text-[11px] min-w-[850px] lg:min-w-0 lg:w-full">
                  <thead className="bg-red-50/30 text-red-800 font-bold border-b border-red-100">
                    <tr>
                      <th className="py-1.5 px-2.5 w-[10%]">Cód SAP</th>
                      <th className="py-1.5 px-2.5 w-[22%]">Descripción</th>
                      <th className="py-1.5 px-2.5 w-[8%]">Orden</th>
                      <th className="py-1.5 px-2.5 w-[8%]">Lote</th>
                      <th className="py-1.5 px-2.5 w-[12%]">Defecto</th>
                      <th className="py-1.5 px-2.5 w-[8%]">Ticket</th>
                      <th className="py-1.5 px-2.5 w-[8%]">NCA</th>
                      <th className="py-1.5 px-2.5 w-[12%]">Causa Raíz</th>
                      <th className="py-1.5 px-2.5 w-[12%]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-50 text-slate-755">
                    {observaciones.map((o, idx) => (
                      <tr key={idx} className="hover:bg-red-50/10">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-slate-650">{o.codigo_sap}</td>
                        <td className="py-1.5 px-2.5 font-semibold">{o.descripcion}</td>
                        <td className="py-1.5 px-2.5">{o.orden}</td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-700">{o.lote}</td>
                        <td className="py-1.5 px-2.5 text-red-600 font-semibold">{o.defecto}</td>
                        <td className="py-1.5 px-2.5 font-mono">{o.ticket || 'S/N'}</td>
                        <td className="py-1.5 px-2.5">{o.nca}</td>
                        <td className="py-1.5 px-2.5 text-slate-500 whitespace-normal break-words">{o.causa_raiz}</td>
                        <td className="py-1.5 px-2.5 text-slate-600 whitespace-normal break-words">{o.acciones}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

          {/* 7. Colores de Rociadoras */}
          {rociadoras.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 border-b pb-0.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                7. Colores Activos de Rociadoras
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {rociadoras.map((r, idx) => (
                  <div key={idx} className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150 flex items-center gap-2 text-[10px] shadow-2xs">
                    <span className="text-slate-400 font-bold uppercase text-[8px]">{r.linea}</span>
                    <span className="font-bold text-slate-700">Maq. {r.maquina}:</span>
                    <span className="font-extrabold text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {r.color}
                    </span>
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
