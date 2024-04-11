import { Chessboard } from "react-chessboard";
import Background from "../constants/background/background.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Clock from "../constants/timer/timer.tsx";
import "../styles/play.css";

const OnlineGame = () => {
  return (
    <div className="container-online">
      <Background />
      <div className="wrapper-online">
        <div className="left-area-online">
          <div className="header-online">
            <Link to="/main">
              <FontAwesomeIcon icon={faHouse} />
              <span className="icon-spacing">HOME</span>
            </Link>
          </div>
          <div className="chessboard-container-online">
            <Chessboard id="online-game" position="start" />
          </div>
        </div>
        <div className="right-area-online">
          <div className="right-section">
            <p>Your Timer</p>
            <Clock />
          </div>
          <div className="right-section">
            <div className="icon-with-text">
              <p>Offer Draw</p>
            </div>
            <div className="icon-with-text">
              <p>Resign</p>
            </div>
          </div>
          <div className="right-section">
            <p>Opponent's Timer</p>
            <Clock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineGame;
