// const toggleBtn = document.getElementById("toggle-btn");
// const theme = document.getElementById("theme");
let darkMode = localStorage.getItem("dark-mode");

const enableDarkMode = () => {
    const body = document.body;
    body.classList.add("dark-mode");
//   toggleBtn.classList.remove("dark-mode-toggle");
  localStorage.setItem("dark-mode", "enabled");
};

const disableDarkMode = () => {
    const body = document.body;
    body.classList.remove("dark-mode");
//   toggleBtn.classList.add("dark-mode-toggle");
  localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
  enableDarkMode(); // set state of darkMode on page load
}

async function darkLight(){
    const body = document.body;
    darkMode = localStorage.getItem("dark-mode"); // update darkMode when clicked
    if (darkMode === "disabled") {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
}

function exitModal(){
  const modal = document.getElementById("exampleModalLabel");
   modal.classList.remove("show");
   modal.classList.remove("d-block");
}