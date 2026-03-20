import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './FloatingChat.css';

const GREETING = "Hi there! 👋 I'm Blinkit Support Bot. How can I help you today?";

const QUICK_REPLIES = [
  'Track my order',
  'Cancel my order',
  'Missing item in order',
  'Refund status',
  'Delivery time',
];

const RESPONSES = {
  'track': "You can track your order in real-time in the Order History section. Go to 📦 Orders from the menu!",
  'cancel': "Orders can be cancelled within 60 seconds of placing. Go to Orders → select your order → Cancel.",
  'missing': "Sorry about that! Please share your order ID and we'll arrange a refund or redelivery right away.",
  'refund': "Refunds are processed within 3–5 business days to your original payment method.",
  'delivery': "We deliver in 8–10 minutes on average. Heavy traffic or weather may cause slight delays.",
  'default': "Thanks for reaching out! A support agent will connect with you shortly. Is there anything else I can help with?",
};

function getBotReply(msg) {
  const l = msg.toLowerCase();
  if (l.includes('track') || l.includes('order status')) return RESPONSES.track;
  if (l.includes('cancel')) return RESPONSES.cancel;
  if (l.includes('miss') || l.includes('wrong')) return RESPONSES.missing;
  if (l.includes('refund') || l.includes('money')) return RESPONSES.refund;
  if (l.includes('time') || l.includes('how long') || l.includes('fast') || l.includes('minutes')) return RESPONSES.delivery;
  return RESPONSES.default;
}

const FloatingChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: getBotReply(text) }]);
    }, 700);
  };

  return (
    <div className="floating-chat">
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-avatar">🤖</span>
              <div>
                <p className="chat-bot-name">Blinkit Support</p>
                <p className="chat-status">🟢 Online</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {m.from === 'bot' && <span className="msg-avatar">🤖</span>}
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="quick-replies">
            {QUICK_REPLIES.map(r => (
              <button key={r} className="quick-reply-chip" onClick={() => send(r)}>{r}</button>
            ))}
          </div>

          <form className="chat-input-row" onSubmit={e => { e.preventDefault(); send(input); }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn" disabled={!input.trim()}>Send ↑</button>
          </form>
        </div>
      )}

      <button className="chat-fab" onClick={() => setOpen(v => !v)} aria-label="Support chat">
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default FloatingChat;
