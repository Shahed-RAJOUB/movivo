import { useEffect, useState } from "react";
import { theme } from "../../theme/theme";
import Card from "../shared/Card";
import { CONFIG } from "../../config";


export default function PatientHistory({ patient }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (patient) {
            setLoading(true);
            const fullName = `${patient.surname} ${patient.firstName}`;
            fetch(`${CONFIG.API_BASE_URL}/api/history/${encodeURIComponent(fullName)}`)
                .then(res => res.json())

                .then(data => {
                    // Sort history by time descending (newest first)
                    const sortedData = data.sort((a, b) => new Date(b._time) - new Date(a._time));
                    setHistory(sortedData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching history:", err);
                    setLoading(false);
                });
        }
    }, [patient]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-t-[#E8594F] border-[#f0e8e0] animate-spin mb-4" />
                <div className="text-[#b0a49a] text-sm font-medium tracking-wide uppercase">Lade Verlauf...</div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-[#faf5f0] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#b0a49a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="text-lg font-semibold text-[#3d3129] mb-1">Keine Aufnahmen</div>
                <div className="text-sm text-[#b0a49a] max-w-xs">
                    Für diesen Patienten wurden bisher noch keine FMS Assessment Sessions aufgezeichnet.
                </div>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#3d3129] tracking-tight">Assessment Verlauf</h2>
                    <p className="text-sm text-[#b0a49a] mt-1">FMS Squats Analyse & Video Recording</p>
                </div>
                <div className="flex gap-2 text-xs font-semibold uppercase tracking-wider text-[#b0a49a]">
                    Total: <span className="text-[#3d3129]">{history.length} Sessions</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {history.map((session, index) => (
                    <HistoryItem key={session.session_id || index} session={session} />
                ))}
            </div>
        </div>
    );
}

function HistoryItem({ session }) {
    const date = new Date(session._time);
    const formattedDate = date.toLocaleDateString("de-DE", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    const formattedTime = date.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <Card className="overflow-hidden !p-0 flex flex-col group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Header Area */}
            <div className="p-6 border-b border-[#f0e8e0] bg-[#fdfaf8]">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-[#3d3129]">{formattedDate}</span>
                            <span className="w-1 h-1 rounded-full bg-[#d0c4ba]" />
                            <span className="text-sm font-medium text-[#b0a49a]">{formattedTime} Uhr</span>
                        </div>
                        <div className="text-[11px] font-mono text-[#b0a49a] tracking-widest uppercase">
                            ID: {session.session_id?.substring(0, 8)}...
                        </div>
                    </div>
                </div>
            </div>


            {/* Content Area */}
            <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <MetricBox 
                        label="Max. Winkel" 
                        value={`${Math.round(session.max_angle)}°`} 
                        icon={<path d="M12 2v20m10-10H2" />} 
                    />
                    <MetricBox 
                        label="FMS Score" 
                        value={`${session.fms_score} / 3`} 
                        status={session.fms_score >= 2 ? "success" : "warning"}
                        icon={<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    />
                    <MetricBox 
                        label="Squats" 
                        value={session.squat_count} 
                        status="neutral"
                        icon={<path d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    />
                </div>


                {session.video_url && (
                    <div className="relative rounded-2xl overflow-hidden shadow-sm bg-black aspect-video group/video">
                        <video 
                            className="w-full h-full object-cover opacity-90 group-hover/video:opacity-100 transition-opacity"
                            src={`${CONFIG.VIDEO_BASE_URL}/videos/${session.video_url}`}
                            controls
                            poster={`${CONFIG.VIDEO_BASE_URL}/videos/${session.video_url.replace('.mp4', '.jpg')}`} // Assuming a thumbnail exists or can be served
                        >

                            Your browser does not support the video tag.
                        </video>
                        {!session.video_url && (
                            <div className="absolute inset-0 flex items-center justify-center text-[#b0a49a] text-sm">
                                Video nicht verfügbar
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-[#b0a49a] hover:text-[#E8594F] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>
        </Card>
    );
}

function MetricBox({ label, value, status, icon }) {
    const statusColor = status === "success" ? "bg-green-400" : status === "warning" ? "bg-amber-400" : "bg-gray-300";

    return (
        <div className="bg-[#fafafa] border border-[#f0e8e0] rounded-xl p-4 flex flex-col gap-1 transition-colors hover:bg-white hover:border-[#E8594F]/30">
            <div className="text-[11px] font-semibold text-[#b0a49a] uppercase tracking-wide flex justify-between">
                {label}
                {status !== "neutral" && (
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                )}
            </div>
            <div className="text-xl font-bold text-[#3d3129]">
                {value}
            </div>
        </div>
    );
}
