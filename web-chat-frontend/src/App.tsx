import { useEffect, useRef, useState } from "react";

function App() {
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState("");
	const [roomId, setRoomId] = useState<string>("");
	const [newRoomId, setNewRoomId] = useState<string>("");
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (roomId) {
			const ws = new WebSocket("ws://localhost:8080");
			ws.onmessage = (ev) => setMessages((prev) => [...prev, ev.data]);
			ws.onopen = () =>
				ws.send(JSON.stringify({ type: "join", payload: { roomId } }));
			wsRef.current = ws;

			return () => ws.close();
		}
	}, [roomId]);

	const sendMessage = () => {
		if (input.trim() && wsRef.current) {
			wsRef.current.send(
				JSON.stringify({ type: "chat", payload: { message: input } })
			);
			setInput("");
		}
	};

	const createRoom = () => {
		const generatedRoomId = Math.floor(
			10000 + Math.random() * 90000
		).toString();
		setRoomId(generatedRoomId);
		setNewRoomId(generatedRoomId);
	};

	const copyRoomId = () => {
		navigator.clipboard.writeText(roomId);
		alert("Room ID copied to clipboard!");
	};

	return (
		<div className="h-screen flex items-center justify-center bg-gray-900 text-white p-4">
			<div className="w-full max-w-md bg-gray-800 rounded-lg shadow p-4 flex flex-col h-4/5">
				{!roomId ? (
					<div className="flex flex-col items-center space-y-4">
						<button
							onClick={createRoom}
							className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
						>
							Create a New Room
						</button>
						<div className="flex items-center">
							<input
								type="text"
								placeholder="Enter Room ID"
								value={newRoomId}
								onChange={(e) => setNewRoomId(e.target.value)}
								className="p-2 rounded-l-md bg-gray-700 text-white outline-none"
							/>
							<button
								onClick={() => setRoomId(newRoomId)}
								className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-md"
							>
								Join Room
							</button>
						</div>
					</div>
				) : (
					<div className="flex-1 flex flex-col">
						<div className="flex justify-between items-center mb-2">
							<p>Room ID: {roomId}</p>
							<button
								onClick={copyRoomId}
								className="bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600"
							>
								Copy Room ID
							</button>
						</div>
						<div className="flex-1 overflow-y-auto space-y-2">
							{messages.map((msg, idx) => (
								<div key={idx} className="bg-blue-500 p-2 rounded-md max-w-xs">
									{msg}
								</div>
							))}
						</div>
						<div className="flex mt-2">
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && sendMessage()}
								placeholder="Type a message..."
								className="flex-1 p-2 rounded-l-md bg-gray-700 text-white outline-none"
							/>
							<button
								onClick={sendMessage}
								className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md"
							>
								Send
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
