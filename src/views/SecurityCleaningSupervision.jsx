import React, { useState } from 'react';
import {
  Shield, CheckCircle2, AlertTriangle, RefreshCw, MoreVertical,
  Plus, Calendar, Clock, Download, ArrowUpRight
} from 'lucide-react';
import ExportToolbar from '../components/ExportToolbar';

const shiftRoster = [
  {
    name: 'Agus Santoso',
    role: 'Security Lvl 2',
    avatar: 'AS',
    mon: '06:00',
    tue: '06:00',
    wed: 'OFF',
    thu: '06:00',
    fri: '06:00',
    sat: '14:00',
    sun: '14:00'
  },
  {
    name: 'Rina Putri',
    role: 'Cleaning Supervisor',
    avatar: 'RP',
    mon: '14:00',
    tue: '14:00',
    wed: '14:00',
    thu: 'OFF',
    fri: '06:00',
    sat: '06:00',
    sun: '06:00'
  },
  {
    name: 'Budi Maulana',
    role: 'Security Lvl 1',
    avatar: 'BM',
    mon: '22:00',
    tue: '22:00',
    wed: '22:00',
    thu: '22:00',
    fri: 'OFF',
    sat: 'OFF',
    sun: '22:00'
  }
];

const rondaLogs = [
  {
    id: 1,
    location: 'Main Lobby & Entrance',
    status: 'CLEAR',
    statusColor: 'bg-green-50 text-green-700 border-green-200',
    iconColor: 'bg-green-100 text-green-700',
    officer: 'Agus Santoso',
    details: 'Inspection completed. All gates secured, CCTV functional.',
    time: 'Today, 08:45 AM',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 2,
    location: 'Basement Parking - Zone B',
    status: 'ATTENTION',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'bg-amber-100 text-amber-700',
    officer: 'Agus Santoso',
    details: 'Light flicker at Column B12. Reported to engineering. No unauthorized vehicles detected.',
    time: 'Today, 09:12 AM',
    images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 3,
    location: 'Rooftop & Chill Zone',
    status: 'CLEAR',
    statusColor: 'bg-green-50 text-green-700 border-green-200',
    iconColor: 'bg-green-100 text-green-700',
    officer: 'Budi Maulana',
    details: 'Area is clean and secure. Fire escape path is unobstructed.',
    time: 'Today, 10:05 AM',
    images: []
  }
];

const cleaningTasks = [
  { name: 'Main Washroom', time: 'Completed 08:30', status: 'done' },
  { name: 'Pantry & Canteen', time: 'Completed 09:15', status: 'done' },
  { name: 'Meeting Rooms', time: 'In Progress...', status: 'progress' },
  { name: 'Gym & Shower', time: 'Scheduled 13:00', status: 'todo' }
];

export default function SecurityCleaningSupervision() {
  const [viewType, setViewType] = useState('weekly');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Security & Cleaning Supervision</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Monitor facility safety and hygiene standards in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportToolbar
            title="Security & Cleaning Supervision"
            subtitle="Data roster keamanan dan kebersihan Graha Kaji"
            filename="security_cleaning_roster"
            data={shiftRoster}
            columns={[
              { key: 'name', label: 'Nama Staff' },
              { key: 'role', label: 'Jabatan' },
              { key: 'shift', label: 'Shift' },
              { key: 'status', label: 'Status' },
              { key: 'area', label: 'Area' },
            ]}
            summaryCards={[
              { label: 'Total Staff', value: shiftRoster.length },
              { label: 'On Duty', value: shiftRoster.filter(s=>s.status==='On Duty').length },
            ]}
          />
          <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg border border-outline-variant">
            <button
              onClick={() => setViewType('weekly')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewType === 'weekly' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewType === 'monthly' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Monthly View
            </button>
          </div>
        </div>
      </div>

      {/* Staff Weekly Roster */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Staff Weekly Roster</h3>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed block shrink-0" /> Pagi (06-14)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container block shrink-0" /> Siang (14-22)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container block shrink-0" /> Malam (22-06)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs font-semibold text-on-surface">
            <thead className="bg-surface-container-low border-b border-outline-variant text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
              <tr>
                <th className="px-6 py-3.5">Nama Staff</th>
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
                  <th key={day} className="px-3 py-3.5 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {shiftRoster.map((staff, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-label-sm font-bold text-on-surface-variant">
                        {staff.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{staff.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">{staff.role}</p>
                      </div>
                    </div>
                  </td>
                  {[staff.mon, staff.tue, staff.wed, staff.thu, staff.fri, staff.sat, staff.sun].map((shift, sIdx) => {
                    const isOff = shift === 'OFF';
                    const isMorning = shift === '06:00';
                    const isAfternoon = shift === '14:00';
                    const isNight = shift === '22:00';

                    let cellClass = '';
                    if (isOff) cellClass = 'bg-outline-variant/30 text-on-surface-variant/70';
                    else if (isMorning) cellClass = 'bg-primary-fixed text-primary';
                    else if (isAfternoon) cellClass = 'bg-secondary-container text-on-secondary-container';
                    else if (isNight) cellClass = 'bg-tertiary-container text-on-tertiary-container';

                    return (
                      <td key={sIdx} className="px-2 py-4">
                        <div className={`mx-auto w-full max-w-[70px] py-1.5 rounded text-center font-extrabold ${cellClass}`}>
                          {shift}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Daily Ronda & Cleaning Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Ronda Log */}
        <section className="lg:col-span-2 bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Daily Ronda & Inspection</h3>
            <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
              Riwayat Lengkap <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="overflow-y-auto max-h-[480px] custom-scrollbar divide-y divide-outline-variant">
            {rondaLogs.map(log => (
              <div key={log.id} className="px-6 py-5 flex items-start gap-4 hover:bg-surface-container-low transition-colors">
                <div className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${log.iconColor}`}>
                  {log.status === 'CLEAR' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-on-surface">{log.location}</h4>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${log.statusColor}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-semibold mt-1">
                    Inspeksi oleh <span className="text-on-surface font-bold">{log.officer}</span>. {log.details}
                  </p>
                  
                  {log.images.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
                      {log.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant shrink-0 cursor-pointer">
                          <img
                            src={img}
                            alt={`${log.location} snapshot`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onClick={() => alert('Membuka gambar inspeksi resolusi penuh...')}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1 text-[10px] text-on-surface-variant font-semibold">
                    <Clock className="w-3 h-3" /> {log.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cleaning Checklist Status */}
        <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Cleaning Checklist</h3>
          </div>
          
          <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-on-surface-variant">Daily Task Completion</span>
                  <span className="text-primary">68%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {cleaningTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 flex items-center justify-center rounded ${
                        task.status === 'done'
                          ? 'bg-green-100 text-green-700'
                          : task.status === 'progress'
                          ? 'bg-primary-container/10 text-primary'
                          : 'bg-surface-variant text-on-surface-variant'
                      }`}>
                        {task.status === 'done' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : task.status === 'progress' ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-on-surface leading-tight">{task.name}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{task.time}</p>
                      </div>
                    </div>
                    <button className="text-on-surface-variant hover:text-primary">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-4 py-2.5 bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
              <Download className="w-4 h-4" /> Export Inspection Report
            </button>
          </div>
        </section>

      </div>

      {/* Emergency Trigger Button */}
      <button
        onClick={() => alert('🚨 Peringatan Darurat: Pemilik gedung dan tim manajemen akan segera dihubungi!')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-50 border border-red-500"
        title="Broadcast Emergency Warning"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          emergency_share
        </span>
      </button>

    </div>
  );
}
