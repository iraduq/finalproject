import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faQuestionCircle,
  faPlay,
  faDumbbell,
  faEnvelope,
  faInfoCircle,
  faComment,
  faTrophy,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./menu.css";

const Menu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav className="menu">
      <div className="menu-left">
        <a href="/online" className="left-item-second">
          <FontAwesomeIcon icon={faPlay} className="icon" />
          Play
        </a>
        <a href="/train" className="left-item-third">
          <FontAwesomeIcon icon={faDumbbell} className="icon" /> Train
        </a>
        <a href="" className="left-item">
          <FontAwesomeIcon icon={faUserGroup} className="icon" />
          Social
        </a>
        <a href="" className="left-item">
          <FontAwesomeIcon icon={faTrophy} className="icon" />
          Achivs
        </a>
        <a href="/tutorial" className="left-item">
          <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
          Learn
        </a>
        <a href="/contact" className="left-item">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          Contact
        </a>

        <a href="/about" className="left-item">
          <FontAwesomeIcon icon={faInfoCircle} className="icon" />
          About Us
        </a>

        <a href="/review" className="left-item">
          <FontAwesomeIcon icon={faComment} className="icon" />
          FAQ
        </a>

        <a href="" className="log-out-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          Log out
        </a>
      </div>
    </nav>
  );
};

export default Menu;
