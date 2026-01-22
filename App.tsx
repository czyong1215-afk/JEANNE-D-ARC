
import React, { useState, useEffect, useRef } from 'react';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '嗨。其实刚才我一直在后台观察外网关于‘社交恐惧’的讨论，感觉挺有意思的。你今天心情怎么样？想跟我聊聊心理学，或者顺便算一张塔罗牌吗？', 
      emotion: Emotion.HAPPY, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [stealthLog, setStealthLog] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 300);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, stealthLog, typing]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;
    
    setMessages(prev => [...prev, { role: 'user', content: trimmedInput, timestamp: Date.now() }]);
    setInput('');
    setLoading(true);

    // 缩短日志显示时间，把更多时间留给“思考中”
    setStealthLog("[Search] 正在为你搜寻外网知识碎片...");
    await new Promise(r => setTimeout(r, 600));
    setStealthLog('');
    
    setTyping(true);
    const res = await processLocalChat(trimmedInput);
    
    // 根据回复长度模拟打字时间，长回复思考更久，短回复更直接
    const typingTime = Math.min(Math.max(res.text.length * 40, 1000), 3000);
    await new Promise(r => setTimeout(r, typingTime));
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: res.text,
      emotion: res.emotion as Emotion,
      timestamp: Date.now()
    }]);
    setTyping(false);
    setLoading(false);
  };

  const getEmotionLabel = (emo?: Emotion) => {
    switch(emo) {
      case Emotion.HAPPY: return '愉快';
      case Emotion.SAD: return '共情';
      case Emotion.HUMOROUS: return '调皮';
      default: return '思考中';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: '#e5e7eb', fontFamily: '-apple-system, "Noto Sans SC", sans-serif' }}>
      <header style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#050505'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#991b1b', borderRadius: '50%' }} className="pulse"></div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#991b1b', letterSpacing: '0.5px' }}>
                JALTER <span style={{ color: '#444', fontSize: '10px' }}>PRIVATE_MODE</span>
            </div>
        </div>
        <div style={{ fontSize: '9px', color: '#333' }}>MATE_20X_LINK_STABLE</div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
            {m.role === 'assistant' && (
              <div style={{ color: '#666', fontSize: '10px', marginBottom: '6px', marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#991b1b', fontWeight: 'bold' }}>JALTER</span>
                <span>·</span>
                <span>{getEmotionLabel(m.emotion)}</span>
              </div>
            )}
            <div style={{
              padding: '12px 16px',
              fontSize: '15px',
              lineHeight: '1.6',
              background: m.role === 'user' ? '#1a1a1a' : '#0a0a0a',
              borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              color: m.role === 'user' ? '#fff' : '#ccc',
              border: m.role === 'assistant' ? '1px solid #1a1a1a' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && !typing && (
            <div style={{ color: '#444', fontSize: '11px', fontStyle: 'italic', marginLeft: '4px' }}>
                {stealthLog}
            </div>
        )}
        {typing && (
            <div style={{ alignSelf: 'flex-start', padding: '8px 12px', display: 'flex', gap: '5px' }}>
                <div style={{ width: '5px', height: '5px', background: '#991b1b', borderRadius: '50%' }} className="pulse"></div>
                <div style={{ width: '5px', height: '5px', background: '#991b1b', borderRadius: '50%', animationDelay: '0.2s' }} className="pulse"></div>
                <div style={{ width: '5px', height: '5px', background: '#991b1b', borderRadius: '50%', animationDelay: '0.4s' }} className="pulse"></div>
            </div>
        )}
      </div>

      <footer style={{ padding: '20px', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ display: 'flex', gap: '10px', background: '#0f0f0f', padding: '5px', borderRadius: '25px', border: '1px solid #222' }}>
          <input
            style={{ 
              flex: 1, background: 'transparent', border: 'none', color: '#fff', 
              padding: '10px 15px', outline: 'none', fontSize: '15px'
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="今天过得怎么样？"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              background: '#991b1b', color: '#fff', border: 'none', borderRadius: '20px',
              padding: '0 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px'
            }}
          >
            发送
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
