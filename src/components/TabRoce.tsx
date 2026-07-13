import React, { useState, useEffect } from 'react';
import { RocePrueba } from '../types';
import { getRocePruebas, saveRocePrueba, deleteRocePrueba } from '../db';
import { Trash2, Save, Activity, Search } from 'lucide-react';
import { CATALOGO_PRODUCTOS_PBO } from './TabPBO';

interface TabRoceProps {
  cabeceraFecha: string;
  cabeceraTurno: number;
  usuarioRegistro: string;
}

export function TabRoce({ cabeceraFecha, cabeceraTurno, usuarioRegistro }: TabRoceProps) {
  const [pruebas, setPruebas] = useState<RocePrueba[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [codigoSap, setCodigoSap] = useState('');
  const [producto, setProducto] = useState('');
  const [lote, setLote] = useState('');
  const [resultados, setResultados] = useState<Record<number, string>>({});

  useEffect(() => {
    loadPruebas();
  }, []);

  const loadPruebas = async () => {
    const data = await getRocePruebas();
    setPruebas(data);
  };

  const handleSapChange = (val: string) => {
    setCodigoSap(val);
    const found = CATALOGO_PRODUCTOS_PBO.find(c => c.codigo.toUpperCase() === val.toUpperCase());
    if (found) {
      setProducto(found.nombre);
    } else {
      setProducto('');
    }
  };

  const handleResultadoChange = (minuto: number, val: string) => {
    setResultados(prev => ({
      ...prev,
      [minuto]: val
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoSap || !producto || !lote) {
      alert("Por favor complete Código SAP, Producto y Lote.");
      return;
    }
    
    // Ensure all 12 minutes are recorded? Actually just save what is there.
    
    const newPrueba: RocePrueba = {
      id: `ROCE-${Date.now()}`,
      fecha: cabeceraFecha || new Date().toISOString().split('T')[0],
      turno: cabeceraTurno || 1,
      codigo_sap: codigoSap,
      producto,
      lote: lote.toUpperCase(),
      resultados,
      usuario: usuarioRegistro || 'Usuario',
      creado_el: new Date().toISOString()
    };

    try {
      await saveRocePrueba(newPrueba);
      setCodigoSap('');
      setProducto('');
      setLote('');
      setResultados({});
      loadPruebas();
      alert("¡Prueba de Roce guardada con éxito!");
    } catch (e) {
      console.error(e);
      alert("Error al guardar prueba.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar esta prueba de roce?")) {
      await deleteRocePrueba(id);
      loadPruebas();
    }
  };

  // Only show tests for current shift/date or all if we search
  const filteredPruebas = pruebas.filter(p => {
    if (searchTerm) {
      return p.lote.toLowerCase().includes(searchTerm.toLowerCase()) || 
             p.codigo_sap.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.producto.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return p.fecha === cabeceraFecha && p.turno === cabeceraTurno;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Activity className="w-5 h-5 text-indigo-600" /> Nueva Prueba de Roce
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Código SAP</label>
              <input
                type="text"
                required
                value={codigoSap}
                onChange={(e) => handleSapChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 font-mono focus:outline-hidden text-slate-800"
                placeholder="Ej: Y00001"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Producto</label>
              <input
                type="text"
                required
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 font-bold focus:outline-hidden text-slate-800"
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lote</label>
              <input
                type="text"
                required
                value={lote}
                onChange={(e) => setLote(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 font-mono focus:outline-hidden text-slate-800"
                placeholder="Ej: L-1234"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">Registro minuto a minuto</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(minuto => (
                <div key={minuto} className="bg-indigo-50/30 border border-indigo-100 p-2.5 rounded-xl">
                  <label className="text-[10px] font-bold text-indigo-800 uppercase block mb-1">Minuto {minuto}</label>
                  <select
                    value={resultados[minuto] || ''}
                    onChange={(e) => handleResultadoChange(minuto, e.target.value)}
                    className="w-full bg-white border border-indigo-200 rounded text-[11px] p-1.5 font-semibold text-slate-700"
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="Sin roce">✅ Sin roce</option>
                    <option value="Muy leve">🟡 Muy leve</option>
                    <option value="Leve">🟠 Leve</option>
                    <option value="Moderado">🔴 Moderado</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Guardar Prueba
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            Pruebas Registradas
          </h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por lote, SAP o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs pl-9 pr-3 py-2 focus:outline-hidden text-slate-800"
            />
          </div>
        </div>

        {filteredPruebas.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
            {searchTerm ? "No se encontraron pruebas de roce." : "No hay pruebas de roce registradas para este turno."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Fecha/Turno</th>
                  <th className="py-2.5 px-3">SAP / Producto</th>
                  <th className="py-2.5 px-3">Lote</th>
                  <th className="py-2.5 px-3 text-center">Resultados (M1 - M12)</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPruebas.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="font-bold">{p.fecha}</div>
                      <div className="text-slate-400 text-[9px]">Turno {p.turno}</div>
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-mono font-bold text-slate-900">{p.codigo_sap}</div>
                      <div className="font-semibold text-[10px]">{p.producto}</div>
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-indigo-700">
                      {p.lote}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                          const val = p.resultados[m];
                          if (!val) return null;
                          const colorClass = 
                            val === 'Sin roce' ? 'bg-emerald-100 text-emerald-800' :
                            val === 'Muy leve' ? 'bg-yellow-100 text-yellow-800' :
                            val === 'Leve' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800';
                          return (
                            <span key={m} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${colorClass}`} title={`Minuto ${m}`}>
                              M{m}: {val}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
