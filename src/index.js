import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import clarity from '@microsoft/clarity';
import App from './App';
import './index.css';

// Microsoft Clarity — replace with your actual Project ID from clarity.microsoft.com
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || 'vqi5pc57fp';
if (CLARITY_PROJECT_ID !== 'vqi5pc57fp') {
  clarity.init(CLARITY_PROJECT_ID);
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '560001096127-uecqlghmshjuo2qv3m3efqlskou69nqq.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
