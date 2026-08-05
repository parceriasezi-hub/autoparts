"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Tag, 
  Lock,
  User,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nif: '',
    address: '',
    postalCode: '',
    city: '',
    notes: '',
  });

  const [shippingMethod, setShippingMethod] = useState<'express' | 'store'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'multibanco' | 'card'>('mbway');
  const [mbwayPhone, setMbwayPhone] = useState('');
  
  // Voucher Coupon State
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [fixedDiscountAmount, setFixedDiscountAmount] = useState(0);

  const shippingCost = shippingMethod === 'express' ? (totalPrice > 50 ? 0 : 4.90) : 0;
  const discountAmount = fixedDiscountAmount > 0 ? fixedDiscountAmount : (totalPrice * discountPercent) / 100;
  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingCost);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!coupon.trim()) return;

    try {
      const { validateCoupon } = await import('@/services/partsService');
      const res = await validateCoupon(coupon, totalPrice);
      if (res.valid) {
        setFixedDiscountAmount(res.discountAmount);
        setCouponSuccess(res.message);
      } else {
        setCouponError(res.message);
      }
    } catch {
      setCouponError('Não foi possível validar o cupão.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate order ID
    const orderId = `AP-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Save order data to sessionStorage for confirmation page
    const orderSummary = {
      orderId,
      date: new Date().toLocaleDateString('pt-PT'),
      customer: formData,
      shippingMethod,
      paymentMethod,
      mbwayPhone: paymentMethod === 'mbway' ? (mbwayPhone || formData.phone) : undefined,
      cartItems: cart,
      subtotal: totalPrice,
      shippingCost,
      discountAmount,
      finalTotal,
    };

    sessionStorage.setItem('last_order', JSON.stringify(orderSummary));
    
    // Clear shopping cart
    clearCart();

    // Redirect to confirmation page
    router.push(`/checkout/sucesso?orderId=${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center text-center p-6">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">O seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-6">Adicione peças ao carrinho antes de prosseguir para o checkout.</p>
        <Link 
          href="/produtos" 
          className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <ChevronRight size={14} />
          <Link href="/produtos" className="hover:text-primary transition-colors">Catálogo</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900">Finalizar Encomenda</span>
        </nav>

        <h1 className="text-3xl font-black text-secondary mb-8 uppercase tracking-tight">
          Finalizar Encomenda
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Area (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Dados do Cliente e Envio */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Dados Pessoais e Endereço de Envio
                </h2>
              </div>

              {/* Saved Address Quick Selector */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="mb-6 bg-orange-50/60 border border-orange-200 rounded-xl p-4">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    Selecionar das Minhas Moradas Guardadas:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr) => {
                      const isSelected = selectedAddrId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setSelectedAddrId(addr.id);
                            setFormData((prev) => ({
                              ...prev,
                              name: addr.recipientName || prev.name,
                              phone: addr.phone || prev.phone,
                              address: addr.address,
                              postalCode: addr.postalCode,
                              city: addr.city,
                            }));
                          }}
                          className={`p-3 rounded-lg border text-left transition-all flex justify-between items-center ${isSelected ? 'bg-primary text-white border-primary shadow' : 'bg-white text-gray-800 border-gray-200 hover:border-primary'}`}
                        >
                          <div>
                            <strong className="text-xs block font-bold">{addr.label}</strong>
                            <span className="text-[11px] opacity-90 block truncate max-w-[200px]">{addr.address}</span>
                            <span className="text-[10px] opacity-75">{addr.postalCode} {addr.city}</span>
                          </div>
                          {isSelected && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nome Completo *</label>
                  <input 
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">E-mail *</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="joao@exemplo.pt"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Telemóvel *</label>
                  <input 
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="912 345 678"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-gray-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">NIF (para Faturação)</label>
                  <input 
                    type="text"
                    name="nif"
                    value={formData.nif}
                    onChange={handleInputChange}
                    placeholder="123456789 (Opcional)"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-gray-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Morada de Entrega *</label>
                  <input 
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua, Número, Andar / Porta"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Código Postal *</label>
                  <input 
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="1000-001"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Localidade / Cidade *</label>
                  <input 
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Lisboa"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Método de Envio */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Truck size={20} className="text-primary" />
                  Método de Envio
                </h2>
              </div>

              <div className="space-y-3">
                <label 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-primary bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">Entrega Expressa CTT / Chronopost (24h/48h)</span>
                      <span className="text-xs text-gray-500">Envio registado com número de rastreio SMS</span>
                    </div>
                  </div>
                  <span className="font-black text-gray-900 text-sm">
                    {totalPrice > 50 ? <span className="text-emerald-600 uppercase font-black text-xs bg-emerald-100 px-2 py-1 rounded">Grátis</span> : '4.90 €'}
                  </span>
                </label>

                <label 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'store' ? 'border-primary bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      checked={shippingMethod === 'store'}
                      onChange={() => setShippingMethod('store')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">Levantamento em Loja (Lisboa ou Porto)</span>
                      <span className="text-xs text-gray-500">Disponível em 2 horas após confirmação</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 uppercase text-xs bg-emerald-100 px-2 py-1 rounded">Grátis</span>
                </label>
              </div>
            </div>

            {/* Step 3: Método de Pagamento */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" />
                  Método de Pagamento
                </h2>
              </div>

              <div className="space-y-4">
                {/* MB WAY Option */}
                <div 
                  onClick={() => setPaymentMethod('mbway')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'mbway' ? 'border-primary bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'mbway'}
                        onChange={() => setPaymentMethod('mbway')}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <Smartphone className="text-red-600" size={24} />
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">MB WAY</span>
                        <span className="text-xs text-gray-500">Pagamento instantâneo via telemóvel</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded">Popular</span>
                  </div>

                  {paymentMethod === 'mbway' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">N.º de Telemóvel MB WAY</label>
                      <input 
                        type="tel"
                        placeholder="912 345 678"
                        value={mbwayPhone}
                        onChange={(e) => setMbwayPhone(e.target.value)}
                        className="w-full sm:w-64 bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary font-bold text-gray-900"
                      />
                      <p className="text-xs text-gray-500 mt-1">Receberá uma notificação na sua app MB WAY para aprovar o pagamento.</p>
                    </div>
                  )}
                </div>

                {/* Multibanco Option */}
                <div 
                  onClick={() => setPaymentMethod('multibanco')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'multibanco' ? 'border-primary bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'multibanco'}
                      onChange={() => setPaymentMethod('multibanco')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <Building2 className="text-blue-700" size={24} />
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">Multibanco (Entidade e Referência)</span>
                      <span className="text-xs text-gray-500">Pague no homebanking ou caixa MB em 24h</span>
                    </div>
                  </div>
                </div>

                {/* Credit Card Option */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-orange-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <CreditCard className="text-secondary" size={24} />
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">Cartão de Crédito / Débito (Visa, Mastercard)</span>
                      <span className="text-xs text-gray-500">Processamento seguro encriptado SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 pb-4 mb-4 border-b border-gray-100 flex items-center justify-between">
                <span>Resumo da Encomenda</span>
                <span className="text-xs text-gray-500 font-normal">({cart.length} itens)</span>
              </h3>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 mb-6 pr-2">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex gap-3 items-center">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-500">{quantity}x • {product.brand}</p>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      {(product.price * quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="mb-6 pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag size={14} className="text-primary" /> Cupão de Desconto
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Ex: AUTOPARTS10"
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs uppercase font-bold text-gray-900 focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-secondary hover:bg-neutral-900 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600 mt-1 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-emerald-600 mt-1 font-bold">{couponSuccess}</p>}
              </div>

              {/* Pricing Totals Breakdown */}
              <div className="space-y-2 text-sm pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Produtos</span>
                  <span className="font-bold text-gray-900">{totalPrice.toFixed(2)} €</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto ({discountPercent}%)</span>
                    <span>- {discountAmount.toFixed(2)} €</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Portes de Envio</span>
                  <span className="font-bold text-gray-900">
                    {shippingCost === 0 ? <span className="text-emerald-600 uppercase font-black text-xs">Grátis</span> : `${shippingCost.toFixed(2)} €`}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total a Pagar</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-primary">{finalTotal.toFixed(2)} €</span>
                    <span className="text-[10px] text-gray-400 block font-medium">Com IVA incluído</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6 flex items-center justify-center gap-2 text-base active:scale-98"
              >
                <Lock size={18} />
                Confirmar e Pagar ({finalTotal.toFixed(2)} €)
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Pagamento 100% Seguro & Encriptação SSL 256-bit</span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
