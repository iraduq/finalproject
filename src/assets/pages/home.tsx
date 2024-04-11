import { useState } from "react";
import Background from "../constants/background/background.tsx";
import Footer from "../constants/footer/footer.tsx";
import Menu from "../constants/menu/menu.tsx";
import Header from "../constants/header/header.tsx";
import chessboardImage from "../images/chessboard.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../styles/home.css";

export function Mainpage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="mainpage-container">
      <Background />
      <Header />
      <div className="content-container">
        <div className="menu-button-container">
          <MenuButton onClick={toggleMenu} />
        </div>
        <div className="main-chessboard-table">
          <img
            src={chessboardImage}
            className="img-main-table"
            alt="Chessboard"
            draggable="false"
          />
        </div>
        {isMenuOpen && <MenuModal onClick={toggleMenu} />}
      </div>
      <Footer />
    </div>
  );
}

const MenuButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <FontAwesomeIcon icon={faBars} className="menu-icon" onClick={onClick} />
  );
};

const MenuModal = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="menu-modal" onClick={onClick}>
      <Menu />
    </div>
  );
};

export default Mainpage;
