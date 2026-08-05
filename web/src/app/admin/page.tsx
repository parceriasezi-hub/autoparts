'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PartProduct } from '@/data/partsData';
import { fetchProducts, saveProduct, deleteProduct, fetchOrders, updateOrderStatus, DBOrderData } from '@/services/partsService';
import ProductModal from './ProductModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  // Data states
  const [products, setProducts] = useState<PartProduct[]>([]);
  const [orders, setOrders] = useState<DBOrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PartProduct | null>(null);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<DBOrderData | null>(null);

  useEffect(() => {
    // Check local storage session
    if (typeof window !== 'undefined') {
      const authSession = localStorage.getItem('autoparts_admin_auth');
      if (authSession === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const prods = await fetchProducts();
      const ords = await fetchOrders();
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === 'admin' || pinInput === '1234') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('autoparts_admin_auth', 'true');
      }
      setAuthError('');
    } else {
      setAuthError('PIN / Palavra-passe incorreta. Tente "admin123".');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('autoparts_admin_auth');
    }
  };

  // Product Actions
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: PartProduct) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (product: PartProduct) => {
    await saveProduct(product);
    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Tem a certeza que deseja eliminar o produto "${name}"?`)) {
      await deleteProduct(id);
      loadData();
    }
  };

  const handleToggleStock = async (prod: PartProduct) => {
    const updated = {
      ...prod,
      inStock: !prod.inStock,
      stockCount: !prod.inStock ? (prod.stockCount > 0 ? prod.stockCount : 10) : 0
    };
    await saveProduct(updated);
    loadData();
  };

  // Order Actions
  const handleStatusChange = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    loadData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  // Calculated Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  // Filtered Lists
  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.oeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesQuery =
      !searchQuery ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesQuery && matchesStatus;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-orange-600/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            ⚙️
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Painel de Administração</h1>
          <p className="text-xs text-zinc-400 mt-1 mb-6">AutoParts — Gestão de Inventário e Encomendas</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Palavra-passe / PIN Admin</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Insira o PIN (ex: admin123)"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-lg font-mono focus:outline-none focus:border-orange-500 transition-colors"
                autoFocus
              />
              <p className="text-[11px] text-zinc-400 mt-1 text-center">PIN de Demonstração: <code className="text-orange-400 font-bold">admin123</code></p>
            </div>

            {authError && <p className="text-xs text-red-400 bg-red-950/50 border border-red-800/50 rounded-lg py-2 px-3">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Entrar no Painel</span> →
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/80">
            <Link href="/" className="text-xs text-zinc-400 hover:text-white transition-colors">
              ← Voltar à Loja Pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-orange-500 font-black text-xl tracking-wider">
            <span className="bg-orange-600 text-white p-1.5 rounded-lg text-sm">AP</span>
            AUTOPARTS <span className="text-xs px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">ADMIN</span>
          </Link>
        </div>

        {/* Tab Navigation Controls */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-950/70 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dashboard' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📊 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'products' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📦 Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📑 Encomendas ({orders.length})
          </button>
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
          >
            🌐 Ver Loja
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-3 py-1.5 rounded-lg border border-red-800/40 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex border-b border-zinc-800 bg-zinc-900 text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'dashboard' ? 'border-orange-500 text-orange-400' : 'border-transparent text-zinc-400'}`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'products' ? 'border-orange-500 text-orange-400' : 'border-transparent text-zinc-400'}`}
        >
          📦 Produtos
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 text-center border-b-2 ${activeTab === 'orders' ? 'border-orange-500 text-orange-400' : 'border-transparent text-zinc-400'}`}
        >
          📑 Encomendas
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Volume Faturado</p>
                    <h3 className="text-2xl font-black text-white mt-1">{totalRevenue.toFixed(2)} €</h3>
                  </div>
                  <span className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-xl">💶</span>
                </div>
                <p className="text-[11px] text-emerald-400 mt-3 flex items-center gap-1 font-semibold">
                  <span>↑</span> Calculado das encomendas processadas
                </p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Encomendas</p>
                    <h3 className="text-2xl font-black text-white mt-1">{totalOrdersCount}</h3>
                  </div>
                  <span className="p-3 bg-blue-500/10 text-blue-400 rounded-xl text-xl">🛍️</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-3 flex items-center gap-1">
                  {orders.filter(o => o.status === 'Pendente').length} encomendas pendentes
                </p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Produtos no Catálogo</p>
                    <h3 className="text-2xl font-black text-white mt-1">{totalProductsCount}</h3>
                  </div>
                  <span className="p-3 bg-orange-500/10 text-orange-400 rounded-xl text-xl">⚙️</span>
                </div>
                <p className="text-[11px] text-orange-400 mt-3 font-semibold">
                  {products.filter(p => p.inStock).length} disponíveis em stock
                </p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Alertas de Stock Baixo</p>
                    <h3 className="text-2xl font-black text-red-400 mt-1">{lowStockProducts.length}</h3>
                  </div>
                  <span className="p-3 bg-red-500/10 text-red-400 rounded-xl text-xl">⚠️</span>
                </div>
                <p className="text-[11px] text-red-400 mt-3 font-semibold">
                  Peças com stock igual ou inferior a 5 un.
                </p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>📑</span> Últimas Encomendas Recebidas
                  </h2>
                  <p className="text-xs text-zinc-400">Resumo das vendas recentes e estados de envio</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
                >
                  Ver Todas →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-8">Nenhuma encomenda registada até ao momento.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="p-3">N.º Encomenda</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Data</th>
                        <th className="p-3">Pagamento</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id || ord.orderNumber} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-orange-400">{ord.orderNumber}</td>
                          <td className="p-3">
                            <p className="font-bold text-white">{ord.customerName}</p>
                            <p className="text-[10px] text-zinc-400">{ord.userEmail}</p>
                          </td>
                          <td className="p-3 text-zinc-400">{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('pt-PT') : 'Hoje'}</td>
                          <td className="p-3">{ord.paymentMethod}</td>
                          <td className="p-3 font-bold text-white">{ord.finalTotal?.toFixed(2)} €</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ord.status === 'Entregue' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              ord.status === 'Expedida' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              ord.status === 'Em Processamento' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-zinc-800 text-zinc-300'
                            }`}>
                              {ord.status || 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Low Stock Warning Box */}
            {lowStockProducts.length > 0 && (
              <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
                  <span>⚠️</span> Necessitam de Reabastecimento Urgente (Stock Crítico)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-zinc-950" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-zinc-400">SKU: {p.sku}</p>
                      </div>
                      <span className="bg-red-600/30 text-red-400 font-bold text-xs px-2 py-1 rounded-lg border border-red-500/40">
                        {p.stockCount} un
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Action Bar */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por nome, SKU, N.º OE ou Marca..."
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 w-full sm:w-80"
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="travoes">Travões</option>
                  <option value="filtros">Filtros</option>
                  <option value="oleos">Óleos e Fluidos</option>
                  <option value="eletricidade">Eletricidade</option>
                </select>
              </div>

              <button
                onClick={handleOpenCreate}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <span>+</span> Adicionar Novo Produto
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Produto</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Marca OEM</th>
                      <th className="p-3">SKU / OE</th>
                      <th className="p-3">Preço (€)</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-zinc-950 border border-zinc-800 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-xs">{p.name}</p>
                              <p className="text-[10px] text-zinc-400 line-clamp-1">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 text-[10px] font-semibold">
                            {p.categoryLabel || p.category}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-orange-400">{p.brand}</td>
                        <td className="p-3 font-mono text-[11px]">
                          <div>SKU: {p.sku}</div>
                          <div className="text-zinc-400 text-[10px]">OE: {p.oeNumber}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-white text-sm">{p.price.toFixed(2)} €</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-zinc-400 line-through block">{p.originalPrice.toFixed(2)} €</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              p.inStock
                                ? p.stockCount <= 5
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                            title="Clique para alterar disponibilidade em stock"
                          >
                            {p.inStock ? `${p.stockCount} em stock` : 'Esgotado'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px] transition-colors"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 font-semibold text-[11px] border border-red-800/30 transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Filter Bar */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por N.º de encomenda, Cliente ou Email..."
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 w-full sm:w-80"
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 w-full sm:w-auto"
              >
                <option value="all">Todos os Estados</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Processamento">Em Processamento</option>
                <option value="Expedida">Expedida</option>
                <option value="Entregue">Entregue</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Encomenda</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Morada / Cidade</th>
                      <th className="p-3">Pagamento</th>
                      <th className="p-3">Total (€)</th>
                      <th className="p-3">Estado da Encomenda</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id || ord.orderNumber} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-orange-400">
                          {ord.orderNumber}
                          <span className="block text-[10px] text-zinc-400 font-normal">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('pt-PT') : 'Hoje'}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-white">{ord.customerName}</p>
                          <p className="text-[10px] text-zinc-400">{ord.userEmail}</p>
                          <p className="text-[10px] text-zinc-400">{ord.phone}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-zinc-200">{ord.address}</p>
                          <p className="text-[10px] text-zinc-400">{ord.postalCode} {ord.city}</p>
                        </td>
                        <td className="p-3 font-medium">
                          {ord.paymentMethod}
                          <span className="block text-[10px] text-zinc-400">{ord.shippingMethod}</span>
                        </td>
                        <td className="p-3 font-bold text-white text-sm">{ord.finalTotal?.toFixed(2)} €</td>
                        <td className="p-3">
                          <select
                            value={ord.status || 'Expedida'}
                            onChange={(e) => handleStatusChange(ord.id || ord.orderNumber, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-950 border border-zinc-700 focus:outline-none focus:border-orange-500 ${
                              ord.status === 'Entregue' ? 'text-emerald-400' :
                              ord.status === 'Expedida' ? 'text-blue-400' :
                              ord.status === 'Em Processamento' ? 'text-amber-400' :
                              ord.status === 'Cancelada' ? 'text-red-400' :
                              'text-zinc-300'
                            }`}
                          >
                            <option value="Pendente">Pendente</option>
                            <option value="Em Processamento">Em Processamento</option>
                            <option value="Expedida">Expedida</option>
                            <option value="Entregue">Entregue</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px] transition-colors"
                          >
                            👁️ Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Product Create/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📑</span> Detalhes da Encomenda <span className="text-orange-400">{selectedOrder.orderNumber}</span>
                </h3>
                <p className="text-xs text-zinc-400">Efetuada em {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('pt-PT') : 'Hoje'}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <p className="font-bold text-white text-sm">{selectedOrder.customerName}</p>
                <p className="text-zinc-400">✉️ {selectedOrder.userEmail} | 📞 {selectedOrder.phone}</p>
                {selectedOrder.nif && <p className="text-zinc-400">NIF: {selectedOrder.nif}</p>}
                <p className="text-zinc-300 mt-2">📍 {selectedOrder.address}, {selectedOrder.postalCode} {selectedOrder.city}</p>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                <p className="font-bold text-zinc-300">Produtos Encomendados:</p>
                {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 ? (
                  <div className="space-y-1">
                    {selectedOrder.cartItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-800/50 last:border-0">
                        <span>{item.quantity}x {item.productName} <span className="text-zinc-400 font-mono text-[10px]">({item.productSku})</span></span>
                        <span className="font-bold text-white">{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 italic">Itens incluídos no resumo do carrinho.</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 text-sm font-bold border-t border-zinc-800">
                <span>Total Final Pagamento ({selectedOrder.paymentMethod}):</span>
                <span className="text-orange-400 text-lg">{selectedOrder.finalTotal?.toFixed(2)} €</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
