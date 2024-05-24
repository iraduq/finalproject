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
import Swal from "sweetalert";

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

  const handleMove = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ) => {
    if (game.turn() !== playerColor[0]) {
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece.slice(-1).toLowerCase(),
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
        console.log(receivedData.white_player_jwt);
        console.log(receivedData.black_player_jwt);
        if (receivedData.white_player_jwt && receivedData.black_player_jwt) {
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

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isDraw()) {
        Swal({
          title: "Draw!",
          text: "The Game is Over",
          icon: "info",
        });
      }
      if (game.isStalemate()) {
        Swal({
          title: "Draw!",
          text: "The Game is Over",
          icon: "info",
        });
      }
      if (game.isThreefoldRepetition()) {
        Swal({
          title: "Draw!",
          text: "The Game is Over",
          icon: "info",
        });
      }
      if (game.isInsufficientMaterial()) {
        Swal({
          title: "Draw!",
          text: "The Game is Over",
          icon: "info",
        });
      }

      if (game.isCheckmate()) {
        if (game.turn() === "w") {
          if (playerColor === game.turn()) {
            Swal({
              title: "Checkmate!",
              text: "You lost the game!",
              icon: "error",
            });
          } else {
            Swal({
              title: "Checkmate!",
              text: "You won the game!",
              icon: "error",
            });
          }
        }
      }
    }
  }, [game, playerColor]);

  const handlePieceDragBegin = (sourceSquare: string, piece: string) => {
    console.log(`Started dragging piece ${piece} from square ${sourceSquare}`);

    const allMoves = game.moves({ verbose: true });

    const pieceMoves = allMoves.filter((move) => move.from === piece);

    if (pieceMoves.length > 0) {
      console.log("Legal moves for the picked up piece:");
      pieceMoves.forEach((move, index) => {
        console.log(`Move ${index + 1}:`);

        const targetSquareElement = document.querySelector<HTMLElement>(
          `[data-square="${move.to}"]`
        );

        if (targetSquareElement) {
          const originalFilter = targetSquareElement.style.filter;
          targetSquareElement.style.filter = "brightness(100%)";

          const greyDot = document.createElement("span");
          greyDot.className = "grey-dot";
          targetSquareElement.appendChild(greyDot);

          const handleDragEnd = () => {
            targetSquareElement.style.filter = originalFilter;
            targetSquareElement.removeChild(greyDot);
            document.removeEventListener("dragend", handleDragEnd);
          };
          document.addEventListener("dragend", handleDragEnd);
        } else {
          console.warn("Target square element not found");
        }
      });
    } else {
      console.log("No legal moves available for the picked up piece.");
    }
  };

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
              onPieceDrop={(
                sourceSquare: string,
                targetSquare: string,
                piece: string
              ) => handleMove(sourceSquare, targetSquare, piece)}
              boardOrientation={boardOrientation || undefined}
              onPieceDragBegin={handlePieceDragBegin}
              promotionDialogVariant={"vertical"}
            />

            {isProcessingMove && (
              <div className="loading-indicator">Processing...</div>
            )}
          </div>
        </div>
        <div className="right-area-online">
          <div className="game-info-container"></div>
        </div>
      </div>
    </div>
  );
};

export default OnlineGame;
