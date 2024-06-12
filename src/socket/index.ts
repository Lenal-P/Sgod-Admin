import { io } from "socket.io-client";

export const socket = io("https://e-learming-be.onrender.com", {
    path: "/socket.io",
    transports: ["websocket"],
    autoConnect: false,
    reconnection: false,
});