📄 AI-Driven 3D Agent System – Documentation
📌 Project Overview
This project integrates AI agents in a 3D environment using React Three Fiber (Three.js), Flutter, and Node.js. The AI agents are controlled via WebSockets and can interact with users through natural language chat commands. The backend uses Gemini AI for natural language processing.

🛠️ Tech Stack
Component	Technology Used
🖥️ Frontend (Web)	React Three Fiber (Three.js), WebSockets
📱 Frontend (Mobile)	Flutter with WebSocket integration
🔌 Backend	Node.js, Express, WebSockets (Socket.io)
🤖 AI Processing	Google Gemini AI (Text-based response)
📡 Real-time Communication	WebSockets (Socket.io, Flutter WebSocket)
🎯 Features & Functionalities
1️⃣ AI-Driven 3D Agents
AI agents move in a 3D environment using commands from the user (e.g., "move forward", "jump", "spin").
Movements are rendered in Three.js in real-time.
2️⃣ WebSocket-Based Communication
Flutter sends chat commands to the server via WebSockets.
Server processes the command, updates agent position, and broadcasts updates to all connected clients.
3️⃣ AI-Generated Responses (Google Gemini)
User messages are sent to Gemini AI, which provides intelligent responses.
AI interprets chat commands and responds accordingly.
4️⃣ Real-Time Agent Updates
Server maintains agent positions and sends updates to all clients via WebSockets.
React renders these updates dynamically in the 3D space.
🔧 System Architecture
scss
Copy
Edit
Flutter (Chat)  ⇄  WebSocket Server (Node.js)  ⇄  React (3D Agents)
                ⇄  Google Gemini AI (Text Processing)
Flutter → Sends WebSocket commands (e.g., "move left")
Server (Node.js) → Processes the command & updates agent data
React (Three.js) → Receives updates & moves the AI agent in 3D
Google Gemini AI → Handles AI responses
🚀 Project Modules
📌 1. Flutter (Chat Application)
🔹 Features
✅ Connects to WebSocket Server
✅ Sends chat messages (e.g., "move right")
✅ Displays server responses
✅ Handles WebSocket errors & reconnections

🔹 Key Code
dart
Copy
Edit
void connectWebSocket() {
  channel = kIsWeb
      ? HtmlWebSocketChannel.connect(serverUrl)
      : IOWebSocketChannel.connect(serverUrl);

  channel.stream.listen(
    (message) {
      setState(() {
        messages.add("Server: $message");
      });
    },
    onError: (error) => reconnect(),
    onDone: () => reconnect(),
  );
}
📌 2. Backend (Node.js WebSocket Server)
🔹 Features
✅ Handles real-time communication
✅ Processes commands and updates agent position
✅ Uses Google Gemini AI for intelligent responses
✅ Broadcasts agent updates to all connected clients

🔹 Key Code
javascript
Copy
Edit
socket.on("message", (msg) => {
    console.log("📩 Received:", msg);
    let updatedPosition = [...agents[0].position];

    if (msg.includes("move forward")) updatedPosition[2] -= 3;
    else if (msg.includes("move backward")) updatedPosition[2] += 3;
    else if (msg.includes("move left")) updatedPosition[0] -= 3;
    else if (msg.includes("move right")) updatedPosition[0] += 3;
    else if (msg.includes("jump")) updatedPosition[1] += 5;
    else if (msg.includes("spin")) io.emit("agentAction", { type: "spin" });

    agents[0].position = updatedPosition;
    io.emit("agentUpdate", agents);
});
📌 3. Frontend (React Three Fiber - 3D Agents)
🔹 Features
✅ Receives WebSocket updates & moves agents
✅ Renders 3D environment using Three.js
✅ Supports animations (e.g., "spin", "jump")

🔹 Key Code
javascript
Copy
Edit
useEffect(() => {
  const ws = new WebSocket(url);

  ws.onmessage = (event) => {
    const cmd = event.data.toLowerCase();
    let newPos = [0, 1, 0];
    let newAction = "";

    if (cmd.includes("move forward")) newPos[2] -= 3;
    else if (cmd.includes("move backward")) newPos[2] += 3;
    else if (cmd.includes("move left")) newPos[0] -= 3;
    else if (cmd.includes("move right")) newPos[0] += 3;
    else if (cmd.includes("jump")) newAction = "jump";
    else if (cmd.includes("spin")) newAction = "spin";

    onMessage({ type: newAction ? newAction : "move", target: newPos });
  };
}, []);
📈 Project Workflow
1️⃣ User sends a message from Flutter chat ("move right")
2️⃣ Flutter WebSocket sends it to the backend
3️⃣ Backend processes command and updates agent position
4️⃣ Server sends updated agent data to all clients (React & Flutter)
5️⃣ React Three.js updates the 3D model in real time

📌 Improvements & Next Steps
🔹 Add More AI Interactions – Allow agents to respond with voice
🔹 Optimize WebSocket Connections – Reduce connection drops
🔹 Enhance Animations – Improve agent physics & movement
🔹 Deploy Server & WebSockets – Host on AWS/GCP for global access

📚 References
Flutter WebSockets: https://flutter.dev
React Three Fiber Docs: https://docs.pmnd.rs/react-three-fiber
Google Gemini AI: https://ai.google.dev
Socket.io WebSockets: https://socket.io
