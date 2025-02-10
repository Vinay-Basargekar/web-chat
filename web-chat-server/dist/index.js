"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
// Creating a web Socket server
const wss = new ws_1.WebSocketServer({ port: 8080 });
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
const rooms = {};
// Handle new WebSocket connections
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        // Join a Room
        if (parsedMessage.type === "join") {
            const roomId = parsedMessage.payload.roomId;
            if (!rooms[roomId]) {
                rooms[roomId] = { roomId, messages: [], users: [] };
            }
            rooms[roomId].users.push({ socket, room: roomId });
            // Send previous messages to the user
            socket.send(JSON.stringify({
                type: "history",
                payload: { messages: rooms[roomId].messages },
            }));
        }
        // Send a Chat Message
        if (parsedMessage.type === "chat") {
            const currentUserRoom = Object.values(rooms).find((room) => room.users.some((user) => user.socket === socket));
            if (currentUserRoom) {
                // Store the message
                currentUserRoom.messages.push(parsedMessage.payload.message);
                // Broadcast to all users in the room
                currentUserRoom.users.forEach((user) => {
                    user.socket.send(JSON.stringify({
                        type: "chat",
                        payload: { message: parsedMessage.payload.message },
                    }));
                });
            }
        }
    });
    // Handle disconnection
    socket.on("close", () => {
        for (const roomId in rooms) {
            rooms[roomId].users = rooms[roomId].users.filter((user) => user.socket !== socket);
        }
    });
});
