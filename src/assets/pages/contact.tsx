import React from "react";
import emailjs from "emailjs-com";
import Background from "../constants/background/background";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "../styles/contact.css";

const ContactForm: React.FC = () => {
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

    console.log("Player Name:", playerName);
    console.log("Player Email:", playerEmail);
    console.log("Player Message:", playerMessage);

    const emailData = {
      player_name: playerName,
      player_message: playerMessage,
      player_email: playerEmail,
    };

    console.log("Email Data:", emailData);

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
    <form
      id="form"
      className="container-container-form"
      onSubmit={handleSubmit}
    >
      <Background></Background>
      <Background></Background>
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
      <input
        className="input-field"
        type="text"
        placeholder="&#xf0f6; Message"
        name="message"
      />

      <button className="submit-button" type="submit">
        <FontAwesomeIcon icon={faPaperPlane} /> Send
      </button>
    </form>
  );
};

export default ContactForm;
