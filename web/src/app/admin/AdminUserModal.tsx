'use client';

import React, { useState, useEffect } from 'react';
import { AdminUser, RoleDefinition } from '@/data/partsData';

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: AdminUser) => void;
  userToEdit?: AdminUser | null;
  roles: RoleDefinition[];
}

export default function AdminUserModal({ isOpen, onClose, onSave, userToEdit, roles }: AdminUserModalProps) {
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    roleId: 'store_manager',
    pinCode: '1234',
    active: true
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
    } else {
      setFormData({
        id: `admin-${Date.now()}`,
        name: '',
        email: '',
        roleId: roles[0]?.id || 'store_manager',
        pinCode: '1234',
        active: true,
        lastLogin: 'Nunca'
      });
    }
  }, [userToEdit, isOpen, roles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.pinCode) return;

    const finalUser: AdminUser = {
      id: formData.id || `admin-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      roleId: formData.roleId || 'store_manager',
      pinCode: formData.pinCode,
      active: Boolean(formData.active),
      lastLogin: formData.lastLogin || 'Nunca'
    };

    onSave(finalUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>👤</span> {userToEdit ? 'Editar Operador Admin' : 'Adicionar Operador Admin'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Carlos Silva"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Email de Acesso *</label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="carlos.silva@autoparts.pt"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Cargo / Role *</label>
              <select
                value={formData.roleId || 'store_manager'}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">PIN de Acesso *</label>
              <input
                type="text"
                required
                value={formData.pinCode || ''}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                placeholder="1234"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-center font-bold focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.active)}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
            <span className="font-semibold text-zinc-300">Operador Ativo</span>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/30">
              Gravar Operador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
