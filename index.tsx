
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("%cJALTER-CORE", "color: #ef4444; font-size: 20px; font-weight: bold", "Starting initialization...");

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("Critical error: Root element not found.");
} else {
    try {
        const root = createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log("%cSUCCESS", "color: #065f46; font-weight: bold", "Personality matrix bound to DOM.");
    } catch (err) {
        console.error("Personality collapse during boot:", err);
        const log = document.getElementById('log-content');
        if (log) {
            const errDiv = document.createElement('div');
            errDiv.style.color = 'red';
            errDiv.style.fontSize = '10px';
            errDiv.innerText = `RUNTIME_ERROR: ${err.message}`;
            log.appendChild(errDiv);
        }
    }
}
