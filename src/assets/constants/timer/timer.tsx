import { useState, useEffect } from "react";

const Clock = () => {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time;
  };

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div>
      <div id="clock-container">
        <div
          id="clock"
          style={{
            fontSize: "6vh",
            marginBottom: "10px",
            display: "inline-block",
            color: "white",
            padding: "5px 10px",
          }}
        >
          {formatTime(h)}:{formatTime(m)}:{formatTime(s)}
        </div>
      </div>
    </div>
  );
};

export default Clock;
