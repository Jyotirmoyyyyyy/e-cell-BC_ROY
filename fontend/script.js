const API_BASE = 'https://your-backend.onrender.com/api/posts';


const blogForm = document.getElementById('blog-form');
const blogList = document.getElementById('blog-list');


async function loadPosts() {
const res = await fetch(API_BASE);
const posts = await res.json();
renderPosts(posts);
}


function renderPosts(posts) {
blogList.innerHTML = '';
posts.forEach(p => {
const div = document.createElement('div');
div.className = 'post-card';
div.innerHTML = `
${p.imageData ? `<img src="${p.imageData}" class="rounded-xl">` : ''}
<h2>${p.title}</h2>
<p>${p.content}</p>
<a href="post.html?id=${p._id}" target="_blank">Share</a>
`;
blogList.appendChild(div);
});
}


blogForm.addEventListener('submit', async (e) => {
e.preventDefault();
const formData = new FormData(blogForm);
await fetch(API_BASE, { method: 'POST', body: formData });
blogForm.reset();
loadPosts();
});


loadPosts();