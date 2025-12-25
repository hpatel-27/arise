import { PixelArtNav } from './PixelArtNav';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <PixelArtNav />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

