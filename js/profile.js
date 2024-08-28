const displayProfile = () => {

    const user_id = localStorage.getItem("user_id")
    const parent = document.getElementById("profile-info")
    fetch(`http://127.0.0.1:8000/register/list/${user_id}/`)
    .then((res)=> res.json())
    .then((users)=> {
        console.log(users);
        parent.innerHTML = `
            <img src="" alt="">
            <h3>${users.first_name} ${users.last_name}</h3>
            <hr>
            <h5>Username: ${users.username}</h5>
            <h5>Email: ${users.email}</h5>
            <h5>User Type: ${users.profile.user_type}</h5>

        `
    })
}
displayProfile();