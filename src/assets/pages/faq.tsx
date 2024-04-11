import { useEffect } from "react";
import Background from "../constants/background/background";
import { Link } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/faq.css";
const CustomerReview = () => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const toggle = (event.target as HTMLElement).closest(".faq-toggle");
      toggle && toggle.parentElement?.classList.toggle("active");
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div>
      <Background></Background>
      <Background></Background>
      <Background></Background>
      <div className="header-online">
        <Link to="/main">
          <FontAwesomeIcon icon={faHouse} />
          <span className="icon-spacing">HOME</span>
        </Link>
      </div>
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-container">
        <div className="faq active">
          <h3 className="faq-title">What are the benefits of playing chess?</h3>
          <p className="faq-text">
            Playing chess offers cognitive development, improved academic
            performance, enhanced creativity, stress relief, social interaction,
            boosted self-confidence, patience, and resilience, as well as
            promoting sportsmanship.
          </p>
          <button className="faq-toggle">
            <i className="fas fa-chevron-down"></i>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="faq">
          <h3 className="faq-title">How can I improve my chess skills?</h3>
          <p className="faq-text">
            You can improve your chess skills through training sessions where
            you play against a computer bot and by utilizing the tutorials
            available in the footer section. Playing against a computer bot
            allows you to practice your strategies and tactics in a controlled
            environment. Bots are available at various difficulty levels,
            allowing you to gradually increase the challenge as you progress. By
            analyzing your games against the bot, you can identify areas where
            you need improvement and work on strengthening your weaknesses.
            Additionally, the tutorials available in the footer section provide
            valuable resources for learning different aspects of chess. These
            tutorials cover a wide range of topics, including basic rules and
            tactics, advanced strategies, opening theory, and endgame
            techniques. By studying these tutorials, you can deepen your
            understanding of the game and develop your skills in specific areas.
            Combining regular practice sessions against a computer bot with
            studying tutorials will help you to improve your chess skills
            systematically and effectively. As you continue to dedicate time and
            effort to your training, you'll gradually see progress and
            advancement in your abilities as a chess player..
          </p>
          <button className="faq-toggle">
            <i className="fas fa-chevron-down"></i>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="faq">
          <h3 className="faq-title">
            How long does an average game of chess last?
          </h3>
          <p className="faq-text">
            The average duration of a chess game can vary depending on several
            factors such as the skill level of the players, the time control
            used, and the complexity of the position. Generally, a standard game
            of chess played at tournament level with a time control of around 90
            minutes for each player can last anywhere from 3 to 6 hours.
            However, rapid and blitz games, which have shorter time controls
            (e.g., 15 minutes per player or less), typically last between 30
            minutes to 2 hours. Additionally, casual games played without any
            time constraints can vary greatly in duration, ranging from a few
            minutes to several hours, depending on the pace of the players and
            the depth of analysis.
          </p>
          <button className="faq-toggle">
            <i className="fas fa-chevron-down"></i>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="faq">
          <h3 className="faq-title">
            How does the scoring system work in chess?
          </h3>
          <p className="faq-text">
            The scoring system in chess is relatively simple. In most chess
            tournaments and games, each player starts with a score of 0 points.
            During the game, if a player wins, they receive 1 point, while the
            losing player receives 0 points. In case of a draw, each player
            usually receives half a point. For example, in a typical tournament,
            a win earns a player 1 point, a draw earns them 0.5 points, and a
            loss earns them 0 points. The total score is then calculated by
            adding up the points earned from each game. In some tournaments or
            scoring systems, different point values may be assigned for wins,
            draws, or losses. However, the basic principle remains the same:
            players accumulate points based on the outcome of their games, with
            wins generally being worth more than draws, and draws worth more
            than losses.
          </p>
          <button className="faq-toggle">
            <i className="fas fa-chevron-down"></i>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="faq">
          <h3 className="faq-title"> Who is the greatest chess player?</h3>
          <p className="faq-text">
            Garry Kasparov - Kasparov dominated the chess world in the 1980s and
            1990s and is considered one of the greatest players of all time.
          </p>
          <button className="faq-toggle">
            <i className="fas fa-chevron-down"></i>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;
