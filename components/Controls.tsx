import React from 'react';
import { MechanismParams } from '../types';
import { Play, Pause, RefreshCw, Cpu } from 'lucide-react';

interface Props {
  params: MechanismParams;
  setParams: React.Dispatch<React.SetStateAction<MechanismParams>>;
  isPlaying: boolean;
  togglePlay: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const Controls: React.FC<Props> = ({ params, setParams, isPlaying, togglePlay, onAnalyze, isAnalyzing }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const resetToExample = () => {
    setParams(prev => ({
        ...prev,
        r2: 5,
        r3: 8,
        omega2: 10,
        theta2: 45
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Parameters</h2>
        <button 
            onClick={resetToExample} 
            title="Reset to Example 7.4"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
            <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Crank Length (r2)</label>
          <div className="flex items-center gap-2">
             <input
                type="range"
                name="r2"
                min="1"
                max="20"
                step="0.1"
                value={params.r2}
                onChange={handleChange}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <input
                type="number"
                name="r2"
                value={params.r2}
                onChange={handleChange}
                className="w-20 p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Conn. Rod Length (r3)</label>
          <div className="flex items-center gap-2">
            <input
                type="range"
                name="r3"
                min={params.r2 + 1} 
                max="30"
                step="0.1"
                value={params.r3}
                onChange={handleChange}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <input
                type="number"
                name="r3"
                value={params.r3}
                onChange={handleChange}
                className="w-20 p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Angular Velocity (rad/s)</label>
          <div className="flex items-center gap-2">
            <input
                type="range"
                name="omega2"
                min="-20"
                max="20"
                step="0.5"
                value={params.omega2}
                onChange={handleChange}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <input
                type="number"
                name="omega2"
                value={params.omega2}
                onChange={handleChange}
                className="w-20 p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
        
         <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-500 uppercase">Current Angle (deg)</label>
          <div className="flex items-center gap-2">
            <input
                type="range"
                name="theta2"
                min="0"
                max="360"
                step="1"
                value={params.theta2}
                onChange={handleChange}
                disabled={isPlaying}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600 disabled:opacity-50"
            />
            <input
                type="number"
                name="theta2"
                min="0"
                max="360"
                step="1"
                value={params.theta2}
                onChange={handleChange}
                disabled={isPlaying}
                className="w-20 p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-slate-500 outline-none disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
            onClick={togglePlay}
            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                isPlaying 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
        >
            {isPlaying ? <><Pause size={20} /> Pause Animation</> : <><Play size={20} /> Start Animation</>}
        </button>

        <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isAnalyzing ? (
                <span className="animate-pulse">Thinking...</span>
            ) : (
                <><Cpu size={20} /> Explain with AI</>
            )}
        </button>
      </div>
    </div>
  );
};

export default Controls;