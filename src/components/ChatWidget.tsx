'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import type { ApiError } from '../lib/api';
import styles from './ChatWidget.module.scss';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content:
    'Привет! Я AI-ассистент Ильи. Могу рассказать про его стек, опыт и проекты — просто спросите.',
};

const SUGGESTIONS = [
  'Какой опыт?',
  'С чем работал?',
  'Готов к удалёнке?',
  'Был ли AI в проектах?',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, open, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const next: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      // Send only the conversation (without the synthetic intro greeting)
      // to keep payload size small. Limit to the last 12 turns.
      const history = next
        .filter((_, i) => !(i === 0 && next[0].role === 'assistant'))
        .slice(-12);

      const res = await api.chat(history);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.reply },
      ]);
    } catch (e) {
      const err = e as ApiError;
      setError(err.message ?? 'Не удалось получить ответ. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const reset = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setInput('');
  };

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        aria-label={open ? 'Закрыть AI-чат' : 'Открыть AI-чат'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        data-open={open}
      >
        {open ? (
          <span aria-hidden>✕</span>
        ) : (
          <>
            <span className={styles.fabDot} />
            <span className={styles.fabLabel}>AI · спросить про меня</span>
          </>
        )}
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="AI-ассистент">
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.statusDot} />
              <div>
                <div className={styles.title}>AI-ассистент</div>
                <div className={styles.subtitle}>
                  Отвечает на основе моего профиля
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className={styles.reset}
              aria-label="Очистить диалог"
              title="Очистить"
            >
              ⟲
            </button>
          </header>

          <div className={styles.messages} ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.msg} ${
                  m.role === 'user' ? styles.user : styles.assistant
                }`}
              >
                <div className={styles.bubble}>{m.content}</div>
              </div>
            ))}

            {loading && (
              <div className={`${styles.msg} ${styles.assistant}`}>
                <div className={`${styles.bubble} ${styles.typing}`}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorBox} role="alert">
                <strong>Ошибка:</strong> {error}
              </div>
            )}
          </div>

          {messages.length <= 1 && !loading && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  disabled={loading}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className={styles.inputBar} onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Спросите про опыт, стек, проекты…"
              rows={1}
              disabled={loading}
              maxLength={1000}
              aria-label="Сообщение"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Отправить"
            >
              {loading ? <span className={styles.spinner} /> : '↑'}
            </button>
          </form>

          <div className={styles.disclaimer}>
            Это LLM. Ответы могут быть неточны — для важных вопросов
            используйте форму выше.
          </div>
        </div>
      )}
    </>
  );
}
