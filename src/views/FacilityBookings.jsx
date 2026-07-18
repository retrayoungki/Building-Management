import React, { useState } from 'react';
import { Calendar, Users, DollarSign, Clock, Check, X, Bookmark } from 'lucide-react';

export default function FacilityBookings({ bookings, onAddBooking, onApproveBooking, onCancelBooking }) {
  const [selectedFacility, setSelectedFacility] = useState('All');
  const [showBookModal, setShowBookModal] = useState(false);

  // Form State
  const [bookRoom, setBookRoom] = useState('VIP Boardroom');
  const [bookTenant, setBookTenant] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('09:00 - 12:00');
  const [bookNotes, setBookNotes] = useState('');

  const facilitiesList = [
    { name: 'VIP Boardroom', cap: 20, rate: 'Rp 500,000 / hr', icon: Users, color: 'from-blue-600 to-indigo-700' },
    { name: 'Main Auditorium', cap: 150, rate: 'Rp 5,000,000 / day', icon: Calendar, color: 'from-purple-600 to-pink-700' },
    { name: 'Rooftop Lounge', cap: 80, rate: 'Rp 3,000,000 / event', icon: Bookmark, color: 'from-emerald-500 to-teal-700' },
    { name: 'Skyline Fitness Center', cap: 30, rate: 'Rp 100,000 / entry', icon: Clock, color: 'from-rose-500 to-orange-600' }
  ];

  const handleBookSubmit = (e) => {
    e.preventDefault();
    if (!bookTenant || !bookDate) return;

    const newBooking = {
      id: 'BKG-' + Math.floor(1000 + Math.random() * 9000),
      facility: bookRoom,
      tenant: bookTenant,
      date: bookDate,
      timeSlot: bookTime,
      status: 'Pending',
      notes: bookNotes || 'Regular meeting'
    };

    onAddBooking(newBooking);

    // Reset Form
    setBookTenant('');
    setBookDate('');
    setBookNotes('');
    setShowBookModal(false);
  };

  const filteredBookings = bookings.filter(b => selectedFacility === 'All' || b.facility === selectedFacility);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Facility Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {facilitiesList.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
            <div className={`p-4 bg-gradient-to-br ${f.color} text-white`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">Suite A</span>
                <f.icon className="w-5 h-5 opacity-80" />
              </div>
              <h4 className="font-bold text-base mt-3 leading-tight">{f.name}</h4>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                <span>Capacity</span>
                <span className="text-on-surface font-bold">{f.cap} pax</span>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                <span>Rate</span>
                <span className="text-primary font-extrabold">{f.rate}</span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={() => {
                  setBookRoom(f.name);
                  setShowBookModal(true);
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Reserve Slot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main Reservation Dashboard */}
      <div className="bg-white rounded-2xl border border-outline-variant p-5 text-left shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-primary">Active Facility Bookings</h3>
            <p className="text-xs text-on-surface-variant">Manage approvals and schedules</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="px-3 py-1.5 bg-surface-container-low text-xs border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-48"
            >
              <option value="All">All Facilities</option>
              {facilitiesList.map((f, i) => (
                <option key={i} value={f.name}>{f.name}</option>
              ))}
            </select>

            <button 
              onClick={() => setShowBookModal(true)}
              className="px-4 py-1.5 bg-primary hover:bg-[#001c59] text-white font-semibold text-xs rounded-xl shadow shrink-0"
            >
              Add Booking
            </button>
          </div>
        </div>

        {/* Bookings Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-[11px] font-semibold text-outline uppercase tracking-wider">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Facility Room</th>
                <th className="py-3 px-4">Tenant Company</th>
                <th className="py-3 px-4">Reservation date</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Approvals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors font-medium text-on-surface">
                  <td className="py-3 px-4 text-outline font-bold">{b.id}</td>
                  <td className="py-3 px-4 font-bold text-primary">{b.facility}</td>
                  <td className="py-3 px-4 font-semibold">{b.tenant}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{b.date}</td>
                  <td className="py-3 px-4 text-on-surface-variant font-mono">{b.timeSlot}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-center">
                      {b.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => onApproveBooking(b.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-200 transition-colors"
                            title="Confirm Booking"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onCancelBooking(b.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
                            title="Reject Booking"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button 
                          onClick={() => onCancelBooking(b.id)}
                          className="px-2 py-0.5 text-rose-500 hover:bg-rose-50 rounded border border-rose-200 text-[10px] transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === 'Cancelled' && (
                        <span className="text-[10px] text-outline italic">No action</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-outline">
                    No reservations recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Room Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="p-5 bg-primary text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Reserve Building Resource</h3>
              <button 
                onClick={() => setShowBookModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all text-lg font-bold"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Select Resource *</label>
                <select 
                  value={bookRoom}
                  onChange={(e) => setBookRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                >
                  {facilitiesList.map((f, i) => (
                    <option key={i} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Leasing Tenant / Company *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Tokopedia Office"
                  value={bookTenant}
                  onChange={(e) => setBookTenant(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Select Date *</label>
                  <input 
                    type="date" 
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Time Frame</label>
                  <select 
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                  >
                    <option value="09:00 - 12:00">Morning (09:00 - 12:00)</option>
                    <option value="13:00 - 16:00">Afternoon (13:00 - 16:00)</option>
                    <option value="18:00 - 21:00">Night (18:00 - 21:00)</option>
                    <option value="09:00 - 17:00">All Day Session</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Reservation Notes</label>
                <textarea 
                  rows="2"
                  placeholder="e.g. Annual shareholder meeting board presentation..."
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 border border-outline-variant hover:bg-slate-50 transition-colors text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#001c59] text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Reserve Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
