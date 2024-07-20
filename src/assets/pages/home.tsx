import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, ConfigProvider } from "antd";
import {
  TeamOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import Background from "../constants/background/background.tsx";
import Footer from "../constants/footer/footer.tsx";
import Menu from "../constants/menu/menu.tsx";
import chessboardImage from "../images/chessboard.jpg";
import "../styles/home.css";

interface Stats {
  numberOfActiveRooms: number;
  numberOfActiveUsers: number;
  numberOfGamesPlayed: number;
  numberOfTournamentsEver: number;
  numberOfPlayersRegisteredToday: number;
}

const Statistics = ({ stats }: { stats: Stats }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: "white",
        },
      }}
    >
      <Card
        title={
          <span
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Platform Statistics
          </span>
        }
        bordered={false}
        style={{
          width: 300,
          backgroundColor: "transparent",
          color: "white",
          alignContent: "center",
        }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Statistic
              title={<span style={{ color: "white" }}>Registered Today</span>}
              value={stats.numberOfPlayersRegisteredToday}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={<span style={{ color: "white" }}>Active Rooms</span>}
              value={stats.numberOfActiveRooms}
              prefix={<AppstoreAddOutlined />}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Statistic
              title={<span style={{ color: "white" }}>Active Users</span>}
              value={stats.numberOfActiveUsers}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title={<span style={{ color: "white" }}>Games Played</span>}
              value={stats.numberOfGamesPlayed}
              prefix={<PlayCircleOutlined />}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Statistic
              title={<span style={{ color: "white" }}>Tournaments Ever</span>}
              value={stats.numberOfTournamentsEver}
              prefix={<TrophyOutlined />}
              className="titleClassName"
            />
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
};

const MainPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const response = await fetch("http://172.16.1.70:8000/server/data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const {
            numberOfPlayersRegisteredToday,
            numberOfActiveRooms,
            numberOfActiveUsers,
            numberOfGamesPlayed,
            numberOfTournamentsEver,
          } = data;

          setStats({
            numberOfPlayersRegisteredToday,
            numberOfActiveRooms,
            numberOfActiveUsers,
            numberOfGamesPlayed,
            numberOfTournamentsEver,
          });
        } else {
          console.error(
            "Failed to fetch profile image. Status:",
            response.status
          );
          throw new Error("Failed to fetch profile image");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="mainpage-container">
      <Background />
      <div className="content-container">
        <div className="left-side-main">
          <Menu />
        </div>
        <div className="middle-side-main">
          <img
            src={chessboardImage}
            className="img-main-table"
            alt="Chessboard"
            draggable="false"
            style={{ border: "3px solid white" }}
          />
        </div>
        <div
          className="right-side-main"
          style={{ marginLeft: "0", padding: "20px" }}
        >
          {stats !== null ? (
            <Statistics stats={stats} />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
      <div className="footer-side">
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
