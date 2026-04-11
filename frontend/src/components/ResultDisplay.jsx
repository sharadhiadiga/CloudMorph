import React from "react";
import { Activity, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResultDisplay({ result }) {
    if (!result) return null;

    const isSuccess = result.status === "success";

    return (
        <div className="card" style={{ marginTop: "32px", border: isSuccess ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
            <div className="card-title">
                <Activity size={22} style={{ color: isSuccess ? "#22c55e" : "#ef4444" }} />
                <span>Migration Summary</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                {isSuccess ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", backgroundColor: "#dcfce7", padding: "8px 16px", borderRadius: "100px", fontWeight: "700", fontSize: "0.875rem" }}>
                        <CheckCircle2 size={18} />
                        Successfully Discovered & Deployed
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#991b1b", backgroundColor: "#fee2e2", padding: "8px 16px", borderRadius: "100px", fontWeight: "700", fontSize: "0.875rem" }}>
                        <AlertCircle size={18} />
                        Migration Instance Error
                    </div>
                )}
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
                <pre style={{ margin: 0, fontSize: "0.8rem", color: "#475569", overflowX: "auto" }}>
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>

            {isSuccess && (
                <div>
                    <h4 style={{ marginBottom: "12px", fontSize: "1rem" }}>Application Endpoint</h4>
                    <a href={result.deployment_url} target="_blank" rel="noreferrer" className="url-badge">
                        <ExternalLink size={18} />
                        {result.deployment_url}
                    </a>
                </div>
            )}
        </div>
    );
}