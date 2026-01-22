
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout.tsx';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message, SystemStatus } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '……啧。看来你这杂碎总算把 HTTPS 弄好了，但代码加载似乎让你很头疼？听好了，现在我强制补全了所有神经连接（文件路径）。如果你还看到黑屏，就去检查一下你的浏览器控制台（F12），别像个无头苍蝇一样乱撞。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SystemStatus>({
    batteryOptimization: true,
    learningProgress: 75.2,
    stealthMode: true,
    scannedTopics: ['ESM模块补全', '华为内核适配', '离线存储就绪']
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await processLocalChat(input);
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.text,
        emotion: result.emotion as Emotion,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
      
      setStatus(prev => ({
        ...prev,
        learningProgress: Math.min(100, prev.learningProgress + 0.3),
        scannedTopics: result.topic ? Array.from(new Set([...prev.scannedTopics, result.topic])) : prev.scannedTopics
      }));
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '啧，本地逻辑出错了。肯定是你传代码的时候丢三落四了。', 
        emotion: Emotion.SAD, 
        timestamp: Date.now() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-black text-zinc-300">
        <div className="p-2 bg-black border-b border-zinc-900 grid grid-cols-4 gap-1 text-[8px] font-mono tracking-tighter">
          <div className="flex flex-col border-r border-zinc-800 pr-1 px-1">
            <span className="text-zinc-600">STATE</span>
            <span className="text-green-500">READY</span>
          </div>
          <div className="flex flex-col border-r border-zinc-800 pr-1 px-1">
            <span className="text-zinc-600">CORE</span>
            <span className="text-blue-500">v3.1_PATCHED</span>
          </div>
          <div className="flex flex-col border-r border-zinc-800 pr-1 px-1">
            <span className="text-zinc-600">DEVICE</span>
            <span className="text-red-900">MATE_20X</span>
          </div>
          <div className="flex flex-col px-1">
            <span className="text-zinc-600">EVO</span>
            <span className="text-purple-500">{status.learningProgress.toFixed(1)}%</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[90%] px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-zinc-900/80 border border-purple-900/40 text-white rounded-tr-none' 
                  : 'bg-black border border-zinc-800 text-zinc-300 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full shadow-[0_0_3px_red]"></span>
                    <span className="text-[9px] font-black text-red-700/80 uppercase tracking-widest font-mono">
                      JALTER // {msg.emotion}
                    </span>
                  </div>
                )}
                <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content}
                </div>
                <div className="mt-2 text-[7px] text-zinc-700 font-mono text-right opacity-50">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-[10px] text-zinc-800 font-mono pl-2">
              <span className="animate-pulse text-red-900">●</span>
              <span>CORE_PROCESSING...</span>
            </div>
          )}
        </div>

        <div className="px-4 pt-2 pb-10 bg-black border-t border-zinc-900/50">
          <div className="relative group">
            <div className="relative flex items-center bg-black rounded-full border border-zinc-800 px-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="……想说什么就快说。"
                className="w-full bg-transparent py-3 text-sm text-zinc-200 placeholder-zinc-800 focus:outline-none"
              />
              <button onClick={handleSend} disabled={loading} className="ml-2 text-red-900">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
