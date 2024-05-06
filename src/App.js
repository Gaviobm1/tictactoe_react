import { useState } from 'react';

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove , setCurrentMove] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [position, setPosition] = useState({r: 0, c: 0});
  const [positionHistory, setPositionHistory] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  function handlePlay(nextSquares, pos) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setPosition(pos);
    setPositionHistory([...positionHistory, position])
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === history.length - 1 && move !== 0) {
      description = `You are at move #${move} \(${position.r},${position.c}\)`
    } else if (move > 0) {
      description = `Go to move #${move} \(${positionHistory[move].r},${positionHistory[move].c}\)`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  function reverseList() {
    setReverse(!reverse);
  }

  function reverseMoves() {
    if (reverse) {
      return moves.reverse();
    }
    return moves;
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <button onClick={reverseList}>Sort Moves</button>
        <ul>
          {reverseMoves()}
        </ul>
      </div>  
    </div>
  )
}

function Square({ value, onSquareClick, isWinner, sequence, colrow }) {
  if (isWinner.includes(sequence)) {
    return <button className="square win" onClick={onSquareClick}>{value}</button>;
  }
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay}) {
  function getColRow(p) {
    const positions = []
    for (let i = 0; i < 9; i++) {
      if (i % 3 === 0) {
        for (let j = 0; j < 3; j++) {
          positions.push({r: i/3+1, c: j+1})
        }
      }
    }
    return positions[p];
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const colrow = getColRow(i);
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, colrow);
  }

  const isNull = (square) => square === null;
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner.symbol}`;
  } else if (!winner && !squares.some(isNull)) {
    status = 'It\'s a draw.'
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`
  }

  const checkWinner = () => {
    if (winner) {
      return winner.sqres;
    }
    return []
  }

  const makeBoard = () => {
    return squares.map((square, i) => {  
      if (i % 3 === 0) {
        return (
            <div className='board-row' key={i}>
              {Array(3).fill(null).map((item, j) => {
                return <Square value={squares[i + j]} onSquareClick={() => handleClick(i + j)} sequence={i + j} isWinner={checkWinner()} key={i + j} colrow={{col:j+1, row:i/3+1}}/>
              })}
            </div>
          )
        }  
      }
    )
  }

  return (
    <>
      <div className="status">{status}</div>
      {makeBoard()}
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {symbol: squares[a], sqres: lines[i]};
    }
  }
}
