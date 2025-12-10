import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import InsightsPanel from './components/InsightsPanel';
import ChatPanel from './components/ChatPanel';
import { uploadDataset, askQuestion } from './api';
import './App.css';

function App() {
    const [datasetSummary, setDatasetSummary] = useState(null);
    const [insights, setInsights] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [chartConfig, setChartConfig] = useState(null);
    const [sampleQuestions, setSampleQuestions] = useState([]);

    const handleFileSelected = async (file) => {
        setIsLoading(true);
        try {
            const data = await uploadDataset(file);

            const mappedSummary = {
                num_rows: data.pandas_summary.rows,
                num_columns: data.pandas_summary.columns,
                columns: data.pandas_summary.column_names,
                dtypes: data.pandas_summary.dtypes
            };

            setDatasetSummary(mappedSummary);
            console.log("DEBUG: Upload response data:", data); // Debug log
            setInsights(data.gemini_summary);

            const fallbackQuestions = [
                "Describe this dataset",
                "What are the main columns?",
                "Show the first 5 rows",
                "Count the number of rows"
            ];
            setSampleQuestions((data.sample_questions && data.sample_questions.length > 0) ? data.sample_questions : fallbackQuestions);

            console.log("DEBUG: Set sample questions:", (data.sample_questions && data.sample_questions.length > 0) ? data.sample_questions : fallbackQuestions); // Debug log
            setMessages([{ role: "assistant", content: "Dataset uploaded! You can now ask questions about it." }]);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendChat = async (text) => {
        const newMessages = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const data = await askQuestion(text);

            const assistantMessage = { role: "assistant", content: data.answer_text };
            setMessages([...newMessages, assistantMessage]);

            if (data.chart_data && data.chart_config) {
                setChartData(data.chart_data);
                setChartConfig(data.chart_config);
            }

            if (data.followup_questions) {
                setSampleQuestions(data.followup_questions);
            }

            if (data.execution_error) {
                setMessages(prev => [...prev, { role: "assistant", content: `(Code execution error: ${data.execution_error})` }]);
            }

        } catch (error) {
            console.error("Chat failed", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Error communicating with server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                    <h1 style={{ fontSize: '1.2rem', margin: 0 }}>AI Agent</h1>
                </div>

                <FileUpload onFileSelected={handleFileSelected} isLoading={isLoading} />

                <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }}></div>

                <InsightsPanel summary={datasetSummary} insights={insights} />
            </aside>

            <main className="main-content">
                <ChatPanel
                    messages={messages}
                    onSend={handleSendChat}
                    isLoading={isLoading}
                    chartData={chartData}
                    chartConfig={chartConfig}
                    sampleQuestions={sampleQuestions}
                />
            </main>
        </div>
    );
}

export default App;
