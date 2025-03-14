import { useEffect } from "react";

const useWebSocket = (url, onMessage) => {
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => console.log("✅ WebSocket Connected");
    ws.onmessage = (event) => {
      console.log("📩 Received:", event.data);
      const cmd = event.data.toLowerCase();

      let action = null;

      if (cmd === "move forward") action = { type: "move", target: [0, 1, -3] };
      else if (cmd === "move backward") action = { type: "move", target: [0, 1, 3] };
      else if (cmd === "move left") action = { type: "move", target: [-3, 1, 0] };
      else if (cmd === "move right") action = { type: "move", target: [3, 1, 0] };
      else if (cmd === "jump") action = { type: "jump" };
      else if (cmd === "spin") action = { type: "spin" };

      if (action) onMessage(action);
    };

    ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
    ws.onclose = () => console.log("🔌 WebSocket Disconnected");

    return () => ws.close();
  }, [url, onMessage]);
};

export default useWebSocket;
