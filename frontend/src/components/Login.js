import React, {useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const database_username = 'root';
const database_password = '0000';
function delay(n) {
    return new Promise(function(resolve) {
        setTimeout(resolve,n*1000);
    });
}

const mdTheme = createTheme();

const LoginForm = ({setLogin}) => {
    // const navigate = useNavigate();
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const [showmessage, setShowmessage] = useState(false);
    const [alertmessage, setAlertmessage] = useState('Alert message');
    const [severity, setSeverity] = useState('error');

    async function closeAlert(){
        await delay(2);
        setShowmessage(false);
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(values);
        if (values.username === database_username && values.password === database_password) {
            localStorage.setItem("username", database_username);
            setLogin(true);
        }
        else {
            setAlertmessage('Wrong username or password');
            setSeverity('warning');
            setShowmessage(true);
            closeAlert();
        }
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
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
                    <Container maxWidth="sm" sx={{ mt: 12, mb: 4 }}>
                        <Grid item xs={12} align="center">
                            <Typography component="h1" variant="h5" sx={{mb: 4}}>
                                WELCOME TO USR MANAGEMENT
                            </Typography>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {showmessage && (
                                    <Alert sx={{ position: 'fixed', top: '30px' }}
                                            severity={severity}>
                                        {alertmessage}
                                    </Alert>
                                )}
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                    <Alert severity="info">Please use the username and password you use for mysql database</Alert>
                                    <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                                        <ListItemText sx={{ gridColumn: '1/4' }} id="username-label" primary="Username" />
                                        <TextField
                                            sx={{ gridColumn: '5/12' }}
                                            margin="normal"
                                            size="small"
                                            id="username"
                                            label="Username"
                                            name="username"
                                            autoComplete="username"
                                            autoFocus
                                            value={values.username}
                                            onChange={handleChange('username')}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                                        <ListItemText sx={{ gridColumn: '1/4' }} id="password-label" primary="Password" />
                                        <TextField
                                            sx={{ gridColumn: '5/12' }}
                                            margin="normal"
                                            size="small"
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            onChange={handleChange('password')}
                                        />
                                    </ListItem>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 3 }}
                                    >
                                        LOG IN
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default LoginForm;