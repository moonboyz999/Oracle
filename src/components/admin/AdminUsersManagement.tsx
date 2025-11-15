import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Search, Users, Edit2, Trash2, XCircle, CheckCircle2, Plus } from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { UserAccount } from '../../lib/firebase';

interface AdminUsersManagementProps {
  accounts: UserAccount[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEditUser: (account: UserAccount) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onAddUser: () => void;
}

export function AdminUsersManagement({
  accounts,
  searchQuery,
  setSearchQuery,
  onEditUser,
  onToggleUserStatus,
  onDeleteUser,
  onAddUser
}: AdminUsersManagementProps) {
  const { t } = useApp();

  const filteredAccounts = accounts.filter(account =>
    (account.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (account.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('manageUserAccounts')}</h1>
        <p className="text-white/70 text-sm">Create, edit, and manage user access</p>
      </div>

      {/* Search Bar */}
      <div className="px-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t('searchUsers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 rounded-xl h-12"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="px-6 space-y-3">
        {filteredAccounts.length === 0 ? (
          <Card className="p-8 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </Card>
        ) : (
          filteredAccounts.map((account) => (
            <Card key={account.id} className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#263238] dark:text-white mb-1">{account.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{account.email || 'No email'}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-[#08796B]/10 dark:bg-[#08796B]/20 text-[#08796B] dark:text-[#B2DFB8] rounded-lg">
                      {account.role || 'No role'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      account.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {account.status === 'active' ? t('active') : t('disabled')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditUser(account)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => onToggleUserStatus(account.id)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    {account.status === 'active' ? (
                      <XCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteUser(account.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add User FAB */}
      <button
        onClick={onAddUser}
        className="fixed bottom-24 right-6 bg-[#08796B] hover:bg-[#065D52] text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all z-10"
      >
        <Plus className="w-6 h-6" />
        <span className="pr-2">Add User</span>
      </button>
    </div>
  );
}