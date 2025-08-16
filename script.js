document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Fetch and display specific GitHub projects
  const specificRepos = ['omani-therapist', 'food_order', 'itinerary_ai_agent'];
  const projectsContainer = document.getElementById('projects-container');
  specificRepos.forEach(repoName => {
    fetch(`https://api.github.com/repos/anu-007/${repoName}`)
      .then(response => response.json())
      .then(repoDetails => {
        if (repoDetails.name) {
          const projectCard = document.createElement('div');
          projectCard.classList.add('project-card');
          projectCard.innerHTML = `
            <h3>${repoDetails.name}</h3>
            <p>${repoDetails.description || 'No description available.'}</p>
            <a href="${repoDetails.html_url}" target="_blank">View on GitHub</a>
          `;
          projectsContainer.appendChild(projectCard);
        }
      }).catch(error => console.error('Error fetching GitHub projects:', error));
  });

  // Fetch and display Hugging Face models
  fetch('https://huggingface.co/api/models?author=anubhutiv1')
    .then(response => response.json())
    .then(data => {
      const hfContainer = document.getElementById('huggingface-models-container');
      if (data) {
        data.forEach(model => {
          const modelCard = document.createElement('div');
          modelCard.classList.add('project-card');
          modelCard.innerHTML = `
            <h3>${model.modelId}</h3>
            <a href="https://huggingface.co/${model.modelId}" target="_blank">View on Hugging Face</a>
          `;
          hfContainer.appendChild(modelCard);
        });
      }
    })
    .catch(error => console.error('Error fetching Hugging Face models:', error));

  // Fetch and display Medium blog posts
  // Note: This is a simplified example. A more robust solution might require a backend or a service like RSS2JSON.
  const mediumUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@anubhutiverma';
  fetch(mediumUrl)
    .then(response => response.json())
    .then(data => {
      const blogContainer = document.getElementById('blog-container');
      if (data.items) {
        data.items.forEach(post => {
          const blogPost = document.createElement('div');
          blogPost.classList.add('blog-post');
          blogPost.innerHTML = `
            <h3>${post.title}</h3>
            <p>${new Date(post.pubDate).toLocaleDateString()}</p>
            <a href="${post.link}" target="_blank">Read More</a>
          `;
          blogContainer.appendChild(blogPost);
        });
      }
    })
    .catch(error => console.error('Error fetching Medium posts:', error));
});
