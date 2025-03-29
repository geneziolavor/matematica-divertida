'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  FaCalculator, 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaSignInAlt, 
  FaUserGraduate,
  FaSignOutAlt,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-[var(--primary)] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FaCalculator className="h-8 w-8 mr-3" />
              <motion.span 
                className="text-xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Matemática Divertida
              </motion.span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--secondary)] transition-colors">
                Início
              </Link>
              <Link href="/desafios" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--secondary)] transition-colors">
                Desafios
              </Link>
              <Link href="/ranking" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--secondary)] transition-colors">
                Ranking
              </Link>
              <Link href="/sobre" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--secondary)] transition-colors">
                Sobre
              </Link>
              
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)} 
                    className="ml-4 flex items-center px-4 py-2 rounded-full bg-white text-[var(--primary)] font-bold hover:bg-opacity-90 transition-colors"
                  >
                    {user.tipo === 'professor' ? (
                      <FaChalkboardTeacher className="mr-2" />
                    ) : (
                      <FaUserGraduate className="mr-2" />
                    )}
                    {user.nome.split(' ')[0]}
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-2 px-4 text-gray-700 border-b border-gray-200">
                        <p className="text-sm font-medium">{user.nome}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.tipo === 'professor' ? 'Professor(a)' : 'Aluno(a)'} • {user.escola}
                        </p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/perfil" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Meu Perfil
                      </Link>
                      {user.tipo === 'professor' && (
                        <Link 
                          href="/professor/gerenciar" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Gerenciar Alunos
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200"
                      >
                        <FaSignOutAlt className="inline mr-2" /> Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="ml-4 flex items-center px-4 py-2 rounded-full bg-white text-[var(--primary)] font-bold hover:bg-opacity-90 transition-colors">
                  <FaSignInAlt className="mr-2" /> Entrar
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[var(--secondary)] transition-colors"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
              Início
            </Link>
            <Link href="/desafios" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
              Desafios
            </Link>
            <Link href="/ranking" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
              Ranking
            </Link>
            <Link href="/sobre" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
              Sobre
            </Link>
            
            {user ? (
              <>
                <div className="px-3 py-2 text-base font-medium border-t border-[var(--secondary)] mt-2 pt-4">
                  <div className="flex items-center">
                    {user.tipo === 'professor' ? (
                      <FaChalkboardTeacher className="mr-2" />
                    ) : (
                      <FaUserGraduate className="mr-2" />
                    )}
                    <span>{user.nome}</span>
                  </div>
                  <p className="text-xs opacity-80 mt-1">
                    {user.tipo === 'professor' ? 'Professor(a)' : 'Aluno(a)'} • {user.escola}
                  </p>
                </div>
                
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
                  Dashboard
                </Link>
                <Link href="/perfil" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
                  Meu Perfil
                </Link>
                {user.tipo === 'professor' && (
                  <Link href="/professor/gerenciar" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
                    Gerenciar Alunos
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left mt-2 block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700 transition-colors"
                >
                  <FaSignOutAlt className="inline mr-2" /> Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--secondary)] transition-colors">
                <FaSignInAlt className="mr-2" /> Entrar
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
} 