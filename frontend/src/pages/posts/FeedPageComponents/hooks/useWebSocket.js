import { useEffect, useRef, useState } from "react";

const useWebSocket = (user, handlers) => {
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const connectWebSocket = () => {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setWsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (token) {
          wsRef.current.send(JSON.stringify({ type: 'AUTH', token }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          switch (message.type) {
            case 'NEW_POST':
              handlers.onNewPost?.(message.data);
              break;
            case 'POST_UPDATED':
              handlers.onPostUpdated?.(message.data);
              break;
            case 'POST_DELETED':
              handlers.onPostDeleted?.(message.data.postId);
              break;
            case 'POST_LIKED':
              handlers.onPostLiked?.(message.data);
              break;
            case 'NEW_COMMENT':
              handlers.onNewComment?.(message.data);
              break;
            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      };

      wsRef.current.onclose = () => {
        setWsConnected(false);
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, 5000);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [user]);

  return { wsConnected };
};

export default useWebSocket;