function getPosts(page = 1) {
  let url = `https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`;
  let id, username, photoProfileURL, postTitle, postBody, postTime;
  let postImage, tagsContent, tag, NbrComments, PostImageDiv;
  let content = "",
    UserID,
    AuthorID;

  const user = JSON.parse(localStorage.getItem("user"));
  if (user !== null) {
    UserID = user.id;
  }

  toggleLoader(true);
  axios
    .get(url)
    .then((response) => {
      response.data.data.forEach((post) => {
        // console.log(element)
        id = post.id;
        username = post.author.username;
        photoProfileURL = post.author.profile_image;
        postTitle = post.title;
        postBody = post.body;
        postImage = post.image;
        postTime = post.created_at;
        NbrComments = post.comments_count;
        PostImageDiv = "";
        tagsContent = "";
        AuthorID = post.author.id;
        for (tag of post.tags) {
          tagsContent += `<span class="tag">${tag.name}</span>`;
        }
        // console.log(typeof photoProfileURL)
        if (typeof photoProfileURL == "object") {
          photoProfileURL = "./images/profile.png";
        }
        if (postTitle === null) {
          postTitle = "";
        }

        // if (typeof postImage != string) ==> post without image
        if (typeof postImage == "string" && postImage != "") {
          PostImageDiv = `
              <div class="d-flex justify-content-center" >
                  <img src=${postImage}>
              </div>
          `;
        } else {
          PostImageDiv = "";
        }

        let btnContent = ``;
        console.log(UserID, post.author.id);
        if (UserID == post.author.id) {
          btnContent = `
              <i class="bi bi-pen" id="EditPostBtn" data-bs-toggle="modal" data-bs-target="#EditPostModal" onclick="editPostBtnClicked('${encodeURIComponent(
                JSON.stringify(post)
              )}')" ></i>
              <i class="bi bi-trash3" id="DeletePostBtn" data-bs-toggle="modal" data-bs-target="#DeletePostModal" onclick="deletePostBtnClicked(${
                post.id
              })" ></i>
          `;
        }
        content += `
          <!-- Post -->
          <div class="card mb-3 shadow" >
              <div class="card-header" onclick="ShowProfile(${AuthorID})">
                  <img src=${photoProfileURL} class="rounded-circle" width="35px" height="35px">
                  <b>@${username}</b>
                  ${btnContent}
              </div>
              <div class="card-body" onclick="PostClicked(${id})">
                  ${PostImageDiv}
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
      `;
      });
      document.querySelector(".posts").innerHTML += content;
      lastPage = response.data.meta.last_page;
    })
    .catch((error) => {
      ShowAlert(error.message, "danger");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 8000);
    })
    .then(toggleLoader(false));
}

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("PostTitle_input").value = post.title;
  document.getElementById("PostBody_input").value = post.body;
  age;
  CurrentPost = post.id;
}

function EditPost() {
  const title = document.getElementById("PostTitle_input").value;
  const body = document.getElementById("PostBody_input").value;
  const image = document.getElementById("PostImg_input").files[0];
  let formData;

  if (image != undefined) {
    console.log(image);
    formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
  } else {
    formData = {
      title: title,
      body: body,
    };
  }
  toggleLoader(true);
  const token = localStorage.getItem("token");
  const url = BaseURL + `/posts/${CurrentPost}`;
  formData.append("_method", "put");
  axios
    .post(url, formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((element) => {
      //Close login Modal
      const EditPostModal = document.getElementById("EditPostModal");
      const modalInstance = bootstrap.Modal.getInstance(EditPostModal);
      modalInstance.hide();
      document.querySelector(".posts").innerHTML = "";
      setupUI();
      getPosts();
      ShowAlert("Editing Post Successfully!");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 3000);
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, "danger");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 8000);
    })
    .then(toggleLoader(false));
}

function deletePostBtnClicked(postID) {
  CurrentPost = postID;
}

function DeletePost() {
  const token = localStorage.getItem("token");
  const url = BaseURL + `/posts/${CurrentPost}`;

  toggleLoader(true);
  axios
    .delete(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    .then((element) => {
      //Close login Modal
      const DeletePostModal = document.getElementById("DeletePostModal");
      const modalInstance = bootstrap.Modal.getInstance(DeletePostModal);
      modalInstance.hide();
      document.querySelector(".posts").innerHTML = "";
      ShowAlert("Delete Post Successfully!");

      //Refresh of localStroage
      setTimeout(() => {
        window.location.reload();
        getPosts();
      }, 300);
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 3000);
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, "danger");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 8000);
    });
}

function CreateNewPost() {
  const url = BaseURL + "/posts";
  const title = document.getElementById("NewPost_Title").value;
  const body = document.getElementById("NewPost_Body").value;
  const image = document.getElementById("NewPost_img").files[0];
  let formData;

  if (image != undefined) {
    console.log(image);
    formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("image", image);
  } else {
    formData = {
      title: title,
      body: body,
    };
  }

  const token = localStorage.getItem("token");
  // const headers = {
  //     'authorization': `Bearer ${token}`
  // }
  // const config = {
  //     headers: headers
  // }

  axios
    .post(url, formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    .then((element) => {
      //Close login Modal
      const NewPostModal = document.getElementById("NewPostModal");
      const modalInstance = bootstrap.Modal.getInstance(NewPostModal);
      modalInstance.hide();
      document.querySelector(".posts").innerHTML = "";
      setupUI();
      getPosts();
      ShowAlert("New Post Created!");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 3000);
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, "danger");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 8000);
    })
    .then(toggleLoader(false));
}

const handleInfiniteScroll = () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if (endOfPage && trigger && currentPage < lastPage) {
    currentPage++;
    console.log(currentPage, lastPage);
    getPosts(currentPage);
    trigger = false;
  } else if (!endOfPage) {
    trigger = true;
  }
};

function PostClicked(PostId) {
  window.location = `postDetails.html?postId=${PostId}`;
}

function ShowProfile(AuthorID) {
  window.location = `profile.html?authorID=${AuthorID}`;
}

var currentPage = 1,
  lastPage = 1,
  trigger = true;
let CurrentPost;
const BaseURL = "https://tarmeezacademy.com/api/v1";

setupUI();
getPosts();
window.addEventListener("scroll", handleInfiniteScroll);
