import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { InterviewProvider } from './contexts/InterviewContext'
import { WebSocketProvider } from './contexts/WebSocketContext'

createRoot(document.getElementById("root")!).render(
  <InterviewProvider>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </InterviewProvider>
);
