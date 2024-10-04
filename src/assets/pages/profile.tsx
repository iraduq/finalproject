import React, { useState, useRef, RefObject, useEffect } from "react";
import {
  Layout,
  Typography,
  Avatar,
  Divider,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Progress,
  Statistic,
  Table,
  ConfigProvider,
  Upload,
  Spin,
} from "antd";

import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  ProfileOutlined,
  PieChartOutlined,
  LoadingOutlined,
  TableOutlined,
  HomeOutlined,
  BellOutlined,
  MessageOutlined,
  TrophyOutlined,
  StepForwardOutlined,
  SmileOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import "./profile.css";
import { Menu } from "antd";
import Background from "../constants/background/background";
import { UploadChangeParam } from "antd/es/upload";
import CONFIG from "../../config";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Switch } from "antd";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

interface AchievementProps {
  title: React.ReactNode;
  description: React.ReactNode;
  percent: number;
  isNew?: boolean;
  isPuzzle?: boolean;
  icon: React.ReactNode | string;
}

const Achievement: React.FC<AchievementProps> = ({
  title,
  description,
  percent,
  isNew = false,
  isPuzzle = false,
  icon,
}) => (
  <div
    style={{
      margin: "10px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        justifyContent: "center",
      }}
    >
      <Avatar
        size={32}
        src={typeof icon === "string" ? icon : undefined}
        icon={typeof icon !== "string" ? icon : undefined}
        style={{ marginRight: "5px" }}
        shape="square"
      />
      <div style={{ display: "inline-block" }}>
        <Text style={{ color: "white" }}>{title}: </Text>
        <Text style={{ color: "white" }}>{description}</Text>
        {isNew && <Text type="success"> (New)</Text>}
      </div>
    </div>
    <div style={{ width: "50%", margin: "auto" }}>
      <Progress percent={percent} size="small" />
    </div>
    {isPuzzle && (
      <Text type="secondary" style={{ fontSize: "5px" }}>
        (Play Puzzle {description})
      </Text>
    )}
  </div>
);

interface RefsType {
  profileRef: RefObject<HTMLDivElement>;
  achievementsRef: RefObject<HTMLDivElement>;
  statisticsRef: RefObject<HTMLDivElement>;
  matchHistoryRef: RefObject<HTMLDivElement>;
}

