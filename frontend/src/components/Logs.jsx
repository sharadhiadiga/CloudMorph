import React from "react";

export default function Logs({ logs }) {
    if (!logs.length) return null;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>📜 Deployment Logs</h3>
            {logs.map((log, index) => (
                <p key={index}>✅ {log}</p>
            ))}
        </div>
    );
}