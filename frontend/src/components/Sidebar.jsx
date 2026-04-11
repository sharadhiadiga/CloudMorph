import React from "react";
import { LayoutDashboard, Upload, Search, Container, Play, FileText, Settings } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
    const menus = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "upload", label: "Upload Source", icon: <Upload size={20} /> },
        { id: "analysis", label: "AI Analysis", icon: <Search size={20} /> },
        { id: "docker", label: "Dockerfile", icon: <Container size={20} /> },
        { id: "deployment", label: "Deployment", icon: <Play size={20} /> },
        { id: "report", label: "Migration Report", icon: <FileText size={20} /> },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex flex-col p-4">
            <div className="flex items-center gap-3 px-4 mb-10">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Container size={18} color="white" />
                </div>
                <span className="font-bold text-lg tracking-tight">CloudMorph</span>
            </div>

            <nav className="flex-1 space-y-1">
                {menus.map((menu) => (
                    <div
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`sidebar-item ${activeTab === menu.id ? "sidebar-item-active" : ""}`}
                    >
                        {menu.icon}
                        <span className="text-sm">{menu.label}</span>
                    </div>
                ))}
            </nav>

            <div className="pt-4 border-t border-border mt-auto">
                <div className="sidebar-item">
                    <Settings size={20} />
                    <span className="text-sm">Settings</span>
                </div>
            </div>
        </aside>
    );
}
