import React from 'react'
import { GoogleOAuthProvider }from "@react-oauth/google";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { PageProvider } from "./context/PageContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/Theme.css";

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>

<GoogleOAuthProvider
      clientId="934037346147-b9ellk462bnt2ienq8qj3l9qf9mbu33c.apps.googleusercontent.com"
     >
<PageProvider>
  <BrowserRouter>

   <ThemeProvider>

       <App />

   </ThemeProvider>

  </BrowserRouter>
</PageProvider> 
 

  </GoogleOAuthProvider>


</React.StrictMode>
)