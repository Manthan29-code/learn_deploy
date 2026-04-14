import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.currentToken = null;
  }

  getBaseSocketUrl() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return apiBaseUrl.replace(/\/api\/?$/, "");
  }

  connect(token) {
    const nextToken = token || null;

    // Reuse the same socket when auth context has not changed.
    if (this.socket && this.currentToken === nextToken) {
      return this.socket;
    }

    this.disconnect();

    this.socket = io(this.getBaseSocketUrl(), {
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: nextToken ? { token: nextToken } : {},
    });

    this.currentToken = nextToken;
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentToken = null;
    }
  }
}

const socketService = new SocketService();

export default socketService;
