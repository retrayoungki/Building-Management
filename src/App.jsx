import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './views/DashboardOverview';
import TenantManagement from './views/TenantManagement';
import MaintenanceTickets from './views/MaintenanceTickets';
import Certifications from './views/Certifications';
import SecurityCleaningSupervision from './views/SecurityCleaningSupervision';
import Reports from './views/Reports';
import Settings from './views/Settings';
import TenantPortal from './views/TenantPortal';
import Expenses from './views/Expenses';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 'USR-0001', name: 'Admin Graha Kaji', email: 'admin@gedungku.com', password: 'admin123', role: 'role_property_manager', initials: 'AG' },
    { id: 'USR-1001', name: 'Budi Santoso', email: 'budi.santoso@gedungku.id', password: 'password123', role: 'role_property_manager', initials: 'BS' },
    { id: 'USR-1002', name: 'Siti Aminah', email: 'siti.aminah@gedungku.id', password: 'password123', role: 'role_building_manager', initials: 'SA' },
    { id: 'USR-1003', name: 'Rian Pratama', email: 'rian.pratama@gedungku.id', password: 'password123', role: 'role_technician', initials: 'RP' },
    { id: 'USR-2001', name: 'Global Tech', email: 'tenant@gedungku.com', password: 'tenant123', role: 'role_tenant', initials: 'GT' }
  ]);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const [expenses, setExpenses] = useState([
    { id: 'EXP-1001', title: 'Token Listrik AC Chiller lt.1', category: 'Token Listrik Unit', amount: 150000000, date: '2026-07-15', scope: 'Tenant Unit', description: 'Pembelian token untuk unit BlueTech' },
    { id: 'EXP-1002', title: 'Listrik Lift & Koridor Utama', category: 'Listrik Public Area', amount: 120000000, date: '2026-07-12', scope: 'Public Area', description: 'Penerangan & utilitas public lift' },
    { id: 'EXP-1003', title: 'Air PDAM & Izin Sumur', category: 'Tagihan Air PDAM', amount: 50000000, date: '2026-07-05', scope: 'Public Area', description: 'Tagihan air gedung utama' },
    { id: 'EXP-1004', title: 'Gaji Kebersihan & Security', category: 'Gaji Kebersihan & Security', amount: 80000000, date: '2026-07-01', scope: 'Public Area', description: 'Pembayaran periodik staff' }
  ]);

  const handleAddExpense = (newExp) => {
    setExpenses([newExp, ...expenses]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // --- Seed Data States ---
  const [tenants, setTenants] = useState([
    { id: 'TNT-1011', company: 'BlueTech Indonesia, PT', unit: 'Fl. 1 - 1A', leaseStart: '15 Nov 2023', leaseEnd: '15 Nov 2024', dueDate: '15 Nov 2024', rent: 150000000, status: 'Active', payment: 'Paid', initials: 'BT' },
    { id: 'TNT-2041', company: 'Creative Flow Studio', unit: 'Fl. 2 - 2A', leaseStart: '28 Oct 2022', leaseEnd: '28 Oct 2023', dueDate: '28 Oct 2023', rent: 120000000, status: 'Ending Soon', payment: 'Paid', initials: 'CR' },
    { id: 'TNT-3082', company: 'Global Koneksi Mandiri', unit: 'Fl. 3 - 3', leaseStart: '05 Oct 2022', leaseEnd: '05 Oct 2023', dueDate: '05 Oct 2023', rent: 180000000, status: 'Active', payment: 'Late', initials: 'GK' },
    { id: 'TNT-4015', company: 'Sinar Retailindo', unit: 'Fl. GF - Ruang Kerja GF', leaseStart: '12 Sep 2022', leaseEnd: '12 Sep 2023', dueDate: '12 Sep 2023', rent: 90000000, status: 'Expired', payment: 'Paid', initials: 'SR' },
    { id: 'TNT-5021', company: 'Mega Astra Ventura', unit: 'Fl. Mezzanin - Ruang Direksi 1', leaseStart: '01 Dec 2023', leaseEnd: '01 Dec 2024', dueDate: '01 Dec 2024', rent: 250000000, status: 'Active', payment: 'Paid', initials: 'MA' }
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

  // --- Seed Data States for Spaces and Access Cards ---
  const [spaces, setSpaces] = useState([
    // --- Ground Floor ---
    { id: 'SPC-GF01', unit: 'Fl. GF - Ruang Kerja GF', floor: 'GF', area: 150, status: 'Occupied', tenantId: 'TNT-4015', rent: 90000000, wing: 'Ground Floor' },
    // --- Lantai 1 ---
    { id: 'SPC-101', unit: 'Fl. 1 - 1A', floor: '1', area: 120, status: 'Occupied', tenantId: 'TNT-1011', rent: 150000000, wing: 'Unit A' },
    { id: 'SPC-102', unit: 'Fl. 1 - 1B', floor: '1', area: 110, status: 'Available', tenantId: null, rent: 130000000, wing: 'Unit B' },
    { id: 'SPC-103', unit: 'Fl. 1 - 1C', floor: '1', area: 105, status: 'Available', tenantId: null, rent: 120000000, wing: 'Unit C' },
    // --- Lantai 2 ---
    { id: 'SPC-201', unit: 'Fl. 2 - 2A', floor: '2', area: 120, status: 'Occupied', tenantId: 'TNT-2041', rent: 120000000, wing: 'Unit A' },
    { id: 'SPC-202', unit: 'Fl. 2 - 2B', floor: '2', area: 110, status: 'Available', tenantId: null, rent: 115000000, wing: 'Unit B' },
    { id: 'SPC-203', unit: 'Fl. 2 - 2C', floor: '2', area: 105, status: 'Available', tenantId: null, rent: 110000000, wing: 'Unit C' },
    // --- Lantai 3 ---
    { id: 'SPC-301', unit: 'Fl. 3 - 3', floor: '3', area: 350, status: 'Occupied', tenantId: 'TNT-3082', rent: 180000000, wing: 'Full Floor' },
    // --- Mezzanin ---
    { id: 'SPC-MZ1', unit: 'Fl. Mezzanin - Ruang Direksi 1', floor: 'Mezzanin', area: 80, status: 'Occupied', tenantId: 'TNT-5021', rent: 250000000, wing: 'Direksi' },
    { id: 'SPC-MZ2', unit: 'Fl. Mezzanin - Ruang Direksi 2', floor: 'Mezzanin', area: 75, status: 'Available', tenantId: null, rent: 220000000, wing: 'Direksi' },
  ]);

  const [accessCards, setAccessCards] = useState([
    { id: 'CARD-1001', cardNumber: '82019203', tenantId: 'TNT-1011', holderName: 'Ahmad Kurniawan', status: 'Active', assignedDate: '16 Nov 2023', accessLevel: 'Full Access' },
    { id: 'CARD-1002', cardNumber: '82019204', tenantId: 'TNT-1011', holderName: 'Sarah Wijaya', status: 'Active', assignedDate: '16 Nov 2023', accessLevel: 'Staff' },
    { id: 'CARD-2001', cardNumber: '71029384', tenantId: 'TNT-2041', holderName: 'Rian Pratama', status: 'Active', assignedDate: '29 Oct 2022', accessLevel: 'Staff' },
    { id: 'CARD-3001', cardNumber: '62019283', tenantId: 'TNT-3082', holderName: 'Hendra Setiawan', status: 'Active', assignedDate: '06 Oct 2022', accessLevel: 'Full Access' },
    { id: 'CARD-4001', cardNumber: '52019284', tenantId: 'TNT-4015', holderName: 'Siti Rahma', status: 'Suspended', assignedDate: '13 Sep 2022', accessLevel: 'Staff' },
    { id: 'CARD-5001', cardNumber: '42019285', tenantId: 'TNT-5021', holderName: 'Denny Siregar', status: 'Active', assignedDate: '02 Dec 2023', accessLevel: 'VIP' }
  ]);

  // --- Handlers & Actions ---
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Tenants actions
  const handleAddTenant = (newTenant) => {
    setTenants([newTenant, ...tenants]);
    
    // Mark matching space as Occupied
    setSpaces(prevSpaces => 
      prevSpaces.map(sp => sp.unit === newTenant.unit ? { ...sp, status: 'Occupied', tenantId: newTenant.id } : sp)
    );

    setNotifications([
      { id: Date.now(), title: 'New Tenant Registered', message: `${newTenant.company} registered for ${newTenant.unit}.`, type: 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleDeleteTenant = (id) => {
    const deleted = tenants.find(t => t.id === id);
    setTenants(tenants.filter(t => t.id !== id));
    if (deleted) {
      // Mark matching space as Available
      setSpaces(prevSpaces => 
        prevSpaces.map(sp => sp.unit === deleted.unit ? { ...sp, status: 'Available', tenantId: null } : sp)
      );

      // Clean up access cards of this tenant
      setAccessCards(prevCards => 
        prevCards.filter(c => c.tenantId !== id)
      );

      setNotifications([
        { id: Date.now(), title: 'Lease Cancelled', message: `${deleted.company} lease terminated.`, type: 'warning', time: 'Just now', read: false },
        ...notifications
      ]);
    }
  };

  // Access Card Actions
  const handleAssignAccessCard = (newCard) => {
    setAccessCards([newCard, ...accessCards]);
    const tenantName = tenants.find(t => t.id === newCard.tenantId)?.company || 'Tenant';
    setNotifications([
      { id: Date.now(), title: 'Access Card Issued', message: `Card ${newCard.cardNumber} issued to ${newCard.holderName} (${tenantName}).`, type: 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleToggleCardStatus = (cardId) => {
    setAccessCards(accessCards.map(c => 
      c.id === cardId ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } : c
    ));
  };

  const handleRevokeCard = (cardId) => {
    const revoked = accessCards.find(c => c.id === cardId);
    setAccessCards(accessCards.filter(c => c.id !== cardId));
    if (revoked) {
      setNotifications([
        { id: Date.now(), title: 'Access Card Revoked', message: `Card ${revoked.cardNumber} for ${revoked.holderName} was deactivated.`, type: 'warning', time: 'Just now', read: false },
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

  // Spaces actions
  const handleAddSpace = (newSpace) => {
    setSpaces([newSpace, ...spaces]);
    setNotifications([
      { id: Date.now(), title: 'Space Baru Ditambahkan', message: `Unit ${newSpace.unit} (${newSpace.wing}) berhasil ditambahkan ke inventaris.`, type: 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleUpdateSpace = (updatedSpace) => {
    setSpaces(spaces.map(s => s.id === updatedSpace.id ? updatedSpace : s));
    setNotifications([
      { id: Date.now(), title: 'Detail Space Diperbarui', message: `Unit ${updatedSpace.unit} berhasil diperbarui.`, type: 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleDeleteSpace = (spaceId) => {
    const deleted = spaces.find(s => s.id === spaceId);
    if (!deleted) return false;
    
    // Check if space is occupied
    if (deleted.status === 'Occupied') {
      alert('Tidak dapat menghapus space yang sedang aktif disewa (Occupied)! Silakan selesaikan kontrak tenant terlebih dahulu.');
      return false;
    }
    
    setSpaces(spaces.filter(s => s.id !== spaceId));
    setNotifications([
      { id: Date.now(), title: 'Space Dihapus', message: `Unit ${deleted.unit} dihapus dari inventaris.`, type: 'warning', time: 'Just now', read: false },
      ...notifications
    ]);
    return true;
  };

  // User Management Actions
  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    setNotifications([
      { id: Date.now(), title: 'User Baru Ditambahkan', message: `${newUser.name} (${newUser.email}) telah terdaftar di sistem.`, type: 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    setNotifications([
      { id: Date.now(), title: 'Profil Pengguna Diperbarui', message: `Data pengguna ${updatedUser.name} telah diperbarui.`, type: 'info', time: 'Just now', read: false },
      ...notifications
    ]);
  };

  const handleDeleteUser = (userId) => {
    if (currentUser && currentUser.id === userId) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan!');
      return false;
    }
    const deleted = users.find(u => u.id === userId);
    if (!deleted) return false;

    setUsers(users.filter(u => u.id !== userId));
    setNotifications([
      { id: Date.now(), title: 'User Dihapus', message: `Akses untuk user ${deleted.name} telah dicabut.`, type: 'warning', time: 'Just now', read: false },
      ...notifications
    ]);
    return true;
  };

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
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
            spaces={spaces}
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
        return <SecurityCleaningSupervision />;
      case 'expenses':
        return (
          <Expenses
            expenseData={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'reports':
        return <Reports currentUser={currentUser} expenses={expenses} />;
      case 'settings':
        return (
          <Settings 
            tenants={tenants}
            onAddTenant={handleAddTenant}
            onDeleteTenant={handleDeleteTenant}
            spaces={spaces}
            onAddSpace={handleAddSpace}
            onUpdateSpace={handleUpdateSpace}
            onDeleteSpace={handleDeleteSpace}
            accessCards={accessCards}
            onAssignAccessCard={handleAssignAccessCard}
            onToggleCardStatus={handleToggleCardStatus}
            onRevokeCard={handleRevokeCard}
            users={users}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        );
      default:
        return <div className="p-8 text-center text-outline">View not found</div>;
    }
  };

  if (!isLoggedIn) {
    return <Login users={users} onLoginSuccess={handleLogin} />;
  }

  // Render Tenant Portal directly for tenant role
  if (currentUser && currentUser.role === 'role_tenant') {
    return (
      <TenantPortal 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        tickets={tickets}
        onAddTicket={handleAddTicket}
      />
    );
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
          currentUser={currentUser}
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
