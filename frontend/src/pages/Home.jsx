import React, { useState } from "react";
import Upload from "../components/Upload";
import DeployButton from "../components/DeployButton";
import Logs from "../components/Logs";
import ResultDisplay from "../components/ResultDisplay";

export default function Home() {
    const [input, setInput] = useState(null);
    const [logs, setLogs] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDeploy = async () => {
        if (!input) return alert("Provide input!");

        setLoading(true);
        setLogs(["🚀 Starting deployment..."]);
        setResult(null);

        try {
            let response;

            // ZIP case
            if (input.input_type === "zip") {
                const formData = new FormData();
                formData.append("file", input.file);

                response = await fetch("http://localhost:5000/deploy", {
                    method: "POST",
                    body: formData,
                });
            }

            // Repo case
            else if (input.input_type === "repo") {
                response = await fetch("http://localhost:5000/deploy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ repo_url: input.repo_url }),
                });
            }

            const data = await response.json();

            setResult(data);

            if (data.status === "success") {
                setLogs((prev) => [...prev, "✅ Deployment successful"]);
            } else {
                setLogs((prev) => [...prev, "❌ Deployment failed"]);
            }

        } catch (err) {
            setLogs(["❌ Error during deployment"]);
        }

        setLoading(false);
    };
    return (
        <div style={{ padding: "20px" }}>
            <h1>🚀 Cloud Migration Automation Tool</h1>

            <Upload setInput={setInput} />

            <DeployButton onDeploy={handleDeploy} disabled={loading} />

            {loading && <p>⏳ Deploying...</p>}

            <Logs logs={logs} />

            <ResultDisplay result={result} />
        </div>
    );
}