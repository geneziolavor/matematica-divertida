import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

// Estendendo tipos para páginas Next.js
declare module 'next' {
  export type PageProps = {
    params?: any;
    searchParams?: any;
  };
}

// Tipos para layout e páginas
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
}; 