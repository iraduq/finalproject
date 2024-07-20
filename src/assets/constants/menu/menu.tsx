import React from "react";
import { Layout, Menu as AntMenu, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LogoutOutlined,
  QuestionCircleOutlined,
  PlayCircleOutlined,
  MailOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./menu.css";

const { Sider } = Layout;
const { SubMenu } = AntMenu;

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const items = [
    {
      label: "Play",
      key: "play",
      icon: <PlayCircleOutlined />,
      children: [
        {
          label: "Play Online",
          key: "play_online",
          icon: <PlayCircleOutlined />,
          onClick: () => navigate("/online"),
        },
        {
          label: "Play vs Bot",
          key: "play_bot",
          icon: <BellOutlined />,
          onClick: () => navigate("/train"),
        },
        {
          label: "Puzzle",
          key: "puzzle",
          icon: <TrophyOutlined />,
          onClick: () => navigate("/puzzle"),
        },
      ],
    },

    {
      label: "Learn",
      key: "learn",
      icon: <QuestionCircleOutlined />,
      onClick: () => navigate("/tutorial"),
    },
    {
      label: "Profile",
      key: "profile",
      icon: <TeamOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Contact",
      key: "contact",
      icon: <MailOutlined />,
      onClick: () => navigate("/contact"),
    },
    {
      label: "About Us",
      key: "about",
      icon: <InfoCircleOutlined />,
      onClick: () => navigate("/about"),
    },

    {
      label: "Log Out",
      key: "logout",
      icon: <LogoutOutlined />,
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
          {items.map((item) =>
            item.children ? (
              <SubMenu
                key={item.key}
                title={item.label}
                icon={item.icon}
                className="submenu-right"
                popupClassName="submenu-popup"
                style={{
                  fontSize: "18px",
                  color: "#ffffff",
                  margin: "10px 0",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {item.children.map((child) => (
                  <AntMenu.Item
                    key={child.key}
                    icon={child.icon}
                    onClick={child.onClick}
                    style={{
                      fontSize: "16px",
                      color: "#ffffff",
                      margin: "10px 0",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    {child.label}
                  </AntMenu.Item>
                ))}
              </SubMenu>
            ) : (
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
            )
          )}
        </AntMenu>
      </Sider>
    </ConfigProvider>
  );
};

export default Menu;
