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
    bg: '#f8f5f2',
    card: '#ffffff',
    text: '#130f0c',
    muted: '#7b7169',
    border: '#e6ddd5',
    primary: '#df880e',
    primarySoft: '#fff1cf',
    cream: '#fff7df',
    success: '#20a646'
  }
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    bg: '#171310',
    card: '#231d18',
    text: '#fff8ee',
    muted: '#c2b4a9',
    border: '#51443b',
    primary: '#f3a51f',
    primarySoft: '#3b2a11',
    cream: '#2d251b',
    success: '#53d779'
  }
};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 12, lg: 18 };
