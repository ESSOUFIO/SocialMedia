//* =========== RenderPost =============//
function RenderPost(post) {
  let id, username, photoProfileURL, postTitle, postBody, postTime;
  let postImage, tagsContent, tag, NbrComments, PostImageDiv;
  let content = "",
    UserID;

  const user = JSON.parse(localStorage.getItem("user"));
  if (user !== null) {
    UserID = user.id;
  }

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
  for (tag of post.tags) {
    tagsContent += `<span class="tag">${tag.name}</span>`;
  }
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
                <div class="card-header">
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

  document.querySelector(".posts").innerHTML += content;
}
//* =========== RenderPost =============//

//* =========== getPosts =============//
function getPosts(User) {
  toggleLoader(true);
  axios
    .get(url)
    .then((posts) => {
      posts.data.data.forEach((post) => {
        if (post.author.id === User.id) {
          RenderPost(post);
        }
      });
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
//* =========== getPosts =============//

//* =========== fillPage =============//
function fillPage() {
  let PostNumber = 0;
  let CommentNumber = 0;
  let AuthorID, User;

  const urlParams = new URLSearchParams(window.location.search);
  AuthorID = urlParams.get("authorID");
  if (AuthorID) {
    toggleLoader(true);
    axios
      .get(`https://tarmeezacademy.com/api/v1/users/${AuthorID}`)
      .then((author) => {
        User = author.data.data;
        PostNumber = User.posts_count;
        CommentNumber = User.comments_count;
        fillProfilInfo(User, PostNumber, CommentNumber);
        getPosts(User);
      })
      .catch((error) => {
        ShowAlert(error.response.data.message, "danger");
        setTimeout(() => {
          const alertToHide =
            bootstrap.Alert.getOrCreateInstance("#alertLogin");
          alertToHide.close();
        }, 8000);
      })
      .then(toggleLoader(false));
  } else {
    User = JSON.parse(localStorage.getItem("user"));
    PostNumber = User.posts_count;
    CommentNumber = User.comments_count;
    fillProfilInfo(User, PostNumber, CommentNumber);
    getPosts(User);
  }
}
//* =========== fillPage =============//

//* =========== fillProfilInfo =============//
function fillProfilInfo(User, PostNb, CommentNb) {
  document.getElementById("Name").innerHTML = User.name;
  document.getElementById("UserName").innerHTML = User.username;
  document.getElementById("img_profile").src = User.profile_image;
  document.getElementById("StatPostNbr").innerHTML = PostNb;
  document.getElementById("StatCommentNbr").innerHTML = CommentNb;
}
//* =========== fillProfilInfo =============//

//* =========== PostClicked =============//
function PostClicked(PostId) {
  window.location = `postDetails.html?postId=${PostId}`;
}
//* =========== PostClicked =============//

let url = `https://tarmeezacademy.com/api/v1/posts`;
fillPage();
