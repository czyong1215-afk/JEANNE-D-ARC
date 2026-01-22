
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-200 safe-area-inset-top safe-area-inset-bottom">
      <header className="p-4 border-b border-purple-900 bg-gray-950 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
          <h1 className="text-xl font-bold text-purple-500 tracking-tighter">JALTER-CORE-V3</h1>
        </div>
        <div className="text-xs text-gray-500 font-mono">HUAWEI MATE 20X OPTIMIZED</div>
      </header>
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        {children}
      </main>
    </div>
  );
};
