import React from 'react';
import { Pipette, Paintbrush, RefreshCw } from 'lucide-react';
import { IdentificacionRociadoras } from '../types';

interface TabRociadorasProps {
  rociadoras: IdentificacionRociadoras[];
  onChangeRociadoras: (roc: IdentificacionRociadoras[]) => void;
  editable: boolean;
}

const MAQUINAS_L1 = ['11', '12', '13', '14', '15'];
const MAQUINAS_L3 = ['31', '32', '33', '34', '35', '36', '37', '38'];

// Predefined colors for fast picking
const COLOR_PRESETS = [
  { name: 'Rojo', hex: '#EF4444', textClass: 'text-red-600 bg-red-50' },
  { name: 'Azul', hex: '#3B82F6', textClass: 'text-blue-600 bg-blue-50' },
  { name: 'Verde', hex: '#10B981', textClass: 'text-emerald-600 bg-emerald-50' },
  { name: 'Amarillo', hex: '#FBBF24', textClass: 'text-amber-600 bg-amber-50' },
  { name: 'Naranja', hex: '#F97316', textClass: 'text-orange-600 bg-orange-50' },
  { name: 'Negro', hex: '#1E293B', textClass: 'text-slate-800 bg-slate-100' },
  { name: 'Blanco', hex: '#F8FAFC', textClass: 'text-slate-500 bg-slate-50 border border-slate-200' },
];

export default function TabRociadoras({
  rociadoras,
  onChangeRociadoras,
  editable
}: TabRociadorasProps) {

  // Retrieve current color for a machine
  const getColorForMachine = (linea: string, maquina: string): string => {
    const found = rociadoras.find(r => r.linea === linea && r.maquina === maquina);
    return found ? found.color : '';
  };

  // Update color
  const setMachineColor = (linea: string, maquina: string, color: string) => {
    if (!editable) return;
    const existingIndex = rociadoras.findIndex(r => r.linea === linea && r.maquina === maquina);
    
    let updated = [...rociadoras];
    if (color.trim() === '') {
      // Remove if cleared
      if (existingIndex !== -1) {
        updated.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        updated[existingIndex] = { ...updated[existingIndex], color };
      } else {
        updated.push({ linea, maquina, color });
      }
    }
    onChangeRociadoras(updated);
  };

  const clearAllColors = () => {
    if (!editable) return;
    if (window.confirm('¿Está seguro de limpiar todos los colores registrados de las rociadoras?')) {
      onChangeRociadoras([]);
    }
  };

  const renderMachineCard = (linea: string, maquina: string) => {
    const currentColor = getColorForMachine(linea, maquina);
    
    // Find preset hex if matching
    const matchedPreset = COLOR_PRESETS.find(
      p => p.name.toLowerCase() === currentColor.trim().toLowerCase()
    );
    const circleBg = matchedPreset ? matchedPreset.hex : (currentColor ? '#6366F1' : '#E2E8F0');

    return (
      <div 
        key={`${linea}_${maquina}`}
        className={`bg-slate-50/50 rounded-2xl border p-4 transition-all flex flex-col justify-between ${
          currentColor ? 'border-indigo-200 bg-indigo-50/5 shadow-xs' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Color Indicator Lamp */}
            <span 
              className="w-4 h-4 rounded-full shadow-inner transition-all duration-300" 
              style={{ backgroundColor: circleBg }}
            />
            <span className="font-bold text-slate-800 text-sm">Máquina {maquina}</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
            {linea}
          </span>
        </div>

        {/* Preset colors button line */}
        {editable ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setMachineColor(linea, maquina, preset.name)}
                  className={`text-[10px] px-2 py-0.5 rounded-sm transition-all font-medium cursor-pointer ${
                    currentColor.toLowerCase() === preset.name.toLowerCase()
                      ? 'ring-1 ring-offset-1 ring-indigo-500 scale-105 opacity-100 font-bold'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: preset.hex, color: preset.name === 'Blanco' || preset.name === 'Amarillo' ? '#1E293B' : '#FFFFFF' }}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Manual Text Input Override */}
            <div className="relative">
              <input
                type="text"
                disabled={!editable}
                value={currentColor}
                onChange={(e) => setMachineColor(linea, maquina, e.target.value)}
                placeholder="Escriba otro color..."
                className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg py-1.5 pl-8 pr-2.5 text-xs outline-hidden transition-all"
              />
              <Paintbrush className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-2.5 border border-slate-100 text-center">
            {currentColor ? (
              <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: circleBg }} />
                {currentColor}
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">No especificado</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2.5 rounded-2xl text-indigo-600">
              <Pipette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Identificación de Rociadoras (Marcas de Calidad)</h2>
              <p className="text-sm text-slate-500">Registro visual de la tinta de marcaje utilizada por cada rociadora para control de lotes impresos.</p>
            </div>
          </div>
          {editable && rociadoras.length > 0 && (
            <button
              onClick={clearAllColors}
              className="flex items-center gap-1 text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      {/* COLUMNS PER LINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LINEA 1 */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-5 bg-indigo-600 rounded-xs" />
              LÍNEA 1
            </h3>
            <p className="text-xs text-slate-400">Rociadoras activas en envasadoras de Línea 1.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MAQUINAS_L1.map(mq => renderMachineCard('Linea 1', mq))}
          </div>
        </div>

        {/* LINEA 3 */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-5 bg-indigo-600 rounded-xs" />
              LÍNEA 3
            </h3>
            <p className="text-xs text-slate-400">Rociadoras activas en envasadoras de Línea 3.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MAQUINAS_L3.map(mq => renderMachineCard('Linea 3', mq))}
          </div>
        </div>

      </div>
    </div>
  );
}
