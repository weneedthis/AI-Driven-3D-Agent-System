import 'package:flutter/material.dart';
import 'package:web_socket_channel/io.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'WebSocket AI Control',
      theme: ThemeData.dark(),
      home: const ChatScreen(),
    );
  }
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late WebSocketChannel channel;
  final TextEditingController _controller = TextEditingController();
  List<String> messages = [];
  bool isConnected = false;

  final String serverUrl = 'ws://localhost:5000/';

  @override
  void initState() {
    super.initState();
    connectWebSocket();
  }

  void connectWebSocket() {
    try {
      channel = IOWebSocketChannel.connect(serverUrl);
      setState(() => isConnected = true);
      print("WebSocket Connected");

      channel.stream.listen(
        (message) {
          print("Received: $message");
          setState(() => messages.add("AI: $message"));
        },
        onError: (error) {
          print("WebSocket Error: $error");
          setState(() => isConnected = false);
          reconnect();
        },
        onDone: () {
          print("WebSocket Disconnected");
          setState(() => isConnected = false);
          reconnect();
        },
      );
    } catch (e) {
      print("Connection Error: $e");
      setState(() => isConnected = false);
      reconnect();
    }
  }

  void reconnect() {
    Future.delayed(const Duration(seconds: 3), () {
      if (!isConnected) {
        print("Reconnecting...");
        connectWebSocket();
      }
    });
  }

  void sendMessage() {
    if (_controller.text.isNotEmpty && isConnected) {
      String msg = _controller.text.toLowerCase();
      print("Sending: $msg");
      channel.sink.add(msg);
      setState(() => messages.add("You: $msg"));
      _controller.clear();
    } else {
      print("Cannot send message, WebSocket disconnected");
    }
  }

  @override
  void dispose() {
    channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("WebSocket AI Control"),
        actions: [
          Icon(
            isConnected ? Icons.wifi : Icons.wifi_off,
            color: isConnected ? Colors.green : Colors.red,
          ),
          const SizedBox(width: 15),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) => Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                child: Card(
                  color: index % 2 == 0 ? Colors.grey[850] : Colors.black12,
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Text(messages[index], style: const TextStyle(fontSize: 16)),
                  ),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(labelText: "Enter Command"),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.blueAccent),
                  onPressed: sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
