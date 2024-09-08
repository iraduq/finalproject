import { useEffect, useRef } from "react";
import { Card, Row, Col } from "antd";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router-dom";
import Background from "../constants/background/background.tsx";
import Menu from "../constants/menu/menu.tsx";
import "../styles/home.css";

import OnlineAnimation from "../animations/online.json";
import PuzzleAnimation from "../animations/puzzle.json";
import RobotAnimation from "../animations/robot.json";
import HoverSound from "../sounds/selectSound.mp3";

const MainPage = () => {
  const navigate = useNavigate();

  const onlineRef = useRef<Player>(null);
  const puzzleRef = useRef<Player>(null);
  const robotRef = useRef<Player>(null);

  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    hoverSoundRef.current = new Audio(HoverSound);
    if (hoverSoundRef.current) {
      hoverSoundRef.current.volume = 0.3;
    }
  }, []);

  const handleMouseEnter = (ref: React.RefObject<Player>) => {
    ref.current?.play();
    if (hoverSoundRef.current) {
      hoverSoundRef.current.play();
    }
  };

  const handleMouseLeave = (ref: React.RefObject<Player>) => {
    ref.current?.stop();
    if (hoverSoundRef.current) {
      hoverSoundRef.current.pause();
      hoverSoundRef.current.currentTime = 0;
    }
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="mainpage-container">
      <Background />
      <div className="content-container">
        <div className="left-side-main">
          <Menu />
        </div>
        <div className="middle-side-main">
          <div className="text-banner">
            <span className="text-banner-heading">Play Chess</span>
            <span className="text-banner-subheading">
              Unleash Your Strategy: Play Chess Like a Pro
            </span>
          </div>
          <Row gutter={16} justify="center">
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card
                bordered={false}
                className="animation-card"
                onMouseEnter={() => handleMouseEnter(onlineRef)}
                onMouseLeave={() => handleMouseLeave(onlineRef)}
                onClick={() => handleCardClick("/online")}
              >
                <div className="card-content">
                  <Player
                    ref={onlineRef}
                    autoplay={false}
                    loop
                    src={OnlineAnimation}
                    className="animation-player"
                  />
                </div>
                <div className="card-footer online-footer">
                  <span className="footer-text">Play Online</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card
                bordered={false}
                className="animation-card"
                onMouseEnter={() => handleMouseEnter(puzzleRef)}
                onMouseLeave={() => handleMouseLeave(puzzleRef)}
                onClick={() => handleCardClick("/puzzle")}
              >
                <div className="card-content">
                  <Player
                    ref={puzzleRef}
                    autoplay={false}
                    loop
                    src={PuzzleAnimation}
                    className="animation-player"
                  />
                </div>
                <div className="card-footer puzzle-footer">
                  <span className="footer-text">Play Puzzle</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card
                bordered={false}
                className="animation-card"
                onMouseEnter={() => handleMouseEnter(robotRef)}
                onMouseLeave={() => handleMouseLeave(robotRef)}
                onClick={() => handleCardClick("/train")}
              >
                <div className="card-content">
                  <Player
                    ref={robotRef}
                    autoplay={false}
                    loop
                    src={RobotAnimation}
                    className="animation-player"
                  />
                </div>
                <div className="card-footer robot-footer">
                  <span className="footer-text">Play Vs Robot</span>
                </div>
              </Card>
            </Col>
          </Row>
          <div className="bottom-banner">
            <span className="banner-text">
              © 2024 Techy Pythons. All rights reserved. Techy Pythons may earn
              a portion of sales from products that are purchased through our
              site as part of our Affiliate Partnerships with retailers. The
              material on this site may not be reproduced, distributed,
              transmitted, cached or otherwise used, except with the prior
              written permission of Techy Pythons.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
