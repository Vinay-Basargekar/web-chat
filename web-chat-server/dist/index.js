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
let allSocket = [];
// Making basic connection from client
wss.on("connection", (socket) => {
    // allSocket.push(socket);
    // This line help to get message from client(user)
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type == "join") {
            allSocket.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type == "chat") {
            // const currentUserRoom = allSocket.find((x) => x.socket == socket)?.room;
            let currentUserRoom = null;
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].socket == socket) {
                    currentUserRoom = allSocket[i].room;
                }
            }
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].room == currentUserRoom) {
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
