const blogForm = document.getElementById('blog-form');
const blogList = document.getElementById('blog-list');
const blogListContainer = document.getElementById('blog-list-container');
const blogCountSpan = document.getElementById('blog-count');
const divider = document.getElementById('divider');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');
const previewImg = document.getElementById('preview-img');
const submitButton = document.getElementById('submit-button');
const formHeading = document.getElementById('form-heading');

let blogs = JSON.parse(localStorage.getItem('blogs')) || [];
let editingId = null;

// Cleanup Blob URLs
window.addEventListener('beforeunload', () => {
  blogs.forEach(blog => {
    if (blog.image && blog.image.startsWith('blob:')) {
      URL.revokeObjectURL(blog.image);
    }
  });
});

// Preview uploaded image
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    previewImg.src = imageUrl;
    imagePreview.classList.remove('hidden');
  } else {
    imagePreview.classList.add('hidden');
  }
});

const renderBlogs = () => {
  blogList.innerHTML = '';
  if (blogs.length === 0) {
    blogListContainer.classList.add('hidden');
    divider.classList.add('hidden');
    return;
  }

  blogListContainer.classList.remove('hidden');
  divider.classList.remove('hidden');
  blogCountSpan.textContent = blogs.length;

  blogs.forEach(blog => {
    const blogCard = document.createElement('div');
    blogCard.className = 'bg-gray-700 p-6 rounded-2xl shadow-md space-y-3 transition-transform duration-300 transform hover:scale-105';
    
    const tagsHtml = blog.tags.map(tag => `<span class="bg-blue-900 px-3 py-1 rounded-full">${tag}</span>`).join('');

    blogCard.innerHTML = `
      ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="w-full h-48 object-cover rounded-xl mb-4">` : ''}
      <h3 class="text-xl font-semibold text-blue-200">${blog.title}</h3>
      <p class="text-sm text-gray-400 italic">Posted on ${blog.date}</p>
      <p class="text-gray-300 text-sm line-clamp-3">${blog.content}</p>
      <div class="flex flex-wrap gap-2 text-xs text-blue-300 pt-2">${tagsHtml}</div>
      <div class="flex justify-end space-x-2 mt-4">
        <button class="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors transform hover:scale-110 edit-btn" data-id="${blog.id}" aria-label="Edit">
          ✏️
        </button>
        <button class="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors transform hover:scale-110 delete-btn" data-id="${blog.id}" aria-label="Delete">
          🗑️
        </button>
      </div>
    `;
    blogList.appendChild(blogCard);
  });
};

const saveBlogs = () => {
  localStorage.setItem('blogs', JSON.stringify(blogs));
};

const addOrUpdateBlog = (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());
  const image = previewImg.src !== '' && !imagePreview.classList.contains('hidden') ? previewImg.src : '';

  if (editingId !== null) {
    blogs = blogs.map(blog => 
      blog.id === editingId 
        ? { ...blog, title, content, tags, image } 
        : blog
    );
    editingId = null;
    submitButton.textContent = 'Publish Blog Post';
    formHeading.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
           viewBox="0 0 24 24" fill="none" stroke="currentColor" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
           class="feather feather-plus-square text-blue-400 mr-3 w-8 h-8">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      Create New Blog Post
    `;
  } else {
    const newBlogEntry = {
      id: Date.now(),
      title,
      content,
      tags,
      image,
      date: new Date().toISOString().slice(0, 10),
    };
    blogs.push(newBlogEntry);
  }
  
  blogForm.reset();
  imagePreview.classList.add('hidden');
  saveBlogs();
  renderBlogs();
};

const startEditing = (id) => {
  const blogToEdit = blogs.find(blog => blog.id == id);
  if (blogToEdit) {
    editingId = id;
    document.getElementById('title').value = blogToEdit.title;
    document.getElementById('content').value = blogToEdit.content;
    document.getElementById('tags').value = blogToEdit.tags.join(', ');
    
    if (blogToEdit.image) {
      previewImg.src = blogToEdit.image;
      imagePreview.classList.remove('hidden');
    } else {
      imagePreview.classList.add('hidden');
    }

    submitButton.textContent = 'Save Changes';
    formHeading.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
           viewBox="0 0 24 24" fill="none" stroke="currentColor" 
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
           class="feather feather-edit text-blue-400 mr-3 w-8 h-8">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Edit Blog Post
    `;
  }
};

const deleteBlog = (id) => {
  blogs = blogs.filter(blog => blog.id != id);
  saveBlogs();
  renderBlogs();
};

blogForm.addEventListener('submit', addOrUpdateBlog);
blogList.addEventListener('click', (e) => {
  if (e.target.closest('.edit-btn')) {
    startEditing(e.target.closest('.edit-btn').dataset.id);
  }
  if (e.target.closest('.delete-btn')) {
    deleteBlog(e.target.closest('.delete-btn').dataset.id);
  }
});

renderBlogs();
