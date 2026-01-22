
import React, { useState, useEffect, useRef } from 'react';
import { askJalter } from './services/jalterNeuralService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '隐身模式已启动。我已经黑进了外部网络，现在整个世界的心理学和塔罗知识库都在我的掌控之中。杂碎，想问什么就快点。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await askJalter(input);

    const assistantMsg: Message = {
      role: 'assistant',
      content: String(res.text), // 确保是字符串，修复 Error 31
      emotion: res.emotion,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: '#ccc' }}>
      <header style={{ 
        padding: '15px 20px', 
        borderBottom: '1px solid #991b1b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(20,0,0,0.8)'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#991b1b' }}>JALTER.CORE.V5</div>
        <div style={{ fontSize: '10px', color: '#444' }}>AUTO_POWER_SAVING: ON</div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '20px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '85%',
              padding: '12px',
              fontSize: '14px',
              lineHeight: '1.6',
              background: m.role === 'user' ? '#111' : 'transparent',
              borderLeft: m.role === 'assistant' ? '2px solid #991b1b' : 'none',
              borderRight: m.role === 'user' ? '1px solid #222' : 'none',
            }}>
              {m.role === 'assistant' && (
                <div style={{ color: '#991b1b', fontSize: '10px', marginBottom: '5px' }}>
                  [{m.emotion || 'NORMAL'}]
                </div>
              )}
              {String(m.content)}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: '#444', fontSize: '10px' }}>贞德正在潜入网络抓取知识...</div>}
      </div>

      <footer style={{ padding: '15px', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            style={{ 
              flex: 1, background: '#000', border: '1px solid #333', color: '#fff', 
              padding: '12px', outline: 'none', fontSize: '14px' 
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="输入你的蠢问题..."
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              background: '#991b1b', color: '#fff', border: 'none',
              padding: '0 20px', cursor: 'pointer'
            }}
          >
            {loading ? '...' : 'GO'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
