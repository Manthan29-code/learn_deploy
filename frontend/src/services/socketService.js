import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.currentToken = null;
    this.disconnectTimer = null;
  }

  clearPendingDisconnect() {
    if (this.disconnectTimer) {
      clearTimeout(this.disconnectTimer);
      this.disconnectTimer = null;
    }
  }

  teardown() {
    this.clearPendingDisconnect();

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentToken = null;
    }
  }

  getBaseSocketUrl() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return apiBaseUrl.replace(/\/api\/?$/, "");
  }

  connect(token) {
    const nextToken = token || null;
    this.clearPendingDisconnect();

    // Reuse the same socket when auth context has not changed.
    if (this.socket && this.currentToken === nextToken) {
      return this.socket;
    }

    this.teardown();

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
    // Delay disconnect briefly to avoid Strict Mode double-mount races in dev.
    this.clearPendingDisconnect();
    this.disconnectTimer = setTimeout(() => {
      this.teardown();
    }, 200);
  }
}

const socketService = new SocketService();

export default socketService;
