import React, {useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import instance from "../instance";

function delay(n) {
    return new Promise(function(resolve) {
        setTimeout(resolve,n*1000);
    });
}

const LoginForm = ({identity, setIdentity, setLogin, theme, setTemplate, setAddTime}) => {
    // const navigate = useNavigate();
    const handleChangeTab = (event, newValue) => {
        setIdentity(newValue);
      };

    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const [showmessage, setShowmessage] = useState(false);
    const [alertmessage, setAlertmessage] = useState('Alert message');
    const [severity, setSeverity] = useState('error');
    const [managerinfo, setManagerinfo] = useState([]);
    const [users, setUsers] = useState([]);

    async function closeAlert(){
        await delay(2);
        setShowmessage(false);
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let sign = false;
        if (identity === "manager") {
            managerinfo.map((info) => {
                if (values.username === info.username && values.password === info.pass) {
                    localStorage.setItem("username", info.username);
                    localStorage.setItem("identity", identity);
                    setTemplate(info.template_id);
                    setAddTime(info.add_time);
                    setLogin(true);
                    sign = true;
                }
            })
            if (!sign) {
                setAlertmessage('Wrong username or password');
                setSeverity('warning');
                setShowmessage(true);
                closeAlert();
            }
        }
        else {
            users.map((info) => {
                if (values.username === info.username && values.password === info.password) {
                    localStorage.setItem("username", info.username);
                    localStorage.setItem("identity", identity);
                    localStorage.setItem("template_id", info.template_id);
                    localStorage.setItem("add_time", info.add_time);
                    localStorage.setItem("time", info.time);
                    localStorage.setItem("total_time", info.limitTime);
                    setLogin(true);
                    sign = true;
                }
            })
            if (!sign) {
                setAlertmessage('Wrong username or password');
                setSeverity('warning');
                setShowmessage(true);
                closeAlert();
            }
        }
        
    };
    async function getManager() {
        try {
            const res = await instance.get(`/managers`);
            if (res.status === 200) {
                let userarr = []
                const data = res.data;
                console.log(data);
                setManagerinfo(...managerinfo, data);
            }
            else {
                console.log("Failed");
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function getUser() {
        try {
            const res = await instance.get(`/users`);
            if (res.status === 200) {
                let userarr = []
                const data = res.data;
                for (let i = 0; i < data.length; i++) {
                    let userform = {};
                    let uid = data[i].id;
                    let user = data[i].username;
                    if(data[i].attribute == 'Cleartext-Password') {
                        userform = {...userform, id: uid, username: user, password: data[i].value};
                        const res_template = await instance.get(`/questions?username=${user}`);
                        if (res_template.status === 200) {
                            const data_template = res_template.data[0].template_id;
                            userform = {...userform, template_id: data_template};
                        } else {
                            console.log("Get questions template failed");
                        }
                        const addtime = await instance.get(`/addtime?username=${user}`);
                        if (addtime.status === 200) {
                            const data_addtime = addtime.data[0].add_time;
                            userform = {...userform, add_time: data_addtime};
                        } else {
                            console.log("Get add_time failed");
                        }

                        const res_time = await instance.get(`/time?username=${user}`);
                        if (res_time.status === 200) {
                            console.log(res_time.data);
                            const data_time = res_time.data[0];
                            for (const property in data_time) {
                                if (String(property) === 'SUM(total_time)') {
                                    userform = {...userform, time: data_time[property]};
                                }
                            }
                        } else {
                            console.log("Get time failed");
                        }
                        userarr = [...userarr, userform];
                    }
                    else if(data[i].attribute == 'Expire-After') {
                        userarr.forEach(object => {
                            console.log(object['username'])
                            if (object['username'] == data[i].username) {
                                object['limitTime'] = data[i].value;
                            }
                          });
                    }
                }
                for (let i = 0; i < userarr.length; i++) {
                    setUsers(user => [...user, userarr[i]]);
                }
            }
            else {
                console.log("Failed");
            }
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getManager();
        getUser();
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex'}}>
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
                        {identity === 'user' ?
                            <Grid item xs={12} align="center">
                                <Typography component="h2" variant="h6" sx={{mt: 3, mb: 3}}>
                                    LOGIN TO CONNECT TO INTERNET
                                </Typography>
                            </Grid>
                            :
                            <Grid item xs={12} align="center">
                                <Typography component="h2" variant="h6" sx={{mt: 3, mb: 3}}>
                                    WELCOME TO USER MANAGEMENT SYSTEM
                                </Typography>
                            </Grid>
                        }
                        <Box maxWidth="sm">
                            <Tabs
                                value={identity}
                                onChange={handleChangeTab}
                                textColor="secondary"
                                indicatorColor="secondary"
                                variant="fullWidth"
                            >
                                <Tab value="user" label="I AM USER" />
                                <Tab value="manager" label="I AM MANAGER" />
                            </Tabs>
                        </Box>
                        {
                            identity === 'user' ?
                            <Grid item xs={12} align="center">
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                                    {showmessage && (
                                        <Alert sx={{ position: 'fixed', top: '30px' }}
                                                severity={severity}>
                                            {alertmessage}
                                        </Alert>
                                    )}
                                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                        {/* <Alert severity="info">Please use the username and password you use for mysql database</Alert> */}
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
                            :
                            // manager
                            <Grid item xs={12} align="center">
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                                    {showmessage && (
                                        <Alert sx={{ position: 'fixed', top: '30px' }}
                                                severity={severity}>
                                            {alertmessage}
                                        </Alert>
                                    )}
                                    <Alert severity="info">Please use the username and password you use for mysql database</Alert>
                                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                        }
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default LoginForm;