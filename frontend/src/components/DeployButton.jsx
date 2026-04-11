import React from "react";
import { Rocket } from "lucide-react";

export default function DeployButton({ onDeploy, disabled }) {
    return (
        <button className="btn btn-primary" onClick={onDeploy} disabled={disabled}>
            <Rocket size={20} />
            <span>Deploy Application</span>
        </button>
    );
}