import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import LogoutIcon from '@mui/icons-material/Logout';
import UserTable from './UserTable';
import QuestionSetting from './QuestionSetting';
import { Button } from '@mui/material';

const DashboardContent = ({login, setLogin, theme, template, setTemplate, addTime, setAddTime}) => {

  // manageType: 0: manage users, 1: create question
  const [manageType, setManageType] = useState(0);
  const [users, setUsers] = React.useState([]);

  const handleLogout = () => {
      setLogin(!login);
      localStorage.clear();
  }

  useEffect(() => {
    console.log(template, addTime);
  }, [])

  return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <MuiAppBar position="absolute" open={true}>
              <Toolbar>
                <Typography
                  component="h1"
                  variant="h5"
                  color="inherit"
                  noWrap
                  sx={{ fontWeight: 600}}
                >
                  Network Controller
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                  <Button size="large" sx={{ ml: 3, mr: 1, color: 'white', display: 'block' }} onClick={() => setManageType(0)}>
                    USER MANAGEMENT
                  </Button>
                  <Button sx={{ ml: 1, mr: 1, color: 'white', display: 'block' }} onClick={() => setManageType(1)}>
                    QUESTION SETTING
                  </Button>
                </Box>
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
                  overflow: 'scroll',
              }}
            >
            {manageType === 0 ?
              <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ mt: 8}}
                >
                  USER MANAGEMENT
                </Typography>
                <Typography
                  component="h6"
                  color="secondary"
                  sx={{ mb: 3 }}
                >
                  Manage all users using your network here.
                </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' ,borderRadius: 2}}>
                            <UserTable users={users} setUsers={setUsers} addtime={addTime}/>
                        </Paper>
                    </Grid>
                  </Grid>
              </Container> : 
                <Container maxWidth="sm" sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ mt: 8}}
                >
                  QUESTION SETTING
                </Typography>
                <Typography
                  component="h6"
                  color="secondary"
                  sx={{ mb: 3 }}
                >
                  Customize question to your users using our template question here.
                </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' ,borderRadius: 2}}>
                            <QuestionSetting template={template} setTemplate={setTemplate} users={users} addTime={addTime} setAddTime={setAddTime}/>
                        </Paper>
                    </Grid>
                  </Grid>
              </Container>
            }
            </Box>
        </Box>
      </ThemeProvider>
  );
}

export default DashboardContent;