export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    placeholder: string;
    disabled: string;
    backdrop: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    round: number;
  };
  shadows: {
    small: object;
    medium: object;
    large: object;
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#f8f9fa',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    error: '#ff3b30',
    success: '#4caf50',
    warning: '#ffc107',
    info: '#2196f3',
    placeholder: '#999999',
    disabled: '#cccccc',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#8b9cff',
    secondary: '#9d7ec7',
    background: '#121212',
    surface: '#1e1e1e',
    card: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    error: '#ff453a',
    success: '#30d158',
    warning: '#ffd60a',
    info: '#64d2ff',
    placeholder: '#8e8e93',
    disabled: '#48484a',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
