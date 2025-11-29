import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MechanismParams } from './types';
import { calculateKinematics, generateCycleData } from './utils/kinematics';
import { analyzeMechanismWithAI } from './services/geminiService';
import MechanismViewer from './components/MechanismViewer';
import Charts from './components/Charts';
import Controls from './components/Controls';
import { Activity, Ruler, Info } from 'lucide-react';

const App: React.FC = () => {
  // Initial state based on Example 7.4
  const [params, setParams] = useState<MechanismParams>({
    r2: 5,
    r3: 8,
    omega2: 10,
    theta2: 45
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  // Derived kinematic state for current frame
  const kinematicState = useMemo(() => calculateKinematics(params), [params]);
  
  // Full cycle data for charts
  const cycleData = useMemo(() => generateCycleData(params.r2, params.r3, params.omega2), [params.r2, params.r3, params.omega2]);

  // Animation Loop
  const animate = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = (time - lastTimeRef.current) / 1000; // seconds
      
      setParams(prev => {
        // newAngle = oldAngle + omega * dt * (180/PI to deg)
        // actually omega is rad/s, so we convert to deg/s
        const degPerSec = prev.omega2 * (180 / Math.PI);
        let newTheta = prev.theta2 + degPerSec * deltaTime;
        
        // Normalize 0-360
        newTheta = newTheta % 360;
        if (newTheta < 0) newTheta += 360;

        return { ...prev, theta2: newTheta };
      });
    }
    lastTimeRef.current = time;
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = undefined;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, params.omega2]); 

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
        const result = await analyzeMechanismWithAI(params, kinematicState);
        setAiAnalysis(result);
    } catch (e) {
        setAiAnalysis("Could not generate analysis. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Activity className="text-blue-600" />
            Slider-Crank Kinematics
            </h1>
            <p className="text-slate-500 mt-1">Interactive analysis based on Engineering Example 7.4</p>
        </div>
        <div className="hidden md:flex gap-4 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Crank Input</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Slider Output</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-160px)] min-h-[800px]">
        {/* Left Column: Controls (3 cols) */}
        <div className="lg:col-span-3 h-full overflow-y-auto">
          <Controls 
            params={params} 
            setParams={setParams} 
            isPlaying={isPlaying} 
            togglePlay={togglePlay}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Center Column: Visualization & Stats (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
           <div className="flex-1 min-h-[400px]">
             <MechanismViewer params={params} state={kinematicState} />
           </div>
           
           {/* Live Stat Cards */}
           <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                 <div>
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Ruler size={16} />
                        <span className="text-xs font-bold uppercase">Slider Position</span>
                    </div>
                    <div className="text-3xl font-mono font-semibold text-slate-800">
                        {kinematicState.sliderPos.toFixed(3)} <span className="text-sm text-slate-400">in</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="flex items-center gap-2 text-slate-500 mb-1 justify-end">
                        <span className="text-xs font-bold uppercase">Theta 3</span>
                    </div>
                    <div className="text-3xl font-mono font-semibold text-slate-800">
                        {kinematicState.theta3.toFixed(1)}°
                    </div>
                 </div>
              </div>
           </div>

           {/* AI Analysis Box */}
           {aiAnalysis && (
               <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shadow-sm animate-fade-in">
                   <div className="flex items-start gap-3">
                       <Info className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
                       <div>
                           <h4 className="font-bold text-indigo-900 text-sm mb-1">AI Analysis</h4>
                           <p className="text-indigo-800 text-sm leading-relaxed">{aiAnalysis}</p>
                       </div>
                   </div>
               </div>
           )}
        </div>

        {/* Right Column: Charts (4 cols) */}
        <div className="lg:col-span-4 h-full min-h-[400px]">
          <Charts data={cycleData} currentAngle={params.theta2} />
        </div>
      </main>
    </div>
  );
};

export default App;