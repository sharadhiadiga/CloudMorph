import React from "react";

export default function DeployButton({ onDeploy, disabled }) {
    return (
        <button onClick={onDeploy} disabled={disabled}>
            🚀 Deploy
        </button>
    );
}