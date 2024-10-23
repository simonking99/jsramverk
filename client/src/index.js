import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Om du vill börja mäta prestanda i din app, skicka en funktion
// för att logga resultat (t.ex. reportWebVitals(console.log))
// eller skicka till en analysändpunkt. Läs mer: https://bit.ly/CRA-vitals
reportWebVitals();
