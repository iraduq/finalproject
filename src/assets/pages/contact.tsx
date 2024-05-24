import React, { useEffect } from "react";
import emailjs from "emailjs-com";
import Background from "../constants/background/background";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faHouse,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Typed from "typed.js";
import "../styles/contact.css";

const ContactForm: React.FC = () => {
  useEffect(() => {
    const messages = [
      "We're thrilled to hear from you! Please send us a message with your inquiries, suggestions, or feedback. Our team is here to assist you in any way we can.",
      "Fill out the form below with your information and we'll get back to you.",
      "Thank you for your interest and for being a part of our community!",
      "We'd love to hear from you!",
    ];

    const typed = new Typed("#typed-message", {
      strings: messages,
      typeSpeed: 50,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      message: { value: string };
    };

    const playerName = target.name.value;
    const playerEmail = target.email.value;
    const playerMessage = target.message.value;

    const emailData = {
      player_name: playerName,
      player_message: playerMessage,
      player_email: playerEmail,
    };

    emailjs
      .send(
        "service_yzs1bn4",
        "template_51am4po",
        emailData,
        "TPTojqt9HG5FpSSaJ"
      )
      .then((result) => {
        console.log("Email sent successfully:", result.text);
        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.innerText = "Success ✅";
        }
      })
      .catch((error) => {
        console.error("Email send failed:", error.text);
        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.innerText = "Error";
        } else {
          console.error("Status element not found.");
        }
      });

    e.currentTarget.reset();
  };

  return (
    <div className="contact-div">
      <div className="header-online">
        <Link to="/main">
          <FontAwesomeIcon icon={faHouse} />
          <span className="icon-spacing">HOME</span>
        </Link>
      </div>
      <div className="typed-message" id="typed-message"></div>
      <div className="row">
        <form
          id="form"
          className="container-container-form"
          onSubmit={handleSubmit}
        >
          <h3>
            <FontAwesomeIcon icon={faEnvelope} /> CONTACT
          </h3>
          <input
            className="input-field"
            type="text"
            placeholder="&#xf0c0; Name"
            name="name"
          />
          <Background></Background>

          <input
            className="input-field"
            type="text"
            placeholder="&#xf0e0; Email"
            name="email"
          />
          <textarea
            className="input-field textarea-field"
            placeholder="&#x1F5E8; Message"
            name="message"
          ></textarea>

          <button className="submit-button" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </button>
        </form>

        <div className="direct-contact-container">
          <ul className="contact-list">
            <li className="list-item">
              <i className="fa fa-map-marker fa-2x"></i>
              <span className="contact-text place">Suceava</span>
            </li>
            <li className="list-item">
              <i className="fa fa-phone fa-2x"></i>
              <span className="contact-text phone">
                <a href="tel:1-212-555-5555" title="Give me a call">
                  0747043190
                </a>
              </span>
            </li>
            <li className="list-item">
              <i className="fa fa-envelope fa-2x"></i>
              <span className="contact-text gmail">
                <a href="mailto:#" title="Send me an email">
                  chess.ro
                </a>
              </span>
            </li>
          </ul>
          <hr />
          <ul className="social-media-list">
            <li>
              <a href="#" target="_blank" className="contact-icon">
                <i className="fa fa-github" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" className="contact-icon">
                <i className="fa fa-codepen" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" className="contact-icon">
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" className="contact-icon">
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
          <hr />
          <div className="copyright">&copy; ALL RIGHTS RESERVED</div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
