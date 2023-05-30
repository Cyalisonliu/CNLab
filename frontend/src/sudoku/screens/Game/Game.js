import React, { useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, Alert } from '@mui/material';
import {
  Grid,
  ChoiceBoard,
} from "../../components/index.js";
import {
  arrayDeepCopy,
  checkBoard,
  checkPlayerWon,
  createSudokuGrid,
} from "../../utility";
import { EndModal, SolutionModal } from '../../../components/Modal.js'
import useLocalStorage from "../../hooks/useLocalStorage";
import getHint from "../../utility/getHint";

const easyMaxEmptyCells = 30;
const mediumMaxEmptyCells = 40;
const hardMaxEmptyCells = 50;

function delay(n) {
  return new Promise(function(resolve) {
      setTimeout(resolve,n*1000);
  });
}

const Game = ({theme, add_time, total_time}) => {
  const [grid, setGrid] = useLocalStorage("currentGrid", null);
  const [startingGrid, setStartingGrid] = useLocalStorage("startingGrid", null);
  const [clickValue, setClickValue] = useLocalStorage("clickValue", 1);

  // Game Score logic
  const [gameMode, setGameMode] = useLocalStorage(
    "gameMode",
    easyMaxEmptyCells
  );
  const [hintsTaken, setHintsTaken] = useLocalStorage("hintsTaken", 0);
  const [isPlayerWon, setIsPlayerWon] = useLocalStorage("playerWon", false);

  // Logic for modal
  const [showNoSolutionFoundModal, setShowNoSolutionFoundModal] = useState(false);
  const [showGameDetails, setShowGameDetails] = useState(false);
  const [showDifficultySelectionModal, setShowDifficultySelectionModal] = useState(false);
  const [showmessage, setShowmessage] = useState(false);
  const [alertmessage, setAlertmessage] = useState('Alert message');
  const [severity, setSeverity] = useState('error');

  const handleSolve = () => {
    let playerWon = checkPlayerWon(grid);

    setIsPlayerWon(playerWon);
    setShowGameDetails(true);
  };

  const handleHint = () => {
    // Checking if player has won
    if (isPlayerWon) return;
    if (hintsTaken >= 10) {
      setAlertmessage('You can get at most 10 hints!');
      setSeverity('info');
      setShowmessage(true);
      closeAlert();
      return;
    }
    // Getting hint
    let hintResponse = getHint(grid);
    // Checking if the grid cannot be solved
    if (hintResponse.solvedStatus === false) {
      setShowNoSolutionFoundModal((show) => !show);
      return;
    }
    // setting the result board
    setGrid(hintResponse.board);
    // Adding hint count
    setHintsTaken((hints) => hints + 1);
    // Checking if the player has won
    let playerWon = checkPlayerWon(hintResponse.board);
    if (playerWon) {
      setIsPlayerWon(true);
      setShowGameDetails(true);
    }
  };

  const handleNewGame = (maxEmptyCellsCount) => {
    // Waiting for the function to return the grid
    let newSudokuGrid = createSudokuGrid(maxEmptyCellsCount);
    setStartingGrid(arrayDeepCopy(newSudokuGrid));
    setGrid(arrayDeepCopy(newSudokuGrid));
    // Setting the game mode with maxEmptyCellsCount
    setGameMode(maxEmptyCellsCount);
    // Reseting the values
    setHintsTaken(0);
    setIsPlayerWon(false);
    // Closing the difficulty modal and also setting the isLoading to false
    setShowDifficultySelectionModal((show) => !show);
  };

  const handleClearBoard = () => {
    setIsPlayerWon(false);
    setGrid(arrayDeepCopy(startingGrid));
    setHintsTaken(0);
  };

  const handleCellClick = (row, column, isModifiable) => {
    if (!isModifiable) {
      setAlertmessage('Cannot assign value to this cell!');
      setSeverity('warning');
      setShowmessage(true);
      closeAlert();
      return;
    }

    let newGrid = arrayDeepCopy(grid);
    newGrid[row][column].value = clickValue;

    // Marking the node valid or invalid depending on the grid
    checkBoard(newGrid);
    setGrid(newGrid);
  };

  async function closeAlert(){
      await delay(2);
      setShowmessage(false);
  }

  // If we donot have anything in the local storage
  if (grid == null && startingGrid == null) handleNewGame(gameMode);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 2}}>
        {showmessage && (
          <Alert sx={{ position: 'fixed', top: '100px' }}
            severity={severity}>
            {alertmessage}
          </Alert>
        )}
        <SolutionModal theme={theme} show={showNoSolutionFoundModal} setShow={setShowNoSolutionFoundModal} add_time={add_time} total_time={total_time}/>
        <EndModal theme={theme} isPlayerWon={isPlayerWon} show={showGameDetails} setShow={setShowGameDetails} add_time={add_time} total_time={total_time}/>
        <Grid handleCellClick={handleCellClick} grid={grid} />
        <ChoiceBoard setClickValue={setClickValue} selected={clickValue} />
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
          <Button color="secondary" onClick={handleClearBoard} variant="outlined">Clear</Button>
          <Button color="secondary" onClick={handleHint} variant="outlined">Hint</Button>
          <Button color="secondary" onClick={() => handleNewGame(gameMode)} variant="outlined">New Game</Button>
          <Button color="secondary" onClick={handleSolve} variant="contained">Submit</Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Game;
