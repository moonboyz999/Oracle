import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  CheckCircle2, 
  XCircle,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';

interface HostelBlock {
  id: string;
  name: string;
  rooms: number;
  warden: string;
  status: 'active' | 'inactive';
}

interface AdminBlocksManagementProps {
  blocks: HostelBlock[];
  onEditBlock: (block: HostelBlock) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: () => void;
  onAssignWarden: (blockId: string) => void;
}

export function AdminBlocksManagement({
  blocks,
  onEditBlock,
  onDeleteBlock,
  onAddBlock,
  onAssignWarden
}: AdminBlocksManagementProps) {
  const { t, isDarkMode } = useApp();

  const getWardenStatusColor = (warden: string) => {
    if (warden === 'Unassigned') {
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
    }
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  };

  const getBlockStatusIcon = (status: string) => {
    return status === 'active' ? (
      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
    );
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-[#08796B] dark:bg-[#065D52] text-white px-6 py-6 rounded-b-3xl">
        <h1 className="text-2xl mb-1">{t('hostelBlocks')}</h1>
        <p className="text-white/70 text-sm">Manage hostel blocks and room assignments</p>
      </div>

      {/* Summary Cards */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#08796B]/10 dark:bg-[#08796B]/20 rounded-xl">
                <Building2 className="w-5 h-5 text-[#08796B] dark:text-[#B2DFB8]" />
              </div>
              <div>
                <p className="text-2xl text-[#263238] dark:text-white">{blocks.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Blocks</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl text-[#263238] dark:text-white">
                  {blocks.reduce((sum, block) => sum + block.rooms, 0)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Rooms</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="px-6 space-y-4">
        {blocks.map((block) => (
          <Card key={block.id} className="p-5 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#08796B]/10 dark:bg-[#08796B]/20 rounded-xl">
                  <Building2 className="w-6 h-6 text-[#08796B] dark:text-[#B2DFB8]" />
                </div>
                <div>
                  <h3 className="text-[#263238] dark:text-white text-lg mb-1">{block.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{block.rooms} rooms</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getBlockStatusIcon(block.status)}
                <span className={`text-xs px-2 py-1 rounded-lg ${
                  block.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {block.status === 'active' ? t('active') : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Warden:</span>
                <span className={`text-xs px-2 py-1 rounded-lg ${getWardenStatusColor(block.warden)}`}>
                  {block.warden}
                </span>
              </div>

              <div className="flex gap-2">
                {block.warden === 'Unassigned' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAssignWarden(block.id)}
                    className="text-xs"
                  >
                    Assign Warden
                  </Button>
                )}
                <button
                  onClick={() => onEditBlock(block)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onDeleteBlock(block.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            {/* Room Distribution */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Room Capacity: {block.rooms} rooms total</span>
              </div>
              <div className="mx-auto max-w-xs">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-[#08796B] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (block.rooms / 60) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span>0</span>
                  <span>60</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {blocks.length === 0 && (
          <Card className="p-8 bg-white dark:bg-[#2A2A2A] border-[#E0E0E0] dark:border-gray-700 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">No blocks found</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Add your first hostel block to get started</p>
          </Card>
        )}
      </div>

      {/* Add Block FAB */}
      <button
        onClick={onAddBlock}
        className="fixed bottom-24 right-6 bg-[#08796B] hover:bg-[#065D52] text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all z-10"
      >
        <Plus className="w-6 h-6" />
        <span className="pr-2">Add Block</span>
      </button>
    </div>
  );
}