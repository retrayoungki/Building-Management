import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
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

// ── Loading Screen ────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background flex-col gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      <p className="text-sm font-semibold text-on-surface-variant">Memuat data dari database...</p>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ── Data States ───────────────────────────────────────────
  const [tenants, setTenants] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [accessCards, setAccessCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [visitors, setVisitors] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'HVAC Temp Spike Alert', message: 'Zone 5 temperature reached 27.2°C (Warning)', type: 'warning', time: '10 min ago', read: false },
    { id: 2, title: 'Water Leak Triggered', message: 'Basement 2 leak sensor 4B detected fluid presence.', type: 'danger', time: '1 hr ago', read: false },
    { id: 3, title: 'Weekly Load Test Scheduled', message: 'Generator weekly load test commences today at 22:00.', type: 'info', time: '3 hr ago', read: true }
  ]);

  // ── Fetch All Data from Supabase ──────────────────────────
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        { data: tenantsData },
        { data: ticketsData },
        { data: expensesData },
        { data: spacesData },
        { data: cardsData },
        { data: usersData },
        { data: visitorsData },
      ] = await Promise.all([
        supabase.from('tenants').select('*').order('created_at', { ascending: true }),
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('spaces').select('*').order('created_at', { ascending: true }),
        supabase.from('access_cards').select('*').order('created_at', { ascending: true }),
        supabase.from('system_users').select('*').order('created_at', { ascending: true }),
        supabase.from('visitors').select('*').order('created_at', { ascending: false }),
      ]);

      if (tenantsData) setTenants(tenantsData);
      if (ticketsData) setTickets(ticketsData.map(t => ({ ...t, timeText: t.time_text, sparepartNote: t.sparepart_note })));
      if (expensesData) setExpenses(expensesData);
      if (spacesData) setSpaces(spacesData.map(s => ({ ...s, tenantId: s.tenant_id })));
      if (cardsData) setAccessCards(cardsData.map(c => ({ ...c, cardNumber: c.card_number, tenantId: c.tenant_id, holderName: c.holder_name, assignedDate: c.assigned_date, accessLevel: c.access_level })));
      if (usersData) setUsers(usersData);
      if (visitorsData) setVisitors(visitorsData.map(v => ({ ...v, checkIn: v.check_in, checkOut: v.check_out })));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ── Notifications ─────────────────────────────────────────
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const addNotification = (title, message, type = 'info') => {
    setNotifications(prev => [
      { id: Date.now(), title, message, type, time: 'Just now', read: false },
      ...prev
    ]);
  };

  // ── TENANTS CRUD ──────────────────────────────────────────
  const handleAddTenant = async (newTenant) => {
    const { error } = await supabase.from('tenants').insert([newTenant]);
    if (error) { console.error(error); return; }

    // Mendukung multiple unit: pisahkan unit dengan koma
    const units = newTenant.unit.split(',').map(u => u.trim());
    
    // Update status occupied untuk semua unit terkait di spaces
    await Promise.all(
      units.map(unitName => 
        supabase.from('spaces')
          .update({ status: 'Occupied', tenant_id: newTenant.id })
          .eq('unit', unitName)
      )
    );

    addNotification('New Tenant Registered', `${newTenant.company} registered for ${newTenant.unit}.`);
    fetchAllData();
  };

  const handleDeleteTenant = async (id) => {
    const { error } = await supabase.from('tenants').delete().eq('id', id);
    if (error) { console.error(error); return; }

    // Bebaskan semua unit (spaces) yang memiliki tenant_id ini
    await supabase.from('spaces')
      .update({ status: 'Available', tenant_id: null })
      .eq('tenant_id', id);
      
    await supabase.from('access_cards').delete().eq('tenant_id', id);
    addNotification('Lease Cancelled', `Lease terminated for tenant.`, 'warning');
    
    fetchAllData();
  };

  // ── ACCESS CARDS CRUD ─────────────────────────────────────
  const handleAssignAccessCard = async (newCard) => {
    const dbCard = {
      id: newCard.id,
      card_number: newCard.cardNumber,
      tenant_id: newCard.tenantId,
      holder_name: newCard.holderName,
      status: newCard.status,
      assigned_date: newCard.assignedDate,
      access_level: newCard.accessLevel,
    };
    const { error } = await supabase.from('access_cards').insert([dbCard]);
    if (error) { console.error(error); return; }
    const tenantName = tenants.find(t => t.id === newCard.tenantId)?.company || 'Tenant';
    addNotification('Access Card Issued', `Card ${newCard.cardNumber} issued to ${newCard.holderName} (${tenantName}).`);
    fetchAllData();
  };

  const handleToggleCardStatus = async (cardId) => {
    const card = accessCards.find(c => c.id === cardId);
    if (!card) return;
    const newStatus = card.status === 'Active' ? 'Suspended' : 'Active';
    await supabase.from('access_cards').update({ status: newStatus }).eq('id', cardId);
    fetchAllData();
  };

  const handleRevokeCard = async (cardId) => {
    const revoked = accessCards.find(c => c.id === cardId);
    const { error } = await supabase.from('access_cards').delete().eq('id', cardId);
    if (error) { console.error(error); return; }
    if (revoked) addNotification('Access Card Revoked', `Card ${revoked.card_number || revoked.cardNumber} for ${revoked.holder_name || revoked.holderName} was deactivated.`, 'warning');
    fetchAllData();
  };

  // ── TICKETS CRUD ──────────────────────────────────────────
  const handleAddTicket = async (newTicket) => {
    const dbTicket = {
      id: newTicket.id,
      title: newTicket.title,
      category: newTicket.category,
      priority: newTicket.priority,
      status: newTicket.status,
      location: newTicket.location,
      reporter: newTicket.reporter,
      description: newTicket.description,
      date: newTicket.date,
      assignee: newTicket.assignee,
      time_text: newTicket.timeText,
      sparepart_note: newTicket.sparepartNote || null,
    };
    const { error } = await supabase.from('tickets').insert([dbTicket]);
    if (error) { console.error(error); return; }
    addNotification('New Ticket Opened', `[${newTicket.priority}] ${newTicket.title}`, newTicket.priority === 'Urgent' ? 'danger' : 'info');
    fetchAllData();
  };

  const handleUpdateTicketStatus = async (id, newStatus) => {
    await supabase.from('tickets').update({ status: newStatus }).eq('id', id);
    fetchAllData();
  };

  const handleAssignTechnician = async (id, techName) => {
    const ticket = tickets.find(t => t.id === id);
    const newStatus = ticket && ticket.status === 'New' ? 'In Progress' : ticket?.status;
    await supabase.from('tickets').update({ assignee: techName, status: newStatus }).eq('id', id);
    fetchAllData();
  };

  // ── VISITORS CRUD ─────────────────────────────────────────
  const handleAddVisitor = async (newVis) => {
    const dbVis = {
      id: newVis.id,
      name: newVis.name,
      host: newVis.host,
      purpose: newVis.purpose,
      check_in: newVis.checkIn || '--:--',
      check_out: newVis.checkOut || '--:--',
      status: newVis.status,
      date: newVis.date,
    };
    const { error } = await supabase.from('visitors').insert([dbVis]);
    if (error) { console.error(error); return; }
    fetchAllData();
  };

  const handleCheckInVisitor = async (id) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    await supabase.from('visitors').update({ status: 'Checked In', check_in: timeNow }).eq('id', id);
    fetchAllData();
  };

  const handleCheckOutVisitor = async (id) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    await supabase.from('visitors').update({ status: 'Checked Out', check_out: timeNow }).eq('id', id);
    fetchAllData();
  };

  // ── SPACES CRUD ───────────────────────────────────────────
  const handleAddSpace = async (newSpace) => {
    const dbSpace = {
      id: newSpace.id,
      unit: newSpace.unit,
      floor: newSpace.floor,
      area: newSpace.area,
      status: newSpace.status,
      tenant_id: newSpace.tenantId || null,
      rent: newSpace.rent,
      wing: newSpace.wing,
    };
    const { error } = await supabase.from('spaces').insert([dbSpace]);
    if (error) { console.error(error); return; }
    addNotification('Space Baru Ditambahkan', `Unit ${newSpace.unit} berhasil ditambahkan ke inventaris.`);
    fetchAllData();
  };

  const handleUpdateSpace = async (updatedSpace) => {
    const dbSpace = {
      unit: updatedSpace.unit,
      floor: updatedSpace.floor,
      area: updatedSpace.area,
      status: updatedSpace.status,
      tenant_id: updatedSpace.tenantId || null,
      rent: updatedSpace.rent,
      wing: updatedSpace.wing,
    };
    const { error } = await supabase.from('spaces').update(dbSpace).eq('id', updatedSpace.id);
    if (error) { console.error(error); return; }
    addNotification('Detail Space Diperbarui', `Unit ${updatedSpace.unit} berhasil diperbarui.`);
    fetchAllData();
  };

  const handleDeleteSpace = async (spaceId) => {
    const deleted = spaces.find(s => s.id === spaceId);
    if (!deleted) return false;
    if (deleted.status === 'Occupied') {
      alert('Tidak dapat menghapus space yang sedang aktif disewa (Occupied)! Silakan selesaikan kontrak tenant terlebih dahulu.');
      return false;
    }
    const { error } = await supabase.from('spaces').delete().eq('id', spaceId);
    if (error) { console.error(error); return false; }
    addNotification('Space Dihapus', `Unit ${deleted.unit} dihapus dari inventaris.`, 'warning');
    fetchAllData();
    return true;
  };

  // ── EXPENSES CRUD ─────────────────────────────────────────
  const handleAddExpense = async (newExp) => {
    const { error } = await supabase.from('expenses').insert([newExp]);
    if (error) { console.error(error); return; }
    addNotification('Biaya Baru Ditambahkan', `${newExp.title} (${newExp.category}) sebesar Rp ${newExp.amount.toLocaleString('id-ID')}.`);
    fetchAllData();
  };

  const handleDeleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) { console.error(error); return; }
    fetchAllData();
  };

  // ── USERS CRUD ────────────────────────────────────────────
  const handleAddUser = async (newUser) => {
    const { error } = await supabase.from('system_users').insert([newUser]);
    if (error) { console.error(error); return; }
    addNotification('User Baru Ditambahkan', `${newUser.name} (${newUser.email}) telah terdaftar di sistem.`);
    fetchAllData();
  };

  const handleUpdateUser = async (updatedUser) => {
    const { error } = await supabase.from('system_users').update(updatedUser).eq('id', updatedUser.id);
    if (error) { console.error(error); return; }
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    addNotification('Profil Pengguna Diperbarui', `Data pengguna ${updatedUser.name} telah diperbarui.`);
    fetchAllData();
  };

  const handleDeleteUser = async (userId) => {
    if (currentUser && currentUser.id === userId) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan!');
      return false;
    }
    const deleted = users.find(u => u.id === userId);
    if (!deleted) return false;
    const { error } = await supabase.from('system_users').delete().eq('id', userId);
    if (error) { console.error(error); return false; }
    addNotification('User Dihapus', `Akses untuk user ${deleted.name} telah dicabut.`, 'warning');
    fetchAllData();
    return true;
  };

  // ── AUTH ──────────────────────────────────────────────────
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  // ── Router ────────────────────────────────────────────────
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

  // ── Loading State ─────────────────────────────────────────
  if (isLoading) return <LoadingScreen />;

  // ── Login Gate ────────────────────────────────────────────
  if (!isLoggedIn) {
    return <Login users={users} onLoginSuccess={handleLogin} />;
  }

  // ── Tenant Portal ─────────────────────────────────────────
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
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-y-auto p-gutter bg-background">
          <div className="max-w-[container-max] mx-auto w-full">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}
