/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function Square({ value, squareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? "winning-square" : "lose-square"}`} onClick={squareClick}>
      {value}
    </button>
  );
}

function PlayGame({ onStart, onRestart }) {
  return (
    <div className="playGame">
      <button className="startGame" onClick={onStart}>
        Start
      </button>
      <button className="restartGame" onClick={onRestart}>
        Restart
      </button>
    </div>
  );
}

function ScoreGame({ scorePlayer1, scorePlayer2 }) {
  return (
    <div className="scoreGame">
      <div className="player1">
        Player 1 <hr />
        {scorePlayer1}
      </div>
      <div className="player2">
        Player 2 <hr />
        {scorePlayer2}
      </div>
    </div>
  );
}

function Board() {
  const [squares, setSquaress] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scorePlayer1, setScorePlayer1] = useState(0);
  const [scorePlayer2, setScorePlayer2] = useState(0);

  useEffect(() => {
    const saveScorePlayer1 = localStorage.getItem("scorePlayer1");
    const saveScorePlayer2 = localStorage.getItem("scorePlayer2");

    if (saveScorePlayer1) setScorePlayer1(Number(saveScorePlayer1));
    if (saveScorePlayer2) setScorePlayer2(Number(saveScorePlayer2));
  }, []);

  useEffect(() => {
    localStorage.setItem("scorePlayer1", scorePlayer1);
    localStorage.setItem("scorePlayer2", scorePlayer2);
  }, [scorePlayer1, scorePlayer2]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext === true) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    setSquaress(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleStart() {
    setSquaress(Array(9).fill(null));
    setXIsNext(true);
  }

  function handleRestart() {
    handleStart(); // Reset the board
    setScorePlayer1(0); // Reset scores
    setScorePlayer2(0);
    localStorage.removeItem("scorePlayer1");
    localStorage.removeItem("scorePlayer2");
  }

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winLine = result?.winLine || [];

  useEffect(() => {
    if (winner) {
      if (winner === "X") {
        setScorePlayer1((prev) => prev + 1);
      } else if (winner === "O") {
        setScorePlayer2((prev) => prev + 1);
      }
    }
  }, [winner]);

  let status = "";
  if (winner) {
    status = "Winner : " + winner;
  } else {
    status = "Player " + (xIsNext ? "1" : "2") + " to move : " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="container">
        <h1>Tic-Tac-Toe</h1>
        <PlayGame onStart={handleStart} onRestart={handleRestart} />
        <div className="status">{status}</div>
        <div className="board">
          <Square value={squares[0]} squareClick={() => handleClick(0)} isWinningSquare={winLine.includes(0)} />
          <Square value={squares[1]} squareClick={() => handleClick(1)} isWinningSquare={winLine.includes(1)} />
          <Square value={squares[2]} squareClick={() => handleClick(2)} isWinningSquare={winLine.includes(2)} />
          <Square value={squares[3]} squareClick={() => handleClick(3)} isWinningSquare={winLine.includes(3)} />
          <Square value={squares[4]} squareClick={() => handleClick(4)} isWinningSquare={winLine.includes(4)} />
          <Square value={squares[5]} squareClick={() => handleClick(5)} isWinningSquare={winLine.includes(5)} />
          <Square value={squares[6]} squareClick={() => handleClick(6)} isWinningSquare={winLine.includes(6)} />
          <Square value={squares[7]} squareClick={() => handleClick(7)} isWinningSquare={winLine.includes(7)} />
          <Square value={squares[8]} squareClick={() => handleClick(8)} isWinningSquare={winLine.includes(8)} />
        </div>
        <ScoreGame scorePlayer1={scorePlayer1} scorePlayer2={scorePlayer2} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [0, 3, 6],
    [3, 4, 5],
    [1, 4, 7],
    [6, 7, 8],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winLine: [a, b, c] };
    }
  }
  return null;
}

export default Board;
