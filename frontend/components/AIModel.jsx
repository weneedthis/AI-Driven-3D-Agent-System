import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import AIAgent from "./AIAgent";
import axios from "axios";

const socket = io("http://localhost:5000");

const AIModel = () => {
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to WebSocket server"));

    socket.on("agentCommand", (cmd) => {
      console.log("Received command:", cmd);
      setAction(cmd);
    });

    socket.on("disconnect", () => console.log("WebSocket Disconnected"));

    return () => {
      socket.off("agentCommand");
      socket.disconnect();
    };
  }, []);

  const sendCommand = async () => {
    if (!command.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/ai-agent", { command });
      setResponse(res.data.response);

      const formattedCommand = command.toLowerCase();
      let actionData = null;

      if (["move left", "move right", "move forward", "move backward"].includes(formattedCommand)) {
        actionData = { type: "move", direction: formattedCommand.split(" ")[1] };
      } else if (formattedCommand === "jump") {
        actionData = { type: "jump" };
      } else if (formattedCommand === "spin") {
        actionData = { type: "spin" };
      }

      if (actionData) {
        socket.emit("agentCommand", actionData);
        setAction(actionData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error sending command:", error);
      setResponse("Error: Unable to process command");
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#121212", minHeight: "100vh" }}>
      <Canvas style={{ width: "100vw", height: "500px", background: "#252525" }} shadows camera={{ position: [5, 5, 10], fov: 50 }}>
        <OrbitControls />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} castShadow />
        <Grid infiniteGrid args={[20, 20]} sectionColor="#404040" />
        <AIAgent position={[0, 1, 0]} action={action} />
      </Canvas>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter AI Command (move left, jump, spin)"
          style={{ padding: 12, width: "300px", fontSize: "16px", borderRadius: "8px", backgroundColor: "#333", color: "#fff" }}
        />
        <button onClick={sendCommand} style={{ padding: "12px 20px", cursor: "pointer", backgroundColor: "#ff4747", color: "white" }}>
          Send
        </button>
      </div>

      <div style={{ marginTop: 20, padding: 20, backgroundColor: "#2c2c2c", color: "white", borderRadius: "10px", width: "50%", marginLeft: "auto", marginRight: "auto" }}>
        {loading ? <p>AI is thinking...</p> : <p>{response}</p>}
      </div>
    </div>
  );
};

export default AIModel;
