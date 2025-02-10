import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

function App() {
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState("");
	const [roomId, setRoomId] = useState<string>("");
	const [newRoomId, setNewRoomId] = useState<string>("");
	const wsRef = useRef<WebSocket | null>(null);
	const [isServerConnected, setIsServerConnected] = useState<boolean>(true); // Server status

	useEffect(() => {
		if (roomId) {
			const ws = new WebSocket("ws://localhost:8080");

			ws.onopen = () => {
				setIsServerConnected(true); // Server is connected
				ws.send(JSON.stringify({ type: "join", payload: { roomId } }));
			};

			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);

				if (data.type === "history") {
					setMessages(data.payload.messages);
				} else if (data.type === "chat") {
					setMessages((prev) => [...prev, data.payload.message]);
				}
			};

			ws.onerror = () => {
				setIsServerConnected(false); // Server connection failed
				alert(
					"⚠️ Server not running! Please start the server on localhost:8080."
				);
			};

			ws.onclose = () => {
				setIsServerConnected(false); // Connection closed
			};

			wsRef.current = ws;

			return () => ws.close();
		}
	}, [roomId]);

	const sendMessage = () => {
		if (!isServerConnected) {
			alert(
				"❗Server is not connected. Please run the server on localhost:8080."
			);
			return;
		}

		if (
			input.trim() &&
			wsRef.current &&
			wsRef.current.readyState === WebSocket.OPEN
		) {
			wsRef.current.send(
				JSON.stringify({ type: "chat", payload: { message: input } })
			);
			setInput("");
		} else if (wsRef.current && wsRef.current.readyState !== WebSocket.OPEN) {
			alert("❗Unable to send message. Server connection lost.");
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
		alert("✅ Room ID copied to clipboard!");
	};

	return (
		<>
			<a
				href="https://github.com/Vinay-Basargekar/web-chat" 
				target="_blank"
				rel="noopener noreferrer"
				className="absolute top-4 right-4 text-black hover:text-gray-600 text-2xl"
			>
				<FontAwesomeIcon icon={faGithub} />
			</a>
			<div className="min-h-screen flex items-center justify-center bg-background p-4">
				{!roomId ? (
					<div className="w-full max-w-md border border-gray-300 rounded-xl shadow-sm p-4">
						<header className="font-bold pb-4 pt-2">
							<h1 className="text-2xl flex justify-baseline">Chat Room</h1>
						</header>
						<div className="pb-4">
							<button
								onClick={createRoom}
								className="w-full bg-black text-white px-4 py-2 rounded-md cursor-pointer"
							>
								Create a New Room
							</button>
						</div>
						<div className="flex items-center w-full justify-between pb-4">
							<input
								type="text"
								placeholder="Enter Room ID"
								value={newRoomId}
								onChange={(e) => setNewRoomId(e.target.value)}
								className="p-2 border border-gray-300 rounded-lg text-gray-700 flex-1 outline-none"
							/>
							<button
								onClick={() => setRoomId(newRoomId)}
								className="bg-gray-100 text-black py-2 px-4 rounded-lg ml-2 cursor-pointer"
							>
								Join Room
							</button>
						</div>
					</div>
				) : (
					<div className="flex-1 flex flex-col w-full border border-gray-300 rounded-xl shadow-md max-w-2xl p-4 bg-white min-h-[90vh]">
						{/* Header with Room ID */}
						<div className="flex justify-between items-center mb-2">
							<p>Room ID: {roomId}</p>
							<button
								onClick={copyRoomId}
								className="bg-black text-white px-4 py-2 rounded-md cursor-pointer"
							>
								Copy Room ID
							</button>
						</div>

						{/* Chat Messages */}
						<div className="flex-1 overflow-y-auto space-y-2 p-2 border border-gray-300 rounded-lg">
							{messages.map((msg, idx) => (
								<div
									key={idx}
									className="p-2 rounded-lg max-w-xs bg-gray-100 text-black self-start"
								>
									{msg}
								</div>
							))}
						</div>

						{/* Message Input */}
						<div className="flex mt-2">
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && sendMessage()}
								placeholder="Type a message..."
								className="flex-1 p-2 rounded-lg border border-gray-300 bg-white text-gray-800 outline-none"
							/>
							<button
								onClick={sendMessage}
								className="bg-black text-white py-2 px-4 rounded-lg ml-2 cursor-pointer"
							>
								Send
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default App;
