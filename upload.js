var user = localStorage.getItem("mb_user") || sessionStorage.getItem("mb_user");
document.getElementById("userName").innerText = user;

var fileInput = document.getElementById("fileInput");
var dropZone = document.getElementById("dropZone");
var progressList = document.getElementById("progressList");
var gallery = document.getElementById("gallery");
var emptyState = document.getElementById("emptyState");
var countBadge = document.getElementById("countBadge");
var viewer = document.getElementById("viewer");
var viewerContent = document.getElementById("viewerContent");
var viewerCaption = document.getElementById("viewerCaption");
var searchInput = document.getElementById("searchInput");

var maxSize = 50 * 1024 * 1024; // 50MB
var files = [];
var filter = "all";
var keyword = "";
var db;

// ໃຊ້ IndexedDB ແທນ localStorage ເພາະ localStorage ເກັບໄດ້ແຄ່ ~5MB ໃສ່ວິດີໂອບໍ່ພໍ
var request = indexedDB.open("mediabox", 1);

request.onupgradeneeded = function (e) {
  var store = e.target.result.createObjectStore("files", { keyPath: "id" });
  store.createIndex("owner", "owner");
};

request.onsuccess = function (e) {
  db = e.target.result;
  loadFiles();
};

request.onerror = function () {
  alert("ເປີດບ່ອນເກັບຂໍ້ມູນບໍ່ໄດ້");
};

function loadFiles() {
  var tx = db.transaction("files", "readonly");
  var req = tx.objectStore("files").index("owner").getAll(user);

  req.onsuccess = function () {
    files = req.result;
    files.sort(function (a, b) {
      return b.date - a.date;
    });
    showFiles();
  };
}

// ---------- upload ----------

fileInput.onchange = function () {
  for (var i = 0; i < fileInput.files.length; i++) {
    uploadFile(fileInput.files[i]);
  }
  fileInput.value = "";
};

dropZone.ondragover = function (e) {
  e.preventDefault();
  dropZone.classList.add("dragover");
};

dropZone.ondragleave = function () {
  dropZone.classList.remove("dragover");
};

dropZone.ondrop = function (e) {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  for (var i = 0; i < e.dataTransfer.files.length; i++) {
    uploadFile(e.dataTransfer.files[i]);
  }
};

function uploadFile(file) {
  var type = "";
  if (file.type.indexOf("image/") == 0) type = "image";
  if (file.type.indexOf("video/") == 0) type = "video";
  if (file.type.indexOf("audio/") == 0) type = "audio";

  var li = document.createElement("li");
  li.className = "progress-item";
  li.innerHTML =
    '<div class="row"><span class="name"></span><span class="status">0%</span></div>' +
    '<div class="progress-bar"><span></span></div>';
  li.querySelector(".name").innerText = file.name;
  progressList.prepend(li);

  var status = li.querySelector(".status");
  var bar = li.querySelector(".progress-bar span");

  if (type == "") {
    uploadFailed(li, "ບໍ່ແມ່ນຮູບ, ວິດີໂອ ຫຼື ສຽງ");
    return;
  }
  if (file.size > maxSize) {
    uploadFailed(li, "ໄຟລ໌ໃຫຍ່ເກີນ 50MB");
    return;
  }

  var reader = new FileReader();

  reader.onprogress = function (e) {
    var percent = Math.round((e.loaded / e.total) * 100);
    bar.style.width = percent + "%";
    status.innerText = percent + "%";
  };

  reader.onerror = function () {
    uploadFailed(li, "ອ່ານໄຟລ໌ບໍ່ໄດ້");
  };

  reader.onload = function () {
    var item = {
      id: Date.now() + "_" + Math.floor(Math.random() * 10000),
      owner: user,
      name: file.name,
      type: type,
      size: file.size,
      date: Date.now(),
      blob: new Blob([reader.result], { type: file.type })
    };

    var tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(item);

    tx.oncomplete = function () {
      files.unshift(item);
      showFiles();

      bar.style.width = "100%";
      status.innerHTML = "ສຳເລັດ " + icon("check");
      li.classList.add("done");
      setTimeout(function () {
        li.remove();
      }, 2000);

      showToast("ອັບໂຫລດ " + file.name + " ສຳເລັດ");
    };

    tx.onerror = function () {
      uploadFailed(li, "ບ່ອນເກັບຂໍ້ມູນເຕັມ");
    };
  };

  reader.readAsArrayBuffer(file);
}

function uploadFailed(li, msg) {
  li.classList.add("failed");
  li.querySelector(".status").innerText = msg;
  setTimeout(function () {
    li.remove();
  }, 5000);
}

// ---------- ສະແດງໄຟລ໌ ----------

function getUrl(item) {
  if (!item.url) {
    item.url = URL.createObjectURL(item.blob);
  }
  return item.url;
}

