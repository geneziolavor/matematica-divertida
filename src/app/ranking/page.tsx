'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaTrophy,
  FaMedal,
  FaSchool,
  FaUserGraduate,
  FaStar,
  FaSearch,
  FaFilter,
  FaExchangeAlt
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Dados fictícios de alunos para o ranking
const alunosRanking = [
  { id: 1, nome: "Ana Silva", escola: "Escola Exemplo", pontuacao: 950, medalhas: 8, posicao: 1 },
  { id: 2, nome: "Pedro Costa", escola: "Escola Modelo", pontuacao: 885, medalhas: 7, posicao: 2 },
  { id: 3, nome: "Maria Oliveira", escola: "Escola Futuro", pontuacao: 830, medalhas: 6, posicao: 3 },
  { id: 4, nome: "João Santos", escola: "Escola Exemplo", pontuacao: 780, medalhas: 5, posicao: 4 },
  { id: 5, nome: "Lucia Ferreira", escola: "Escola Futuro", pontuacao: 750, medalhas: 5, posicao: 5 },
  { id: 6, nome: "Gabriel Sousa", escola: "Escola Modelo", pontuacao: 720, medalhas: 4, posicao: 6 },
  { id: 7, nome: "Carolina Lima", escola: "Escola Exemplo", pontuacao: 680, medalhas: 4, posicao: 7 },
  { id: 8, nome: "Thiago Alves", escola: "Escola Futuro", pontuacao: 650, medalhas: 3, posicao: 8 },
  { id: 9, nome: "Julia Santos", escola: "Escola Modelo", pontuacao: 620, medalhas: 3, posicao: 9 },
  { id: 10, nome: "Rafael Mendes", escola: "Escola Exemplo", pontuacao: 590, medalhas: 3, posicao: 10 },
  { id: 11, nome: "Fernanda Costa", escola: "Escola Futuro", pontuacao: 550, medalhas: 2, posicao: 11 },
  { id: 12, nome: "Lucas Oliveira", escola: "Escola Modelo", pontuacao: 520, medalhas: 2, posicao: 12 },
  { id: 13, nome: "Amanda Silva", escola: "Escola Exemplo", pontuacao: 490, medalhas: 2, posicao: 13 },
  { id: 14, nome: "Vinícius Lima", escola: "Escola Futuro", pontuacao: 460, medalhas: 1, posicao: 14 },
  { id: 15, nome: "Beatriz Santos", escola: "Escola Modelo", pontuacao: 430, medalhas: 1, posicao: 15 },
];

// Dados fictícios de escolas para o ranking
const escolasRanking = [
  { id: 1, nome: "Escola Exemplo", alunos: 120, pontuacaoMedia: 680, medalhasTotal: 22, posicao: 1 },
  { id: 2, nome: "Escola Futuro", alunos: 95, pontuacaoMedia: 650, medalhasTotal: 17, posicao: 2 },
  { id: 3, nome: "Escola Modelo", alunos: 105, pontuacaoMedia: 630, medalhasTotal: 16, posicao: 3 },
  { id: 4, nome: "Colégio Inovação", alunos: 85, pontuacaoMedia: 590, medalhasTotal: 14, posicao: 4 },
  { id: 5, nome: "Instituto Educar", alunos: 75, pontuacaoMedia: 560, medalhasTotal: 12, posicao: 5 },
];

