import * as React from 'react';
import { Button, Grid, Box, InputAdornment, FormControl, OutlinedInput, Typography,
    TableContainer, Table, TableBody, TableCell, TableHead, TableRow, TextField, 
    ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import instance from '../instance';

export default function UserTable() {
    const [task, setTask] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [showrows, setShowrows] = React.useState([]);
    // const [limitTraffic, setLimitTraffic] = React.useState(null);
    // const [limitTime, setLimitTime] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentuser, setCurrentuser] = React.useState('');
    const [currentLimitTraffic, setCurrentLimitTraffic] = React.useState(0);
    const [currentLimitTime, setCurrentLimitTime] = React.useState(0);
    // for sign up new user
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        traffic: 0,
        time: 0,
        limitTraffic: 0,
        limitTime: 0,
    });

    // search function
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        requestSearch(event.target.value);
    };
    const cancelSearch = async() => {
        setSearchTerm("");
        requestSearch("");
    };
    const requestSearch = (searchedVal) => {
        const filteredRows = users.filter((row) => {
            let name = row.username.toLowerCase();
            let search = searchedVal.toLowerCase();
            if (name.includes(search))
                return row;
        });
        setShowrows(filteredRows);
    };
    
    const handleClickOpen = () => {
        setTask('create');
        setOpen(true);
    };
    const handleEditOpen = (row) => {
        // setCurrentId(row.id);
        setCurrentuser(row.username);
        setCurrentLimitTraffic(row.limitTraffic);
        setCurrentLimitTime(row.limitTime);
        setTask('edit');
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteUser = (username) => {
        deleteUser(username);
    }
    const deleteUser = async(username) => {
        try {
            const res = await instance.delete(`/delete/RadcheckUser/${username}`);
            if (res.status === 200) {
                console.log("Delete from radcheck successfully");
            }
            else {
                console.log("Delete from radcheck Failed");
            }
        } catch (error) {
            console.log("Delete from radcheck Failed");
        }
        try {
            const res = await instance.delete(`/delete/RaduseUser/${username}`);
            if (res.status === 200) {
                console.log("Delete from radusegroup successfully");
                console.log(res.data);
                setUsers(users.filter((val) => {
                    return val.username !== username;
                }));
                setShowrows(showrows.filter((val) => {
                    return val.username !== username;
                }));
            }
            else {
                console.log("Delete from radusegroup Failed");
            }
        } catch (error) {
            console.log("Delete from radusegroup Failed");
        }
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if (task === 'create') {
            addUser(values);
            setUsers(users.concat(values));
            setShowrows(showrows.concat(values));
            handleClose();
        }
        else {
            handleUpdateTraffic(currentuser, currentLimitTraffic);
            handleUpdateTime(currentuser, currentLimitTime)
            // setUsers(users.concat(values));
            const newState = showrows.map(obj => {
                if (obj.username === currentuser) {
                    return { ...obj, limitTraffic: currentLimitTraffic, limitTime: currentLimitTime };
                }
                return obj;
            });
            setShowrows(newState);
            handleClose();
        }
    };
    const addUser = async(form) => {
        // INSERT INTO radusergroup
        try {
            const res = await instance.post(`/insertRaduse`, {
                username: form.username, 
            });
            if (res.status === 200) {
                console.log("Success");
                console.log(res.data);
            }
            else {
                console.log("Failed");
            }
        } catch (error) {
            console.log("Failed");
        }
        // INSERT INTO radcheck
        try {
            const res = await instance.post(`/insertRadcheck`, {
                username: form.username, 
                password: form.password,
                limitTraffic: form.limitTraffic,
                limitTime: form.limitTime,
            });
            if (res.status === 200) {
                console.log("Success");
            }
            else {
                console.log("Failed");
            }
        } catch (error) {
            console.log("Failed");
        }
    };
    
    const handleUpdateTraffic = (username, currentLimitTime) => {
        console.log(currentLimitTime);
        updateTraffic(username, currentLimitTime);
    }
    const updateTraffic = async(username, currentLimitTraffic) => {
        // INSERT INTO radcheck
        try {
            const res = await instance.put(`/update/traffic`, {
                username: username, 
                limitTraffic: currentLimitTraffic,
            });
            if (res.status === 200) {
                console.log("Set traffic successfully");
                console.log(res.data);
            }
            else {
                console.log("Set traffic Failed");
            }
        } catch (error) {
            console.log("Set traffic Failed");
        }
    };

    const handleUpdateTime = (username, currentLimitTime) => {
        console.log(currentLimitTime);
        updateTime(username, currentLimitTime);
    }
    const updateTime = async(username, currentLimitTime) => {
        // INSERT INTO radcheck
        try {
            const res = await instance.put(`/update/time`, {
                username: username, 
                limitTime: currentLimitTime,
            });
            if (res.status === 200) {
                console.log("Set time successfully");
                console.log(res.data);
            }
            else {
                console.log("Set time Failed");
            }
        } catch (error) {
            console.log("Update Failed");
        }
    };

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
                        userform = {...userform, id: uid, username: user};
                        const res_traffic = await instance.get(`/traffic?username=${user}`);
                        if (res_traffic.status === 200) {
                            const data_traffic = res_traffic.data[0];
                            for (const property in data_traffic) {
                                if (String(property) === 'IFNULL( SUM(acctinputoctets) + SUM(acctoutputoctets),0)') {
                                    userform = {...userform, traffic: data_traffic[property]};
                                }
                            }
                        } else {
                            console.log("Get traffic failed");
                        }
                        const res_time = await instance.get(`/time?username=${user}`, {
                            username: user,
                        });
                        if (res_time.status === 200) {
                            console.log(res_time.data);
                            const data_time = res_time.data[0];
                            for (const property in data_time) {
                                if (String(property) === 'SUM(total_time)') {
                                    userform = {...userform, time: data_time[property]};
                                }
                            }
                        } else {
                            console.log("Get traffic failed");
                        }
                        userarr = [...userarr, userform];
                    }
                    else if(data[i].attribute == 'Max-Bytes') {
                        userarr.forEach(object => {
                            console.log(object['username'])
                            if (object['username'] == data[i].username) {
                                object['limitTraffic'] = data[i].value;
                            }
                          });
                    }
                    else if(data[i].attribute == 'Expire-After') {
                        userarr.forEach(object => {
                            console.log(object['username'])
                            if (object['username'] == data[i].username) {
                                object['limitTime'] = data[i].value;
                            }
                          });
                    }
                    console.log(userarr);
                }
                for (let i = 0; i < userarr.length; i++) {
                    setUsers(user => [...user, userarr[i]]);
                    setShowrows(showrow => [...showrow, userarr[i]]);
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
        getUser();
    }, [])

    return (
        <React.Fragment>
            <Grid
                container
                justifyContent="space-between"
            >
                <FormControl sx={{ml: 1, mb: 2}}>
                    <OutlinedInput
                        value={searchTerm}
                        onChange={handleSearch}
                        startAdornment={
                            <InputAdornment position="start"><SearchIcon /></InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <ClearIcon onClick={cancelSearch}/>
                                </IconButton>
                            </InputAdornment>
                        }
                        placeholder="Search Username"
                    />
                </FormControl>
            </Grid>
            <TableContainer sx={{}}>
                <Table size="normal">
                    <TableHead>
                    <TableRow>
                        <TableCell>USER NAME</TableCell>
                        <TableCell>TRAFFIC / MAX USAGE</TableCell>
                        <TableCell>TIME / MAX USAGE</TableCell>
                        <TableCell align="right">EDIT / DELETE USER</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {showrows.map((row) => (
                        <TableRow key={row.id}>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.traffic}/{row.limitTraffic}</TableCell>
                        <TableCell>{row.time}/{row.limitTime}</TableCell>
                        <TableCell align="right">
                            <>
                                <IconButton edge="start" onClick={() => handleEditOpen(row)}><EditIcon color='secondary'/></IconButton>
                                <IconButton edge="end" onClick={() => handleDeleteUser(row.username)}><DeleteIcon/></IconButton>
                            </>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid
                container
                justifyContent="space-between"
            >
                <Button sx={{mt: 2}} item onClick={handleClickOpen}>Add New User</Button>
            </Grid>
            {/* edit user info or create new user */}
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{p: '3'}}
            >
                <DialogTitle id="alert-dialog-title">
                { task === 'create' ? "ADD NEW USER" : "SET TRAFFIC OR TIME LIMIT" }
                </DialogTitle>
                <DialogContent sx={{m: 2}}>
                    {task === 'create' ? 
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="username-label" primary="Username" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                id="username"
                                label="Username"
                                name="username"
                                value={values.username}
                                onChange={handleChange('username')}
                            />
                        </ListItem>
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="password-label" primary="Password" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={values.password}
                                onChange={handleChange('password')}
                            />
                        </ListItem>  
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="traffic-label" primary="Traffic Limit" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                type="text"
                                label="Traffic Limit(Bytes)"
                                value={values.limitTraffic}
                                onChange={handleChange('limitTraffic')}
                            />
                        </ListItem>    
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="traffic-label" primary="Time Limit" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                type="text"
                                label="Time Limit(Seconds)"
                                value={values.limitTime}
                                onChange={handleChange('limitTime')}
                            />
                        </ListItem>                   
                    </Box>
                    :
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="username-label" primary="Username" />
                            <Typography sx={{ gridColumn: '5/12' }}>{currentuser}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr' }}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="traffic-label" primary="Traffic Limit" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                label="Traffic Limit(Bytes)"
                                value={currentLimitTraffic}
                                type="text"
                                onChange={(e) => setCurrentLimitTraffic(e.target.value)}
                            />
                        </ListItem>
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr' }}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="time-label" primary="Time Limit" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                label="Time Limit(Seconds)"
                                value={currentLimitTime}
                                type="text"
                                onChange={(e) => setCurrentLimitTime(e.target.value)}
                            />
                        </ListItem>
                    </Box>
                    }
                </DialogContent>
                <DialogActions sx={{p: '20px'}}>
                    <Button onClick={handleClose}>CANCEL</Button>
                    <Button variant='contained' onClick={handleSubmit} autoFocus>SUBMIT</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}