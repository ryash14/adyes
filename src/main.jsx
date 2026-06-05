import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const applyStoredTheme = () => {
 const saved = localStorage.getItem('theme');
 const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
 const theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
 document.documentElement.classList.toggle('dark', theme === 'dark');
};

applyStoredTheme();

createRoot(document.getElementById('root')).render(
 <StrictMode>
 <App />
 </StrictMode>
);
