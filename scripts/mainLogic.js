function ShowAlert(message, type = "success") {
  const content = `
        <div id="alertLogin" class="alert alert-${type} alert-dismissible fade show" role="alert" >
            ${message}.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
  document.getElementById("alertLoginDiv").innerHTML = content;
}

function LoginBtnClicked() {
  const BaseURL = "https://tarmeezacademy.com/api/v1";
  const url = BaseURL + "/login";
  const Username = document.getElementById("username").value;
  const Password = document.getElementById("password").value;
  const Param = {
    username: Username,
    password: Password,
  };

  toggleLoader(true);
  axios
    .post(url, Param)
    .then((element) => {
      localStorage.setItem("token", element.data.token);
      localStorage.setItem("user", JSON.stringify(element.data.user));
      //Close login Modal
      const ModalLogin = document.getElementById("LoginModal");
      const modalInstance = bootstrap.Modal.getInstance(ModalLogin);
      modalInstance.hide();
      setupUI();
      ShowAlert("Logged in Successfully!");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 3000);

      // //Refresh of localStroage
      // setTimeout(() => {
      //   window.location.reload();
      //   getPosts();
      // }, 300);
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, "danger");
      setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
        alertToHide.close();
      }, 8000);
    })
    .then(toggleLoader(false));

  const urlParams = new URLSearchParams(window.location.search);
  PostId = urlParams.get("postId");
  if (PostId !== null) {
    document.querySelector(".AddCommentDiv").classList.remove("d-none");
  }
}

function logoutBtnClicked() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  ShowAlert("Logged out Successfully!");
  setTimeout(() => {
    const alertToHide = bootstrap.Alert.getOrCreateInstance("#alertLogin");
    alertToHide.close();
  }, 3000);

  //Refresh of localStroage
  setTimeout(() => {
    window.location = "index.html";
    window.location.reload();
    getPosts();
  }, 300);
}

function RegisterBtnClicked() {
  const BaseURL = "https://tarmeezacademy.com/api/v1";
  const url = BaseURL + "/register";

  const Name = document.getElementById("RegisterName").value;
  const Username = document.getElementById("RegisterUsername").value;
  const Password = document.getElementById("RegisterPassword").value;
  const Image = document.getElementById("ProfileImg_Input").files[0];

  // console.log(Image)
  const formData = new FormData();
  formData.append("username", Username);
  formData.append("password", Password);
  formData.append("name", Name);
  formData.append("image", Image);

  toggleLoader(true);
  axios
    .post(url, formData)
    .then((element) => {
      localStorage.setItem("token", element.data.token);
      localStorage.setItem("user", JSON.stringify(element.data.user));
      //Close login Modal
      const RegisterModal = document.getElementById("RegisterModal");
      const modalInstance = bootstrap.Modal.getInstance(RegisterModal);
      modalInstance.hide();
      setupUI();
      ShowAlert("Register Successfully!");
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

function setupUI() {
  const token = localStorage.getItem("token");
  const AddPost = document.querySelector(".AddPostButton");

  if (token != null) {
    if (AddPost !== null) {
      AddPost.classList.remove("d-none");
    }
    document.querySelector(".btnLogin").classList.add("d-none");
    document.querySelector(".btnLogout").classList.remove("d-none");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user.username;
    document.getElementById("Username_Navbar").innerHTML = "@" + username;
    document.getElementById("ProfileImg_Navbar").src = user.profile_image;
  } else {
    if (AddPost !== null) {
      AddPost.classList.add("d-none");
    }
    document.querySelector(".btnLogin").classList.remove("d-none");
    document.querySelector(".btnLogout").classList.add("d-none");
  }
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("Loader").style.visibility = "visible";
  } else {
    document.getElementById("Loader").style.visibility = "hidden";
  }
}
