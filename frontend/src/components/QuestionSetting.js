import React, { useEffect, useState } from 'react';
import { Button, Grid, Box, Autocomplete,  TextField, 
    ListItem, ListItemText, Dialog, DialogActions, DialogContent
} from '@mui/material';
import instance from '../instance';


const TEMPLATE = [
    { label: 'Sudoku', id: 0 }, { label: 'Tic Tac Toe', id: 1 },
    { label: 'Number Guess', id: 2 },
]

const QuestionSetting = ({template, setTemplate, users, addTime, setAddTime}) => {
    // for setting question
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(template);
    const [currentAddtime, setCurrentAddtime] = useState(addTime);
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setTemplate(currentTemplate);
        setAddTime(currentAddtime);
        for (let i = 0; i < users.length; i++) {
            let currentuser = users[i];
            handleUpdateQuestion(currentuser.username, currentTemplate);
            handleUpdateAddtime(currentuser.username, currentAddtime);
            handleUpdateManager(localStorage.getItem("username"), currentTemplate, currentAddtime);
        }
        handleClose();
    };

    const handleUpdateQuestion = (username, curtemplate) => {
        console.log(curtemplate);
        updateQuestion(username, curtemplate);
    }
    const updateQuestion = async(username, curtemplate) => {
        // INSERT INTO radcheck
        try {
            const res = await instance.put(`/update/question`, {
                username: username, 
                curtemplate: curtemplate,
            });
            if (res.status === 200) {
                console.log("Update question successfully");
                console.log(res.data);
            }
            else {
                console.log("Update question Failed");
            }
        } catch (error) {
            console.log("Update Failed");
        }
    };

    const handleUpdateAddtime = (username, curAddtime) => {
        console.log(curAddtime);
        updateAddtime(username, curAddtime);
    }
    const updateAddtime = async(username, curAddtime) => {
        // INSERT INTO radcheck
        try {
            const res = await instance.put(`/update/addtime`, {
                username: username, 
                curAddtime: curAddtime,
            });
            if (res.status === 200) {
                console.log("Update addtime successfully");
                console.log(res.data);
            }
            else {
                console.log("Update addtime Failed");
            }
        } catch (error) {
            console.log("Update Failed");
        }
    };
    const handleUpdateManager = (username, curtemplate, curAddtime) => {
        updateManager(username, curtemplate, curAddtime);
    }
    const updateManager = async(username, curtemplate, curAddtime) => {
        try {
            const res = await instance.put(`/update/manager/template`, {
                username: username, 
                curtemplate: curtemplate,
            });
            if (res.status === 200) {
                console.log("Update manager template successfully");
                console.log(res.data);
            }
            else {
                console.log("Update manager template Failed");
            }
        } catch (error) {
            console.log("Update Failed");
        }
        try {
            const res = await instance.put(`/update/manager/addtime`, {
                username: username, 
                curAddtime: curAddtime,
            });
            if (res.status === 200) {
                console.log("Update manager addtime successfully");
                console.log(res.data);
            }
            else {
                console.log("Update manager addtime Failed");
            }
        } catch (error) {
            console.log("Update manager addtime Failed");
        }
    };

    return (
        <React.Fragment>
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr'}}>
                    <ListItemText sx={{ gridColumn: '1/4' }} id="template-label" primary="template"/>
                    {edit ? 
                        <Autocomplete 
                            sx={{ gridColumn: '5/12' }}
                            size="small"
                            options={TEMPLATE}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            defaultValue={{ label: `${TEMPLATE[currentTemplate].label}`, id: currentTemplate}}
                            onChange={(event, newValue, reason) => {
                                setCurrentTemplate(reason === "clear" || reason === "removeOption" ? 0 : newValue.id)
                            }}
                            renderInput={(params) => 
                                <TextField {...params} label="Choose Template"/>
                            }
                        />
                        :
                        <ListItemText sx={{ gridColumn: '5/8' }} primary={`${TEMPLATE[currentTemplate].label}`}/>
                    }
                </ListItem>
                <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr' }}>
                    <ListItemText sx={{ gridColumn: '1/4' }} id="time-label" primary="time" />
                    {edit ? 
                        <TextField
                            sx={{ gridColumn: '5/12' }}
                            size="small"
                            label="每次增加時間 (hr)"
                            value={currentAddtime}
                            type="text"
                            onChange={(e) => setCurrentAddtime(e.target.value)}
                        />
                        :
                        <ListItemText sx={{ gridColumn: '5/8' }} primary={currentAddtime}/>
                    }
                </ListItem>
                <Grid
                    container
                    justifyContent="space-between"
                    sx={{display: 'flex', flexDirection: 'row-reverse'}}
                >
                    { edit ?
                        <Button sx={{mt: 2, mr: 1}} item onClick={handleClickOpen} variant='contained'>SAVE</Button>
                        :
                        <Button sx={{mt: 2, mr: 1}} item onClick={() => setEdit(true)} variant='contained'>EDIT</Button>
                    }
                </Grid>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{p: '3'}}
            >
                <DialogContent sx={{m: 2}}>
                    Are you sure to create the question for users?
                </DialogContent>
                <DialogActions sx={{p: '20px'}}>
                    <Button onClick={handleClose}>CANCEL</Button>
                    <Button variant='contained' autoFocus onClick={handleSubmit}>SUBMIT</Button>
                    {/* onClick={handleSubmit} */}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default QuestionSetting;