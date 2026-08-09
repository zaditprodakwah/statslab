import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu,
  ChevronDown,
  Monitor,
  Type,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

export default function StickyHeader() {
  // Placeholder progress state (will be connected to Zustand later)
  const taskProgress = 3;
  const totalTasks = 8;
  const progressPercent = (taskProgress / totalTasks) * 100;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logos & Branding */}
        <div className="mr-4 hidden md:flex items-center space-x-2">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-outfit font-bold sm:inline-block">
              StatsLab
            </span>
          </Link>
          <div className="flex items-center border-l border-border pl-4 space-x-2">
            <a 
              href="https://staialbahjah.ac.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Image 
                src="/logo-institut.jpg" 
                alt="STAI Al-Bahjah Logo" 
                width={24} 
                height={24} 
                className="rounded-sm object-cover mr-2"
              />
              <span className="hidden lg:inline-block">Sponsored by STAI Al-Bahjah</span>
            </a>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Module Switcher Dropdown */}
          <div className="hidden sm:flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <span>Modul: Zakat</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Sticky Progress Indicator */}
          <div className="flex-1 md:max-w-xs mx-4 hidden lg:flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium">Tugas Literasi Data</span>
              <span className="text-muted-foreground">{taskProgress}/{totalTasks} Selesai</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Accessibility & Session Controls */}
          <nav className="flex items-center space-x-2">
            <button className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground" aria-label="Toggle Font Size">
              <Type className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground" aria-label="Toggle High Contrast">
              <Monitor className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground" aria-label="Toggle Theme">
              <Moon className="h-4 w-4 hidden dark:block" />
              <Sun className="h-4 w-4 dark:hidden" />
            </button>
            
            <div className="border-l border-border ml-2 pl-2 flex items-center">
              <span className="text-sm font-medium mr-2 hidden sm:inline-block">Sesi: AK-8B</span>
              <button className="inline-flex items-center justify-center h-9 w-9 rounded-md text-destructive hover:bg-destructive/10" aria-label="Keluar Sesi">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
