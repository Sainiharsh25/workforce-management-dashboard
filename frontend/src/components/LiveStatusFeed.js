import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://workforce-backend-syjg.onrender.com"); // match your backend port

const LiveStatusFeed = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ WebSocket Connected");
    });

    // Listen for statusUpdate event from backend
    socket.on("statusUpdate", (data) => {
      setLogs((prev) => [
        { type: "status", ...data },
        ...prev.slice(0, 19), // keep max 20 logs
      ]);
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">📡 Live Activity Feed</h3>
      <div className="h-64 overflow-y-auto text-sm text-gray-800">
        {logs.length === 0 && <p className="text-gray-400">Waiting for activity...</p>}
        {logs.map((log, index) => (
          <div key={index} className="border-b py-1">
            <span className="font-semibold text-blue-600">{log.employeeId}</span> →
            <span className="ml-2">{log.status}</span>
            {log.location && (
              <span className="ml-2 text-green-600">@ {log.location}</span>
            )}
            {log.activity && (
              <span className="ml-2 italic text-purple-600">({log.activity})</span>
            )}
            <span className="ml-2 text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStatusFeed;
