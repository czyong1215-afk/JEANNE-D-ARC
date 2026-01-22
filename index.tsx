
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
    try {
        const root = createRoot(rootElement);
        // React 19 支持直接渲染组件
        root.render(<App />);
        console.log("Jalter: 19.2.3 Core Linked. Boosted Mode.");
    } catch (e) {
        console.error("Critical Start Error:", e);
    }
}
