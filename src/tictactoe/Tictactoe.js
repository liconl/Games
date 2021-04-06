import React, { useState } from "react";
import "./Tictactoe.css";

const TicTacToe = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);
  const xO = xIsNext ? "X" : "O";

  const handleClick = (i) => {
    const historyPoint = history.slice(0, stepNumber + 1);
    const current = historyPoint[stepNumber];
    const squares = [...current];
    // return if won or occupied
    if (winner || squares[i]) return;
    // select square
    squares[i] = xO;
    setHistory([...historyPoint, squares]);
    setStepNumber(historyPoint.length);
    setXisNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXisNext(step % 2 === 0);
  };

  const Square = ({ value, onClick }) => {
    const style = value ? `squares ${value}` : `squares`;

    return (
      <button className={style} onClick={onClick}>
        {value}
      </button>
    );
  };
  const Board = ({ squares, onClick }) => (
    <div className="board">
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={() => onClick(i)} />
      ))}
    </div>
  );

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };
  const winner = calculateWinner(history[stepNumber]);

  const renderMoves = () =>
    history.map((_step, move) => {
      const destination = move ? `Go to move #${move}` : "New Game";
      return (
        <li key={move}>
          <button onClick={() => jumpTo(0)}>{destination}</button>
        </li>
      );
    });

  const newgameHandler = () => {
    jumpTo(0);
  };

  return (
    <div className="tictactoe">
      <h3 className="header_text">
        {winner ? "Winner: " + winner : "Next Player: " + xO}
      </h3>
      <Board squares={history[stepNumber]} onClick={handleClick} />

      <button className="newgame-btn" onClick={newgameHandler}>
        New Game
      </button>
    </div>
  );
};

export default TicTacToe;
