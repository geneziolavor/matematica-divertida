'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaCalculator, 
  FaTrophy, 
  FaChartLine, 
  FaUsers, 
  FaStar, 
  FaLock,
  FaCheck,
  FaRegClock,
  FaPlus,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaMedal,
  FaFileAlt,
  FaCog
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Dados fictícios de desafios
const desafios = [
  {
    id: 1,
    titulo: "Números Primos",
    nivel: "Fácil",
    pontos: 100,
    completado: true,
    categoria: "Aritmética",
    tempo: "15 min",
    descricao: "Descubra e identifique números primos em sequências divertidas."
  },
  {
    id: 2,
    titulo: "Frações e Decimais",
    nivel: "Médio",
    pontos: 150,
    completado: true,
    categoria: "Operações",
    tempo: "20 min",
    descricao: "Converta frações em decimais e resolva problemas práticos."
  },
  {
    id: 3,
    titulo: "Geometria Básica",
    nivel: "Fácil",
    pontos: 100,
    completado: false,
    categoria: "Geometria",
    tempo: "15 min",
    descricao: "Identifique formas geométricas e calcule áreas de figuras planas."
  },
  {
    id: 4,
    titulo: "Equações de 1º Grau",
    nivel: "Médio",
    pontos: 200,
    completado: false,
    categoria: "Álgebra",
    tempo: "25 min",
    descricao: "Resolva equações de primeiro grau e aplique em problemas práticos."
  },
  {
    id: 5,
    titulo: "Problemas de Lógica",
    nivel: "Difícil",
    pontos: 300,
    completado: false,
    bloqueado: true,
    categoria: "Lógica",
    tempo: "30 min",
    descricao: "Resolva problemas de lógica matemática que exigem raciocínio avançado."
  }
];

// Dados fictícios de estatísticas
const estatisticas = {
  pontuacao: 250,
  desafiosCompletados: 2,
  posicaoRanking: 15,
  medalhas: 3
};

// Dados fictícios de alunos para professores
const alunos = [
  { id: 1, nome: "Ana Silva", email: "ana.silva@escola.com", escola: "Escola Exemplo", pontuacao: 350, desafiosCompletados: 4 },
  { id: 2, nome: "João Santos", email: "joao.santos@escola.com", escola: "Escola Exemplo", pontuacao: 280, desafiosCompletados: 3 },
  { id: 3, nome: "Maria Oliveira", email: "maria.oliveira@escola.com", escola: "Escola Exemplo", pontuacao: 420, desafiosCompletados: 5 },
  { id: 4, nome: "Pedro Costa", email: "pedro.costa@escola.com", escola: "Escola Exemplo", pontuacao: 150, desafiosCompletados: 2 },
];

