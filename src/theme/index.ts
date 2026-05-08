export type AppTheme = {
  mode: 'light' | 'dark';
  colors: {
    bg: string;
    card: string;
    text: string;
    muted: string;
    border: string;
    primary: string;
    primarySoft: string;
    cream: string;
    success: string;
  };
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    bg: '#f7faff',
    card: '#ffffff',
    text: '#101828',
    muted: '#667085',
    border: '#e4eaf3',
    primary: '#2563eb',
    primarySoft: '#dbeafe',
    cream: '#eef6ff',
    success: '#16a34a'
  }
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    bg: '#0b1220',
    card: '#111827',
    text: '#f8fafc',
    muted: '#a7b2c4',
    border: '#243247',
    primary: '#60a5fa',
    primarySoft: '#172a46',
    cream: '#142235',
    success: '#4ade80'
  }
};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 12, lg: 18 };
