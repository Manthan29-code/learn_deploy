import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = ({ token, enabled = false }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled || !token) {
      return undefined;
    }

    const baseURL = import.meta.env.VITE_API_BASE_URL || "";
    const socketURL = baseURL.replace(/\/api\/?$/, "");

    socketRef.current = io(socketURL, {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [enabled, token]);

  return socketRef;
};

export default useSocket;
