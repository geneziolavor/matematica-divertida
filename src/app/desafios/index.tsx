'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCalculator, FaChartLine, FaStar, FaTrophy } from 'react-icons/fa';

interface DesafiosNavProps {
  className?: string;
}

export default function DesafiosNav({ className = '' }: DesafiosNavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: '/desafios',
      label: 'Todos os Desafios',
      icon: FaStar
    },
    {
      href: '/desafios/operacoes',
      label: 'Operações Matemáticas',
      icon: FaCalculator
    },
    {
      href: '/ranking',
      label: 'Ranking',
      icon: FaTrophy
    },
    {
      href: '/perfil',
      label: 'Meu Progresso',
      icon: FaChartLine
    }
  ];

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <nav>
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--primary)] text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 