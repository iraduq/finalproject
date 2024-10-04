import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessPawn } from "@fortawesome/free-solid-svg-icons";
import { Chess } from "chess.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert";
import moveSelf from "../constants/sounds/move-self.mp3";
import { Button, Modal } from "antd";
import { UserOutlined, CrownOutlined } from "@ant-design/icons";
import wrongSound from "../constants/sounds/wrong.mp3";
import Menu from "../constants/menu/menu";
import ScaleLoader from "react-spinners/ScaleLoader";
type PlayerColor = "w" | "b";

interface WelcomeModalProps {
  currentPlayer: PlayerColor;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ currentPlayer }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleOk = () => {
    setOpen(false);
  };

  return (
    <Modal
      title="Welcome to Chess Puzzle!"
      open={open}
      footer={[
        <Button key="ok" type="primary" onClick={handleOk}>
          Got it
        </Button>,
      ]}
      centered
      closable={false}
      onCancel={handleOk}
    >
      <p
        style={{
          marginBottom: 16,
          fontSize: "1.2em",
          display: "flex",
          alignItems: "center",
        }}
      >
        In this game, you are playing as{" "}
        {currentPlayer === "w" ? (
          <>
            <CrownOutlined style={{ marginLeft: 5, color: "grey" }} />
            White
          </>
        ) : (
          <>
            <UserOutlined style={{ marginLeft: 5, color: "black" }} />
            Black
          </>
        )}
        .
      </p>
    </Modal>
  );
};

