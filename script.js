// const { default: axios } = require("axios");

async function getPosts() {
    let url = "https://tarmeezacademy.com/api/v1/posts"
    let username, photoProfileURL, postTitle, postBody, postTime, postImage, tagsContent, tag, NbrComments
    let content = ""
    try {
      const response = await axios.get(url);
      response.data.data.forEach(element => {
        console.log(element)
        username = element.author.username;
        photoProfileURL = element.author.profile_image;
        postTitle = element.title;
        postBody = element.body;
        postImage = element.image;
        postTime = element.created_at
        NbrComments = element.comments_count
        tagsContent = ""
        for (tag of element.tags){
            tagsContent += `<span class="tag">${tag.name}</span>`
        }
        console.log(typeof photoProfileURL)
        if ((typeof photoProfileURL) == "object"){
            photoProfileURL = './images/profile.png'
        }
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
                        <span>${NbrComments} Comments</span>
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

function ShowAlert(message, type="success"){
    const content = `
        <div id="alertLogin" class="alert alert-${type} alert-dismissible fade show" role="alert" >
            ${message}.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `
    document.getElementById("alertLoginDiv").innerHTML = content;
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
        localStorage.setItem("token", element.data.token)
        localStorage.setItem("user",JSON.stringify(element.data.user))
        //Close login Modal
        const ModalLogin = document.getElementById("LoginModal")
        const modalInstance = bootstrap.Modal.getInstance(ModalLogin)
        modalInstance.hide()
        setupUI()
        ShowAlert("Logged in Successfully!")
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#alertLogin')
            alertToHide.close()
        }, 3000)
    })
    .catch(error => {
        ShowAlert(error.response.data.message, 'danger')
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#alertLogin')
            alertToHide.close()
        }, 8000)
    })
}


function logoutBtnClicked(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setupUI()
    ShowAlert("Logged out Successfully!")
    setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance('#alertLogin')
        alertToHide.close()
    }, 3000)
}

function RegisterBtnClicked(){
    const BaseURL = "https://tarmeezacademy.com/api/v1"
    const url = BaseURL + '/register';

    const Name = document.getElementById("RegisterName").value;
    const Username = document.getElementById("RegisterUsername").value;
    const Password = document.getElementById("RegisterPassword").value;
    const Image = document.getElementById('ProfileImg_Input').files[0]

    console.log(Image)
    const formData = new FormData();
    formData.append('username', Username)
    formData.append('password', Password)
    formData.append('name', Name)
    formData.append('image', Image)

    // const Param = {
    //     'username': Username,
    //     'password': Password,
    //     'name': Name
    // }

    axios.post(url, formData)
    .then(element => {
        console.log(element)
        localStorage.setItem("token", element.data.token)
        localStorage.setItem("user",JSON.stringify(element.data.user))
        //Close login Modal
        const RegisterModal = document.getElementById("RegisterModal")
        const modalInstance = bootstrap.Modal.getInstance(RegisterModal)
        modalInstance.hide()
        setupUI()
        ShowAlert("Register Successfully!")
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#alertLogin')
            alertToHide.close()
        }, 3000)
    })
    .catch(error => {
        ShowAlert(error.response.data.message, 'danger')
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#alertLogin')
            alertToHide.close()
        }, 8000)
    })
}

function CreateNewPost(){
    const BaseURL = "https://tarmeezacademy.com/api/v1"
    const url = BaseURL + '/posts';
    const title = document.getElementById("NewPost_Title").value;
    const body = document.getElementById("NewPost_Body").value;
    const image = document.getElementById("NewPost_img").files[0]

    const formData = new FormData();
    formData.append('title', title)
    formData.append('body', body)
    formData.append('image', image)
    
    const token = localStorage.getItem("token")
    const headers = {
        'authorization': `Bearer ${token}`
    }
    const config = {
        headers: headers
    }

    axios.post(url, formData, config)

    .then(element => {
        //Close login Modal
        const NewPostModal = document.getElementById("NewPostModal")
        const modalInstance = bootstrap.Modal.getInstance(NewPostModal)
        modalInstance.hide()
        setupUI()
        getPosts()
        ShowAlert("New Post Created!")
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#alertLogin')
            alertToHide.close()
        }, 3000)
        
    })
    .catch(error => {
        ShowAlert(error.response.data.message, 'danger')
        setTimeout(() => {
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#alertLogin')
            alertToHide.close()
        }, 8000)
    })
}

function setupUI(){
    const token = localStorage.getItem("token")
    
    if (token != null){
        document.querySelector(".btnLogin").classList.add('d-none')
        document.querySelector(".AddPostButton").classList.remove('d-none')
        document.querySelector(".btnLogout").classList.remove('d-none')
        const user = JSON.parse(localStorage.getItem('user'))
        const username = user.username
        document.getElementById('Username_Navbar').innerHTML = '@' + username
        const image = user.profile_image
        document.getElementById('ProfileImg_Navbar').src = image
    }else{
        document.querySelector(".AddPostButton").classList.add('d-none')
        document.querySelector(".btnLogin").classList.remove('d-none')
        document.querySelector(".btnLogout").classList.add('d-none')
    }
}

setupUI()
getPosts()