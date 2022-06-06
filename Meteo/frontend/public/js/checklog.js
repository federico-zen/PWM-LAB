const checkLogged = async () => {
    try {
        const response = await request(`/logged`);
        return response;
    } catch (err) {
        console.log(err);
    }

};

function changeNavBar() {

    nav = document.getElementsByClassName('navbar-right');
    nav[0].innerHTML = `<li class="nav-item"><a class="nav-link " aria-current="logout" href="/logout"><i class="bi bi-box-arrow-right"></i> Logout</a></li>`;

    fv = document.getElementById('favouriteCities').classList.remove('disabled');

}

document.addEventListener('DOMContentLoaded',async () => {

    //check logged user
    var response = await checkLogged();
    
    if (response.loggato){
        changeNavBar();
        
    }
});





