/**
 * Theme configuration for the CodeSignal application
 * This file defines the color palette used throughout the application
 */

export const theme = {
  colors: {
    // Main background colors
    background: '#0F1521',       // Dark navy background
    foreground: '#FFFFFF',       // White text
    
    // Card/panel colors
    card: '#1E2533',             // Slightly lighter navy for cards
    cardForeground: '#FFFFFF',   // White text on cards
    
    // Primary brand colors
    primary: '#00A651',          // Green primary color
    primaryForeground: '#FFFFFF', // White text on primary
    
    // Secondary colors
    secondary: '#1E2533',        // Slightly lighter navy
    secondaryForeground: '#FFFFFF', // White text on secondary
    
    // Muted/subtle colors
    muted: '#2A3548',            // Subtle background
    mutedForeground: '#A3B8B4',  // Subtle text
    
    // Accent colors
    accent: '#00A651',           // Green accent
    accentForeground: '#FFFFFF', // White text on accent
    
    // Border colors
    border: '#2A3548',           // Border color
    
    // Progress bar colors
    progress: {
      green: '#00A651',          // Green progress
      blue: '#0084FF',           // Blue progress
      yellow: '#FFC107',         // Yellow progress
      red: '#FF3B30',            // Red progress
    },
    
    // Status colors
    status: {
      success: '#00A651',        // Success green
      warning: '#FFC107',        // Warning yellow
      error: '#FF3B30',          // Error red
      info: '#0084FF',           // Info blue
    }
  },
  
  // Gradients
  gradients: {
    greenGradient: 'linear-gradient(to right, #00A651, #4CD964)',
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

// CSS variables mapping (for use in index.css)
export const cssVariables = {
  light: {
    background: '210 33% 9%',
    foreground: '0 0% 100%',
    card: '210 29% 13%',
    cardForeground: '0 0% 100%',
    popover: '210 29% 13%',
    popoverForeground: '0 0% 100%',
    primary: '151 100% 33%',
    primaryForeground: '0 0% 100%',
    secondary: '210 29% 13%',
    secondaryForeground: '0 0% 100%',
    muted: '210 29% 16%',
    mutedForeground: '0 0% 70%',
    accent: '151 100% 33%',
    accentForeground: '0 0% 100%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 100%',
    border: '210 29% 20%',
    input: '210 29% 16%',
    ring: '151 100% 33%',
  },
  dark: {
    // Same as light mode since the app is dark-themed by default
    background: '210 33% 9%',
    foreground: '0 0% 100%',
    card: '210 29% 13%',
    cardForeground: '0 0% 100%',
    popover: '210 29% 13%',
    popoverForeground: '0 0% 100%',
    primary: '151 100% 33%',
    primaryForeground: '0 0% 100%',
    secondary: '210 29% 13%',
    secondaryForeground: '0 0% 100%',
    muted: '210 29% 16%',
    mutedForeground: '0 0% 70%',
    accent: '151 100% 33%',
    accentForeground: '0 0% 100%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 100%',
    border: '210 29% 20%',
    input: '210 29% 16%',
    ring: '151 100% 33%',
  }
}; 