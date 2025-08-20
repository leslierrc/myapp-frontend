import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import './index.css' 
import React from 'react';
function App() {
  return (
      <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
  );
}

export default App;