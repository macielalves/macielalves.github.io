import { posts } from "./posts.js";

let slides = document.querySelector(".slides");

const genPost = (post = {}) => {
  return (
    `<article class="main-post main-post--not-active">
      <div class="main-post__image">
        <img src="${post.image}"
          alt="${post.alt}" />
      </div>
      <div class="main-post__content">
        <div class="main-post__tag-wrapper">
          <span class="main-post__tag">${post.tag}</span>
        </div>
        <h1 class="main-post__title">${post.title}</h1>
        <a class="main-post__link" href="${post.aHref}">
          <span class="main-post__link-text">${post.aText}</span>
        </a>
      </div>
    </article>`);
}

posts.forEach(post => {
  // Cria um range e um fragmento contextual
  let range = document.createRange();
  let fragmento = range.createContextualFragment(genPost(post));

  // O fragmento agora contém o nó HTML
  let meuNodeHTML = fragmento.firstChild;
  slides.appendChild(meuNodeHTML);
  if (slides.children.length === 1) {
    slides.children.item(0).classList.remove("main-post--not-active");
    slides.children.item(0).classList.add("main-post--active");
  }
  // console.log(genPost(post));
});

let mainPosts = document.querySelectorAll(".main-post");
let i = 0;
let postIndex = 0;
let currentMainPost = mainPosts[postIndex];

let progressInterval = setInterval(progress, 100); // 180

function progress() {
  if (i === 100) {
    i = -5;
    // reset progress bar
    try {
      document.querySelector(".progress-bar__fill").style.width = 0;
    } catch (error) {
      return;
    }

    postIndex++;

    currentMainPost.classList.add("main-post--not-active");
    currentMainPost.classList.remove("main-post--active");

    // reset postIndex to loop over the slides again
    if (postIndex === mainPosts.length) {
      postIndex = 0;
    }

    currentMainPost = mainPosts[postIndex];
  } else {
    i++;
    try {
      document.querySelector(".progress-bar__fill").style.width = `${i}%`;
    } catch (error) {
      return;
    }

    currentMainPost.classList.add("main-post--active");
    currentMainPost.classList.remove("main-post--not-active");
  }
}

console.log(`\x1b[3;90m
░▀█▀░█▀▀░█▀▄░█▀▀░█▀▀░▀█▀░█▀█░█▀█░░░█░█░▀█▀░█░█░▀█▀
░░█░░█▀▀░█▀▄░█▀▀░▀▀█░░█░░█░█░█▀█░░░█▄█░░█░░█▀▄░░█░
░░▀░░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀░▀░░░▀░▀░▀▀▀░▀░▀░▀▀▀
Desenvolvido para fins didáticos!
`);