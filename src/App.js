import React from 'react'
import { Provider } from 'react-redux'
import './App.css'
import AppRouter from './components/Router'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { store } from './store'

function App() {
  return (
    <>
    	<Provider store={store}>
      <TonConnectUIProvider manifestUrl="https://nvadim11.github.io/Tiger/">
          <AppRouter />
        </TonConnectUIProvider>
      </Provider>
    </>
  );
}

export default App;
