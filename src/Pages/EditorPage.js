import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Client from "../Components/Client";
import Editor from "..//Components/Editor";
import { initSocket } from "../socket";
import SOCKET_EVENTS from "../socketActions";
import { toast } from "react-hot-toast";
const EditorPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const socket = useRef(null);
  const codeRef = useRef(null);
  const handleErrors = (e) => {
    console.log("Socket Error ", e);
    toast.error("Socket connection failed, try again later.");
  };

  useEffect(() => {
    const init = async () => {
      if (!roomId || !location.state.username) navigate("/");

      socket.current = await initSocket();
      socket.current.on("connect_error", (err) => handleErrors(err));
      socket.current.on("connect_failed", (err) => handleErrors(err));
      socket.current.emit(SOCKET_EVENTS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socket.current.on(
        SOCKET_EVENTS.JOINED,
        ({ username, clients, socketId }) => {
          if (username !== location?.state.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socket.current.emit(SOCKET_EVENTS.SYNC_CODE, {
            code: codeRef.current,
            socketId: socketId,
          });
        }
      );

      socket.current.on(
        SOCKET_EVENTS.DISCONNECTED,
        ({ socketId, username }) => {
          toast.success(`${username} left the room`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        }
      );
    };
    init();
    return () => {
      socket.current.off(SOCKET_EVENTS.JOINED);
      socket.current.off(SOCKET_EVENTS.DISCONNECTED);
      socket.current.disconnect();
    };
  }, []);

  const leaveRoom = () => {
    navigate("/");
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (e) {
      toast.error("Could not copy the Room ID");
      console.error(e);
    }
  };
  return (
    <main className="editor-container">
      <aside className="editor-sidebar">
        <h3>Sidebar</h3>
        <h3>Connected</h3>
        <div className="client-list">
          {clients.length > 0 &&
            clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
        </div>
        <div className="editor-sidebar-footer">
          <button className="btn btn-copy-room" onClick={copyRoomId}>
            Copy Room Id
          </button>
          <button className="btn btn-leave" onClick={leaveRoom}>
            Leave
          </button>
        </div>
      </aside>
      <div className="editor-text">
        <Editor
          roomId={roomId}
          socket={socket}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </main>
  );
};

export default EditorPage;
