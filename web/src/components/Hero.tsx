"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { VEHICLE_BRANDS } from '@/data/partsData';

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'matricula' | 'manual' | 'vin'>('matricula');
  const [plate, setPlate] = useState('');
  const [vin, setVin] = useState('');
  
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('');

  const router = useRouter();

  const selectedBrandObj = VEHICLE_BRANDS.find((b) => b.id === selectedBrandId);
  const availableModels = selectedBrandObj ? selectedBrandObj.models : [];
  const selectedModelObj = availableModels.find((m) => m.id === selectedModelId);
  const availableEngines = selectedModelObj ? selectedModelObj.engines : [];

  const handlePlateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plate.trim()) {
      router.push(`/produtos?plate=${encodeURIComponent(plate.trim().toUpperCase())}`);
    } else {
      router.push('/produtos');
    }
  };

  const handleVinSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(vin.trim().toUpperCase())}`);
    } else {
      router.push('/produtos');
    }
  };

  const handleVehicleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrandId) params.set('brand', selectedBrandId);
    if (selectedModelId) params.set('model', selectedModelId);
    if (selectedEngine) params.set('engine', selectedEngine);
    router.push(`/produtos?${params.toString()}`);
  };

  return (
    <div className="relative bg-secondary min-h-[520px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png"
          alt="Garage Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Encontre a peça exata <span className="text-primary">para o seu carro</span>
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            Mais de 1 milhão de peças em stock. Preços imbatíveis com garantia OEM.
          </p>

          {/* Search Widget */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 text-xs sm:text-sm">
              <button 
                type="button"
                onClick={() => setActiveTab('matricula')}
                className={`flex-1 py-3.5 text-center font-bold transition-colors ${activeTab === 'matricula' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Por Matrícula
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-3.5 text-center font-bold transition-colors ${activeTab === 'manual' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Por Veículo
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('vin')}
                className={`flex-1 py-3.5 text-center font-bold transition-colors ${activeTab === 'vin' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Por N.º Chassis / VIN
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'matricula' ? (
                <form onSubmit={handlePlateSearch} className="space-y-4">
                  <div className="flex bg-gray-100 rounded-md border-2 border-gray-300 focus-within:border-primary overflow-hidden transition-colors h-14">
                    <div className="bg-blue-600 w-12 flex flex-col justify-between items-center py-1 rounded-l-sm">
                      <div className="flex space-x-1">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-[2px] h-[2px] bg-yellow-400 rounded-full"></div>
                        ))}
                      </div>
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <input 
                      type="text" 
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      placeholder="AA-00-AA" 
                      className="flex-1 bg-transparent text-black text-2xl font-bold tracking-[0.2em] text-center uppercase outline-none placeholder:text-gray-400"
                      maxLength={8}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <Search size={24} />
                    Pesquisar Peças
                  </button>
                </form>
              ) : activeTab === 'manual' ? (
                <form onSubmit={handleVehicleSearch} className="space-y-4">
                  {/* Brand Select */}
                  <select 
                    value={selectedBrandId}
                    onChange={(e) => {
                      setSelectedBrandId(e.target.value);
                      setSelectedModelId('');
                      setSelectedEngine('');
                    }}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block p-3.5 font-medium"
                  >
                    <option value="">1. Selecionar Marca</option>
                    {VEHICLE_BRANDS.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>

                  {/* Model Select */}
                  <select 
                    value={selectedModelId}
                    onChange={(e) => {
                      setSelectedModelId(e.target.value);
                      setSelectedEngine('');
                    }}
                    disabled={!selectedBrandId}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block p-3.5 font-medium disabled:opacity-50"
                  >
                    <option value="">2. Selecionar Modelo</option>
                    {availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>

                  {/* Engine Select */}
                  <select 
                    value={selectedEngine}
                    onChange={(e) => setSelectedEngine(e.target.value)}
                    disabled={!selectedModelId}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-primary focus:border-primary block p-3.5 font-medium disabled:opacity-50"
                  >
                    <option value="">3. Selecionar Motor</option>
                    {availableEngines.map((engine) => (
                      <option key={engine} value={engine}>
                        {engine}
                      </option>
                    ))}
                  </select>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <Search size={24} />
                    Pesquisar Peças
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVinSearch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ShieldCheck size={16} className="text-primary" /> N.º de Chassis (17 Caracteres)
                    </label>
                    <input 
                      type="text" 
                      value={vin}
                      onChange={(e) => setVin(e.target.value)}
                      placeholder="Ex: WVWZZZ1KZ9W123456" 
                      className="w-full bg-gray-50 text-black px-4 py-3.5 border border-gray-300 rounded-md text-base font-mono uppercase font-bold focus:outline-none focus:border-primary"
                      maxLength={17}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-md transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <Search size={24} />
                    Pesquisar por Chassis
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
