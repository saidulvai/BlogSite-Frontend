const displayProfile = () => {

    const user_id = localStorage.getItem("user_id")
    const parent = document.getElementById("profile-info")
    fetch(`https://my-book-iopa.onrender.com/list/${user_id}/`)
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

const displayFavourites = () => {

    const user_id = localStorage.getItem("user_id")
    const parent = document.getElementById("profile-info")
    fetch(`https://my-book-iopa.onrender.com/favorites/`)
    .then((res)=> res.json())
    .then((data)=> {
        console.log(data);
        data.forEach(favorite => {
            const li = document.createElement('li');
            li.textContent = `Favorite: ${favorite.blog.title}`;
            favoritesList.appendChild(li);
        });
    })
}
displayFavourites();

