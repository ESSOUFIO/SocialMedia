
async function getPosts(page = 1) {
    let url = `https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`
    let id, username, photoProfileURL, postTitle, postBody, postTime;
    let postImage, tagsContent, tag, NbrComments
    let content = ""
    try {
      const response = await axios.get(url);
      response.data.data.forEach(element => {
        // console.log(element)
        id = element.id
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
        // console.log(typeof photoProfileURL)
        if ((typeof photoProfileURL) == "object"){
            photoProfileURL = './images/profile.png'
        }
        content +=`
            <!-- Post -->
            <div class="card mb-3 shadow" onclick="PostClicked(${id})">
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
      document.querySelector(".posts").innerHTML += content;
      lastPage = response.data.meta.last_page
    } catch (error) {
      console.error(error);
    }
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

const handleInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
   
    if (endOfPage && trigger && currentPage < lastPage) {
        currentPage++
        console.log(currentPage, lastPage)
        getPosts(currentPage);
        trigger = false
    }else if(!endOfPage){
        trigger = true
    }
};

function PostClicked(PostId){
    // localStorage.setItem('PostId', PostId)
    // window.open('postDetails.html', '_self');
    window.location = `postDetails.html?postId=${PostId}`
}

var currentPage = 1, lastPage = 1, trigger = true

setupUI()
getPosts()
window.addEventListener("scroll", handleInfiniteScroll);

