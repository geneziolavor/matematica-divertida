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
import { MdEmojiEvents } from 'react-icons/md';
import { TbTrophy } from 'react-icons/tb';

interface RankingItem {
  userId: string;
  nome: string;
  escola: string;
  tipo: string;
  pontuacaoTotal: number;
  desafiosCompletados: number;
}

interface ProgressoItem {
  userId: string;
  pontuacao: number;
  completado: boolean;
  tempoConcluido: number;
  data: string;
}

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
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tipoRanking, setTipoRanking] = useState<'alunos' | 'escolas'>('alunos');
  const [pesquisa, setPesquisa] = useState('');
  const [filtroEscola, setFiltroEscola] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchRanking = async () => {
      try {
        const response = await fetch('/api/ranking');
        if (!response.ok) {
          throw new Error('Falha ao carregar o ranking');
        }
        
        const data = await response.json();
        setRanking(data);
      } catch (error) {
        console.error("Erro ao carregar ranking:", error);
        // Fallback para localStorage como backup
        try {
          const progressoDesafios = localStorage.getItem('progressoDesafios');
          const usersLocalStorage = localStorage.getItem('users');
          
          if (progressoDesafios && usersLocalStorage) {
            const progresso = JSON.parse(progressoDesafios) as Record<string, ProgressoItem>;
            const users = JSON.parse(usersLocalStorage) as Array<{
              id: string;
              nome: string;
              email: string;
              tipo: string;
              escola: string;
            }>;
            
            // Calcular pontuação total por usuário
            const pontuacoesPorUsuario: Record<string, { total: number, desafiosCompletados: number }> = {};
            
            Object.entries(progresso).forEach(([_, dados]) => {
              const { userId, pontuacao } = dados;
              if (!pontuacoesPorUsuario[userId]) {
                pontuacoesPorUsuario[userId] = { total: 0, desafiosCompletados: 0 };
              }
              pontuacoesPorUsuario[userId].total += pontuacao;
              pontuacoesPorUsuario[userId].desafiosCompletados += 1;
            });
            
            // Formatar ranking com dados de usuários
            const rankingLocal = Object.entries(pontuacoesPorUsuario).map(([userId, dados]) => {
              const userInfo = users.find(u => u.id === userId) || { nome: 'Desconhecido', escola: 'N/A', tipo: 'aluno' };
              return {
                userId,
                nome: userInfo.nome,
                escola: userInfo.escola,
                tipo: userInfo.tipo,
                pontuacaoTotal: dados.total,
                desafiosCompletados: dados.desafiosCompletados
              };
            });
            
            // Ordenar por pontuação
            rankingLocal.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
            setRanking(rankingLocal);
          }
        } catch (err) {
          console.error("Erro no fallback local:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [user, router]);

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
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Ranking Global
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Top 3 */}
            <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-10">
              {ranking.length > 1 && (
                <div className="w-full md:w-1/4 bg-gradient-to-t from-gray-100 to-gray-200 rounded-lg p-4 text-center h-48 flex flex-col justify-end">
                  <div className="bg-gray-500 text-white w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl">
                    <TbTrophy />
                  </div>
                  <p className="font-semibold truncate">{ranking[1].nome}</p>
                  <p className="text-sm text-gray-600 truncate">{ranking[1].escola}</p>
                  <p className="font-bold text-lg">{ranking[1].pontuacaoTotal} pts</p>
                </div>
              )}
              
              {ranking.length > 0 && (
                <div className="w-full md:w-1/3 bg-gradient-to-t from-yellow-100 to-yellow-200 rounded-lg p-4 text-center h-56 flex flex-col justify-end">
                  <div className="bg-yellow-500 text-white w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl">
                    <MdEmojiEvents />
                  </div>
                  <p className="font-bold text-xl truncate">{ranking[0].nome}</p>
                  <p className="text-sm text-gray-600 truncate">{ranking[0].escola}</p>
                  <p className="font-bold text-2xl">{ranking[0].pontuacaoTotal} pts</p>
                </div>
              )}
              
              {ranking.length > 2 && (
                <div className="w-full md:w-1/4 bg-gradient-to-t from-orange-100 to-orange-200 rounded-lg p-4 text-center h-40 flex flex-col justify-end">
                  <div className="bg-orange-500 text-white w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-xl">
                    <TbTrophy />
                  </div>
                  <p className="font-semibold truncate">{ranking[2].nome}</p>
                  <p className="text-sm text-gray-600 truncate">{ranking[2].escola}</p>
                  <p className="font-bold text-lg">{ranking[2].pontuacaoTotal} pts</p>
                </div>
              )}
            </div>
            
            {/* Lista completa */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Posição</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Nome</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 hidden md:table-cell">Escola</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Pontuação</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 hidden md:table-cell">Desafios</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ranking.map((pessoa, index) => (
                    <tr 
                      key={pessoa.userId} 
                      className={`${user?.id === pessoa.userId ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium">
                        {pessoa.nome}
                        {pessoa.tipo === 'professor' && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Professor</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{pessoa.escola}</td>
                      <td className="py-3 px-4 font-bold">{pessoa.pontuacaoTotal} pts</td>
                      <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{pessoa.desafiosCompletados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </>
  );
} 