"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VEHICLE_BRANDS } from '@/data/partsData';

export interface SavedVehicle {
  id: string;
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  engine: string;
  plate?: string;
  nickname?: string;
}

interface GarageContextType {
  savedVehicles: SavedVehicle[];
  activeVehicle: SavedVehicle | null;
  addVehicle: (brandId: string, modelId: string, engine: string, plate?: string, nickname?: string) => void;
  removeVehicle: (id: string) => void;
  setActiveVehicle: (vehicle: SavedVehicle | null) => void;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

const DEFAULT_VEHICLES: SavedVehicle[] = [
  {
    id: 'garage-audi-a3',
    brandId: 'audi',
    brandName: 'Audi',
    modelId: 'a3',
    modelName: 'A3 (8V / 8Y)',
    engine: '2.0 TDI (150 CV)',
    plate: '99-ZZ-11',
    nickname: 'O meu Audi principal',
  },
  {
    id: 'garage-vw-golf',
    brandId: 'vw',
    brandName: 'Volkswagen',
    modelId: 'golf',
    modelName: 'Golf (VII / VIII)',
    engine: '1.6 TDI (115 CV)',
    plate: '44-AA-88',
    nickname: 'Golf de trabalho',
  }
];

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [savedVehicles, setSavedVehicles] = useState<SavedVehicle[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('autoparts_garage');
        return saved ? JSON.parse(saved) : DEFAULT_VEHICLES;
      } catch (e) {
        console.error('Failed to load garage from localStorage', e);
      }
    }
    return DEFAULT_VEHICLES;
  });

  const [activeVehicle, setActiveVehicleState] = useState<SavedVehicle | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const active = localStorage.getItem('autoparts_active_vehicle');
        return active ? JSON.parse(active) : DEFAULT_VEHICLES[0];
      } catch (e) {
        console.error('Failed to load active vehicle from localStorage', e);
      }
    }
    return DEFAULT_VEHICLES[0];
  });

  // Save vehicles to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('autoparts_garage', JSON.stringify(savedVehicles));
    } catch (e) {
      console.error('Failed to save garage to localStorage', e);
    }
  }, [savedVehicles]);

  const setActiveVehicle = (vehicle: SavedVehicle | null) => {
    setActiveVehicleState(vehicle);
    try {
      if (vehicle) {
        localStorage.setItem('autoparts_active_vehicle', JSON.stringify(vehicle));
      } else {
        localStorage.removeItem('autoparts_active_vehicle');
      }
    } catch (e) {
      console.error('Failed to save active vehicle', e);
    }
  };

  const addVehicle = (
    brandId: string, 
    modelId: string, 
    engine: string, 
    plate?: string, 
    nickname?: string
  ) => {
    const brandObj = VEHICLE_BRANDS.find((b) => b.id === brandId);
    const modelObj = brandObj?.models.find((m) => m.id === modelId);

    if (!brandObj || !modelObj) return;

    const newVehicle: SavedVehicle = {
      id: `garage-${Date.now()}`,
      brandId,
      brandName: brandObj.name,
      modelId,
      modelName: modelObj.name,
      engine,
      plate: plate ? plate.toUpperCase() : undefined,
      nickname: nickname || `${brandObj.name} ${modelObj.name}`,
    };

    setSavedVehicles((prev) => [...prev, newVehicle]);
    
    // Set as active vehicle by default
    setActiveVehicle(newVehicle);
  };

  const removeVehicle = (id: string) => {
    setSavedVehicles((prev) => prev.filter((v) => v.id !== id));
    if (activeVehicle?.id === id) {
      setActiveVehicle(null);
    }
  };

  return (
    <GarageContext.Provider
      value={{
        savedVehicles,
        activeVehicle,
        addVehicle,
        removeVehicle,
        setActiveVehicle,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
}