const SideNav: React.FC<{ refs: RefsType }> = ({ refs }) => {
  const scrollToRef = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const menuItems = [
    {
      key: "0",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "2",
      icon: <BellOutlined />,
      label: "Notifications",
    },
    {
      key: "3",
      icon: <MessageOutlined />,
      label: "Messages",
    },
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Profile",
      children: [
        {
          key: "4",
          icon: <ProfileOutlined />,
          label: "Edit Profile",
          onClick: () => scrollToRef(refs.profileRef),
        },
      ],
    },
    {
      key: "sub2",
      icon: <TrophyOutlined />,
      label: "Achievements",
      children: [
        {
          key: "6",
          label: "View Achievements",
          onClick: () => scrollToRef(refs.achievementsRef),
        },
      ],
    },
    {
      key: "8",
      icon: <PieChartOutlined />,
      label: "Statistics",
      onClick: () => scrollToRef(refs.statisticsRef),
    },
    {
      key: "9",
      icon: <TableOutlined />,
      label: "Match History",
      onClick: () => scrollToRef(refs.matchHistoryRef),
    },
    {
      key: "10",
      icon: <Switch />,
      label: "Two Factor Auth",
      onClick: () => scrollToRef(refs.matchHistoryRef),
    },
  ];

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/profile/get`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const base64Image = data.Base64;
          setProfileImage(base64Image);
        } else {
          throw new Error("Failed to fetch profile image");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImage();
  }, []);

  return (
    <Sider
      width={250}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "auto",
        zIndex: 1,
        background: "#111",
        borderRight: "3px solid grey",
      }}
    >
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Avatar
          size={64}
          src={
            profileImage ? `data:image/jpeg;base64,${profileImage}` : undefined
          }
          icon={
            !profileImage ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : undefined
          }
          style={{ marginBottom: "10px", backgroundColor: "#071228" }}
        />
        <Title level={4} style={{ color: "white" }}></Title>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["0"]}
        style={{ borderRight: 0, background: "#111" }}
        theme="dark"
        items={menuItems.map((item) =>
          item.children
            ? {
                ...item,
                children: item.children.map((child) => ({
                  ...child,
                  className: "menu-item-children",
                })),
              }
            : item
        )}
      />
    </Sider>
  );
};

const ChessStatistics = () => (
  <div className="chess-statistics-container">
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={12} md={8} lg={6}>
        <Statistic
          title={
            <span style={{ color: "white", fontFamily: "Poppins" }}>
              Games Played
            </span>
          }
          value={23578}
          prefix={<TrophyOutlined style={{ color: "orange" }} />}
          valueStyle={{ color: "orange" }}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Statistic
          title={
            <span style={{ color: "white", fontFamily: "Poppins" }}>
              Total Moves
            </span>
          }
          value={987654}
          prefix={<StepForwardOutlined style={{ color: "orange" }} />}
          valueStyle={{ color: "orange" }}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Statistic
          title={
            <span style={{ color: "white", fontFamily: "Poppins" }}>
              Games Won
            </span>
          }
          value={7890}
          prefix={<SmileOutlined style={{ color: "green" }} />}
          valueStyle={{ color: "green" }}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Statistic
          title={
            <span style={{ color: "white", fontFamily: "Poppins" }}>
              Games Lost
            </span>
          }
          value={1234}
          prefix={<FrownOutlined style={{ color: "red" }} />}
          valueStyle={{ color: "red" }}
        />
      </Col>
    </Row>
  </div>
);

const MatchHistory: React.FC = () => {
  const columns = [
    {
      title: "Opponent",
      dataIndex: "opponent",
      key: "opponent",
      render: (text: string) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (text: string) => (
        <span
          style={{
            color:
              text === "Win" ? "green" : text === "Loss" ? "red" : "yellow",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => <span style={{ color: "white" }}>{text}</span>,
    },
  ];

  const data = [
    {
      key: "1",
      opponent: "John Doe",
      result: "Win",
      date: "2023-04-15",
    },
    {
      key: "2",
      opponent: "Jane Smith",
      result: "Loss",
      date: "2023-04-16",
    },
    {
      key: "3",
      opponent: "Alice Johnson",
      result: "Draw",
      date: "2023-04-17",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
      style={{
        width: "100%",
        backgroundColor: "#222",
        boxShadow: "0 0 2px rgba(255, 255, 255, 0.32)",
      }}
    />
  );
};

const Profile: React.FC = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const statisticsRef = useRef<HTMLDivElement>(null);
  const matchHistoryRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token");
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    username: string | null;
    bio: string | null;
  }>({
    username: null,
    bio: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/profile/get`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const info = await response.json();
          setName(info.Username);
          setDescription(info.description);
          setUserProfile({
            username: info.Username,
            bio: info.Description,
          });
          setProfileLoaded(true);
        } else {
          throw new Error("Failed to fetch profile image");
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImage();
  }, [description, name]);

  const props = {
    name: "file",
    action: `${CONFIG.API_BASE_URL}/profile/upload`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onChange(info: UploadChangeParam) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    beforeUpload(file: File) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File must be smaller than 2MB!");
        return false;
      }
      return true;
    },
  };

  const refs = {
    profileRef,
    achievementsRef,
    statisticsRef,
    matchHistoryRef,
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async (values: {
    username: string;
    bio: string;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/profile/update_description`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newDescription: values.bio }),
        }
      );

      if (response.ok) {
        setUserProfile({
          username: name,
          bio: values.bio || null,
        });
        message.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile description:", error);
      message.error("Failed to update profile description");
    }
  };

  if (!profileLoaded) {
    return (
      <div className="waiting-message">
        <ScaleLoader loading={!profileLoaded} color="#999" />
        <p>Fetching profile data...</p>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#333",
          colorBgContainer: "#333",
        },
      }}
    >
      <Layout>
        <SideNav refs={refs} />
        <Content
          style={{
            marginLeft: 250,
            padding: "20px",
            overflow: "initial",
            background: "rgba(0, 0, 0, 0.91)",
            minHeight: "100vh",
          }}
        >
          <div style={{ padding: 24 }}>
            <div
              ref={profileRef}
              style={{
                padding: "20px",
                borderRadius: "10px",
                background: "#111",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Title level={2} style={{ color: "white" }}>
                Profile
              </Title>
              <Background></Background>
              {isEditing ? (
                <Form
                  form={form}
                  initialValues={userProfile}
                  onFinish={handleSaveProfile}
                  layout="vertical"
                >
                  <Avatar
                    size={64}
                    icon={
                      <Upload {...props}>
                        <UserOutlined />
                      </Upload>
                    }
                    style={{ marginBottom: "10px" }}
                  />

                  <Form.Item
                    label={<Text style={{ color: "white" }}>Bio</Text>}
                    name="bio"
                    rules={[
                      { required: true, message: "Please input your bio!" },
                    ]}
                  >
                    <Input.TextArea style={{ color: "white" }} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      <SaveOutlined /> Save
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleCancelEdit}
                      style={{ marginLeft: "10px" }}
                    >
                      <CloseOutlined /> Cancel
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <div>
                  <Text style={{ color: "white" }}>
                    <strong>Username:</strong> {userProfile.username}
                  </Text>
                  <br />
                  <Text style={{ color: "white" }}>
                    <strong>Bio:</strong> {userProfile.bio}
                  </Text>
                  <br />
                  <Button
                    type="primary"
                    onClick={handleEditProfile}
                    style={{ marginTop: "10px" }}
                  >
                    <EditOutlined /> Edit Profile
                  </Button>
                </div>
              )}
            </div>
            <Divider />
            <Background></Background>
            <div
              ref={statisticsRef}
              style={{
                padding: "20px",
                borderRadius: "10px",
                background: "#111",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Title level={2} style={{ color: "white" }}>
                Statistics
              </Title>
              <ChessStatistics />
            </div>
            <Divider />
            <div
              ref={achievementsRef}
              style={{
                padding: "20px",
                borderRadius: "10px",
                background: "#111",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Title level={3} style={{ textAlign: "center", color: "white" }}>
                Achievements
              </Title>{" "}
              <Background></Background>
              <div
                className="achievements-area"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <Achievement
                  title={<span style={{ color: "white" }}>Beginner</span>}
                  description={
                    <span style={{ color: "white" }}>
                      Make the first move in a game
                    </span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/acid-rain.png"
                />
                <Achievement
                  title={<span style={{ color: "white" }}>Conqueror</span>}
                  description={
                    <span style={{ color: "white" }}>Win the first game</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/alps.png"
                />
                <Achievement
                  title={<span style={{ color: "white" }}>Veteran</span>}
                  description={
                    <span style={{ color: "white" }}>Play 100 games</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/hot-springs.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Opening Master</span>}
                  description={
                    <span style={{ color: "white" }}>
                      Win a game in less than 10 moves
                    </span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/avalanche.png"
                />
                <Background></Background>
                <Achievement
                  title={
                    <span style={{ color: "white" }}>Rapid and Precise</span>
                  }
                  description={
                    <span style={{ color: "white" }}>
                      Win a game in less than 20 moves
                    </span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/cave.png"
                />
                <Achievement
                  title={<span style={{ color: "white" }}>Impenetrable</span>}
                  description={
                    <span style={{ color: "white" }}>
                      Don't lose any pieces in a game
                    </span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/creek.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Total Moves</span>}
                  description={
                    <span style={{ color: "white" }}>Total moves made: 30</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/iceberg.png"
                />

                <Background></Background>

                <Achievement
                  title={<span style={{ color: "white" }}>Games Won</span>}
                  description={
                    <span style={{ color: "white" }}>Total games won: 30</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/marine-polution.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Games Lost</span>}
                  description={
                    <span style={{ color: "white" }}>Games Lost: 30</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/waterfall.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Win Rate</span>}
                  description={
                    <span style={{ color: "white" }}>Last 15 matches</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/wildfire.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Welcome</span>}
                  description={
                    <span style={{ color: "white" }}>
                      Create your chess account
                    </span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/top-of-a-hill.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>First Daily!</span>}
                  description={
                    <span style={{ color: "white" }}>Play a daily puzzle</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/island-on-water.png"
                />

                <Background></Background>

                <Achievement
                  title={<span style={{ color: "white" }}>1st Game</span>}
                  description={
                    <span style={{ color: "white" }}>Play once</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/jungle.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Game 10</span>}
                  description={
                    <span style={{ color: "white" }}>Play 10 times</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/rainwater-catchment.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Game 100</span>}
                  description={
                    <span style={{ color: "white" }}>Play 100 times</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/desert-landscape.png"
                />

                <Achievement
                  title={<span style={{ color: "white" }}>Game 1000</span>}
                  description={
                    <span style={{ color: "white" }}>Play 1,000 times</span>
                  }
                  percent={100}
                  isNew={true}
                  icon="https://img.icons8.com/pulsar-color/48/biosand-filter.png"
                />
              </div>
            </div>
            <Divider />

            <div
              ref={matchHistoryRef}
              style={{
                padding: "20px",
                borderRadius: "10px",
                background: "#111",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Title level={2} style={{ color: "white" }}>
                Match History
              </Title>
              <MatchHistory />
            </div>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default Profile;
