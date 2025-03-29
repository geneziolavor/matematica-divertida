'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
  lembrar: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [loginError, setLoginError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      lembrar: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('');
    
    try {
      await login(data.email, data.senha);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginError('Email ou senha incorretos. Por favor, tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)]">Entrar</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta para começar</p>
        </div>
        
        {loginError && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="seu.email@exemplo.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="senha">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaLock />
              </div>
              <input
                id="senha"
                type="password"
                {...register('senha')}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Sua senha"
              />
            </div>
            {errors.senha && (
              <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('lembrar')}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Lembrar de mim</span>
            </label>
            <Link href="/recuperar-senha" className="text-sm text-[var(--primary)] hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/registro" className="text-[var(--primary)] font-medium hover:underline">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 