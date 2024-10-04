import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move } from "chess.js";
import Background from "../constants/background/background.js";
import "../styles/train.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flip } from "react-toastify";
import Menu from "../constants/menu/menu.tsx";
import wrongSound from "../constants/sounds/wrong.mp3";
import NotificationSound from "../constants/sounds/notification.mp3";
import { Button, Modal } from "antd";
import "antd/dist/reset.css";
import lottieBlackPlayer from "../animations/trainingRobot.json";
import {
  faChessPawn,
  faChessRook,
  faChessKnight,
  faChessBishop,
  faChessQueen,
  faChessKing,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert";
import { Player } from "@lottiefiles/react-lottie-player";
import ScaleLoader from "react-spinners/ScaleLoader";

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
  const [game, setGame] = useState<Chess>(() => {
    const savedFen = localStorage.getItem("chessGame");
    return new Chess(savedFen || initialFen);
  });
  const [lastMove, setLastMove] = useState<React.ReactElement | null>(null);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("capturedByWhite") || "[]")
  );
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("capturedByBlack") || "[]")
  );
  const [moveHistory, setMoveHistory] = useState<Move[]>(() =>
    JSON.parse(localStorage.getItem("moveHistory") || "[]")
  );
  const [formattedMoveHistory, setFormattedMoveHistory] = useState<string>("");
  const [ECO, setECO] = useState<string>(
    () => localStorage.getItem("ECO") || ""
  );
  const [Opening, setOpening] = useState<string>(
    () => localStorage.getItem("Opening") || "Starting Position"
  );
  const [Variation, setVariation] = useState<string>(
    () => localStorage.getItem("Variation") || " "
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resumeModalVisible, setResumeModalVisible] = useState(false);
  const maxHistoryLines = 6;

  useEffect(() => {
    const savedFen = localStorage.getItem("chessGame");
    const savedMoveHistory = localStorage.getItem("moveHistory");
    const savedCapturedByWhite = localStorage.getItem("capturedByWhite");
    const savedCapturedByBlack = localStorage.getItem("capturedByBlack");
    const savedECO = localStorage.getItem("ECO");
    const savedOpening = localStorage.getItem("Opening");
    const savedVariation = localStorage.getItem("Variation");

    if (savedFen && savedFen !== initialFen) {
      setResumeModalVisible(true);
      setGame(new Chess(savedFen));
    } else {
      setGame(new Chess(initialFen));
    }

    if (savedMoveHistory) {
      setMoveHistory(JSON.parse(savedMoveHistory));
    }

    if (savedCapturedByWhite) {
      setCapturedByWhite(JSON.parse(savedCapturedByWhite));
    }

    if (savedCapturedByBlack) {
      setCapturedByBlack(JSON.parse(savedCapturedByBlack));
    }

    setECO(savedECO || "");
    setOpening(savedOpening || "");
    setVariation(savedVariation || " ");
  }, []);

  const showNewGameModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    resetGame();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [waitingForData, setWaitingForData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaitingForData(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const resetGame = () => {
    setGame(new Chess(initialFen));
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setMoveHistory([]);
    setFormattedMoveHistory("");
    setECO("");
    setOpening("Starting Position");
    setVariation(" ");
    localStorage.removeItem("chessGame");
    localStorage.removeItem("moveHistory");
    localStorage.removeItem("capturedByWhite");
    localStorage.removeItem("capturedByBlack");
    localStorage.removeItem("ECO");
    localStorage.removeItem("Opening");
    localStorage.removeItem("Variation");
  };

  const handleResumeGame = () => {
    setResumeModalVisible(false);

    const savedFen = localStorage.getItem("chessGame");
    const savedMoveHistory = localStorage.getItem("moveHistory");
    const savedCapturedByWhite = localStorage.getItem("capturedByWhite");
    const savedCapturedByBlack = localStorage.getItem("capturedByBlack");
    const savedECO = localStorage.getItem("ECO");
    const savedOpening = localStorage.getItem("Opening");
    const savedVariation = localStorage.getItem("Variation");

    if (savedFen && savedFen !== initialFen) {
      setGame(new Chess(savedFen));
    } else {
      setGame(new Chess(initialFen));
    }

    if (savedMoveHistory) {
      setMoveHistory(JSON.parse(savedMoveHistory));
    } else {
      setMoveHistory([]);
    }

    if (savedCapturedByWhite) {
      setCapturedByWhite(JSON.parse(savedCapturedByWhite));
    } else {
      setCapturedByWhite([]);
    }

    if (savedCapturedByBlack) {
      setCapturedByBlack(JSON.parse(savedCapturedByBlack));
    } else {
      setCapturedByBlack([]);
    }

    setECO(savedECO || "");
    setOpening(savedOpening || "");
    setVariation(savedVariation || " ");
  };

  const handleCancelResume = () => {
    setResumeModalVisible(false);
    resetGame();
  };

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
      console.error("Error playing win sound:", error);
    });
  };

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
        if (game.turn() === "w") {
          Swal({
            title: "Checkmate!",
            text: "You lost the game!",
            icon: "error",
          });
        } else {
          Swal({
            title: "Checkmate!",
            text: "You won the game!",
            icon: "success",
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

  useEffect(() => {
    const fen = game.fen();
    localStorage.setItem("chessGame", fen);
    localStorage.setItem("moveHistory", JSON.stringify(moveHistory));
    localStorage.setItem("capturedByWhite", JSON.stringify(capturedByWhite));
    localStorage.setItem("capturedByBlack", JSON.stringify(capturedByBlack));
    localStorage.setItem("ECO", "");
    localStorage.setItem("Opening", Opening);
    localStorage.setItem("Variation", Variation);
  }, [
    game,
    moveHistory,
    capturedByWhite,
    capturedByBlack,
    ECO,
    Opening,
    Variation,
  ]);

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

    const pieceKey = move.piece as keyof typeof pieceIcons;
    const pieceColor = game.turn() === "w" ? "black" : "white";

    if (lastMove) {
      null;
    }
    const notation = (
      <div>
        <p>Last move</p>
        <p>
          <FontAwesomeIcon icon={pieceIcons[pieceKey]} color={pieceColor} />{" "}
          {move.to}
        </p>
      </div>
    );

    setLastMove(notation);

    if (move.captured) {
      const capturedPiece = move.captured as keyof typeof pieceIcons;
      if (game.turn() === "b") {
        setCapturedByWhite([...capturedByWhite, capturedPiece]);
      } else {
        setCapturedByBlack([...capturedByBlack, capturedPiece]);
      }
    }

    setMoveHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, move];
      const totalMoves = updatedHistory.length;
      const totalLines = Math.ceil(totalMoves / 2);

      if (totalLines > maxHistoryLines) {
        const linesToRemove = totalLines - maxHistoryLines;
        updatedHistory.splice(0, linesToRemove * 2);
      }

      const historyString = updatedHistory.reduce((acc, move, index) => {
        const moveNumber = Math.floor(index / 2) + 1;
        const isWhiteMove = index % 2 === 0;
        const moveStr = move.san || "";

        if (isWhiteMove) {
          return acc + ` ${moveNumber}. ${moveStr}`;
        } else {
          return acc + ` ${moveStr}`;
        }
      }, "");

      setFormattedMoveHistory(historyString);
      return updatedHistory;
    });
  };

  const handlePieceDragBegin = (_sourceSquare: string, piece: string) => {
    const allMoves = game.moves({ verbose: true });

    const pieceMoves = allMoves.filter((move) => move.from === piece);

    if (pieceMoves.length > 0) {
      pieceMoves.forEach((move) => {
        const targetSquareElement = document.querySelector<HTMLElement>(
          `[data-square="${move.to}"]`
        );

        if (targetSquareElement) {
          const existingGreyDot =
            targetSquareElement.querySelector(".grey-dot");
          if (existingGreyDot) {
            targetSquareElement.removeChild(existingGreyDot);
          }

          const originalFilter = targetSquareElement.style.filter;
          targetSquareElement.style.filter = "brightness(100%)";

          const greyDot = document.createElement("span");
          greyDot.className = "grey-dot";
          targetSquareElement.appendChild(greyDot);

          const handleDragEnd = () => {
            targetSquareElement.style.filter = originalFilter;
            const greyDotToRemove =
              targetSquareElement.querySelector(".grey-dot");
            if (greyDotToRemove) {
              targetSquareElement.removeChild(greyDotToRemove);
            }

            document.removeEventListener("dragend", handleDragEnd);
            document.removeEventListener("touchend", handleDragEnd);
          };

          document.addEventListener("dragend", handleDragEnd);
          document.addEventListener("touchend", handleDragEnd);
        } else {
          console.warn("Target square element not found");
        }
      });
    }
  };

  async function findOpening(formattedMoveHistory: string) {
    try {
      const response = await fetch("../src/assets/constants/openings/eco.txt");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const pgnFileContent = await response.text();

      const pgnEntries = pgnFileContent.split(/\n\s*\n/);
      const normalizedMoveHistory = formattedMoveHistory
        .replace(/\s*\*\s*$/, "")
        .trim();
      let index = 0;

      for (const entry of pgnEntries) {
        const normalizedEntry = entry.replace(/\s*\*\s*$/, "").trim();
        index++;
        if (normalizedEntry === normalizedMoveHistory) {
          if (normalizedEntry === "") {
            break;
          }
          const saveContent = pgnEntries[index - 2];
          const extractedValues = (saveContent.match(/"([^"]*)"/g) || []).map(
            (match) => match.slice(1, -1)
          );

          setECO(extractedValues[0] || "N/A");
          setOpening(extractedValues[1] || "N/A");
          setVariation(extractedValues[2] || "N/A");

          const ecoMatch = entry.match(/\[ECO\s+"([^"]+)"\]/);
          const eco = ecoMatch ? ecoMatch[1] : "N/A";

          const openingMatch = entry.match(/\[Opening\s+"([^"]+)"\]/);
          const opening = openingMatch ? openingMatch[1] : "N/A";

          const variationMatch = entry.match(/\[Variation\s+"([^"]+)"\]/);
          const variation = variationMatch ? variationMatch[1] : "N/A";

          return {
            ECO: eco,
            Opening: opening,
            Variation: variation,
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching the PGN file:", error);
      return null;
    }
  }

  findOpening(formattedMoveHistory).then((openingInfo) => {
    if (openingInfo) {
      null;
    } else {
      null;
    }
  });

  return (
    <div className="chess-wrapper">
      <Background />
      <ToastContainer />
      <div className="chess-main-container">
        {waitingForData ? (
          <div className="waiting-message">
            <ScaleLoader loading={waitingForData} color="#999" />
            <p>Fetching data...</p>
          </div>
        ) : (
          <>
            <div className="menu-train">
              <Menu />
            </div>
            <div className="chess-content">
              <div className="player-info player-white">
                <Player
                  autoplay
                  loop
                  src={lottieBlackPlayer}
                  style={{ width: "70px", height: "70px" }}
                  className="pictures-train"
                />
                <div className="player-details">
                  <div className="player-name">
                    <p>Stockfish</p>
                  </div>
                  <div className="captured-pieces">
                    <div className="captured-list">
                      {capturedByBlack.map((piece, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={pieceIcons[piece as keyof typeof pieceIcons]}
                          color="grey"
                          className="captured-piece-icon"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Chessboard
                position={game.fen()}
                onPieceDrop={handleMove}
                onPieceDragBegin={handlePieceDragBegin}
                areArrowsAllowed={true}
                clearPremovesOnRightClick={true}
                promotionDialogVariant={"vertical"}
                customDarkSquareStyle={{ backgroundColor: "#4F4F4F" }}
                customLightSquareStyle={{ backgroundColor: "#222" }}
                snapToCursor={true}
              />
              <div className="player-info player-black">
                <Player
                  autoplay
                  loop
                  src={lottieBlackPlayer}
                  style={{ width: "70px", height: "70px" }}
                  className="pictures-train"
                />
                <div className="player-details">
                  <div className="player-name">
                    <p>White</p>
                  </div>
                  <div className="captured-pieces">
                    <div className="captured-list">
                      {capturedByWhite.map((piece, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={pieceIcons[piece as keyof typeof pieceIcons]}
                          color="white"
                          className="captured-piece-icon"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="move-history-container">
              <h1 className="stockfish-name">Stockfish</h1>
              <Player
                hover
                className="right-icon"
                src={lottieBlackPlayer}
                style={{ width: "200px", height: "200px" }}
              />
              <div className="move-history">
                <div className="opening-information">
                  <p className="opening">{Opening}</p>
                  <p className="opening">{Variation}</p>
                </div>
                <ul>
                  {moveHistory
                    .reduce((rows, move, index) => {
                      const rowIndex = Math.floor(index / 2);
                      if (!rows[rowIndex]) rows[rowIndex] = [];
                      rows[rowIndex].push(move);
                      return rows;
                    }, [] as Move[][])
                    .map((row, rowIndex) => (
                      <li
                        key={rowIndex}
                        style={{
                          display: "flex",
                          justifyContent:
                            row.length === 1 ? "flex-start" : "space-between",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            justifyContent: "space-between",
                          }}
                        >
                          {row.map((move, moveIndex) => (
                            <span
                              key={moveIndex}
                              style={{
                                marginLeft:
                                  rowIndex % 2 === 0 && moveIndex === 1
                                    ? "auto"
                                    : "0",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  pieceIcons[
                                    move.piece as keyof typeof pieceIcons
                                  ]
                                }
                              />{" "}
                              {move.to}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <Button
                type="primary"
                style={{ backgroundColor: "#222" }}
                danger
                onClick={showNewGameModal}
              >
                New Game
              </Button>
              <Modal
                title="New Game"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Continue game"
                okText="Reset Game"
              >
                <p>
                  Are you sure you want to start a new game? This will reset the
                  current game.
                </p>
              </Modal>
              <Modal
                title="Resume Game"
                open={resumeModalVisible}
                onOk={handleResumeGame}
                onCancel={handleCancelResume}
                cancelText="New Game"
                okText="Continue game"
              >
                <p>
                  Do you want to resume your previous game or start a new one?
                </p>
              </Modal>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChessComponent;
