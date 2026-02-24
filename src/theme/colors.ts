// Synthpunk Theme Colors
export const colors = {
  // Core
  black: '#000000',
  white: '#ffffff',
  
  // Accent Colors
  primary: '#00ffcc',
  primaryDim: '#00b894',
  primaryGlow: 'rgba(0, 255, 204, 0.4)',
  
  secondary: '#ff00ff',
  secondaryDim: '#cc00cc',
  secondaryGlow: 'rgba(255, 0, 255, 0.4)',
  
  yellow: '#ffff00',
  yellowDim: '#cccc00',
  
  // Neutrals
  gray900: '#0a0a0a',
  gray800: '#141414',
  gray700: '#1f1f1f',
  gray600: '#2a2a2a',
  gray500: '#3d3d3d',
  gray400: '#525252',
  gray300: '#737373',
  gray200: '#a3a3a3',
  gray100: '#d4d4d4',
  
  // Semantic
  success: '#00ff88',
  successDim: '#00cc6a',
  warning: '#ffaa00',
  warningDim: '#cc8800',
  error: '#ff3366',
  errorDim: '#cc2952',
  info: '#00aaff',
  infoDim: '#0088cc',
  
  // Background aliases
  bgPrimary: '#000000',
  bgSecondary: '#0a0a0a',
  bgElevated: '#141414',
  bgInteractive: '#1f1f1f',
  
  // Text aliases
  textPrimary: '#d4d4d4',
  textSecondary: '#737373',
  textMuted: '#525252',
  
  // Border
  border: '#2a2a2a',
  borderFocus: '#00ffcc',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
