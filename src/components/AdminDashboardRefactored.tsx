import { useState } from "react";
import { useApp } from "../lib/AppContext";
import { AdminDashboardOverview } from "./admin/AdminDashboardOverview";
import { AdminUsersManagement } from "./admin/AdminUsersManagement";
import { AdminBlocksManagement } from "./admin/AdminBlocksManagement";
import { AdminLogsViewer } from "./admin/AdminLogsViewer";
import { AdminSettings } from "./admin/AdminSettings";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { UserAccount } from "../lib/firebase";

// Types
type TabType = 'dashboard' | 'users' | 'blocks' | 'logs' | 'settings';

interface HostelBlock {
  id: string;
  name: string;
  rooms: number;
  warden: string;
  status: 'active' | 'inactive';
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  status: 'success' | 'warning' | 'error';
}

interface MaintenanceLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  status: 'completed' | 'pending' | 'in-progress';
  room?: string;
  block?: string;
  issueType?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  reportType?: 'warden' | 'system' | 'technician';
}

interface AdminDashboardRefactoredProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export function AdminDashboardRefactored({ onBack, onLogout }: AdminDashboardRefactoredProps) {
  const { t, isDarkMode, userEmail } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Sample data - in real app this would come from props or API
  const [accounts, setAccounts] = useState<UserAccount[]>([
    { 
      id: '1', 
      name: 'Ahmad Bin Ali', 
      email: 'ahmad@hostel.edu', 
      role: 'Warden', 
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: '2', 
      name: 'Sarah Tan', 
      email: 'sarah@hostel.edu', 
      role: 'Warden', 
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: '3', 
      name: 'Chen Wei', 
      email: 'chen@hr.edu', 
      role: 'HR', 
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: '4', 
      name: 'Kumar Raj', 
      email: 'kumar@hostel.edu', 
      role: 'Warden', 
      status: 'disabled',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);

  const [blocks, setBlocks] = useState<HostelBlock[]>([
    { id: '1', name: 'Block A', rooms: 48, warden: 'Ahmad Bin Ali', status: 'active' },
    { id: '2', name: 'Block B', rooms: 52, warden: 'Sarah Tan', status: 'active' },
    { id: '3', name: 'Block C', rooms: 36, warden: 'Kumar Raj', status: 'inactive' },
    { id: '4', name: 'Block D', rooms: 44, warden: 'Unassigned', status: 'active' },
  ]);

  const activityLogs: ActivityLog[] = [
    { id: '1', timestamp: '2:45 PM - Oct 29', action: 'Admin created new Warden account', performedBy: 'Admin01', status: 'success' },
    { id: '2', timestamp: '2:30 PM - Oct 29', action: 'HR exported monthly report', performedBy: 'HR Chen', status: 'success' },
    { id: '3', timestamp: '1:15 PM - Oct 29', action: 'Warden resolved alert in Room 315', performedBy: 'Warden Ahmad', status: 'success' },
    { id: '4', timestamp: '12:50 PM - Oct 29', action: 'System error occurred', performedBy: 'System', status: 'error' },
    { id: '5', timestamp: '11:22 AM - Oct 29', action: 'New block assigned to warden', performedBy: 'Admin01', status: 'success' },
  ];

  const maintenanceLogs: MaintenanceLog[] = [
    { 
      id: '1', 
      timestamp: '8:15 PM - Oct 31', 
      action: 'Broken outlet reported', 
      performedBy: 'Warden Ahmad', 
      status: 'pending',
      room: 'Room 104',
      block: 'Block A',
      issueType: 'brokenOutlet',
      priority: 'high',
      description: 'Outlet 3 not working, sparking observed',
      reportType: 'warden'
    },
    { 
      id: '2', 
      timestamp: '3:20 PM - Oct 30', 
      action: 'Electrical issue reported', 
      performedBy: 'Warden Sarah', 
      status: 'in-progress',
      room: 'Room 215',
      block: 'Block B',
      issueType: 'electricalIssue',
      priority: 'urgent',
      description: 'Frequent circuit breaker trips',
      reportType: 'warden'
    },
    { 
      id: '3', 
      timestamp: '10:30 AM - Oct 29', 
      action: 'Maintenance completed', 
      performedBy: 'Maintenance Team', 
      status: 'completed',
      room: 'Room 103',
      block: 'Block A',
      reportType: 'technician'
    },
  ];

  const stats = {
    totalWardens: accounts.filter(a => a.role === 'Warden' && a.status === 'active').length,
    totalHR: accounts.filter(a => a.role === 'HR' && a.status === 'active').length,
    totalAlerts: 145,
    activeDevices: 186,
    totalHostels: blocks.length,
    offlineDevices: 3,
  };

  const monthlyAlertsData = [
    { month: 'Jan', alerts: 12 },
    { month: 'Feb', alerts: 19 },
    { month: 'Mar', alerts: 15 },
    { month: 'Apr', alerts: 23 },
    { month: 'May', alerts: 18 },
    { month: 'Jun', alerts: 25 },
  ];

  // Event handlers
  const handleEditUser = (account: UserAccount) => {
    toast.info(`Edit user: ${account.name}`);
    // TODO: Implement edit user functionality
  };

  const handleToggleUserStatus = (id: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === id 
        ? { ...account, status: account.status === 'active' ? 'disabled' : 'active' }
        : account
    ));
    toast.success('User status updated');
  };

