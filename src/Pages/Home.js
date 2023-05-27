import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error("Please enter roomId and username");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };
  const genRoomId = (e) => {
    e.preventDefault();
    setRoomId(uuidV4());
  };
  return (
    <div className="home-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h4 className="form-heading">OCE</h4>
        <div className="input-group">
          <input
            type="text"
            className="input input-room"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          <input
            type="text"
            className="input input-username"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <button className="btn btn-join">Join</button>
        <div className="join-info">
          If you don't have an invite then create &nbsp;
          <a href="javascript:void(0)" onClick={genRoomId}>
            new room
          </a>
        </div>
      </form>
    </div>
  );
};

export default Home;
