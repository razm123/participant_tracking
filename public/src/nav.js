// let menu = document.querySelector("#menu-icon");
// let navbar = document.querySelector(".navbar");

// menu.addEventListener("click", () => {
//     menu.classList.toggle("bx-x");
//     navbar.classList.toggle("open");
// });

let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
let mainNavIcon = document.querySelector("#menu-icon");

menu.addEventListener("click", () => {
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("open");
});

navbar.addEventListener("click", (event) => {
    // Stop the event propagation within the navbar element
    event.stopPropagation();
});

// Close navbar when clicking outside of it
document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target) && !mainNavIcon.contains(event.target)) {
        menu.classList.remove("bx-x");
        navbar.classList.remove("open");
    }
});

// Revert mainNav icon to bx-menu
document.addEventListener("click", (event) => {
    if (!mainNavIcon.contains(event.target)) {
        menu.classList.remove("bx-x");
    }
});
