import React from "react";

export default function ResultDisplay({ result }) {
    if (!result) return null;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>📊 Deployment Summary</h3>

            <pre>{JSON.stringify(result, null, 2)}</pre>

            {result.status === "success" ? (
                <div>
                    <h3>🌐 Live URL</h3>
                    <a href={result.deployment_url} target="_blank" rel="noreferrer">
                        {result.deployment_url}
                    </a>
                </div>
            ) : (
                <h3 style={{ color: "red" }}>❌ Deployment Failed</h3>
            )}
        </div>
    );
}