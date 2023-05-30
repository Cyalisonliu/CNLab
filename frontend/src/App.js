import './App.css';
import React, { useEffect, useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import Dashboard from './components/Dashboard';
import Question from './components/Question';
import Login from './components/Login';
import theme from './theme';
import checkLogin from './checkLogin';
import checkIdentity from './checkIdentity';


function App() {
  const [login, setLogin] = useState(false);
  const [identity, setIdentity] = useState("user");
  const [template, setTemplate] = useState(0);
  const [addTime, setAddTime] = useState('0');

  useEffect(() => {
    async function logincheck() {
      let login = await checkLogin();
      if (login) setLogin(true);
      else setLogin(false);
    }
    async function identitycheck() {
      let identity = await checkIdentity();
      if (identity) setIdentity(identity);
    }
    logincheck();
    identitycheck();
  }, [])

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
      { login ? 
        identity == "user" ?
        <Question login={login} setLogin={setLogin} theme={theme}/>
        :
        // manager
        // login, setLogin, theme, template, setTemplate
        <Dashboard login={login} setLogin={setLogin} theme={theme} template={template} setTemplate={setTemplate} addTime={addTime} setAddTime={setAddTime}/>
        : 
        // guest
        <Login identity={identity} setIdentity={setIdentity} setLogin={setLogin} theme={theme} setTemplate={setTemplate} setAddTime={setAddTime}/>
      }
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
