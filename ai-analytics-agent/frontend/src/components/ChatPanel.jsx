import React, { useState, useRef, useEffect } from "react";
import ChartRenderer from "./ChartRenderer";
import { Bot, User } from "lucide-react";

const ChatPanel = ({ onSend, messages, isLoading, chartData, chartConfig, sampleQuestions }) => {
    console.log("DEBUG: ChatPanel sampleQuestions:", sampleQuestions); // Debug log
    console.log("DEBUG: ChatPanel messages length:", messages.length); // Debug log
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, chartData]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-area">
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20%' }}>
                        <h3>Welcome to AI Analytics</h3>
                        <p>Upload your data for intelligent AI-driven analysis.</p>
                    </div>
                )}

                {messages.map((m, idx) => (
                    <div key={idx} className={`message-wrapper ${m.role}`}>
                        <div className="avatar">
                            {m.role === "user" ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className="message-content">
                            <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>

                            {/* Check if this is the latest assistant message and we have chart data */}
                            {m.role === "assistant" && idx === messages.length - 1 && chartData && chartConfig && (
                                <div className="chart-container-message">
                                    <ChartRenderer data={chartData} config={chartConfig} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Show suggestions if we have them */}
                {sampleQuestions && sampleQuestions.length > 0 && !isLoading && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', paddingBottom: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            {messages.length <= 1 ? "Try asking:" : "Suggested follow-ups:"}
                        </p>
                        {sampleQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                className="suggestion-chip"
                                onClick={() => onSend(q)}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    maxWidth: '80%',
                                    textAlign: 'left'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="message-wrapper assistant">
                        <div className="avatar"><Bot size={20} /></div>
                        <div className="message-content">
                            <span className="typing-indicator">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <div className="input-box">
                    <textarea
                        rows={1}
                        placeholder="Ask a question about your data..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button className="btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
