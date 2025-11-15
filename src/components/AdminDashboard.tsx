import { useState, useEffect } from "react";
import { useApp } from "../lib/AppContext";
import { AdminDashboardOverview } from "./admin/AdminDashboardOverview";
import { AdminUsersManagement } from "./admin/AdminUsersManagement";
import { AdminBlocksManagement } from "./admin/AdminBlocksManagement";
import { AdminLogsViewer } from "./admin/AdminLogsViewer";
import { AdminSettings } from "./admin/AdminSettings";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Settings,
  X,
} from "lucide-react";
import { 
  createUserAccount, 
  getAllUsers, 
  updateUserAccount, 
  deleteUserAccount,
  UserAccount as FirebaseUserAccount 
} from "../lib/firebase";

// Types
type TabType = 'dashboard' | 'users' | 'blocks' | 'logs' | 'settings';

// Use Firebase UserAccount type
type UserAccount = FirebaseUserAccount;

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

interface AdminDashboardProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export function AdminDashboard({ onBack, onLogout }: AdminDashboardProps) {
  const { t, isDarkMode, userEmail } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Edit User Modal State
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editFormName, setEditFormName] = useState('');
  const [editFormEmail, setEditFormEmail] = useState('');
  const [editFormRole, setEditFormRole] = useState('');

  // Edit Block Modal State
  const [showEditBlockModal, setShowEditBlockModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<HostelBlock | null>(null);
  const [blockFormName, setBlockFormName] = useState('');
  const [blockFormRooms, setBlockFormRooms] = useState('');
  const [blockFormWarden, setBlockFormWarden] = useState('');

  // Add Block Modal State
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [addBlockName, setAddBlockName] = useState('');
  const [addBlockRooms, setAddBlockRooms] = useState('');
  const [addBlockWarden, setAddBlockWarden] = useState('');

  // Assign Warden Modal State
  const [showAssignWardenModal, setShowAssignWardenModal] = useState(false);
  const [assigningBlockId, setAssigningBlockId] = useState<string | null>(null);
  const [selectedWarden, setSelectedWarden] = useState('');

  // Firebase Data State
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Load users from Firebase on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        setUsersError(null);
        console.log('🔄 Loading users from Firebase...');
        const users = await getAllUsers();
        console.log('✅ Loaded users:', users);
        
        // Validate user data structure
        const validUsers = users.filter(user => 
          user && 
          typeof user.id === 'string' && 
          user.id.length > 0
        );
        
        console.log('📊 Valid users count:', validUsers.length, 'Total users:', users.length);
        setAccounts(validUsers);
      } catch (error) {
        console.error('❌ Error loading users:', error);
        setUsersError('Failed to load users. Please check your connection and try again.');
        
        // Fallback to demo data to prevent white screen
        const fallbackUsers: UserAccount[] = [
          {
            id: 'demo-admin',
            name: 'Demo Admin',
            email: 'admin@hostel.edu',
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'demo-warden',
            name: 'Demo Warden',
            email: 'warden@hostel.edu',
            role: 'warden',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        console.log('📋 Using fallback demo users');
        setAccounts(fallbackUsers);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

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
    setEditingUser(account);
    setEditFormName(account.name || '');
    setEditFormEmail(account.email || '');
    setEditFormRole(account.role || '');
    setShowEditUserModal(true);
  };

  const handleToggleUserStatus = async (id: string) => {
    try {
      const user = accounts.find(acc => acc.id === id);
      if (!user) return;

      const newStatus = user.status === 'active' ? 'disabled' : 'active';
      
      // Update in Firebase
      await updateUserAccount(id, { status: newStatus });
      
      // Update local state
      setAccounts(prev => prev.map(account => 
        account.id === id 
          ? { ...account, status: newStatus }
          : account
      ));
      
      console.log('User status updated successfully');
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status. Please try again.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      // Delete from Firebase
      await deleteUserAccount(id);
      
      // Update local state
      setAccounts(prev => prev.filter(account => account.id !== id));
      
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const handleAddUser = () => {
    // Open the add user modal
    setShowAddUserModal(true);
  };

  const resetUserForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('');
    setFormPassword('');
  };

  const handleSaveUser = async () => {
    // Validation
    if (!formName.trim()) {
      return;
    }
    
    if (!formEmail.trim()) {
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      return;
    }
    
    // Check if email already exists
    if (accounts.some(acc => acc.email.toLowerCase() === formEmail.trim().toLowerCase())) {
      return;
    }
    
    if (!formRole) {
      return;
    }

    if (!formPassword.trim() || formPassword.trim().length < 6) {
      return;
    }

    try {
      setIsCreatingUser(true);
      
      // Create user with Firebase
      const newUser = await createUserAccount({
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword.trim(),
        role: formRole
      });

      // Add to local accounts list immediately
      setAccounts(prev => {
        console.log('✅ Adding new user to accounts list:', newUser.name);
        console.log('📊 Previous accounts count:', prev.length);
        const updated = [...prev, newUser];
        console.log('📊 Updated accounts count:', updated.length);
        return updated;
      });
      
      // Reset form and close modal
      resetUserForm();
      setShowAddUserModal(false);
      
      console.log('User created successfully:', newUser.email);
      
      // Show success toast
      toast.success('User created successfully!', {
        description: `${newUser.name} has been added to the user management list.`,
        duration: 4000
      });
      
      // Refresh the user list from Firebase to ensure consistency
      try {
        const allUsers = await getAllUsers();
        console.log('🔄 Refreshed user list from Firebase, count:', allUsers.length);
        setAccounts(allUsers);
      } catch (refreshError) {
        console.warn('⚠️ Could not refresh user list, keeping local state');
      }
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user', {
        description: 'Please try again. If the problem persists, check your connection.',
        duration: 4000
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Edit User Functions
  const resetEditUserForm = () => {
    setEditingUser(null);
    setEditFormName('');
    setEditFormEmail('');
    setEditFormRole('');
  };

  const handleSaveEditUser = async () => {
    if (!editingUser) return;

    // Validation
    if (!editFormName.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!editFormEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormEmail.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Check if email already exists (excluding current user)
    if (accounts.some(acc => acc.id !== editingUser.id && acc.email.toLowerCase() === editFormEmail.trim().toLowerCase())) {
      toast.error('Email already exists');
      return;
    }
    
    if (!editFormRole) {
      toast.error('Role is required');
      return;
    }

    try {
      // Update user with Firebase
      await updateUserAccount(editingUser.id, {
        name: editFormName.trim(),
        email: editFormEmail.trim().toLowerCase(),
        role: editFormRole
      });

      // Update local accounts list
      setAccounts(prev => prev.map(account => 
        account.id === editingUser.id 
          ? { ...account, name: editFormName.trim(), email: editFormEmail.trim().toLowerCase(), role: editFormRole }
          : account
      ));
      
      // Reset form and close modal
      resetEditUserForm();
      setShowEditUserModal(false);
      
      console.log('User updated successfully:', editFormEmail);
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  // Block management handlers
  const handleEditBlock = (block: HostelBlock) => {
    setEditingBlock(block);
    setBlockFormName(block.name);
    setBlockFormRooms(block.rooms.toString());
    setBlockFormWarden(block.warden);
    setShowEditBlockModal(true);
  };

  const resetBlockForm = () => {
    setEditingBlock(null);
    setBlockFormName('');
    setBlockFormRooms('');
    setBlockFormWarden('');
  };

  const handleSaveBlock = () => {
    if (!editingBlock) return;

    // Validation
    if (!blockFormName.trim()) {
      return;
    }
    
    if (!blockFormRooms.trim() || isNaN(parseInt(blockFormRooms))) {
      return;
    }

    // Update block
    setBlocks(prev => prev.map(block => 
      block.id === editingBlock.id 
        ? { 
            ...block, 
            name: blockFormName.trim(),
            rooms: parseInt(blockFormRooms),
            warden: blockFormWarden || 'Unassigned'
          }
        : block
    ));

    // Reset form and close modal
    resetBlockForm();
    setShowEditBlockModal(false);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const handleAddBlock = () => {
    setShowAddBlockModal(true);
  };

  const resetAddBlockForm = () => {
    setAddBlockName('');
    setAddBlockRooms('');
    setAddBlockWarden('');
  };

  const handleSaveNewBlock = () => {
    // Validation
    if (!addBlockName.trim()) {
      return;
    }
    
    if (!addBlockRooms.trim() || isNaN(parseInt(addBlockRooms))) {
      return;
    }

    // Generate new ID
    const newId = (Math.max(...blocks.map(block => parseInt(block.id)), 0) + 1).toString();

    // Create new block
    const newBlock: HostelBlock = {
      id: newId,
      name: addBlockName.trim(),
      rooms: parseInt(addBlockRooms),
      warden: addBlockWarden || 'Unassigned',
      status: 'active'
    };

    // Add to blocks list
    setBlocks(prev => [...prev, newBlock]);

    // Reset form and close modal
    resetAddBlockForm();
    setShowAddBlockModal(false);
  };

  const handleAssignWarden = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setAssigningBlockId(blockId);
      setSelectedWarden(block.warden === 'Unassigned' ? '' : block.warden);
      setShowAssignWardenModal(true);
    }
  };

  const resetAssignWardenForm = () => {
    setAssigningBlockId(null);
    setSelectedWarden('');
  };

  const handleSaveWardenAssignment = () => {
    if (!assigningBlockId) return;

    // Update block with new warden
    setBlocks(prev => prev.map(block => 
      block.id === assigningBlockId 
        ? { ...block, warden: selectedWarden || 'Unassigned' }
        : block
    ));

    // Reset form and close modal
    resetAssignWardenForm();
    setShowAssignWardenModal(false);
  };

  // Settings handlers
  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
  };

  const handleChangePassword = () => {
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
        <>
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-[#08796B]/20 border-t-[#08796B] rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
              </div>
            </div>
          ) : usersError ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-red-600 dark:text-red-400">{usersError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#08796B] text-white rounded-lg hover:bg-[#065D52] transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          ) : (
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
        </>
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
            <div className="w-6 h-6 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
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
            <div className="w-6 h-6 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
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
            <div className="w-6 h-6 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
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
            <div className="w-6 h-6 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
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
            <div className="w-6 h-6 flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-xs">{t('settings')}</span>
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="bg-white dark:bg-[#2A2A2A] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#263238] dark:text-white">Add New User</DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create a new user account for the system</p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name Field */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-[#263238] dark:text-white">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-[#08796B] focus:ring-[#08796B]"
              />
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#263238] dark:text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Role Field */}
            <div>
              <Label htmlFor="role" className="text-sm font-medium text-[#263238] dark:text-white">
                Role
              </Label>
              <Select value={formRole} onValueChange={setFormRole}>
                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="warden">Warden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-[#263238] dark:text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetUserForm();
                setShowAddUserModal(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              className="flex-1 bg-[#08796B] hover:bg-[#065D52] text-white"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditUserModal} onOpenChange={setShowEditUserModal}>
        <DialogContent className="bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-[#263238] dark:text-white">Edit User</DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Update user account details</p>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Name Field */}
            <div>
              <Label htmlFor="editUserName" className="text-sm font-medium text-[#263238] dark:text-white">
                Name
              </Label>
              <Input
                id="editUserName"
                placeholder="Enter full name"
                value={editFormName}
                onChange={(e) => setEditFormName(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-[#08796B] focus:ring-[#08796B]"
              />
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="editUserEmail" className="text-sm font-medium text-[#263238] dark:text-white">
                Email
              </Label>
              <Input
                id="editUserEmail"
                type="email"
                placeholder="Enter email address"
                value={editFormEmail}
                onChange={(e) => setEditFormEmail(e.target.value)}
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-[#08796B] focus:ring-[#08796B]"
              />
            </div>

            {/* Role Field */}
            <div>
              <Label htmlFor="editUserRole" className="text-sm font-medium text-[#263238] dark:text-white">
                Role
              </Label>
              <Select value={editFormRole} onValueChange={setEditFormRole}>
                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="warden">Warden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetEditUserForm();
                setShowEditUserModal(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditUser}
              className="flex-1 bg-[#08796B] hover:bg-[#065D52] text-white"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Block Modal */}
      <Dialog open={showEditBlockModal} onOpenChange={setShowEditBlockModal}>
        <DialogContent className="max-w-md mx-auto bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl text-[#263238] dark:text-white">
              Edit Block
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update hostel block information
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="blockName" className="text-sm text-[#263238] dark:text-white">
                Block Name
              </Label>
              <Input
                id="blockName"
                value={blockFormName}
                onChange={(e) => setBlockFormName(e.target.value)}
                placeholder="Enter block name"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="blockRooms" className="text-sm text-[#263238] dark:text-white">
                Number of Rooms
              </Label>
              <Input
                id="blockRooms"
                type="number"
                value={blockFormRooms}
                onChange={(e) => setBlockFormRooms(e.target.value)}
                placeholder="Enter number of rooms"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="blockWarden" className="text-sm text-[#263238] dark:text-white">
                Assigned Warden (Optional)
              </Label>
              <Select value={blockFormWarden} onValueChange={setBlockFormWarden}>
                <SelectTrigger className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  <SelectValue placeholder="Select warden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  {accounts
                    .filter(account => account.role === 'Warden' && account.status === 'active')
                    .map(warden => (
                      <SelectItem key={warden.id} value={warden.name}>
                        {warden.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetBlockForm();
                setShowEditBlockModal(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBlock}
              className="flex-1 bg-[#08796B] hover:bg-[#065D52] text-white"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Block Modal */}
      <Dialog open={showAddBlockModal} onOpenChange={setShowAddBlockModal}>
        <DialogContent className="max-w-md mx-auto bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl text-[#263238] dark:text-white">
              Add New Block
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a new hostel block
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="addBlockName" className="text-sm text-[#263238] dark:text-white">
                Block Name
              </Label>
              <Input
                id="addBlockName"
                value={addBlockName}
                onChange={(e) => setAddBlockName(e.target.value)}
                placeholder="Enter block name"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="addBlockRooms" className="text-sm text-[#263238] dark:text-white">
                Number of Rooms
              </Label>
              <Input
                id="addBlockRooms"
                type="number"
                value={addBlockRooms}
                onChange={(e) => setAddBlockRooms(e.target.value)}
                placeholder="Enter number of rooms"
                className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetAddBlockForm();
                setShowAddBlockModal(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewBlock}
              className="flex-1 bg-[#08796B] hover:bg-[#065D52] text-white"
            >
              Add Block
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Warden Modal */}
      <Dialog open={showAssignWardenModal} onOpenChange={setShowAssignWardenModal}>
        <DialogContent className="max-w-md mx-auto bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl text-[#263238] dark:text-white">
              Assign Warden
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {assigningBlockId && (
                <>Assign a warden to {blocks.find(b => b.id === assigningBlockId)?.name}</>
              )}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="selectWarden" className="text-sm text-[#263238] dark:text-white">
                Select Warden
              </Label>
              <select
                id="selectWarden"
                value={selectedWarden}
                onChange={(e) => setSelectedWarden(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-[#263238] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#08796B] focus:border-[#08796B]"
              >
                <option value="">Choose a warden...</option>
                <option value="">Unassigned</option>
                {accounts
                  .filter(account => account.role === 'Warden' && account.status === 'active')
                  .map(warden => (
                    <option key={warden.id} value={warden.name}>
                      {warden.name}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Current Assignment Info */}
            {assigningBlockId && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current warden: {' '}
                  <span className="font-medium text-[#263238] dark:text-white">
                    {blocks.find(b => b.id === assigningBlockId)?.warden || 'Unassigned'}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetAssignWardenForm();
                setShowAssignWardenModal(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveWardenAssignment}
              className="flex-1 bg-[#08796B] hover:bg-[#065D52] text-white"
            >
              Assign Warden
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}