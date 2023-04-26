import * as React from 'react';
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

const mdTheme = createTheme();

const DashboardContent = ({login, setLogin}) => {

    const handleLogout = () => {
        setLogin(!login);
        localStorage.clear();
    }

    return (
        <ThemeProvider theme={mdTheme}>
          <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <MuiAppBar position="absolute" open={true}>
                <Toolbar>
                    <Typography
                      component="h1"
                      variant="h5"
                      color="inherit"
                      noWrap
                      sx={{ margin: 'auto' }}
                    >
                      USER MANAGEMENT
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
                    overflow: 'scroll',
                }}
              >
              <Toolbar />
              <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                  <Grid container spacing={3}>
                  <Grid item xs={12}>
                      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                      <UserTable />
                      </Paper>
                  </Grid>
                  </Grid>
              </Container>
              </Box>
          </Box>
        </ThemeProvider>
    );
}

export default DashboardContent;