'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle, Smartphone } from 'lucide-react';
import styles from './ChatWidget.module.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

function WelcomeMessage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', lineHeight: '1.5' }}>
            <p style={{ margin: 0 }}>
                👋 Hi! I&apos;m <strong>Blue</strong>, Nathan&apos;s assistant. I&apos;m here to help you get the most out of our <strong>53+ free tools</strong> (almost 100 tools!).
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.05em' }}>📱 Follow for Tutorials</p>
                <p style={{ margin: 0 }}>
                    Check out our TikTok for step-by-step tool tutorials:{' '}
                    <a
                        href="https://www.tiktok.com/@apex_bluesky"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
                    >
                        @apex_bluesky
                    </a>
                </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.05em' }}>📲 Get the App</p>
                <p style={{ margin: 0 }}>
                    Download the <strong>ApexBlueSkyTools</strong> app — search{' '}
                    <strong>&quot;ApexBlueSkyTools&quot;</strong> on the{' '}
                    <a
                        href="https://play.google.com/store/search?q=ApexBlueSkyTools&c=apps"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
                    >
                        Play Store
                    </a>{' '}
                    or scan the QR code on our homepage! 🚀
                </p>
            </div>
        </div>
    );
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [errorStatus, setErrorStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: '__welcome__',
        },
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const textToSubmit = inputValue.trim();
        if (!textToSubmit || isLoading) return;

        setErrorStatus(null);
        setInputValue('');

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSubmit,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        const assistantId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.details || errData.error || 'Request failed');
            }

            const reader = response.body!.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });
                setMessages(prev =>
                    prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m)
                );
            }
        } catch (err: any) {
            setErrorStatus(err.message || "Failed to send message. Please try again.");
            setMessages(prev => prev.filter(m => m.id !== assistantId));
            setInputValue(textToSubmit);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className={styles.widgetContainer}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={styles.chatWindow}
                    >
                        <div className={styles.chatHeader}>
                            <div className={styles.headerTitle}>
                                <div className={styles.onlineIndicator} />
                                <Sparkles size={18} className="gradient-text" style={{ color: 'var(--accent-primary)' }} />
                                <span>Blue Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.messagesContainer} ref={scrollRef}>
                            {(messages || []).map((m: any) => (
                                <div
                                    key={m.id}
                                    className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.aiMessage
                                        }`}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        {m.role === 'user' ? (
                                            <User size={12} style={{ opacity: 0.7 }} />
                                        ) : (
                                            <Bot size={12} style={{ opacity: 0.7 }} />
                                        )}
                                        <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>
                                            {m.role === 'user' ? 'You' : 'Blue'}
                                        </span>
                                    </div>
                                    {m.id === 'welcome' ? <WelcomeMessage /> : m.content}
                                </div>
                            ))}

                            {isLoading && (
                                <div className={styles.typing}>
                                    <Bot size={14} />
                                    <span>Blue is thinking...</span>
                                </div>
                            )}

                            {errorStatus && (
                                <div className={`${styles.message} ${styles.aiMessage}`} style={{ borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
                                        <AlertCircle size={14} />
                                        <span style={{ fontSize: '0.85rem' }}>{errorStatus}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSend} className={styles.inputArea}>
                            <div className={styles.inputWrapper}>
                                <input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Ask me about our tools..."
                                    className={styles.input}
                                    autoComplete="off"
                                    id="blue-chat-input"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim()}
                                    className={styles.sendButton}
                                    aria-label="Send message"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={styles.chatBubble}
                aria-label="Open chat"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </div>
    );
}
