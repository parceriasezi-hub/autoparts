"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Casa", "Oficina", "Trabalho"
  recipientName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  nif?: string;
  isAuthenticated: boolean;
  addresses: SavedAddress[];
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, nif?: string, password?: string) => boolean;
  logout: () => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-casa',
    label: 'Casa (Principal)',
    recipientName: 'João Silva',
    address: 'Rua de Santa Catarina, 450, 2.º Dto',
    postalCode: '4000-444',
    city: 'Porto',
    phone: '912 345 678',
    isDefault: true,
  },
  {
    id: 'addr-oficina',
    label: 'Oficina / Trabalho',
    recipientName: 'João Silva (AutoGaragem)',
    address: 'Zona Industrial da Maia, Lote 12',
    postalCode: '4470-001',
    city: 'Maia',
    phone: '912 345 678',
    isDefault: false,
  }
];

const DEFAULT_USER: UserProfile = {
  name: 'João Silva',
  email: 'joao.silva@exemplo.pt',
  phone: '912 345 678',
  nif: '245 890 123',
  isAuthenticated: true,
  addresses: DEFAULT_ADDRESSES,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('autoparts_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (!parsed.addresses) {
            parsed.addresses = DEFAULT_ADDRESSES;
          }
          return parsed;
        }
      } catch (e) {
        console.error('Failed to load user session from localStorage', e);
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('autoparts_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('autoparts_user');
      }
    } catch (e) {
      console.error('Failed to save user session to localStorage', e);
    }
  }, [user]);

  const login = (email: string) => {
    const newUser: UserProfile = {
      name: email.split('@')[0] || 'Cliente AutoParts',
      email: email,
      phone: '912 345 678',
      nif: '245 890 123',
      isAuthenticated: true,
      addresses: DEFAULT_ADDRESSES,
    };
    setUser(newUser);
    return true;
  };

  const register = (name: string, email: string, phone: string, nif?: string) => {
    const newUser: UserProfile = {
      name,
      email,
      phone,
      nif,
      isAuthenticated: true,
      addresses: DEFAULT_ADDRESSES,
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addAddress = (addressData: Omit<SavedAddress, 'id'>) => {
    if (!user) return;
    const newAddress: SavedAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = addressData.isDefault
      ? user.addresses.map((a) => ({ ...a, isDefault: false }))
      : [...user.addresses];

    setUser({
      ...user,
      addresses: [...updatedAddresses, newAddress],
    });
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: user.addresses.filter((a) => a.id !== id),
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: user.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, addAddress, removeAddress, setDefaultAddress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
