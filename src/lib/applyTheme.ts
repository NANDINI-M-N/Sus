/**
 * Apply the candidate dashboard theme to all components
 * This file should be imported in the main.tsx file
 */

// Apply theme to document root
export function applyTheme() {
  // Set document background and text colors
  document.documentElement.style.setProperty('--background', '210 33% 9%');
  document.documentElement.style.setProperty('--foreground', '0 0% 100%');

  // Set card colors
  document.documentElement.style.setProperty('--card', '210 29% 13%');
  document.documentElement.style.setProperty('--card-foreground', '0 0% 100%');

  // Set popover colors
  document.documentElement.style.setProperty('--popover', '210 29% 13%');
  document.documentElement.style.setProperty('--popover-foreground', '0 0% 100%');

  // Set primary colors (green)
  document.documentElement.style.setProperty('--primary', '151 100% 33%');
  document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');

  // Set secondary colors
  document.documentElement.style.setProperty('--secondary', '210 29% 13%');
  document.documentElement.style.setProperty('--secondary-foreground', '0 0% 100%');

  // Set muted colors
  document.documentElement.style.setProperty('--muted', '210 29% 16%');
  document.documentElement.style.setProperty('--muted-foreground', '0 0% 70%');

  // Set accent colors
  document.documentElement.style.setProperty('--accent', '151 100% 33%');
  document.documentElement.style.setProperty('--accent-foreground', '0 0% 100%');

  // Set destructive colors
  document.documentElement.style.setProperty('--destructive', '0 84.2% 60.2%');
  document.documentElement.style.setProperty('--destructive-foreground', '0 0% 100%');

  // Set border colors
  document.documentElement.style.setProperty('--border', '210 29% 20%');
  document.documentElement.style.setProperty('--input', '210 29% 16%');
  document.documentElement.style.setProperty('--ring', '151 100% 33%');

  // Set sidebar colors
  document.documentElement.style.setProperty('--sidebar-background', '151 100% 33%');
  document.documentElement.style.setProperty('--sidebar-foreground', '0 0% 100%');
  document.documentElement.style.setProperty('--sidebar-primary', '0 0% 100%');
  document.documentElement.style.setProperty('--sidebar-primary-foreground', '151 100% 33%');
  document.documentElement.style.setProperty('--sidebar-accent', '151 100% 40%');
  document.documentElement.style.setProperty('--sidebar-accent-foreground', '0 0% 100%');
  document.documentElement.style.setProperty('--sidebar-border', '151 100% 25%');
  document.documentElement.style.setProperty('--sidebar-ring', '0 0% 100%');

  // Set custom colors
  document.documentElement.style.setProperty('--dark-primary', '#0F1521');
  document.documentElement.style.setProperty('--dark-secondary', '#1E2533');
  document.documentElement.style.setProperty('--tech-green', '#00A651');
  document.documentElement.style.setProperty('--emerald-green', '#00A651');
  document.documentElement.style.setProperty('--text-primary', '#ffffff');
  document.documentElement.style.setProperty('--text-secondary', '#a3b8b4');
  document.documentElement.style.setProperty('--border-dark', '#2A3548');

  // Force dark mode
  document.documentElement.classList.add('dark');
} 