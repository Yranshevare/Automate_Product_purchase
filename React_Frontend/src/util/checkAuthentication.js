
function checkAuthentication() {
    const pathArr = window.location.href.split("/")

    const publicPath = ["approval","auth","quoteSubmit"]



    // .some() returns true if any element in the array passes the test else returns false
    if (publicPath.some(path => pathArr.includes(path))) {
        return;
    }

    if (!sessionStorage.getItem('token') ){ 
        window.location.href = "/auth/login";
        return
    }
}

export default checkAuthentication