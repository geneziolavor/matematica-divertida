'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaUserGraduate, 
  FaTrophy, 
  FaChartBar, 
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaBook,
  FaSearch,
  FaDownload,
  FaFilter
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface Aluno {
  id: string;
  nome: string;
  email: string;
  pontuacao: number;
  desafiosCompletados: number;
  ultimoAcesso?: string;
}

interface Desafio {
  id: string;
  titulo: string;
  completados: number;
  mediaAcertos: number;
  tempoMedio: number;
}

export default function Relatorios() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroDesafio, setFiltroDesafio] = useState('todos');
  const [periodoDados, setPeriodoDados] = useState('30dias');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar se não estiver autenticado ou não for professor
  useEffect(() => {
    if (!isLoading && (!user || user.tipo !== 'professor')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      if (!user) return;
      
      setCarregando(true);
      try {
        // Simular atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Buscar alunos adicionados manualmente (do localStorage)
        const alunosConvidados = localStorage.getItem('matematica_divertida_alunos_convidados');
        const alunosConvidadosParsed = alunosConvidados ? JSON.parse(alunosConvidados) : [];
        
        // Buscar usuários registrados
        const usuariosRegistrados = localStorage.getItem('matematica_divertida_users');
        const usuariosRegistradosParsed = usuariosRegistrados ? JSON.parse(usuariosRegistrados) : [];
        
        // Filtrar alunos da mesma escola do professor
        const alunosDaEscola = usuariosRegistradosParsed.filter(
          (u: any) => u.tipo === 'aluno' && u.escola === user.escola
        );
        
        // Combinar as listas
        const todosAlunos: Aluno[] = [
          ...alunosConvidadosParsed
            .filter((a: any) => a.professorId === user.id)
            .map((a: any) => ({
              id: a.id,
              nome: a.nome,
              email: a.email,
              pontuacao: Math.floor(Math.random() * 200) + 100, // simulado
              desafiosCompletados: Math.floor(Math.random() * 5) + 1, // simulado
              ultimoAcesso: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // simulado
            })),
          ...alunosDaEscola.map((a: any) => ({
            id: a.id,
            nome: a.nome,
            email: a.email,
            pontuacao: Math.floor(Math.random() * 200) + 100, // simulado
            desafiosCompletados: Math.floor(Math.random() * 5) + 1, // simulado
            ultimoAcesso: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // simulado
          })),
          // Dados fictícios para demonstração
          {
            id: 'aluno_demo1',
            nome: 'Ana Silva',
            email: 'ana.silva@escola.com',
            pontuacao: 350,
            desafiosCompletados: 4,
            ultimoAcesso: '2023-05-15'
          },
          {
            id: 'aluno_demo2',
            nome: 'Pedro Costa',
            email: 'pedro.costa@escola.com',
            pontuacao: 280,
            desafiosCompletados: 3,
            ultimoAcesso: '2023-05-18'
          },
          {
            id: 'aluno_demo3',
            nome: 'Mariana Santos',
            email: 'mariana.santos@escola.com',
            pontuacao: 420,
            desafiosCompletados: 5,
            ultimoAcesso: '2023-05-20'
          }
        ];
        
        setAlunos(todosAlunos);
        
        // Desafios (dados fictícios)
        const desafiosMock: Desafio[] = [
          {
            id: 'operacoes',
            titulo: 'Operações Básicas',
            completados: 15,
            mediaAcertos: 78,
            tempoMedio: 325
          },
          {
            id: 'fracao',
            titulo: 'Frações',
            completados: 9,
            mediaAcertos: 65,
            tempoMedio: 450
          },
          {
            id: 'geometria',
            titulo: 'Geometria Básica',
            completados: 12,
            mediaAcertos: 72,
            tempoMedio: 380
          },
          {
            id: 'algebra',
            titulo: 'Álgebra Iniciante',
            completados: 7,
            mediaAcertos: 60,
            tempoMedio: 510
          },
          {
            id: 'problemas',
            titulo: 'Resolução de Problemas',
            completados: 10,
            mediaAcertos: 68,
            tempoMedio: 475
          }
        ];
        
        setDesafios(desafiosMock);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    if (user) {
      carregarDados();
    }
  }, [user]);

  // Formatar tempo em minutos e segundos
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos}m ${segsRestantes}s`;
  };

  if (isLoading || carregando) {
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

  // Calcular estatísticas
  const totalAlunos = alunos.length;
  const mediaPontuacao = totalAlunos > 0 
    ? Math.round(alunos.reduce((acc, aluno) => acc + aluno.pontuacao, 0) / totalAlunos) 
    : 0;
  const totalDesafiosCompletados = alunos.reduce((acc, aluno) => acc + aluno.desafiosCompletados, 0);
  const alunosAtivos = alunos.filter(aluno => 
    aluno.ultimoAcesso && new Date(aluno.ultimoAcesso).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para Dashboard
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios da Turma</h1>
        <div className="flex gap-2">
          <button className="btn flex items-center">
            <FaDownload className="mr-2" /> Exportar Dados
          </button>
          <div className="relative">
            <select 
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[var(--primary)] focus:outline-none cursor-pointer"
              value={periodoDados}
              onChange={(e) => setPeriodoDados(e.target.value)}
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
              <option value="todos">Todo o período</option>
            </select>
            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      {/* Resumo */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-6">Resumo da Turma</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Total de Alunos</h3>
            <p className="text-3xl font-bold text-blue-700">{totalAlunos}</p>
            <p className="text-sm text-gray-500 mt-2">{alunosAtivos} alunos ativos na última semana</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FaTrophy className="text-purple-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Média</span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Pontuação Média</h3>
            <p className="text-3xl font-bold text-purple-700">{mediaPontuacao}</p>
            <p className="text-sm text-gray-500 mt-2">pontos por aluno</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Desafios Completados</h3>
            <p className="text-3xl font-bold text-green-700">{totalDesafiosCompletados}</p>
            <p className="text-sm text-gray-500 mt-2">por todos os alunos</p>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <FaBook className="text-amber-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Média</span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Desafios por Aluno</h3>
            <p className="text-3xl font-bold text-amber-700">
              {totalAlunos > 0 ? Math.round((totalDesafiosCompletados / totalAlunos) * 10) / 10 : 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">média de desafios por aluno</p>
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-4">Distribuição de Pontuações</h3>
        <div className="h-72 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Gráfico de distribuição de pontuações será exibido aqui</p>
        </div>
      </div>
      
      {/* Desempenho por Desafio */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Desempenho por Desafio</h2>
          <div className="relative">
            <select 
              className="appearance-none border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[var(--primary)] focus:outline-none cursor-pointer"
              value={filtroDesafio}
              onChange={(e) => setFiltroDesafio(e.target.value)}
            >
              <option value="todos">Todos os desafios</option>
              <option value="populares">Mais populares</option>
              <option value="dificeis">Mais difíceis</option>
              <option value="faceis">Mais fáceis</option>
            </select>
            <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desafio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completados
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Média de Acertos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Médio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Conclusão
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {desafios.map((desafio) => (
                <tr key={desafio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-[var(--primary)] bg-opacity-10 h-8 w-8 rounded-lg flex items-center justify-center mr-3">
                        <FaChartBar className="text-[var(--primary)]" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{desafio.titulo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {desafio.completados} alunos
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${desafio.mediaAcertos}%` }}
                        ></div>
                      </div>
                      <span>{desafio.mediaAcertos}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatarTempo(desafio.tempoMedio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.round((desafio.completados / totalAlunos) * 100)}%` }}
                        ></div>
                      </div>
                      <span>{Math.round((desafio.completados / totalAlunos) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Alunos com Melhor Desempenho */}
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Alunos com Melhor Desempenho</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontuação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desafios Completados
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acesso
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alunos
                .sort((a, b) => b.pontuacao - a.pontuacao)
                .slice(0, 5)
                .map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-[var(--accent)] bg-opacity-10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                          <FaUserGraduate className="text-[var(--accent)]" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{aluno.nome}</div>
                          <div className="text-sm text-gray-500">{aluno.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-purple-700">{aluno.pontuacao}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {aluno.desafiosCompletados} desafios
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {aluno.ultimoAcesso ? aluno.ultimoAcesso : 'Nunca acessou'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
          <Link 
            href="/professor/gerenciar" 
            className="text-[var(--primary)] hover:underline flex items-center w-fit"
          >
            Ver todos os alunos <FaArrowLeft className="ml-2 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
} 