import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './theme-override.css'
import { InterviewProvider } from './contexts/InterviewContext'
import { WebSocketProvider } from './contexts/WebSocketContext'

// Apply the candidate dashboard theme to all components
// CSS variables are set in index.css and theme-override.css

// Render the application
createRoot(document.getElementById("root")!).render(
  <InterviewProvider>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </InterviewProvider>
);

// Apply theme to DOM elements after rendering
setTimeout(() => {
  // Update background colors
  document.querySelectorAll('.bg-gray-900').forEach(el => {
    (el as HTMLElement).style.backgroundColor = '#0F1521';
  });
  
  document.querySelectorAll('.bg-gray-800').forEach(el => {
    (el as HTMLElement).style.backgroundColor = '#1E2533';
  });
  
  document.querySelectorAll('.bg-gray-700').forEach(el => {
    (el as HTMLElement).style.backgroundColor = '#2A3548';
  });
  
  // Update border colors
  document.querySelectorAll('.border-gray-700').forEach(el => {
    (el as HTMLElement).style.borderColor = '#2A3548';
  });
  
  // Update text colors
  document.querySelectorAll('.text-gray-300, .text-gray-400').forEach(el => {
    (el as HTMLElement).style.color = '#a3b8b4';
  });
  
  console.log('Candidate dashboard theme applied to DOM elements');
}, 500);
