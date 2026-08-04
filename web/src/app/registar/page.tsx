"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, FileText, ArrowRight, ShieldCheck, CheckCircle2, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nif, setNif] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    if (!agreeTerms) {
      setError('Deve aceitar os Termos e Condições para criar conta.');
      return;
    }

    const ok = register(name, email, phone, nif, password);
    if (ok) {
      setSuccessToast(true);
      setTimeout(() => {
        router.push('/conta');
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4">
        
        {/* Success Toast Banner */}
        {successToast && (
          <div className="mb-6 bg-emerald-600 text-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 size={24} />
            <span className="text-sm font-bold">Conta criada com sucesso! A reencaminhar para o seu perfil...</span>
          </div>
        )}

        {/* Card Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <User size={28} />
            </div>
            <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">
              Criar Conta na <span className="text-primary italic">AutoParts</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Guarde os seus veículos na garagem, acompanhe encomendas e beneficie de descontos exclusivos.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-primary text-gray-900 font-medium"
                />
                <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  E-mail *
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao@exemplo.pt"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-primary text-gray-900 font-medium"
                  />
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Telemóvel *
                </label>
                <div className="relative">
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="912 345 678"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-primary text-gray-900 font-medium"
                  />
                  <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                NIF (para Faturação - Opcional)
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  placeholder="123456789"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-primary text-gray-900 font-medium"
                />
                <FileText size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Palavra-Passe *
                </label>
                <div className="relative">
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-primary text-gray-900 font-medium"
                  />
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Confirmar Palavra-Passe *
                </label>
                <div className="relative">
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 pl-10 text-sm focus:outline-none focus:border-primary text-gray-900 font-medium"
                  />
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300 mt-0.5"
                />
                <span className="text-xs text-gray-600 leading-normal">
                  Li e aceito os <a href="#" className="text-primary hover:underline font-bold">Termos e Condições</a> e a <a href="#" className="text-primary hover:underline font-bold">Política de Privacidade</a> da AutoParts.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base active:scale-98 mt-6"
            >
              Criar Conta Gratuita
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Login Callout */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600 font-medium mb-3">
              Já tem conta registada?
            </p>
            <Link 
              href="/login"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <LogIn size={16} />
              Iniciar Sessão
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Dados de utilizador protegidos segundo o RGPD</span>
          </div>

        </div>

      </div>
    </div>
  );
}
