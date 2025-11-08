import React from "react";

const InsightsPanel = ({ summary, insights }) => {
    if (!summary) {
        return (
            <div className="sidebar-section">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    No dataset loaded.
                </p>
            </div>
        );
    }

    return (
        <div className="insights-panel">


            {insights && (
                <div className="sidebar-section">
                    <h3 className="sidebar-title">AI Summary</h3>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'var(--text-secondary)', maxHeight: '200px', overflowY: 'auto' }}>
                        {insights}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsightsPanel;
