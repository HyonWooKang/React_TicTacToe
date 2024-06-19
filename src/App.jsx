// import React from "react";
import { useState } from "react";
import GameOver from "./components/GameOver";
import GameBoard from "./components/GmaeBoard";
import Log from "./components/Log";
import Player from "./components/Player";
import { WINNING_COMBINATIONS } from "./winning-combinations";

// state가 아니기 때문에 함수 밖에 선언
const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// helper function
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player2",
  });
  const [gameTurns, setGameTurns] = useState([]);
  // const [activePlayer, setActivePlayer] = useState("X"); // gameTurns로 구분할 수 있음

  const activePlayer = deriveActivePlayer(gameTurns);

  // 깊은 복사로 원본의 메모리를 수정하는 것이 아니고 새로 하나 저장함
  let gameBoard = [...initialGameBoard.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSybol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    // console.log("firstSquareSymbol", firstSquareSymbol);
    // console.log("secondSquareSybol", secondSquareSybol);
    // console.log("thirdSquareSymbol", thirdSquareSymbol);

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSybol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  const hasDraw = (gameTurns.length === 9) & !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    // setActivePlayer((curActivePlay) => (curActivePlay === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      // updatedTurns 내 { } 파트는 하나의 객체를 만드는 것
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  // // test
  // React.createElement(
  //   "div",
  //   { id: "content" },
  //   React.createElement("p", null, "Hellow World")
  // );

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayNameChange}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
