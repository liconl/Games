import React, { useEffect, useState } from "react";
import {
  randomIntFromInterval,
  reverseLinkedList,
  useInterval,
} from "./utils.js";
import "./snake.css";
//images imports
import Rabbit from "./images/fast.png";
import Human from "./images/normal.png";
import Turle from "./images/slow.png";
import Food from "./images/food.png";
import Golden from "./images/golden.png";
import Posion from "./images/potion.png";

//disables arrow key/spacebar scrolling
window.addEventListener(
  "keydown",
  function (e) {
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault();
    }
  },
  false
);

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(value) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}

const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT",
};

const BOARD_SIZE = 15;
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD = 0.3;
const IMAGES_WIDTH = 40;
const IMAGES_HEIGHT = 40;

const getStartingSnakeLLValue = (board) => {
  const rowSize = board.length;
  const colSize = board[0].length;
  const startingRow = Math.round(rowSize / 3);
  const startingCol = Math.round(colSize / 3);
  const startingCell = board[startingRow][startingCol];
  return {
    row: startingRow,
    col: startingCol,
    cell: startingCell,
  };
};

const Snake = () => {
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [board, setBoard] = useState(createBoard(BOARD_SIZE));
  const [startgame, setStartgame] = useState(false);
  const [snake, setSnake] = useState(
    new LinkedList(getStartingSnakeLLValue(board))
  );
  const [snakeCells, setSnakeCells] = useState(
    new Set([snake.head.value.cell])
  );
  const snakeHeadCell = snake.head.value.cell;
  const snakeTailCell = snake.tail.value.cell;
  const [foodCell, setFoodCell] = useState(snake.head.value.cell + 3);
  const [goldenfoodCell, setgoldenFoodCell] = useState(snake.head.value.cell);
  const [timerslowCell, setTimerslowCell] = useState((snake.head.cell = 44));
  const [timerfastCell, setTimerfastCell] = useState((snake.head.cell = 200));
  const [timernormalCell, setTimernormalCell] = useState(
    (snake.head.cell = 174)
  );

  const [direction, setDirection] = useState(Direction.RIGHT);
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] = useState(
    false
  );
  console.log(goldenfoodCell);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      handleKeydown(e);
    });
  }, []);

  const [mouseSpeed, setmouseSpeed] = useState(150);
  useInterval(() => {
    moveSnake();
  }, mouseSpeed);

  const handleKeydown = (e) => {
    const newDirection = getDirectionFromKey(e.key);
    const isValidDirection = newDirection !== "";
    if (!isValidDirection) return;
    const snakeWillRunIntoItself =
      getOppositeDirection(newDirection) === direction && snakeCells.size > 1;
    if (snakeWillRunIntoItself) return;
    setDirection(newDirection);
  };

  const moveSnake = () => {
    if (startgame === false) return;
    const currentHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col,
    };

    const nextHeadCoords = getCoordsInDirection(currentHeadCoords, direction);
    if (isOutOfBounds(nextHeadCoords, board)) {
      handleGameOver();
      return;
    }
    const nextHeadCell = board[nextHeadCoords.row][nextHeadCoords.col];
    if (snakeCells.has(nextHeadCell)) {
      handleGameOver();
      return;
    }

    const newHead = new LinkedListNode({
      row: nextHeadCoords.row,
      col: nextHeadCoords.col,
      cell: nextHeadCell,
    });
    const currentHead = snake.head;
    snake.head = newHead;
    currentHead.next = newHead;

    const newSnakeCells = new Set(snakeCells);
    newSnakeCells.delete(snake.tail.value.cell);
    newSnakeCells.add(nextHeadCell);

    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;

    const foodConsumed = nextHeadCell === foodCell;
    if (foodConsumed) {
      growSnake(newSnakeCells);
      if (foodShouldReverseDirection) reverseSnake();
      handleFoodConsumption(newSnakeCells);
    }

    const goldenFoodcellConsumed = nextHeadCell === goldenfoodCell;
    if (goldenFoodcellConsumed) {
      growSnake(newSnakeCells);
      growSnake(newSnakeCells);
      growSnake(newSnakeCells);
      handleGoldenFoodConsumption(newSnakeCells);
    }

    const slowCellConsumed = nextHeadCell === timerslowCell;
    if (slowCellConsumed) {
      setmouseSpeed(300);
    }
    /*   handleSlowCellConsumption(newSnakeCells);  */

    const fastCellConsumed = nextHeadCell === timerfastCell;
    if (fastCellConsumed) {
      setmouseSpeed(75);
    }

    const normalCellConsumed = nextHeadCell === timernormalCell;
    if (normalCellConsumed) {
      setmouseSpeed(150);
    }

    setSnakeCells(newSnakeCells);
  };

  const growSnake = (newSnakeCells) => {
    const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction);
    if (isOutOfBounds(growthNodeCoords, board)) {
      return;
    }
    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkedListNode({
      row: growthNodeCoords.row,
      col: growthNodeCoords.col,
      cell: newTailCell,
    });
    const currentTail = snake.tail;
    snake.tail = newTail;
    snake.tail.next = currentTail;

    newSnakeCells.add(newTailCell);
  };

  const getGrowthNodeCoords = (snakeTail, currentDirection) => {
    const tailNextNodeDirection = getNextNodeDirection(
      snakeTail,
      currentDirection
    );
    const growthDirection = getOppositeDirection(tailNextNodeDirection);
    const currentTailCoords = {
      row: snakeTail.value.row,
      col: snakeTail.value.col,
    };
    const growthNodeCoords = getCoordsInDirection(
      currentTailCoords,
      growthDirection
    );
    return growthNodeCoords;
  };

  const getNextNodeDirection = (node, currentDirection) => {
    if (node.next === null) return currentDirection;
    const { row: currentRow, col: currentCol } = node.value;
    const { row: nextRow, col: nextCol } = node.next.value;
    if (nextRow === currentRow && nextCol === currentCol + 1) {
      return Direction.RIGHT;
    }
    if (nextRow === currentRow && nextCol === currentCol - 1) {
      return Direction.LEFT;
    }
    if (nextCol === currentCol && nextRow === currentRow + 1) {
      return Direction.DOWN;
    }
    if (nextCol === currentCol && nextRow === currentRow - 1) {
      return Direction.UP;
    }
    return "";
  };

  const getOppositeDirection = (direction) => {
    if (direction === Direction.UP) return Direction.DOWN;
    if (direction === Direction.RIGHT) return Direction.LEFT;
    if (direction === Direction.DOWN) return Direction.UP;
    if (direction === Direction.LEFT) return Direction.RIGHT;
  };

  const reverseSnake = () => {
    const tailNextNodeDirection = getNextNodeDirection(snake.tail, direction);
    const newDirection = getOppositeDirection(tailNextNodeDirection);
    setDirection(newDirection);
    reverseLinkedList(snake.tail);
    const snakeHead = snake.head;
    snake.head = snake.tail;
    snake.tail = snakeHead;
  };

  const handleFoodConsumption = (newSnakeCells) => {
    const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE;
    let nextFoodCell;
    while (true) {
      nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
      if (newSnakeCells.has(nextFoodCell) || foodCell === nextFoodCell)
        continue;
      break;
    }

    const nextFoodShouldReverseDirection =
      Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;

    setFoodCell(nextFoodCell);
    setFoodShouldReverseDirection(nextFoodShouldReverseDirection);
    setScore(score + 1);
  };

  const handleGoldenFoodConsumption = (newSnakeCells) => {
    const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE;
    let nextGoldenFoodCell;
    while (true) {
      nextGoldenFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
      if (
        newSnakeCells.has(nextGoldenFoodCell) ||
        goldenfoodCell === nextGoldenFoodCell
      )
        continue;
      break;
    }

    const nextFoodShouldReverseDirection =
      Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;

    setgoldenFoodCell(nextGoldenFoodCell);
    setFoodShouldReverseDirection(nextFoodShouldReverseDirection);
    setScore(score + 3);
  };

  const handleSlowCellConsumption = (newSnakeCells) => {
    const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE;
    let nextSlowCell;
    while (true) {
      nextSlowCell = randomIntFromInterval(1, maxPossibleCellValue);
      if (newSnakeCells.has(nextSlowCell) || timerslowCell === nextSlowCell)
        continue;
      break;
    }

    setTimerslowCell(nextSlowCell);
  };

  const handleGameOver = () => {
    setStartgame(false);
    setScore(0);
    if (score > highscore) {
      setHighscore(score);
    }
    const snakeLLStartingValue = getStartingSnakeLLValue(board);
    setSnake(new LinkedList(snakeLLStartingValue));
    setFoodCell(snakeLLStartingValue.cell + 5);
    setSnakeCells(new Set([snakeLLStartingValue.cell]));
    setDirection(Direction.RIGHT);
  };

  const startgameHandler = () => {
    setStartgame(true);
  };

  const getCellClassName = (
    cellValue,
    foodCell,
    foodShouldReverseDirection,
    snakeCells,
    snakeHead,
    snakeTail,
    goldenfoodCell,
    timerslowCell,
    timerfastCell,
    timernormalCell
  ) => {
    let className = "cell";
    if (cellValue === goldenfoodCell) {
      className = "cell cell-golden";
    }
    if (cellValue === timerslowCell) {
      className = "cell cell-slow";
    }
    if (cellValue === timerfastCell) {
      className = "cell cell-fast";
    }
    if (cellValue === timernormalCell) {
      className = "cell cell-normal";
    }
    if (cellValue === foodCell) {
      if (foodShouldReverseDirection) {
        className = "cell cell-posion";
      } else {
        className = "cell cell-food";
      }
    }
    if (snakeCells.has(cellValue)) className = "cell cell-body";

    if (direction === "LEFT") {
      if (snakeTail === cellValue) className = "cell cell-tail-left";
      if (snakeHead === cellValue) className = "cell cell-head-left";
    }
    if (direction === "UP") {
      if (snakeTail === cellValue) className = "cell cell-tail-up";
      if (snakeHead === cellValue) className = "cell cell-head-up";
    }
    if (direction === "RIGHT") {
      if (snakeTail === cellValue) className = "cell cell-tail-right";
      if (snakeHead === cellValue) className = "cell cell-head-right";
    }
    if (direction === "DOWN") {
      if (snakeTail === cellValue) className = "cell cell-tail-down";
      if (snakeHead === cellValue) className = "cell cell-head-down";
    }

    return className;
  };

  return (
    <div className="snake">
      <h1>Score: {score}</h1>
      <h6> HighScore: {highscore}</h6>
      <div className="board_game">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cellValue, cellIdx) => {
              const className = getCellClassName(
                cellValue,
                foodCell,
                foodShouldReverseDirection,
                snakeCells,
                snakeHeadCell,
                snakeTailCell,
                goldenfoodCell,
                timerslowCell,
                timerfastCell,
                timernormalCell
              );
              return <div key={cellIdx} className={className}></div>;
            })}
          </div>
        ))}
      </div>

      <div className="icons">
        <img
          src={Turle}
          alt="turtle_img"
          height={IMAGES_HEIGHT}
          width={IMAGES_WIDTH}
        />
        <img
          src={Human}
          alt="human_img"
          height={IMAGES_HEIGHT}
          width={IMAGES_WIDTH}
        />
        <img
          src={Rabbit}
          alt="rabbit_img"
          height={IMAGES_HEIGHT}
          width={IMAGES_WIDTH}
        />
        <img
          src={Food}
          alt="food_img"
          height={IMAGES_HEIGHT}
          width={IMAGES_WIDTH}
        />
        <img
          src={Golden}
          alt="golden_img"
          height={IMAGES_HEIGHT}
          width={IMAGES_WIDTH}
        />
        <img
          src={Posion}
          alt="poison_img"
          height={IMAGES_HEIGHT}
          width={IMAGES_WIDTH}
        />
      </div>
      <p>
        Turtle slows speed, Human normal speed, Rabbit fast speed, Apple +1 size
        and growth, Golden +3 size and growth, Potion reverses snake!
      </p>
      <button onClick={startgameHandler} className="startGame-btn">
        Start Game
      </button>
    </div>
  );
};

const createBoard = (BOARD_SIZE) => {
  let counter = 1;
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const currentRow = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      currentRow.push(counter++);
    }
    board.push(currentRow);
  }
  return board;
};

const getCoordsInDirection = (coords, direction) => {
  if (direction === Direction.UP) {
    return {
      row: coords.row - 1,
      col: coords.col,
    };
  }
  if (direction === Direction.RIGHT) {
    return {
      row: coords.row,
      col: coords.col + 1,
    };
  }
  if (direction === Direction.DOWN) {
    return {
      row: coords.row + 1,
      col: coords.col,
    };
  }
  if (direction === Direction.LEFT) {
    return {
      row: coords.row,
      col: coords.col - 1,
    };
  }
};

const isOutOfBounds = (coords, board) => {
  const { row, col } = coords;
  if (row < 0 || col < 0) return true;
  if (row >= board.length || col >= board[0].length) return true;
  return false;
};

const getDirectionFromKey = (key) => {
  if (key === "ArrowUp") return Direction.UP;
  if (key === "ArrowRight") return Direction.RIGHT;
  if (key === "ArrowDown") return Direction.DOWN;
  if (key === "ArrowLeft") return Direction.LEFT;
  return "";
};

export default Snake;
