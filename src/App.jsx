import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './views/DashboardOverview';
import TenantManagement from './views/TenantManagement';
import MaintenanceTickets from './views/MaintenanceTickets';
import Certifications from './views/Certifications';
import SecurityVisitors from './views/SecurityVisitors';
import Reports from './views/Reports';
import Settings from './views/Settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Seed Data States ---
  const [tenants, setTenants] = useState([
    { id: 'TNT-1011', company: 'BlueTech Indonesia, PT', unit: 'Fl. 12 - Unit A1', leaseStart: '15 Nov 2023', leaseEnd: '15 Nov 2024', dueDate: '15 Nov 2024', rent: 150000000, status: 'Active', payment: 'Paid', initials: 'BT' },
    { id: 'TNT-2041', company: 'Creative Flow Studio', unit: 'Fl. 08 - Unit C4', leaseStart: '28 Oct 2022', leaseEnd: '28 Oct 2023', dueDate: '28 Oct 2023', rent: 120000000, status: 'Ending Soon', payment: 'Paid', initials: 'CR' },
    { id: 'TNT-3082', company: 'Global Koneksi Mandiri', unit: 'Fl. 15 - Unit B2', leaseStart: '05 Oct 2022', leaseEnd: '05 Oct 2023', dueDate: '05 Oct 2023', rent: 180000000, status: 'Active', payment: 'Late', initials: 'GK' },
    { id: 'TNT-4015', company: 'Sinar Retailindo', unit: 'Fl. 02 - Unit 05', leaseStart: '12 Sep 2022', leaseEnd: '12 Sep 2023', dueDate: '12 Sep 2023', rent: 90000000, status: 'Expired', payment: 'Paid', initials: 'SR' },
    { id: 'TNT-5021', company: 'Mega Astra Ventura', unit: 'Fl. 20 - Suite X', leaseStart: '01 Dec 2023', leaseEnd: '01 Dec 2024', dueDate: '01 Dec 2024', rent: 250000000, status: 'Active', payment: 'Paid', initials: 'MA' }
  ]);

  const [tickets, setTickets] = useState([
    { id: 'WO-2023-0045', title: 'Kebocoran Pipa Lantai 4', category: 'Plumbing', priority: 'High', status: 'New', location: 'Lantai 4, Pantry Timur', reporter: 'Penyewa Lt 4', description: 'Kebocoran pipa di ceiling area pantry timur lantai 4.', date: '18/07/2026', assignee: 'Budi Santoso', timeText: '2 jam lalu' },
    { id: 'WO-2023-0046', title: 'Ganti Lampu Lobby Utama', category: 'Electrical', priority: 'Medium', status: 'New', location: 'Lobby, Area Resepsionis', reporter: 'Reception Desk', description: 'Lampu halogen redup dan berkedip.', date: '18/07/2026', assignee: 'Siti Aminah', timeText: '5 jam lalu' },
    { id: 'WO-2023-0040', title: 'Perbaikan Lift No. 3', category: 'Elevator', priority: 'High', status: 'In Progress', location: 'Zona Lift B, Lobby', reporter: 'Security', description: 'Lift macet di lantai dasar.', date: '17/07/2026', assignee: 'Rahmat H.', timeText: '24 jam lalu' },
    { id: 'WO-2023-0038', title: 'Servis AC Ruang Rapat A', category: 'HVAC', priority: 'Low', status: 'Waiting Sparepart', location: 'Lantai 2, Meeting Room A', reporter: 'Creative Flow', description: 'Kurang dingin, memerlukan penambahan freon.', date: '16/07/2026', assignee: 'Andi Wijaya', timeText: '2 hari lalu', sparepartNote: 'Menunggu Freon R32' },
    { id: 'WO-2023-0035', title: 'Pengecekan Alarm Kebakaran', category: 'Fire Hydrant', priority: 'Low', status: 'Resolved', location: 'Seluruh Area Gedung', reporter: 'Engineering', description: 'Uji fungsi berkala sensor detektor asap dan bel alarm.', date: '18/07/2026', assignee: 'Doni Pratama', timeText: '3 jam lalu' }
  ]);

  const [visitors, setVisitors] = useState([
    { id: 'VIS-9011', name: 'Stephen Strange', host: 'TechVanguard Indonesia', purpose: 'Business Meeting', checkIn: '--:--', checkOut: '--:--', status: 'Expected', date: '18/07/2026' },
    { id: 'VIS-9012', name: 'Bruce Banner', host: 'RuangGuru', purpose: 'Interview', checkIn: '10:15', checkOut: '--:--', status: 'Checked In', date: '18/07/2026' },
    { id: 'VIS-9013', name: 'Tony Stark', host: 'Tokopedia', purpose: 'Personal Visit', checkIn: '08:30', checkOut: '11:45', status: 'Checked Out', date: '18/07/2026' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'HVAC Temp Spike Alert', message: 'Zone 5 temperature reached 27.2°C (Warning)', type: 'warning', time: '10 min ago', read: false },
    { id: 2, title: 'Water Leak Triggered', message: 'Basement 2 leak sensor 4B detected fluid presence.', type: 'danger', time: '1 hr ago', read: false },
    { id: 3, title: 'Weekly Load Test Scheduled', message: 'Generator weekly load test commences today at 22:00.', type: 'info', time: '3 hr ago', read: true }
  ]);

  // --- Handlers & Actions ---
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Tenants actions
  const handleAddTenant = (newTenant) => {
    setTenants([newTenant, ...tenants]);
    setNotifications([
      { id: Date.now(), title: 'New Tenant Registered', message: `${newTenant.company} registered for ${newTenant.unit}.`, type: 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleDeleteTenant = (id) => {
    const deleted = tenants.find(t => t.id === id);
    setTenants(tenants.filter(t => t.id !== id));
    if (deleted) {
      setNotifications([
        { id: Date.now(), title: 'Lease Cancelled', message: `${deleted.company} lease terminated.`, type: 'warning', time: 'Just now', read: false },
        ...notifications
      ]);
    }
  };

  // Tickets actions
  const handleAddTicket = (newTicket) => {
    setTickets([newTicket, ...tickets]);
    setNotifications([
      { id: Date.now(), title: 'New Ticket Opened', message: `[${newTicket.priority}] ${newTicket.title}`, type: newTicket.priority === 'Urgent' ? 'danger' : 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleUpdateTicketStatus = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleAssignTechnician = (id, techName) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, assignee: techName, status: t.status === 'New' ? 'In Progress' : t.status } : t));
  };

  // Visitors actions
  const handleAddVisitor = (newVis) => {
    setVisitors([newVis, ...visitors]);
  };

  const handleCheckInVisitor = (id) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setVisitors(visitors.map(v => v.id === id ? { ...v, status: 'Checked In', checkIn: timeNow } : v));
  };

  const handleCheckOutVisitor = (id) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setVisitors(visitors.map(v => v.id === id ? { ...v, status: 'Checked Out', checkOut: timeNow } : v));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  // Render view router
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardOverview 
            onViewChange={setActiveView} 
            tickets={tickets} 
            tenants={tenants} 
          />
        );
      case 'tenants':
        return (
          <TenantManagement 
            tenants={tenants} 
            onAddTenant={handleAddTenant} 
            onDeleteTenant={handleDeleteTenant} 
            searchTerm={searchTerm}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceTickets 
            tickets={tickets} 
            onAddTicket={handleAddTicket} 
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onAssignTechnician={handleAssignTechnician}
          />
        );
      case 'certifications':
        return <Certifications />;
      case 'security':
        return (
          <SecurityVisitors 
            visitors={visitors} 
            onAddVisitor={handleAddVisitor} 
            onCheckInVisitor={handleCheckInVisitor} 
            onCheckOutVisitor={handleCheckOutVisitor} 
          />
        );
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <div className="p-8 text-center text-outline">View not found</div>;
    }
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-on-surface">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          notifications={notifications} 
          onMarkAllRead={handleMarkAllRead} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-gutter bg-background">
          <div className="max-w-[container-max] mx-auto w-full">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}
