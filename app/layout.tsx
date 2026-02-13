import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Second Brain Dashboard',
  description: 'Unified memory system integrating mem0 + Supermemory + files + tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
