import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
  currentAngle: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg text-xs text-slate-200">
        <p className="font-bold mb-1">Angle: {label}°</p>
        <p style={{ color: '#38bdf8' }}>Pos: {payload[0]?.value?.toFixed(2)} in</p>
      </div>
    );
  }
  return null;
};

const Charts: React.FC<Props> = ({ data, currentAngle }) => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative">
        <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Displacement Curve</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="angle" 
              type="number" 
              domain={[0, 360]} 
              tick={{ fontSize: 10, fill: '#64748b' }}
              label={{ value: 'Crank Angle (°)', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
            />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine x={currentAngle} stroke="#ef4444" strokeDasharray="3 3" />

            <Line 
              type="monotone" 
              dataKey="position" 
              stroke="#38bdf8" 
              strokeWidth={3} 
              dot={false}
              name="Position"
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="absolute top-4 right-4 flex gap-4 text-xs font-medium">
             <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#38bdf8]"></div> Position
             </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;