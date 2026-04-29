import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {persistor, store} from "./redux/store.js";
import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import { FaSpinner } from 'react-icons/fa';

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <FaSpinner className="animate-spin" size={40} />
    </div>
  );
}


createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner/>} persistor={persistor}>
         <App />
      </PersistGate>
   
  </Provider>,
)
