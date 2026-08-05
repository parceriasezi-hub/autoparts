"use client";

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Search, Menu, X, Trash2, ArrowRight, Car, Check, Plus, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useGarage, SavedVehicle } from '@/context/GarageContext';
import { useAuth } from '@/context/AuthContext';

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Navbar() {
  const mounted = useMounted();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  
  const router = useRouter();
  const { cart, totalCount, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { savedVehicles, activeVehicle, setActiveVehicle } = useGarage();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/produtos');
    }
  };

  const handleSwitchVehicle = (vehicle: SavedVehicle) => {
    setActiveVehicle(vehicle);
    setIsVehicleModalOpen(false);
    router.push(`/produtos?brand=${vehicle.brandId}&model=${vehicle.modelId}&engine=${encodeURIComponent(vehicle.engine)}`);
  };

  return (
    <>
      {/* Top Garage Active Bar */}
      {mounted && activeVehicle && (
        <div className="bg-neutral-900 text-xs py-1.5 px-3 text-gray-300 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 text-[11px] whitespace-nowrap">
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Car size={13} className="text-primary shrink-0" />
              <strong className="text-white font-bold truncate">{activeVehicle.brandName} {activeVehicle.modelName}</strong>
              {activeVehicle.plate && (
                <span className="bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold shrink-0">
                  {activeVehicle.plate}
                </span>
              )}
            </div>
            
            <button 
              onClick={() => setIsVehicleModalOpen(true)}
              className="text-primary hover:text-orange-400 font-bold text-[11px] flex items-center gap-1 shrink-0 bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded transition-colors"
            >
              <span>Trocar</span>
              <span className="text-[10px] text-gray-400">({savedVehicles.length})</span>
            </button>
          </div>
        </div>
      )}

      <nav className="bg-secondary text-secondary-foreground sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black text-primary italic tracking-wider">AUTO</span>
                <span className="text-2xl font-black text-white italic tracking-wider">PARTS</span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl px-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por n.º de artigo, código de motor ou nome..." 
                  className="w-full bg-white text-black px-4 py-2 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400 text-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-0 top-0 h-full bg-primary hover:bg-orange-600 px-4 rounded-r-md transition-colors flex items-center justify-center"
                >
                  <Search size={20} className="text-white" />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
              <Link href="/produtos" className="hidden lg:flex items-center text-sm font-semibold hover:text-primary transition-colors">
                Ver Catálogo
              </Link>

              <Link href="/admin" className="hidden lg:flex items-center text-xs font-bold text-orange-400 hover:text-orange-300 bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-md transition-colors">
                ⚙️ Admin
              </Link>

              {mounted && user?.isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link 
                    href="/conta"
                    className="flex flex-col items-center hover:text-primary transition-colors"
                  >
                    <User size={24} className="text-primary" />
                    <span className="text-xs mt-1 font-bold">Olá, {user.name.split(' ')[0]}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    title="Terminar Sessão"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="hidden md:flex flex-col items-center hover:text-primary transition-colors"
                >
                  <User size={24} />
                  <span className="text-xs mt-1">Entrar</span>
                </Link>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center hover:text-primary transition-colors relative"
              >
                <ShoppingCart size={24} />
                <span className="text-xs mt-1">Carrinho</span>
                {mounted && totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                    {totalCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:text-primary"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar peças..." 
                className="w-full bg-white text-black px-4 py-2 pr-10 rounded-md text-sm focus:outline-none"
              />
              <button type="submit" className="absolute right-0 top-0 h-full bg-primary px-3 rounded-r-md text-white">
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-neutral-900 border-t border-neutral-800 px-4 py-3 space-y-3">
            <Link 
              href="/produtos" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-white font-medium py-2 hover:text-primary"
            >
              Catálogo de Peças
            </Link>
            <Link 
              href="/conta" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-white font-medium py-2 hover:text-primary"
            >
              A Minha Garagem / Conta
            </Link>
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-orange-400 font-bold py-2 hover:text-orange-300"
            >
              ⚙️ Painel de Administração
            </Link>
          </div>
        )}
      </nav>

      {/* Quick Vehicle Switcher Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Car className="text-primary" size={24} />
                <h3 className="font-bold text-gray-900 text-lg">Trocar Viatura Ativa</h3>
              </div>
              <button 
                onClick={() => setIsVehicleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Selecione o veículo para filtrar instantaneamente todas as peças compatíveis no catálogo.
            </p>

            <div className="space-y-3 mb-6">
              {savedVehicles.map((vehicle) => {
                const isSelected = activeVehicle?.id === vehicle.id;
                return (
                  <div 
                    key={vehicle.id}
                    onClick={() => handleSwitchVehicle(vehicle)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'border-primary bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">
                        {vehicle.brandName} {vehicle.modelName}
                      </span>
                      <span className="text-xs text-gray-500 block">{vehicle.engine}</span>
                      {vehicle.plate && (
                        <span className="text-[10px] font-mono font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                          {vehicle.plate}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <span className="bg-primary text-white p-1 rounded-full">
                        <Check size={16} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <Link 
                href="/conta" 
                onClick={() => setIsVehicleModalOpen(false)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Adicionar Novo Veículo à Garagem
              </Link>
              <button 
                onClick={() => setIsVehicleModalOpen(false)}
                className="bg-gray-100 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)} 
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 bg-secondary text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-primary" size={24} />
                  <h2 className="text-lg font-bold">O Seu Carrinho ({mounted ? totalCount : 0})</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                    <ShoppingCart size={48} className="text-gray-300 mb-4" />
                    <p className="font-semibold text-lg text-gray-700">O seu carrinho está vazio</p>
                    <p className="text-sm mt-1 mb-6">Explore o nosso catálogo para encontrar peças compatíveis.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-primary text-white font-bold px-6 py-2.5 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      Ver Catálogo
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div key={product.id} className="py-4 flex gap-4 items-center">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.brand} • {product.sku}</p>
                        <p className="text-sm font-black text-primary mt-1">
                          {(product.price * quantity).toFixed(2)} €
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1">
                        <button 
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                        <button 
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-white rounded"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-2xl font-black text-secondary">{totalPrice.toFixed(2)} €</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Portes de envio calculados no checkout. Envio expresso em 24h.</p>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    Finalizar Encomenda
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
