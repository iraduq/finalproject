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
import { Avatar, Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta.js";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

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
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [OtherJWT, setOtherJWT] = useState("");
  const [myName, setMyName] = useState("");
  const [myLosses, setMyLosses] = useState("");
  const [myWins, setMyWins] = useState("");
  const [otherName, setOtherName] = useState("");
  const [otherLosses, setOtherLosses] = useState("");
  const [otherWins, setOtherWins] = useState("");
  const [myPicture, setMyPicture] = useState("");
  const [otherPicture, setOtherPicture] = useState("");

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
    `ws://172.16.1.22:8000/ws/${localStorage.getItem("token")}`,
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
    if (lastMessage && typeof lastMessage.data === "string") {
      try {
        const receivedData = JSON.parse(lastMessage.data);
        if (receivedData.white_player_jwt && receivedData.black_player_jwt) {
          createGame(receivedData);
        } else {
          console.error("Incomplete data for game creation:", receivedData);
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
      const response = await fetch("http://172.16.1.22:8000/games/create", {
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
    const handleGameOver = async () => {
      if (game.isGameOver()) {
        setIsGameFinished(true);
        if (game.isCheckmate()) {
          const winner = game.turn() === "w" ? "black" : "white";
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
          const response = await fetch("http://172.16.1.22:8000/games/put", {
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
            "http://172.16.1.22:8000/profile/get_both_pictures",
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
          setMyWins(responseData.myWins);
          setMyLosses(responseData.myLosses);
          setOtherName(responseData.otherName);
          setOtherLosses(responseData.otherLosses);
          setOtherWins(responseData.otherWins);
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
              onPieceDrop={(sourceSquare, targetSquare, piece) =>
                handleMove(sourceSquare, targetSquare, piece)
              }
              boardOrientation={boardOrientation || undefined}
              onPieceDragBegin={handlePieceDragBegin}
              promotionDialogVariant={"vertical"}
            />
            {isProcessingMove && (
              <div className="loading-indicator">Processing...</div>
            )}
          </div>
        </div>
        {jwtReceived && (
          <div className="right-area-online">
            <div className="game-info-container">
              <Row gutter={[16, 16]} justify="center" align="middle">
                <Col span={24}>
                  <Card
                    title="Your Info"
                    style={{
                      textAlign: "center",
                      maxWidth: 300,
                      marginBottom: 16,
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#f8dcb4",
                      fontWeight: "900",
                    }}
                    bordered={false}
                    headStyle={{ fontSize: "1.2rem", color: "black" }}
                  >
                    <Meta
                      avatar={
                        <Avatar src={myPicture} size={128} draggable="false" />
                      }
                      title={
                        <h2 style={{ fontWeight: "bold", color: "black" }}>
                          {myName}
                        </h2>
                      }
                      description={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <h4 style={{ color: "#52c41a" }}>
                            <SmileOutlined /> {`Wins: ${myWins}`}
                          </h4>
                          <h4 style={{ color: "#ff4d4f" }}>
                            <FrownOutlined /> {`Losses: ${myLosses}`}
                          </h4>
                        </div>
                      }
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card
                    title="Opponent's Info"
                    style={{
                      textAlign: "center",
                      maxWidth: 300,
                      marginBottom: 16,
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#f8dcb4",
                    }}
                    bordered={false}
                    headStyle={{
                      fontSize: "1.2rem",
                      color: "black",
                      fontWeight: "900",
                    }}
                  >
                    <Meta
                      avatar={
                        <Avatar
                          src={otherPicture}
                          size={128}
                          draggable="false"
                        />
                      }
                      title={
                        <h2 style={{ fontWeight: "bold", color: "black" }}>
                          {otherName}
                        </h2>
                      }
                      description={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <h4 style={{ color: "#52c41a" }}>
                            <SmileOutlined /> {`Wins: ${otherWins}`}
                          </h4>
                          <h4 style={{ color: "#ff4d4f" }}>
                            <FrownOutlined /> {`Losses: ${otherLosses}`}
                          </h4>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineGame;
