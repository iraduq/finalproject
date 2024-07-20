import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPlay,
  faChess,
  faBook,
  faBalanceScale,
  faLock,
  faFileAlt,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__addr">
        <h1 className="footer__logo">Chess</h1>
        <h2>Contact</h2>
        <address>
          5534 Somewhere In The World <br />
        </address>
      </div>
      <ul className="footer__nav">
        <li className="nav__item">
          <h2 className="nav__title__second">
            <FontAwesomeIcon icon={faPlay} /> Media
          </h2>

          <ul className="nav__ul">
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social-icon">
                  <FontAwesomeIcon icon={faInstagram} />
                  <span>Instagram</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social-icon">
                  <FontAwesomeIcon icon={faFacebook} />
                  <span>Facebook</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social-icon">
                  <FontAwesomeIcon icon={faDiscord} />
                  <span>Discord</span>
                </div>
              </a>
            </li>
          </ul>
        </li>
        <li className="nav__item nav__item--extra">
          <h2 className="nav__title">
            <FontAwesomeIcon icon={faBook} /> Tutorials
          </h2>

          <ul className="nav__ul nav__ul--extra">
            <li>
              <a
                href="https://www.chess.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social-icon">
                  <FontAwesomeIcon icon={faChess} />
                  <span>Chess.com</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://chess24.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social-icon">
                  <FontAwesomeIcon icon={faChess} />
                  <span>Chess24</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://lichess.org/learn#/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social-icon">
                  <FontAwesomeIcon icon={faChess} />
                  <span>Lichess</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://saintlouischessclub.org/education/private-lessons"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="social-icon">
                  <FontAwesomeIcon icon={faChess} />
                  <span>The Saint Louis</span>
                </div>
              </a>
            </li>
          </ul>
        </li>
        <li className="nav__item">
          <h2 className="nav__title__second">
            <FontAwesomeIcon icon={faBalanceScale} /> Legal
          </h2>

          <ul className="nav__ul">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="legal-icon">
                  <FontAwesomeIcon icon={faLock} />
                  <span>Privacy Policy</span>
                </div>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="legal-icon">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>Terms and Conditions</span>
                </div>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="legal-icon">
                  <FontAwesomeIcon icon={faFile} />
                  <span>Copyright</span>
                </div>
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <div className="legal">
        <p>&copy; 2024 Techy Pythons. All rights reserved.</p>
        <div className="legal__links">
          <span>
            Made by Techy Pythons <span className="heart">♥</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
