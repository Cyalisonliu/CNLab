import './Tictactoe.css';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, Alert, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { InfoModal } from '../components/Modal';
const defaultSquares = () => (new Array(9)).fill(null);

const lines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

const Tictactoe = ({theme, add_time, total_time}) => {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner,setWinner] = useState(null);

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    const linesThatAre = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index]);
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      });
    };
    const emptyIndexes = squares
      .map((square,index) => square === null ? index : null)
      .filter(val => val !== null);
    const playerWon = linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;
    if (playerWon) {
      setWinner('x');
    }
    if (computerWon) {
      setWinner('o');
    }
    const putComputerAt = (index) => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    };
    if (isComputerTurn) {

      const winingLines = linesThatAre('o', 'o', null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(index => squares[index] === null)[0];
        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesThatAre('x', 'x', null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesThatAre('o', null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }

      const randomIndex = emptyIndexes[ Math.ceil(Math.random()*emptyIndexes.length) ];
      putComputerAt(randomIndex);
    }
  }, [squares]);



  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  return (
    <ThemeProvider theme={theme}>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: '20px'}}>
          <div className="board">
            {squares.map((square,index) =>
              <div className="square" onClick={() => handleSquareClick(index)}>
                { square==='x' ? 'x' : square==='o'? 'o' : ''}
              </div>
            )}
          </div>
          <Button color="secondary" onClick={() => setSquares(defaultSquares())} variant="outlined">New Game</Button>
          {!!winner && winner === 'x' && (
            <InfoModal theme={theme} isPlayerWon={winner === 'x'} setSquares={setSquares} add_time={add_time} total_time={total_time}/>
          )}
          {!!winner && winner === 'o' && (
            <InfoModal theme={theme} isPlayerWon={winner === 'x'} setSquares={setSquares} add_time={add_time} total_time={total_time}/>
          )}
          {squares.filter(square => square !== null).length === 9 && (
            <InfoModal theme={theme} isPlayerWon={true} setSquares={setSquares} add_time={add_time} total_time={total_time}/>
          )}
      </Box>
    </ThemeProvider>
  );
}

export default Tictactoe;
