import { useEffect, useRef, useState } from 'react';
import {
  CARETRACK_ASSISTANT,
  CARETRACK_QUICK_QUESTIONS,
} from '../data/caretrackKnowledge';
import { answerCareTrackQuestion } from '../utils/chatbotEngine';
import Logo from './Logo';

function nowLabel() {
  return new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function CareTrackChatbot() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'greet', role: 'assistant', text: CARETRACK_ASSISTANT.greeting, at: nowLabel() },
  ]);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const replyTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (replyTimer.current) window.clearTimeout(replyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  useEffect(() => {
    if (open && !closing && inputRef.current) inputRef.current.focus();
  }, [closing, open]);

  const closeChat = () => {
    setClosing(true);
  };

  const toggleChat = () => {
    if (open && !closing) {
      closeChat();
      return;
    }
    setClosing(false);
    setOpen(true);
  };

  const onPanelAnimEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (closing) {
      setOpen(false);
      setClosing(false);
    }
  };

  const ask = (question) => {
    const text = String(question || '').trim();
    if (!text || typing) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text, at: nowLabel() }]);
    setInput('');
    setTyping(true);

    const result = answerCareTrackQuestion(text);
    replyTimer.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: result.text, at: nowLabel() },
      ]);
      setTyping(false);
    }, 420);
  };

  const submit = (e) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      {open && (
        <section
          className={`ct-chat-panel mb-3 flex h-[min(34rem,calc(100vh-7.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white shadow-soft ${
            closing ? 'is-closing' : ''
          }`}
          role="dialog"
          aria-label="CareTrack Assistant"
          onAnimationEnd={onPanelAnimEnd}
        >
          <header className="flex items-start justify-between gap-3 bg-navy px-4 py-3 text-white">
            <div className="min-w-0">
              <div className="inline-flex rounded-lg bg-white px-2 py-1">
                <Logo to="/" showTagline={false} size="sm" />
              </div>
              <p className="mt-2 text-sm font-semibold">{CARETRACK_ASSISTANT.name}</p>
              <p className="text-[11px] text-slate-300">Questions about CareTrack — not medical advice</p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="rounded-lg px-2 py-1 text-lg leading-none text-slate-200 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-care-cream/40 px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`ct-chat-msg flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-care-blue text-white'
                      : 'rounded-bl-md border border-line bg-white text-navy'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.role === 'user' ? 'text-blue-100' : 'text-ink-muted'}`}>
                    {m.at}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink-muted">
                  <span className="ct-typing-dots" aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-white px-3 py-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {CARETRACK_QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => ask(q.query)}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-navy transition hover:border-care-blue hover:bg-blue-50 hover:text-care-blue"
                >
                  {q.label}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="flex items-center gap-2">
              <label className="sr-only" htmlFor="caretrack-chat-input">
                Ask a question about CareTrack
              </label>
              <input
                id="caretrack-chat-input"
                ref={inputRef}
                className="ct-input !py-2.5 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about CareTrack…"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={typing || !input.trim()}
                className="shrink-0 rounded-control bg-navy px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={toggleChat}
        className="ct-chat-fab ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-navy-deep"
        aria-expanded={open && !closing}
        aria-label={open && !closing ? 'Close CareTrack Assistant' : 'Open CareTrack Assistant'}
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <span className="text-lg leading-none" aria-hidden>
            💬
          </span>
        )}
      </button>
    </div>
  );
}
