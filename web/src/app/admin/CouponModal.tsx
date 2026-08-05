'use client';

import React, { useState, useEffect } from 'react';
import { CouponItem } from '@/data/partsData';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: CouponItem) => void;
  couponToEdit?: CouponItem | null;
}

export default function CouponModal({ isOpen, onClose, onSave, couponToEdit }: CouponModalProps) {
  const [formData, setFormData] = useState<Partial<CouponItem>>({
    code: '',
    discountType: 'percent',
    discountValue: 10,
    minSubtotal: 0,
    active: true,
    expiresAt: '2026-12-31'
  });

  useEffect(() => {
    if (couponToEdit) {
      setFormData(couponToEdit);
    } else {
      setFormData({
        id: `coup-${Date.now()}`,
        code: `VALE${Math.floor(10 + Math.random() * 90)}`,
        discountType: 'percent',
        discountValue: 10,
        minSubtotal: 30,
        active: true,
        expiresAt: '2026-12-31',
        usageCount: 0
      });
    }
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) return;

    const finalCoupon: CouponItem = {
      id: formData.id || `coup-${Date.now()}`,
      code: formData.code.toUpperCase().trim(),
      discountType: formData.discountType || 'percent',
      discountValue: Number(formData.discountValue),
      minSubtotal: Number(formData.minSubtotal || 0),
      active: Boolean(formData.active),
      expiresAt: formData.expiresAt || '2026-12-31',
      usageCount: formData.usageCount || 0
    };

    onSave(finalCoupon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🎟️</span> {couponToEdit ? 'Editar Cupão de Desconto' : 'Criar Novo Cupão'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Código do Cupão *</label>
            <input
              type="text"
              required
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="Ex: AUTO10"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono uppercase font-bold focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Tipo de Desconto</label>
              <select
                value={formData.discountType || 'percent'}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="percent">Percentagem (%)</option>
                <option value="fixed">Valor Fixo (€)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Valor do Desconto *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.discountValue || ''}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                placeholder="10"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Subtotal Mínimo (€)</label>
              <input
                type="number"
                value={formData.minSubtotal ?? 0}
                onChange={(e) => setFormData({ ...formData, minSubtotal: parseFloat(e.target.value) || 0 })}
                placeholder="30"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Data de Validade</label>
              <input
                type="date"
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
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
            <span className="font-semibold text-zinc-300">Cupão Ativo para Utilização</span>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/30">
              Gravar Cupão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
