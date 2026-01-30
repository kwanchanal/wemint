const navPills = document.querySelectorAll(".nav-pill");

navPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    navPills.forEach((item) => item.classList.remove("is-active"));
    pill.classList.add("is-active");
  });
});
