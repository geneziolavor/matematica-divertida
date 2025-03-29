'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaUser, 
  FaEnvelope, 
  FaSchool, 
  FaTrophy, 
  FaSearch,
  FaPlus,
  FaUserGraduate,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEllipsisV,
  FaChartLine,
  FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface Aluno {
  id: string;
  nome: string;
  email: string;
  escola: string;
  pontuacao: number;
  desafiosCompletados: number;
  ultimoAcesso?: string;
}

type SortField = 'nome' | 'pontuacao' | 'desafiosCompletados' | 'ultimoAcesso';
type SortOrder = 'asc' | 'desc';

export default function GerenciarAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [carregando, setCarregando] = useState(true);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar para login se não estiver autenticado ou não for professor
  useEffect(() => {
    if (!isLoading && (!user || user.tipo !== 'professor')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Carregar alunos
  useEffect(() => {
    const buscarAlunos = async () => {
      if (!user) return;
      
      setCarregando(true);
      try {
        // Simulando atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Buscar alunos adicionados manualmente
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
              escola: a.escola,
              pontuacao: Math.floor(Math.random() * 200) + 100, // simulado
              desafiosCompletados: Math.floor(Math.random() * 5) + 1, // simulado
              ultimoAcesso: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // simulado
            })),
          ...alunosDaEscola.map((a: any) => ({
            id: a.id,
            nome: a.nome,
            email: a.email,
            escola: a.escola,
            pontuacao: Math.floor(Math.random() * 200) + 100, // simulado
            desafiosCompletados: Math.floor(Math.random() * 5) + 1, // simulado
            ultimoAcesso: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] // simulado
          })),
          // Dados fictícios para demonstração
          {
            id: 'aluno_demo1',
            nome: 'Ana Silva',
            email: 'ana.silva@escola.com',
            escola: user.escola,
            pontuacao: 350,
            desafiosCompletados: 4,
            ultimoAcesso: '2023-05-15'
          },
          {
            id: 'aluno_demo2',
            nome: 'Pedro Costa',
            email: 'pedro.costa@escola.com',
            escola: user.escola,
            pontuacao: 280,
            desafiosCompletados: 3,
            ultimoAcesso: '2023-05-18'
          }
        ];
        
        setAlunos(todosAlunos);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    if (user) {
      buscarAlunos();
    }
  }, [user]);

  // Função para ordenar alunos
  const ordenarAlunos = (a: Aluno, b: Aluno) => {
    if (sortField === 'nome') {
      return sortOrder === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    } else {
      const valorA = a[sortField] ?? 0;
      const valorB = b[sortField] ?? 0;
      
      if (valorA === valorB) return 0;
      
      if (sortOrder === 'asc') {
        return valorA < valorB ? -1 : 1;
      } else {
        return valorA > valorB ? -1 : 1;
      }
    }
  };

  // Função para alternar ordenação
  const alternarOrdenacao = (campo: SortField) => {
    if (sortField === campo) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(campo);
      setSortOrder('asc');
    }
  };

  // Filtrar alunos com base na pesquisa
  const alunosFiltrados = alunos.filter(aluno => 
    aluno.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    aluno.email.toLowerCase().includes(pesquisa.toLowerCase())
  ).sort(ordenarAlunos);

  // Renderizar ícone de ordenação
  const renderSortIcon = (campo: SortField) => {
    if (sortField !== campo) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <FaSortUp className="ml-1 text-[var(--primary)]" /> : 
      <FaSortDown className="ml-1 text-[var(--primary)]" />;
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="flex items-center text-[var(--primary)] hover:underline">
          <FaArrowLeft className="mr-2" /> Voltar para Dashboard
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Alunos</h1>
        <Link href="/professor/alunos/adicionar" className="btn-primary flex items-center">
          <FaPlus className="mr-2" /> Adicionar Aluno
        </Link>
      </div>
      
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Barra de pesquisa */}
          <div className="relative w-full md:w-96">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch />
            </div>
            <input
              type="text"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="Pesquisar alunos..."
            />
          </div>
          
          {/* Estatísticas */}
          <div className="flex gap-4">
            <div className="bg-[var(--primary)] bg-opacity-10 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Total de Alunos</div>
              <div className="text-xl font-bold text-[var(--primary)]">{alunos.length}</div>
            </div>
            <div className="bg-[var(--accent)] bg-opacity-10 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Média de Pontos</div>
              <div className="text-xl font-bold text-[var(--accent)]">
                {alunos.length > 0 
                  ? Math.round(alunos.reduce((acc, aluno) => acc + aluno.pontuacao, 0) / alunos.length) 
                  : 0}
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center cursor-pointer"
                    onClick={() => alternarOrdenacao('nome')}
                  >
                    Aluno
                    {renderSortIcon('nome')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center cursor-pointer"
                    onClick={() => alternarOrdenacao('pontuacao')}
                  >
                    Pontuação
                    {renderSortIcon('pontuacao')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center cursor-pointer"
                    onClick={() => alternarOrdenacao('desafiosCompletados')}
                  >
                    Desafios
                    {renderSortIcon('desafiosCompletados')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center cursor-pointer"
                    onClick={() => alternarOrdenacao('ultimoAcesso')}
                  >
                    Último Acesso
                    {renderSortIcon('ultimoAcesso')}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alunosFiltrados.length > 0 ? (
                alunosFiltrados.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center mr-3">
                          <FaUserGraduate />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{aluno.nome}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1" /> {aluno.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[var(--primary)]">{aluno.pontuacao} pontos</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-[var(--primary)] h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, (aluno.pontuacao / 500) * 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{aluno.desafiosCompletados} completados</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{aluno.ultimoAcesso}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/professor/alunos/${aluno.id}`}
                          className="text-[var(--primary)] hover:text-[var(--secondary)] px-2 py-1 rounded hover:bg-gray-100"
                          title="Ver Detalhes"
                        >
                          <FaEye />
                        </Link>
                        <Link 
                          href={`/professor/relatorios/aluno/${aluno.id}`}
                          className="text-[var(--accent)] hover:text-[var(--accent-dark)] px-2 py-1 rounded hover:bg-gray-100"
                          title="Ver Relatório"
                        >
                          <FaChartLine />
                        </Link>
                        <div className="relative group">
                          <button 
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                            title="Mais Opções"
                          >
                            <FaEllipsisV />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {pesquisa ? (
                      <>
                        <p>Nenhum aluno encontrado para a pesquisa "{pesquisa}".</p>
                        <button 
                          className="mt-2 text-[var(--primary)] hover:underline"
                          onClick={() => setPesquisa('')}
                        >
                          Limpar pesquisa
                        </button>
                      </>
                    ) : (
                      <>
                        <p>Você ainda não tem alunos cadastrados.</p>
                        <Link href="/professor/alunos/adicionar" className="mt-2 inline-flex items-center text-[var(--primary)] hover:underline">
                          <FaPlus className="mr-1" /> Adicionar Aluno
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold text-lg mb-4">Dicas de Gerenciamento</h2>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-[var(--primary)] bg-gray-50">
              <h3 className="font-medium">Adicione alunos facilmente</h3>
              <p className="text-sm text-gray-600">
                Use o link de convite para adicionar vários alunos de uma vez ou adicione manualmente para mais controle.
              </p>
            </div>
            <div className="p-3 border-l-4 border-[var(--primary)] bg-gray-50">
              <h3 className="font-medium">Monitore o progresso</h3>
              <p className="text-sm text-gray-600">
                Acompanhe o desempenho dos alunos através dos relatórios detalhados disponíveis.
              </p>
            </div>
            <div className="p-3 border-l-4 border-[var(--primary)] bg-gray-50">
              <h3 className="font-medium">Customize desafios</h3>
              <p className="text-sm text-gray-600">
                Crie desafios personalizados para atender às necessidades específicas da sua turma.
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="font-bold text-lg mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/professor/alunos/adicionar" className="btn-secondary flex items-center justify-center">
              <FaPlus className="mr-2" /> Adicionar Novo Aluno
            </Link>
            <Link href="/desafios" className="border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center">
              <FaTrophy className="mr-2 text-[var(--accent)]" /> Gerenciar Desafios
            </Link>
            <Link href="/professor/relatorios" className="border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center">
              <FaChartLine className="mr-2 text-[var(--primary)]" /> Ver Relatórios da Turma
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 