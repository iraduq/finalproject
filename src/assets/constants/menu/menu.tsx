import React, { useEffect, useState } from "react";
import { Layout, Menu as AntMenu, ConfigProvider, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChess,
  faBook,
  faUser,
  faEnvelope,
  faInfoCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./menu.css";

const { Sider } = Layout;
const { SubMenu } = AntMenu;

const Menu: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const commonItemStyle = {
    fontSize: "16px",
    color: "#ffffff",
    borderRadius: "50px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  const iconStyle = { color: "#333" };

  const items = [
    {
      label: "Play",
      key: "play",
      icon: <FontAwesomeIcon icon={faChess} style={iconStyle} />,
      children: [
        {
          label: "Online",
          key: "play_online",
          icon: <FontAwesomeIcon icon={faChess} style={iconStyle} />,
          onClick: () => navigate("/online"),
        },
        {
          label: "Play vs Bot",
          key: "play_bot",
          icon: <FontAwesomeIcon icon={faChess} style={iconStyle} />,
          onClick: () => navigate("/train"),
        },
        {
          label: "Puzzle",
          key: "puzzle",
          icon: <FontAwesomeIcon icon={faChess} style={iconStyle} />,
          onClick: () => navigate("/puzzle"),
        },
      ],
    },
    {
      label: "Learn",
      key: "learn",
      icon: <FontAwesomeIcon icon={faBook} style={iconStyle} />,
      onClick: () => navigate("/tutorial"),
    },
    {
      label: "Profile",
      key: "profile",
      icon: <FontAwesomeIcon icon={faUser} style={iconStyle} />,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Contact",
      key: "contact",
      icon: <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />,
      onClick: () => navigate("/contact"),
    },
    {
      label: "About Us",
      key: "about",
      icon: <FontAwesomeIcon icon={faInfoCircle} style={iconStyle} />,
      onClick: () => navigate("/about"),
    },
    {
      label: "Log Out",
      key: "logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} style={iconStyle} />,
      onClick: handleLogout,
    },
  ];

  const theme = {
    token: {
      colorPrimary: "#1890ff",
      colorTextBase: "#ffffff",
      colorBgContainer: "#111",
      colorBgBase: "#222",
      colorTextSecondary: "#ccc",
    },
    components: {
      Menu: {
        itemSelectedBg: "transparent",
        itemHoverBg: "transparent",
        submenuBg: "transparent",
      },
      Layout: {
        colorBgContainer: "#111",
      },
    },
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch("http://192.168.0.248:8000/profile/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`HTTP error! Status: ${response.status}`, errorData);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const base64Image = data.Base64;

        if (base64Image) {
          setProfileImage(`data:image/png;base64,${base64Image}`);
        } else {
          console.error("Profile image data is missing");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [token]);

  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          className={`sider ${collapsed ? "collapsed" : ""} custom-sider`}
          collapsible
          collapsed={collapsed}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          breakpoint="lg"
          collapsedWidth="0"
          width={180}
          theme="dark"
          style={{
            transition: "all 0.2s",
            background: "#111",
            backgroundColor: "#111",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "start",
              height: "100vh",
              paddingTop: "16px",
            }}
          >
            {!collapsed && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <img
                    src="src/assets/images/loggo.png"
                    alt="Logo"
                    style={{
                      width: "20px",
                      height: "30px",
                      marginRight: "8px",
                    }}
                  />
                  <span style={{ color: "#fff", fontSize: "24px" }}>CHESS</span>
                </div>
                <div className="avatar-container">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      style={{
                        width: "95px",
                        height: "95px",
                        borderRadius: "10px",
                        border: "2px solid #fff",
                        marginBottom: "16px",
                      }}
                    />
                  ) : (
                    <Avatar
                      size={100}
                      style={{
                        backgroundColor: "#222",
                        color: "#fff",
                        borderRadius: "0",
                        marginBottom: "16px",
                      }}
                    />
                  )}
                </div>
              </>
            )}
            <AntMenu
              mode="inline"
              style={{
                backgroundColor: "transparent",
                borderRight: "none",
                flexGrow: 1,
              }}
            >
              {items.map((item) =>
                item.children ? (
                  <SubMenu
                    key={item.key}
                    title={item.label}
                    icon={item.icon}
                    className="submenu-right"
                    popupClassName="submenu-popup"
                    style={commonItemStyle}
                  >
                    {item.children.map((child) => (
                      <AntMenu.Item
                        className="iteme"
                        key={child.key}
                        icon={child.icon}
                        onClick={child.onClick}
                        style={commonItemStyle}
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
                    style={commonItemStyle}
                  >
                    {item.label}
                  </AntMenu.Item>
                )
              )}
            </AntMenu>
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 0 : 0 }}></Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Menu;
