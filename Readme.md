# 📱 Minimal Chat Application

A real-time minimal chat application built with **React** for the frontend and **Node.js with WebSockets** for the backend. This application allows users to create chat rooms, join existing rooms using a Room ID, and exchange messages in real-time.

##  Features

- Create and join chat rooms with unique Room IDs
- Real-time messaging powered by WebSockets
- Persistent message history within active sessions
- Copy Room ID for easy sharing
- Responsive design using Tailwind CSS

---

##  Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, WebSocket (ws library)
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Vinay-Basargekar/web-chat.git
cd web-chat
```

### 2️⃣ Install Dependencies

**Frontend:**
```bash
cd web-chat-frontend
npm install
```

**Backend:**
```bash
cd web-chat-server
npm install
```

### 3️⃣ Run the Application

**Start the WebSocket Server:**
```bash
cd web-chat-server
npm run dev
```

**Start the React Frontend:**
```bash
cd web-chat-frontend
npm run dev
```

The application will be running at `http://localhost:5173` and WebSocket server at `ws://localhost:8080`.

---

##  API Schema

### 🔗 Join a Room
```json
{
  "type": "join",
  "payload": {
    "roomId": "12345"
  }
}
```

### 💬 Send a Message
```json
{
  "type": "chat",
  "payload": {
    "message": "Hello, everyone!"
  }
}
```

---

## 🗃️ Folder Structure

```
minimal-chat-app/
├── client/               # React frontend
│   ├── src/
│   └── package.json
└── server/               # Node.js WebSocket server
    ├── index.js
    └── package.json
```

---

##  Future Improvements

- User authentication for secure rooms
- Support for private messaging
- Persistent message storage with a database
- Typing indicators and online status

