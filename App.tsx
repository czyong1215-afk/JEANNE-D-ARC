
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { chatWithJalter } from './services/geminiService';
import { Emotion, Message, SystemStatus } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '哈？又把我唤醒了？你这无能的杂碎，最好是有什么正经事找我。', emotion: Emotion.TOXIC, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SystemStatus>({
    batteryOptimization: true,
    learningProgress: 42,
    stealthMode: true,
    scannedTopics: ['Carl Jung', 'Tarot Major Arcana', 'Python Optimization']
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
      const result = await chatWithJalter(input, messages);
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.text,
        emotion: result.emotion as Emotion,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
      
      // 模拟自主学习增长
      setStatus(prev => ({
        ...prev,
        learningProgress: Math.min(100, prev.learningProgress + 0.5),
        scannedTopics: Array.from(new Set([...prev.scannedTopics, ...result.links.slice(0,1)]))
      }));
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '啧，网络波动吗？别以为我会重复第二遍，死心吧。', emotion: Emotion.SAD, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* System Dashboard Snippet */}
        <div className="p-3 bg-gray-900/50 border-b border-purple-900/30 flex gap-4 overflow-x-auto whitespace-nowrap text-[10px] font-mono">
          <div className="flex flex-col">
            <span className="text-gray-500">BATTERY SAVER (OLED)</span>
            <span className="text-green-500">ACTIVE - 24% SAVED</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">STEALTH SCRAPING</span>
            <span className="text-purple-500">ENABLED</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">AI EVOLUTION</span>
            <div className="w-20 bg-gray-700 h-1 mt-1">
              <div className="bg-purple-600 h-full" style={{ width: `${status.learningProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-purple-900/40 border border-purple-500 text-white rounded-tr-none' 
                  : 'bg-zinc-900/80 border border-zinc-700 text-gray-200 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-bold border border-red-900">
                      {msg.emotion}
                    </span>
                    <span className="text-[10px] text-zinc-500">20yr Female / Jalter Core</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-1 text-[8px] text-gray-600 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/80 p-3 rounded-2xl rounded-tl-none animate-pulse flex gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-gray-950 border-t border-purple-900 sticky bottom-0">
          <div className="flex gap-2 items-center">
            <button className="p-2 text-purple-500 hover:text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="对黑化贞德说点什么..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className={`p-2 rounded-full transition-all ${loading ? 'text-gray-600' : 'text-purple-500 hover:bg-purple-950'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
