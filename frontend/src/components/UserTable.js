import React, { useEffect, useState } from 'react';
import { Button, Grid, Box, InputAdornment, FormControl, OutlinedInput, Typography,
    TableContainer, Table, TableBody, TableCell, TableHead, TableRow, TextField, 
    ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import instance from '../instance';

const TEMPLATE = [
    { label: 'Sudoku', id: 0 }, { label: 'Tic Tac Toe', id: 1 },
    { label: 'Number Guess', id: 2 },
]

function refreshPage() {
    window.location.reload(false);
}
const UserTable = ({users, setUsers, addtime, temp}) => {
    const [task, setTask] = useState('');
    const [open, setOpen] = useState(false);
    const [showrows, setShowrows] = useState([]);
    // const [limitTraffic, setLimitTraffic] = useState(null);
    // const [limitTime, setLimitTime] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentuser, setCurrentuser] = useState('');
    // const [currentLimitTraffic, setCurrentLimitTraffic] = useState(0);
    const [currentLimitTime, setCurrentLimitTime] = useState(0);
    const [template, setTemplate] = useState(localStorage.getItem("template_id") ? localStorage.getItem("template_id") : temp);
    const [addTime, setAddTime] = useState(localStorage.getItem("add_time") ? localStorage.getItem("add_time") : addtime);
    // for sign up new user
    const [values, setValues] = useState({
        username: '',
        password: '',
        // traffic: 0,
        time: 0,
        // limitTraffic: 0,
        limitTime: 1,
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
        console.log(users);
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
        // setCurrentLimitTraffic(row.limitTraffic);
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
        try {
            const res = await instance.delete(`/delete/userinfo/${username}`);
            if (res.status === 200) {
                console.log("Delete from userinfo successfully");
                setUsers(users.filter((val) => {
                    return val.username !== username;
                }));
                setShowrows(showrows.filter((val) => {
                    return val.username !== username;
                }));
            }
            else {
                console.log("Delete from userinfo Failed");
            }
        } catch (error) {
            console.log("Delete from userinfo Failed");
        }
        refreshPage();
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
            // handleUpdateTraffic(currentuser, currentLimitTraffic);
            handleUpdateTime(currentuser, currentLimitTime)
            // setUsers(users.concat(values));
            const newState = showrows.map(obj => {
                if (obj.username === currentuser) {
                    return { ...obj, limitTime: currentLimitTime }; //limitTraffic: currentLimitTraffic,
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
                limitTime: Number(form.limitTime)*3600,
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
        // INSERT INTO uerinfo
        try {
            const res = await instance.post(`/insertUserinfo`, {
                username: form.username, 
                template: template,
                addtime: addTime
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
        refreshPage();
    };

    const handleUpdateTime = (username, currentLimitTime) => {
        updateTime(username, Number(currentLimitTime)*3600);
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
            }
            else {
                console.log("Set time Failed");
            }
        } catch (error) {
            console.log("Update Failed");
        }
        refreshPage();
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
                            const data_time = res_time.data[0];
                            for (const property in data_time) {
                                if (String(property) === 'SUM(total_time)') {
                                    userform = {...userform, time: (Number(data_time[property])/3600).toFixed(2)};
                                }
                            }
                        } else {
                            console.log("Get time failed");
                        }
                        userarr = [...userarr, userform];
                    }
                    else if(data[i].attribute == 'Expire-After') {
                        userarr.forEach(object => {
                            if (object['username'] == data[i].username) {
                                object['limitTime'] = (Number(data[i].value)/3600).toFixed(2);
                            }
                          });
                    }
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

    useEffect(() => {
        getUser();
    }, [])

    return (
        <React.Fragment>
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <FormControl sx={{ml: 1, mb: 2}}>
                        <OutlinedInput
                            sx={{borderRadius: 3}}
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
                    <Button item onClick={handleClickOpen} sx={{padding: '6px 16px'}}>Add New User</Button>
                </Grid>
                <TableContainer>
                    <Table size="normal">
                        <TableHead>
                        <TableRow>
                            <TableCell>USER NAME</TableCell>
                            {/* <TableCell>TRAFFIC / MAX USAGE</TableCell> */}
                            <TableCell>TIME / MAX USAGE (Hours)</TableCell>
                            <TableCell align="right">EDIT / DELETE USER</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {showrows.map((row) => (
                            <TableRow key={row.id}>
                            <TableCell>{row.username}</TableCell>
                            {/* <TableCell>{row.traffic}/{row.limitTraffic}</TableCell> */}
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
                {/* <Grid
                    container
                    justifyContent="space-between"
                    sx={{display: 'flex', flexDirection: 'row-reverse'}}
                >
                    <Button sx={{mt: 2}} item onClick={handleClickOpen}>Add New User</Button>
                </Grid> */}
            </Box>
            {/* edit user info or create new user */}
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{p: '3'}}
            >
                <DialogTitle>
                { task === 'create' ? "ADD NEW USER" : "EDIT TIME LIMIT" }
                </DialogTitle>
                <DialogContent sx={{mr: 2, ml: 2}}>
                    {task === 'create' ? 
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Alert severity='info' sx={{mb: 1}}>
                            {`Note that the question for users is now ${TEMPLATE[template].label}. Add-time is ${addTime} You can change to other question in `}
                            <b>{"QUESTION SETTING"}</b>
                        </Alert>
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
                            <ListItemText sx={{ gridColumn: '1/4' }} id="time-label" primary="Time Limit" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                type="text"
                                label="Time Limit(Hours)"
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
                        {/* <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr' }}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="traffic-label" primary="Traffic Limit" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                label="Traffic Limit(Bytes)"
                                value={currentLimitTraffic}
                                type="text"
                                onChange={(e) => setCurrentLimitTraffic(e.target.value)}
                            />
                        </ListItem> */}
                        <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr' }}>
                            <ListItemText sx={{ gridColumn: '1/4' }} id="time-label" primary="Time Limit" />
                            <TextField
                                sx={{ gridColumn: '5/12' }}
                                size="small"
                                label="Time Limit(Hours)"
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
                    <Button variant='contained' onClick={handleSubmit} autoFocus>ADD</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
export default UserTable;