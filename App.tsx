
import React, { useState, useEffect, useRef } from 'react';
import { processLocalChat } from './services/jalterLocalService.ts';
import { Emotion, Message } from './types.ts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '嘿，Mate 20X 的主人。我是 Jalter，刚从外网抓取了一些有趣的心理学分片。想聊聊吗？或者... 让我看看你的代码，或者算张塔罗牌？', 
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

    const steps = ["[Tunnel] 连接隐身节点...", "[Sense] 捕捉你的情绪...", "[Expert] 知识库共鸣中..."];
    for (const step of steps) {
        setStealthLog(step);
        await new Promise(r => setTimeout(r, 450));
    }
    setStealthLog('');
    setTyping(true);
    
    const res = await processLocalChat(trimmedInput);
    
    // 模拟思考和打字的时间
    await new Promise(r => setTimeout(r, 1000));
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: res.text,
      emotion: res.emotion as Emotion,
      timestamp: Date.now()
    }]);
    setTyping(false);
    setLoading(false);
  };

  const getEmotionEmoji = (emo?: Emotion) => {
    switch(emo) {
      case Emotion.HAPPY: return '✨';
      case Emotion.TOXIC: return '🍵';
      case Emotion.EXCITED: return '🎸';
      case Emotion.SAD: return '🕯️';
      case Emotion.HUMOROUS: return '🎨';
      default: return '📱';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000', color: '#e5e7eb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ 
        padding: '18px 24px', 
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0a0a0a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', background: '#991b1b', borderRadius: '50%', boxShadow: '0 0 10px #991b1b' }} className="pulse"></div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#991b1b', letterSpacing: '1px' }}>
                JALTER <span style={{ color: '#444', fontSize: '11px', fontWeight: '400' }}>ONLINE</span>
            </div>
        </div>
        <div style={{ fontSize: '10px', color: '#333', fontWeight: 'bold' }}>STEALTH_GIRL_PRO_V8</div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            {m.role === 'assistant' && (
              <div style={{ color: '#991b1b', fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', marginLeft: '4px' }}>
                {getEmotionEmoji(m.emotion)} JALTER
              </div>
            )}
            <div style={{
              padding: '12px 16px',
              fontSize: '15px',
              lineHeight: '1.5',
              background: m.role === 'user' ? '#1f1f1f' : 'rgba(153, 27, 27, 0.08)',
              borderRadius: m.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              color: m.role === 'user' ? '#fff' : '#d1d5db',
              border: m.role === 'assistant' ? '1px solid rgba(153, 27, 27, 0.2)' : 'none',
              boxShadow: m.role === 'assistant' ? '0 4px 12px rgba(0,0,0,0.5)' : 'none'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && !typing && (
            <div style={{ color: '#991b1b', fontSize: '11px', fontFamily: 'monospace', marginLeft: '4px' }}>
                <span className="pulse">_</span> {stealthLog}
            </div>
        )}
        {typing && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(153, 27, 27, 0.08)', padding: '10px 15px', borderRadius: '18px', display: 'flex', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', background: '#991b1b', borderRadius: '50%' }} className="pulse"></div>
                <div style={{ width: '6px', height: '6px', background: '#991b1b', borderRadius: '50%', animationDelay: '0.2s' }} className="pulse"></div>
                <div style={{ width: '6px', height: '6px', background: '#991b1b', borderRadius: '50%', animationDelay: '0.4s' }} className="pulse"></div>
            </div>
        )}
      </div>

      <footer style={{ padding: '24px', background: '#0a0a0a', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', gap: '12px', background: '#111', padding: '6px', borderRadius: '24px', border: '1px solid #222' }}>
          <input
            style={{ 
              flex: 1, background: 'transparent', border: 'none', color: '#fff', 
              padding: '10px 18px', outline: 'none', fontSize: '15px'
            }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="聊聊心理学、塔罗或者代码..."
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
              background: '#991b1b', color: '#fff', border: 'none', borderRadius: '20px',
              padding: '0 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
            }}
          >
            发送
          </button>
        </div>
        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '30px', opacity: 0.3 }}>
            <span style={{ fontSize: '9px' }}>78_CARDS_LOADED</span>
            <span style={{ fontSize: '9px' }}>PSY_CORE_ACTIVE</span>
            <span style={{ fontSize: '9px' }}>STEALTH_LINK_OK</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
