// ໂຫລດໄວ້ໃນ <head> ເພື່ອຕັ້ງທີມກ່ອນໜ້າເວັບສະແດງ ຈະໄດ້ບໍ່ກະພິບ
// ຖ້າຍັງບໍ່ເຄີຍເລືອກ ຈະໃຊ້ທີມຕາມການຕັ້ງຄ່າຂອງເຄື່ອງ
var savedTheme = null;
try {
  savedTheme = localStorage.getItem("mb_theme");
} catch (e) {}

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function currentTheme() {
  var theme = document.documentElement.getAttribute("data-theme");
  if (theme) return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeButton(btn) {
  if (currentTheme() == "dark") {
    btn.innerHTML = icon("sun");
    btn.title = "ປ່ຽນເປັນໂໝດແຈ້ງ";
  } else {
    btn.innerHTML = icon("moon");
    btn.title = "ປ່ຽນເປັນໂໝດມືດ";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("themeToggle");
  if (!btn) return;
  updateThemeButton(btn);

  btn.onclick = function () {
    var next = currentTheme() == "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("mb_theme", next);
    } catch (e) {}
    updateThemeButton(btn);
  };
});
