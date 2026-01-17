// components/LiveActivityChart.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const socket = io("http://localhost:5000");

const LiveActivityChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("statusUpdate", (event) => {
      setData((prev) => {
        const updated = [...prev, {
          time: new Date(event.timestamp).toLocaleTimeString(),
          status: event.status === "Active" ? 1 : 0
        }];
        return updated.slice(-20); // Keep last 20 records
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">🖱️ Live Mouse/Keyboard Activity</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis ticks={[0, 1]} domain={[0, 1]} />
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="status" stroke="#10b981" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveActivityChart;
