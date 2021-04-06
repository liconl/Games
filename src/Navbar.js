import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const style = {
    textDecoration: "none",
  };

  return (
    <div className="navbar">
      <Link to="/tictactoe" style={style}>
        <div>Tic Tac Toe</div>
      </Link>
      <Link to="/colorgame" style={style}>
        <div>Color Game</div>
      </Link>
      <Link to="/snake" style={style}>
        <div>Snake</div>
      </Link>
    </div>
  );
}

export default Navbar;
