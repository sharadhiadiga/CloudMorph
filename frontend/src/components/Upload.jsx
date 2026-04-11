import React, { useState } from "react";

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
        <div>
            <h3>📦 Application Input</h3>

            <input type="file" accept=".zip" onChange={handleFileChange} />
            {fileName && <p>📁 {fileName}</p>}

            <br /><br />

            <input
                type="text"
                placeholder="GitHub repo URL"
                value={repo}
                onChange={handleRepoChange}
            />
            {repo && <p>🔗 {repo}</p>}
        </div>
    );
}