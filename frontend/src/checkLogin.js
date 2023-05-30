const checkLogin = async () => {
    let username = localStorage.getItem("username");
    if(username) {
        return true;
    }
    else return false;
}

export default checkLogin;