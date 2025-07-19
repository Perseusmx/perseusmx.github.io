---
layout: default
title: Blog
---

<div class="blog-container">
  <div class="blog-header">
    <h1>Blog</h1>
    <div class="search-container">
      <input type="text" id="search-input" placeholder="Search posts..." class="search-input">
    </div>
  </div>
  
  <div class="category-filter">
    <button class="filter-btn active" data-category="all">All</button>
    <button class="filter-btn" data-category="general">General</button>
    <button class="filter-btn" data-category="tryhackme">TryHackMe</button>
    <button class="filter-btn" data-category="tools">Tools</button>
    <button class="filter-btn" data-category="learning">Learning</button>
  </div>
  
  <div class="tags-container">
    <div class="tags-filter">
      <span class="tags-label">Filter by tags:</span>
      <div class="tags-list" id="tags-list">
        <!-- The tags will be added here by JavaScript -->
      </div>
    </div>
  </div>
  
  <ul class="post-list" id="post-list">
          {% for post in site.posts %}
        <li class="post-item" data-category="{{ post.category }}" data-tags="{{ post.tags | join: ',' }}">
          <h2 class="post-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h2>
          <div class="post-meta">
            <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
            <span class="post-category">{{ post.category }}</span>
            <span class="reading-time">{{ post.content | strip_html | number_of_words | divided_by: 200.0 | ceil }} min read</span>
          </div>
          <div class="post-tags">
            {% for tag in post.tags %}
              <span class="tag">{{ tag }}</span>
            {% endfor %}
          </div>
          <p class="post-excerpt">{{ post.excerpt | default: post.content | strip_html | truncate: 120 }}</p>
        </li>
      {% endfor %}
  </ul>
</div>

<script>
// All the blog page functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const postItems = document.querySelectorAll('.post-item');
  const searchInput = document.getElementById('search-input');
  const tagsList = document.getElementById('tags-list');
  let currentCategory = 'all';
  let currentSearch = '';
  let currentTags = [];
  
  // Set up the tags
  initializeTags();
  
  // Handle the category filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Switch the active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Remember which category is selected
      currentCategory = this.getAttribute('data-category');
      
      // Update the post list
      applyFilters();
    });
  });
  
  // Handle the search box
  searchInput.addEventListener('input', function() {
    currentSearch = this.value.toLowerCase();
    applyFilters();
  });
  
  // Get all the tags from the posts
  function initializeTags() {
    const allTags = new Set();
    postItems.forEach(item => {
      const tags = item.getAttribute('data-tags').split(',').filter(tag => tag.trim());
      tags.forEach(tag => allTags.add(tag.trim()));
    });
    
    // Make buttons for each tag
    allTags.forEach(tag => {
      const tagBtn = document.createElement('button');
      tagBtn.className = 'tag-filter';
      tagBtn.textContent = tag;
      tagBtn.setAttribute('data-tag', tag);
      tagBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        updateActiveTags();
        applyFilters();
      });
      tagsList.appendChild(tagBtn);
    });
  }
  
  // Remember which tags are selected
  function updateActiveTags() {
    currentTags = Array.from(document.querySelectorAll('.tag-filter.active'))
      .map(btn => btn.getAttribute('data-tag'));
  }
  
  // Show/hide posts based on the filters
  function applyFilters() {
    postItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const tags = item.getAttribute('data-tags').split(',').map(tag => tag.trim());
      const title = item.querySelector('.post-title a').textContent.toLowerCase();
      const excerpt = item.querySelector('.post-excerpt').textContent.toLowerCase();
      
      const categoryMatch = currentCategory === 'all' || category === currentCategory;
      const searchMatch = currentSearch === '' || title.includes(currentSearch) || excerpt.includes(currentSearch);
      const tagMatch = currentTags.length === 0 || currentTags.some(tag => tags.includes(tag));
      
      if (categoryMatch && searchMatch && tagMatch) {
        item.style.display = 'block';
        item.classList.add('fade-in');
      } else {
        item.style.display = 'none';
        item.classList.remove('fade-in');
      }
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    const visiblePosts = Array.from(postItems).filter(item => item.style.display !== 'none');
    const currentIndex = visiblePosts.findIndex(item => item.classList.contains('focused'));
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      let nextIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < visiblePosts.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : visiblePosts.length - 1;
      }
      
      // Remove focus from current post
      visiblePosts.forEach(post => post.classList.remove('focused'));
      
      // Add focus to next post
      if (visiblePosts[nextIndex]) {
        visiblePosts[nextIndex].classList.add('focused');
        visiblePosts[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // Enter key to open focused post
    if (e.key === 'Enter') {
      const focusedPost = visiblePosts.find(post => post.classList.contains('focused'));
      if (focusedPost) {
        const link = focusedPost.querySelector('.post-title a');
        if (link) {
          window.location.href = link.href;
        }
      }
    }
  });
});
</script> 