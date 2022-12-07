// const { default: axios } = require("axios");

async function getUser() {
    let url = "https://tarmeezacademy.com/api/v1/posts"
    let username, photoProfileURL, postTitle, postBody, postTime, postImage, tagsContent, tag
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
        postTime = element.created_at
        tagsContent = ""
        for (tag of element.tags){
            tagsContent += `<span class="tag">${tag.name}</span>`
        }
        console.log(element.tags)
        content +=`
            <!-- Post -->
            <div class="card mb-3 shadow">
                <div class="card-header">
                    <img src=${photoProfileURL} class="rounded-circle" width="35px" height="35px">
                    <b>@${username}</b>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-center" >
                        <img src=${postImage}>
                    </div>
                    <h6>${postTime}</h6>
                    <h5>${postTitle}</h5>
                    <p>${postBody}</p>
                    <hr>
                    <div id="PostFooter">
                        <i class="bi bi-pen"></i>
                        <span>(3) Comments</span>
                        ${tagsContent}
                        
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

function LoginBtnClicked(){
    const BaseURL = "https://tarmeezacademy.com/api/v1"
    const url = BaseURL + '/login';
    const Username = document.getElementById("username").value;
    const Password = document.getElementById("password").value;
    const Param = {
        'username': Username,
        'password': Password
    }

    axios.post(url, Param)
    .then(element => {
        console.log(element.data.token)
    })
    .catch(error => alert(error))
}

getUser()