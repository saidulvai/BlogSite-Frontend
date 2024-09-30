fetch("../navbar.html")
.then(res=> res.text())
.then(data=> {
    document.getElementById("navbar").innerHTML = data

    let navbarElement = document.getElementById("navbar-element")
    const token = localStorage.getItem("token")
    const user_id = localStorage.getItem("user_id")
    if (user_id){
        fetch(`https://my-book-iopa.onrender.com/list/${user_id}/`)
        .then((res)=> res.json())
        .then((user)=> {
            // console.log(user);
            console.log(is_superuser);
            if(user.profile.user_type == "Author" || user.profile.user_type == "Admin"){
                navbarElement.innerHTML += `
                
            <li class="nav-item">
                <a class="nav-link "  href="./add_article.html">Add Blog</a>
            </li>
            <li class="nav-item">
            <a class="nav-link "  href="./profile.html">Profile</a>
            </li>

            <li class="nav-item">
                <a class="nav-link" onclick="handleLogout()"  href="#" >Logout</a>
            </li>
            `
            }
            else{
                navbarElement.innerHTML += `
            
                <li class="nav-item">
                <a class="nav-link "  href="./profile.html">Profile</a>
                </li>
    
                <li class="nav-item">
                    <a class="nav-link"  onclick="handleLogout()"  href="#" >Logout</a>
                </li>
            
            `
            }
        })
    }
    if (token) {
        navbarElement.innerHTML += `
                
        <li class="nav-item">
            <a class="nav-link "  href="./add_article.html">Add Blog</a>
        </li>
        <li class="nav-item">
        <a class="nav-link "  href="./profile.html">Profile</a>
        </li>

        <li class="nav-item">
            <a class="nav-link" onclick="handleLogout()"  href="#" >Logout</a>
        </li>
        `
    }
    else {
        navbarElement.innerHTML += `
        
            <li class="nav-item">
                <a class="nav-link" href="./login.html">Login</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="./register.html">Register</a>
            </li>
        
        `
    }
})

