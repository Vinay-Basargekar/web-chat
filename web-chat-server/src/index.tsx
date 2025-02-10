import { WebSocketServer, WebSocket } from "ws";

// Creating a web Socket server
const wss = new WebSocketServer({ port: 8080 });

interface User {
	socket: WebSocket;
	room: String;
}

// Schema
// Join a room
// {
//     "type":"join",
//     "payload":{
//         "roomId":123
//     }
// }
// Send a messgae
// {
//     "type":"chat",
//     "payload":{
//         "message":hii there
//     }
// }

let allSocket: User[] = [];

// Making basic connection from client
wss.on("connection", (socket) => {
	// allSocket.push(socket);

	// This line help to get message from client(user)
	socket.on("message", (message) => {
        //@ts-ignore
		const parsedMessage = JSON.parse(message.toString());

        console.log(allSocket);

		if (parsedMessage.type == "join") {
			allSocket.push({
				socket,
				room: parsedMessage.payload.roomId,
			});
		}

        if(parsedMessage.type == "chat"){
            // const currentUserRoom = allSocket.find((x) => x.socket == socket)?.room;
            let currentUserRoom = null;
            for(let i=0 ; i<allSocket.length ; i++){
                if(allSocket[i].socket == socket){
                    currentUserRoom = allSocket[i].room;
                }
            }

            for(let i=0 ; i<allSocket.length ; i++){
                if(allSocket[i].room == currentUserRoom){
                    allSocket[i].socket.send(parsedMessage.payload.message);
                }
            }
        }

		// for(let i=0 ; i<allSocket.length ; i++){
		//     const s = allSocket[i];
		//     s.send("Msg from server " + message.toString());
		// }
	});

	// Don't broadcast to the disconnected client
	socket.on("disconnect", () => {
		allSocket = allSocket.filter((x) => x.socket != socket);
	});
});
