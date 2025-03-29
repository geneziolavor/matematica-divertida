'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaUser, 
  FaEnvelope, 
  FaSchool, 
  FaTrophy, 
  FaMedal,
  FaEdit,
  FaKey,
  FaCog,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaLock,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Dados fictícios de medalhas
const medalhas = [
  { id: 1, nome: "Primeiro Desafio", descricao: "Completou seu primeiro desafio", data: "2023-05-15" },
  { id: 2, nome: "Mestre de Frações", descricao: "Acertou 100% no desafio de frações", data: "2023-05-18" },
  { id: 3, nome: "Explorador", descricao: "Completou desafios de 5 categorias diferentes", data: "2023-05-22" },
];

// Schema de validação para a edição do perfil
const perfilSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  escola: z.string().min(3, 'Nome da escola deve ter pelo menos 3 caracteres'),
});

// Schema de validação para a alteração de senha
const senhaSchema = z.object({
  senhaAtual: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string().min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
}).refine(data => data.novaSenha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
});

type PerfilForm = z.infer<typeof perfilSchema>;
type SenhaForm = z.infer<typeof senhaSchema>;

export default function Perfil() {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mudandoSenha, setMudandoSenha] = useState(false);
  const [perfilSalvo, setPerfilSalvo] = useState(false);
  const [senhaSalva, setSenhaSalva] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Configuração do formulário de edição de perfil
  const { register: registerPerfil, handleSubmit: handleSubmitPerfil, formState: { errors: errorsPerfil }, setValue } = useForm<PerfilForm>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome: '',
      email: '',
      escola: ''
    }
  });

  // Configuração do formulário de alteração de senha
  const { register: registerSenha, handleSubmit: handleSubmitSenha, formState: { errors: errorsSenha }, reset: resetSenha } = useForm<SenhaForm>({
    resolver: zodResolver(senhaSchema)
  });

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Preencher formulário com dados do usuário
  useEffect(() => {
    if (user) {
      setValue('nome', user.nome);
      setValue('email', user.email);
      setValue('escola', user.escola);
    }
  }, [user, setValue]);

  // Manipular envio do formulário de perfil
  const onSubmitPerfil = async (data: PerfilForm) => {
    // Em uma aplicação real, enviaríamos os dados para o servidor
    console.log('Dados do perfil atualizados:', data);
    
    // Simulando sucesso
    setPerfilSalvo(true);
    setTimeout(() => {
      setPerfilSalvo(false);
      setModoEdicao(false);
    }, 2000);
  };

  // Manipular envio do formulário de senha
  const onSubmitSenha = async (data: SenhaForm) => {
    // Em uma aplicação real, enviaríamos os dados para o servidor
    console.log('Dados da senha atualizados:', data);
    
    // Simulando sucesso
    setSenhaSalva(true);
    setTimeout(() => {
      setSenhaSalva(false);
      setMudandoSenha(false);
      resetSenha();
    }, 2000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Seu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna da esquerda - Informações do perfil */}
        <div className="col-span-1">
          <div className="card">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-[var(--primary)] text-white flex items-center justify-center mb-4">
                <FaUser size={40} />
              </div>
              <h2 className="text-xl font-bold text-center">{user.nome}</h2>
              <p className="text-gray-500 flex items-center mt-1">
                {user.tipo === 'professor' ? (
                  <FaChalkboardTeacher className="mr-1" />
                ) : (
                  <FaUserGraduate className="mr-1" />
                )}
                {user.tipo === 'professor' ? 'Professor(a)' : 'Aluno(a)'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <FaEnvelope className="w-5 h-5 mr-3 text-[var(--primary)]" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaSchool className="w-5 h-5 mr-3 text-[var(--primary)]" />
                <span>{user.escola}</span>
              </div>
              {user.tipo === 'aluno' && (
                <div className="flex items-center text-gray-700">
                  <FaTrophy className="w-5 h-5 mr-3 text-[var(--primary)]" />
                  <span>250 pontos</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setModoEdicao(true)}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <FaEdit className="mr-2" /> Editar Perfil
              </button>
            </div>
          </div>
          
          <div className="card mt-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <FaCog className="mr-2" /> Configurações
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={() => setMudandoSenha(true)}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 flex items-center"
              >
                <FaKey className="mr-3 text-[var(--primary)]" />
                Alterar Senha
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 flex items-center text-red-600"
              >
                <FaSignOutAlt className="mr-3" />
                Sair da Conta
              </button>
            </div>
          </div>
        </div>
        
        {/* Coluna do meio - Formulários ou Medalhas */}
        <div className="col-span-1 md:col-span-2">
          {/* Formulário de edição de perfil */}
          {modoEdicao ? (
            <div className="card mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaEdit className="mr-2" /> Editar Perfil
              </h3>
              
              {perfilSalvo && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                  <div className="mr-3 flex-shrink-0">✓</div>
                  <div>Perfil atualizado com sucesso!</div>
                </div>
              )}
              
              <form onSubmit={handleSubmitPerfil(onSubmitPerfil)}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">
                    Nome Completo
                  </label>
                  <input
                    id="nome"
                    type="text"
                    {...registerPerfil('nome')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                  {errorsPerfil.nome && (
                    <p className="text-red-500 text-sm mt-1">{errorsPerfil.nome.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...registerPerfil('email')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                  {errorsPerfil.email && (
                    <p className="text-red-500 text-sm mt-1">{errorsPerfil.email.message}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="escola">
                    Escola
                  </label>
                  <input
                    id="escola"
                    type="text"
                    {...registerPerfil('escola')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                  {errorsPerfil.escola && (
                    <p className="text-red-500 text-sm mt-1">{errorsPerfil.escola.message}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <FaSave className="mr-2" /> Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoEdicao(false)}
                    className="btn-secondary flex items-center"
                  >
                    <FaTimes className="mr-2" /> Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : mudandoSenha ? (
            <div className="card mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaKey className="mr-2" /> Alterar Senha
              </h3>
              
              {senhaSalva && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                  <div className="mr-3 flex-shrink-0">✓</div>
                  <div>Senha atualizada com sucesso!</div>
                </div>
              )}
              
              <form onSubmit={handleSubmitSenha(onSubmitSenha)}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="senhaAtual">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      id="senhaAtual"
                      type="password"
                      {...registerSenha('senhaAtual')}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  {errorsSenha.senhaAtual && (
                    <p className="text-red-500 text-sm mt-1">{errorsSenha.senhaAtual.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="novaSenha">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      id="novaSenha"
                      type="password"
                      {...registerSenha('novaSenha')}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  {errorsSenha.novaSenha && (
                    <p className="text-red-500 text-sm mt-1">{errorsSenha.novaSenha.message}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmarSenha">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      id="confirmarSenha"
                      type="password"
                      {...registerSenha('confirmarSenha')}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  {errorsSenha.confirmarSenha && (
                    <p className="text-red-500 text-sm mt-1">{errorsSenha.confirmarSenha.message}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <FaSave className="mr-2" /> Alterar Senha
                  </button>
                  <button
                    type="button"
                    onClick={() => setMudandoSenha(false)}
                    className="btn-secondary flex items-center"
                  >
                    <FaTimes className="mr-2" /> Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Exibir medalhas quando não estiver em modo de edição
            <>
              {user.tipo === 'aluno' && (
                <div className="card mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center">
                      <FaMedal className="mr-2 text-yellow-500" /> Suas Medalhas
                    </h3>
                    <span className="text-sm text-gray-500">{medalhas.length} medalhas conquistadas</span>
                  </div>
                  
                  <div className="space-y-4">
                    {medalhas.map(medalha => (
                      <div key={medalha.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="mr-4 mt-1 flex-shrink-0">
                          <FaMedal className="text-yellow-500 w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{medalha.nome}</h4>
                          <p className="text-gray-600">{medalha.descricao}</p>
                          <p className="text-sm text-gray-500 mt-1">Conquistada em {medalha.data}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {user.tipo === 'professor' && (
                <div className="card mb-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <FaChalkboardTeacher className="mr-2" /> Resumo do Professor
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-[var(--primary)] bg-opacity-10 rounded-lg text-center">
                      <div className="text-4xl font-bold text-[var(--primary)]">15</div>
                      <div className="text-sm text-gray-600">Alunos</div>
                    </div>
                    <div className="p-4 bg-[var(--accent)] bg-opacity-10 rounded-lg text-center">
                      <div className="text-4xl font-bold text-[var(--accent)]">8</div>
                      <div className="text-sm text-gray-600">Desafios</div>
                    </div>
                    <div className="p-4 bg-green-100 rounded-lg text-center">
                      <div className="text-4xl font-bold text-green-600">73%</div>
                      <div className="text-sm text-gray-600">Taxa de Conclusão</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Como professor, você pode criar desafios personalizados e acompanhar o progresso de seus alunos.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link href="/desafios" className="btn-primary flex items-center">
                      Gerenciar Desafios
                    </Link>
                    <Link href="/professor/alunos/adicionar" className="btn-secondary flex items-center">
                      Adicionar Alunos
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
          
          {(!modoEdicao && !mudandoSenha) && (
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Atividade Recente</h3>
              
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-[var(--primary)] bg-gray-50">
                  <div className="font-medium">Desafio Completado: Frações e Decimais</div>
                  <div className="text-sm text-gray-500">Há 2 dias</div>
                </div>
                
                <div className="p-3 border-l-4 border-[var(--primary)] bg-gray-50">
                  <div className="font-medium">Medalha Conquistada: Mestre de Frações</div>
                  <div className="text-sm text-gray-500">Há 2 dias</div>
                </div>
                
                <div className="p-3 border-l-4 border-[var(--primary)] bg-gray-50">
                  <div className="font-medium">Desafio Completado: Números Primos</div>
                  <div className="text-sm text-gray-500">Há 5 dias</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 