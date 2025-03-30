'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Adicionar o tipo 'admin' ao UserType
export type UserType = 'aluno' | 'professor' | 'admin';

type User = {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  escola: string;
  professorId?: string; // ID do professor que convidou (para alunos)
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Omit<User, 'id'> & { senha: string }) => Promise<void>;
};

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se o usuário está autenticado ao carregar
  useEffect(() => {
    const checkAuth = () => {
      // Verificar localStorage para autenticação simulada
      const savedUser = localStorage.getItem('matematica_divertida_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    
    try {
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar no localStorage se temos usuários cadastrados
      const savedUsers = localStorage.getItem('matematica_divertida_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      // Procurar por usuário com email e senha correspondentes
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser || foundUser.senha !== senha) {
        throw new Error('Email ou senha incorretos');
      }
      
      // Remover a senha antes de salvar no state
      const { senha: _, ...userWithoutPassword } = foundUser;
      
      // Salvar no localStorage e no state
      localStorage.setItem('matematica_divertida_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remover do localStorage
      localStorage.removeItem('matematica_divertida_user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de cadastro
  const register = async (userData: Omit<User, 'id'> & { senha: string }) => {
    setIsLoading(true);
    
    try {
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se já existe usuário com este email
      const savedUsers = localStorage.getItem('matematica_divertida_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      
      if (users.some((u: any) => u.email === userData.email)) {
        throw new Error('Este email já está em uso');
      }
      
      // Se for aluno vindo de um convite (verificamos pela escola)
      if (userData.tipo === 'aluno') {
        // Procurar professor da mesma escola
        const professores = users.filter((u: any) => 
          u.tipo === 'professor' && u.escola === userData.escola
        );
        
        if (professores.length > 0) {
          // Associar ao primeiro professor encontrado da mesma escola
          userData.professorId = professores[0].id;
        }
      }
      
      // Criar novo usuário com ID
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
      };
      
      // Adicionar à lista de usuários
      users.push(newUser);
      localStorage.setItem('matematica_divertida_users', JSON.stringify(users));
      
      // Remover a senha antes de salvar no state
      const { senha: _, ...userWithoutPassword } = newUser;
      
      // Autenticar o usuário automaticamente
      localStorage.setItem('matematica_divertida_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 