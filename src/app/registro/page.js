'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Componente que vai lidar com o formulário e os parâmetros da URL
function RegistroForm() {
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isConvite, setIsConvite] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'aluno',
    escola: ''
  });
  const [errors, setErrors] = useState({});
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();

  // Verificar parâmetros da URL na inicialização do componente
  useEffect(() => {
    // Função segura para obter parâmetros da URL
    const getURLParams = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return {
          convite: params.get('convite'),
          tipo: params.get('tipo')
        };
      }
      return { convite: null, tipo: null };
    };

    const { convite, tipo } = getURLParams();
    
    if (convite) {
      try {
        // Decodificar o parâmetro de convite (simulado)
        const escolaConvite = atob(convite);
        setFormData(prev => ({ ...prev, escola: escolaConvite }));
        setIsConvite(true);
      } catch (error) {
        console.error('Erro ao decodificar convite:', error);
      }
    }
    
    if (tipo && (tipo === 'aluno' || tipo === 'professor')) {
      setFormData(prev => ({ ...prev, tipo }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar nome
    if (!formData.nome || formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    // Validar email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar senha
    if (!formData.senha || formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    // Validar confirmarSenha
    if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }
    
    // Validar escola
    if (!formData.escola || formData.escola.length < 3) {
      newErrors.escola = 'Nome da escola deve ter pelo menos 3 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitError('');
    
    try {
      await registerUser({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        tipo: formData.tipo,
        escola: formData.escola
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
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
          <form onSubmit={handleSubmit}>
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuário
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="aluno"
                    checked={formData.tipo === 'aluno'}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={isConvite && formData.tipo !== 'aluno'}
                  />
                  Aluno
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipo"
                    value="professor"
                    checked={formData.tipo === 'professor'}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={isConvite && formData.tipo !== 'professor'}
                  />
                  Professor
                </label>
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
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder={formData.tipo === 'aluno' ? "Seu nome completo" : "Nome do professor"}
                />
              </div>
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="seu.email@exemplo.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="escola">
                Escola
              </label>
              <div className="relative">
                <input
                  id="escola"
                  name="escola"
                  type="text"
                  value={formData.escola}
                  onChange={handleChange}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${isConvite ? 'bg-gray-50' : ''}`}
                  placeholder="Nome da sua escola"
                  readOnly={isConvite}
                />
              </div>
              {errors.escola && (
                <p className="text-red-500 text-sm mt-1">{errors.escola}</p>
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
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="Sua senha"
                />
              </div>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmarSenha">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder="Confirme sua senha"
                />
              </div>
              {errors.confirmarSenha && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>
              )}
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

// Exportamos o componente principal
export default function Registro() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto my-12 px-4 text-center">Carregando formulário de registro...</div>}>
      <RegistroForm />
    </Suspense>
  );
} 