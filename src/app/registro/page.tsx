'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaSchool, FaUserTie, FaCog } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Schema de validação para o formulário
const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string(),
  tipo: z.enum(['aluno', 'professor', 'admin']),
  escola: z.string().min(3, 'Nome da escola deve ter pelo menos 3 caracteres'),
  codigoAdmin: z.string().optional()
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegistroContent() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto my-12 px-4 text-center">Carregando formulário de registro...</div>}>
      <RegistroForm />
    </Suspense>
  );
}

function RegistroForm() {
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isConvite, setIsConvite] = useState(false);
  const [showAdminOption, setShowAdminOption] = useState(false);
  const [codigoSecreto, setCodigoSecreto] = useState('');
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [escolaParam, setEscolaParam] = useState('');
  const [tipoParam, setTipoParam] = useState<'aluno' | 'professor'>('aluno');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipo: 'aluno'
    }
  });

  // Verificar se estamos vindo de um convite de forma segura com useEffect
  useEffect(() => {
    if (!searchParams) return;
    
    const convite = searchParams.get('convite');
    const tipo = searchParams.get('tipo');
    
    if (convite) {
      try {
        // Decodificar o parâmetro de convite (simulado)
        const escolaConvite = atob(convite);
        setEscolaParam(escolaConvite);
        setValue('escola', escolaConvite);
        setIsConvite(true);
      } catch (error) {
        console.error('Erro ao decodificar convite:', error);
      }
    }
    
    if (tipo && (tipo === 'aluno' || tipo === 'professor')) {
      setTipoParam(tipo as 'aluno' | 'professor');
      setValue('tipo', tipo as 'aluno' | 'professor');
    }
  }, [searchParams, setValue]);

  const tipoUsuario = watch('tipo');
  
  // Verificar código secreto para mostrar opção de admin
  const verificarCodigoSecreto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const codigo = e.target.value;
    setCodigoSecreto(codigo);
    
    // Código secreto para habilitar opção de admin (por exemplo, "admin123")
    if (codigo === "admin123") {
      setShowAdminOption(true);
    } else {
      setShowAdminOption(false);
      if (tipoUsuario === 'admin') {
        setValue('tipo', 'professor');
      }
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError('');
    
    try {
      await registerUser({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        tipo: data.tipo,
        escola: data.escola
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setSubmitError(error.message || 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="card text-center">
          <div className="text-[var(--success)] text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4 text-[var(--text)]">Registro Completo!</h2>
          <p className="mb-6 text-gray-600">
            Sua conta foi criada com sucesso. Você será redirecionado para o Dashboard em instantes.
          </p>
          <Link href="/dashboard" className="btn-primary block w-full">
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-[var(--text)]">Crie sua Conta</h1>
      
      {isConvite && (
        <div className="mb-8 p-4 bg-[var(--accent)] bg-opacity-20 rounded-md text-center">
          <h2 className="font-bold text-xl mb-2">Você foi convidado!</h2>
          <p className="text-gray-700">
            Um professor convidou você para participar da plataforma Matemática Divertida.
            O nome da sua escola já foi preenchido automaticamente.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card animated-bg text-white">
          <h2 className="text-2xl font-bold mb-6">Bem-vindo à Matemática Divertida!</h2>
          <div className="mb-6">
            <p className="mb-4">
              Junte-se à nossa comunidade e desfrute de:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Desafios matemáticos divertidos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Competições entre escolas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Acompanhamento de progresso</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Rankings e premiações</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2">Já tem uma conta?</p>
            <Link href="/login" className="btn-secondary w-full block text-center">
              Fazer Login
            </Link>
          </div>
        </div>
        
        <div className="card bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuário
              </label>
              <div className="flex space-x-4 flex-wrap">
                <label className="flex items-center mb-2">
                  <input
                    type="radio"
                    value="aluno"
                    {...register('tipo')}
                    className="mr-2"
                    disabled={isConvite && tipoParam !== 'aluno'}
                  />
                  <FaUserGraduate className="mr-1 text-[var(--primary)]" />
                  Aluno
                </label>
                <label className="flex items-center mb-2">
                  <input
                    type="radio"
                    value="professor"
                    {...register('tipo')}
                    className="mr-2"
                    disabled={isConvite && tipoParam !== 'professor'}
                  />
                  <FaUserTie className="mr-1 text-[var(--primary)]" />
                  Professor
                </label>
                {showAdminOption && (
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="admin"
                      {...register('tipo')}
                      className="mr-2"
                    />
                    <FaCog className="mr-1 text-[var(--accent)]" />
                    Administrador
                  </label>
                )}
              </div>
              {isConvite && (
                <p className="text-xs text-gray-500 mt-1">
                  O tipo de usuário foi definido pelo convite e não pode ser alterado.
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaUser />
                </div>
                <input
                  id="nome"
                  type="text"
                  {...register('nome')}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder={tipoUsuario === 'aluno' ? "Seu nome completo" : "Nome do professor"}
                />
              </div>
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>
            
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="escola">
                Escola
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSchool />
                </div>
                <input
                  id="escola"
                  type="text"
                  {...register('escola')}
                  className={`pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${isConvite ? 'bg-gray-50' : ''}`}
                  placeholder="Nome da sua escola"
                  readOnly={isConvite}
                />
              </div>
              {errors.escola && (
                <p className="text-red-500 text-sm mt-1">{errors.escola.message}</p>
              )}
              {isConvite && (
                <p className="text-xs text-gray-500 mt-1">
                  O nome da escola foi preenchido automaticamente pelo convite.
                </p>
              )}
            </div>
            
            <div className="mb-4">
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
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmarSenha">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <input
                  id="confirmarSenha"
                  type="password"
                  {...register('confirmarSenha')}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="Confirme sua senha"
                />
              </div>
              {errors.confirmarSenha && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="codigo-secreto">
                Código de Acesso (opcional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <input
                  id="codigo-secreto"
                  type="text"
                  value={codigoSecreto}
                  onChange={verificarCodigoSecreto}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="Digite o código de acesso especial (se tiver)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Se você possui um código de acesso especial, digite-o aqui.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? 'Processando...' : 'Criar Conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Registro() {
  return <RegistroContent />;
} 