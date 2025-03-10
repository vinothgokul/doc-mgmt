import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { DocumentProvider } from './context/DocumentContext.jsx';
import { UserProvider } from './context/UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <DocumentProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </DocumentProvider>
  </AuthProvider>,
);
