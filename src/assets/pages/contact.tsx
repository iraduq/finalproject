import React, { useEffect } from "react";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Background from "../constants/background/background.tsx";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faCodepen,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Typed from "typed.js";
import { Form, Input, Button, Typography, Row, Col, Divider, Card } from "antd";
import "../styles/contact.css";
import Swal from "sweetalert2";

const { Title } = Typography;

const ContactForm: React.FC = () => {
  useEffect(() => {
    const messages = [
      "We're thrilled to hear from you! Please send us a message!",
      "Fill out the form below with your information. ",
      "Thank you for your interest and for being a part of our community!",
      "We'd love to hear from you!",
    ];

    const typed = new Typed("#typed-message", {
      strings: messages,
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 1000,
      loop: true,
      showCursor: false,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const handleSubmit = (values: {
    name: string;
    email: string;
    message: string;
  }) => {
    const emailData = {
      player_name: values.name,
      player_message: values.message,
      player_email: values.email,
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
      <Background></Background>
      <div className="typed-message" id="typed-message"></div>
      <div className="contact-content">
        <Row justify="center" className="contact-row">
          <Col xs={24} md={16} lg={12}>
            <Card className="contact-card">
              <Title level={3} className="contact-title">
                <FontAwesomeIcon icon={faEnvelope} /> CONTACT
              </Title>
              <Form
                id="form"
                onFinish={handleSubmit}
                layout="vertical"
                className="contact-form"
              >
                <Form.Item
                  name="name"
                  label={<span style={{ fontWeight: 600 }}>Name</span>}
                  rules={[
                    { required: true, message: "Please enter your name!" },
                  ]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span style={{ fontWeight: 600 }}>Email</span>}
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
                  name="message"
                  label={<span style={{ fontWeight: 600 }}>Message</span>}
                  rules={[
                    { required: true, message: "Please enter your message!" },
                  ]}
                >
                  <Input.TextArea placeholder="Enter your message" rows={4} />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-button"
                    size="large"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} /> Send
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row justify="center">
          <Col xs={24} md={16} lg={12}>
            <div className="contact-info">
              <Divider />

              <ul className="social-media-list">
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon"
                  >
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon"
                  >
                    <FontAwesomeIcon icon={faCodepen} size="2x" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon"
                  >
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-icon"
                  >
                    <FontAwesomeIcon icon={faInstagram} size="2x" />
                  </a>
                </li>
              </ul>

              <Divider />

              <div className="copyright">&copy; ALL RIGHTS RESERVED</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactForm;
