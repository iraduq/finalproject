import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Background from "../constants/background/background.js";
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
  const [lastMove, setLastMove] = useState(null);

  useEffect(() => {
    if (game.turn() === "b" && !game.isGameOver()) {
      makeStockfishMove();
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
        }
      }, 1000);
    }
  };

  function delay(fn, delay) {
    return new Promise((resolve) => {
      setTimeout(() => {
        fn();
        resolve();
      }, delay);
    });
  }

  const handleMove = (source, target, piece) => {
    const move = game.move({
      from: source,
      to: target,
      promotion: piece.slice(-1).toLowerCase(),
    });
    if (!move) {
      return;
    }
    setGame(new Chess(game.fen()));
    updateMoveHistory(move);
  };

  const resetGame = () => {
    setGame(new Chess());
    setLastMove(null);
  };

  const updateMoveHistory = (move) => {
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

  return (
    <div className="chess-wrapper">
      <div className="header-online">
        <FontAwesomeIcon icon={faHouse} />
        <span className="icon-spacing">HOME</span>
      </div>
      <Background />
      <div className="chess-container">
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
              allowDrag={({ piece }) =>
                game.turn() === "w" && piece.startsWith("w")
              }
            />
          </div>
        </div>
        <div className="right-content">
          <div className="reset-button">
            <button onClick={resetGame}>Reset Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChessComponent;
