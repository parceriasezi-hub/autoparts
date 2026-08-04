"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  ShoppingCart, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Car, 
  Wrench, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PRODUCTS, VEHICLE_BRANDS } from '@/data/partsData';
import { useCart } from '@/context/CartContext';

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const product = PRODUCTS.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'oe'>('specs');
  const [addedToast, setAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center text-center p-6">
        <AlertCircle size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produto Não Encontrado</h2>
        <p className="text-gray-500 mb-6">A peça que procura não existe ou já não se encontra no catálogo.</p>
        <Link 
          href="/produtos" 
          className="bg-primary text-white font-bold px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <ChevronRight size={14} />
          <Link href="/produtos" className="hover:text-primary transition-colors">Catálogo</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900 truncate">{product.name}</span>
        </nav>

        {/* Added to Cart Notification Toast */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-primary/50 animate-bounce">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Adicionado ao Carrinho</p>
              <p className="text-sm font-bold">{quantity}x {product.name}</p>
            </div>
          </div>
        )}

        {/* Product Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover" 
                />
                <span className="absolute top-4 left-4 bg-secondary text-white font-black uppercase text-xs px-3 py-1 rounded shadow">
                  {product.brand}
                </span>
                {product.originalPrice && (
                  <span className="absolute top-4 right-4 bg-red-600 text-white font-black text-xs px-3 py-1 rounded shadow">
                    Desconto {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-sm font-bold ml-2">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 text-xs font-normal">({product.reviewsCount} avaliações)</span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-600 mb-6 pb-6 border-b border-gray-100">
                  <span>SKU: <strong className="text-gray-900">{product.sku}</strong></span>
                  <span>|</span>
                  <span>Ref. OE Original: <strong className="text-gray-900">{product.oeNumber}</strong></span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Stock status & delivery */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
                  <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Em stock para envio imediato ({product.stockCount} unidades)</span>
                    <span className="text-xs text-emerald-600 font-normal">Entrega estimada em 24h a 48h úteis em Portugal Continental.</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Add to Cart Box */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-black text-secondary">{product.price.toFixed(2)} €</span>
                  {product.originalPrice && (
                    <span className="text-base text-gray-400 line-through font-semibold">
                      {product.originalPrice.toFixed(2)} €
                    </span>
                  )}
                  <span className="text-xs text-gray-500 font-medium">c/ IVA incluído</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-gray-300 bg-white rounded-lg h-12">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full font-bold text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full font-bold text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold h-12 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base"
                  >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
                <div className="flex flex-col items-center gap-1">
                  <Truck size={20} className="text-primary" />
                  <span className="font-semibold">Envio em 24/48h</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="font-semibold">2 Anos Garantia</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw size={20} className="text-primary" />
                  <span className="font-semibold">30 Dias Devoluções</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Tabs (Specifications / Vehicle Compatibility / OE Numbers) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Tab Header Buttons */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'specs' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Wrench size={18} />Especificações Técnicas
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'compatibility' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <Car size={18} />Veículos Compatíveis ({product.compatibleVehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('oe')}
              className={`flex-1 py-4 text-center font-bold text-sm sm:text-base border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'oe' ? 'border-primary text-primary bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              <FileText size={18} />Referências OE / Cruzadas
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 md:p-8">
            
            {activeTab === 'specs' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Dados Técnicos do Produto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 px-4 bg-gray-50 rounded-lg text-sm">
                      <span className="font-medium text-gray-600">{key}:</span>
                      <span className="font-bold text-gray-900">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 px-4 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium text-gray-600">Fabricante:</span>
                    <span className="font-bold text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-2 px-4 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium text-gray-600">Código SKU:</span>
                    <span className="font-bold text-gray-900">{product.sku}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Lista de Veículos Compatíveis</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Esta peça foi verificada para compatibilidade perfeita com os seguintes modelos automóveis:
                </p>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {product.compatibleVehicles.map((v, idx) => {
                    const brandObj = VEHICLE_BRANDS.find((b) => b.id === v.brandId);
                    const modelObj = brandObj?.models.find((m) => m.id === v.modelId);
                    return (
                      <div key={idx} className="p-4 bg-white flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Car className="text-primary" size={20} />
                          <div>
                            <span className="font-bold text-gray-900 text-sm">
                              {brandObj?.name} {modelObj?.name}
                            </span>
                            <span className="text-xs text-gray-500 block">{v.engine}</span>
                          </div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Check size={12} /> Compatível
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'oe' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Referências OE dos Fabricantes</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Números de peças originais equivalentes de acordo com os dados do fabricante:
                </p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-sm space-y-2">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Referência OE Principal:</span>
                    <span className="font-bold text-secondary">{product.oeNumber}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">SKU Fabricante ({product.brand}):</span>
                    <span className="font-bold text-secondary">{product.sku}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
