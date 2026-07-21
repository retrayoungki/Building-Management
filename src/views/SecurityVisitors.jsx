import React, { useState, useEffect, useRef } from 'react';
import { Shield, Eye, UserCheck, UserX, FileText, QrCode, Play, AlertCircle } from 'lucide-react';

export default function SecurityVisitors({ visitors, onCheckInVisitor, onCheckOutVisitor, onAddVisitor }) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeVisitorPass, setActiveVisitorPass] = useState(null);
  
  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [hostCompany, setHostCompany] = useState('');
  const [purpose, setPurpose] = useState('Business Meeting');

  // CCTV Feeds Animation Ref
  const canvasRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const cameraNames = ['CAM 01 - Main Lobby', 'CAM 02 - North Entrance', 'CAM 03 - L12 West Corridor', 'CAM 04 - Cargo Loading Dock'];

  useEffect(() => {
    const intervals = canvasRefs.map((ref, idx) => {
      const canvas = ref.current;
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      let offset = 0;
      
      // Simulating moving lines or people in cameras
      return setInterval(() => {
        if (!ctx) return;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw Scanlines / Noise
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.height; i += 4) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }

        // Draw animated box simulating motion detector
        offset = (offset + 1.5) % canvas.width;
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40 + Math.sin(offset/10)*10, 30 + Math.cos(offset/15)*10, 35, 35);
        ctx.fillStyle = '#22c55e';
        ctx.font = '8px monospace';
        ctx.fillText('MOTION DETECTED', 40 + Math.sin(offset/10)*10, 25 + Math.cos(offset/15)*10);

        // Grid overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Draw static white noise
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        for (let k = 0; k < 120; k++) {
          const rx = Math.random() * canvas.width;
          const ry = Math.random() * canvas.height;
          ctx.fillRect(rx, ry, 2, 2);
        }

      }, 100);
    });

    return () => {
      intervals.forEach(int => int && clearInterval(int));
    };
  }, []);

  const handleRegisterVisitor = (e) => {
    e.preventDefault();
    if (!visitorName || !hostCompany) return;

    const newVisitor = {
      id: 'VIS-' + Math.floor(1000 + Math.random() * 9000),
      name: visitorName,
      host: hostCompany,
      purpose: purpose,
      checkIn: '--:--',
      checkOut: '--:--',
      status: 'Expected',
      date: new Date().toLocaleDateString('en-GB')
    };

    onAddVisitor(newVisitor);
    setActiveVisitorPass(newVisitor);
    setShowQRModal(true);

    // Reset Form
    setVisitorName('');
    setHostCompany('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 2x2 CCTV Matrix & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CCTV Grid (2 Columns) */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant lg:col-span-2 text-left">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-primary">CCTV Surveillance Matrix</h3>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live Broadcast
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {cameraNames.map((cam, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden aspect-video border border-[#1e293b]">
                <canvas 
                  ref={canvasRefs[idx]} 
                  width="320" 
                  height="180" 
                  className="w-full h-full block bg-slate-900"
                />
                
                {/* Camera Overlay HUD */}
                <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between text-left font-mono">
                  <div className="flex justify-between items-start text-xs text-white">
                    <span className="bg-black/50 px-2 py-0.5 rounded font-semibold text-[10px] tracking-wide text-emerald-400">
                      {cam}
                    </span>
                    <span className="bg-red-600/90 text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 animate-pulse">
                      🔴 REC
                    </span>
                  </div>
                  <div className="flex justify-between items-end text-[9px] text-white/70 bg-black/30 p-1.5 rounded">
                    <span>1080P // 30FPS</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security desk controls (1 Column) */}
        <div className="bg-white rounded-2xl p-5 border border-outline-variant text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-primary">Pre-Register Guest</h3>
            </div>

            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Visitor Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Stephen Strange"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Host Company Tenant *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. TechVanguard Suite 12B"
                  value={hostCompany}
                  onChange={(e) => setHostCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Purpose of Visit</label>
                <select 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                >
                  <option value="Business Meeting">Business Meeting</option>
                  <option value="Maintenance / Service">Maintenance / Service</option>
                  <option value="Delivery / Courier">Delivery / Courier</option>
                  <option value="Interview">Employment Interview</option>
                  <option value="Personal Visit">Personal Visit</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-[#001c59] text-white font-bold text-xs rounded-xl shadow transition-all mt-6"
              >
                <QrCode className="w-4 h-4" />
                Generate Guest Pass
              </button>
            </form>
          </div>

          <div className="p-3.5 bg-blue-50/40 border border-outline-variant rounded-xl flex gap-3 items-start text-xs text-primary font-medium mt-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#00236f] mt-0.5" />
            <p className="leading-snug">Pre-registered guests can check-in quickly by scanning their digital QR pass at the front lobby terminal.</p>
          </div>
        </div>
      </div>

      {/* Visitor Check-in Log Table Card */}
      <div className="bg-white rounded-2xl border border-outline-variant p-5 text-left shadow-sm">
        <h3 className="text-base font-bold text-primary mb-1">Visitor Operations Desk</h3>
        <p className="text-xs text-on-surface-variant mb-6">Real-time visitor logs and check-in desk</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-[11px] font-semibold text-outline uppercase tracking-wider">
                <th className="py-3 px-4">Pass ID</th>
                <th className="py-3 px-4">Visitor</th>
                <th className="py-3 px-4">Host Company</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {visitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors font-medium text-on-surface">
                  <td className="py-3 px-4 font-mono text-outline font-bold">{v.id}</td>
                  <td className="py-3 px-4 font-bold text-primary">{v.name}</td>
                  <td className="py-3 px-4 font-semibold">{v.host}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{v.purpose}</td>
                  <td className="py-3 px-4 text-on-surface-variant font-mono">{v.checkIn}</td>
                  <td className="py-3 px-4 text-on-surface-variant font-mono">{v.checkOut}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'Checked In' ? 'bg-emerald-100 text-emerald-800' :
                      v.status === 'Expected' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      {v.status === 'Expected' && (
                        <button 
                          onClick={() => onCheckInVisitor(v.id)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold rounded-lg transition-all"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Check In
                        </button>
                      )}
                      {v.status === 'Checked In' && (
                        <button 
                          onClick={() => onCheckOutVisitor(v.id)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold rounded-lg transition-all"
                        >
                          <UserX className="w-3.5 h-3.5" /> Check Out
                        </button>
                      )}
                      {v.status === 'Checked Out' && (
                        <span className="text-[10px] text-outline italic">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Pass QR Modal */}
      {showQRModal && activeVisitorPass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <span className="font-bold text-sm">Graha Kaji Guest Pass</span>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <p className="text-[10px] text-outline uppercase tracking-widest font-bold">Authorized Entry Permit</p>
              
              {/* Custom SVG High-tech QR Code Simulation */}
              <div className="w-36 h-36 mx-auto bg-slate-50 border border-outline-variant rounded-xl p-3 flex items-center justify-center relative">
                <svg className="w-full h-full text-primary" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                  <rect x="5" y="5" width="15" height="15" fill="#fff" />
                  <rect x="9" y="9" width="7" height="7" fill="currentColor" />

                  <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                  <rect x="80" y="5" width="15" height="15" fill="#fff" />
                  <rect x="84" y="9" width="7" height="7" fill="currentColor" />

                  <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                  <rect x="5" y="80" width="15" height="15" fill="#fff" />
                  <rect x="9" y="84" width="7" height="7" fill="currentColor" />

                  {/* Random QR dots */}
                  <rect x="35" y="10" width="10" height="5" fill="currentColor" />
                  <rect x="50" y="5" width="5" height="15" fill="currentColor" />
                  <rect x="60" y="15" width="10" height="5" fill="currentColor" />

                  <rect x="35" y="35" width="5" height="5" fill="currentColor" />
                  <rect x="45" y="40" width="15" height="10" fill="currentColor" />
                  <rect x="65" y="30" width="5" height="15" fill="currentColor" />

                  <rect x="30" y="60" width="15" height="5" fill="currentColor" />
                  <rect x="55" y="55" width="5" height="10" fill="currentColor" />
                  <rect x="70" y="65" width="10" height="10" fill="currentColor" />

                  <rect x="80" y="35" width="15" height="10" fill="currentColor" />
                  <rect x="85" y="50" width="5" height="15" fill="currentColor" />

                  <rect x="35" y="75" width="10" height="15" fill="currentColor" />
                  <rect x="50" y="85" width="15" height="5" fill="currentColor" />
                  <rect x="70" y="80" width="10" height="10" fill="currentColor" />
                </svg>
              </div>

              <div>
                <h4 className="font-extrabold text-primary text-base leading-tight">{activeVisitorPass.name}</h4>
                <p className="text-xs font-semibold text-on-surface-variant mt-1">Host: {activeVisitorPass.host}</p>
                <p className="text-[10px] text-outline mt-0.5">Purpose: {activeVisitorPass.purpose}</p>
              </div>

              <div className="border-t border-outline-variant pt-4 flex flex-col gap-2">
                <p className="text-[10px] text-on-surface-variant leading-snug">
                  Pass ID: <span className="font-mono font-bold text-primary">{activeVisitorPass.id}</span>
                </p>
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="w-full py-2 bg-primary hover:bg-[#001c59] text-white font-bold text-xs rounded-lg transition-all"
                >
                  Close & Print Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
