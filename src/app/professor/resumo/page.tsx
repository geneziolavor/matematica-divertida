'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaUserGraduate, 
  FaBook, 
  FaTrophy,
  FaChartLine,
  FaUsers,
  FaLayerGroup,
  FaCalendarAlt,
  FaChartBar,
  FaArrowRight,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function ResumoProfessor() {
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    totalAlunos: 0,
    desafiosDisponiveis: 0,
    desafiosCompletados: 0,
    mediaDesafiosPorAluno: 0,
    mediaPontuacao: 0,
    ultimaAtividade: ''
  });
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar se não estiver autenticado ou não for professor
  useEffect(() => {
    if (!isLoading && (!user || user.tipo !== 'professor')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  // Carregar estatísticas
  useEffect(() => {
    const carregarEstatisticas = async () => {
      if (!user) return;
      
      try {
        // Simulando atraso de rede
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Obter alunos
        const alunosConvidados = localStorage.getItem('matematica_divertida_alunos_convidados');
        const alunosConvidadosParsed = alunosConvidados ? JSON.parse(alunosConvidados) : [];
        
        // Filtrar apenas alunos deste professor
        const alunosDoProfessor = alunosConvidadosParsed.filter(
          (a: any) => a.professorId === user.id
        );
        
        // Obter usuários registrados
        const usuariosRegistrados = localStorage.getItem('matematica_divertida_users');
        const usuariosRegistradosParsed = usuariosRegistrados ? JSON.parse(usuariosRegistrados) : [];
        
        // Filtrar alunos da mesma escola
        const alunosDaEscola = usuariosRegistradosParsed.filter(
          (u: any) => u.tipo === 'aluno' && u.escola === user.escola
        );
        
        // Total de alunos
        const totalAlunos = alunosDoProfessor.length + alunosDaEscola.length;
        
        // Obter desafios
        const desafiosProfessor = localStorage.getItem('desafiosProfessor');
        const desafiosProfessorParsed = desafiosProfessor ? JSON.parse(desafiosProfessor) : [];
        
        // Filtrar desafios deste professor
        const desafiosDoProfessor = desafiosProfessorParsed.filter(
          (d: any) => d.professorId === user.id
        );
        
        // Obter pontuações
        const pontuacoes = localStorage.getItem('pontuacoes');
        const pontuacoesParsed = pontuacoes ? JSON.parse(pontuacoes) : [];
        
        // Simular alguns dados aleatórios para estatísticas
        const desafiosCompletados = Math.floor(Math.random() * 50) + 30;
        const mediaPontuacao = Math.floor(Math.random() * 300) + 150;
        
        // Atualizar estatísticas
        setEstatisticas({
          totalAlunos: totalAlunos,
          desafiosDisponiveis: 15 + desafiosDoProfessor.length,
          desafiosCompletados: desafiosCompletados,
          mediaDesafiosPorAluno: totalAlunos > 0 ? Math.round((desafiosCompletados / totalAlunos) * 10) / 10 : 0,
          mediaPontuacao: mediaPontuacao,
          ultimaAtividade: new Date().toISOString().split('T')[0]
        });
        
        setDadosCarregados(true);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };
    
    if (user) {
      carregarEstatisticas();
    }
  }, [user]);

  if (isLoading || !dadosCarregados) {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo(a), Professor(a) {user.nome}!</h1>
        <p className="text-gray-600">Confira abaixo um resumo rápido da sua turma e atividades.</p>
      </div>
      
      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Alunos</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">{estatisticas.totalAlunos}</h2>
          <p className="text-gray-600 text-sm mb-4">alunos matriculados</p>
          <Link 
            href="/professor/gerenciar" 
            className="mt-auto text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
          >
            Gerenciar alunos <FaArrowRight className="ml-1 text-xs" />
          </Link>
        </div>
        
        <div className="card p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <FaLayerGroup className="text-purple-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Desafios</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">{estatisticas.desafiosDisponiveis}</h2>
          <p className="text-gray-600 text-sm mb-4">desafios disponíveis</p>
          <Link 
            href="/professor/desafios/criar" 
            className="mt-auto text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium"
          >
            Criar novo desafio <FaArrowRight className="ml-1 text-xs" />
          </Link>
        </div>
        
        <div className="card p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <FaTrophy className="text-green-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Completados</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">{estatisticas.desafiosCompletados}</h2>
          <p className="text-gray-600 text-sm mb-4">desafios completados</p>
          <Link 
            href="/professor/relatorios" 
            className="mt-auto text-green-600 hover:text-green-800 flex items-center text-sm font-medium"
          >
            Ver relatórios <FaArrowRight className="ml-1 text-xs" />
          </Link>
        </div>
      </div>
      
      {/* Informações adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Estatísticas da Turma</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-blue-50 mr-3">
                  <FaUserGraduate className="text-blue-600" />
                </div>
                <span className="font-medium">Média de desafios por aluno</span>
              </div>
              <span className="font-bold">{estatisticas.mediaDesafiosPorAluno}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-purple-50 mr-3">
                  <FaChartBar className="text-purple-600" />
                </div>
                <span className="font-medium">Média de pontuação</span>
              </div>
              <span className="font-bold">{estatisticas.mediaPontuacao}</span>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-green-50 mr-3">
                  <FaCalendarAlt className="text-green-600" />
                </div>
                <span className="font-medium">Última atividade</span>
              </div>
              <span className="font-bold">{estatisticas.ultimaAtividade}</span>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/professor/relatorios" 
              className="text-[var(--primary)] hover:underline flex items-center"
            >
              Ver relatório completo <FaArrowRight className="ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <Link 
              href="/professor/gerenciar" 
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 rounded-md bg-blue-100 mr-3">
                <FaUsers className="text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Gerenciar Alunos</div>
                <div className="text-sm text-gray-500">Adicionar, editar ou remover alunos</div>
              </div>
            </Link>
            
            <Link 
              href="/professor/desafios/criar" 
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 rounded-md bg-purple-100 mr-3">
                <FaBook className="text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Criar Desafio</div>
                <div className="text-sm text-gray-500">Crie um novo desafio para sua turma</div>
              </div>
            </Link>
            
            <Link 
              href="/professor/relatorios" 
              className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 rounded-md bg-green-100 mr-3">
                <FaChartLine className="text-green-600" />
              </div>
              <div>
                <div className="font-medium">Ver Relatórios</div>
                <div className="text-sm text-gray-500">Estatísticas detalhadas de desempenho</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mais informações */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Desafios mais populares</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desafio</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completados</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa de Sucesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                      <FaChartBar className="text-blue-600" />
                    </div>
                    <span>Operações Básicas</span>
                  </div>
                </td>
                <td className="px-4 py-3">15 alunos</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span>78%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">
                      <FaChartBar className="text-purple-600" />
                    </div>
                    <span>Frações</span>
                  </div>
                </td>
                <td className="px-4 py-3">12 alunos</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span>65%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-md mr-3">
                      <FaChartBar className="text-amber-600" />
                    </div>
                    <span>Geometria Básica</span>
                  </div>
                </td>
                <td className="px-4 py-3">10 alunos</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span>72%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link 
            href="/professor/relatorios" 
            className="text-[var(--primary)] hover:underline flex items-center"
          >
            Ver todos os desafios <FaArrowRight className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
} 