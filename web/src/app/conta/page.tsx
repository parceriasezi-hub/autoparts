"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Car, 
  Package, 
  User, 
  Plus, 
  Trash2, 
  Check, 
  ChevronRight, 
  Truck, 
  ExternalLink, 
  Save,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useGarage, SavedVehicle } from '@/context/GarageContext';
import { useAuth } from '@/context/AuthContext';
import { VEHICLE_BRANDS } from '@/data/partsData';

export default function UserAccountPage() {
  const router = useRouter();
  const { savedVehicles, activeVehicle, addVehicle, removeVehicle, setActiveVehicle } = useGarage();
  const { user, addAddress, removeAddress, setDefaultAddress } = useAuth();

  const [activeTab, setActiveTab] = useState<'garage' | 'orders' | 'addresses' | 'profile'>('garage');
  
  // Add vehicle modal/form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBrandId, setNewBrandId] = useState('');
  const [newModelId, setNewModelId] = useState('');
  const [newEngine, setNewEngine] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newNickname, setNewNickname] = useState('');

  const selectedBrandObj = VEHICLE_BRANDS.find((b) => b.id === newBrandId);
  const availableModels = selectedBrandObj ? selectedBrandObj.models : [];
  const selectedModelObj = availableModels.find((m) => m.id === newModelId);
  const availableEngines = selectedModelObj ? selectedModelObj.engines : [];

  // Add Address Form State
  const [showAddAddrForm, setShowAddAddrForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState('');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    nif: '',
    address: 'Rua de Santa Catarina, 450, 2.º Dto',
    postalCode: '4000-444',
    city: 'Porto',
  });

  const displayProfile = {
    name: profileData.name || user?.name || 'João Silva',
    email: profileData.email || user?.email || 'joao.silva@exemplo.pt',
    phone: profileData.phone || user?.phone || '912 345 678',
    nif: profileData.nif || user?.nif || '245 890 123',
    address: profileData.address,
    postalCode: profileData.postalCode,
    city: profileData.city,
  };
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandId || !newModelId || !newEngine) return;

    addVehicle(newBrandId, newModelId, newEngine, newPlate, newNickname);
    
    setNewBrandId('');
    setNewModelId('');
    setNewEngine('');
    setNewPlate('');
    setNewNickname('');
    setShowAddForm(false);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLabel || !addrStreet || !addrPostalCode || !addrCity) return;

    addAddress({
      label: addrLabel,
      recipientName: addrRecipient || profileData.name,
      address: addrStreet,
      postalCode: addrPostalCode,
      city: addrCity,
      phone: addrPhone || profileData.phone,
      isDefault: addrIsDefault,
    });

    setAddrLabel('');
    setAddrRecipient('');
    setAddrStreet('');
    setAddrPostalCode('');
    setAddrCity('');
    setAddrPhone('');
    setAddrIsDefault(false);
    setShowAddAddrForm(false);
  };

  const handleFilterPartsForVehicle = (vehicle: SavedVehicle) => {
    setActiveVehicle(vehicle);
    router.push(`/produtos?brand=${vehicle.brandId}&model=${vehicle.modelId}&engine=${encodeURIComponent(vehicle.engine)}`);
  };

  const mockOrders = [
    {
      id: 'AP-2026-89412',
      date: '04/08/2026',
      status: 'Expedida',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-200',
      statusIcon: Truck,
      total: 121.40,
      paymentMethod: 'MB WAY',
      trackingCode: 'CTT-PT-9812401',
      itemsCount: 3,
      items: [
        'Jogo de Pastilhas de Travão Dianteiro Brembo (P 85 126)',
        'Filtro de Óleo Mann-Filter (HU 7008 z)',
        'Óleo de Motor Castrol EDGE 5W-30 LL (5L)'
      ]
    },
    {
      id: 'AP-2026-71029',
      date: '15/07/2026',
      status: 'Entregue',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      statusIcon: CheckCircle2,
      total: 119.00,
      paymentMethod: 'Multibanco',
      trackingCode: 'CTT-PT-7102988',
      itemsCount: 1,
      items: [
        'Bateria Automóvel Bosch S5 008 (77Ah 780A)'
      ]
    }
  ];

  const addresses = user?.addresses || [];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-900">A Minha Conta</span>
        </nav>

        {/* Profile Toast Banner */}
        {profileSavedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-primary/50 animate-bounce">
            <CheckCircle2 size={24} className="text-emerald-400" />
            <span className="text-sm font-bold">Dados de perfil atualizados com sucesso!</span>
          </div>
        )}

        {/* Header Profile Summary */}
        <div className="bg-secondary text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-primary">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner shrink-0" suppressHydrationWarning>
              {displayProfile.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Conta de Cliente</span>
              <h1 className="text-2xl md:text-3xl font-black" suppressHydrationWarning>{displayProfile.name}</h1>
              <p className="text-sm text-gray-300 font-mono" suppressHydrationWarning>{displayProfile.email} | NIF: {displayProfile.nif}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/10">
            <div className="text-right">
              <span className="text-xs text-gray-400 block font-medium">Garagem Pessoal</span>
              <span className="text-sm font-bold">{savedVehicles.length} veículos guardados</span>
            </div>
            <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold">
              <Car size={20} />
            </div>
          </div>
        </div>

        {/* Main Tabbed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Tab Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 space-y-1">
              <button
                onClick={() => setActiveTab('garage')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors text-left ${activeTab === 'garage' ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Car size={18} />
                <span>A Minha Garagem</span>
                <span className="ml-auto text-xs opacity-75">({savedVehicles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors text-left ${activeTab === 'orders' ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Package size={18} />
                <span>As Minhas Encomendas</span>
                <span className="ml-auto text-xs opacity-75">({mockOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors text-left ${activeTab === 'addresses' ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <MapPin size={18} />
                <span>Moradas de Entrega</span>
                <span className="ml-auto text-xs opacity-75">({addresses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors text-left ${activeTab === 'profile' ? 'bg-primary text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <User size={18} />
                <span>Os Meus Dados</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main className="lg:col-span-3">
            
            {/* Tab 1: A Minha Garagem */}
            {activeTab === 'garage' && (
              <div className="space-y-6">
                
                {/* Header & Add Button */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Car className="text-primary" size={24} />
                      Veículos da Minha Garagem
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Guarde os seus carros para filtrar peças compatíveis com 1-clique em todo o catálogo.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-primary hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Veículo
                  </button>
                </div>

                {/* Add Vehicle Form */}
                {showAddForm && (
                  <form onSubmit={handleAddVehicleSubmit} className="bg-white p-6 rounded-xl shadow-md border-2 border-primary space-y-4">
                    <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">
                      Adicionar Novo Carro à Garagem
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Marca *</label>
                        <select
                          value={newBrandId}
                          onChange={(e) => {
                            setNewBrandId(e.target.value);
                            setNewModelId('');
                            setNewEngine('');
                          }}
                          required
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-bold text-gray-900"
                        >
                          <option value="">Selecionar Marca</option>
                          {VEHICLE_BRANDS.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Modelo *</label>
                        <select
                          value={newModelId}
                          onChange={(e) => {
                            setNewModelId(e.target.value);
                            setNewEngine('');
                          }}
                          disabled={!newBrandId}
                          required
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-bold text-gray-900 disabled:opacity-50"
                        >
                          <option value="">Selecionar Modelo</option>
                          {availableModels.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Motor *</label>
                        <select
                          value={newEngine}
                          onChange={(e) => setNewEngine(e.target.value)}
                          disabled={!newModelId}
                          required
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-bold text-gray-900 disabled:opacity-50"
                        >
                          <option value="">Selecionar Motor</option>
                          {availableEngines.map((eng) => (
                            <option key={eng} value={eng}>{eng}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Matrícula (Opcional)</label>
                        <input 
                          type="text"
                          value={newPlate}
                          onChange={(e) => setNewPlate(e.target.value)}
                          placeholder="AA-00-AA"
                          maxLength={8}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs uppercase font-bold text-gray-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nome Pessoal do Carro</label>
                        <input 
                          type="text"
                          value={newNickname}
                          onChange={(e) => setNewNickname(e.target.value)}
                          placeholder="Ex: O meu Audi familiar"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                      <button 
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="bg-primary hover:bg-orange-600 text-white font-bold text-xs px-6 py-2 rounded-lg transition-colors"
                      >
                        Guardar Veículo
                      </button>
                    </div>
                  </form>
                )}

                {/* Saved Vehicles Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedVehicles.map((vehicle) => {
                    const isActive = activeVehicle?.id === vehicle.id;
                    return (
                      <div 
                        key={vehicle.id}
                        className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all flex flex-col justify-between ${isActive ? 'border-primary bg-orange-50/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="bg-secondary text-white font-black text-[10px] uppercase px-2.5 py-1 rounded">
                              {vehicle.brandName}
                            </span>
                            {isActive ? (
                              <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                                <Check size={12} /> Viatura Ativa
                              </span>
                            ) : (
                              <button 
                                onClick={() => setActiveVehicle(vehicle)}
                                className="text-[11px] font-bold text-gray-500 hover:text-primary transition-colors"
                              >
                                Definir como Ativa
                              </button>
                            )}
                          </div>

                          <h3 className="font-black text-gray-900 text-lg mb-1">
                            {vehicle.nickname || `${vehicle.brandName} ${vehicle.modelName}`}
                          </h3>
                          <p className="text-xs font-semibold text-gray-600 mb-3">
                            {vehicle.modelName} • {vehicle.engine}
                          </p>

                          {vehicle.plate && (
                            <span className="inline-block bg-gray-100 border border-gray-300 text-gray-900 font-mono font-bold text-xs px-3 py-1 rounded uppercase tracking-wider mb-4">
                              {vehicle.plate}
                            </span>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                          <button
                            onClick={() => handleFilterPartsForVehicle(vehicle)}
                            className="bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            Filtrar Peças
                            <ExternalLink size={14} />
                          </button>

                          <button 
                            onClick={() => removeVehicle(vehicle.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                            title="Remover da Garagem"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Tab 2: As Minhas Encomendas */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="text-primary" size={24} />
                    Histórico de Encomendas
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Acompanhe o estado de envio e consulte os detalhes das suas compras efetuadas.
                  </p>
                </div>

                <div className="space-y-4">
                  {mockOrders.map((order) => {
                    const StatusIcon = order.statusIcon;
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-200">
                          <div>
                            <span className="font-mono text-xs font-bold text-gray-500 block">N.º ENCOMENDA</span>
                            <span className="font-black text-gray-900 text-lg">{order.id}</span>
                            <span className="text-xs text-gray-500 block">Efetuada em {order.date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${order.statusColor}`}>
                              <StatusIcon size={14} />
                              {order.status}
                            </span>
                            <span className="font-black text-xl text-secondary">{order.total.toFixed(2)} €</span>
                          </div>
                        </div>

                        <div className="space-y-1 mb-4">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Artigos ({order.itemsCount})</span>
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-700 font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                              {item}
                            </p>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-gray-500 font-medium">Pagamento: <strong>{order.paymentMethod}</strong></span>
                          <span className="text-gray-600 font-mono">Código Rastreio: <strong>{order.trackingCode}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: As Minhas Moradas de Entrega */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                
                {/* Header & Add Button */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="text-primary" size={24} />
                      As Minhas Moradas de Entrega
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Guarde moradas de envio (*Casa, Oficina, Trabalho*) para preenchimento em 1-clique no checkout.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddAddrForm(!showAddAddrForm)}
                    className="bg-primary hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Morada
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddAddrForm && (
                  <form onSubmit={handleAddAddressSubmit} className="bg-white p-6 rounded-xl shadow-md border-2 border-primary space-y-4">
                    <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">
                      Nova Morada de Entrega
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Identificador da Morada *</label>
                        <input 
                          type="text"
                          required
                          value={addrLabel}
                          onChange={(e) => setAddrLabel(e.target.value)}
                          placeholder="Ex: Oficina Principal, Casa Porto"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-bold text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nome do Destinatário</label>
                        <input 
                          type="text"
                          value={addrRecipient}
                          onChange={(e) => setAddrRecipient(e.target.value)}
                          placeholder={profileData.name}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold text-gray-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Morada Completa *</label>
                        <input 
                          type="text"
                          required
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          placeholder="Rua, Número, Andar / Porta"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Código Postal *</label>
                        <input 
                          type="text"
                          required
                          value={addrPostalCode}
                          onChange={(e) => setAddrPostalCode(e.target.value)}
                          placeholder="4000-001"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-bold text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cidade / Localidade *</label>
                        <input 
                          type="text"
                          required
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          placeholder="Porto"
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold text-gray-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Telemóvel de Contacto</label>
                        <input 
                          type="tel"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          placeholder={profileData.phone}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold text-gray-900"
                        />
                      </div>

                      <div className="sm:col-span-2 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={addrIsDefault}
                            onChange={(e) => setAddrIsDefault(e.target.checked)}
                            className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
                          />
                          <span className="text-xs font-bold text-gray-800">Definir como Morada Principal de Envio</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                      <button 
                        type="button"
                        onClick={() => setShowAddAddrForm(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="bg-primary hover:bg-orange-600 text-white font-bold text-xs px-6 py-2 rounded-lg transition-colors"
                      >
                        Guardar Morada
                      </button>
                    </div>
                  </form>
                )}

                {/* Saved Address Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all flex flex-col justify-between ${addr.isDefault ? 'border-primary bg-orange-50/20 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-secondary text-white font-bold text-xs px-2.5 py-1 rounded">
                            {addr.label}
                          </span>
                          {addr.isDefault ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Check size={12} /> Morada Principal
                            </span>
                          ) : (
                            <button 
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[11px] font-bold text-gray-500 hover:text-primary transition-colors"
                            >
                              Tornar Principal
                            </button>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-base mb-1">
                          {addr.recipientName}
                        </h3>
                        <p className="text-xs text-gray-600 font-medium">
                          {addr.address}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {addr.postalCode} {addr.city}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-2">
                          Tel: {addr.phone}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-end mt-4">
                        <button 
                          onClick={() => removeAddress(addr.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Remover Morada"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab 4: Os Meus Dados */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="text-primary" size={24} />
                    Dados do Perfil e Faturação
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Mantenha a sua informação de contacto e morada de faturação atualizadas.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setProfileSavedToast(true);
                  setTimeout(() => setProfileSavedToast(false), 3000);
                }} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nome Completo</label>
                      <input 
                        type="text"
                        value={displayProfile.name}
                        onChange={(e) => setProfileData({ ...displayProfile, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-900 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">E-mail</label>
                      <input 
                        type="email"
                        value={displayProfile.email}
                        onChange={(e) => setProfileData({ ...displayProfile, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-900 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Telemóvel</label>
                      <input 
                        type="tel"
                        value={displayProfile.phone}
                        onChange={(e) => setProfileData({ ...displayProfile, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-900 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">NIF (para Faturação)</label>
                      <input 
                        type="text"
                        value={displayProfile.nif}
                        onChange={(e) => setProfileData({ ...displayProfile, nif: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-900 focus:border-primary"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Morada Principal</label>
                      <input 
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-900 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Código Postal</label>
                      <input 
                        type="text"
                        value={profileData.postalCode}
                        onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-900 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cidade</label>
                      <input 
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-900 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save size={18} />
                      Guardar Alterações
                    </button>
                  </div>

                </form>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