export default function Dashboard() {
  const [filtro, setFiltro] = useState('todos');
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // Definindo interface para os alunos
  interface Aluno {
    id: string;
    nome: string;
    email: string;
    escola: string;
    pontuacao: number;
    desafiosCompletados: number;
  }
  
  const [alunosDoProfessor, setAlunosDoProfessor] = useState<Aluno[]>([]);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Buscar alunos do professor
  useEffect(() => {
    if (user?.tipo === 'professor') {
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
      
      // Combinar as listas e formatar
      const todosAlunos: Aluno[] = [
        ...alunosConvidadosParsed.filter((a: any) => a.professorId === user.id).map((a: any) => ({
          id: a.id,
          nome: a.nome,
          email: a.email,
          escola: a.escola,
          pontuacao: Math.floor(Math.random() * 200) + 100, // valores simulados
          desafiosCompletados: Math.floor(Math.random() * 5) + 1 // valores simulados
        })),
        ...alunosDaEscola.map((a: any) => ({
          id: a.id,
          nome: a.nome,
          email: a.email,
          escola: a.escola,
          pontuacao: Math.floor(Math.random() * 200) + 100, // valores simulados
          desafiosCompletados: Math.floor(Math.random() * 5) + 1 // valores simulados
        })),
        // Incluir dados fictícios também para demonstração
        ...alunos.map(a => ({
          id: String(a.id),
          nome: a.nome,
          email: a.email,
          escola: a.escola,
          pontuacao: a.pontuacao,
          desafiosCompletados: a.desafiosCompletados
        }))
      ];
      
      setAlunosDoProfessor(todosAlunos);
    }
  }, [user]);

  const desafiosFiltrados = desafios.filter(desafio => {
    if (filtro === 'todos') return true;
    if (filtro === 'completados') return desafio.completado;
    if (filtro === 'pendentes') return !desafio.completado && !desafio.bloqueado;
    if (filtro === 'bloqueados') return desafio.bloqueado;
    return true;
  });

  // Verificar se o usuário pode acessar determinada área
  const podeAcessar = (area: string): boolean => {
    if (!user) return false;
    
    switch (area) {
      case 'alunos':
      case 'desafios':
      case 'relatorios':
      case 'resumo':
        return user.tipo === 'professor';
      case 'admin':
        return user.tipo === 'admin';
      default:
        return true;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="card mb-6">
            <div className="text-center mb-4">
              <div className="inline-block rounded-full bg-[var(--primary)] p-4 text-white mb-2">
                {user.tipo === 'professor' ? (
                  <FaChalkboardTeacher size={24} />
                ) : (
                  <FaUserGraduate size={24} />
                )}
              </div>
              <h2 className="font-bold text-xl">Bem-vindo(a), {user.nome.split(' ')[0]}</h2>
              <p className="text-gray-600">{user.escola}</p>
              <p className="text-sm mt-1 px-2 py-1 rounded-full bg-gray-100 inline-block">
                {user.tipo === 'professor' ? 'Professor(a)' : 'Aluno(a)'}
              </p>
            </div>
            
            <div className="space-y-3">
              <Link href="/dashboard" className="flex items-center p-2 bg-[var(--primary)] text-white rounded-md">
                <FaChartLine className="mr-3" />
                Dashboard
              </Link>
              <Link href="/desafios" className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                <FaCalculator className="mr-3 text-[var(--primary)]" />
                Desafios
              </Link>
              <Link href="/ranking" className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                <FaTrophy className="mr-3 text-[var(--primary)]" />
                Ranking
              </Link>
              <Link href="/perfil" className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                <FaUsers className="mr-3 text-[var(--primary)]" />
                Perfil
              </Link>
              {user.tipo === 'professor' && (
                <Link href="/professor/gerenciar" className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                  <FaChalkboardTeacher className="mr-3 text-[var(--primary)]" />
                  Gerenciar Alunos
                </Link>
              )}
            </div>
          </div>
          
          {user.tipo === 'aluno' && (
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Suas Estatísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">{estatisticas.pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">{estatisticas.desafiosCompletados}</div>
                  <div className="text-sm text-gray-600">Desafios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">#{estatisticas.posicaoRanking}</div>
                  <div className="text-sm text-gray-600">Ranking</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">{estatisticas.medalhas}</div>
                  <div className="text-sm text-gray-600">Medalhas</div>
                </div>
              </div>
            </div>
          )}
          
          {user.tipo === 'professor' && (
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Resumo da Turma</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Alunos</span>
                  <span className="font-bold text-[var(--primary)]">{alunosDoProfessor.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Desafios Criados</span>
                  <span className="font-bold text-[var(--primary)]">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Média de Pontuação</span>
                  <span className="font-bold text-[var(--primary)]">
                    {alunosDoProfessor.length > 0 
                      ? Math.round(alunosDoProfessor.reduce((acc, aluno) => acc + (aluno.pontuacao || 0), 0) / alunosDoProfessor.length)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Conteúdo principal */}
        <div className="col-span-1 md:col-span-3">
          {user.tipo === 'aluno' ? (
            // Dashboard do Aluno
            <>
              <div className="card mb-6">
                <h1 className="text-2xl font-bold mb-6">Seus Desafios</h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <button 
                    className={`px-4 py-2 rounded-full text-sm ${filtro === 'todos' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                    onClick={() => setFiltro('todos')}
                  >
                    Todos
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-full text-sm ${filtro === 'completados' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                    onClick={() => setFiltro('completados')}
                  >
                    Completados
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-full text-sm ${filtro === 'pendentes' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                    onClick={() => setFiltro('pendentes')}
                  >
                    Pendentes
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-full text-sm ${filtro === 'bloqueados' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                    onClick={() => setFiltro('bloqueados')}
                  >
                    Bloqueados
                  </button>
                </div>
                
                <div className="space-y-4">
                  {desafiosFiltrados.map((desafio) => (
                    <div key={desafio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-bold text-lg">{desafio.titulo}</h3>
                            {desafio.completado && (
                              <span className="ml-2 bg-[var(--success)] text-white px-2 py-1 rounded-full text-xs flex items-center">
                                <FaCheck className="mr-1" /> Completado
                              </span>
                            )}
                            {desafio.bloqueado && (
                              <span className="ml-2 bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center">
                                <FaLock className="mr-1" /> Bloqueado
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mt-1">{desafio.descricao}</p>
                          
                          <div className="flex flex-wrap mt-3 gap-2">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                              <FaStar className="mr-1 text-[var(--accent)]" /> {desafio.nivel}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                              <FaTrophy className="mr-1 text-[var(--primary)]" /> {desafio.pontos} pts
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center">
                              <FaRegClock className="mr-1 text-[var(--secondary)]" /> {desafio.tempo}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          {!desafio.bloqueado && (
                            <Link 
                              href={`/desafios/${desafio.id}`}
                              className={`btn-${desafio.completado ? 'secondary' : 'primary'}`}
                            >
                              {desafio.completado ? 'Refazer' : 'Iniciar'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {desafiosFiltrados.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum desafio encontrado para o filtro selecionado.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Próxima Competição</h2>
                <div className="bg-[var(--accent)] bg-opacity-20 p-4 rounded-lg">
                  <h3 className="font-bold">Olimpíada de Matemática</h3>
                  <p className="text-gray-700 mt-1">Prepare-se para a próxima competição entre escolas!</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Em 15 dias</span>
                    <Link href="/competicoes" className="btn-secondary text-sm">
                      Saiba mais
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Dashboard do Professor
            <>
              <div className="card mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Seus Alunos</h1>
                  <Link href="/professor/alunos/adicionar" className="btn-primary flex items-center">
                    <FaPlus className="mr-2" /> Adicionar Aluno
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  {alunosDoProfessor.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pontuação
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Desafios
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {alunosDoProfessor.map((aluno) => (
                          <tr key={aluno.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center mr-3">
                                  <FaUserGraduate />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{aluno.nome}</div>
                                  <div className="text-sm text-gray-500">{aluno.escola}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{aluno.pontuacao} pontos</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{aluno.desafiosCompletados} completados</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link 
                                href={`/professor/alunos/${aluno.id}`}
                                className="text-[var(--primary)] hover:text-[var(--secondary)] mr-4"
                              >
                                Detalhes
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">Você ainda não tem alunos cadastrados.</p>
                      <Link href="/professor/alunos/adicionar" className="mt-4 btn-primary inline-flex items-center">
                        <FaPlus className="mr-2" /> Adicionar Aluno
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">Desafios Recentes</h2>
                  <div className="space-y-3">
                    {desafios.slice(0, 3).map((desafio) => (
                      <div key={desafio.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <h3 className="font-medium">{desafio.titulo}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{desafio.nivel} • {desafio.pontos} pts</span>
                          <Link href={`/professor/desafios/${desafio.id}`} className="text-[var(--primary)] text-sm hover:underline">
                            Editar
                          </Link>
                        </div>
                      </div>
                    ))}
                    <Link href="/professor/desafios/criar" className="btn-secondary w-full text-center flex items-center justify-center">
                      <FaPlus className="mr-2" /> Criar Novo Desafio
                    </Link>
                  </div>
                </div>
                
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">Desempenho da Turma</h2>
                  <div className="bg-[var(--accent)] bg-opacity-20 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Taxa de Conclusão</h3>
                        <p className="text-gray-600 text-sm">Desafios concluídos vs. atribuídos</p>
                      </div>
                      <div className="text-2xl font-bold text-[var(--primary)]">68%</div>
                    </div>
                  </div>
                  
                  <Link href="/professor/relatorios" className="btn-secondary w-full text-center">
                    Ver Relatório Completo
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menu lateral */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Menu</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/desafios" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTrophy className="mr-3 text-[var(--primary)]" />
                <span>Desafios</span>
              </Link>
            </li>
            
            <li>
              <Link 
                href="/ranking" 
                className="flex items-center p-2 rounded-lg hover:bg-gray-100"
              >
                <FaMedal className="mr-3 text-[var(--accent)]" />
                <span>Ranking</span>
              </Link>
            </li>
            
            {podeAcessar('resumo') && (
              <li>
                <Link 
                  href="/professor/resumo" 
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaChartLine className="mr-3 text-green-600" />
                  <span>Resumo da Turma</span>
                </Link>
              </li>
            )}
            
            {podeAcessar('alunos') && (
              <li>
                <Link 
                  href="/professor/gerenciar" 
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaUsers className="mr-3 text-blue-600" />
                  <span>Gerenciar Alunos</span>
                </Link>
              </li>
            )}
            
            {podeAcessar('desafios') && (
              <li>
                <Link 
                  href="/professor/desafios/criar" 
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaPlus className="mr-3 text-purple-600" />
                  <span>Criar Desafio</span>
                </Link>
              </li>
            )}
            
            {podeAcessar('relatorios') && (
              <li>
                <Link 
                  href="/professor/relatorios" 
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaFileAlt className="mr-3 text-amber-600" />
                  <span>Relatórios</span>
                </Link>
              </li>
            )}

            {podeAcessar('admin') && (
              <li>
                <Link 
                  href="/admin/config" 
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                >
                  <FaCog className="mr-3 text-gray-600" />
                  <span>Configurações</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Blocos do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {podeAcessar('admin') && (
          <Link href="/admin/config" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-gray-100">
                <FaCog className="text-gray-600 text-xl" />
              </div>
              <span className="text-sm text-gray-500">Administração</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Configurações do Site</h2>
            <p className="text-gray-600 mb-4">Configure informações de contato e outras configurações do site.</p>
            <span className="text-gray-600 font-medium">Configurar →</span>
          </Link>
        )}
      </div>
    </div>
  );
} 