function showFiles() {
  gallery.innerHTML = "";
  countBadge.innerText = files.length;

  var count = 0;
  for (var i = 0; i < files.length; i++) {
    var matchType = filter == "all" || files[i].type == filter;
    // ຄົ້ນຫາຕາມຊື່ ບໍ່ສົນຕົວພິມໃຫຍ່-ນ້ອຍ
    var matchName = files[i].name.toLowerCase().indexOf(keyword) != -1;
    if (matchType && matchName) {
      gallery.appendChild(makeCard(files[i]));
      count++;
    }
  }

  if (count == 0) {
    emptyState.hidden = false;
    if (files.length == 0) {
      emptyState.innerText = "ຍັງບໍ່ມີໄຟລ໌ — ລອງອັບໂຫລດຮູບ, ວິດີໂອ ຫຼື ສຽງເບິ່ງ";
    } else {
      emptyState.innerText = "ບໍ່ພົບໄຟລ໌ທີ່ຄົ້ນຫາ";
    }
  } else {
    emptyState.hidden = true;
  }
}

function makeCard(item) {
  var card = document.createElement("div");
  card.className = "card";

  var media = "";
  if (item.type == "image") {
    media = '<img src="' + getUrl(item) + '">' + '<span class="type-tag">ຮູບ</span>';
  } else if (item.type == "audio") {
    media =
      '<div class="audio-icon">' + icon("music") + "</div>" +
      '<audio src="' + getUrl(item) + '" controls preload="metadata"></audio>' +
      '<span class="type-tag">ສຽງ</span>';
  } else {
    // #t=0.1 ເພື່ອໃຫ້ມັນສະແດງເຟຣມທຳອິດເປັນຮູບໜ້າປົກ
    media =
      '<video src="' + getUrl(item) + '#t=0.1" muted preload="metadata"></video>' +
      '<div class="play-icon">' + icon("play") + "</div>" +
      '<span class="type-tag">ວິດີໂອ</span>';
  }

  card.innerHTML =
    '<div class="card-media">' + media + "</div>" +
    '<div class="card-body">' +
    '  <div class="card-info">' +
    '    <div class="card-name"></div>' +
    '    <div class="card-meta">' + formatSize(item.size) + " · " + formatDate(item.date) + "</div>" +
    "  </div>" +
    '  <a class="icon-btn" title="ດາວໂຫລດ">' + icon("download") + "</a>" +
    '  <button class="icon-btn delete" title="ລຶບ">' + icon("trash") + "</button>" +
    "</div>";

  card.querySelector(".card-name").innerText = item.name;
  card.querySelector(".card-name").title = item.name;

  var download = card.querySelector("a");
  download.href = getUrl(item);
  download.download = item.name;

  card.querySelector(".card-media").onclick = function () {
    openViewer(item);
  };

  card.querySelector(".delete").onclick = function () {
    deleteFile(item);
  };

  // ກົດປຸ່ມ play ຂອງສຽງ ບໍ່ໃຫ້ເປີດ popup
  var audio = card.querySelector("audio");
  if (audio) {
    audio.onclick = function (e) {
      e.stopPropagation();
    };
  }

  return card;
}

function deleteFile(item) {
  if (!confirm("ລຶບ " + item.name + " ແທ້ບໍ?")) return;

  var tx = db.transaction("files", "readwrite");
  tx.objectStore("files").delete(item.id);

  tx.oncomplete = function () {
    files = files.filter(function (f) {
      return f.id != item.id;
    });
    URL.revokeObjectURL(item.url);
    showFiles();
    showToast("ລຶບແລ້ວ");
  };
}

// ---------- ປຸ່ມກອງ ທັງໝົດ/ຮູບ/ວິດີໂອ ----------

var filterButtons = document.querySelectorAll(".filter");
for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].onclick = function () {
    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
    }
    this.classList.add("active");
    filter = this.getAttribute("data-filter");
    showFiles();
  };
}

// ---------- ຄົ້ນຫາໄຟລ໌ ----------

searchInput.oninput = function () {
  keyword = searchInput.value.trim().toLowerCase();
  showFiles();
};

// ---------- ເບິ່ງໄຟລ໌ໃຫຍ່ ----------

function openViewer(item) {
  if (item.type == "image") {
    viewerContent.innerHTML = '<img src="' + getUrl(item) + '">';
  } else if (item.type == "audio") {
    viewerContent.innerHTML = '<audio src="' + getUrl(item) + '" controls autoplay></audio>';
  } else {
    viewerContent.innerHTML = '<video src="' + getUrl(item) + '" controls autoplay></video>';
  }
  viewerCaption.innerText = item.name + " · " + formatSize(item.size);
  viewer.hidden = false;
}

function closeViewer() {
  viewer.hidden = true;
  viewerContent.innerHTML = ""; // ລຶບອອກ ວິດີໂອຈະໄດ້ຢຸດ
}

document.getElementById("viewerClose").onclick = closeViewer;

viewer.onclick = function (e) {
  if (e.target == viewer) closeViewer();
};

document.onkeydown = function (e) {
  if (e.key == "Escape") closeViewer();
};

// ---------- logout ----------

document.getElementById("logoutBtn").onclick = function () {
  localStorage.removeItem("mb_user");
  sessionStorage.removeItem("mb_user");
  window.location.href = "index.html";
};

// ---------- ອື່ນໆ ----------

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB";
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}

function formatDate(time) {
  var d = new Date(time);
  var day = ("0" + d.getDate()).slice(-2);
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var hour = ("0" + d.getHours()).slice(-2);
  var min = ("0" + d.getMinutes()).slice(-2);
  return day + "/" + month + "/" + d.getFullYear() + " " + hour + ":" + min;
}

var toastTimer;
function showToast(msg) {
  var toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}