  const handleDeleteUser = (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
    toast.success('User deleted');
  };

  const handleAddUser = () => {
    toast.info('Add user functionality');
    // TODO: Implement add user functionality
  };

  // Block management handlers
  const handleEditBlock = (block: HostelBlock) => {
    toast.info(`Edit block: ${block.name}`);
    // TODO: Implement edit block functionality
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    toast.success('Block deleted successfully');
  };

  const handleAddBlock = () => {
    toast.info('Add block functionality');
    // TODO: Implement add block functionality
  };

  const handleAssignWarden = (blockId: string) => {
    toast.info('Assign warden functionality');
    // TODO: Implement assign warden functionality
  };

  // Settings handlers
  const handleEditProfile = () => {
    toast.info('Edit profile functionality');
    // TODO: Implement edit profile functionality
  };

  const handleChangePassword = () => {
    toast.info('Change password functionality');
    // TODO: Implement change password functionality
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'}`}>
      {/* Content based on active tab */}
      {activeTab === 'dashboard' && (
        <AdminDashboardOverview
          stats={stats}
          monthlyAlertsData={monthlyAlertsData}
          activityLogs={activityLogs}
          userEmail={userEmail}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsersManagement
          accounts={accounts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onEditUser={handleEditUser}
          onToggleUserStatus={handleToggleUserStatus}
          onDeleteUser={handleDeleteUser}
          onAddUser={handleAddUser}
        />
      )}

      {activeTab === 'blocks' && (
        <AdminBlocksManagement
          blocks={blocks}
          onEditBlock={handleEditBlock}
          onDeleteBlock={handleDeleteBlock}
          onAddBlock={handleAddBlock}
          onAssignWarden={handleAssignWarden}
        />
      )}

      {activeTab === 'logs' && (
        <AdminLogsViewer
          activityLogs={activityLogs}
          maintenanceLogs={maintenanceLogs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      )}

      {activeTab === 'settings' && (
        <AdminSettings
          onEditProfile={handleEditProfile}
          onChangePassword={handleChangePassword}
          onLogout={onLogout || (() => {})}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2A2A2A] border-t border-[#E0E0E0] dark:border-gray-700 px-2 py-2 safe-area-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-xs">{t('dashboard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'users'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">{t('users')}</span>
          </button>

          <button
            onClick={() => setActiveTab('blocks')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'blocks'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs">{t('blocks')}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'logs'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8]'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs">{t('settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}