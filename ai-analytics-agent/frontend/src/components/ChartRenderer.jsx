import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    ScatterChart,
    Scatter,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartRenderer = ({ data, config }) => {
    const chartRef = useRef(null);

    const handleDownload = async () => {
        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current);
            const link = document.createElement('a');
            link.download = 'chart.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    if (!data || !config || !config.type) {
        return null;
    }

    const { type, xKey, yKey, title } = config;

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey={xKey} stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f3f4f6' }}
                        />
                        <Legend />
                        <Bar dataKey={yKey} fill="#8884d8" />
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey={xKey} stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f3f4f6' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey={yKey} stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                );
            case 'scatter':
                return (
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" dataKey={xKey} name={xKey} stroke="#9ca3af" />
                        <YAxis type="number" dataKey={yKey} name={yKey} stroke="#9ca3af" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f3f4f6' }}
                        />
                        <Legend />
                        <Scatter name={title || 'Data'} data={data} fill="#8884d8" />
                    </ScatterChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey={yKey || 'value'} // Pie charts usually need a 'value' key, or yKey
                            nameKey={xKey || 'name'}  // and a 'name' key, or xKey
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#f3f4f6' }}
                        />
                        <Legend />
                    </PieChart>
                );
            default:
                return <p style={{ color: 'red' }}>Unsupported chart type: {type}</p>;
        }
    };

    return (
        <div style={{ width: '100%', marginTop: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                <button
                    onClick={handleDownload}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.8rem'
                    }}
                    title="Download Chart"
                >
                    <Download size={16} /> Download
                </button>
            </div>
            <div ref={chartRef} style={{ width: '100%', height: 400, background: 'white', padding: '10px', borderRadius: '8px' }}>
                {title && <h4 style={{ textAlign: 'center', marginBottom: '10px', color: '#374151' }}>{title}</h4>}
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartRenderer;
