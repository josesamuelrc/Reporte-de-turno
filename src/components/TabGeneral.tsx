import React from 'react';
import { Plus, Trash2, Calendar, Users, ShieldAlert, Zap, Layers } from 'lucide-react';
import { ReporteTurno, ProductoTurno } from '../types';
import ExpandableCell from './ExpandableCell';

interface TabGeneralProps {
  cabecera: ReporteTurno;
  onChangeCabecera: (newCab: Partial<ReporteTurno>) => void;
  productos: ProductoTurno[];
  onChangeProductos: (newProds: ProductoTurno[]) => void;
  analistas: string[];
  editable: boolean;
}

export default function TabGeneral({
  cabecera,
  onChangeCabecera,
  productos,
  onChangeProductos,
  analistas,
  editable
}: TabGeneralProps) {

  const addProductoRow = () => {
    if (!editable) return;
    onChangeProductos([
      ...productos,
      { codigo_sap: '', descripcion: '', lote: '', cantidad: '', obs: '' }
    ]);
  };

  const removeProductoRow = (index: number) => {
    if (!editable) return;
    const updated = [...productos];
    updated.splice(index, 1);
    onChangeProductos(updated);
  };

  const updateProductoCell = (index: number, key: keyof ProductoTurno, value: string) => {
    if (!editable) return;
    const updated = [...productos];
    updated[index] = { ...updated[index], [key]: value };
    onChangeProductos(updated);
  };

  return (
    <div className="space-y-6">
      {/* SECCION CABECERA */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800">Datos Principales del Turno</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fecha */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fecha</label>
            <input
              type="date"
              disabled={!editable}
              value={cabecera.fecha}
              onChange={(e) => onChangeCabecera({ fecha: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/60 disabled:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 text-sm transition-all outline-hidden"
            />
          </div>

          {/* Grupo */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Grupo</label>
            <select
              disabled={!editable}
              value={cabecera.grupo}
              onChange={(e) => onChangeCabecera({ grupo: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/60 disabled:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 text-sm transition-all outline-hidden"
            >
              <option value="A">Grupo A</option>
              <option value="B">Grupo B</option>
              <option value="C">Grupo C</option>
            </select>
          </div>

          {/* Analista */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Analista de Turno</label>
            <select
              disabled={!editable}
              value={cabecera.analista}
              onChange={(e) => onChangeCabecera({ analista: e.target.value })}
              className="w-full bg-slate-50 disabled:bg-slate-100/60 disabled:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 text-sm transition-all outline-hidden"
            >
              <option value="">-- Seleccionar Analista --</option>
              {analistas.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Turno */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Turno</label>
            <select
              disabled={!editable}
              value={cabecera.turno}
              onChange={(e) => onChangeCabecera({ turno: parseInt(e.target.value, 10) })}
              className="w-full bg-slate-50 disabled:bg-slate-100/60 disabled:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 text-sm transition-all outline-hidden"
            >
              <option value={1}>Turno 1 (Día)</option>
              <option value={2}>Turno 2 (Noche)</option>
            </select>
          </div>
        </div>

        {/* Ambientales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-col gap-3 justify-center">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" /> Parámetros Ambientales
            </span>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  disabled={!editable}
                  checked={cabecera.temp_cumple}
                  onChange={(e) => onChangeCabecera({ temp_cumple: e.target.checked })}
                  className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                />
                Temperatura Cumple
              </label>
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  disabled={!editable}
                  checked={cabecera.hum_cumple}
                  onChange={(e) => onChangeCabecera({ hum_cumple: e.target.checked })}
                  className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                />
                Humedad Cumple
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Caídas de Tensión
            </label>
            <input
              type="text"
              disabled={!editable}
              value={cabecera.caida_tension}
              onChange={(e) => onChangeCabecera({ caida_tension: e.target.value })}
              placeholder="Ej. Sin novedades / Bajón de 10 min..."
              className="w-full bg-slate-50 disabled:bg-slate-100/60 disabled:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 text-sm transition-all outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Observaciones de Ambiente
            </label>
            <input
              type="text"
              disabled={!editable}
              value={cabecera.observaciones_ambiente}
              onChange={(e) => onChangeCabecera({ observaciones_ambiente: e.target.value })}
              placeholder="Aire acondicionado, ruidos extraños, etc."
              className="w-full bg-slate-50 disabled:bg-slate-100/60 disabled:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 text-sm transition-all outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* SECCION PRODUCTOS */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-150 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-800">Productos del Turno</h2>
          </div>
          {editable && (
            <button
              onClick={addProductoRow}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-100"
            >
              <Plus className="w-4 h-4" />
              Añadir Producto
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">
                <th className="py-3 px-4 w-[15%]">Código SAP</th>
                <th className="py-3 px-4 w-[35%]">Descripción del Producto</th>
                <th className="py-3 px-4 w-[15%]">Lote</th>
                <th className="py-3 px-4 w-[15%]">Cantidad</th>
                <th className="py-3 px-4 w-[15%]">Observaciones</th>
                {editable && <th className="py-3 px-4 w-[5%] text-center">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={editable ? 6 : 5} className="py-8 text-center text-slate-400 font-medium bg-slate-50/40">
                    No hay productos agregados en este turno.
                  </td>
                </tr>
              ) : (
                productos.map((prod, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-all">
                    {/* SAP */}
                    <td className="py-1 px-1.5">
                      <ExpandableCell
                        disabled={!editable}
                        value={prod.codigo_sap}
                        onChange={(val) => updateProductoCell(index, 'codigo_sap', val)}
                        placeholder="7000xxxx"
                        label="Código SAP del Producto"
                      />
                    </td>
                    {/* Descripcion */}
                    <td className="py-1 px-1.5">
                      <ExpandableCell
                        disabled={!editable}
                        value={prod.descripcion}
                        onChange={(val) => updateProductoCell(index, 'descripcion', val)}
                        placeholder="Ej. Harina P.A.N. 1kg"
                        label="Descripción del Producto"
                      />
                    </td>
                    {/* Lote */}
                    <td className="py-1 px-1.5">
                      <ExpandableCell
                        disabled={!editable}
                        value={prod.lote}
                        onChange={(val) => updateProductoCell(index, 'lote', val)}
                        placeholder="Ej. L-01"
                        label="Lote de Producción"
                      />
                    </td>
                    {/* Cantidad */}
                    <td className="py-1 px-1.5">
                      <ExpandableCell
                        disabled={!editable}
                        value={prod.cantidad}
                        onChange={(val) => updateProductoCell(index, 'cantidad', val)}
                        placeholder="Ej. 12000 bultos"
                        label="Cantidad Producida"
                      />
                    </td>
                    {/* OBS */}
                    <td className="py-1 px-1.5">
                      <ExpandableCell
                        disabled={!editable}
                        value={prod.obs}
                        onChange={(val) => updateProductoCell(index, 'obs', val)}
                        placeholder="..."
                        label="Observaciones"
                      />
                    </td>
                    {/* Acciones */}
                    {editable && (
                      <td className="py-1 px-1.5 text-center">
                        <button
                          onClick={() => removeProductoRow(index)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
