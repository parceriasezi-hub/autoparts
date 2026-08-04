"use client";

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Check, ShoppingCart, Star, Car, X, ChevronRight } from 'lucide-react';
import { PRODUCTS, VEHICLE_BRANDS, PartProduct } from '@/data/partsData';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
import { useCart } from '@/context/CartContext';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const initialQuery = searchParams.get('q') || '';
  const initialPlate = searchParams.get('plate') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialModel = searchParams.get('model') || '';
  const initialEngine = searchParams.get('engine') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating'>('relevance');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Vehicle info lookup if filtered
  const vehicleInfo = useMemo(() => {
    if (initialPlate) {
      return { title: `Matrícula: ${initialPlate}`, subtitle: 'Viatura identificada via registo' };
    }
    if (initialBrand) {
      const brandObj = VEHICLE_BRANDS.find((b) => b.id === initialBrand);
      const modelObj = brandObj?.models.find((m) => m.id === initialModel);
      if (brandObj) {
        return {
          title: `${brandObj.name} ${modelObj ? modelObj.name : ''}`,
          subtitle: initialEngine || 'Todas as motorizações'
        };
      }
    }
    return null;
  }, [initialPlate, initialBrand, initialModel, initialEngine]);

  // Unique brand list from products
  const availableBrands = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map((p) => p.brand)));
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesOe = product.oeNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesSku && !matchesOe) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // In Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Vehicle compatibility filter if selected
      if (initialBrand) {
        const isCompatible = product.compatibleVehicles.some((v) => {
          if (v.brandId !== initialBrand) return false;
          if (initialModel && v.modelId !== initialModel) return false;
          if (initialEngine && v.engine !== initialEngine) return false;
          return true;
        });
        if (!isCompatible) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchTerm, selectedCategory, selectedBrand, inStockOnly, initialBrand, initialModel, initialEngine, sortBy]);

  const handleAddToCart = (product: PartProduct) => {
    addToCart(product, 1);
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900">Catálogo de Peças</span>
        </nav>

        {/* Added to Cart Notification Banner */}
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

        {/* Vehicle Selection Header (If Active) */}
        {vehicleInfo && (
          <div className="bg-secondary text-white rounded-2xl p-6 mb-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-primary">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Car size={28} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Viatura Selecionada</span>
                <h1 className="text-2xl font-black">{vehicleInfo.title}</h1>
                <p className="text-sm text-gray-300">{vehicleInfo.subtitle}</p>
              </div>
            </div>
            <Link 
              href="/produtos" 
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors w-fit"
            >
              <X size={16} /> Limpar Seleção de Veículo
            </Link>
          </div>
        )}

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Filter size={20} className="text-primary" />
                  <span>Filtros de Pesquisa</span>
                </div>
                {(selectedCategory !== 'all' || selectedBrand !== 'all' || inStockOnly || searchTerm) && (
                  <button 
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setInStockOnly(false);
                      setSearchTerm('');
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Text Search Input inside sidebar */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Palavra-Chave</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ref. OE, nome, marca..."
                    className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md py-2 px-3 pr-8 focus:outline-none focus:border-primary text-gray-900"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Categorias</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left text-sm py-2 px-3 rounded-md font-medium transition-colors flex justify-between items-center ${selectedCategory === 'all' ? 'bg-primary text-white font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <span>Todas as Categorias</span>
                    <span className="text-xs opacity-75">({PRODUCTS.length})</span>
                  </button>
                  {[
                    { id: 'travoes', name: 'Travões' },
                    { id: 'filtros', name: 'Filtros' },
                    { id: 'oleos', name: 'Óleos e Fluidos' },
                    { id: 'eletricidade', name: 'Eletricidade' },
                  ].map((cat) => {
                    const count = PRODUCTS.filter((p) => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left text-sm py-2 px-3 rounded-md font-medium transition-colors flex justify-between items-center ${selectedCategory === cat.id ? 'bg-primary text-white font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Marca do Fabricante</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md p-2.5 text-gray-900 font-medium focus:border-primary"
                >
                  <option value="all">Todas as marcas</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Stock Filter Toggle */}
              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-800">Apenas em Stock</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Results Column */}
          <main className="lg:col-span-3">
            
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 font-medium">
                A mostrar <span className="font-bold text-gray-900">{filteredProducts.length}</span> produtos disponíveis
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs font-bold rounded-md p-2 focus:ring-primary focus:border-primary w-full sm:w-auto"
                >
                  <option value="relevance">Mais Relevantes</option>
                  <option value="price-asc">Preço: Mais Baixo</option>
                  <option value="price-desc">Preço: Mais Alto</option>
                  <option value="rating">Melhor Avaliado</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum produto encontrado</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  Tente alterar os termos de pesquisa ou remover os filtros aplicados.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setInStockOnly(false);
                  }}
                  className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Ver Todos os Produtos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden flex flex-col transition-all group"
                  >
                    {/* Product Image & Badges */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Top Badges */}
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

                      {/* Stock Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
                          <Check size={12} /> Em Stock ({product.stockCount})
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-1">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                        </div>

                        {/* Title */}
                        <Link href={`/produtos/${product.id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-2 leading-snug">
                            {product.name}
                          </h3>
                        </Link>

                        {/* OE Number & SKU */}
                        <p className="text-xs text-gray-500 font-mono mb-4">
                          SKU: <span className="font-bold text-gray-700">{product.sku}</span> | Ref. OE: <span className="font-bold text-gray-700">{product.oeNumber}</span>
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-secondary">{product.price.toFixed(2)} €</span>
                            {product.originalPrice && (
                              <span className="text-xs text-gray-400 line-through font-semibold">
                                {product.originalPrice.toFixed(2)} €
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 block font-medium">IVA Incluído</span>
                        </div>

                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-primary hover:bg-orange-600 text-white p-3 rounded-xl shadow hover:shadow-lg transition-all active:scale-95 flex items-center justify-center"
                          title="Adicionar ao Carrinho"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">A carregar catálogo...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
