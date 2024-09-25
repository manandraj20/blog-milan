// API URL
// amazon EC2 instance
const apiUrl = 'https://3.26.186.98:5000';
// const apiUrl = 'http://localhost:5000';

// Function to fetch and display blog posts
async function fetchBlogs() {
    try {
        const response = await fetch(`${apiUrl}/blogs`);
        const blogs = await response.json();
        const blogContainer = document.getElementById('blogs');

        blogContainer.innerHTML = ''; // Clear the container before displaying blogs

        blogs.forEach(blog => {
            // Create post preview container
            const postPreview = document.createElement('div');
            postPreview.classList.add('post-preview');

            // Create link to the blog post (for now just a placeholder)
            const postLink = document.createElement('a');
            postLink.href = `blog.html?id=${blog._id}`; 

            // Create blog title
            const title = document.createElement('h2');
            title.classList.add('post-title');
            title.innerText = blog.title;

            // Create blog subtitle (you can format this as needed or use another field)
            const subtitle = document.createElement('h3');
            subtitle.classList.add('post-subtitle');
            subtitle.innerText = blog.subtitle || ''; // Optional field

            // Append title and subtitle to the link
            postLink.appendChild(title);
            postLink.appendChild(subtitle);

            // Create post meta
            const postMeta = document.createElement('p');
            postMeta.classList.add('post-meta');
            postMeta.innerHTML = `
                Posted by <a href="#!">Milan Anand Raj</a> on ${new Date(blog.date).toLocaleDateString()}
            `;

            // Append link and post meta to the post preview
            postPreview.appendChild(postLink);
            postPreview.appendChild(postMeta);

            // Append post preview to the blog container
            blogContainer.appendChild(postPreview);

            // Create and append the divider
            const divider = document.createElement('hr');
            divider.classList.add('my-4');
            blogContainer.appendChild(divider);
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
}
// Call the function to fetch and display blogs when the page loads
document.addEventListener('DOMContentLoaded', fetchBlogs);

// Function to create a new blog post
async function createBlog() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert('Please fill in both fields');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            alert('Blog post created successfully');
            document.getElementById('blogForm').reset();
        } else {
            alert('Failed to create blog post');
        }
    } catch (error) {
        console.error('Error creating blog:', error);
    }
}

async function fetchBlogById(blogId) {
    try {
        const response = await fetch(`${apiUrl}/blogs/${blogId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blog = await response.json();

        // Update the HTML elements with the blog data
        document.querySelector('.post-heading h1').innerText = blog.title;
        document.querySelector('.post-heading h2').innerText = blog.subtitle || '';
        document.querySelector('.post-heading .meta').innerHTML = `Posted by <a href="#!">Milan Anand Raj</a> on ${new Date(blog.date).toLocaleDateString()}`;

        const blogContent = document.querySelector('.post-content');
        blogContent.innerHTML = ''; // Clear the container before appending new content

        // Assuming the blog content is HTML
        blogContent.innerHTML = blog.content;
    } catch (error) {
        console.error('Error fetching the blog by ID:', error);
    }
}

function loadBlog() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    if (blogId) {
        fetchBlogById(blogId);
    }
}

// Expose the function for external call
window.loadBlog = loadBlog;



// Navigation bar script
window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;

    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove('is-visible');
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
});
