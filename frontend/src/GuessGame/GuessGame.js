import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Box, Alert, ListItem, ListItemText, TextField, Paper } from '@mui/material';
import { GuessModal } from '../components/Modal';

function delay(n) {
    return new Promise(function(resolve) {
        setTimeout(resolve,n*1000);
    });
}
function genRandom(x) {
    let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let s = "";
    for (var i = 0; i < x; ++i) {
        let d = Math.floor(Math.random() * arr.length);
        s = s + arr[d];
        arr.splice(d, 1);
    }
    return s;
}

const Guess = ({theme, add_time, total_time}) => {
    const [showWin, setshowWin] = useState(false);
    const [guess, setGuess] = useState("");
    const [ans, setAns] = useState(null);
    const [showmessage, setShowmessage] = useState(false);
    const [alertmessage, setAlertmessage] = useState('Alert message');
    const [severity, setSeverity] = useState('error');
    const [guessHistory, setGuessHistory] = useState([]);

    async function closeAlert(){
        await delay(2);
        setShowmessage(false);
    }

    const check = () => {
        if (ans.length != guess.length) {
            setAlertmessage("輸入長度應該為4!!!");
            setSeverity('error');
            setShowmessage(true);
            closeAlert();
            return;
        }
        let a_cnt = 0, b_cnt = 0;
        for (let i = 0; i < guess.length; ++i) {
            if (!(guess.charCodeAt(i) >= 48 && guess.charCodeAt(i) <= 57)) {
                setAlertmessage("輸入應該只包含數字!!!");
                setSeverity('error');
                setShowmessage(true);
                closeAlert();
                return;
            }
            for (let j = 0; j < guess.length; ++j) {
                if (i == j) continue;
                if (guess[i] == guess[j]) {
                    setAlertmessage("輸入裡面不應該有兩個一樣的數字!!!");
                    setSeverity('error');
                    setShowmessage(true);
                    closeAlert();
                    return;
                }
            }
        }
        for (let i = 0; i < ans.length; ++i) {
            if (ans[i] == guess[i])
                a_cnt++;
        }
        for (let i = 0; i < ans.length; ++i) {
            for (let j = 0; j < ans.length; ++j) {
                if (i == j) continue;
                if (ans[i] == guess[j])
                    b_cnt++;
            }
        }
        if (a_cnt == ans.length) {
            // alert("正確!!!");
            setshowWin(true);
            let ans = genRandom(4);
            console.log(ans);
            setAns(ans);
            setGuess("");
            setGuessHistory([]);

        }
        else {
            // alert(a_cnt.toString()+"A"+b_cnt.toString()+"B!!!");
            let history = {guess: guess, result: `${a_cnt.toString()}A${b_cnt.toString()}B!!!`};
            setGuessHistory(guessHistory.concat(history));
            setAlertmessage(`${a_cnt.toString()}A${b_cnt.toString()}B!!!`);
            setSeverity('error');
            setShowmessage(true);
            closeAlert();
        }
        return;
    }

    useEffect(() => {
        let ans = genRandom(4);
        setAns(ans);
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column'}}>
                {showmessage && (
                    <Alert sx={{ position: 'fixed', top: '100px' }}
                    severity={severity}>
                    {alertmessage}
                    </Alert>
                )}
                {
                    showWin && (
                        <GuessModal theme={theme} add_time={add_time} total_time={total_time}/>
                    )
                }
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' ,borderRadius: 2,
                        alignItems: 'center', justifyContent: 'center'}}>
                    <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr' }}>
                        <ListItemText sx={{ gridColumn: '1/6' }} id="guess-label" primary="輸入你要猜的數字（四位數）" />
                        <TextField
                            sx={{ gridColumn: '7/12' }}
                            size="small"
                            label="請輸入你要猜的數字"
                            value={guess}
                            type="text"
                            onChange={(e) => setGuess(e.target.value)}
                        />
                    </ListItem>
                    {
                        guessHistory.length > 0 ?
                            guessHistory.map((history) => (
                                <ListItem sx={{ display: 'grid', gridAutoColumns: '1fr' }}>
                                    <ListItemText sx={{ gridColumn: '1/6' }} id="guess-label" primary={history.guess} />
                                    <ListItemText sx={{ gridColumn: '7/12' }} id="guess-label" primary={history.result} />
                                </ListItem>
                            ))
                        : <></>
                    }
                    <Button color="secondary" onClick={() => check()} variant="contained" sx={{mt: '20px'}}>
                        Submit this try
                    </Button>
                </Paper>
            </Box>
        </ThemeProvider>
    )
}

export default Guess;
