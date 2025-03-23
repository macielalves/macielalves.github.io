const btnToTop = () => {
  return (
    `<div id="to-top">
    <svg className="w-[15px] h-[15px] text-gray-800 dark:text-white" aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 10">
      <path d="M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z" />
    </svg>
  </div>`
  );
};



let navBarTop = document.querySelector(".navbar-top");
let tab_links = navBarTop.querySelectorAll("a");
// console.log("tab Links:", tab_links);
// console.log(parent.navigator.platform);
// console.log("CurentPath:", parent.location.pathname);
tab_links.forEach(tab => {
  if (parent.location.pathname.includes(tab.attributes.href.value.replace("../", ""))) {
    tab.classList.add("tab__current");
  }
})

const btnMenu = (p) => {
  p.classList.toggle("change");
  document.querySelector(".navbar-top").classList.toggle("hide-on-mobile");
}

let range = document.createRange();
let fragmento = range.createContextualFragment(btnToTop());
document.body.querySelector("footer").appendChild(fragmento);

const to_top = document.getElementById("to-top");
to_top.addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo(0, 0);
})



window.addEventListener("scroll", (e) => {
  if (window.scrollY > 10) {
    to_top.style.display = "grid";
  } else {
    to_top.style.display = "none";
  }
});

// delete window;