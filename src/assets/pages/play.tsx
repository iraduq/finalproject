import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import Background from "../constants/background/background.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "../styles/play.css";
import { Chess } from "chess.js";
import useWebSocket from "react-use-websocket";
import gameStartSound from "../constants/sounds/game-start.mp3";
import moveSelf from "../constants/sounds/move-self.mp3";

import {
  faChessPawn,
  faChessKing,
  faExclamationCircle,
  faSkullCrossbones,
  faHandshake,
  faTrophy,
  faCheck,
  faTimes,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

const OnlineGame = () => {
  useEffect(() => {
    const audio = new Audio(gameStartSound);
    audio.volume = 1;
    audio.play();
  }, []);

  const playMoveSelfSound = () => {
    const audio = new Audio(moveSelf);
    audio.volume = 1;
    audio.play();
  };

  const [game, setGame] = useState(new Chess());
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<
    "white" | "black" | ""
  >("");
  const [jwtReceived, setJwtReceived] = useState(false);
  const [playerColor, setPlayerColor] = useState("");

  const handleMove = (sourceSquare: string, targetSquare: string) => {
    if (game.turn() !== playerColor[0]) {
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move) {
      setIsProcessingMove(true);
      setGame(new Chess(game.fen()));
      const updatedFen = game.fen();
      sendMessage(
        JSON.stringify({
          action: "player_move",
          move: {
            sourceSquare,
            targetSquare,
          },
          fen: updatedFen,
        })
      );
      setIsProcessingMove(false);
      return true;
    }

    setGame(new Chess(game.fen()));
    return false;
  };

  const { lastMessage, sendMessage } = useWebSocket(
    `ws://172.16.1.39:8000/ws/${localStorage.getItem("token")}`,
    {
      onOpen: () => console.log("WebSocket connection established."),
      onError: (error) => console.error("WebSocket error:", error),
      onClose: () => console.log("WebSocket connection closed."),
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (!jwtReceived && lastMessage && typeof lastMessage.data === "string") {
      try {
        const receivedData = JSON.parse(lastMessage.data);
        if (receivedData.white_player_jwt && receivedData.black_player_jwt) {
          console.log("White Player JWT:", receivedData.white_player_jwt);
          console.log("Black Player JWT:", receivedData.black_player_jwt);
          setJwtReceived(true);
          const currentPlayerJwt = localStorage.getItem("token");
          if (receivedData.white_player_jwt === currentPlayerJwt) {
            setBoardOrientation("white");
            setPlayerColor("white");
          } else if (receivedData.black_player_jwt === currentPlayerJwt) {
            setBoardOrientation("black");
            setPlayerColor("black");
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [lastMessage, jwtReceived]);

  useEffect(() => {
    if (
      lastMessage &&
      typeof lastMessage.data === "string" &&
      jwtReceived &&
      playerColor !== ""
    ) {
      try {
        const receivedData = JSON.parse(lastMessage.data);
        if (receivedData.action === "player_move") {
          const updatedFen = receivedData.fen;
          setGame(new Chess(updatedFen));
          playMoveSelfSound();
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [lastMessage, jwtReceived, playerColor]);

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
            <Chessboard
              id="online-game"
              position={game.fen()}
              onPieceDrop={(sourceSquare: string, targetSquare: string) =>
                handleMove(sourceSquare, targetSquare)
              }
              boardOrientation={boardOrientation || undefined}
              allowDrag={({ piece }: { piece: string }) =>
                playerColor ? piece[0] === playerColor[0] : false
              }
            />

            {isProcessingMove && (
              <div className="loading-indicator">Processing...</div>
            )}
          </div>
        </div>
        <div className="right-area-online">
          <div className="game-info-container">
            <FontAwesomeIcon icon={faChartBar} size="2x" />
            <h2>Game Information</h2>
            <ul>
              <li>
                <span>
                  <FontAwesomeIcon icon={faChessKing} /> Current Turn:{" "}
                  {game.turn() === "w" ? (
                    <FontAwesomeIcon icon={faChessPawn} color="white" />
                  ) : (
                    <FontAwesomeIcon icon={faChessPawn} color="black" />
                  )}
                </span>
              </li>
              <li>
                <FontAwesomeIcon icon={faExclamationCircle} /> Check:{" "}
                {game.isCheck() ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </li>
              <li>
                <FontAwesomeIcon icon={faSkullCrossbones} /> Checkmate:{" "}
                {game.isCheckmate() ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </li>
              <li>
                <FontAwesomeIcon icon={faHandshake} /> Draw:{" "}
                {game.isDraw() ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </li>
              <li>
                <FontAwesomeIcon icon={faTrophy} /> Game Over:{" "}
                {game.isGameOver() ? (
                  <FontAwesomeIcon icon={faCheck} />
                ) : (
                  <FontAwesomeIcon icon={faTimes} />
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineGame;
