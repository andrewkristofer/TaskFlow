import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios';
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000'; // Backend URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)