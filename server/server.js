const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Gear Defenders Server Running');
});

const wss = new WebSocket.Server({ server });

const rooms = new Map();

function genCode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 3; i++) s += c[Math.floor(Math.random() * c.length)];
  s += '-';
  for (let i = 0; i < 3; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

function createRoom(hostWs) {
  let code;
  do { code = genCode(); } while (rooms.has(code));

  const room = { host: hostWs, guest: null, code };
  rooms.set(code, room);
  hostWs._roomId = code;
  hostWs._role = 'host';

  hostWs.send(JSON.stringify({ type: 'roomCreated', code }));
  console.log(`Room created: ${code}`);
  return room;
}

function joinRoom(code, guestWs) {
  const room = rooms.get(code);
  if (!room) {
    guestWs.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
    return null;
  }
  if (room.guest) {
    guestWs.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
    return null;
  }

  room.guest = guestWs;
  guestWs._roomId = code;
  guestWs._role = 'guest';

  guestWs.send(JSON.stringify({ type: 'roomJoined', code }));
  room.host.send(JSON.stringify({ type: 'guestConnected' }));
  console.log(`Guest joined room: ${code}`);
  return room;
}

function sendToRoom(code, sender, msg) {
  const room = rooms.get(code);
  if (!room) return;

  const data = JSON.stringify(msg);
  if (sender === room.host && room.guest) {
    room.guest.send(data);
  } else if (sender === room.guest && room.host) {
    room.host.send(data);
  }
}

function closeRoom(code) {
  const room = rooms.get(code);
  if (room) {
    if (room.host && room.host.readyState === WebSocket.OPEN) {
      room.host.send(JSON.stringify({ type: 'opponentDisconnected' }));
    }
    if (room.guest && room.guest.readyState === WebSocket.OPEN) {
      room.guest.send(JSON.stringify({ type: 'opponentDisconnected' }));
    }
    rooms.delete(code);
    console.log(`Room closed: ${code}`);
  }
}

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }

    if (msg.type === 'createRoom') {
      createRoom(ws);
      return;
    }

    if (msg.type === 'joinRoom') {
      const code = (msg.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length < 6) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid room code' }));
        return;
      }
      joinRoom(code, ws);
      return;
    }

    const code = ws._roomId;
    if (!code) return;

    if (msg.type === 'disconnect') {
      closeRoom(code);
      return;
    }

    sendToRoom(code, ws, msg);
  });

  ws.on('close', () => {
    const code = ws._roomId;
    if (code) {
      closeRoom(code);
    }
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Gear Defenders server running on port ${PORT}`);
});
