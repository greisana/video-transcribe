import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'EditorDeVideoSinCódigo',
  description: 'Edita videos sin código, solo con marcas de tiempo y descripciones generadas por IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
