const getParams = () => {
    const param = new URLSearchParams(window.location.search).get("articleId");
    console.log(param)
    fetch(`https://my-book-iopa.onrender.com/blog/load_blogs/${param}`)
    .then((res)=> res.json())
    .then((data)=> displayArticleDetails(data))

}
getParams();
const displayArticleDetails = (article) => {
    console.log(article);
    const parent = document.getElementById("article-details");
    const ratingSection = document.getElementById("rating-section");

    console.log("article--", article);

    const createdAt = new Date(article.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const user_id = localStorage.getItem("user_id");

    fetch(`https://my-book-iopa.onrender.com/blog/categories/${article.categories}/`)
        .then((res) => res.json())
        .then((category) => {
            console.log(article);
            parent.innerHTML = `
                <div class="border border-dark rounded">
          <div class="row">
            <div class="col-md-12 ps-2.5">
              <div class="bg-dark-subtle p-3  rounded">
                <h3 class="fw-bold">${article.title}</h3>
                <hr>
                <div class="row text-dark">
                    <div class="col-md-3">
                        <p>Category: ${category.name}</p>
                    </div>
                    <div class="col-md-4">
                        <p>Published: ${createdAt}</p>
                    </div>
                    <div class="col-md-3">
                        <p>Rating: ${article.average_rating ?? 0} out of 4</p>
                    </div>
                    <div class="col-md-2">
                        <button class="btn px-5 mx-2 btn-outline-light" id="delete-btn" onclick="FavouriteArticle('${article.id}')">Favourite</button>
                    </div>
                </div>
            </div>
            
            <p class="p-3">${article.body}</p>
            </div>
          </div>
        </div>
            `;
            ratingSection.style.display = 'none';

            if (user_id) {
                fetch(`https://my-book-iopa.onrender.com/list/${user_id}/`)
                    .then((res) => res.json())
                    .then((user) => {
                        const isAuthor = user.profile.user_type === "Author";
                        const isAdmin = user.profile.user_type === "Admin";
                        const isReaders = user.profile.user_type === "Reader";
                        const isNon = user.profile === null;

                        if (isAuthor || isAdmin || isNon) {
                            parent.innerHTML += `
                                <div class="p-2 border border-dark bg-dark-subtle rounded">
                                    <button class="btn px-5 mx-2 btn-outline-dark" id="edit-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button>
                                    <button class="btn px-5 mx-2 btn-outline-danger" id="delete-btn" onclick="deleteArticle()">Delete</button>
                                </div>
                            `;
                            ratingSection.style.display = 'none';
                        } else{
                            fetch("https://my-book-iopa.onrender.com/blog/rating/")
                            .then((res)=>res.json())
                            .then((ratingList)=>{
                                console.log(ratingList);
                                const userRating = ratingList.find(rating => rating.blog == blog.id && rating.user == user_id);

                                if (userRating) {
                                    document.getElementById("rating-message").innerHTML = `
                                    <h5>You have already rated this article: ${userRating.rating} out of 4</h5>
                                    
                                    `
                                }
                                else{
                                    ratingSection.style.display = 'block';
                                }
                            })
                        }
                    });
            }

            document.getElementById("edit_title").value = article.title;
            document.getElementById("edit_body").value = article.body;
        });

};

const updateArticle = async (event) => {
    event.preventDefault();
    const param = new URLSearchParams(window.location.search).get("articleId");
    console.log(param);
    const form = document.getElementById("update-article");
    const formData = new FormData(form);
    const token = localStorage.getItem("token");

    // Prepare the data for the update
    const articleUpdateData = {
        title: formData.get('edit_title'),
        body: formData.get('edit_body'),
        categories: formData.get('categories'), // Assuming there's a category field in the edit form
    };


    // Send the update request
    fetch(`https://my-book-iopa.onrender.com/blog/load_blogs/${param}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        },
        body: JSON.stringify(articleUpdateData),
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if (!data.error) {
            alert("Article updated successfully!");
            window.location.reload(); // Reload the page after a successful update
        } else {
            console.error('Update failed:', data.error); // Handle errors if necessary
        }
    })
    .catch(error => {
        console.error('Error updating article:', error);
    });
};


const FavouriteArticle = async (event) => {
    event.preventDefault();
    // const param = new URLSearchParams(window.location.search).get("articleId");
    console.log(event);
    const token = localStorage.getItem("token");


    // Send the update request
    fetch("https://my-book-iopa.onrender.com/favorites/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify('')
    })
    .then((res) => res.json())
    .then((data) => {
        alert("Blog added successfully!");
        window.location.href = "./profile.html";
    })
    .catch(error => console.error('Error:', error));
};

const deleteArticle = () =>  {
    const param = new URLSearchParams(window.location.search).get("articleId");
    console.log(param);
    const token = localStorage.getItem("token")
    fetch(`https://my-book-iopa.onrender.com/blog/load_blogs/${param}/`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json",
            Authorization : `Token ${token}`
        },
    })
    .then((res)=> {
        alert("Article deleted successfully")
        window.location.href = "./index.html"
    })
    .catch((err) => console.log(err))
}

const handleAddRating = (event) => {
    event.preventDefault();

    const rating = document.getElementById("rating").value;
    const articleId = new URLSearchParams(window.location.search).get("articleId");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    const ratingData = {
        blog: articleId,
        rating: rating,
        user: userId,
    };
    console.log("rate---> ",ratingData)
    fetch("https://my-book-iopa.onrender.com/blog/rating/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(ratingData),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.error) {
            console.error(data.error);
        } else {
            alert("Rating submitted successfully");
            location.reload(); // Reload the page to update the rating display
        }
    })
    .catch((err) => console.error("Error submitting rating:", err));
};
