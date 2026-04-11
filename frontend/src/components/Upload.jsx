import React, { useState } from "react";
import { Upload as UploadIcon, Link as LinkIcon, FileCheck, Layers } from "lucide-react";

export default function Upload({ setInput }) {
    const [fileName, setFileName] = useState("");
    const [repo, setRepo] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file?.name || "");

        setInput({
            input_type: "zip",
            file: file,
            repo_url: null,
        });
    };

    const handleRepoChange = (e) => {
        const value = e.target.value;
        setRepo(value);

        setInput({
            input_type: "repo",
            file: null,
            repo_url: value,
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="card-title">
                <Layers size={22} style={{ color: "#a855f7" }} />
                <span>Application Source</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                <div className="input-group">
                    <label className="input-label">Upload ZIP Archive</label>
                    <div style={{ position: "relative", height: "46px" }}>
                        <input
                            type="file"
                            accept=".zip"
                            onChange={handleFileChange}
                            style={{
                                opacity: 0,
                                position: "absolute",
                                inset: 0,
                                cursor: "pointer",
                                zIndex: 10,
                                width: "100%"
                            }}
                        />
                        <div className="input-field" style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            height: "100%",
                            backgroundColor: fileName ? "rgba(96, 165, 250, 0.05)" : "white",
                            borderColor: fileName ? "#60a5fa" : "#e2e8f0"
                        }}>
                            {fileName ? <FileCheck size={18} color="#2563eb" /> : <UploadIcon size={18} color="#94a3b8" />}
                            <span style={{ color: fileName ? "#1e293b" : "#94a3b8", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {fileName || "Choose .zip file"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Repository URL</label>
                    <div style={{ position: "relative" }}>
                        <LinkIcon size={18} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            type="text"
                            className="input-field"
                            style={{ paddingLeft: "40px" }}
                            placeholder="https://github.com/user/repo"
                            value={repo}
                            onChange={handleRepoChange}
                        />
                    </div>
                </div>
            </div>

            {(fileName || repo) && (
                <div style={{
                    padding: "12px 16px",
                    backgroundColor: "rgba(168, 85, 247, 0.05)",
                    borderRadius: "12px",
                    border: "1px dashed rgba(168, 85, 247, 0.3)",
                    fontSize: "0.875rem",
                    color: "#7e22ce"
                }}>
                    <strong>Active Source:</strong> {fileName || repo}
                </div>
            )}
        </div>
    );
}