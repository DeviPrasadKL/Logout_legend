import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ReactGA from "react-ga4";

const trackingId = import.meta.env.VITE_TRACKING_ID;
ReactGA.initialize(trackingId);

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
