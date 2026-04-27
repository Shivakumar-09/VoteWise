
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '@/components/Navbar';
import { LanguageProvider } from '@/components/LanguageProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

// Mock dependencies
vi.mock('next-themes', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useTheme: () => ({
      theme: 'dark',
      setTheme: vi.fn(),
    }),
  };
});

// Mock useLanguage
vi.mock('@/components/LanguageProvider', async () => {
  const actual = await vi.importActual('@/components/LanguageProvider') as any;
  return {
    ...actual,
    useLanguage: () => ({
      language: 'English',
      setLanguage: vi.fn(),
      t: (key: string) => key,
    }),
  };
});

describe('Navbar Component', () => {
  it('renders the navbar brand', () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <Navbar />
        </LanguageProvider>
      </ThemeProvider>
    );
    // The brand name is in a hidden-on-desktop div, but it's there
    expect(screen.getByText('VoteWise')).toBeInTheDocument();
  });

  it('contains the language switcher', () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <Navbar />
        </LanguageProvider>
      </ThemeProvider>
    );
    expect(screen.getByText('English')).toBeInTheDocument();
  });
});
