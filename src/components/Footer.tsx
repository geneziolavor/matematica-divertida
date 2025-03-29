'use client';

import Link from 'next/link';
import { FaCalculator, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[var(--text)] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FaCalculator className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">Matemática Divertida</span>
            </div>
            <p className="text-sm opacity-80">
              Uma plataforma divertida para aprender matemática através de desafios e competições.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-[var(--accent)] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/desafios" className="text-sm hover:text-[var(--accent)] transition-colors">
                  Desafios
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-sm hover:text-[var(--accent)] transition-colors">
                  Ranking
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sm hover:text-[var(--accent)] transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-white hover:text-[var(--accent)] transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-[var(--accent)] transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="mailto:contato@matematicadivertida.com" className="text-white hover:text-[var(--accent)] transition-colors">
                <FaEnvelope className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm opacity-80">
              Estamos sempre disponíveis para ajudar!
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} Matemática Divertida. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 