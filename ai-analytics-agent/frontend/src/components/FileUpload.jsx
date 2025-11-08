import React from "react";

const FileUpload = ({ onFileSelected, isLoading }) => {
    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) onFileSelected(file);
    };

    return (
        <div className="sidebar-section">
            <h3 className="sidebar-title">Data Source</h3>
            <div className="file-upload-zone">
                <label style={{ cursor: 'pointer', display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.5rem' }}>📂</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>
                        {isLoading ? "Uploading..." : "Upload CSV/Excel"}
                    </span>
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleChange}
                        disabled={isLoading}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>
        </div>
    );
};

export default FileUpload;
