async function getUser() {
    let url = "https://tarmeezacademy.com/api/v1/posts"
    let username, photoProfileURL, postTitle, postBody, postTime, postImage
    let content = ""
    try {
      const response = await axios.get(url);
      response.data.data.forEach(element => {
        // console.log(element)
        username = element.author.username;
        photoProfileURL = element.author.profile_image;
        postTitle = element.title;
        postBody = element.body;
        postImage = element.image;
        content +=`
            <!-- Post -->
            <div class="card mb-3 shadow">
                <div class="card-header">
                    <img src=${photoProfileURL} class="rounded-circle" width="35px" height="35px">
                    <b>@${username}</b>
                </div>
                <div class="card-body">
                    <img src=${postImage} width="100%" height-max="300px">
                    <h6>2 min ago</h6>
                    <h5>${postTitle}</h5>
                    <p>${postBody}</p>
                    <hr>
                    <div>
                        <i class="bi bi-pen"></i>
                        <span>(3) Comments</span>
                    </div>
                </div>
            </div>
            <!-- Post -->
        `
      });
      document.querySelector(".posts").innerHTML = content;
    } catch (error) {
      console.error(error);
    }
}

getUser()