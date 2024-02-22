// Amplify UI components are interactive and designed to work on the client side.
// To use them inside of Server Components you must wrap them in a Client Component 
'use client';

import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsconfigs from '../amplifyconfiguration.json';
import { Home } from './screens/home';
import { ThemeProvider, createTheme } from '@mui/material/styles';

Amplify.configure({
  ...awsconfigs,
  API: {
    REST: {
      chargebot: {
        endpoint: process.env.NEXT_PUBLIC_API_URL ?? "",
      }
    }
  },
})

const theme = createTheme({
  palette: {
    primary: {
      main: '#EC7326',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#007AFF',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F65751',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4DC591',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#727272',
      contrastText: '#FFFFFF',
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="flex bg-black text-gray-100 align-middle w-full h-screen">
        <Authenticator hideSignUp={true} className="max-w-fit m-auto bg-orange-500 rounded-sm">
          <Home />
        </Authenticator>
      </div>
    </ThemeProvider>
  );
}
export default App;