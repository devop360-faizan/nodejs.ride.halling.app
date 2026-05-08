const io = require('socket.io-client');

// Apna token yahan daalo
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBmZDI1YzdiLTJlMjAtNDkwOC05Zjg1LTMzYWYyNjJhMDllYiIsInJvbGUiOiJEUklWRVIiLCJpYXQiOjE3NzgyMzY0MTksImV4cCI6MTc3ODI1MDgxOX0.WdcHLfStcc_IUUkABrR519V55PT2Y34QlMdV5GO1Xs8";
const ROOM_ID = "a9dd5556-cdfd-43b6-884d-f9bd8fef6103";

const socket = io("http://localhost:3000", {
  query: { token: TOKEN }
});

socket.on("connect", () => {
  console.log("✅ Server se connected! Socket ID:", socket.id);
  console.log("\n📝 Aab join_room event bhejta hoon...\n");
  
  // Room join karo
  socket.emit("join_room", ROOM_ID);
});

socket.on("joined", (msg) => {
  console.log("🎉 Joined event mila:", msg);
  console.log("\n💬 Aab message bhejta hoon...\n");
  
  // Message bhejo
  setTimeout(() => {
    socket.emit("send_message", {
      roomId: ROOM_ID,
      content: "Yeh test message hai Socket.io se! 🚀"
    });
  }, 1000);
});

socket.on("new_message", (msg) => {
  console.log("📬 Naya message mila!");
  console.log("   From:", msg.user.name);
  console.log("   Message:", msg.content);
});

socket.on("error", (err) => {
  console.error("❌ Error:", err);
});

socket.on("disconnect", () => {
  console.log("🔌 Server se disconnect ho gaye");
});

// 5 seconds baad disconnect karo
setTimeout(() => {
  console.log("\n👋 Disconnect kar rahe ho...\n");
  socket.disconnect();
}, 5000);
