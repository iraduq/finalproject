import React, { useEffect, useRef, useState } from "react";
import { Layout, Menu as AntMenu, ConfigProvider, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import "./menu.css";
import hoverSoundFile from "../sounds/selectSound.mp3";
import bookIcon from "./book.png";
import playIcon from "./play.png";
import aboutUsIcon from "./aboutUs.png";
import contactIcon from "./contact.png";
import profileIcon from "./profile.png";
import updateIcon from "./update.png";
import logOutIcon from "./logOut.png";
import CONFIG from "../../../config";

const { Sider } = Layout;

const Menu: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    hoverSoundRef.current = new Audio(hoverSoundFile);
    if (hoverSoundRef.current) {
      hoverSoundRef.current.volume = 0.3;
    }
  }, []);

  const handleMouseEnter = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.pause();
      hoverSoundRef.current.currentTime = 0;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const items = [
    {
      label: <span className="custom-menu-label">Play</span>,
      key: "play",
      icon: (
        <img
          src={playIcon}
          alt="Play Icon"
          style={{ width: "25px", height: "25px" }}
        />
      ),
      children: [
        {
          label: <span className="custom-menu-label">Online</span>,
          key: "play_online",
          icon: (
            <img
              src={playIcon}
              alt="Play Online"
              style={{ width: "25px", height: "25px" }}
            />
          ),
          onClick: () => navigate("/online"),
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        },
        {
          label: <span className="custom-menu-label">Play vs Bot</span>,
          key: "play_bot",
          icon: (
            <img
              src={playIcon}
              alt="Play vs Bot"
              style={{ width: "25px", height: "25px" }}
            />
          ),
          onClick: () => navigate("/train"),
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        },
        {
          label: <span className="custom-menu-label">Puzzle</span>,
          key: "puzzle",
          icon: (
            <img
              src={playIcon}
              alt="Play Puzzle"
              style={{ width: "25px", height: "25px" }}
            />
          ),
          onClick: () => navigate("/puzzle"),
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
        },
      ],
    },
    {
      label: <span className="custom-menu-label">Learn</span>,
      key: "learn",
      icon: (
        <img
          src={bookIcon}
          alt="Book Icon"
          style={{ width: "25px", height: "25px" }}
        />
      ),
      onClick: () => navigate("/tutorial"),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    {
      label: <span className="custom-menu-label">Profile</span>,
      key: "profile",
      icon: (
        <img
          src={profileIcon}
          alt="Profile Icon"
          style={{ width: "25px", height: "25px" }}
        />
      ),
      onClick: () => navigate("/profile"),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    {
      label: <span className="custom-menu-label">Contact</span>,
      key: "contact",
      icon: (
        <img
          src={contactIcon}
          alt="Contact Icon"
          style={{ width: "25px", height: "25px" }}
        />
      ),
      onClick: () => navigate("/contact"),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    {
      label: <span className="custom-menu-label">About us</span>,
      key: "about",
      icon: (
        <img
          src={aboutUsIcon}
          alt="About Us Icon"
          style={{ width: "25px", height: "25px" }}
        />
      ),
      onClick: () => navigate("/about"),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    {
      label: <span className="custom-menu-label">Update Log</span>,
      key: "update",
      icon: (
        <img
          src={updateIcon}
          alt="Update Icon"
          style={{ width: "25px", height: "25px" }}
        />
      ),
      onClick: () => navigate("/update"),
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    {
      label: <span className="custom-menu-label">Log Out</span>,
      key: "logout",
      icon: (
        <img
          src={logOutIcon}
          alt="Log Out Icon"
          style={{ width: "25px", height: "25px" }}
        />
      ),
      onClick: handleLogout,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
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
        itemHoverBg: "rgba(255, 255, 255, 0.1)",
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
        const response = await fetch(`${CONFIG.API_BASE_URL}/profile/get`, {
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
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: "2px solid #fff",
                        marginBottom: "16px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Avatar
                      size={100}
                      style={{
                        backgroundColor: "#222",
                        color: "#fff",
                        borderRadius: "20%",
                        marginBottom: "16px",
                        border: "2px solid #333",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        padding: "10px",
                      }}
                    />
                  )}
                </div>
              </>
            )}
            <AntMenu
              mode="inline"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              items={items}
              style={{
                backgroundColor: "transparent",
                borderRight: "none",
                flexGrow: 1,
              }}
            />
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 0 : 0 }}></Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Menu;
