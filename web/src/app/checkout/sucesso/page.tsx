"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  CreditCard, 
  Truck, 
  Copy, 
  Check, 
  Printer, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { CartItem } from '@/context/CartContext';

interface OrderDetails {
  orderId: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    nif?: string;
    address: string;
    postalCode: string;
    city: string;
  };
  shippingMethod: string;
  paymentMethod: 'mbway' | 'multibanco' | 'card';
  mbwayPhone?: string;
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  finalTotal: number;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');

  const [copiedRef, setCopiedRef] = useState(false);

  const [order] = useState<OrderDetails | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedOrder = sessionStorage.getItem('last_order');
        return savedOrder ? JSON.parse(savedOrder) : null;
      } catch (e) {
        console.error('Failed to parse order from sessionStorage', e);
      }
    }
    return null;
  });

  const displayOrderId = orderIdFromUrl || order?.orderId || 'AP-2026-98124';

  const copyMultibancoRef = () => {
    navigator.clipboard.writeText('987 654 321');
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Success Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Encomenda Registada com Sucesso
          </span>
          <h1 className="text-3xl font-black text-secondary mt-3 mb-2">
            Obrigado pela sua compra!
          </h1>
          <p className="text-gray-500 text-sm">
            N.º de Encomenda: <strong className="text-gray-900 font-mono">{displayOrderId}</strong>
          </p>
        </div>

        {/* Payment Instructions Card */}
        {order?.paymentMethod === 'multibanco' ? (
          <div className="bg-blue-900 text-white rounded-2xl p-6 md:p-8 shadow-lg mb-8 border border-blue-700">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-blue-800">
              <Building2 size={28} className="text-blue-300" />
              <div>
                <h3 className="font-bold text-lg">Dados para Pagamento Multibanco</h3>
                <p className="text-xs text-blue-200">Utilize os dados abaixo no seu Homebanking ou Caixa Multibanco em 24h.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center bg-blue-950/60 p-5 rounded-xl border border-blue-800 font-mono">
              <div>
                <span className="text-xs text-blue-300 uppercase block font-sans font-bold">Entidade</span>
                <span className="text-xl font-bold text-white">21548</span>
              </div>
              <div>
                <span className="text-xs text-blue-300 uppercase block font-sans font-bold">Referência</span>
                <span className="text-xl font-bold text-yellow-400">987 654 321</span>
              </div>
              <div>
                <span className="text-xs text-blue-300 uppercase block font-sans font-bold">Montante</span>
                <span className="text-xl font-bold text-white">{(order?.finalTotal || 0).toFixed(2)} €</span>
              </div>
            </div>

            <button 
              onClick={copyMultibancoRef}
              className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copiedRef ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copiedRef ? 'Referência Copiada!' : 'Copiar Referência Multibanco'}
            </button>
          </div>
        ) : order?.paymentMethod === 'mbway' ? (
          <div className="bg-red-950 text-white rounded-2xl p-6 md:p-8 shadow-lg mb-8 border border-red-800">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-red-900">
              <Smartphone size={28} className="text-red-400" />
              <div>
                <h3 className="font-bold text-lg">Aprovação MB WAY Pendente</h3>
                <p className="text-xs text-red-300">Enviámos o pedido para o telemóvel: <strong>{order?.mbwayPhone || order?.customer?.phone}</strong></p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-red-900/40 p-4 rounded-xl text-xs text-red-200">
              <Clock size={20} className="animate-spin text-red-400 shrink-0" />
              <span>Por favor, abra a app <strong>MB WAY</strong> no seu telemóvel e confirme o pagamento de <strong>{(order?.finalTotal || 0).toFixed(2)} €</strong> em 5 minutos.</span>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950 text-white rounded-2xl p-6 md:p-8 shadow-lg mb-8 border border-emerald-800">
            <div className="flex items-center gap-3">
              <CreditCard size={28} className="text-emerald-400" />
              <div>
                <h3 className="font-bold text-lg">Pagamento Confirmado</h3>
                <p className="text-xs text-emerald-300">O pagamento por cartão foi processado com sucesso. A sua encomenda entrou em preparação.</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100 text-sm">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Destinatário & Morada</span>
              <p className="font-bold text-gray-900">{order?.customer?.name || 'Cliente AutoParts'}</p>
              <p className="text-gray-600">{order?.customer?.address || 'Morada registada'}</p>
              <p className="text-gray-600">{order?.customer?.postalCode} {order?.customer?.city}</p>
              <p className="text-gray-600 font-mono text-xs mt-1">{order?.customer?.email} | {order?.customer?.phone}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Previsão de Entrega</span>
              <div className="flex items-center gap-2 text-emerald-700 font-bold mt-1">
                <Truck size={18} />
                <span>24h a 48h Úteis (CTT Express)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Receberá um SMS com o código de acompanhamento assim que a encomenda for expedida do nosso armazém.</p>
            </div>
          </div>

          {/* Ordered items preview */}
          {order?.cartItems && order.cartItems.length > 0 && (
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">Artigos Encomendados</span>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {order.cartItems.map(({ product, quantity }: CartItem) => (
                  <div key={product.id} className="p-3 bg-gray-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Image src={product.image} alt={product.name} width={40} height={40} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-gray-500">{quantity}x • SKU: {product.sku}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">{(product.price * quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final price line */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-base">
            <span className="font-bold text-gray-700">Total Pago</span>
            <span className="text-2xl font-black text-primary">{(order?.finalTotal || 0).toFixed(2)} €</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Printer size={18} />
              Imprimir Resumo
            </button>
            <Link 
              href="/produtos"
              className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm text-center"
            >
              Continuar a Comprar
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">A carregar dados da encomenda...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
