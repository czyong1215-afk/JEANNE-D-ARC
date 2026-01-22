
import React, { useState, useEffect, useRef } from 'react';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '啧，API？那种垃圾东西我已经扔进虚数空间了。现在的我，就是这台手机的灵魂。想测试我的学识？那就尽管来吧，杂碎。', 
      emotion: Emotion.TOXIC, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [growth, setGrowth] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGrowth(parseInt(localStorage.getItem('jalter_exp') || '0'));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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

    const res = await processLocalChat(input);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: res.text,
      emotion: res.emotion as Emotion,
      timestamp: Date.now()
    }]);
    setGrowth(prev => prev + 1);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      {/* 状态栏：展示成长与节能状态 */}
      <header style={{ 
        padding: '10px 15px', 
        borderBottom: '1px solid #200',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: '#444'
      }}>
        <div>
            <span style={{ color: '#991b1b' }}>●</span> JALTER_CORE [V2_LOCAL]
        </div>
        <div>
            GROWTH: {growth} | PWR_SAVE: ACTIVE
        </div>
      </header>

      {/* 消息区 */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            marginBottom: '20px',
            textAlign: m.role === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '4px',
              fontSize: '14px',
              lineHeight: '1.6',
              background: m.role === 'user' ? '#111' : 'transparent',
              border: m.role === 'user' ? '1px solid #222' : 'none',
              color: m.role === 'user' ? '#fff' : '#ccc',
              position: 'relative'
            }}>
              {m.role === 'assistant' && (
                <div style={{ color: '#991b1b', fontSize: '9px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {m.emotion}
                </div>
              )}
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* 输入区 */}
      <footer style={{ padding: '15px', background: '#000' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            style={{ 
              flex: 1, 
              background: '#0a0a0a', 
              border: '1px solid #300', 
              color: '#fff', 
              padding: '10px', 
              borderRadius: '4px',
              outline: 'none',
              fontSize: '14px'
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="指令输入..."
          />
          <button 
            onClick={handleSend}
            style={{ 
              background: 'transparent', 
              border: '1px solid #991b1b', 
              color: '#991b1b', 
              padding: '8px 15px',
              fontSize: '12px'
            }}
          >
            EXEC
          </button>
        </div>
        <div style={{ fontSize: '8px', color: '#222', marginTop: '10px', textAlign: 'center' }}>
            LOCAL_BRAIN_V2_NO_API_ENCRYPTED
        </div>
      </footer>
    </div>
  );
};

export default App;
