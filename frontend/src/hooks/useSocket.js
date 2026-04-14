import { useEffect, useRef } from "react";
import socketService from "../services/socketService";

const useSocket = ({ token, enabled = false }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!enabled || !token) {
      socketService.disconnect();
      socketRef.current = null;
      return undefined;
    }

    socketRef.current = socketService.connect(token);

    return () => {
      socketService.disconnect();
      socketRef.current = null;
    };
  }, [enabled, token]);

  return socketRef;
};

export default useSocket;
