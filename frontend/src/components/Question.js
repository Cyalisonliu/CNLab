import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Sudoku from '../sudoku/screens/Game/Game';
import Tictactoe from '../tictactoe/Tictactoe';
import GuessGame from '../GuessGame/GuessGame';

const GAMETITLE = ["Sudoku Game", "Tic Tac Toe Game", "Guess Number"]
const QuestionContent = ({login, setLogin, theme}) => {

    const template = Number(localStorage.getItem('template_id'));
    const add_time = Number(localStorage.getItem('add_time'));
    const total_time = Number(localStorage.getItem('total_time'));

    const handleLogout = () => {
        setLogin(!login);
        localStorage.clear();
    }

    // useEffect(() => {
    //   console.log(template, add_time, total_time);
    // }, [])

    return (
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <MuiAppBar position="absolute" open={true} color='secondary'>
            <Toolbar sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography
                component="h1"
                variant="h5"
                color="inherit"
                noWrap
                sx={{ fontWeight: 600}}
              >
                CONNECT TO NETWORK
              </Typography>
              <IconButton color="inherit">
                  <LogoutIcon onClick={handleLogout}/>
              </IconButton>
            </Toolbar>
          </MuiAppBar>
          <Box
              component="main"
              sx={{
                  backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
              }}
          >
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column' }}>
              <Typography
                component="h2"
                variant="h5"
                sx={{ mt: 8}}
              >
                {GAMETITLE[template]}
              </Typography>
              <Typography
                component="h6"
                color="primary"
                sx={{ mb: 3 }}
              >
                {template === 0 ? "Finish the Sudoku to get your network connection" :
                  template === 1 ? "打敗電腦或取得平手" : "Guess the correct number by hints"
                }
              </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                      {template === 0 ? <Sudoku theme={theme} add_time={add_time} total_time={total_time}/> 
                        : template === 1 ? <Tictactoe theme={theme} add_time={add_time} total_time={total_time}/>
                        : <GuessGame theme={theme} add_time={add_time} total_time={total_time}/>
                      }
                  </Grid>
                </Grid>
            </Container>
          </Box> 
      </ThemeProvider>
    );
}

export default QuestionContent;