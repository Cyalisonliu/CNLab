const checkLogin = async () => {
    let username = localStorage.getItem("username");
    if(username) {
        return false;
    }
    else return false;
}

export default checkLogin;