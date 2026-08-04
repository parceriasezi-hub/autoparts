"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor preencha o e-mail e a palavra-passe.');
      return;
    }

    const ok = login(email, password);
    if (ok) {
      setSuccessToast(true);
      setTimeout(() => {
        router.push('/conta');
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        
        {/* Success Toast Banner */}
        {successToast && (
          <div className="mb-6 bg-emerald-600 text-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 size={24} />
            <span className="text-sm font-bold">Sessão iniciada com sucesso! A reencaminhar...</span>
          </div>
        )}

        {/* Card Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">
              Entrar na <span className="text-primary italic">AutoParts</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Aceda à sua garagem pessoal, histórico de encomendas e ofertas exclusivas.
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Palavra-Passe *
                </label>
                <a href="#" className="text-xs text-primary hover:underline font-semibold">
                  Esqueceu-se?
                </a>
              </div>
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
                />
                <span className="text-xs font-semibold text-gray-700">Manter sessão iniciada</span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base active:scale-98 mt-6"
            >
              Iniciar Sessão
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Register Callout */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600 font-medium mb-3">
              Ainda não tem conta na AutoParts?
            </p>
            <Link 
              href="/registar"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <UserPlus size={16} />
              Criar Conta Gratuita
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Encriptação SSL de 256 bits</span>
          </div>

        </div>

      </div>
    </div>
  );
}
