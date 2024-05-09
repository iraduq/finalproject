import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Background from "../constants/background/background.js";
import { Move } from "chess.js";
import "../styles/train.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChessPawn,
  faChessRook,
  faChessKnight,
  faChessBishop,
  faChessQueen,
  faChessKing,
  faExclamationCircle,
  faSkullCrossbones,
  faHandshake,
  faTrophy,
  faChartBar,
  faCheck,
  faTimes,
  faShieldAlt,
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

  const playIllegalMoveSound = () => {
    const illegalMoveSound = new Audio(
      "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/illegal.mp3"
    );
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
        Swal({
          title: "Checkmate!",
          text: "You lost the game!",
          icon: "error",
        });
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
      playIllegalMoveSound();
      toast.error("Illegal move!");
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
    const gameEndSound = new Audio(
      "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/game-end.mp3"
    );
    gameEndSound.play().catch((error) => {
      console.error("Error playing game end sound:", error);
    });
  };

  const resetGame = () => {
    setGame(new Chess(initialFen));
    setLastMove(null);
    Swal({
      title: "Game Reset",
      text: "The game has been reset.",
      icon: "info",
    });
  };

  const setStockfishDifficulty = (difficulty: string | number) => {
    stockfish.postMessage("setoption name Skill Level value " + difficulty);
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
      <div className="header-online">
        <Link to="/main">
          <FontAwesomeIcon icon={faHouse} />
          <span className="icon-spacing">HOME</span>
        </Link>
      </div>
      <Background />
      <div className="chess-container">
        <ToastContainer />
        <div className="left-content">
          <ul>
            <li className="icon-below">
              <FontAwesomeIcon icon={faShieldAlt} />
            </li>
            <h2>
              <FontAwesomeIcon icon={faChartBar} /> Game Information
            </h2>
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
                <FontAwesomeIcon icon={faSkullCrossbones} /> CheckMate:{" "}
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
          </ul>
        </div>
        <div className="chessboard-container">
          {lastMove !== null ? (
            <div className="last-move">{lastMove}</div>
          ) : (
            <div className="last-move">
              <p>Last move</p>
              <p>No moves have been made</p>
            </div>
          )}
          <div className="chessboard-wrapper">
            <Chessboard
              position={game.fen()}
              onPieceDrop={handleMove}
              onPieceDragBegin={handlePieceDragBegin}
              arePremovesAllowed={true}
              areArrowsAllowed={true}
              clearPremovesOnRightClick={true}
              promotionDialogVariant={"vertical"}
            />
          </div>
        </div>
        <div className="right-content">
          <div className="reset-button">
            <button onClick={resetGame}>Reset</button>
          </div>
          <div className="difficulty-buttons">
            <button
              className="easy-button"
              onClick={() => setStockfishDifficulty(0)}
            >
              <FontAwesomeIcon icon={faChessPawn} /> Easy
            </button>
            <button
              className="medium-button"
              onClick={() => setStockfishDifficulty(5)}
            >
              <FontAwesomeIcon icon={faChessKnight} /> Medium
            </button>
            <button
              className="hard-button"
              onClick={() => setStockfishDifficulty(10)}
            >
              <FontAwesomeIcon icon={faChessKing} /> Hard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChessComponent;
