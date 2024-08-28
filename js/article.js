const loadCatgory = () => {
    const parent = document.getElementById("category_option")
    fetch("http://127.0.0.1:8000/categories/")
    .then((res)=> res.json())
    .then((data)=> {
        displayCategory(data);
        data.forEach(element => {
            console.log(element)
            const option = document.createElement("option")
            option.value = element.name 
            option.innerText = element.name
            parent.appendChild(option)
        });
        
    })
};
loadCatgory();

const displayCategory = (categories) => {
    const parent = document.getElementById("categories")
    fetch("http://127.0.0.1:8000/categories/")
    .then((res)=> res.json())
    .then((data)=> {
        data.forEach(element => {
            const p = document.createElement("p")
            p.innerHTML = `
                <p class="btn btn-outline-dark m-0 w-100" onclick="loadArticles('${element.id}')">${element.name}</p>
            
            `
            parent.appendChild(p);
        })
    })
}

const handleAddArticle = async (event) => {
    event.preventDefault();

    const form = document.getElementById("add-article");
    const formData = new FormData(form);
    const token = localStorage.getItem("token");
    console.log(token);

    const articleData = {
        title: formData.get('title'),
        body: formData.get('body'),
        categories: formData.get('categories'),
    };
    console.log(articleData);
    fetch("http://127.0.0.1:8000/blogs/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify(articleData)
    })
    .then((res) => res.json())
    .then((data) => {
        alert("Blog added successfully!");
        window.location.href = "./index.html";
    })
    .catch(error => console.error('Error:', error));
};


const loadArticles = (value) => {
    fetch(`http://127.0.0.1:8000/categories/${value}/`)
    .then((res)=>res.json())
    .then((data)=> {
        document.getElementById("category-title").innerText = data.name;
    })


    document.getElementById("nodata").innerText = ''
    document.getElementById("articles-sector").innerHTML = ''
    fetch(`http://127.0.0.1:8000/blogs/?categories_id=${value}`)
    .then((res) => res.json())
    .then((data) => {

        if(data.length>0){
            data.sort((a, b) => b.average_rating - a.average_rating);
            displayArticles(data);

          }
          else{
              document.getElementById("nodata").innerText = 'Sorry there are no articls for this category'
            document.getElementById("articles-sector").innerHTML = ""
          }
    })
    .catch((err) => console.log(err))
  };

loadArticles('');

const displayArticles = (articles) => {
  const parent = document.getElementById("articles-sector")
    
  articles.forEach(article => {
    const createdAt = new Date(article.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    const div = document.createElement("div")
    div.innerHTML = `
    
    <a href="article_Details.html?articleId=${article.id}"" class="article-headline">
        <div class="article border border-dark rounded  my-2">
        <div class="row">
            <div class="col-md-9 p-3">
                <h3 class="fw-bold">${article.title}</h3>
                <hr class="p-0 m-0"/>

                <div class="row">
                    <div class="col-md-6">
                    <p class="p-0 m-0">Published: ${createdAt}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="p-0 m-0">Rating: ${article.average_rating ?? 0} out of 4</p>
                    </div>
                    </div>
                <hr class="p-0 m-0"/>

                <p class="mt-3">${article.body.slice(0,150)}...</p>
            </div>
        </div>
        </div>
    </a>
    
    `
    parent.appendChild(div)
  });

}