'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaSchool, 
  FaUserPlus, 
  FaLink,
  FaCopy,
  FaCheckCircle,
  FaUserGraduate
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Schema de validação para adição manual
const adicionarAlunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  escola: z.string().min(3, 'Nome da escola deve ter pelo menos 3 caracteres'),
});

type AdicionarAlunoFormData = z.infer<typeof adicionarAlunoSchema>;

export default function AdicionarAluno() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [metodo, setMetodo] = useState<'manual' | 'convite'>('manual');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [alunoCriado, setAlunoCriado] = useState<AdicionarAlunoFormData | null>(null);

  // Para o método manual
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AdicionarAlunoFormData>({
    resolver: zodResolver(adicionarAlunoSchema),
    defaultValues: {
      escola: user?.escola || '',
    }
  });

  // Redirecionar se não for professor
  if (!isLoading && user?.tipo !== 'professor') {
    router.push('/dashboard');
    return null;
  }

  // Link de convite (simulado)
  const linkConvite = `http://localhost:3000/registro?convite=${btoa(user?.escola || '')}&tipo=aluno`;

  // Função para copiar o link para a área de transferência
  const copiarLink = () => {
    navigator.clipboard.writeText(linkConvite)
      .then(() => {
        setLinkCopiado(true);
        setTimeout(() => setLinkCopiado(false), 3000);
      })
      .catch(err => {
        console.error('Erro ao copiar:', err);
      });
  };

  // Função para adicionar aluno manualmente
  const onSubmit = async (data: AdicionarAlunoFormData) => {
    setSubmitError('');
    
    try {
      // Simulando a adição de um aluno
      console.log('Dados do aluno:', data);
      
      // Armazenar localmente uma lista de alunos convidados pelo professor
      const alunosConvidados = localStorage.getItem('matematica_divertida_alunos_convidados');
      const alunos = alunosConvidados ? JSON.parse(alunosConvidados) : [];
      
      // Adicionar aluno à lista com ID do professor
      const novoAluno = {
        ...data,
        id: `aluno_${Date.now()}`,
        professorId: user?.id,
        senhaTemporaria: Math.random().toString(36).substring(2, 8)
      };
      
      alunos.push(novoAluno);
      localStorage.setItem('matematica_divertida_alunos_convidados', JSON.stringify(alunos));
      
      setAlunoCriado(data);
      setSubmitSuccess(true);
      reset();
      
      // Após 3 segundos, limpar a mensagem de sucesso
      setTimeout(() => {
        setSubmitSuccess(false);
        setAlunoCriado(null);
      }, 5000);
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      setSubmitError('Ocorreu um erro ao adicionar o aluno. Por favor, tente novamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para Dashboard
        </Link>
      </div>
      
      <div className="card mb-8">
        <h1 className="text-2xl font-bold mb-6 text-[var(--text)]">Adicionar Alunos</h1>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-4 font-medium border-b-2 -mb-px transition-colors ${
              metodo === 'manual' 
                ? 'border-[var(--primary)] text-[var(--primary)]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMetodo('manual')}
          >
            <FaUserPlus className="inline-block mr-2" />
            Adicionar Manualmente
          </button>
          <button
            className={`py-3 px-4 font-medium border-b-2 -mb-px transition-colors ${
              metodo === 'convite' 
                ? 'border-[var(--primary)] text-[var(--primary)]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMetodo('convite')}
          >
            <FaLink className="inline-block mr-2" />
            Convidar por Link
          </button>
        </div>
        
        {metodo === 'manual' ? (
          <div>
            {submitSuccess && alunoCriado && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md flex items-start">
                <FaCheckCircle className="mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Aluno adicionado com sucesso!</p>
                  <p className="text-sm mt-1">
                    {alunoCriado.nome} ({alunoCriado.email}) foi adicionado à sua turma.
                    Uma senha temporária foi gerada e enviada para o email do aluno.
                  </p>
                </div>
              </div>
            )}
            
            {submitError && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="Nome do aluno"
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
                    placeholder="email.do.aluno@exemplo.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div className="mb-6">
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
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Nome da escola"
                  />
                </div>
                {errors.escola && (
                  <p className="text-red-500 text-sm mt-1">{errors.escola.message}</p>
                )}
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="btn-primary py-3 px-8 flex items-center justify-center mx-auto"
                >
                  <FaUserPlus className="mr-2" /> Adicionar Aluno
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  Uma senha temporária será gerada e enviada para o email do aluno
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--accent)] bg-opacity-20 text-[var(--primary)] mb-6">
              <FaUserGraduate size={32} />
            </div>
            
            <h2 className="text-xl font-bold mb-2">Convide Alunos</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Compartilhe este link com seus alunos. Quando eles clicarem, serão direcionados para a página de registro com os campos de escola e tipo pré-preenchidos.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between mb-6 max-w-lg mx-auto">
              <div className="truncate text-sm text-gray-600 flex-grow text-left">
                {linkConvite}
              </div>
              <button 
                onClick={copiarLink}
                className="ml-4 flex-shrink-0 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {linkCopiado ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaCopy className="text-gray-500" />
                )}
              </button>
            </div>
            
            {linkCopiado && (
              <p className="text-green-600 mb-4">Link copiado para a área de transferência!</p>
            )}
            
            <div className="flex flex-col items-center">
              <button 
                onClick={copiarLink} 
                className="btn-primary flex items-center justify-center"
              >
                {linkCopiado ? (
                  <>
                    <FaCheckCircle className="mr-2" /> Copiado!
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-2" /> Copiar Link de Convite
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 mt-4">
                Os alunos serão automaticamente vinculados à sua turma quando se registrarem usando este link
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Dicas para adicionar alunos</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-3 w-8 h-8 rounded-full bg-[var(--primary)] bg-opacity-10 flex items-center justify-center text-[var(--primary)]">
              1
            </div>
            <div>
              <h3 className="font-medium">Adição manual</h3>
              <p className="text-sm text-gray-600">
                Use quando você precisa adicionar um pequeno número de alunos. Uma senha temporária é enviada por email.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 w-8 h-8 rounded-full bg-[var(--primary)] bg-opacity-10 flex items-center justify-center text-[var(--primary)]">
              2
            </div>
            <div>
              <h3 className="font-medium">Link de convite</h3>
              <p className="text-sm text-gray-600">
                Ideal para turmas grandes. Compartilhe o link com seus alunos e eles poderão se registrar por conta própria.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-3 w-8 h-8 rounded-full bg-[var(--primary)] bg-opacity-10 flex items-center justify-center text-[var(--primary)]">
              3
            </div>
            <div>
              <h3 className="font-medium">Organização</h3>
              <p className="text-sm text-gray-600">
                Todos os alunos adicionados estarão disponíveis na sua lista de alunos no dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 