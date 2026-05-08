const io = require('socket.io-client');

describe('Socket.io Complete Tests', () => {
  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBmZDI1YzdiLTJlMjAtNDkwOC05Zjg1LTMzYWYyNjJhMDllYiIsInJvbGUiOiJEUklWRVIiLCJpYXQiOjE3NzgyMzY0MTksImV4cCI6MTc3ODI1MDgxOX0.WdcHLfStcc_IUUkABrR519V55PT2Y34QlMdV5GO1Xs8";
  const ROOM_ID = "a9dd5556-cdfd-43b6-884d-f9bd8fef6103";

  // TEST 1: Valid token se connect
  test('Should connect with valid token', (done) => {
    const socket = io("http://localhost:3000", {
      query: { token: TOKEN },
      reconnection: false
    });

    socket.on("connect", () => {
      expect(socket.connected).toBe(true);
      socket.disconnect();
      done();
    });

    socket.on("connect_error", (err) => {
      socket.disconnect();
      done(err);
    });
  });

  // TEST 2: Invalid token se fail
  test('Should fail with invalid token', (done) => {
    const socket = io("http://localhost:3000", {
      query: { token: "invalid-token" },
      reconnection: false
    });

    socket.on("connect", () => {
      socket.disconnect();
      done(new Error("Should not connect with invalid token"));
    });

    socket.on("connect_error", (err) => {
      expect(err.message).toContain("Token");
      socket.disconnect();
      done();
    });
  });

  // TEST 3: Token nahi hone par fail
  test('Should fail without token', (done) => {
    const socket = io("http://localhost:3000", {
      reconnection: false
    });

    socket.on("connect", () => {
      socket.disconnect();
      done(new Error("Should not connect without token"));
    });

    socket.on("connect_error", (err) => {
      expect(err.message).toContain("Token");
      socket.disconnect();
      done();
    });
  });

  // TEST 4: Room join
  test('Should join room successfully', (done) => {
    const socket = io("http://localhost:3000", {
      query: { token: TOKEN },
      reconnection: false
    });

    socket.on("connect", () => {
      socket.emit("join_room", ROOM_ID);
    });

    socket.on("joined", (msg) => {
      expect(msg).toContain("aa gaye");
      socket.disconnect();
      done();
    });

    socket.on("error", (err) => {
      socket.disconnect();
      done(err);
    });

    socket.on("connect_error", (err) => {
      socket.disconnect();
      done(err);
    });
  });

  // TEST 5: Message send
  test('Should send message to room', (done) => {
    const socket = io("http://localhost:3000", {
      query: { token: TOKEN },
      reconnection: false
    });

    socket.on("connect", () => {
      socket.emit("join_room", ROOM_ID);
    });

    socket.on("joined", () => {
      socket.emit("send_message", {
        roomId: ROOM_ID,
        content: "Test message"
      });
    });

    socket.on("new_message", (msg) => {
      expect(msg.content).toBe("Test message");
      socket.disconnect();
      done();
    });

    socket.on("error", (err) => {
      socket.disconnect();
      done(err);
    });

    socket.on("connect_error", (err) => {
      socket.disconnect();
      done(err);
    });
  });

  // TEST 6: Room leave
  test('Should leave room successfully', (done) => {
    const socket = io("http://localhost:3000", {
      query: { token: TOKEN },
      reconnection: false
    });

    socket.on("connect", () => {
      socket.emit("join_room", ROOM_ID);
    });

    socket.on("joined", () => {
      socket.emit("leave_room", ROOM_ID);
    });

    socket.on("left", (msg) => {
      expect(msg).toContain("nikal gaye");
      socket.disconnect();
      done();
    });

    socket.on("error", (err) => {
      socket.disconnect();
      done(err);
    });

    socket.on("connect_error", (err) => {
      socket.disconnect();
      done(err);
    });
  });
});

