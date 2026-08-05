'use client';

import React, { useState, useEffect } from 'react';
import { CategoryItem } from '@/data/partsData';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: CategoryItem) => void;
  categoryToEdit?: CategoryItem | null;
}

export default function CategoryModal({ isOpen, onClose, onSave, categoryToEdit }: CategoryModalProps) {
  const [formData, setFormData] = useState<Partial<CategoryItem>>({
    name: '',
    slug: '',
    iconName: 'Disc',
    description: ''
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData(categoryToEdit);
    } else {
      setFormData({
        id: `cat-${Date.now()}`,
        slug: '',
        name: '',
        iconName: 'Disc',
        description: '',
        productCount: 0
      });
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalCat: CategoryItem = {
      id: formData.id || `cat-${Date.now()}`,
      slug,
      name: formData.name,
      iconName: formData.iconName || 'Disc',
      description: formData.description || '',
      productCount: formData.productCount || 0
    };

    onSave(finalCat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🏷️</span> {categoryToEdit ? 'Editar Categoria' : 'Criar Nova Categoria'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Nome da Categoria *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
              placeholder="Ex: Suspensão e Amortecedores"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Slug URL</label>
            <input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="ex: suspensao-amortecedores"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Ícone</label>
            <select
              value={formData.iconName || 'Disc'}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Disc">🛞 Travões / Disco</option>
              <option value="Filter">⚙️ Filtros</option>
              <option value="Droplet">💧 Óleos / Fluidos</option>
              <option value="Zap">⚡ Eletricidade / Bateria</option>
              <option value="Wrench">🔧 Ferramentas / Suspensão</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Descrição</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve resumo dos componentes desta categoria..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-600/30">
              Gravar Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
