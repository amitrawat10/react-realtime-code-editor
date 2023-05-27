import React, { useEffect, useState } from "react";

const Avatar = ({ name }) => {
  const [avatarName, setAvatarName] = useState(null);
  const [bgColor, setBgColor] = useState();
  useEffect(() => {
    let word = "";
    const wordLength = name.split(" ");
    for (let i = 0; i < wordLength.length; i++) {
      word += wordLength[i][0].toUpperCase();
    }
    colorGenerator();
    setAvatarName(word);
  }, []);

  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const colorGenerator = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    const color = `rgb(${red},${green},${blue})`;

    setBgColor(color);
  };
  return (
    <div className="avatar-container" style={{ backgroundColor: bgColor }}>
      {avatarName}
    </div>
  );
};

export default Avatar;
