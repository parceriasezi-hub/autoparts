'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PartProduct,
  CategoryItem,
  CouponItem,
  CustomerItem,
  RoleDefinition,
  AdminUser,
  StoreSettings,
  PermissionKey
} from '@/data/partsData';
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus,
  DBOrderData,
  fetchCategories,
  saveCategory,
  deleteCategory,
  fetchCoupons,
  saveCoupon,
  deleteCoupon,
  fetchCustomers,
  toggleCustomerStatus,
  fetchRoles,
  saveRole,
  fetchAdminUsers,
  saveAdminUser,
  deleteAdminUser,
  fetchStoreSettings,
  saveStoreSettings,
  hasPermission
} from '@/services/partsService';

import ProductModal from './ProductModal';
import CategoryModal from './CategoryModal';
import CouponModal from './CouponModal';
import AdminUserModal from './AdminUserModal';
import RolePermissionsModal from './RolePermissionsModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin User & Active Role for RBAC
  const [activeAdminUser, setActiveAdminUser] = useState<AdminUser | null>(null);
  const [activeRole, setActiveRole] = useState<RoleDefinition | null>(null);

  // Tabs: 'dashboard' | 'products' | 'categories' | 'customers' | 'coupons' | 'orders' | 'rbac' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'customers' | 'coupons' | 'orders' | 'rbac' | 'settings'>('dashboard');

  // Data states
  const [products, setProducts] = useState<PartProduct[]>([]);
  const [orders, setOrders] = useState<DBOrderData[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    freeShippingMin: 50,
    standardShippingFee: 4.9,
    announcementBanner: '🚚 Portes Grátis em compras superiores a 50€!',
    showBanner: true,
    supportEmail: 'apoio@autoparts.pt',
    supportPhone: '+351 210 998 877',
    storeNif: 'PT509123456',
    storeAddress: 'Maia, Portugal'
  });

  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PartProduct | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  const [isAdminUserModalOpen, setIsAdminUserModalOpen] = useState(false);
  const [editingAdminUser, setEditingAdminUser] = useState<AdminUser | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<DBOrderData | null>(null);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prods, ords, cats, coups, custs, rls, usrList, sttgs] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchCategories(),
        fetchCoupons(),
        fetchCustomers(),
        fetchRoles(),
        fetchAdminUsers(),
        fetchStoreSettings()
      ]);

      setProducts(prods);
      setOrders(ords);
      setCategories(cats);
      setCoupons(coups);
      setCustomers(custs);
      setRoles(rls);
      setAdminUsers(usrList);
      setStoreSettings(sttgs);

      // Auto resolve active admin user session
      const savedUserEmail = localStorage.getItem('autoparts_admin_user_email');
      const foundUser = usrList.find((u) => u.email === savedUserEmail) || usrList[0];
      if (foundUser) {
        setActiveAdminUser(foundUser);
        const userRole = rls.find((r) => r.id === foundUser.roleId) || rls[0];
        setActiveRole(userRole);
      }
    } catch (e) {
      console.error('Failed loading admin suite data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authSession = localStorage.getItem('autoparts_admin_auth');
      if (authSession === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = adminUsers.find((u) => u.pinCode === pinInput.trim() || pinInput.trim() === 'admin123');

    if (matchedUser || pinInput.trim() === 'admin123' || pinInput.trim() === 'admin' || pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      const sessionUser = matchedUser || adminUsers[0] || {
        id: 'admin-1',
        name: 'Super Administrador',
        email: 'admin@autoparts.pt',
        roleId: 'super_admin',
        pinCode: 'admin123',
        active: true
      };

      setActiveAdminUser(sessionUser);
      const userRole = roles.find((r) => r.id === sessionUser.roleId) || roles[0];
      setActiveRole(userRole);

      if (typeof window !== 'undefined') {
        localStorage.setItem('autoparts_admin_auth', 'true');
        localStorage.setItem('autoparts_admin_user_email', sessionUser.email);
      }
      setAuthError('');
    } else {
      setAuthError('PIN / Palavra-passe incorreta. Tente "admin123".');
    }
  };

  const handleSwitchOperator = (user: AdminUser) => {
    setActiveAdminUser(user);
    const r = roles.find((role) => role.id === user.roleId) || roles[0];
    setActiveRole(r);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autoparts_admin_user_email', user.email);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('autoparts_admin_auth');
      localStorage.removeItem('autoparts_admin_user_email');
    }
  };

  const can = (permission: PermissionKey) => {
    return hasPermission(activeRole, permission);
  };

  // Product CRUD
  const handleSaveProduct = async (p: PartProduct) => {
    await saveProduct(p);
    setIsProductModalOpen(false);
    loadAllData();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!can('products:delete')) return alert('Não tem permissão para eliminar produtos.');
    if (confirm(`Eliminar o produto "${name}"?`)) {
      await deleteProduct(id);
      loadAllData();
    }
  };

  // Category CRUD
  const handleSaveCategory = async (c: CategoryItem) => {
    await saveCategory(c);
    setIsCategoryModalOpen(false);
    loadAllData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Eliminar esta categoria?')) {
      await deleteCategory(id);
      loadAllData();
    }
  };

  // Coupon CRUD
  const handleSaveCoupon = async (c: CouponItem) => {
    await saveCoupon(c);
    setIsCouponModalOpen(false);
    loadAllData();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (confirm('Eliminar este cupão de desconto?')) {
      await deleteCoupon(id);
      loadAllData();
    }
  };

  // Customer Actions
  const handleToggleCustomer = async (id: string) => {
    await toggleCustomerStatus(id);
    loadAllData();
  };

  // RBAC Admin Users & Roles
  const handleSaveAdminUser = async (u: AdminUser) => {
    await saveAdminUser(u);
    setIsAdminUserModalOpen(false);
    loadAllData();
  };

  const handleDeleteAdminUser = async (id: string) => {
    if (confirm('Eliminar este utilizador operador?')) {
      await deleteAdminUser(id);
      loadAllData();
    }
  };

  const handleSaveRolePermissions = async (r: RoleDefinition) => {
    await saveRole(r);
    setIsRoleModalOpen(false);
    loadAllData();
  };

  // Store Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStoreSettings(storeSettings);
    alert('Definições da loja guardadas com sucesso!');
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.oeNumber.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.userEmail.toLowerCase().includes(q);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return !searchQuery || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.nif && c.nif.includes(q)) || c.city.toLowerCase().includes(q);
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const lowStockCount = products.filter((p) => p.stockCount <= 5).length;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-orange-600/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            ⚙️
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AutoParts Suite Admin</h1>
          <p className="text-xs text-zinc-400 mt-1 mb-6">Gestão de Peças, Encomendas, Clientes e Permissões RBAC</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Palavra-passe / PIN Admin</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN de acesso (ex: admin123)"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-center text-lg font-mono focus:outline-none focus:border-orange-500 transition-colors"
                autoFocus
              />
              <p className="text-[11px] text-zinc-400 mt-1 text-center">PIN de Acesso Padrão: <code className="text-orange-400 font-bold">admin123</code></p>
            </div>

            {authError && <p className="text-xs text-red-400 bg-red-950/50 border border-red-800/50 rounded-lg py-2 px-3">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Entrar na Plataforma</span> →
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800">
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
            AUTOPARTS <span className="text-xs px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">SUITE ADMIN</span>
          </Link>
        </div>

        {/* Operator & RBAC Switcher Dropdown */}
        <div className="hidden lg:flex items-center gap-3 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
          <div className="text-right">
            <p className="text-xs font-bold text-white leading-tight">{activeAdminUser?.name}</p>
            <p className="text-[10px] text-orange-400 font-semibold">{activeRole?.name}</p>
          </div>
          <select
            value={activeAdminUser?.email || ''}
            onChange={(e) => {
              const u = adminUsers.find((user) => user.email === e.target.value);
              if (u) handleSwitchOperator(u);
            }}
            className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded-lg px-2 py-1 focus:outline-none"
            title="Simular sessão com outro operador RBAC"
          >
            {adminUsers.map((u) => (
              <option key={u.id} value={u.email}>
                {u.name} ({roles.find((r) => r.id === u.roleId)?.name})
              </option>
            ))}
          </select>
        </div>

        {/* Header Right Actions */}
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

      {/* Main Tab Navigation Bar */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 md:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 whitespace-nowrap text-xs font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'dashboard' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
            }`}
          >
            📊 Dashboard
          </button>

          {can('products:read') && (
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'products' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
              }`}
            >
              📦 Produtos ({products.length})
            </button>
          )}

          {can('categories:manage') && (
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'categories' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
              }`}
            >
              🏷️ Categorias ({categories.length})
            </button>
          )}

          {can('customers:read') && (
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'customers' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
              }`}
            >
              👥 Clientes ({customers.length})
            </button>
          )}

          {can('coupons:manage') && (
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'coupons' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
              }`}
            >
              🎟️ Promoções ({coupons.length})
            </button>
          )}

          {can('orders:read') && (
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
              }`}
            >
              📑 Encomendas ({orders.length})
            </button>
          )}

          {can('roles:manage') && (
            <button
              onClick={() => setActiveTab('rbac')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'rbac' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
              }`}
            >
              🛡️ Operadores & Roles ({adminUsers.length})
            </button>
          )}

          {can('settings:manage') && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'settings' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800'
              }`}
            >
              ⚙️ Definições da Loja
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
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

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Encomendas</p>
                    <h3 className="text-2xl font-black text-white mt-1">{orders.length}</h3>
                  </div>
                  <span className="p-3 bg-blue-500/10 text-blue-400 rounded-xl text-xl">🛍️</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-3">
                  {orders.filter((o) => o.status === 'Pendente').length} encomendas pendentes
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Base de Clientes</p>
                    <h3 className="text-2xl font-black text-white mt-1">{customers.length}</h3>
                  </div>
                  <span className="p-3 bg-purple-500/10 text-purple-400 rounded-xl text-xl">👥</span>
                </div>
                <p className="text-[11px] text-purple-400 mt-3 font-semibold">
                  {customers.filter((c) => c.status === 'active').length} contas ativas
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Alertas de Stock</p>
                    <h3 className="text-2xl font-black text-red-400 mt-1">{lowStockCount}</h3>
                  </div>
                  <span className="p-3 bg-red-500/10 text-red-400 rounded-xl text-xl">⚠️</span>
                </div>
                <p className="text-[11px] text-red-400 mt-3 font-semibold">
                  Peças com stock ≤ 5 un.
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡</span> Atalhos de Operação do Sistema
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {can('products:create') && (
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsProductModalOpen(true);
                    }}
                    className="p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-2xl">📦</span>
                    <p className="font-bold text-white text-xs mt-2">+ Novo Produto</p>
                    <p className="text-[10px] text-zinc-400">Adicionar peça ao catálogo</p>
                  </button>
                )}

                {can('categories:manage') && (
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-2xl">🏷️</span>
                    <p className="font-bold text-white text-xs mt-2">+ Nova Categoria</p>
                    <p className="text-[10px] text-zinc-400">Criar secção de peças</p>
                  </button>
                )}

                {can('coupons:manage') && (
                  <button
                    onClick={() => {
                      setEditingCoupon(null);
                      setIsCouponModalOpen(true);
                    }}
                    className="p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-2xl">🎟️</span>
                    <p className="font-bold text-white text-xs mt-2">+ Novo Cupão</p>
                    <p className="text-[10px] text-zinc-400">Criar código de desconto</p>
                  </button>
                )}

                {can('roles:manage') && (
                  <button
                    onClick={() => {
                      setEditingAdminUser(null);
                      setIsAdminUserModalOpen(true);
                    }}
                    className="p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
                  >
                    <span className="text-2xl">🛡️</span>
                    <p className="font-bold text-white text-xs mt-2">+ Operador Admin</p>
                    <p className="text-[10px] text-zinc-400">Novo utilizador com RBAC</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && can('products:read') && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por nome, SKU, OE ou Marca..."
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 w-full sm:w-80"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {can('products:create') && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <span>+</span> Adicionar Novo Produto
                </button>
              )}
            </div>

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
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {p.inStock ? `${p.stockCount} un` : 'Esgotado'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {can('products:edit') && (
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px]"
                              >
                                ✏️ Editar
                              </button>
                            )}
                            {can('products:delete') && (
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 font-semibold text-[11px]"
                              >
                                🗑️
                              </button>
                            )}
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

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && can('categories:manage') && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">🏷️ Gestão de Categorias do Catálogo</h2>
                <p className="text-xs text-zinc-400">Adicione e organize as famílias de peças automóveis</p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg"
              >
                + Nova Categoria
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="p-3 bg-orange-600/10 text-orange-400 rounded-xl text-2xl">🏷️</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="text-xs text-zinc-400 hover:text-white p-1"
                        >
                          ✏️
                        </button>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-xs text-red-400 hover:text-red-300 p-1">
                          🗑️
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-base">{cat.name}</h3>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Slug: /{cat.slug}</p>
                    <p className="text-xs text-zinc-300 mt-2 line-clamp-2">{cat.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-400">
                    <span>Peças associadas:</span>
                    <strong className="text-orange-400">{products.filter((p) => p.category === cat.slug).length} unidades</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === 'customers' && can('customers:read') && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar cliente por nome, email, NIF ou cidade..."
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 w-full sm:w-96"
              />
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Contactos</th>
                      <th className="p-3">NIF / Cidade</th>
                      <th className="p-3">Total Gasto (LTV)</th>
                      <th className="p-3">Encomendas</th>
                      <th className="p-3">Estado da Conta</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-white">{cust.name}</p>
                          <p className="text-[10px] text-zinc-400">Registado a {cust.registeredAt}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-zinc-200">✉️ {cust.email}</p>
                          <p className="text-[10px] text-zinc-400">📞 {cust.phone}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-mono text-zinc-200">NIF: {cust.nif || 'Consumidor Final'}</p>
                          <p className="text-[10px] text-zinc-400">📍 {cust.city}</p>
                        </td>
                        <td className="p-3 font-bold text-emerald-400 text-sm">{cust.totalSpent.toFixed(2)} €</td>
                        <td className="p-3 font-bold text-white">{cust.ordersCount} compras</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${cust.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {cust.status === 'active' ? 'Ativa' : 'Suspensa'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {can('customers:manage') && (
                            <button
                              onClick={() => handleToggleCustomer(cust.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${cust.status === 'active' ? 'bg-red-950/40 text-red-400 hover:bg-red-900/60' : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'}`}
                            >
                              {cust.status === 'active' ? 'Suspender' : 'Reativar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && can('coupons:manage') && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">🎟️ Gestão de Promoções e Cupões</h2>
                <p className="text-xs text-zinc-400">Crie códigos de desconto percentuais ou de valor fixo</p>
              </div>
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setIsCouponModalOpen(true);
                }}
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg"
              >
                + Novo Cupão
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <span className="font-mono font-black text-lg text-orange-400 tracking-wider bg-orange-500/10 px-3 py-1 rounded-xl border border-orange-500/30">
                      {c.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCoupon(c);
                          setIsCouponModalOpen(true);
                        }}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteCoupon(c.id)} className="text-xs text-red-400 hover:text-red-300">
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-zinc-300 font-semibold">
                      Desconto: <strong className="text-white text-sm">{c.discountType === 'percent' ? `${c.discountValue}%` : `${c.discountValue.toFixed(2)} €`}</strong>
                    </p>
                    <p className="text-zinc-400">Subtotal Mínimo: {c.minSubtotal.toFixed(2)} €</p>
                    <p className="text-zinc-400">Validade: {c.expiresAt}</p>
                    <p className="text-zinc-400">Utilizações efetuadas: {c.usageCount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ORDERS */}
        {activeTab === 'orders' && can('orders:read') && (
          <div className="space-y-6 animate-in fade-in duration-300">
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
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">Todos os Estados</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Processamento">Em Processamento</option>
                <option value="Expedida">Expedida</option>
                <option value="Entregue">Entregue</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

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
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id || ord.orderNumber} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-orange-400">{ord.orderNumber}</td>
                        <td className="p-3">
                          <p className="font-bold text-white">{ord.customerName}</p>
                          <p className="text-[10px] text-zinc-400">{ord.userEmail}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-zinc-200">{ord.address}</p>
                          <p className="text-[10px] text-zinc-400">{ord.postalCode} {ord.city}</p>
                        </td>
                        <td className="p-3">{ord.paymentMethod}</td>
                        <td className="p-3 font-bold text-white text-sm">{ord.finalTotal?.toFixed(2)} €</td>
                        <td className="p-3">
                          {can('orders:update_status') ? (
                            <select
                              value={ord.status || 'Expedida'}
                              onChange={async (e) => {
                                await updateOrderStatus(ord.id || ord.orderNumber, e.target.value);
                                loadAllData();
                              }}
                              className="px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 font-bold text-xs text-white"
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Em Processamento">Em Processamento</option>
                              <option value="Expedida">Expedida</option>
                              <option value="Entregue">Entregue</option>
                              <option value="Cancelada">Cancelada</option>
                            </select>
                          ) : (
                            <span className="font-bold text-orange-400">{ord.status}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => setSelectedOrder(ord)} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[11px]">
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

        {/* TAB 7: RBAC ROLES & ADMIN USERS */}
        {activeTab === 'rbac' && can('roles:manage') && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Admin Users Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🛡️</span> Utilizadores Administradores & Operadores
                  </h2>
                  <p className="text-xs text-zinc-400">Atribuição de contas e cargos no painel de gestão</p>
                </div>
                <button
                  onClick={() => {
                    setEditingAdminUser(null);
                    setIsAdminUserModalOpen(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg"
                >
                  + Novo Operador Admin
                </button>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Nome / Operador</th>
                      <th className="p-3">Email de Acesso</th>
                      <th className="p-3">Cargo / Role RBAC</th>
                      <th className="p-3">PIN Acesso</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {adminUsers.map((u) => {
                      const r = roles.find((role) => role.id === u.roleId);
                      return (
                        <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-3 font-bold text-white">{u.name}</td>
                          <td className="p-3 text-zinc-300">{u.email}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20 text-[11px]">
                              {r?.name || u.roleId}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-zinc-400">••••</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${u.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {u.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingAdminUser(u);
                                  setIsAdminUserModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold"
                              >
                                ✏️ Editar
                              </button>
                              <button onClick={() => handleDeleteAdminUser(u.id)} className="px-2 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-[11px]">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Roles Matrix */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white">🔐 Definir Permissões dos Roles (Matriz RBAC)</h3>
                <p className="text-xs text-zinc-400">Configure as permissões de cada função no sistema</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base">{r.name}</h4>
                        <p className="text-xs text-zinc-400">{r.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingRole(r);
                          setIsRoleModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all"
                      >
                        ⚙️ Permissões ({r.permissions?.length || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {activeTab === 'settings' && can('settings:manage') && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-bold text-white">⚙️ Definições Gerais da Loja</h2>
              <p className="text-xs text-zinc-400">Configure limites de portes grátis, banners e dados fiscais</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6 max-w-3xl text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Valor Mínimo para Portes Grátis (€)</label>
                  <input
                    type="number"
                    value={storeSettings.freeShippingMin}
                    onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingMin: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Custo Padrão de Envio (€)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={storeSettings.standardShippingFee}
                    onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Texto do Banner Superior de Anúncio</label>
                <input
                  type="text"
                  value={storeSettings.announcementBanner}
                  onChange={(e) => setStoreSettings({ ...storeSettings, announcementBanner: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Email de Apoio ao Cliente</label>
                  <input
                    type="email"
                    value={storeSettings.supportEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Telefone de Suporte</label>
                  <input
                    type="text"
                    value={storeSettings.supportPhone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30">
                  💾 Gravar Definições
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Modals */}
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={handleSaveProduct} productToEdit={editingProduct} />
      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSave={handleSaveCategory} categoryToEdit={editingCategory} />
      <CouponModal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} onSave={handleSaveCoupon} couponToEdit={editingCoupon} />
      <AdminUserModal isOpen={isAdminUserModalOpen} onClose={() => setIsAdminUserModalOpen(false)} onSave={handleSaveAdminUser} userToEdit={editingAdminUser} roles={roles} />
      <RolePermissionsModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onSave={handleSaveRolePermissions} roleToEdit={editingRole} />

      {/* Order Details Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">📑 Encomenda {selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center">
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <p className="font-bold text-white text-sm">{selectedOrder.customerName}</p>
                <p className="text-zinc-400">✉️ {selectedOrder.userEmail} | 📞 {selectedOrder.phone}</p>
                <p className="text-zinc-300 mt-2">📍 {selectedOrder.address}, {selectedOrder.postalCode} {selectedOrder.city}</p>
              </div>
              <div className="flex justify-between items-center text-sm font-bold border-t border-zinc-800 pt-2">
                <span>Total Final:</span>
                <span className="text-orange-400 text-lg">{selectedOrder.finalTotal?.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
