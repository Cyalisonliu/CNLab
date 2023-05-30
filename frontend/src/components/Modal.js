import React, { useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import instance from "../instance";

const defaultSquares = () => (new Array(9)).fill(null);

const handleUpdateTime = (username, currentLimitTime) => {
    updateTime(username, (currentLimitTime).toFixed());
}
const updateTime = async(username, currentLimitTime) => {
    // INSERT INTO 
    console.log(currentLimitTime);
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

export const EndModal = ({theme, isPlayerWon, show, setShow, add_time, total_time}) => {

    const handleClose = () => {
        console.log(Number(add_time)*3600, Number(total_time))
        let time = (Number(add_time)+Number(total_time))*3600
        handleUpdateTime(localStorage.getItem('username'), time);
        setShow(false);
    }
    return (
        <ThemeProvider theme={theme}>
            {show && (
                isPlayerWon ?
                <Dialog
                    open={show}
                    onClose={() => setShow(false)}
                    sx={{p: '3'}}
                >
                    <DialogTitle>You WON</DialogTitle>
                    <DialogContent sx={{m: 2}}>
                        {`Get ${add_time} extra network hour!!`}
                    </DialogContent>
                    <DialogActions sx={{p: '20px'}}>
                        <Button onClick={handleClose} variant='contained' autoFocus color="secondary">OK</Button>
                    </DialogActions>
                </Dialog>
                :
                <Dialog
                    open={show}
                    onClose={() => setShow(false)}
                    sx={{p: '3'}}
                >
                <DialogTitle>KEEP GOING</DialogTitle>
                <DialogContent sx={{m: 2}}>
                    {`Keep gooing to Get ${add_time} extra network hour!!`}
                </DialogContent>
                <DialogActions sx={{p: '20px'}}>
                    <Button onClick={() => setShow(false)} variant='contained' autoFocus color="secondary">OK</Button>
                </DialogActions>
                </Dialog>
            )}
        </ThemeProvider>
        
    );
};

export const InfoModal = ({theme, isPlayerWon, setSquares, add_time, total_time}) => {
    const [show, setShow] = useState(true);
    console.log(Number(add_time)*3600, Number(total_time))
    let time = (Number(add_time)+Number(total_time))*3600
    const handleClose = () => {
        handleUpdateTime(localStorage.getItem('username'), time);
        setShow(false);
        setSquares(defaultSquares());
    }
    return (
        <ThemeProvider theme={theme}>
            {show && (
                isPlayerWon ?
                <Dialog
                    open={show}
                    onClose={() => setShow(false)}
                    sx={{p: '3'}}
                >
                    <DialogTitle>You WON</DialogTitle>
                    <DialogContent sx={{m: 2}}>
                        {`Get ${add_time} extra network hour!!`}
                    </DialogContent>
                    <DialogActions sx={{p: '20px'}}>
                        <Button onClick={handleClose} variant='contained' autoFocus color="secondary">OK</Button>
                    </DialogActions>
                </Dialog>
                :
                <Dialog
                    open={show}
                    onClose={() => setShow(false)}
                    sx={{p: '3'}}
                >
                <DialogTitle>You LOST</DialogTitle>
                <DialogContent sx={{m: 2}}>
                    {`Keep gooing to Get ${add_time} extra network hour!!`}
                </DialogContent>
                <DialogActions sx={{p: '20px'}}>
                    <Button onClick={handleClose} variant='contained' autoFocus color="secondary">OK</Button>
                </DialogActions>
                </Dialog>
            )}
        </ThemeProvider>
        
    );
};

export const SolutionModal = ({theme, show, setShow, add_time, total_time}) => {
    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={show}
                onClose={() => setShow(false)}
                sx={{p: '3'}}
            >
            <DialogTitle>No Solution Found</DialogTitle>
            <DialogContent sx={{m: 2}}>
            The Current Grid Doesnot have any solution, please change some cell values.
            </DialogContent>
            <DialogActions sx={{p: '20px'}}>
                <Button onClick={() => setShow(false)} variant='contained' autoFocus color="secondary">OK</Button>
            </DialogActions>
            </Dialog>
        </ThemeProvider>
        
    );
};

export const GuessModal = ({theme, add_time, total_time}) => {
    const [show, setShow] = useState(true);
    console.log(Number(add_time)*3600, Number(total_time))
    let time = (Number(add_time)+Number(total_time))*3600
    const handleClose = () => {
        handleUpdateTime(localStorage.getItem('username'), time);
        setShow(false);
    }
    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={show}
                onClose={() => setShow(false)}
                sx={{p: '3'}}
            >
            <DialogTitle>You WON</DialogTitle>
            <DialogContent sx={{m: 2}}>
                    {`Get ${add_time} extra network hour!!`}
            </DialogContent>
            <DialogActions sx={{p: '20px'}}>
                <Button onClick={handleClose} variant='contained' autoFocus color="secondary">OK</Button>
            </DialogActions>
            </Dialog>
        </ThemeProvider>
        
    );
};

