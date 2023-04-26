import './App.css';
import React, { useEffect, useState } from "react";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import checkLogin from './checkLogin';

function App() {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    setLogin(checkLogin());
    console.log(login);
  }, [])
  return (
    <React.Fragment>
      { login ? 
        <Dashboard login={login} setLogin={setLogin}/>
        : <Login setLogin={setLogin}/>
      }
    </React.Fragment>
    
    // <Router>
    //   <Routes>
    //     <Route path='/' element={<Dashboard />} />
    //     <Route path='/login' element={<Login />} />
    //   </Routes>
    // </Router>
  );
}

export default App;
