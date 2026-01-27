export interface Theme {
  name: 'cute' | 'professional' | 'financial';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
    border: string;
    cardBackground: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    fontFamilyBold: string;
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  };
  shadows: {
    small: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    medium: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export const cuteTheme: Theme = {
  name: 'cute',
  colors: {
    primary: '#FF8FAB',
    secondary: '#B4A4E8',
    background: '#FFF5F7',
    surface: '#FFFFFF',
    text: '#2D2D2D',
    textSecondary: '#8E8E8E',
    error: '#FF6B6B',
    success: '#A8E6CF',
    warning: '#FFD166',
    border: '#FFD9E3',
    cardBackground: '#FFFFFF',
    accent: '#FFCCD5',
  },
  typography: {
    fontFamily: 'System',
    fontFamilyBold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#FF8FAB',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#FF8FAB',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export const professionalTheme: Theme = {
  name: 'professional',
  colors: {
    primary: '#2C5F8D',
    secondary: '#5B8FB9',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    border: '#E5E7EB',
    cardBackground: '#FFFFFF',
    accent: '#D4AF37',
  },
  typography: {
    fontFamily: 'System',
    fontFamilyBold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

export const financialTheme: Theme = {
  name: 'financial',
  colors: {
    primary: '#C9A961',
    secondary: '#B8996F',
    background: '#0F1419',
    surface: '#1A1F26',
    text: '#E8E8E8',
    textSecondary: '#9CA3AF',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    border: '#2D3748',
    cardBackground: '#1E2531',
    accent: '#D4AF37',
  },
  typography: {
    fontFamily: 'System',
    fontFamilyBold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export const themes = {
  cute: cuteTheme,
  professional: professionalTheme,
  financial: financialTheme,
};
