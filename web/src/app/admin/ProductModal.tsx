'use client';

import React, { useState, useEffect } from 'react';
import { PartProduct, VEHICLE_BRANDS } from '@/data/partsData';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: PartProduct) => void;
  productToEdit?: PartProduct | null;
}

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<PartProduct>>({
    name: '',
    category: 'travoes',
    categoryLabel: 'Travões',
    brand: '',
    price: 0,
    originalPrice: undefined,
    sku: '',
    oeNumber: '',
    inStock: true,
    stockCount: 10,
    image: '/products/brake_pads.png',
    description: '',
    specs: { 'Garantia': '2 Anos OEM' }
  });

  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData({
        id: `p-${Date.now()}`,
        name: '',
        category: 'travoes',
        categoryLabel: 'Travões',
        brand: 'Brembo',
        price: 39.99,
        originalPrice: 49.99,
        rating: 5.0,
        reviewsCount: 1,
        sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
        oeNumber: 'OE-12345678',
        inStock: true,
        stockCount: 15,
        image: '/products/brake_pads.png',
        description: 'Peça de reposição automóvel de alta qualidade com certificação de fabricante OEM.',
        specs: { 'Origem': 'Alemanha', 'Garantia': '2 Anos' },
        compatibleVehicles: [
          { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' }
        ]
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (cat: 'travoes' | 'filtros' | 'oleos' | 'eletricidade') => {
    const labels: Record<string, string> = {
      travoes: 'Travões',
      filtros: 'Filtros',
      oleos: 'Óleos e Fluidos',
      eletricidade: 'Eletricidade'
    };
    const defaultImages: Record<string, string> = {
      travoes: '/products/brake_pads.png',
      filtros: '/products/oil_filter.png',
      oleos: '/products/engine_oil.png',
      eletricidade: '/products/car_battery.png'
    };
    setFormData((prev) => ({
      ...prev,
      category: cat,
      categoryLabel: labels[cat] || cat,
      image: prev.image || defaultImages[cat]
    }));
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...(prev.specs || {}),
        [specKey.trim()]: specVal.trim()
      }
    }));
    setSpecKey('');
    setSpecVal('');
  };

  const handleRemoveSpec = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...(prev.specs || {}) };
      delete newSpecs[key];
      return { ...prev, specs: newSpecs };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.sku) {
      alert('Por favor preencha todos os campos obrigatórios (Nome, Preço e SKU).');
      return;
    }

    const finalProduct: PartProduct = {
      id: formData.id || `p-${Date.now()}`,
      name: formData.name || '',
      category: formData.category || 'travoes',
      categoryLabel: formData.categoryLabel || 'Travões',
      brand: formData.brand || 'Brembo',
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      rating: formData.rating || 5.0,
      reviewsCount: formData.reviewsCount || 1,
      sku: formData.sku || '',
      oeNumber: formData.oeNumber || 'OE-0000',
      inStock: Boolean(formData.inStock),
      stockCount: Number(formData.stockCount || 0),
      image: formData.image || '/products/brake_pads.png',
      description: formData.description || '',
      specs: formData.specs || {},
      compatibleVehicles: formData.compatibleVehicles || []
    };

    onSave(finalProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-orange-500">🛠️</span>
              {productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h2>
            <p className="text-xs text-zinc-400">Preencha as informações detalhadas para o catálogo da AutoParts</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* General Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome do Produto *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Jogo de Pastilhas de Travão Dianteiras Brembo"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoria *</label>
              <select
                value={formData.category || 'travoes'}
                onChange={(e) => handleCategoryChange(e.target.value as any)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="travoes">Travões</option>
                <option value="filtros">Filtros</option>
                <option value="oleos">Óleos e Fluidos</option>
                <option value="eletricidade">Eletricidade</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Marca / Fabricante OEM *</label>
              <input
                type="text"
                required
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Ex: Brembo, Bosch, Castrol, Mann"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Preço (€) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="42.90"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Preço Anterior (€) (Opcional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice || ''}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || undefined })}
                placeholder="55.00"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Código SKU *</label>
              <input
                type="text"
                required
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ex: BRM-P85126"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Número OE de Referência *</label>
              <input
                type="text"
                required
                value={formData.oeNumber || ''}
                onChange={(e) => setFormData({ ...formData, oeNumber: e.target.value })}
                placeholder="Ex: 5Q0 698 151"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Quantidade em Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stockCount ?? 10}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0;
                  setFormData({ ...formData, stockCount: count, inStock: count > 0 });
                }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.inStock)}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
              <span className="text-xs font-semibold text-zinc-300">Disponível para Venda Impartilhada</span>
            </div>
          </div>

          {/* Image & Description */}
          <div className="space-y-4 pt-2 border-t border-zinc-800">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Caminho / URL da Imagem</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/products/brake_pads.png ou https://..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
              <p className="text-[11px] text-zinc-400 mt-1">Imagens locais predefinidas disponíveis: `/products/brake_pads.png`, `/products/brake_disc.png`, `/products/oil_filter.png`, `/products/air_filter.png`, `/products/engine_oil.png`, `/products/car_battery.png`</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Descrição Técnica</label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva as especificações do produto, compatibilidade e características principais..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Dynamic Technical Specs */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Especificações Técnicas Personalizadas</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Chave (Ex: Diâmetro)"
                className="w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-xs"
              />
              <input
                type="text"
                value={specVal}
                onChange={(e) => setSpecVal(e.target.value)}
                placeholder="Valor (Ex: 312 mm)"
                className="w-1/2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 rounded-lg transition-colors"
              >
                + Adicionar
              </button>
            </div>

            {formData.specs && Object.keys(formData.specs).length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(formData.specs).map(([k, v]) => (
                  <div key={k} className="bg-zinc-800/80 px-3 py-1.5 rounded-md flex justify-between items-center text-xs">
                    <span className="text-zinc-400">{k}: <strong className="text-white">{v}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(k)}
                      className="text-red-400 hover:text-red-300 font-bold ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition-colors flex items-center gap-2"
            >
              <span>💾</span> Save Product
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
