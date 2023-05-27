import React from "react";
import Avatar from "./Avatar";
const Client = ({ username }) => {
  return (
    <div className="client">
      <Avatar name={username} />
      <span className="username">{username}</span>
    </div>
  );
};

export default Client;
