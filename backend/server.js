const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const fullText = response.text();
        return fullText.split("\n")[0];
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Error generating AI response.";
    }
}

let agents = [
    { id: 1, position: [0, 1, 0], status: "active" },
    { id: 2, position: [2, 1, 0], status: "idle" },
];

app.get("/agents", (req, res) => {
    res.json(agents);
});

app.post("/ai-agent", async (req, res) => {
    const { command } = req.body;
    const aiResponse = await getAIResponse(`An AI agent receives this command: ${command}. What should it do?`);
    
    res.json({ response: aiResponse });
});

app.post("/update-agent", (req, res) => {
    const { id, position } = req.body;
    agents = agents.map(agent => agent.id === id ? { ...agent, position } : agent);
    
    io.emit("agentUpdate", agents);
    res.json({ message: "Agent updated", agents });
});

io.on("connection", (socket) => {
    console.log("A client connected");

    socket.emit("agentUpdate", agents); 

    socket.on("message", (msg) => {
        console.log("Received from Flutter:", msg);

        const command = msg.toLowerCase();
        let updatedPosition = [...agents[0].position];

        if (command.includes("move forward")) updatedPosition[2] -= 3;
        else if (command.includes("move backward")) updatedPosition[2] += 3;
        else if (command.includes("move left")) updatedPosition[0] -= 3;
        else if (command.includes("move right")) updatedPosition[0] += 3;
        else if (command.includes("jump")) updatedPosition[1] += 5;
        else if (command.includes("spin")) io.emit("agentAction", { type: "spin" });

        agents[0].position = updatedPosition;
        io.emit("agentUpdate", agents);
        io.emit("agentMessage", { sender: "Flutter", message: msg });
    });

    socket.on("disconnect", () => {
        console.log("A client disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Server is running! AI Agent API with WebSockets is available.");
});
