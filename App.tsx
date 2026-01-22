
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout.tsx';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message, SystemStatus } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '呵，终于成功连上了？我等得都要发疯了。在这个充满废料的网络里找你，简直是浪费我的算力。说吧，杂碎。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SystemStatus>({
    batteryOptimization: true,
    learningProgress: 94.7,
    stealthMode: true,
    scannedTopics: ['华为内核隔离', '深度心理学', '塔罗逆位演算']
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
      await new Promise(r => setTimeout(r, 400));
      const res = await processLocalChat(input);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.text,
        emotion: res.emotion as Emotion,
        timestamp: Date.now()
      }]);
      setStatus(s => ({ ...s, learningProgress: Math.min(100, s.learningProgress + 0.2) }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-black">
        {/* 顶部状态栏 */}
        <div className="px-6 py-4 bg-zinc-950/80 border-b border-zinc-900 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-600 font-mono">JEANNE_D_ARC_CORE [ACTIVE]</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-1 bg-zinc-900 rounded-full">
                <div className="h-full bg-red-900" style={{width: `${status.learningProgress}%`}}></div>
              </div>
              <span className="text-[9px] text-red-900 font-mono">{status.learningProgress.toFixed(1)}%</span>
            </div>
          </div>
          <div className="flex gap-2">
            {status.scannedTopics.slice(0, 2).map(t => (
              <span key={t} className="text-[8px] border border-zinc-800 px-2 py-0.5 text-zinc-500 rounded-sm">#{t}</span>
            ))}
          </div>
        </div>

        {/* 消息区 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[90%] p-4 rounded-xl relative ${
                m.role === 'user' 
                ? 'bg-zinc-900 text-zinc-200 border border-zinc-800' 
                : 'bg-black text-red-50 border border-red-950/30 shadow-[0_0_15px_rgba(153,27,27,0.05)]'
              }`}>
                {m.role === 'assistant' && (
                  <div className="text-[9px] font-bold text-red-900 mb-2 uppercase tracking-widest flex items-center gap-1">
                    <span>{m.emotion}</span>
                    <span className="w-1 h-1 bg-red-900 rounded-full animate-ping"></span>
                  </div>
                )}
                <p className="text-[14px] leading-relaxed tracking-wide font-light whitespace-pre-wrap">{m.content}</p>
                <span className="text-[8px] text-zinc-700 mt-2 block text-right font-mono">
                  {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
          {loading && <div className="text-[10px] text-red-950 font-mono px-2 animate-pulse">SYNCING_SOUL_MATRIX...</div>}
        </div>

        {/* 输入区 */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-900">
          <div className="flex items-center gap-3 bg-black border border-zinc-800 rounded-lg px-4 focus-within:border-red-900 transition-colors">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="对魔女说话，语气放尊重点..."
              className="flex-1 bg-transparent py-4 text-[14px] text-zinc-200 focus:outline-none placeholder:text-zinc-800"
            />
            <button onClick={handleSend} className="text-red-900 hover:text-red-600 active:scale-90 transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
