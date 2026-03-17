import { StrictMode } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <Toaster />
            <Provider store={store}>
                <App />
            </Provider>
        </AuthProvider>
    </StrictMode>,
)
