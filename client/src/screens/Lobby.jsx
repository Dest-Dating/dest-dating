import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");

  const socket = useSocket(); // Get the socket object from context
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || !room) {
        setError("Please fill in all fields.");
        return;
      }
      // Emit an event to join a room with email and room data
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  // Function to handle joining a room
  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      // Navigate to the specified room
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  // Effect to listen for room join event
  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    // Cleanup
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Lobby
        </h1>
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="sr-only">
              Email ID
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="room" className="sr-only">
              Room Number
            </label>
            <input
              id="room"
              name="room"
              type="text"
              autoComplete="room"
              required
              placeholder="Room Number"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-black hover:bg-gray-800 text-white font-bold rounded-md transition duration-300 ease-in-out"
          >
            Join
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LobbyScreen;
