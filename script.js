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

  // Hardcoded GitHub projects
  const githubProjects = [
    {
      name: 'omani-therapist',
      description: 'A multimodal AI therapist using Google ADK & LangChain.',
      html_url: 'https://github.com/anu-007/omani-therapist'
    },
    {
      name: 'food_order',
      description: 'A food ordering application.',
      html_url: 'https://github.com/anu-007/food_order'
    },
    {
      name: 'itinerary_ai_agent',
      description: 'An AI agent for creating itineraries.',
      html_url: 'https://github.com/anu-007/itinerary_ai_agent'
    }
  ];
  const projectsContainer = document.getElementById('projects-container');
  githubProjects.forEach(repoDetails => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.innerHTML = `
      <h3>${repoDetails.name}</h3>
      <p>${repoDetails.description || 'No description available.'}</p>
      <a href="${repoDetails.html_url}" target="_blank">View on GitHub</a>
    `;
    projectsContainer.appendChild(projectCard);
  });

  // Hardcoded Hugging Face models
  const hfData = [
    {
      "id": "anubhutiv1/llama_kanye_best",
      "modelId": "anubhutiv1/llama_kanye_best"
    }
  ];
  const hfContainer = document.getElementById('huggingface-models-container');
  if (hfData) {
    hfData.forEach(model => {
      const modelCard = document.createElement('div');
      modelCard.classList.add('project-card');
      modelCard.innerHTML = `
        <h3>${model.modelId}</h3>
        <a href="https://huggingface.co/${model.modelId}" target="_blank">View on Hugging Face</a>
      `;
      hfContainer.appendChild(modelCard);
    });
  }

  // Hardcoded Medium blog posts
  const mediumPosts = [
    {
      title: 'Building a Multimodal AI Therapist with Google ADK & LangChain',
      link: 'https://medium.com/@anubhutiverma/building-a-multimodal-ai-therapist-with-google-adk-langchain-c8e853a2bbfe?source=rss-773f3177b0e9------2',
      pubDate: '2025-07-28 15:51:21'
    },
    {
      title: 'Let’s talk javascript : Part 2 (Objects and prototypes)',
      link: 'https://medium.com/@anubhutiverma/lets-talk-javascript-part-2-objects-and-prototypes-8709f4d07adf?source=rss-773f3177b0e9------2',
      pubDate: '2025-01-16 10:15:39'
    },
    {
      title: 'Wait there’s more: ES6',
      link: 'https://medium.com/@anubhutiverma/wait-theres-more-es6-7e44c45fe5a2?source=rss-773f3177b0e9------2',
      pubDate: '2025-01-15 16:09:18'
    },
    {
      title: 'Let’s talk javascript : Part 1 (Overview)',
      link: 'https://medium.com/@anubhutiverma/lets-talk-javascript-part-1-overview-18e1aa80ca74?source=rss-773f3177b0e9------2',
      pubDate: '2018-04-14 15:03:07'
    },
    {
      title: 'JavaScript Design Patterns : Part 1',
      link: 'https://medium.com/beginners-guide-to-mobile-web-development/wtf-is-js-design-patterns-part-1-3718c0b8b009?source=rss-773f3177b0e9------2',
      pubDate: '2018-04-14 06:19:17'
    }
  ];
  const blogContainer = document.getElementById('blog-container');
  mediumPosts.forEach(post => {
    const blogPost = document.createElement('div');
    blogPost.classList.add('blog-post');
    blogPost.innerHTML = `
      <h3>${post.title}</h3>
      <p>${new Date(post.pubDate).toLocaleDateString()}</p>
      <a href="${post.link}" target="_blank">Read More</a>
    `;
    blogContainer.appendChild(blogPost);
  });
});
