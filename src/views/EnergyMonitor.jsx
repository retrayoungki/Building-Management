import React, { useState } from 'react';
import { Zap, Droplet, Flame, Lightbulb, Thermometer, BatteryCharging, ArrowDown, Leaf } from 'lucide-react';

export default function EnergyMonitor() {
  const [ecoMode, setEcoMode] = useState(false);
  const [timeframe, setTimeframe] = useState('Hourly');

  // Simulated metrics based on Eco Mode state
  const powerUsage = ecoMode ? 355 : 420;
  const powerSavingPercent = ecoMode ? 15.5 : 0;
  const waterUsage = ecoMode ? 132 : 150;
  const gasUsage = ecoMode ? 19 : 22;

  // Breakdown percentages
  const allocations = [
    { name: 'HVAC Cooling', value: ecoMode ? 40 : 45, color: 'bg-blue-600', valKwh: ecoMode ? 142 : 189 },
    { name: 'Interior Lighting', value: ecoMode ? 18 : 25, color: 'bg-amber-500', valKwh: ecoMode ? 64 : 105 },
    { name: 'Data Center & Servers', value: ecoMode ? 28 : 18, color: 'bg-purple-600', valKwh: ecoMode ? 100 : 75 },
    { name: 'Elevators & Transport', value: ecoMode ? 14 : 12, color: 'bg-emerald-600', valKwh: ecoMode ? 49 : 50 }
  ];

  // SVG Chart Data for Hourly Load
  const hourlyData = [
    { t: '08:00', load: ecoMode ? 310 : 360 },
    { t: '10:00', load: ecoMode ? 380 : 450 },
    { t: '12:00', load: ecoMode ? 360 : 430 },
    { t: '14:00', load: ecoMode ? 390 : 470 },
    { t: '16:00', load: ecoMode ? 370 : 440 },
    { t: '18:00', load: ecoMode ? 290 : 330 },
    { t: '20:00', load: ecoMode ? 210 : 250 }
  ];

  const chartHeight = 140;
  const chartWidth = 500;
  const padding = 25;
  const points = hourlyData.map((d, i) => {
    const x = padding + (i * (chartWidth - padding * 2) / (hourlyData.length - 1));
    const y = chartHeight - padding - (d.load / 600 * (chartHeight - padding * 2));
    return { x, y, load: d.load, label: d.t };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Eco Control Panel */}
      <div className="bg-white rounded-2xl p-5 border border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm text-left">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-primary">Smart HVAC & Lighting Optimizer</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <Leaf className="w-3 h-3" /> Eco Mode Available
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Toggle automated energy optimization protocols to dim corridor arrays and regulate thermostat drift (+1.5°C).
          </p>
        </div>

        <button 
          onClick={() => setEcoMode(!ecoMode)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow hover:shadow-lg ${
            ecoMode 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-primary hover:bg-[#001c59] text-white'
          }`}
        >
          <Leaf className={`w-4 h-4 ${ecoMode ? 'animate-bounce' : ''}`} />
          {ecoMode ? 'Eco Mode Active' : 'Activate Eco Mode'}
        </button>
      </div>

      {/* Consumption Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Electricity */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant hover:shadow-md transition-all flex items-center justify-between text-left">
          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Electricity Load</p>
            <p className="text-2xl font-bold text-[#00236f] mt-1">{powerUsage} kW</p>
            {ecoMode && (
              <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                <ArrowDown className="w-3.5 h-3.5" /> Saving {powerSavingPercent}% load
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ecoMode ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-600'}`}>
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Water */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant hover:shadow-md transition-all flex items-center justify-between text-left">
          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Water Consumption</p>
            <p className="text-2xl font-bold text-[#00236f] mt-1">{waterUsage} m³ <span className="text-xs text-outline font-normal">/ day</span></p>
            <p className="text-[10px] text-on-surface-variant mt-1 font-medium">Pressure: 3.2 Bar (Nominal)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center">
            <Droplet className="w-6 h-6" />
          </div>
        </div>

        {/* Gas */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant hover:shadow-md transition-all flex items-center justify-between text-left">
          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-wider">Gas Pressure Load</p>
            <p className="text-2xl font-bold text-[#00236f] mt-1">{gasUsage} m³ <span className="text-xs text-outline font-normal">/ day</span></p>
            <p className="text-[10px] text-on-surface-variant mt-1 font-medium">Boilers efficiency: 98.4%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Detailed Graphs & Allocation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Load curves (Takes 2 cols) */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant lg:col-span-2 text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-primary">Load Curve Profile</h3>
              <p className="text-xs text-on-surface-variant">Real-time demand trajectory today</p>
            </div>
            
            <div className="flex border border-outline-variant rounded-lg overflow-hidden">
              {['Hourly', 'Daily'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 text-xs font-bold transition-all ${
                    timeframe === t 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG line graph */}
          <div className="w-full h-48 mt-4">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ecoMode ? '#10b981' : '#00236f'} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={ecoMode ? '#10b981' : '#00236f'} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                const y = padding + r * (chartHeight - padding * 2);
                return (
                  <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#eeedf4" strokeWidth="1" strokeDasharray="3 3" />
                );
              })}

              <path d={areaPath} fill="url(#loadGradient)" />
              <path d={linePath} fill="none" stroke={ecoMode ? '#10b981' : '#00236f'} strokeWidth="2.5" />

              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={ecoMode ? '#10b981' : '#00236f'} strokeWidth="2" />
                  <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#1a1b21" fontSize="9" fontWeight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.load} kW
                  </text>
                  <text x={p.x} y={chartHeight - 4} textAnchor="middle" fill="#757682" fontSize="9" fontWeight="medium">
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Energy breakdown (Takes 1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant text-left flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-primary mb-1">Energy Allocation</h3>
            <p className="text-xs text-on-surface-variant mb-6">Usage breakdown by sub-system</p>
            
            <div className="space-y-4">
              {allocations.map((a, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface">{a.name}</span>
                    <span className="text-primary font-bold">{a.value}% <span className="text-[10px] text-outline font-normal">({a.valKwh} kW)</span></span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${a.color} h-full transition-all duration-500`} style={{ width: `${a.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-outline">
            <span>Grid Source: Local PLN</span>
            <span>Power Factor: 0.96 (Excellent)</span>
          </div>
        </div>
      </div>

      {/* Optimizations logs */}
      <div className="bg-white rounded-2xl p-5 border border-outline-variant text-left">
        <h3 className="text-base font-bold text-primary mb-4">Energy Efficiency Log</h3>
        <div className="space-y-3">
          <div className="p-3 border border-outline-variant rounded-xl flex items-center justify-between bg-emerald-50/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">HVAC Optimization Protocol Triggered</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Thermostat setpoint scaled by +1.5°C in public elevator areas.</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-full shrink-0">
              Active
            </span>
          </div>

          <div className="p-3 border border-outline-variant rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 text-[#00236f] rounded-lg flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface">Off-peak Parking Lot Array Dimming</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Basement B1 and B2 lighting reduced to 30% intensity from 22:00 to 06:00.</p>
              </div>
            </div>
            <span className="text-[10px] text-outline font-semibold">Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
