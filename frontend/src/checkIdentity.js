const checkIdentity = async () => {
    let identity = localStorage.getItem("identity");
    if(identity) {
        return identity;
    }
    else return null;
}

export default checkIdentity;