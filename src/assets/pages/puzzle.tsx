import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Chess } from "chess.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert";

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
          console.log(puzzleData.puzzle.solution);
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

  const handleMove = (sourceSquare: string, targetSquare: string): boolean => {
    if (!game) return false;
    if (game.turn() !== currentPlayer) return false;

    const previousFen = game.fen();

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move) {
        const userMove = move.from + move.to;

        const isCorrectMove = solution.some(
          (solutionMove) => solutionMove === userMove
        );

        if (isCorrectMove) {
          toast.success("Correct Move");
          setFen(game.fen());

          const nextSolutionIndex = solution.indexOf(userMove) + 1;
          const nextMove = solution[nextSolutionIndex];

          if (nextMove) {
            const sourceSquareNext = nextMove.substring(0, 2);
            const targetSquareNext = nextMove.substring(2, 4);

            const nextMoveResult = game.move({
              from: sourceSquareNext,
              to: targetSquareNext,
              promotion: "q",
            });

            if (nextMoveResult) {
              console.log("Next solution move:", nextMove);
              setFen(game.fen());
            }
          } else {
            if (solution.length === nextSolutionIndex) {
              Swal({
                title: "Congratulations!",
                text: "You've completed the puzzle!",
                icon: "success",
              });
            }
          }

          return true;
        } else {
          playIllegalMoveSound();
          toast.error("Wrong Move!");
          game.load(previousFen);
          setFen(previousFen);
          return false;
        }
      } else {
        throw new Error("Invalid move");
      }
    } catch (error) {
      playIllegalMoveSound();
      toast.error("Illegal move!");
      return false;
    }
  };

  if (loading) {
    return <p>Loading puzzle...</p>;
  }
  return (
    <div className="container-online">
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
    </div>
  );
};

export default PuzzleGame;
