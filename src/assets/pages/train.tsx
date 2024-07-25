import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Background from "../constants/background/background.js";
import { Move } from "chess.js";
import "../styles/train.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flip } from "react-toastify";
import { List } from "antd";
import wrongSound from "../constants/sounds/wrong.mp3";
import NotificationSound from "../constants/sounds/notification.mp3";

import {
  faChessPawn,
  faChessRook,
  faChessKnight,
  faChessBishop,
  faChessQueen,
  faChessKing,
  faChartBar,
  faCheck,
  faTimes,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert";

const stockfish = new Worker("./node_modules/stockfish.js/stockfish.js");

const pieceIcons = {
  p: faChessPawn,
  r: faChessRook,
  n: faChessKnight,
  b: faChessBishop,
  q: faChessQueen,
  k: faChessKing,
};

function ChessComponent() {
  const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const [game, setGame] = useState(new Chess(initialFen));
  const [lastMove, setLastMove] = useState<React.ReactElement | null>(null);

  if (lastMove) {
    null;
  }

  const playIllegalMoveSound = () => {
    const illegalMoveSound = new Audio(wrongSound);
    illegalMoveSound.play().catch((error) => {
      console.error("Error playing illegal move sound:", error);
    });
  };
  const playWinSound = () => {
    const playWinSound = new Audio(
      "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/illegal.mp3"
    );
    playWinSound.play().catch((error) => {
      console.error("Error playing illegal move sound:", error);
    });
  };
  useEffect(() => {
    playGameStartSound();
  }, []);

  useEffect(() => {
    if (game.isGameOver()) {
      playGameEndSound();
    } else if (game.turn() === "b" && !game.isGameOver()) {
      makeStockfishMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        playGameEndSound();
        if (game.turn() == "w") {
          Swal({
            title: "Checkmate!",
            text: "You lost the game!",
            icon: "error",
          });
        } else {
          Swal({
            title: "Checkmate!",
            text: "You won the game!",
            icon: "succes",
          });
        }
      } else if (game.isDraw()) {
        playGameEndSound();
        Swal({
          title: "Draw!",
          text: "The game is over.",
          icon: "info",
        });
      } else if (game.isStalemate()) {
        playGameEndSound();
        Swal({
          title: "Stalemate!",
          text: "The game is over.",
          icon: "info",
        });
      } else if (game.isThreefoldRepetition()) {
        playGameEndSound();
        Swal({
          title: "Threefold repetition!",
          text: "The game is over.",
          icon: "info",
        });
      } else if (game.isInsufficientMaterial()) {
        playGameEndSound();
        Swal({
          title: "Insufficient material!",
          text: "The game is over.",
          icon: "info",
        });
      } else {
        playWinSound();
        Swal({
          title: "Congratulations!",
          text: "You won the game!",
          icon: "success",
        });
      }
    }
  }, [game]);

  function makeStockfishMove() {
    stockfish.postMessage("position fen " + game.fen());
    stockfish.postMessage("go depth 1");
  }

  stockfish.onmessage = async function (event) {
    const response = event.data;
    if (response.startsWith("bestmove")) {
      const move = response.split(" ")[1];

      await delay(() => {
        const moveResult = game.move(move);
        if (moveResult) {
          setGame(new Chess(game.fen()));
          updateMoveHistory(moveResult);
          const isCapture = moveResult.captured !== undefined;
          if (isCapture) {
            const captureSound = new Audio(
              "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3"
            );
            captureSound.play();
          } else {
            const moveSound = new Audio(
              "http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-opponent.mp3"
            );
            moveSound.play();
          }
        }
      }, 1000);
    }
  };

  function delay(fn: () => void, duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        fn();
        resolve();
      }, duration);
    });
  }

  const handleMove = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ): boolean => {
    if (game.turn() !== "w") {
      return false;
    }

    const initialGame = new Chess(game.fen());
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece.slice(-1).toLowerCase(),
      });

      if (move) {
        setGame(new Chess(game.fen()));
        updateMoveHistory(move);
        if (move.flags.includes("c")) {
          const captureSound = new Audio(
            "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3"
          );
          captureSound.play();
        } else {
          const moveSound = new Audio(
            "http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3"
          );
          moveSound.play();
        }
        return true;
      } else {
        setGame(initialGame);
        return false;
      }
    } catch (error) {
      toast.dismiss();
      playIllegalMoveSound();
      toast.error("Illegal move!", {
        transition: Flip,
        autoClose: 200,
      });
      return false;
    }
  };

  const updateMoveHistory = (move: Move | null) => {
    if (!move) return;

    const pieceColor = game.turn() === "w" ? "black" : "white";
    const notation = (
      <div>
        <p>Last move</p>
        <p>
          <FontAwesomeIcon icon={pieceIcons[move.piece]} color={pieceColor} />{" "}
          from {move.from} to {move.to}
        </p>
      </div>
    );

    setLastMove(notation);
  };

  const playGameStartSound = () => {
    const gameStartSound = new Audio(
      "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-start.mp3"
    );
    gameStartSound.play().catch((error) => {
      console.error("Error playing game start sound:", error);
    });
  };

  useEffect(() => {
    playGameStartSound();
  }, []);

  const playGameEndSound = () => {
    const delay = 500;
    setTimeout(() => {
      const gameEndSound = new Audio(NotificationSound);
      gameEndSound.volume = 0.1;
      gameEndSound.play().catch((error) => {
        console.error("Error playing game end sound:", error);
      });
    }, delay);
  };

  const handlePieceDragBegin = (sourceSquare: string, piece: string) => {
    console.log(`Started dragging piece ${piece} from square ${sourceSquare}`);

    const allMoves = game.moves({ verbose: true });

    const pieceMoves = allMoves.filter((move) => move.from === piece);

    if (pieceMoves.length > 0) {
      console.log("Legal moves for the picked up piece:");
      pieceMoves.forEach((move, index) => {
        console.log(`Move ${index + 1}:`);
        console.log(`From: ${move.from}`);
        console.log(`To: ${move.to}`);
        console.log(`Piece: ${move.piece}`);
        console.log(`Flags: ${move.flags}`);
        console.log(`San: ${move.san}`);

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
    <div className="chess-wrapper">
      <Background />
      <ToastContainer></ToastContainer>
      <div className="header-online">
        <Link to="/main">
          <FontAwesomeIcon icon={faHouse} />
          <span className="icon-spacing">HOME</span>
        </Link>
      </div>
      <div className="chess-container">
        <div className="chessboard-container">
          <div className="chessboard-wrapper">
            <Chessboard
              position={game.fen()}
              onPieceDrop={handleMove}
              onPieceDragBegin={handlePieceDragBegin}
              areArrowsAllowed={true}
              clearPremovesOnRightClick={true}
              promotionDialogVariant={"vertical"}
              customDarkSquareStyle={{ backgroundColor: "#4F4F4F" }}
              customLightSquareStyle={{ backgroundColor: "#222" }}
            />
          </div>
        </div>
        <div className="left-content">
          <List
            rootClassName="train-header"
            header={
              <h2 className="list-header">
                <FontAwesomeIcon icon={faChartBar} className="header-icon" />{" "}
                Game Information
              </h2>
            }
            bordered
            className="custom-list"
            dataSource={[
              {
                title: "Current Turn",
                icon: game.turn() === "w" ? faChessPawn : faChessPawn,
                color: game.turn() === "w" ? "#000000" : "#ffffff",
                text: game.turn() === "w" ? "White" : "Black",
              },
              {
                title: "Check",
                icon: game.isCheck() ? faCheck : faTimes,
                color: game.isCheck() ? "#52c41a" : "#f5222d",
                text: game.isCheck() ? "Check!" : "No Check",
              },
              {
                title: "CheckMate",
                icon: game.isCheckmate() ? faCheck : faTimes,
                color: game.isCheckmate() ? "#fa8c16" : "#f5222d",
                text: game.isCheckmate() ? "Checkmate!" : "No Checkmate",
              },
              {
                title: "Draw",
                icon: game.isDraw() ? faCheck : faTimes,
                color: game.isDraw() ? "#fa8c16" : "#f5222d",
                text: game.isDraw() ? "Draw!" : "No Draw",
              },
              {
                title: "Game Over",
                icon: game.isGameOver() ? faCheck : faTimes,
                color: game.isGameOver() ? "#fa8c16" : "#f5222d",
                text: game.isGameOver() ? "Game Over!" : "Not Over",
              },
            ]}
            renderItem={(item) => (
              <List.Item className="custom-list-item">
                <List.Item.Meta
                  avatar={
                    <FontAwesomeIcon
                      icon={item.icon}
                      color={item.color}
                      className="item-icon"
                    />
                  }
                  title={
                    <span className="custom-list-item-title">{item.title}</span>
                  }
                  description={
                    <span className="custom-list-item-text">{item.text}</span>
                  }
                />
              </List.Item>
            )}
            style={{
              backgroundColor: "#222",
              margin: "auto",
              maxWidth: "fit-content",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChessComponent;
