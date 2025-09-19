import React, { useEffect, useState } from "react";

const TradeResults = ({ onClearLogs }) => {
    const [tradeLogs, setTradeLogs] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource("/api/stream-logs");

        eventSource.onmessage = (event) => {
            setTradeLogs((prev) => [...prev, event.data]);
        };

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Trade Results</h2>
                <button 
                    onClick={onClearLogs} 
                    style={{ 
                        backgroundColor: "#f44336", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "4px", 
                        padding: "6px 12px", 
                        cursor: "pointer" 
                    }}
                >
                    Clear Log
                </button>
            </div>

            <div style={{ 
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                maxHeight: "400px",
                overflowY: "auto",
                marginTop: "10px"
            }}>
                {tradeLogs.length > 0 ? (
                    tradeLogs.map((log, index) => {
                        let style = { margin: "5px 0", fontFamily: "monospace", whiteSpace: "pre-wrap" };
                        if (log.includes("SELL SIGNAL")) {
                            style.color = "red";
                            style.fontWeight = "bold";
                        } else if (log.includes("BUY SIGNAL")) {
                            style.color = "green";
                            style.fontWeight = "bold";
                        }
                        return (
                            <p key={index} style={style}>{log}</p>
                        );
                    })
                ) : (
                    <p>No trade results to display yet. Connect a broker and start trading!</p>
                )}
            </div>
        </div>
    );
};

export default TradeResults;

