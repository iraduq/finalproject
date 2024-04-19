import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import Background from "../constants/background/background.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "../styles/play.css";
import { Chess } from "chess.js";
import useWebSocket from "react-use-websocket";

const OnlineGame = () => {
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
      </div>
    </div>
  );
};

export default OnlineGame;
