const validUsers = [
    { username: "admin", password: "123" },
    { username: "lee", password: "lee" }, // new user
    { username: "user1", password: "passuser1" },
    { username: "somphanit", password: "mypassword" }
];

// ຖ້າ login ຄ້າງໄວ້ແລ້ວ ໃຫ້ໄປໜ້າ upload ເລີຍ
if (localStorage.getItem("mb_user") || sessionStorage.getItem("mb_user")) {
  window.location.href = "upload.html";
}

var form = document.getElementById("loginForm");
var txtUser = document.getElementById("username");
var txtPass = document.getElementById("password");
var chkRemember = document.getElementById("remember");
var errorMsg = document.getElementById("errorMsg");
var btnShow = document.getElementById("togglePassword");

btnShow.onclick = function () {
  if (txtPass.type == "password") {
    txtPass.type = "text";
    btnShow.innerText = "ເຊື່ອງ";
  } else {
    txtPass.type = "password";
    btnShow.innerText = "ສະແດງ";
  }
};

txtUser.oninput = clearError;
txtPass.oninput = clearError;

form.onsubmit = function (e) {
  e.preventDefault();

  var username = txtUser.value.trim();
  var password = txtPass.value;

  if (username == "" || password == "") {
    showError("ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ");
    return;
  }

  // ຫາໃນລາຍຊື່ ວ່າມີ username ກັບ password ນີ້ບໍ່
  var found = false;
  for (var i = 0; i < validUsers.length; i++) {
    if (validUsers[i].username == username && validUsers[i].password == password) {
      found = true;
      break;
    }
  }

  if (!found) {
    showError("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
    return;
  }

  // ຕິກ "ຈື່ຂ້ອຍໄວ້" = ເກັບໄວ້ຖາວອນ, ບໍ່ຕິກ = ປິດແຖບແລ້ວຫາຍ
  if (chkRemember.checked) {
    localStorage.setItem("mb_user", username);
  } else {
    sessionStorage.setItem("mb_user", username);
  }

  window.location.href = "upload.html";
};

function showError(msg) {
  errorMsg.innerText = msg;
  txtUser.classList.add("invalid");
  txtPass.classList.add("invalid");

  form.classList.remove("shake");
  setTimeout(function () {
    form.classList.add("shake");
  }, 10);
}

function clearError() {
  errorMsg.innerText = "";
  txtUser.classList.remove("invalid");
  txtPass.classList.remove("invalid");
}
