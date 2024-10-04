import Background from "../constants/background/background";
import Menu from "../constants/menu/menu";
import "../styles/tutorial.css";

const Tutorial = () => {
  return (
    <div className="container-learn">
      <div className="menu-learn">
        <Menu />
      </div>
      <div className="content-learn">
        <Background />
        <div className="header-online"></div>
        <h1>Chess Piece Overview</h1>
        <div className="boxes">
          <div className="box">
            <p className="icon">&#x265A;</p>
            <h2>The King</h2>
            <p className="piece-count">1 piece</p>
            <p>
              The King can move just one square at a time in any direction. It
              should be defended at all times by the other pieces as once
              checkmated the game is lost.
            </p>
          </div>
          <div className="box">
            <p className="icon">&#x265B;</p>
            <h2>The Queen</h2>
            <p className="piece-count">1 piece</p>
            <p>
              The most powerful piece on the board, the Queen can move any
              number of squares in straight lines or on the diagonal until
              obstructed by another piece.
            </p>
          </div>
          <div className="box">
            <p className="icon">&#x265C;</p>
            <h2>The Rook</h2>
            <p className="piece-count">2 pieces</p>
            <p>
              After the Queen the Rook is the next most powerful piece on the
              board. It can move any number of squares in a straight line until
              obstructed by another piece.
            </p>
          </div>
        </div>
        <div className="boxes">
          <div className="box">
            <p className="icon">&#x265D;</p>
            <h2>The Bishop</h2>
            <p className="piece-count">2 pieces</p>
            <p>
              The Bishop can move any number of squares on the diagonal until
              obstructed by another piece. Each Bishop will always occupy
              squares of the same colour as its starting square.
            </p>
          </div>
          <div className="box">
            <p className="icon">&#x265E;</p>
            <h2>The Knight</h2>
            <p className="piece-count">2 pieces</p>
            <p>
              The Knight can move to any of the eight squares of the opposite
              colour to the one on which it stands that are either two ranks or
              two files away. Its move is not obstructed by other pieces.
            </p>
          </div>
          <div className="box">
            <p className="icon">&#x265F;</p>
            <h2>The Pawn</h2>
            <p className="piece-count">8 pieces</p>
            <p>
              Considered the weakest piece on the board the Pawn can only move
              forward one square at a time on the same file, except for its
              first move when it can move two squares forward. On reaching the
              eighth rank a Pawn can be promoted to the value of any other
              piece.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
