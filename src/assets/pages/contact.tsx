import React, { useEffect, useRef } from "react";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Background from "../constants/background/background.tsx";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Input, Button, Typography, Row, Col, Card, Radio } from "antd";
import Swal from "sweetalert2";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../animations/contactAnimation.json";
import Typed from "typed.js";
import Menu from "../constants/menu/menu.tsx";
import "../styles/contact.css";

const { Title } = Typography;

const ContactForm: React.FC = () => {
  const typedElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typedElementRef.current) {
      const messages = [
        "We're thrilled to hear from you! ",
        "Fill out the form below",
        "We'd love to hear from you!",
      ];

      const typed = new Typed(typedElementRef.current, {
        strings: messages,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 1000,
        loop: true,
        showCursor: false,
        contentType: "html",
      });

      return () => {
        typed.destroy();
      };
    }
  }, []);

  const handleSubmit = (values: {
    name: string;
    email: string;
    phone: string;
    method: string;
    message: string;
  }) => {
    const emailData = {
      player_name: values.name,
      player_message: values.message,
      player_email: values.email,
      player_phone: values.phone,
      player_method: values.method,
    };

    emailjs
      .send(
        "service_yzs1bn4",
        "template_51am4po",
        emailData,
        "TPTojqt9HG5FpSSaJ"
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "Your message has been sent successfully.",
          confirmButtonText: "OK",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again later.",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <div className="contact-div">
      <div className="contact-menu">
        <Menu />
      </div>
      <Background />
      <div className="contact-content">
        <Row justify="center" className="contact-row">
          <Col xs={24} md={20} lg={16}>
            <Card className="contact-card">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Title level={3} className="contact-title">
                    Contact us
                  </Title>
                  <div className="contact-info">
                    <p>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="contact-icon"
                      />{" "}
                      <span>Number Not Set</span>
                    </p>
                    <p>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="contact-icon"
                      />{" "}
                      <span>chess.authinfo@gmail.com</span>
                    </p>
                    <p>
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="contact-icon"
                      />{" "}
                      <span>Suceava, Romania</span>
                    </p>
                  </div>
                  <Player
                    autoplay
                    loop
                    src={animationData}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <div ref={typedElementRef} className="typed-message"></div>
                  <Form
                    id="form"
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="contact-form"
                  >
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[
                        { required: true, message: "Please enter your name!" },
                      ]}
                    >
                      <Input placeholder="Enter your name" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your phone number!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>

                    <Form.Item
                      name="method"
                      label="Preferred method of communication"
                      rules={[
                        { required: true, message: "Please select a method!" },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value="Email">Email</Radio>
                        <Radio value="Phone">Phone</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      name="message"
                      label="Message"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your message!",
                        },
                      ]}
                    >
                      <Input.TextArea
                        placeholder="Enter your message"
                        rows={4}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="submit-button"
                        size="large"
                      >
                        Send
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactForm;
