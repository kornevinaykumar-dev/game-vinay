import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      const { key } = e;
      const currentDir = directionRef.current;
      
      if (key === 'ArrowUp' && currentDir.y !== 1) setDirection({ x: 0, y: -1 });
      if (key === 'ArrowDown' && currentDir.y !== -1) setDirection({ x: 0, y: 1 });
      if (key === 'ArrowLeft' && currentDir.x !== 1) setDirection({ x: -1, y: 0 });
      if (key === 'ArrowRight' && currentDir.x !== -1) setDirection({ x: 1, y: 0 });
      if (key === ' ') setIsPaused(p => !p);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setSpeed(s => Math.max(30, s - 2));
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, speed, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black glitch-border w-full max-w-lg">
      <div className="flex justify-between w-full mb-4 items-end border-b-2 border-cyan-500 pb-2">
        <h2 className="text-3xl font-bold text-fuchsia-500 tracking-widest">MODULE:SNAKE</h2>
        <div className="text-2xl text-cyan-400">DATA_YIELD: <span className="text-fuchsia-500">{score}</span></div>
      </div>

      <div 
        className="grid bg-black border-2 border-fuchsia-500 relative"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
          const isHead = snakeIndex === 0;
          const isBody = snakeIndex > 0;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                w-full h-full border border-cyan-900/30
                ${isHead ? 'bg-cyan-400' : ''}
                ${isBody ? 'bg-cyan-600' : ''}
                ${isFood ? 'bg-fuchsia-500 animate-pulse' : ''}
              `}
              style={isBody ? { opacity: 1 - (snakeIndex / snake.length) * 0.7 } : undefined}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-fuchsia-500">
            <div className="glitch-text text-5xl mb-4" data-text="FATAL_ERR">FATAL_ERR</div>
            <div className="text-2xl text-cyan-400 mb-8">FINAL_YIELD: {score}</div>
            <button 
              onClick={resetGame}
              className="btn-glitch px-8 py-3 text-xl"
            >
              [ REBOOT_SEQ ]
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 border-4 border-cyan-500">
            <div className="glitch-text text-4xl" data-text="EXEC_HALTED">EXEC_HALTED</div>
          </div>
        )}
      </div>

      <div className="flex gap-6 mt-8 w-full justify-center">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="btn-glitch px-6 py-2 text-xl"
        >
          {isPaused ? '[ RESUME ]' : '[ PAUSE ]'}
        </button>
        <button 
          onClick={resetGame}
          className="btn-glitch px-6 py-2 text-xl"
        >
          [ RESET ]
        </button>
      </div>
    </div>
  );
}
