"use client";

import { useState } from 'react';
import Hero from '@/components/Hero';
import { 
  Settings, 
  Droplet, 
  Zap, 
  CircleDashed, 
  ShoppingCart, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Wrench, 
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS, PartProduct } from '@/data/partsData';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const { addToCart } = useCart();
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories = [
    { name: 'Travões', icon: CircleDashed, href: '/produtos?category=travoes', count: '14,200+ peças' },
    { name: 'Filtros', icon: Settings, href: '/produtos?category=filtros', count: '9,800+ peças' },
    { name: 'Óleos e Fluidos', icon: Droplet, href: '/produtos?category=oleos', count: '3,400+ produtos' },
    { name: 'Eletricidade', icon: Zap, href: '/produtos?category=eletricidade', count: '11,500+ peças' },
  ];

  const featuredDeals = PRODUCTS.filter((p) => p.originalPrice);

  const handleAddToCart = (product: PartProduct) => {
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const oemBrands = [
    { name: 'Brembo', logo: 'BREMBO', desc: 'Sistemas de travagem de alta performance' },
    { name: 'Bosch', logo: 'BOSCH', desc: 'Tecnologia automóvel e componentes elétricos' },
    { name: 'Mann-Filter', logo: 'MANN', desc: 'Filtragem OEM de qualidade alemã' },
    { name: 'Castrol', logo: 'CASTROL', desc: 'Lubrificantes e óleos de alta lubrificação' },
    { name: 'NGK', logo: 'NGK', desc: 'Velas de ignição e incandescência de precisão' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-primary/50 animate-bounce">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Adicionado ao Carrinho</p>
            <p className="text-sm font-bold truncate max-w-xs">{addedToast}</p>
          </div>
        </div>
      )}

      {/* Main Hero Widget */}
      <Hero />
      
      {/* Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Categorias em Destaque</span>
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight">Explore por Categoria</h2>
          </div>
          <Link href="/produtos" className="mt-4 sm:mt-0 text-sm font-bold text-primary hover:underline flex items-center gap-1">
            Ver todas as categorias <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.href}
              className="bg-white border border-gray-200 hover:border-primary transition-all rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 group shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-inner">
                <cat.icon size={32} />
              </div>
              <div>
                <span className="font-bold text-gray-900 block text-base group-hover:text-primary transition-colors">{cat.name}</span>
                <span className="text-xs text-gray-500 mt-0.5 block font-medium">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Deals & Promotions Grid */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-1">Oportunidades Limitadas</span>
              <h2 className="text-3xl font-black text-secondary uppercase tracking-tight flex items-center gap-2">
                Peças em Promoção OEM 🔥
              </h2>
            </div>
            <Link href="/produtos" className="mt-4 sm:mt-0 text-sm font-bold text-primary hover:underline flex items-center gap-1">
              Ver todas as ofertas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDeals.map((product) => (
              <div 
                key={product.id}
                className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
              >
                <div className="relative h-48 bg-white overflow-hidden p-4">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="bg-secondary text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                      {product.brand}
                    </span>
                    {product.originalPrice && (
                      <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        - {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                    </div>

                    <Link href={`/produtos/${product.id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-[11px] text-gray-500 font-mono mb-4">Ref. OE: {product.oeNumber}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xl font-black text-secondary block">{product.price.toFixed(2)} €</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through font-semibold">
                          {product.originalPrice.toFixed(2)} €
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary hover:bg-orange-600 text-white p-2.5 rounded-xl shadow transition-all active:scale-95 flex items-center justify-center"
                      title="Adicionar ao Carrinho"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OEM Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Fabricantes Oficiais</span>
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tight">Marcas OEM Garantidas</h2>
          <p className="text-gray-500 text-sm mt-2">Trabalhamos diretamente com os principais fornecedores de peças originais.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {oemBrands.map((b, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center hover:border-primary transition-all shadow-sm">
              <span className="text-xl font-black text-secondary italic tracking-widest mb-1">{b.logo}</span>
              <p className="text-xs text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Guarantees Banner */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4">
                <Truck size={28} />
              </div>
              <h3 className="text-lg font-bold mb-1">Envio Expresso 24h/48h</h3>
              <p className="text-gray-400 text-xs">Entregas rápidas em Portugal Continental via CTT Express.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-lg font-bold mb-1">Garantia OEM 2 Anos</h3>
              <p className="text-gray-400 text-xs">Todas as peças são de fabricantes certificados de primeiro equipamento.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4">
                <RotateCcw size={28} />
              </div>
              <h3 className="text-lg font-bold mb-1">30 Dias para Devolução</h3>
              <p className="text-gray-400 text-xs">Se a peça não servir na sua viatura, efetuamos a troca sem complicações.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4">
                <Wrench size={28} />
              </div>
              <h3 className="text-lg font-bold mb-1">Apoio Técnico em Peças</h3>
              <p className="text-gray-400 text-xs">Equipa especializada pronta para validar a referência OE do seu veículo.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