const PuzzleGame = () => {
  const [pgn, setPgn] = useState("");
  const [fen, setFen] = useState("");
  const [game, setGame] = useState<Chess | null>(null);
  const [solution, setSolution] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"w" | "b">("b");
  const [orientation, setOrientation] = useState<"white" | "black">("black");
  const [waitingForData, setWaitingForData] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaitingForData(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const playIllegalMoveSound = () => {
    const illegalMoveSound = new Audio(wrongSound);
    illegalMoveSound.play().catch((error) => {
      console.error("Error playing illegal move sound:", error);
    });
  };

  useEffect(() => {
    const fetchPuzzleData = async () => {
      try {
        const response = await fetch("https://lichess.org/api/puzzle/daily");
        if (!response.ok) {
          throw new Error("Failed to fetch daily puzzle");
        }
        const puzzleData = await response.json();

        if (puzzleData && puzzleData.game && puzzleData.game.pgn) {
          setPgn(puzzleData.game.pgn);
          setSolution(puzzleData.puzzle.solution);
        } else {
          throw new Error("No daily puzzle found");
        }
      } catch (error) {
        console.error("Error fetching puzzle data:", error);
      }
    };

    fetchPuzzleData();
  }, []);

  useEffect(() => {
    if (pgn) {
      const chess = new Chess();
      chess.loadPgn(pgn);
      setGame(chess);
      setFen(chess.fen());

      setCurrentPlayer(chess.turn() as "w" | "b");
    }
  }, [pgn]);

  useEffect(() => {
    if (currentPlayer === "w") {
      setOrientation("white");
    } else {
      setOrientation("black");
    }
  }, [currentPlayer]);

  const playMoveSelfSound = () => {
    const audio = new Audio(moveSelf);
    audio.volume = 1;
    audio.play();
  };

  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [cooldown, setCooldown] = useState(false);

  const handleMove = (sourceSquare: string, targetSquare: string) => {
    if (!game) return false;
    if (game.turn() !== currentPlayer) return false;

    const previousFen = game.fen();

    try {
      const currentMove = solution[currentSolutionIndex];
      const promo = currentMove.substring(4, 5);

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: promo,
      });

      let userMove = "";

      if (move) {
        if (move.promotion) {
          userMove = move.from + move.to + move.promotion;
        } else {
          userMove = move.from + move.to;
        }
        if (userMove === solution[currentSolutionIndex]) {
          toast.success("Correct Move");
          playMoveSelfSound();
          setFen(game.fen());

          setCurrentSolutionIndex((prevIndex) => prevIndex + 1);

          if (currentSolutionIndex === solution.length - 1) {
            Swal({
              title: "Puzzle Completed",
              text: "All moves have been completed.",
              icon: "info",
            });
          } else {
            setCooldown(true);

            setTimeout(() => {
              setCooldown(false);

              const nextMove = solution[currentSolutionIndex + 1];
              const sourceSquareNext = nextMove.substring(0, 2);
              const targetSquareNext = nextMove.substring(2, 4);
              const promotion = nextMove.substring(4, 5);

              if (!cooldown) {
                playMoveSelfSound();
                const nextMoveResult = game.move({
                  from: sourceSquareNext,
                  to: targetSquareNext,
                  promotion: promotion,
                });

                if (nextMoveResult) {
                  setFen(game.fen());
                  setCurrentSolutionIndex((prevIndex) => prevIndex + 1);
                }
              }
            }, 1000);
          }
        } else {
          playIllegalMoveSound();
          toast.error("Wrong Move!");
          game.load(previousFen);
          setFen(previousFen);
        }
      } else {
        throw new Error("Invalid move");
      }
    } catch (error) {
      playIllegalMoveSound();
      toast.error("An error occurred while processing the move.");
      return false;
    }

    return true;
  };

  const [puzzleCompleted, setPuzzleCompleted] = useState(false);

  const handleNextSolution = () => {
    if (!game || puzzleCompleted) {
      Swal({
        title: "Puzzle Completed",
        text: "To continue, please reset the game.",
        icon: "error",
      });
      return;
    }

    const makeNextMove = (index: number, movesToMake: number) => {
      if (movesToMake === 0) return;

      const nextMove = solution[index];
      const sourceSquare = nextMove.substring(0, 2);
      const targetSquare = nextMove.substring(2, 4);
      const promotion = nextMove.substring(4, 5);

      setTimeout(() => {
        const moveResult = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: promotion,
        });

        if (moveResult) {
          playMoveSelfSound();
          setFen(game.fen());
          setCurrentSolutionIndex(index + 1);
          toast.success("Correct Move");

          if (index === solution.length - 1) {
            Swal({
              title: "Puzzle Completed",
              text: "All moves have been completed",
              icon: "info",
            });
            setPuzzleCompleted(true);
          } else {
            makeNextMove(index + 1, movesToMake - 1);
          }
        }
      }, 1000);
    };

    const resetFenToDefault = () => {
      setFen(fen);
    };

    resetFenToDefault();
    if (currentSolutionIndex == solution.length) {
      Swal({
        title: "Puzzle Completed",
        text: "To continue, please reset the game.",
        icon: "error",
      });
    } else {
      makeNextMove(currentSolutionIndex, 2);
    }
  };

  const handleShowSolution = async () => {
    if (!game || solution.length === 0) return;

    game.loadPgn(pgn);
    setCurrentSolutionIndex(0);

    setTimeout(() => {
      setFen(game.fen());

      const makeNextMove = (index: number, solution: string[]) => {
        if (index === solution.length) {
          playMoveSelfSound();
          Swal({
            title: "Puzzle Completed",
            text: "All moves have been completed",
            icon: "info",
          });
          return;
        }

        const nextMove = solution[index];
        const sourceSquare = nextMove.substring(0, 2);
        const targetSquare = nextMove.substring(2, 4);
        const promotion =
          nextMove.length === 5 ? nextMove.substring(4, 5) : undefined;

        setTimeout(() => {
          const moveResult = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: promotion,
          });

          if (moveResult) {
            playMoveSelfSound();
            setFen(game.fen());
            setCurrentSolutionIndex(index + 1);
            makeNextMove(index + 1, solution);
          }
        }, 1000);
      };

      const firstMove = solution[0];
      const firstSourceSquare = firstMove.substring(0, 2);
      const firstTargetSquare = firstMove.substring(2, 4);
      const firstMoveResult = game.move({
        from: firstSourceSquare,
        to: firstTargetSquare,
      });
      if (!firstMoveResult) {
        makeNextMove(0, solution);
      } else {
        game.undo();
        makeNextMove(0, solution);
      }
    }, 1000);
  };

  const handlePieceDragBegin = (sourceSquare: string, piece: string) => {
    console.log(`Started dragging piece ${piece} from square ${sourceSquare}`);

    if (!game) {
      console.warn("No game available");
      return;
    }

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

          const cleanup = () => {
            targetSquareElement.style.filter = originalFilter;
            targetSquareElement.removeChild(greyDot);
          };

          const handleDragEndMouse = () => {
            cleanup();
            document.removeEventListener("dragend", handleDragEndMouse);
          };
          document.addEventListener("dragend", handleDragEndMouse);

          const handleDragEndTouch = () => {
            cleanup();
            document.removeEventListener("touchend", handleDragEndTouch);
          };
          document.addEventListener("touchend", handleDragEndTouch);
        } else {
          console.warn("Target square element not found");
        }
      });
    } else {
      console.log("No legal moves available for the picked up piece.");
    }
  };

  const handleResetGame = async () => {
    setPuzzleCompleted(false);

    try {
      const response = await fetch("https://lichess.org/api/puzzle/daily");
      if (!response.ok) {
        throw new Error("Failed to fetch daily puzzle");
      }
      const puzzleData = await response.json();

      if (puzzleData && puzzleData.game && puzzleData.game.pgn) {
        const newPgn = puzzleData.game.pgn;
        const newChess = new Chess();
        newChess.loadPgn(newPgn);

        setPgn(newPgn);
        setSolution(puzzleData.puzzle.solution);
        setGame(newChess);
        setCurrentPlayer(newChess.turn() as "w" | "b");
        setFen(newChess.fen());
        setCurrentSolutionIndex(0);
      } else {
        throw new Error("No daily puzzle found");
      }
    } catch (error) {
      console.error("Error fetching puzzle data:", error);
    }
  };

  return (
    <div className="container-puzzle">
      <Menu></Menu>
      {waitingForData ? (
        <div className="waiting-message">
          <ScaleLoader loading={waitingForData} color="#999" />
          <p>Fetching data...</p>
        </div>
      ) : (
        <div className="wrapper-total">
          <WelcomeModal currentPlayer={currentPlayer as PlayerColor} />
          <div className="wrapper-puzzle">
            <div className="left-puzzle">
              <div className="header-online"></div>
              <div className="chessboard-container-puzzle">
                <Chessboard
                  position={fen}
                  boardOrientation={orientation}
                  onPieceDrop={(sourceSquare, targetSquare) =>
                    handleMove(sourceSquare, targetSquare)
                  }
                  arePiecesDraggable={true}
                  onPieceDragBegin={handlePieceDragBegin}
                  areArrowsAllowed={true}
                  customDarkSquareStyle={{ backgroundColor: "#4F4F4F" }}
                  customLightSquareStyle={{ backgroundColor: "#222" }}
                />

                <ToastContainer
                  autoClose={500}
                  style={{
                    position: "fixed",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "0px",
                    zIndex: 9999,
                  }}
                  toastStyle={{
                    margin: "0",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="right-side">
            <div className="right-puzzle">
              <div className="next-solution">
                <div className="turn-indicator">
                  {game?.turn() === "w" ? (
                    <>
                      <FontAwesomeIcon
                        icon={faChessPawn}
                        className="pawnProperties"
                        style={{ color: "white", fontSize: "30px" }}
                      />
                      <span>White</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faChessPawn}
                        style={{ color: "black", fontSize: "30px" }}
                      />
                      <span>Black</span>
                    </>
                  )}
                </div>

                <button className="button-puzzle" onClick={handleNextSolution}>
                  <svg
                    className="css-i6dzq1 small-svg"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    height="60"
                    width="60"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  Next Move
                </button>
                <button className="button-puzzle" onClick={handleShowSolution}>
                  <svg
                    className="css-i6dzq1 small-svg"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    height="60"
                    width="60"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  Solution
                </button>
                <button className="button-puzzle" onClick={handleResetGame}>
                  <svg
                    className="css-i6dzq1 small-svg"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    height="60"
                    width="60"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default PuzzleGame;
