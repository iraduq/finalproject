import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Chess } from "chess.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert";
import moveSelf from "../constants/sounds/move-self.mp3";

const PuzzleGame = () => {
  const [pgn, setPgn] = useState("");
  const [fen, setFen] = useState("");
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Chess | null>(null);
  const [solution, setSolution] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"w" | "b">("b");
  const [orientation, setOrientation] = useState<"white" | "black">("black");

  const playIllegalMoveSound = () => {
    const illegalMoveSound = new Audio(
      "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/illegal.mp3"
    );
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
          setLoading(false);
        } else {
          throw new Error("No daily puzzle found");
        }
      } catch (error) {
        console.error("Error fetching puzzle data:", error);
        setLoading(false);
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
    try {
      if (!game) return;

      const makeNextMove = (index: number, solution: string[]) => {
        if (index === solution.length - 1) {
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
            makeNextMove(index + 1, solution);
          }
        }, 1000);
      };

      if (currentSolutionIndex !== 0) {
        Swal({
          title: "Error",
          text: "Please reset the game.",
          icon: "error",
        });
      } else {
        makeNextMove(0, solution);
      }
    } catch (error) {
      console.error("Error handling show solution:", error);
    }
  };

  if (loading) {
    return <p>Loading puzzle...</p>;
  }

  const handlePieceDragBegin = (sourceSquare: string, piece: string) => {
    if (!game) {
      console.warn("No game available");
      return;
    }
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

  const handleResetGame = async () => {
    setLoading(true);

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
        setLoading(false);
      } else {
        throw new Error("No daily puzzle found");
      }
    } catch (error) {
      console.error("Error fetching puzzle data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container-online-puzzle">
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
              position={fen}
              boardOrientation={orientation}
              onPieceDrop={(sourceSquare, targetSquare) =>
                handleMove(sourceSquare, targetSquare)
              }
              arePiecesDraggable={true}
              onPieceDragBegin={handlePieceDragBegin}
              areArrowsAllowed={true}
            />

            <ToastContainer
              autoClose={500}
              style={{
                position: "fixed",
                left: "50%",
              }}
            />
          </div>
        </div>
      </div>
      <div className="right-side">
        <div className="right-puzzle">
          <div className="next-solution">
            <button onClick={handleNextSolution}>
              <svg
                className="css-i6dzq1"
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
          </div>
          <button onClick={handleShowSolution}>
            <svg
              className="css-i6dzq1"
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
          <button onClick={handleResetGame}>
            <svg
              className="css-i6dzq1"
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
  );
};

export default PuzzleGame;
