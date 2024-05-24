import React from "react";
import { Layout, Menu as AntMenu, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  QuestionCircleOutlined,
  PlayCircleOutlined,
  BellOutlined,
  MailOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  TrophyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./menu.css";

const { Sider } = Layout;

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const items = [
    null,
    {
      label: "Play Online",
      key: "play",
      icon: <PlayCircleOutlined spin />,
      onClick: () => navigate("/online"),
    },
    {
      label: "Play vs Bot",
      key: "train",
      icon: <BellOutlined spin />,
      onClick: () => navigate("/train"),
    },
    {
      label: "Puzzle",
      key: "puzzle",
      icon: <TrophyOutlined spin />,
      onClick: () => navigate("/puzzle"),
    },
    {
      label: "Profile",
      key: "profile",
      icon: <TeamOutlined spin />,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Learn",
      key: "learn",
      icon: <QuestionCircleOutlined spin />,
      onClick: () => navigate("/tutorial"),
    },
    {
      label: "Contact",
      key: "contact",
      icon: <MailOutlined spin />,
      onClick: () => navigate("/contact"),
    },
    {
      label: "About Us",
      key: "about",
      icon: <InfoCircleOutlined spin />,
      onClick: () => navigate("/about"),
    },

    {
      label: "FAQ",
      key: "faq",
      icon: <MessageOutlined spin />,
      onClick: () => navigate("/review"),
    },
    {
      label: "Log Out",
      key: "logout",
      icon: <LogoutOutlined spin />,
      onClick: handleLogout,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextBase: "#ffffff",
          colorBgContainer: "transparent",
          colorBgBase: "transparent",
        },
      }}
    >
      <Sider className="sider" theme="dark">
        <AntMenu
          mode="inline"
          style={{ backgroundColor: "transparent", borderRight: "none" }}
        >
          {items.map((item, index) =>
            item ? (
              <AntMenu.Item
                key={item.key}
                icon={item.icon}
                onClick={item.onClick}
                style={{
                  fontSize: "18px",
                  color: "#ffffff",
                  margin: "10px 0",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {item.label}
              </AntMenu.Item>
            ) : (
              <div key={`spacer-${index}`} style={{ height: "20px" }} />
            )
          )}
        </AntMenu>
      </Sider>
    </ConfigProvider>
  );
};

export default Menu;