export default function Ranking() {
  const [tipoRanking, setTipoRanking] = useState<'alunos' | 'escolas'>('alunos');
  const [pesquisa, setPesquisa] = useState('');
  const [filtroEscola, setFiltroEscola] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Filtrar alunos com base na pesquisa e filtro de escola
  const alunosFiltrados = alunosRanking.filter(aluno => {
    const passouPesquisa = pesquisa === '' || 
      aluno.nome.toLowerCase().includes(pesquisa.toLowerCase());
    
    const passouFiltroEscola = filtroEscola === null || 
      aluno.escola === filtroEscola;
    
    return passouPesquisa && passouFiltroEscola;
  });

  // Filtrar escolas com base na pesquisa
  const escolasFiltradas = escolasRanking.filter(escola => 
    pesquisa === '' || escola.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // Obter escolas únicas para o filtro
  const escolasUnicas = Array.from(new Set(alunosRanking.map(a => a.escola)));

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

  // Encontrar posição do usuário atual no ranking
  const userRanking = user.tipo === 'aluno' ? 
    alunosRanking.find(a => a.nome === user.nome) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Ranking de {tipoRanking === 'alunos' ? 'Alunos' : 'Escolas'}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="card mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center">
              <FaFilter className="mr-2" /> Opções de Ranking
            </h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Tipo de Ranking</h3>
              <div className="flex space-x-4">
                <button 
                  className={`px-4 py-2 rounded-lg ${tipoRanking === 'alunos' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                  onClick={() => setTipoRanking('alunos')}
                >
                  <FaUserGraduate className="inline-block mr-2" /> 
                  Alunos
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg ${tipoRanking === 'escolas' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100'}`}
                  onClick={() => setTipoRanking('escolas')}
                >
                  <FaSchool className="inline-block mr-2" /> 
                  Escolas
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Pesquisar</h3>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  placeholder={`Pesquisar ${tipoRanking === 'alunos' ? 'alunos' : 'escolas'}...`}
                />
              </div>
            </div>
            
            {tipoRanking === 'alunos' && (
              <div>
                <h3 className="font-medium mb-2">Filtrar por Escola</h3>
                <div className="space-y-2">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg ${filtroEscola === null ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => setFiltroEscola(null)}
                  >
                    Todas as Escolas
                  </button>
                  
                  {escolasUnicas.map(escola => (
                    <button 
                      key={escola}
                      className={`w-full text-left px-3 py-2 rounded-lg ${filtroEscola === escola ? 'bg-[var(--primary)] text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setFiltroEscola(escola)}
                    >
                      <FaSchool className="inline-block mr-2" /> {escola}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {user.tipo === 'aluno' && userRanking && (
            <div className="card bg-[var(--primary)] bg-opacity-10 border border-[var(--primary)] border-opacity-20">
              <h2 className="font-bold text-lg mb-4 flex items-center text-[var(--primary)]">
                <FaUserGraduate className="mr-2" /> Sua Posição
              </h2>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl">
                  {userRanking.posicao}
                </div>
                <div className="ml-4">
                  <div className="font-bold">{user.nome}</div>
                  <div className="text-gray-600 text-sm">{user.escola}</div>
                  <div className="flex items-center mt-1">
                    <span className="text-[var(--primary)] font-bold">{userRanking.pontuacao} pts</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <FaMedal className="text-yellow-500 mr-1" /> {userRanking.medalhas}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Conteúdo principal */}
        <div className="col-span-1 md:col-span-3">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">
                Top {tipoRanking === 'alunos' ? 'Alunos' : 'Escolas'}
                {filtroEscola && ` - ${filtroEscola}`}
              </h2>
              
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center"
                  onClick={() => {
                    setPesquisa('');
                    setFiltroEscola(null);
                  }}
                >
                  <FaFilter className="mr-1" /> Limpar Filtros
                </button>
                <button 
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center"
                  onClick={() => setTipoRanking(tipoRanking === 'alunos' ? 'escolas' : 'alunos')}
                >
                  <FaExchangeAlt className="mr-1" /> Trocar para {tipoRanking === 'alunos' ? 'Escolas' : 'Alunos'}
                </button>
              </div>
            </div>
            
            {tipoRanking === 'alunos' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Posição
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aluno
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pontuação
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medalhas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alunosFiltrados.length > 0 ? (
                      alunosFiltrados.map((aluno) => (
                        <tr key={aluno.id} className={`hover:bg-gray-50 ${user && user.nome === aluno.nome ? 'bg-[var(--primary)] bg-opacity-10' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                              ${aluno.posicao === 1 ? 'bg-yellow-500' : 
                                aluno.posicao === 2 ? 'bg-gray-400' : 
                                aluno.posicao === 3 ? 'bg-amber-600' : 'bg-[var(--primary)]'}`}
                            >
                              {aluno.posicao}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">{aluno.nome}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FaSchool className="mr-1" /> {aluno.escola}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-[var(--primary)]">{aluno.pontuacao} pontos</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FaMedal className="text-yellow-500 mr-2" />
                              <span className="font-medium">{aluno.medalhas}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          Nenhum aluno encontrado com os filtros selecionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Posição
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Escola
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pontuação Média
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total de Medalhas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {escolasFiltradas.length > 0 ? (
                      escolasFiltradas.map((escola) => (
                        <tr key={escola.id} className={`hover:bg-gray-50 ${user && user.escola === escola.nome ? 'bg-[var(--primary)] bg-opacity-10' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                              ${escola.posicao === 1 ? 'bg-yellow-500' : 
                                escola.posicao === 2 ? 'bg-gray-400' : 
                                escola.posicao === 3 ? 'bg-amber-600' : 'bg-[var(--primary)]'}`}
                            >
                              {escola.posicao}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">{escola.nome}</div>
                                <div className="text-sm text-gray-500">{escola.alunos} alunos participantes</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-[var(--primary)]">{escola.pontuacaoMedia} pontos</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FaTrophy className="text-yellow-500 mr-2" />
                              <span className="font-medium">{escola.medalhasTotal}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          Nenhuma escola encontrada com os filtros selecionados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 