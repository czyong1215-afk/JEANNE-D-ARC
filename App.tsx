
import React, { useState, useEffect, useRef } from 'react';
import { askJalter } from './services/jalterNeuralService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '隐身链路已稳定。我已经同步了外部心理学知识库，正在实时监听全球网络波动。杂碎，别盯着我看，有问题就快问。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 立即移除 Loading 屏幕
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, []);

  // 消息更新后滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;
    
    const userMsg: Message = { role: 'user', content: trimmedInput, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const res = await askJalter(trimmedInput);
        const assistantMsg: Message = {
          role: 'assistant',
          content: String(res.text || "切，网络波动..."),
          emotion: res.emotion,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
        console.error("Neural Error:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: '#ccc' }}>
      <header style={{ 
        padding: '12px 20px', 
        borderBottom: '1px solid #300',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#050000'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#991b1b' }}>
            JALTER.CORE.V5 <span style={{ fontSize: '9px', opacity: 0.5 }}>[ONLINE]</span>
        </div>
        <div style={{ fontSize: '10px', color: '#444' }}>MATE 20X OPTIMIZED</div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '20px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '90%',
              padding: '12px',
              fontSize: '14px',
              lineHeight: '1.5',
              background: m.role === 'user' ? '#111' : 'transparent',
              borderLeft: m.role === 'assistant' ? '2px solid #991b1b' : 'none',
              borderRight: m.role === 'user' ? '1px solid #222' : 'none',
              color: m.role === 'user' ? '#fff' : '#ccc',
            }}>
              {m.role === 'assistant' && (
                <div style={{ color: '#991b1b', fontSize: '10px', marginBottom: '4px' }}>
                  [{m.emotion || 'NORMAL'}]
                </div>
              )}
              {String(m.content)}
            </div>
          </div>
        ))}
        {loading && <div style={{ padding: '10px', color: '#444', fontSize: '11px' }}>正在隐身抓取外部知识库...</div>}
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
            placeholder="输入心理学或塔罗问题..."
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              background: '#991b1b', color: '#fff', border: 'none',
              padding: '0 20px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            {loading ? '...' : 'SEND'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
