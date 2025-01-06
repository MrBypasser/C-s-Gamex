import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [grid, setGrid] = useState(createGrid(20));
  const [snake, setSnake] = useState([[10, 10]]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(generateFood(20));
  const [score, setScore] = useState(0);

  const handleKeyPress = (e) => {
    const { key } = e;
    if (key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
    if (key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
    if (key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
    if (key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
  };

  useEffect(() => {
    if (currentPage === 'game') {
      const interval = setInterval(moveSnake, 200 - Math.min(score * 5, 150));
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        clearInterval(interval);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [snake, direction, currentPage]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = [...newSnake[newSnake.length - 1]];
    if (direction === 'UP') head[0]--;
    if (direction === 'DOWN') head[0]++;
    if (direction === 'LEFT') head[1]--;
    if (direction === 'RIGHT') head[1]++;
    newSnake.push(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(score + 1);
      setFood(generateFood(20));
    } else {
      newSnake.shift();
    }

    if (
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= 20 ||
      head[1] >= 20 ||
      newSnake.slice(0, -1).some(([x, y]) => x === head[0] && y === head[1])
    ) {
      alert('Game Over! Your score: ' + score);
      setSnake([[10, 10]]);
      setDirection('RIGHT');
      setScore(0);
      setFood(generateFood(20));
      setCurrentPage('home');
      return;
    }
    setSnake(newSnake);
  };

  const renderGrid = () =>
    grid.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className={`cell ${
              snake.some(([x, y]) => x === rowIndex && y === cellIndex)
                ? 'snake'
                : food[0] === rowIndex && food[1] === cellIndex
                ? 'food'
                : ''
            }`}
          />
        ))}
      </div>
    ));

  return (
    <div style={styles.container}>
      {currentPage === 'home' && (
        <div style={styles.home}>
          <h1 style={styles.title}>Welcome to C's Classic Gamex</h1>
          <button style={styles.button} onClick={() => setCurrentPage('game')}>
            Play Snake
          </button>
          <p>Use arrow keys to control the snake. Eat food to score points!</p>
        </div>
      )}
      {currentPage === 'game' && (
        <div style={styles.game}>
          <h1 style={styles.title}>Snake Game</h1>
          <p style={styles.score}>Score: {score}</p>
          <div style={styles.grid}>{renderGrid()}</div>
        </div>
      )}
    </div>
  );
};

const createGrid = (size) => Array.from({ length: size }, () => Array(size).fill(0));

const generateFood = (size) => [
  Math.floor(Math.random() * size),
  Math.floor(Math.random() * size),
];

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#282c34',
    color: 'white',
    textAlign: 'center',
    height: '100vh',
    margin: 0,
  },
  home: { marginTop: 20 },
  game: { marginTop: 20 },
  title: { fontSize: '2rem', margin: '10px 0' },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: 'limegreen',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  buttonHover: { backgroundColor: 'green' },
  score: { fontSize: '1.2rem', margin: '10px 0' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(20, 20px)',
    gridGap: '1px',
    justifyContent: 'center',
    margin: '0 auto',
  },
  row: { display: 'flex' },
  cell: {
    width: '20px',
    height: '20px',
    backgroundColor: '#444',
  },
  snake: { backgroundColor: 'lime' },
  food: { backgroundColor: 'red' },
};

ReactDOM.render(<App />, document.getElementById('root'));
