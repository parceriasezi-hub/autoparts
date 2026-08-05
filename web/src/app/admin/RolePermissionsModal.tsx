'use client';

import React, { useState, useEffect } from 'react';
import { RoleDefinition, PermissionKey } from '@/data/partsData';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: RoleDefinition) => void;
  roleToEdit?: RoleDefinition | null;
}

const ALL_PERMISSIONS: { key: PermissionKey; label: string; group: string }[] = [
  { key: 'products:read', label: 'Consultar Peças & Catálogo', group: 'Produtos & Stock' },
  { key: 'products:create', label: 'Adicionar Novas Peças', group: 'Produtos & Stock' },
  { key: 'products:edit', label: 'Editar Peças, Preços e Stocks', group: 'Produtos & Stock' },
  { key: 'products:delete', label: 'Eliminar Peças do Catálogo', group: 'Produtos & Stock' },
  
  { key: 'orders:read', label: 'Consultar Encomendas', group: 'Encomendas' },
  { key: 'orders:update_status', label: 'Atualizar Estados de Envio', group: 'Encomendas' },
  
  { key: 'categories:manage', label: 'Gerir Categorias do Catálogo', group: 'Catálogo' },
  { key: 'coupons:manage', label: 'Gerir Cupões e Promoções', group: 'Promoções' },
  
  { key: 'customers:read', label: 'Consultar Lista de Clientes', group: 'Clientes' },
  { key: 'customers:manage', label: 'Gerir/Bloquear Contas de Clientes', group: 'Clientes' },
  
  { key: 'roles:manage', label: 'Gerir Operadores Admin & RBAC Permissões', group: 'Segurança & RBAC' },
  { key: 'settings:manage', label: 'Alterar Definições Globais da Loja', group: 'Definições' },
];

export default function RolePermissionsModal({ isOpen, onClose, onSave, roleToEdit }: RolePermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionKey[]>([]);

  useEffect(() => {
    if (roleToEdit) {
      setSelectedPermissions(roleToEdit.permissions || []);
    }
  }, [roleToEdit, isOpen]);

  if (!isOpen || !roleToEdit) return null;

  const handleToggle = (perm: PermissionKey) => {
    if (roleToEdit.isSystem && roleToEdit.id === 'super_admin') {
      alert('O cargo Super Admin possui sempre todas as permissões ativas por razões de segurança.');
      return;
    }

    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRole: RoleDefinition = {
      ...roleToEdit,
      permissions: selectedPermissions
    };
    onSave(updatedRole);
  };

  // Group permissions
  const groups = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.group)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🛡️</span> Permissões Granulares: <span className="text-orange-400">{roleToEdit.name}</span>
            </h3>
            <p className="text-xs text-zinc-400">{roleToEdit.description}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs max-h-[60vh] overflow-y-auto pr-1">
          {groups.map((groupName) => (
            <div key={groupName} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
              <h4 className="font-bold text-orange-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span>⚡</span> {groupName}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_PERMISSIONS.filter((p) => p.group === groupName).map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.key);
                  return (
                    <label
                      key={perm.key}
                      onClick={() => handleToggle(perm.key)}
                      className={`p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                        isChecked ? 'bg-orange-600/10 border-orange-500/50 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-zinc-700 bg-zinc-800 text-orange-600 focus:ring-0"
                      />
                      <span className="font-semibold text-xs">{perm.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/30">
              Gravar Permissões do Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
