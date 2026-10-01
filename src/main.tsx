import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Cleanly ignore benign Vite dev websocket reconnect notices in iframe environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (msg.includes('WebSocket') || msg.includes('websocket')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
