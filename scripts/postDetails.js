//* ========= FillPost =========//
function FillPost() {
  let id, username, photoProfileURL, postTitle, postBody, postTime;
  let postImage, tagsContent, tag, NbrComments;
  let content = "",
    CommentContent = "";
  // const PostId = localStorage.getItem('PostId')

  const urlParams = new URLSearchParams(window.location.search);
  PostId = urlParams.get("postId");

  let url = `https://tarmeezacademy.com/api/v1/posts/${PostId}`;

  toggleLoader(true);
  axios
    .get(url)
    .then(function (response) {
      let element = response.data.data;
      username = element.author.username;
      photoProfileURL = element.author.profile_image;
      postTitle = element.title;
      postBody = element.body;
      postImage = element.image;
      postTime = element.created_at;
      NbrComments = element.comments_count;
      tagsContent = "";
      for (tag of element.tags) {
        tagsContent += `<span class="tag">${tag.name}</span>`;
      }
      if (typeof photoProfileURL == "object") {
        photoProfileURL = "./images/profile.png";
      }

      element.comments.forEach((comment) => {
        CommentContent += `
            <div class="Comment rounded p-2 mb-1">
                <img src=${comment.author.profile_image} class="rounded-circle" width="30px" height="30px">
                <b id="" class="fs-6">${comment.author.name}</b>
                <p>${comment.body}</p>
            </div>
            `;
      });
      // document.querySelector(".post").innerHTML = ""
      content += `
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
                    <hr>
                    <div class="Comments">
                        ${CommentContent}
                        <div class="AddCommentDiv w-100 d-flex my-2 ">
                            <input id="Comment_Input" type="text" class="form-control" placeholder="add your comment...">
                            <button type="button" class="btn btn-outline-primary" onclick="AddComment()" >send</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Post -->
        `;
      document.querySelector(".post").innerHTML = content;
      const token = localStorage.getItem("token");
      if (token == null) {
        document.querySelector(".AddCommentDiv").classList.add("d-none");
      }
      // bg-opacity-10 px-3 py-1 border ms-1
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
//* ========= FillPost =========//

//* ========= AddComment =========//
function AddComment() {
  let comment = document.getElementById("Comment_Input").value;
  if (comment == "") {
    return;
  }
  const BaseURL = "https://tarmeezacademy.com/api/v1";
  const url = BaseURL + `/posts/${PostId}/comments`;
  const token = localStorage.getItem("token");

  const Param = {
    body: comment,
  };

  toggleLoader(true);
  axios
    .post(url, Param, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((element) => {
      FillPost();
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
//* ========= AddComment =========//

let PostId;
setupUI();
