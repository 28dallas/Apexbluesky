'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // Using useChat for the backend logic, but managing input state manually for reliability
    const { messages, append, isLoading } = (useChat as any)({
        api: '/api/chat',
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: "Hi! I'm Blue. I know everything about our 33+ tools. How can I help you today?",
            },
        ],
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        append({
            role: 'user',
            content: inputValue,
        });
        setInputValue('');
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        {m.role === 'user' ? (
                                            <User size={12} style={{ opacity: 0.7 }} />
                                        ) : (
                                            <Bot size={12} style={{ opacity: 0.7 }} />
                                        )}
                                        <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>
                                            {m.role === 'user' ? 'You' : 'Blue'}
                                        </span>
                                    </div>
                                    {m.content}
                                </div>
                            ))}
                            {isLoading && (
                                <div className={styles.typing}>
                                    <Bot size={14} />
                                    <span>Blue is thinking...</span>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSend} className={styles.inputArea}>
                            <div className={styles.inputWrapper}>
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me about our tools..."
                                    className={styles.input}
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim()}
                                    className={styles.sendButton}
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
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </div>
    );
}
