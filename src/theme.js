import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B22222', // Deep red
    },
    secondary: {
      main: '#FFD700', // Gold
    },
    background: {
      default: '#000000', // Pure black background
      paper: '#121212', // Darker gray for cards/panels
    },
    text: {
      primary: '#FFD700', // Gold text by default
      secondary: '#B22222', // Red text for highlights
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#FFD700',
          minHeight: '100vh',
        },
      },
    },
  },
});

// Wrap your entire app with the ThemeProvider
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This applies the baseline styles */}
      {/* Your app content */}
    </ThemeProvider>
  );
}