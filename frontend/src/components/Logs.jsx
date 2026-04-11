import React from "react";
import { Terminal } from "lucide-react";

export default function Logs({ logs }) {
    if (!logs.length) return null;

    return (
        <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-title">
                <Terminal size={22} style={{ color: "var(--text-muted)" }} />
                <span>Migration Logs</span>
            </div>
            <div className="logs-container">
                {logs.map((log, index) => (
                    <div key={index} className="log-entry" style={{ color: log.includes("❌") ? "#ef4444" : "inherit" }}>
                        <span style={{ color: "#94a3b8", marginRight: "12px" }}>[{new Date().toLocaleTimeString()}]</span>
                        <span>{log}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}