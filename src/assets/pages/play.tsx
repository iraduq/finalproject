import { useState, useEffect, useRef, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import Background from "../constants/background/background.jsx";
import "../styles/play.css";
import Menu from "../constants/menu/menu.tsx";
import { Chess } from "chess.js";
import useWebSocket from "react-use-websocket";
import moveSelf from "../constants/sounds/move-self.mp3";
import Swal from "sweetalert";
import {
  faChessBishop,
  faChessKing,
  faChessKnight,
  faChessPawn,
  faChessQueen,
  faChessRook,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import ScaleLoader from "react-spinners/ScaleLoader";
import Picker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import CONFIG from "../../config.ts";

const OnlineGame = () => {
  const playMoveSelfSound = () => {
    const audio = new Audio(moveSelf);
    audio.volume = 1;
    audio.play();
  };

  const pieceIcons = {
    p: faChessPawn,
    r: faChessRook,
    n: faChessKnight,
    b: faChessBishop,
    q: faChessQueen,
    k: faChessKing,
  };

  const [game, setGame] = useState(new Chess());
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<
    "white" | "black" | ""
  >("");
  const [jwtReceived, setJwtReceived] = useState(false);
  const [playerColor, setPlayerColor] = useState("");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [OtherJWT, setOtherJWT] = useState("");
  const [myName, setMyName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [myPicture, setMyPicture] = useState("");
  const [otherPicture, setOtherPicture] = useState("");
  const [capturedPieces, setCapturedPieces] = useState<string[]>([]);
  const [otherCapturedPieces, setOtherCapturedPieces] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState(30);
  const [otherRemainingTime, setOtherRemainingTime] = useState(30);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [drawRequest, setDrawRequest] = useState<string | null>(null);
  const [gameEnded, setGameEnded] = useState<string | null>(null);
  const [waitingForPlayer, setWaitingForPlayer] = useState(true);

  let totalMoves = 0;
  console.log(totalMoves);
  // De facut daca nu se reconecteaza playerul timp de 30 secunde sa se dea game over
  // de dat update azure

  useEffect(() => {
    const timer = setTimeout(() => {
      if (OtherJWT && otherPicture && otherName) {
        setWaitingForPlayer(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [OtherJWT, otherPicture, otherName]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleDraw = () => {
    const message = {
      action: "draw_request",
      sender: playerColor[0],
    };
    sendMessage(JSON.stringify(message));
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const message = {
      action: "chat_message",
      sender: playerColor[0],
      text: messageInput,
    };

    sendMessage(JSON.stringify(message));
    setMessageInput("");
  };

  const handleAbort = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you really want to abort the game?",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        const message = {
          action: "abort_request",
          sender: playerColor[0],
        };
        setGameEnded("true");
        sendMessage(JSON.stringify(message));
      },
      onCancel() {
        console.log("Abort request canceled");
      },
    });
  };

  const handleMessageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessageInput(event.target.value);
  };

  const handleMove = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ) => {
    if (game.turn() !== playerColor[0]) {
      return false;
    }
    if (gameEnded === "True") {
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece.slice(-1).toLowerCase(),
    });

    if (move) {
      totalMoves++;
      const updatedFen = game.fen();
      sendMessage(
        JSON.stringify({
          action: "player_move",
          move: {
            playerColor,
            sourceSquare,
            targetSquare,
            capturedPieceLastMove: move.captured || null,
          },
          fen: updatedFen,
          remainingTime: {
            myTime: remainingTime - 0.5,
            otherTime: otherRemainingTime,
          },
        })
      );

      setIsProcessingMove(true);
      setGame(new Chess(game.fen()));
      setIsProcessingMove(false);
      return true;
    }

    setGame(new Chess(game.fen()));
    return false;
  };

  const { lastMessage, sendMessage } = useWebSocket(
    `ws://${CONFIG.IP}/ws/${localStorage.getItem("token")}`,
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
          setJwtReceived(true);
          const currentPlayerJwt = localStorage.getItem("token");
          if (receivedData.white_player_jwt === currentPlayerJwt) {
            setBoardOrientation("white");
            setPlayerColor("white");
            setOtherJWT(receivedData.black_player_jwt);
          } else if (receivedData.black_player_jwt === currentPlayerJwt) {
            setBoardOrientation("black");
            setPlayerColor("black");
            setOtherJWT(receivedData.white_player_jwt);
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [lastMessage, jwtReceived]);

  useEffect(() => {
    if (jwtReceived) {
      const fetchBothPictures = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("ERROR!");
          throw new Error("ERROR!");
        }

        try {
          const response = await fetch(
            `${CONFIG.API_BASE_URL}/profile/get_both_pictures`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                myJWT: token,
                otherJWT: OtherJWT,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error", errorData);
            throw new Error("error");
          }

          const responseData = await response.json();

          setMyName(responseData.myName);
          setOtherName(responseData.otherName);
          setMyPicture(
            `data:image/jpeg;base64,${responseData.caller_profile_picture}`
          );
          setOtherPicture(
            `data:image/jpeg;base64,${responseData.requested_profile_picture}`
          );
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchBothPictures();
    }
  }, [OtherJWT, jwtReceived]);

  useEffect(() => {
    if (lastMessage && typeof lastMessage.data === "string") {
      try {
        const receivedData = JSON.parse(lastMessage.data);
        if (receivedData.white_player_jwt && receivedData.black_player_jwt) {
          createGame(receivedData);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  interface ReceivedData {
    white_player_jwt: string;
    black_player_jwt: string;
  }

  const createGame = async (receivedData: ReceivedData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/games/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          white_player: receivedData.white_player_jwt,
          black_player: receivedData.black_player_jwt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating game:", errorData);
        throw new Error("Failed to create game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  useEffect(() => {
    if (lastMessage && typeof lastMessage.data === "string") {
      try {
        const receivedData = JSON.parse(lastMessage.data);

        if (receivedData.action === "draw_request") {
          if (receivedData.sender !== playerColor[0]) {
            setDrawRequest(
              `Player ${receivedData.sender} has requested a draw. Do you accept?`
            );
          }
        } else if (receivedData.action === "draw_accept") {
          setGameEnded("true");

          //endpoint set draw
          Swal({
            title: "Draw Accepted!",
            text: "The game is now a draw.",
            icon: "info",
          });
          setDrawRequest(null);
        } else if (receivedData.action === "draw_decline") {
          Swal({
            title: "Draw Declined",
            text: "The draw request has been declined.",
            icon: "info",
          });
          setDrawRequest(null);
        }

        if (receivedData.action === "abort_request") {
          if (receivedData.sender !== playerColor[0]) {
            // endpoint de +1 game won
            Swal({
              title: "Game won",
              text: "The other player has aborted.",
              icon: "success",
            });
          } else {
            // endpoint de +1 game lost
            Swal({
              title: "Game lost",
              text: "You have aborted the game.",
              icon: "error",
            });
          }
          setGameEnded("true");
        }

        if (receivedData.action === "chat_message") {
          let sender = "";
          if (receivedData.sender === playerColor[0]) {
            sender = myName;
          } else {
            sender = otherName;
          }

          if (sender.trim()) {
            setChatMessages((prevMessages) => [
              ...prevMessages,
              `${sender}: ${receivedData.text}`,
            ]);
          }
        }

        if (receivedData.action === "player_move") {
          const updatedFen = receivedData.fen;
          setGame(new Chess(updatedFen));
          playMoveSelfSound();

          if (receivedData.remainingTime) {
            setRemainingTime(receivedData.remainingTime.myTime);
            setOtherRemainingTime(receivedData.remainingTime.otherTime);
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [lastMessage, jwtReceived, playerColor, myName, otherName]);

  useEffect(() => {
    if (lastMessage && typeof lastMessage.data === "string") {
      try {
        const receivedData = JSON.parse(lastMessage.data);

        if (receivedData.action === "player_move" && receivedData.move) {
          const { playerColor: movePlayerColor, capturedPieceLastMove } =
            receivedData.move;

          if (movePlayerColor !== playerColor) {
            if (capturedPieceLastMove) {
              setOtherCapturedPieces((prevCapturedPieces) => [
                ...prevCapturedPieces,
                capturedPieceLastMove,
              ]);
            }
          } else {
            if (capturedPieceLastMove) {
              setCapturedPieces((prevCapturedPieces) => [
                ...prevCapturedPieces,
                capturedPieceLastMove,
              ]);
            }
          }

          if (receivedData.fen) {
            setGame(new Chess(receivedData.fen));
            playMoveSelfSound();
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [lastMessage, playerColor]);

  useEffect(() => {
    const handleGameOver = async () => {
      if (game.isGameOver()) {
        setIsGameFinished(true);
        //fetch de +1 game played
        //fetch de update la move
        if (game.isCheckmate()) {
          const winner = game.turn() === "w" ? "black" : "white";
          if (winner === playerColor[0]) {
            // fetch() pentru win
          } else {
            //fetch pentru  lose
          }
          Swal({
            title: winner === playerColor ? "Game Won!" : "Game Lost!",
            text:
              winner === playerColor
                ? "You won the game!"
                : "You lost the game!",
            icon: winner === playerColor ? "success" : "error",
          });
        } else if (
          game.isDraw() ||
          game.isStalemate() ||
          game.isThreefoldRepetition() ||
          game.isInsufficientMaterial()
        ) {
          // endpoint  de +1 Draw
          Swal({
            title: "Draw!",
            text: "The Game is Over",
            icon: "info",
          });
        }
      }
    };

    handleGameOver();
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

  useEffect(() => {
    const sendGameResult = async () => {
      if (isGameFinished) {
        try {
          let resultWhite = "";
          let resultBlack = "";

          if (game.isCheckmate()) {
            const winner = game.turn() === "w" ? "black" : "white";
            resultWhite = winner === "white" ? "Won" : "Lost";
            resultBlack = winner === "black" ? "Won" : "Lost";
          }

          const token = localStorage.getItem("token");

          const response = await fetch(`${CONFIG.API_BASE_URL}/games/put`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result_white: resultWhite,
              result_black: resultBlack,
            }),
          });

          if (response.ok) {
            console.log("Succes!");
          } else {
            throw new Error("Error!");
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsGameFinished(false);
        }
      }
    };

    sendGameResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameFinished]);

  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleAcceptDraw = useCallback(() => {
    const message = {
      action: "draw_accept",
      sender: playerColor[0],
    };
    sendMessage(JSON.stringify(message));
    setDrawRequest(null);
    setGameEnded("true");
  }, [playerColor, sendMessage]);

  const handleDeclineDraw = useCallback(() => {
    const message = {
      action: "draw_decline",
      sender: playerColor[0],
    };
    sendMessage(JSON.stringify(message));
    setDrawRequest(null);
  }, [playerColor, sendMessage]);

  useEffect(() => {
    if (drawRequest) {
      Modal.confirm({
        title: "Draw Request",
        content: drawRequest,
        okText: "Accept",
        cancelText: "Decline",
        onOk: handleAcceptDraw,
        onCancel: handleDeclineDraw,
      });
    }
  }, [drawRequest, handleAcceptDraw, handleDeclineDraw]);

  return (
    <>
      <Background></Background>

      {waitingForPlayer ? (
        <div className="waiting-message">
          <ScaleLoader loading={waitingForPlayer} color="#999" />
          <p>Searching for another player to join...</p>
        </div>
      ) : (
        <>
          {!waitingForPlayer && (
            <div className="wrapper-online">
              <div className="menu-train">
                <Menu />
              </div>
              <div className="left-area-online">
                <div className="player-info player-black">
                  <div className="player-details-online">
                    <div className="player-name-online">
                      <img
                        src={otherPicture}
                        alt="Other Player"
                        style={{
                          height: "35px",
                          width: "35px",
                          borderRadius: "8px",
                          marginRight: "16px",
                        }}
                      />
                    </div>
                    <div className="details-play">
                      <div className="player-info-content">
                        <h2 className="player-name-text">{otherName}</h2>
                        <p className="player-description">
                          {otherCapturedPieces.length === 0 ? (
                            <span>No pieces have been captured yet.</span>
                          ) : (
                            otherCapturedPieces.map((piece, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={
                                  pieceIcons[piece as keyof typeof pieceIcons]
                                }
                                color="white"
                                className="captured-piece-icon"
                              />
                            ))
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chessboard-container-online">
                  <Chessboard
                    id="online-game"
                    position={game.fen()}
                    onPieceDrop={(sourceSquare, targetSquare, piece) =>
                      handleMove(sourceSquare, targetSquare, piece)
                    }
                    boardOrientation={boardOrientation || undefined}
                    onPieceDragBegin={handlePieceDragBegin}
                    promotionDialogVariant={"vertical"}
                    customDarkSquareStyle={{ backgroundColor: "#4F4F4F" }}
                    customLightSquareStyle={{ backgroundColor: "#222" }}
                    arePiecesDraggable={gameEnded !== "true"}
                  />

                  {isProcessingMove && (
                    <div className="loading-indicator">Processing...</div>
                  )}
                </div>
                <div className="player-info player-white">
                  <div className="player-details-online">
                    <div className="player-name">
                      <img
                        src={myPicture}
                        alt="My Profile"
                        style={{
                          height: "35px",
                          width: "35px",
                          borderRadius: "8px",
                          marginRight: "16px",
                        }}
                      />
                    </div>
                    <div className="details-play">
                      <div className="player-info-content">
                        <h2 className="player-name-text">{myName}</h2>
                        <p className="player-description">
                          {capturedPieces.length === 0 ? (
                            <span>No pieces have been captured yet.</span>
                          ) : (
                            capturedPieces.map((piece, index) => (
                              <FontAwesomeIcon
                                key={index}
                                icon={
                                  pieceIcons[piece as keyof typeof pieceIcons]
                                }
                                color="white"
                                className="captured-piece-icon"
                              />
                            ))
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-container">
                {myName && otherName && playerColor && (
                  <div className="chat-messages">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        ref={chatMessagesEndRef}
                        className="chat-message"
                      >
                        {msg}
                      </div>
                    ))}
                  </div>
                )}

                <div className="chat-input-container">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleMessageInputChange}
                    placeholder="Type a message..."
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
                <div className="button-area">
                  <button onClick={handleDraw}>Draw</button>
                  <button onClick={handleAbort}>Abort</button>
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    😀
                  </button>
                </div>
              </div>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  <Picker
                    reactionsDefaultOpen={true}
                    onEmojiClick={onEmojiClick}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default OnlineGame;
