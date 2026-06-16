'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-switch${isDark ? ' theme-switch--dark' : ''}`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Activer le thème sombre"
    >
      <span className="theme-switch__thumb">
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  );
}
